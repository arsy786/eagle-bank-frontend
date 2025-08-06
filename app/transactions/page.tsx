"use client";

import { Header } from "@/components/layout/header";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import {
	MappedTransactionWithId,
	TRANSACTION_TYPES,
	TRANSACTION_TYPE_LABELS,
} from "@/lib/types";
import { ArrowDownLeft, ArrowLeft, ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TransactionsPage() {
	const [transactions, setTransactions] = useState<MappedTransactionWithId[]>(
		[]
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadTransactions();
	}, []);

	const loadTransactions = async () => {
		try {
			// First get all accounts
			const accountsData = await apiClient.getAccounts();

			// Then get transactions for each account
			const allTransactions: MappedTransactionWithId[] = [];
			for (const account of accountsData) {
				try {
					const accountTransactions = await apiClient.getTransactions(
						account.id
					);
					const transactionsWithAccount = accountTransactions.map((tx) => ({
						...tx,
						accountName: account.accountName,
						accountId: account.id,
					}));
					allTransactions.push(...transactionsWithAccount);
				} catch (error) {
					console.error(
						`Failed to load transactions for account ${account.id}:`,
						error
					);
				}
			}

			// Sort by date (most recent first)
			allTransactions.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			);
			setTransactions(allTransactions);
		} catch (error: any) {
			toast.error(error.message || "Failed to load transactions");
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

	const formatDate = (date: string | Date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
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
					<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						<div className="flex items-center justify-center h-64">
							<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
						</div>
					</main>
				</div>
			</ProtectedRoute>
		);
	}

	if (transactions.length === 0) {
		return (
			<ProtectedRoute>
				<div className="min-h-screen bg-gray-50">
					<Header />
					<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						<div className="flex justify-between items-center mb-8">
							<div>
								<h1 className="text-3xl font-bold text-gray-900">
									All Transactions
								</h1>
								<p className="text-gray-600">
									View all transactions across your accounts
								</p>
							</div>
							<Button asChild className="bg-blue-500">
								<Link href="/accounts">
									<Plus className="h-4 w-4 mr-2" />
									Go to Accounts
								</Link>
							</Button>
						</div>
						<Card>
							<CardContent className="text-center py-16">
								<ArrowUpRight className="h-16 w-16 text-gray-400 mx-auto mb-4" />
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									No transactions yet
								</h3>
								<p className="text-gray-500 mb-6">
									Create your first transaction to get started
								</p>
								<Button asChild className="bg-blue-500">
									<Link href="/accounts">Go to Accounts</Link>
								</Button>
							</CardContent>
						</Card>
					</main>
				</div>
			</ProtectedRoute>
		);
	}

	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-gray-50">
				<Header />

				<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="flex justify-between items-center mb-8">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								All Transactions
							</h1>
							<p className="text-gray-600">
								View all transactions across your accounts
							</p>
						</div>
						<Button asChild className="bg-blue-500">
							<Link href="/accounts">
								<ArrowLeft className="h-4 w-4 mr-2" />
								Go to Accounts
							</Link>
						</Button>
					</div>

					<div className="space-y-4">
						{transactions.map((transaction) => (
							<Card
								key={transaction.id}
								className="hover:shadow-md transition-shadow"
							>
								<CardContent className="p-6">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<div
												className={`p-2 rounded-full ${
													transaction.transactionType ===
													TRANSACTION_TYPES.DEPOSIT
														? "bg-green-100 text-green-600"
														: "bg-red-100 text-red-600"
												}`}
											>
												{transaction.transactionType ===
												TRANSACTION_TYPES.DEPOSIT ? (
													<ArrowDownLeft className="h-5 w-5" />
												) : (
													<ArrowUpRight className="h-5 w-5" />
												)}
											</div>
											<div>
												<h3 className="font-semibold text-gray-900">
													{TRANSACTION_TYPE_LABELS[transaction.transactionType]}
												</h3>
												<p className="text-sm text-gray-500">
													{transaction.accountName}
												</p>
												<p className="text-xs text-gray-400">
													{formatDate(transaction.createdAt)}
												</p>
											</div>
										</div>
										<div className="text-right">
											<p
												className={`text-lg font-semibold ${
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
											<Button asChild variant="ghost" size="sm">
												<Link href={`/accounts/${transaction.accountId}`}>
													View Account
												</Link>
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</main>
			</div>
		</ProtectedRoute>
	);
}
