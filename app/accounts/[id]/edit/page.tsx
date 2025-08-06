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
import { apiClient } from "@/lib/api";
import { Account, ACCOUNT_TYPES, ApiError } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditAccountPage() {
	const [account, setAccount] = useState<Account | null>(null);
	const [formData, setFormData] = useState({
		accountName: "",
		accountType: "",
	});
	const [loading, setLoading] = useState(false);
	const [accountLoading, setAccountLoading] = useState(true);
	const params = useParams();
	const router = useRouter();
	const accountId = params.id as string;

	useEffect(() => {
		if (accountId) {
			loadAccount();
		}
	}, [accountId]);

	const loadAccount = async () => {
		try {
			const accountData = await apiClient.getAccount(accountId);
			setAccount(accountData);
			setFormData({
				accountName: accountData.accountName,
				accountType: accountData.accountType,
			});
		} catch (error) {
			const err = error as ApiError;
			toast.error(err.message || "Failed to load account");
			router.push("/accounts");
		} finally {
			setAccountLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
			await apiClient.updateAccount(accountId, formData);
			toast.success("Account updated successfully!");
			router.push(`/accounts/${accountId}`);
		} catch (error: any) {
			toast.error(error.message || "Failed to update account");
		} finally {
			setLoading(false);
		}
	};

	if (accountLoading) {
		return (
			<ProtectedRoute>
				<div className="min-h-screen bg-gray-50">
					<Header />
					<div className="flex items-center justify-center h-64">
						<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
					</div>
				</div>
			</ProtectedRoute>
		);
	}

	if (!account) {
		return (
			<ProtectedRoute>
				<div className="min-h-screen bg-gray-50">
					<Header />
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						<div className="text-center">
							<h1 className="text-2xl font-bold text-gray-900 mb-4">
								Account Not Found
							</h1>
							<Button asChild>
								<Link href="/accounts">Back to Accounts</Link>
							</Button>
						</div>
					</div>
				</div>
			</ProtectedRoute>
		);
	}

	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-gray-50">
				<Header />

				<main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="mb-8">
						<Button asChild variant="ghost" className="mb-4">
							<Link href={`/accounts/${accountId}`}>
								<ArrowLeft className="h-4 w-4 mr-2" />
								Back to Account
							</Link>
						</Button>
						<h1 className="text-3xl font-bold text-gray-900">Edit Account</h1>
						<p className="text-gray-600">Update your account information</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						<Card>
							<CardContent className="pt-6">
								<div className="text-center">
									<p className="text-sm text-gray-500">Current Balance</p>
									<p className="text-2xl font-bold">
										$
										{account.balance?.toLocaleString("en-US", {
											minimumFractionDigits: 2,
										}) || "0.00"}
									</p>
								</div>
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Account Details</CardTitle>
							<CardDescription>Update your account information</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="space-y-2">
									<Label htmlFor="accountName">Account Name</Label>
									<Input
										id="accountName"
										name="accountName"
										placeholder="Enter account name"
										value={formData.accountName}
										onChange={handleChange}
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
											{ACCOUNT_TYPES.map((type) => (
												<SelectItem key={type.value} value={type.value}>
													{type.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="accountNumber">Account Number</Label>
									<Input
										id="accountNumber"
										name="accountNumber"
										value={account.accountNumber}
										disabled
										className="bg-gray-50"
									/>
									<p className="text-sm text-gray-500">
										Account number cannot be changed
									</p>
								</div>

								<div className="flex space-x-4">
									<Button
										type="submit"
										disabled={loading || !formData.accountType}
										className="flex-1 bg-blue-500"
									>
										{loading ? "Updating..." : "Update Account"}
									</Button>
									<Button asChild variant="outline" className="flex-1">
										<Link href={`/accounts/${accountId}`}>Cancel</Link>
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
