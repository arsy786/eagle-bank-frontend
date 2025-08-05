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
import { ArrowDownLeft, ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TransactionDetailsPage() {
	const [transaction, setTransaction] = useState<any>(null);
	const [account, setAccount] = useState<any>(null);
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
		} catch (error: any) {
			toast.error(error.message || "Failed to load transaction data");
			if (error.status === 404 || error.status === 403) {
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

	const formatDate = (dateString: string) => {
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
							<div className="flex space-x-2">
								<Button asChild variant="outline" size="sm" disabled>
									<Link
										href={`/accounts/${accountId}/transactions/${transactionId}/receipt`}
									>
										<svg
											className="h-4 w-4 mr-2"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
											/>
										</svg>
										Print Receipt
									</Link>
								</Button>
								<Button asChild variant="outline" size="sm" disabled>
									<Link
										href={`/accounts/${accountId}/transactions/${transactionId}/share`}
									>
										<svg
											className="h-4 w-4 mr-2"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
											/>
										</svg>
										Share
									</Link>
								</Button>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Transaction Overview */}
						<div className="lg:col-span-1">
							<Card>
								<CardHeader>
									<CardTitle>Transaction Overview</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div
										className={`p-6 rounded-lg text-white ${
											transaction.transactionType === "DEPOSIT"
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
											{transaction.transactionType === "DEPOSIT" ? (
												<ArrowDownLeft className="h-6 w-6 opacity-80" />
											) : (
												<ArrowUpRight className="h-6 w-6 opacity-80" />
											)}
										</div>
										<div>
											<p className="text-sm opacity-90">Type</p>
											<p className="font-semibold capitalize">
												{transaction.transactionType.toLowerCase()}
											</p>
										</div>
									</div>

									<div className="space-y-3">
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
										{transaction.description && (
											<div>
												<p className="text-sm font-medium text-gray-500">
													Description
												</p>
												<p>{transaction.description}</p>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Transaction Details */}
						<div className="lg:col-span-2">
							<Card>
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
													<p className="capitalize">
														{transaction.transactionType.toLowerCase()}
													</p>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-500">
														Amount
													</p>
													<p
														className={`font-semibold ${
															transaction.transactionType === "DEPOSIT"
																? "text-green-600"
																: "text-red-600"
														}`}
													>
														{transaction.transactionType === "DEPOSIT"
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
													<p className="capitalize">
														{account.accountType?.replace("_", " ")}
													</p>
												</div>
											</div>
										</div>
									</div>

									{transaction.description && (
										<div>
											<h3 className="text-lg font-medium mb-4">Description</h3>
											<p className="text-gray-700">{transaction.description}</p>
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					</div>
				</main>
			</div>
		</ProtectedRoute>
	);
}
