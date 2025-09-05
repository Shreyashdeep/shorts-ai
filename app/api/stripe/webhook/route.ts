import { prisma } from "@/app/lib/db";
import Stripe from "stripe"

const stripe= new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil"
})

export async function POST(req: Request){
    const body = await req.text();
    const signature= req.headers.get('stripe-signature') as string;
    const  webhookSecret= process.env.STRIPE_WEBHOOK_SECRET!;
    if(!webhookSecret){
        return new Response("Webhook secret is missing or expired", {status: 400})
    }
    const event= stripe.webhooks.constructEvent(body, signature, webhookSecret)
    if(event.type === 'checkout.session.completed'){
        const session= event.data.object as Stripe.Checkout.Session;
        const userId= session.metadata?.userId
        const priceId= session.metadata?.priceId
        const creditMap: Record<string, number> = {
            'price_1S3fAqIIFu7VuDQAoetU0U6q':2,
            'price_1S3fAqIIFu7VuDQAffq4qTxs':50,
            'price_1S3fAqIIFu7VuDQA8bBfoXbV':100

        }
        const creditsToAdd= creditMap[priceId || ''] || 0;
        if (userId && creditsToAdd >0){
            await prisma.user.update({
                where: {
                    userId: userId
                },
                data: {
                    credits: {
                        increment: creditsToAdd
                    }
                }
            })
        }
    }
    return new Response("OK", {status: 200})
}