import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "./contexts/auth-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Eagle Bank",
	description:
		"Secure, smart, and seamless banking with Eagle Bank. Manage your finances with confidence.",
	openGraph: {
		title: "Eagle Bank",
		description: "Secure, smart, and seamless banking with Eagle Bank.",
		url: "https://eaglebank.example.com", // update
		siteName: "Eagle Bank",
		images: [
			{
				url: "/icon.png",
				width: 1024,
				height: 1024,
				alt: "Eagle Bank Logo",
			},
		],
		locale: "en_GB",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Eagle Bank",
		description: "Secure, smart, and seamless banking with Eagle Bank.",
		images: ["/icon.png"],
	},
	icons: {
		icon: "/icon.png",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<AuthProvider>
					{children}
					<Toaster />
				</AuthProvider>
			</body>
		</html>
	);
}
