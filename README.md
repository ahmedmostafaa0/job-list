# Job List Platform

A modern, full-stack job listing platform built with Next.js and Prisma, designed to connect job seekers with employers. Features a seamless job posting and discovery experience with integrated payment processing, real-time notifications, and advanced filtering.

## 🚀 Features

### For Employers

- **Create & Manage Job Postings** - Easy-to-use form builder with rich text editor for detailed job descriptions
- **Job Analytics** - Track application metrics and job performance
- **Payment Integration** - Flexible pricing for job listing durations via Stripe
- **Webhook Support** - Real-time webhook integrations for Stripe events
- **Onboarding Flow** - Simplified company setup process

### For Job Seekers

- **Advanced Job Search** - Filter by salary range, benefits, location, and more
- **Job Favorites** - Bookmark and track favorite job postings
- **Pagination** - Browse through job listings efficiently
- **Responsive Design** - Seamless experience on desktop and mobile devices
- **Onboarding Flow** - Quick profile setup process

### Platform Features

- **Authentication** - Secure user authentication with NextAuth.js
- **Dark/Light Theme** - Theme toggle with persistent user preferences
- **Role-Based Access** - Separate workflows for employers and job seekers
- **File Uploads** - Secure file handling with UploadThing
- **Email Notifications** - Automated emails via Resend
- **Rate Limiting** - Security-first approach with Arcjet protection
- **Task Scheduling** - Background job processing with Inngest

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework for production
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible component primitives
- **TipTap** - Rich text editor for job descriptions
- **React Hook Form** - Performant form validation

### Backend

- **Next.js API Routes** - Serverless functions
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Primary data store
- **Prisma Accelerate** - Caching layer for database queries

### Services & Integrations

- **NextAuth.js** - Authentication and authorization
- **Stripe** - Payment processing
- **Resend** - Transactional emails
- **UploadThing** - File upload handling
- **Inngest** - Workflow orchestration and background jobs
- **Arcjet** - Security and DDoS protection

### Development Tools

- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Shadcn/ui** - High-quality React components

## 📦 Project Structure

```
├── app/                      # Next.js app directory
│   ├── (mainLayout)/        # Main app layout group
│   ├── api/                 # API routes
│   │   ├── auth/            # NextAuth configuration
│   │   ├── inngest/         # Inngest webhooks
│   │   ├── uploadthing/     # File upload routes
│   │   └── webhook/         # Stripe webhooks
│   ├── login/               # Login page
│   ├── onboarding/          # User onboarding flow
│   └── payment/             # Payment success/cancel pages
├── components/              # React components
│   ├── forms/              # Form components
│   ├── general/            # General-purpose components
│   ├── richTextEditor/     # Rich text editing components
│   └── ui/                 # Shadcn UI components
├── lib/                     # Utility functions
│   ├── actions.ts          # Server actions
│   ├── auth.ts             # Auth configuration
│   ├── schemas.ts          # Zod validation schemas
│   ├── stripe.ts           # Stripe utilities
│   ├── uploadthing.ts      # Upload utilities
│   └── inngest/            # Background job functions
├── prisma/                  # Database schema and migrations
└── public/                  # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager
- PostgreSQL database
- Stripe account (for payment processing)
- Resend account (for emails)
- UploadThing account (for file uploads)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd job-list
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/job-list"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_GITHUB_ID="your-github-id"
   NEXTAUTH_GITHUB_SECRET="your-github-secret"

   # Stripe
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."

   # Resend
   RESEND_API_KEY="re_..."

   # UploadThing
   UPLOADTHING_TOKEN="your-token"

   # Inngest
   INNGEST_EVENT_KEY="your-event-key"
   INNGEST_SIGNING_KEY="your-signing-key"

   # Arcjet
   ARCJET_KEY="ajk_..."
   ```

4. **Set up the database**

   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## 🗄️ Database

This project uses Prisma ORM with PostgreSQL. Key models include:

- **User** - Platform users with roles (employer/job seeker)
- **Company** - Employer company information
- **JobPost** - Job listings created by employers
- **AppliedJobPost** - Applications from job seekers
- **Account** - OAuth account information

Run `npx prisma studio` to view and manage data in a visual interface.

## 🔐 Authentication

The platform uses NextAuth.js with GitHub OAuth. Users are directed to an onboarding flow to select their role (employer or job seeker) and complete profile setup.

## 💳 Payment Processing

Stripe integration handles job listing duration pricing. Users can purchase listings for different durations, with webhook events triggering corresponding database updates.

## 📧 Email Notifications

Transactional emails are sent via Resend for:

- Job application confirmations
- User onboarding
- Payment receipts

## 🔒 Security

- **Rate Limiting** - Arcjet protection against abuse
- **Input Validation** - Zod schemas for all user inputs
- **CSRF Protection** - Built-in NextAuth.js protection
- **Secure Authentication** - OAuth and session-based auth

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is proprietary and not available for public use.

## 🆘 Support

For issues or questions, please create an issue in the repository or contact the development team.

---

**Last Updated:** January 2026
