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
import { toast } from "sonner";
import { useAuth } from "../contexts/auth-context";

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
		phoneNumber: "",
		dateOfBirth: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const { register } = useAuth();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (formData.password !== formData.confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		setLoading(true);
		const { confirmPassword, ...registrationData } = formData;
		await register(registrationData);
		setLoading(false);
	};

	return (
		<div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-8">
			<div className="w-full max-w-lg">
				<div className="text-center mb-8">
					<div className="flex items-center justify-center mx-auto mb-2">
						<Image
							src="/icon.png"
							alt="Eagle Bank Logo"
							width={100}
							height={100}
						/>
					</div>
					<h1 className="text-3xl font-bold text-white mb-2">
						Join Eagle Bank
					</h1>
					<p className="text-blue-100">Create your account to get started</p>
				</div>

				<Card className="shadow-2xl">
					<CardHeader>
						<CardTitle>Create Account</CardTitle>
						<CardDescription>
							Fill in your information to create your Eagle Bank account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="firstName">First Name</Label>
									<Input
										id="firstName"
										name="firstName"
										placeholder="John"
										value={formData.firstName}
										onChange={handleChange}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="lastName">Last Name</Label>
									<Input
										id="lastName"
										name="lastName"
										placeholder="Doe"
										value={formData.lastName}
										onChange={handleChange}
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="john.doe@example.com"
									value={formData.email}
									onChange={handleChange}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="phoneNumber">Phone Number</Label>
								<Input
									id="phoneNumber"
									name="phoneNumber"
									type="tel"
									placeholder="+1 (555) 123-4567"
									value={formData.phoneNumber}
									onChange={handleChange}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="dateOfBirth">Date of Birth</Label>
								<Input
									id="dateOfBirth"
									name="dateOfBirth"
									type="date"
									value={formData.dateOfBirth}
									onChange={handleChange}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Input
										id="password"
										name="password"
										type={showPassword ? "text" : "password"}
										placeholder="Create a strong password"
										value={formData.password}
										onChange={handleChange}
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

							<div className="space-y-2">
								<Label htmlFor="confirmPassword">Confirm Password</Label>
								<div className="relative">
									<Input
										id="confirmPassword"
										name="confirmPassword"
										type={showConfirmPassword ? "text" : "password"}
										placeholder="Confirm your password"
										value={formData.confirmPassword}
										onChange={handleChange}
										required
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									>
										{showConfirmPassword ? (
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
								{loading ? "Creating Account..." : "Create Account"}
							</Button>
						</form>

						<div className="mt-6 text-center">
							<p className="text-sm text-gray-600">
								Already have an account?{" "}
								<Link
									href="/login"
									className="text-blue-600 hover:underline font-medium"
								>
									Sign in here
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
