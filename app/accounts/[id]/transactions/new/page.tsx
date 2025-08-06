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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Account {
	id: string;
	accountName: string;
	accountType: string;
	accountNumber: string;
	createdAt: Date;
	balance?: number;
}

type TransactionType = "DEPOSIT" | "WITHDRAWAL";

export default function NewTransactionPage() {
	const [account, setAccount] = useState<Account | null>(null);
	const [formData, setFormData] = useState({
		transactionType: "",
		amount: "",
	});
	const [loading, setLoading] = useState(false);
	const [accountLoading, setAccountLoading] = useState(true);
	const params = useParams();
	const searchParams = useSearchParams();
	const router = useRouter();
	const accountId = params.id as string;

	useEffect(() => {
		if (accountId) {
			loadAccount();
		}

		// Pre-select transaction type from URL params
		const typeParam = searchParams.get("transactionType");
		if (typeParam) {
			const normalizedType = typeParam.toUpperCase() as TransactionType;
			if (normalizedType === "DEPOSIT" || normalizedType === "WITHDRAWAL") {
				setFormData((prev) => ({
					...prev,
					transactionType: normalizedType,
				}));
			}
		}
	}, [accountId, searchParams]);

	const loadAccount = async () => {
		try {
			const accountData = await apiClient.getAccount(accountId);
			setAccount(accountData);
		} catch (error: any) {
			toast.error(error.message || "Failed to load account");
			router.push("/accounts");
		} finally {
			setAccountLoading(false);
		}
	};

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
			transactionType: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const transactionData = {
				...formData,
				amount: parseFloat(formData.amount),
			};

			await apiClient.createTransaction(accountId, transactionData);
			toast.success("Transaction created successfully!");
			router.push(`/accounts/${accountId}`);
		} catch (error: any) {
			toast.error(error.message || "Failed to create transaction");
		} finally {
			setLoading(false);
		}
	};

	const insufficientFunds =
		formData.transactionType === "WITHDRAWAL" &&
		account?.balance !== undefined &&
		parseFloat(formData.amount) > account.balance;

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
						<h1 className="text-3xl font-bold text-gray-900">
							New Transaction
						</h1>
						<p className="text-gray-600">
							Create a new transaction for {account.accountName}
						</p>
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
							<CardTitle>Transaction Details</CardTitle>
							<CardDescription>
								Enter the transaction information
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="space-y-2">
									<Label htmlFor="transactionType">Transaction Type *</Label>
									<Select
										value={formData.transactionType}
										onValueChange={handleSelectChange}
										required
									>
										<SelectTrigger>
											<SelectValue placeholder="Select transaction type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="DEPOSIT">Deposit</SelectItem>
											<SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="amount">Amount *</Label>
									<Input
										id="amount"
										name="amount"
										type="number"
										min="0.01"
										step="0.01"
										placeholder="0.00"
										value={formData.amount}
										onChange={handleChange}
										required
									/>
									{formData.transactionType === "WITHDRAWAL" &&
										account.balance &&
										parseFloat(formData.amount) > account.balance && (
											<p className="text-sm text-red-600">
												Insufficient funds. Available balance: $
												{account.balance.toLocaleString("en-US", {
													minimumFractionDigits: 2,
												})}
											</p>
										)}
								</div>

								<div className="flex space-x-4">
									<Button
										type="submit"
										disabled={
											loading ||
											!formData.transactionType ||
											!formData.amount ||
											insufficientFunds
										}
										className="flex-1 bg-blue-500"
									>
										{loading ? "Processing..." : "Create Transaction"}
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
