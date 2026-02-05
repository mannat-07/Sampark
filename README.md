# 🏛️ Sampark - Public Grievance Management System

A modern, full-stack web application for citizens to report and track civic issues like potholes, waste management, water supply, and more. Built with React, TypeScript, Express, and PostgreSQL.

## ✨ Features

### For Citizens
- 🎫 **Submit Grievances**: Report civic issues with photos, location, and detailed descriptions
- 📍 **Location Tracking**: Auto-detect or manually select grievance locations
- 📷 **Image Upload**: Attach photos to grievances via Cloudinary integration
- 🔍 **Track Status**: Monitor your grievances with unique tracking IDs
- 💬 **AI Chatbot**: Get instant answers about grievance submission and tracking
- 📊 **Dashboard**: View all your submitted grievances and their current status

### For Administrators
- 📈 **Analytics Dashboard**: View statistics and insights on all grievances
- 👥 **User Management**: Manage registered users
- 📋 **Grievance Management**: Review, update, and resolve citizen grievances
- 🔄 **Status Updates**: Change grievance status with comments
- 🎯 **Priority Management**: Categorize grievances by priority (Low, Medium, High)

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui + Radix UI
- **3D Graphics**: Three.js with React Three Fiber
- **State Management**: TanStack Query
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod
- **Routing**: React Router DOM

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express 5
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Caching**: Redis (Upstash)
- **Authentication**: JWT + bcrypt
- **File Upload**: Express FileUpload + Cloudinary
- **AI**: Google Generative AI (Gemini)

### DevOps
- **Package Manager**: Bun
- **Testing**: Vitest
- **Containerization**: Docker
- **Linting**: ESLint


## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mannat-07/Sampark.git
cd sampark
```

### 2. Environment Setup

Create `.env` files in both root and backend directories.

#### Root `.env` (Frontend)
```env
VITE_API_URL=http://localhost:3000
```

#### Backend `.env`
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/sampark"

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Redis
REDIS_URL=your_redis_url
# Or for Upstash Redis:
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# Google AI
GEMINI_API_KEY=your_gemini_api_key

# Server
PORT=3000
NODE_ENV=development
```

### 3. Install Dependencies

```bash
# Install root dependencies
bun install

# Install backend dependencies
cd backend
bun install
cd ..
```

### 4. Database Setup

```bash
cd backend

# Generate Prisma Client
bunx prisma generate

# Run migrations
bunx prisma migrate dev

# (Optional) Seed database
bunx prisma db seed

cd ..
```

### 5. Run the Application

#### Development Mode

Open two terminal windows:

**Terminal 1 - Frontend:**
```bash
bun run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
bun run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

#### Production Build

```bash
# Build frontend
bun run build

# Start backend
cd backend
bun run start
```

## 📁 Project Structure

```
sampark/
├── backend/                 # Backend Express application
│   ├── app/api/            # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── grievance/     # Grievance management
│   │   ├── chatbot/       # AI chatbot endpoints
│   │   ├── admin/         # Admin operations
│   │   └── upload/        # File upload handling
│   ├── lib/               # Utility libraries
│   │   ├── auth.ts        # Auth middleware
│   │   ├── prisma.ts      # Prisma client
│   │   └── redis.ts       # Redis client
│   ├── prisma/            # Database schema & migrations
│   └── server.ts          # Express server entry point
├── src/                    # Frontend React application
│   ├── components/        # React components
│   │   ├── admin/        # Admin-specific components
│   │   └── ui/           # Reusable UI components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components
│   │   ├── admin/       # Admin pages
│   │   └── auth/        # Auth pages
│   └── App.tsx           # Main app component
└── public/                # Static assets
```

## 🎯 Key Features Explained

### Grievance Submission Flow
1. User fills out the grievance form with title, description, and category
2. Location is captured via geocoding or manual input
3. Images are uploaded to Cloudinary
4. Grievance is stored in PostgreSQL with a unique tracking ID
5. User receives tracking ID for future reference

### Status Tracking
- **Submitted**: Initial state when grievance is created
- **Under Review**: Admin has acknowledged the grievance
- **In Progress**: Work has begun on resolving the issue
- **Resolved**: Issue has been fixed
- **Rejected**: Grievance was invalid or duplicate

### Admin Workflow
1. View all grievances in the admin dashboard
2. Filter by status, category, or priority
3. Update grievance status with comments
4. View analytics and user statistics

## 🔒 Authentication

The application uses JWT-based authentication:
- Tokens are stored in HTTP-only cookies
- Passwords are hashed using bcrypt
- Protected routes require valid JWT tokens
- Role-based access control (USER/ADMIN)

## 📊 Database Schema

### Main Models
- **User**: Stores user credentials and profile
- **Grievance**: Main grievance data with location and images
- **GrievanceStatusHistory**: Tracks status changes over time

## 🤖 AI Chatbot

Powered by Google's Gemini AI, the chatbot can:
- Answer questions about the grievance process
- Help users understand how to track their issues
- Provide information about different grievance categories
- Guide users through the submission process

## 🧪 Testing

```bash
# Run tests
bun run test

# Run tests in watch mode
bun run test:watch
```

## 🐳 Docker Deployment

Build and run using Docker:

```bash
# Build image
docker build -t sampark .

# Run container
docker run -p 5173:5173 -p 3000:3000 sampark
```

## 📝 Available Scripts

### Frontend
- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run lint` - Run ESLint
- `bun run test` - Run tests

### Backend
- `bun run dev` - Start development server with hot reload
- `bun run start` - Start production server
- `bun run build` - Build frontend from backend

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact

For questions or support, please open an issue in the repository.

---

Built with ❤️ for better civic engagement

