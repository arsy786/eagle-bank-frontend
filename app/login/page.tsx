"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../contexts/auth-context";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		await login(email, password);
		setLoading(false);
	};

	return (
		<div className="min-h-screen gradient-bg flex items-center justify-center px-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<div className="flex items-center justify-center mx-auto mb-2">
						<Image
							src="/icon.png"
							alt="Eagle Bank Logo"
							width={100}
							height={100}
						/>
					</div>
					<h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
					<p className="text-blue-100">Sign in to your Eagle Bank account</p>
				</div>

				<Card className="shadow-2xl">
					<CardHeader>
						<CardTitle>Sign In</CardTitle>
						<CardDescription>
							Enter your credentials to access your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</Button>
								</div>
							</div>

							<Button
								type="submit"
								className="w-full bg-blue-500"
								disabled={loading}
							>
								{loading ? "Signing In..." : "Sign In"}
							</Button>
						</form>

						<div className="mt-6 text-center">
							<p className="text-sm text-gray-600">
								Don&apos;t have an account?{" "}
								<Link
									href="/register"
									className="text-blue-600 hover:underline font-medium"
								>
									Create one here
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
