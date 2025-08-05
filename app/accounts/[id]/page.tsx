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
	ArrowDownLeft,
	ArrowLeft,
	ArrowUpRight,
	Edit,
	Plus,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AccountDetailsPage() {
	const [account, setAccount] = useState<any>(null);
	const [transactions, setTransactions] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const params = useParams();
	const router = useRouter();
	const accountId = params.id as string;

	useEffect(() => {
		if (accountId) {
			loadAccountData();
		}
	}, [accountId]);

	const loadAccountData = async () => {
		try {
			const [accountData, transactionsData] = await Promise.all([
				apiClient.getAccount(accountId),
				apiClient.getTransactions(accountId),
			]);

			setAccount(accountData);
			setTransactions(transactionsData);
		} catch (error: any) {
			toast.error(error.message || "Failed to load account data");
			if (error.status === 404 || error.status === 403) {
				router.push("/accounts");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteAccount = async () => {
		if (
			!confirm(
				`Are you sure you want to delete "${account.accountName}"? This action cannot be undone.`
			)
		) {
			return;
		}

		try {
			await apiClient.deleteAccount(accountId);
			toast.success("Account deleted successfully");
			router.push("/accounts");
		} catch (error: any) {
			toast.error(error.message || "Failed to delete account");
		}
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

				<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="mb-8">
						<Button asChild variant="ghost" className="mb-4">
							<Link href="/accounts">
								<ArrowLeft className="h-4 w-4 mr-2" />
								Back to Accounts
							</Link>
						</Button>
						<div className="flex justify-between items-start">
							<div>
								<h1 className="text-3xl font-bold text-gray-900">
									{account.accountName}
								</h1>
								<p className="text-gray-600 capitalize">
									{account.accountType?.replace("_", " ")}
								</p>
							</div>
							<div className="flex space-x-2">
								<Button asChild variant="outline">
									<Link href={`/accounts/${accountId}/edit`}>
										<Edit className="h-4 w-4 mr-2" />
										Edit
									</Link>
								</Button>
								<Button variant="destructive" onClick={handleDeleteAccount}>
									<Trash2 className="h-4 w-4 mr-2" />
									Delete
								</Button>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Account Overview */}
						<div className="lg:col-span-1">
							<Card>
								<CardHeader>
									<CardTitle>Account Overview</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="bank-card-gradient p-6 rounded-lg text-white">
										<div className="flex justify-between items-start mb-4">
											<div>
												<p className="text-sm opacity-90">Current Balance</p>
												<p className="text-3xl font-bold">
													$
													{account.balance?.toLocaleString("en-US", {
														minimumFractionDigits: 2,
													}) || "0.00"}
												</p>
											</div>
										</div>
										<div>
											<p className="text-sm opacity-90">Account Number</p>
											<p className="font-mono">{account.accountNumber}</p>
										</div>
									</div>

									<div className="space-y-3">
										<div>
											<p className="text-sm font-medium text-gray-500">
												Account Type
											</p>
											<p className="capitalize">
												{account.accountType?.replace("_", " ")}
											</p>
										</div>
										{account.description && (
											<div>
												<p className="text-sm font-medium text-gray-500">
													Description
												</p>
												<p>{account.description}</p>
											</div>
										)}
										<div>
											<p className="text-sm font-medium text-gray-500">
												Created
											</p>
											<p>{new Date(account.createdAt).toLocaleDateString()}</p>
										</div>
									</div>

									<div className="flex space-x-2">
										<Button asChild size="sm" className="flex-1 bg-blue-500">
											<Link
												href={`/accounts/${accountId}/transactions/new?transactionType=deposit`}
											>
												<ArrowDownLeft className="h-4 w-4 mr-2" />
												Deposit
											</Link>
										</Button>
										<Button
											asChild
											size="sm"
											variant="outline"
											className="flex-1"
										>
											<Link
												href={`/accounts/${accountId}/transactions/new?transactionType=withdrawal`}
											>
												<ArrowUpRight className="h-4 w-4 mr-2" />
												Withdraw
											</Link>
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Transactions */}
						<div className="lg:col-span-2">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between">
									<div>
										<CardTitle>Transaction History</CardTitle>
										<CardDescription>
											All transactions for this account
										</CardDescription>
									</div>
									<Button asChild size="sm" className="bg-blue-500">
										<Link href={`/accounts/${accountId}/transactions/new`}>
											<Plus className="h-4 w-4 mr-2" />
											New Transaction
										</Link>
									</Button>
								</CardHeader>
								<CardContent>
									{transactions.length === 0 ? (
										<div className="text-center py-8">
											<ArrowUpRight className="h-12 w-12 text-gray-400 mx-auto mb-4" />
											<p className="text-gray-500 mb-4">No transactions yet</p>
											<Button asChild className="bg-blue-500">
												<Link href={`/accounts/${accountId}/transactions/new`}>
													Create Your First Transaction
												</Link>
											</Button>
										</div>
									) : (
										<div className="space-y-4">
											{transactions.map((transaction) => (
												<div
													key={transaction.id}
													className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
												>
													<div className="flex items-center space-x-3">
														<div
															className={`p-2 rounded-full ${
																transaction.transactionType === "DEPOSIT"
																	? "bg-green-100"
																	: "bg-red-100"
															}`}
														>
															{transaction.transactionType === "DEPOSIT" ? (
																<ArrowDownLeft className="h-4 w-4 text-green-600" />
															) : (
																<ArrowUpRight className="h-4 w-4 text-red-600" />
															)}
														</div>
														<div>
															<p className="font-medium capitalize">
																{transaction.transactionType.toLowerCase()}
															</p>
															{transaction.description && (
																<p className="text-sm text-gray-500">
																	{transaction.description}
																</p>
															)}
															<p className="text-sm text-gray-500">
																{new Date(
																	transaction.createdAt
																).toLocaleString()}
															</p>
														</div>
													</div>
													<div className="text-right">
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
															$
															{transaction.amount?.toLocaleString("en-US", {
																minimumFractionDigits: 2,
															})}
														</p>
														<Button asChild variant="ghost" size="sm">
															<Link
																href={`/accounts/${accountId}/transactions/${transaction.id}`}
															>
																View Details
															</Link>
														</Button>
													</div>
												</div>
											))}
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
