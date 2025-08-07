# Eagle Bank - Digital Banking Platform

A modern, secure digital banking platform built with Next.js 13, TypeScript, and Tailwind CSS. Eagle Bank provides users with a comprehensive banking experience including account management, transaction tracking, and secure authentication.

## 🚀 Features

### Core Banking Features

- **Account Management**: View and manage multiple bank accounts
- **Transaction Tracking**: Monitor all financial transactions with detailed history
- **Secure Authentication**: Protected login and registration system
- **Dashboard**: Comprehensive overview of financial status
- **Profile Management**: User profile customization and settings

### Technical Features

- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Component Library**: Built with Radix UI primitives and custom components
- **Form Handling**: Advanced form validation with React Hook Form and Zod
- **Theme Support**: Dark/light mode with next-themes
- **Responsive Design**: Mobile-first approach with responsive layouts

## 🛠️ Tech Stack

### Frontend

- **Next.js 13** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm package manager

### Setup Instructions

1. Open your terminal or command prompt.

2. Clone the repository using Git:

   ```bash
   git clone https://github.com/arsy786/eagle-bank-frontend.git
   ```

3. Navigate to the cloned repository's root directory

   ```bash
   cd eagle-bank-frontend
   ```


2. Install dependencies

   ```bash
   npm install
   ```

3. Run the development server

   ```bash
   npm run dev
   ```

4. Open your browser
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
eagle-bank-frontend/
├── app/                    # Next.js 13 App Router
│   ├── accounts/          # Account management pages
│   ├── contexts/          # React contexts (auth, etc.)
│   ├── dashboard/         # Main dashboard
│   ├── login/            # Authentication pages
│   ├── profile/          # User profile pages
│   ├── register/         # Registration pages
│   ├── transactions/     # Transaction management
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   └── ui/              # UI components (buttons, forms, etc.)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
