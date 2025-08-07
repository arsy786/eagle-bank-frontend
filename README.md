# Eagle Bank - Digital Banking Platform

A modern, secure digital banking platform built with Next.js 13, TypeScript, and Tailwind CSS. Eagle Bank provides users with a comprehensive banking experience including account management, transaction tracking, and secure authentication.

> **Backend Repository**: The backend API for this application is available at [eagle-bank-backend](https://github.com/arsy786/eagle-bank-backend)


## Features

- **Account Management**: View and manage multiple bank accounts
- **Transaction Tracking**: Monitor all financial transactions with detailed history
- **Secure Authentication**: Protected login and registration system
- **Dashboard**: Comprehensive overview of financial status
- **Profile Management**: User profile customization and settings

## Getting Started

### Prerequisites

- Node.js 18+

### Setup Instructions

1. Open your terminal or command prompt.

2. Clone the repository using Git:

   ```bash
   git clone https://github.com/arsy786/eagle-bank-frontend.git
   ```

3. Navigate to the cloned repository's root directory:

   ```bash
   cd eagle-bank-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. The frontend should now be running on `http://localhost:3000`.

### Accessing the Application

After starting both the backend and frontend servers, you can access the web application by navigating to `http://localhost:3000` in your web browser. Ensure both servers are running concurrently to allow the frontend to communicate with the backend effectively.

> **Backend Repository**: The backend API for this application is available at [eagle-bank-backend](https://github.com/arsy786/eagle-bank-backend)

### API Base URL

The frontend is configured to send requests to `http://localhost:8080`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
eagle-bank-frontend/
├── app/                  # Next.js 13 App Router
│   ├── accounts/         # Accounts pages
│   ├── contexts/         # React contexts (auth, etc.)
│   ├── dashboard/        # Main dashboard
│   ├── login/            # Login page
│   ├── profile/          # Profile page
│   ├── register/         # Register page
│   ├── transactions/     # Transactions page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable components
│   ├── layout/           # Layout components
│   └── ui/               # UI components (buttons, forms, etc.)
├── hooks/                # Custom React hooks
├── lib/                  # API requests file, types, utility functions
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```
