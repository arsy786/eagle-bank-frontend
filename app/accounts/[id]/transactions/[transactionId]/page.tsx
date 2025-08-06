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
import { apiClient } from "@/lib/api";
import {
	Account,
	ApiError,
	Transaction,
	TRANSACTION_TYPE_LABELS,
	TRANSACTION_TYPES,
} from "@/lib/types";
import { ArrowDownLeft, ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TransactionDetailsPage() {
	const [transaction, setTransaction] = useState<Transaction | null>(null);
	const [account, setAccount] = useState<Account | null>(null);
	const [loading, setLoading] = useState(true);
	const params = useParams();
	const router = useRouter();
	const accountId = params.id as string;
	const transactionId = params.transactionId as string;

	useEffect(() => {
		if (accountId && transactionId) {
			loadTransactionData();
		}
	}, [accountId, transactionId]);

	const loadTransactionData = async () => {
		try {
			const [accountData, transactionData] = await Promise.all([
				apiClient.getAccount(accountId),
				apiClient.getTransaction(accountId, transactionId),
			]);

			setAccount(accountData);
			setTransaction(transactionData);
		} catch (error) {
			const err = error as ApiError;
			toast.error(err.message || "Failed to load transaction data");
			if (err.status === 404 || err.status === 403) {
				router.push(`/accounts/${accountId}`);
			}
		} finally {
			setLoading(false);
		}
	};

	const formatAmount = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
	};

	const formatDate = (dateString: string | Date) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (loading) {
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

	if (!transaction || !account) {
		return (
			<ProtectedRoute>
				<div className="min-h-screen bg-gray-50">
					<Header />
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						<div className="text-center">
							<h1 className="text-2xl font-bold text-gray-900 mb-4">
								Transaction Not Found
							</h1>
							<Button asChild>
								<Link href={`/accounts/${accountId}`}>Back to Account</Link>
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

				<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="mb-8">
						<Button asChild variant="ghost" className="mb-4">
							<Link href={`/accounts/${accountId}`}>
								<ArrowLeft className="h-4 w-4 mr-2" />
								Back to Account
							</Link>
						</Button>
						<div className="flex justify-between items-start">
							<div>
								<h1 className="text-3xl font-bold text-gray-900">
									Transaction Details
								</h1>
								<p className="text-gray-600">{account.accountName}</p>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Transaction Overview */}
						<div className="lg:col-span-1">
							<Card className="h-full">
								<CardHeader>
									<CardTitle>Transaction Overview</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4 flex flex-col h-full">
									<div
										className={`p-6 rounded-lg text-white ${
											transaction.transactionType === TRANSACTION_TYPES.DEPOSIT
												? "bg-green-500"
												: "bg-red-500"
										}`}
									>
										<div className="flex justify-between items-start mb-4">
											<div>
												<p className="text-sm opacity-90">Amount</p>
												<p className="text-3xl font-bold">
													{formatAmount(transaction.amount)}
												</p>
											</div>
											{transaction.transactionType ===
											TRANSACTION_TYPES.DEPOSIT ? (
												<ArrowDownLeft className="h-6 w-6 opacity-80" />
											) : (
												<ArrowUpRight className="h-6 w-6 opacity-80" />
											)}
										</div>
										<div>
											<p className="text-sm opacity-90">Type</p>
											<p className="font-semibold">
												{TRANSACTION_TYPE_LABELS[transaction.transactionType]}
											</p>
										</div>
									</div>

									<div className="space-y-3 flex-grow">
										<div>
											<p className="text-sm font-medium text-gray-500">
												Transaction ID
											</p>
											<p className="font-mono text-sm">{transaction.id}</p>
										</div>
										<div>
											<p className="text-sm font-medium text-gray-500">
												Date & Time
											</p>
											<p>{formatDate(transaction.createdAt)}</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Transaction Details */}
						<div className="lg:col-span-2">
							<Card className="h-full">
								<CardHeader>
									<CardTitle>Transaction Information</CardTitle>
									<CardDescription>
										Complete details of this transaction
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<h3 className="text-lg font-medium mb-4">
												Transaction Details
											</h3>
											<div className="space-y-3">
												<div>
													<p className="text-sm font-medium text-gray-500">
														Type
													</p>
													<p>
														{
															TRANSACTION_TYPE_LABELS[
																transaction.transactionType
															]
														}
													</p>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-500">
														Amount
													</p>
													<p
														className={`font-semibold ${
															transaction.transactionType ===
															TRANSACTION_TYPES.DEPOSIT
																? "text-green-600"
																: "text-red-600"
														}`}
													>
														{transaction.transactionType ===
														TRANSACTION_TYPES.DEPOSIT
															? "+"
															: "-"}
														{formatAmount(transaction.amount)}
													</p>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-500">
														Status
													</p>
													<p className="text-green-600 font-medium">
														Completed
													</p>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-500">
														Created
													</p>
													<p>{formatDate(transaction.createdAt)}</p>
												</div>
											</div>
										</div>

										<div>
											<h3 className="text-lg font-medium mb-4">
												Account Information
											</h3>
											<div className="space-y-3">
												<div>
													<p className="text-sm font-medium text-gray-500">
														Account
													</p>
													<p>{account.accountName}</p>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-500">
														Account Number
													</p>
													<p className="font-mono text-sm">
														{account.accountNumber}
													</p>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-500">
														Account Type
													</p>
													<p>{account.accountType}</p>
												</div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</main>
			</div>
		</ProtectedRoute>
	);
}
