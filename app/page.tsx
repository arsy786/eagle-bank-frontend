"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./contexts/auth-context";

export default function Home() {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && user) {
			router.push("/dashboard");
		}
	}, [user, loading, router]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen gradient-bg flex items-center justify-center px-4">
			<div className="max-w-4xl mx-auto text-center">
				<div className="mb-8">
					<div className="flex items-center justify-center mx-auto mb-2">
						<Image
							src="/icon.png"
							alt="Eagle Bank Logo"
							width={100}
							height={100}
						/>
					</div>
					<h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
						Eagle Bank
					</h1>
					<p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
						Experience the future of digital banking with secure, fast, and
						intuitive financial management tools.
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button
						asChild
						size="lg"
						className="bg-white text-blue-600 hover:bg-gray-100"
					>
						<Link href="/login">Sign In</Link>
					</Button>
					<Button
						asChild
						size="lg"
						variant="outline"
						className="border-white text-black hover:bg-gray-100 hover:text-blue-600"
					>
						<Link href="/register">Create Account</Link>
					</Button>
				</div>

				<div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
					<div className="text-center">
						<div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
							<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<h3 className="text-lg font-semibold mb-2">Secure & Safe</h3>
						<p className="text-blue-100">
							Bank-grade security with advanced encryption to protect your
							financial data.
						</p>
					</div>
					<div className="text-center">
						<div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
							<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<h3 className="text-lg font-semibold mb-2">24/7 Access</h3>
						<p className="text-blue-100">
							Manage your finances anytime, anywhere with our always-available
							platform.
						</p>
					</div>
					<div className="text-center">
						<div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
							<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
								<path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
							</svg>
						</div>
						<h3 className="text-lg font-semibold mb-2">Easy to Use</h3>
						<p className="text-blue-100">
							Intuitive interface designed for seamless banking experience.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
