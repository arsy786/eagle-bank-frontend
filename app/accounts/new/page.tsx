"use client";

import { Header } from "@/components/layout/header";
import { ProtectedRoute } from "@/components/layout/protected-route";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NewAccountPage() {
	const [formData, setFormData] = useState({
		accountName: "",
		accountType: "",
		initialBalance: "",
		description: "",
	});
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSelectChange = (value: string) => {
		setFormData((prev) => ({
			...prev,
			accountType: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const accountData = {
				...formData,
				initialBalance: parseFloat(formData.initialBalance) || 0,
			};

			await apiClient.createAccount(accountData);
			toast.success("Account created successfully!");
			router.push("/accounts");
		} catch (error: any) {
			toast.error(error.message || "Failed to create account");
		} finally {
			setLoading(false);
		}
	};

	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-gray-50">
				<Header />

				<main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="mb-8">
						<Button asChild variant="ghost" className="mb-4">
							<Link href="/accounts">
								<ArrowLeft className="h-4 w-4 mr-2" />
								Back to Accounts
							</Link>
						</Button>
						<h1 className="text-3xl font-bold text-gray-900">
							Create New Account
						</h1>
						<p className="text-gray-600">Set up a new bank account</p>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Account Information</CardTitle>
							<CardDescription>
								Fill in the details for your new bank account
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="space-y-2">
									<Label htmlFor="accountName">Account Name *</Label>
									<Input
										id="accountName"
										name="accountName"
										placeholder="e.g., My Savings Account"
										value={formData.accountName}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="accountType">Account Type *</Label>
									<Select
										value={formData.accountType}
										onValueChange={handleSelectChange}
										required
									>
										<SelectTrigger>
											<SelectValue placeholder="Select account type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="SAVINGS">Savings Account</SelectItem>
											<SelectItem value="CHECKING">Checking Account</SelectItem>
											<SelectItem value="BUSINESS">Business Account</SelectItem>
											<SelectItem value="JOINT">Joint Account</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="initialBalance">Initial Balance</Label>
									<Input
										id="initialBalance"
										name="initialBalance"
										type="number"
										min="0"
										step="0.01"
										placeholder="0.00"
										value={formData.initialBalance}
										onChange={handleChange}
									/>
									<p className="text-sm text-gray-500">
										Enter the initial deposit amount (optional)
									</p>
								</div>

								<div className="space-y-2">
									<Label htmlFor="description">Description</Label>
									<Textarea
										id="description"
										name="description"
										placeholder="Optional description for this account"
										value={formData.description}
										onChange={handleChange}
										rows={3}
									/>
								</div>

								<div className="flex space-x-4">
									<Button
										type="submit"
										disabled={loading}
										className="flex-1 bg-blue-500"
									>
										{loading ? "Creating Account..." : "Create Account"}
									</Button>
									<Button asChild variant="outline" className="flex-1">
										<Link href="/accounts">Cancel</Link>
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</main>
			</div>
		</ProtectedRoute>
	);
}
