# Muhamad Irvan Sandy — Personal Portfolio

A personal portfolio website built to showcase my professional profile, technical skills, work experience, and projects. This project also serves as a space to continuously develop my skills in web development and software quality assurance.

## ✨ Features

- **Personal Profile** — Introduction and professional background.
- **About Me** — Overview of my experience and interests.
- **Technical Skills** — Showcase of technologies and tools.
- **Work Experience** — Professional experience and career history.
- **Projects** — Selected projects and development work.
- **Contact** — A way to connect with me professionally.
- **Authentication** — Secure access to protected dashboard pages.
- **Project Management** — Manage portfolio project data through the backend.
- **Responsive Design** — Optimized for desktop and mobile devices.

## 🛠️ Tech Stack

### Frontend
- [Next.js](https://nextjs.org/) — React framework with the App Router.
- [React](https://react.dev/) — UI library.
- [TypeScript](https://www.typescriptlang.org/) — Static typing.
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first styling.

### Backend & Database
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) — Backend API endpoints.
- [Prisma](https://www.prisma.io/) — ORM for database access.
- [PostgreSQL](https://www.postgresql.org/) — Relational database.
- [Neon](https://neon.tech/) — Serverless PostgreSQL hosting.
- [Upstash Redis](https://upstash.com/) — Session storage and caching.
- [Cloudinary](https://cloudinary.com/) — Image and media management.

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed or configured:

- [Node.js](https://nodejs.org/) — A version compatible with the project's dependencies.
- npm, yarn, pnpm, or bun.
- A PostgreSQL database.
- An Upstash Redis database.
- A Cloudinary account.

### 1. Clone the repository

```bash
git clone https://github.com/snc99/portofolio.git
cd portofolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and configure the required environment variables.

```env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_secure_random_secret"

UPSTASH_REDIS_REST_URL="your_upstash_redis_url"
UPSTASH_REDIS_REST_TOKEN="your_upstash_redis_token"

CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
```

**Important:** The variable names above are examples based on the project's integrations. Check the source code for the exact names required by your current configuration. If Prisma uses a separate direct connection URL, configure that as well.

Never commit your `.env` file or expose database credentials, API secrets, or JWT secrets in your repository.

### 4. Set up the database

Run the Prisma migrations:

```bash
npx prisma migrate deploy
```

For a local development database where migrations need to be created, use:

```bash
npx prisma migrate dev
```

Use the command appropriate for your environment. Make sure the configured database is correct before running migrations.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The application will automatically reload when you make changes to the source code.

## 📁 Project Structure

The project follows a modular structure to separate application routing, business logic, infrastructure, and reusable components.

```text
.
├── app/                  # Pages, layouts, and API route handlers
├── components/           # Reusable UI components
├── infrastructure/       # Database, cache, and security infrastructure
├── modules/              # Feature modules and business logic
├── shared/               # Shared utilities, types, and API helpers
├── prisma/               # Prisma schema and database migrations
├── public/               # Static assets
├── proxy.ts              # Request interception and route protection
├── .env                  # Local environment variables (not committed)
└── README.md
```

The directory structure above is a high-level overview. Actual folders may vary depending on the current implementation.

## 🔐 Authentication & Security

The application includes authentication and protected dashboard routes.

- JWT-based authentication.
- HTTP-only cookies for session tokens.
- Redis-backed session validation.
- Environment-based secret management.
- Protected dashboard access.

Keep all secrets on the server side and use HTTPS in production.

## 🧪 Development & Testing

Before committing changes, review the affected functionality and run the available project checks.

```bash
npm run lint
npm run build
```

These commands assume the corresponding scripts are configured in `package.json`.

## 🌐 Deployment

The application can be deployed to a platform that supports Next.js, such as [Vercel](https://vercel.com/).

Before deploying:

1. Configure all required environment variables in the hosting platform.
2. Set up the production PostgreSQL database.
3. Configure Upstash Redis and Cloudinary credentials.
4. Apply the appropriate Prisma migrations.
5. Run a production build and verify the authentication flow.
6. Test the portfolio pages, project data, and contact functionality.

Do not rely on your local `.env` file being available in the production environment. Configure production variables separately.

## 👨‍💻 About Me

I'm Muhamad Irvan Sandy, an Information Systems graduate with a background in Quality Assurance. I'm interested in software quality, web development, API testing, and building reliable applications.

This portfolio represents my ongoing learning journey, professional experience, and personal projects.

## 📬 Contact

Feel free to connect with me for professional opportunities, collaboration, or project discussions.

- **GitHub:** [@snc99](https://github.com/snc99)
- **Portfolio:** https://irvan-sandy.vercel.app/
- **LinkedIn:** https://linkedin.com/in/muhamad-irvan-sandy

---

Built with ❤️ using Next.js and TypeScript.
