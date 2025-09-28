✨ Features
shorts-ai automates content creation, from initial scripting to final, rendered video output, saving you hours of manual production time.

🎬 Content Ingestion: Accepts input from users.

🧠 AI Core: Leverages ChatGPT for intelligent content summarization and script generation.

🗣️ Professional Voiceovers: Integrates ElevenLabs for generating natural, high-quality Text-to-Speech audio.

💬 Automated Captions: Uses AssemblyAI to transcribe and generate accurate, stylized captions.

⚛️ Programmatic Video Editing: Renders videos entirely in the cloud using Remotion, allowing for complex, dynamic video graphics and layouts with React.

☁️ Serverless Processing: Utilizes AWS Lambda for efficient, scalable, and cost-effective handling of heavy video rendering and processing tasks.

🔒 Secure Authentication: Manages user sign-ups and sign-ins via Clerk.

🔗 Cloud Storage: Stores all source and rendered video assets securely on Amazon S3.

⚙️ Tech Stack & Architecture
This project is a modern, high-performance application built on a robust set of technologies, separating the front-end, back-end, and processing layers for maximum scalability.

Layer	Technology	Purpose
Frontend	Next.js (App Router), TypeScript, Tailwind CSS	Fast, responsive UI and design system.
Backend/API	Next.js API Routes, Prisma (ORM), TypeScript	Handles application logic, database access, and job queuing.
Database	Prisma (ORM), PostgreSQL/MySQL	Type-safe, high-performance database management.
Authentication	Clerk	Secure user management and authentication.
AI/ML	ChatGPT, Video Model (Inferred)	Scripting, summarization, and content intelligence.
Microservices	AWS Lambda	Serverless execution for heavy tasks like video generation.
Audio/Captions	ElevenLabs, AssemblyAI	Voiceover generation and accurate captioning.
Video Rendering	Remotion	Programmatic, React-based video production.
Storage	Amazon S3	Scalable, durable storage for all media assets.

https://github.com/user-attachments/assets/337a3c75-7297-45e1-b9c5-8bdefa905d4c

