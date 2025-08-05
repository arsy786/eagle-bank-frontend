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
	ArrowUpRight,
	CreditCard,
	DollarSign,
	Plus,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
	const [accounts, setAccounts] = useState<any[]>([]);
	const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadDashboardData();
	}, []);

	const loadDashboardData = async () => {
		try {
			const accountsData = await apiClient.getAccounts();
			setAccounts(accountsData);

			// Load recent transactions for all accounts
			const allTransactions: any[] = [];
			for (const account of accountsData) {
				try {
					const transactions = await apiClient.getTransactions(account.id);
					const transactionsWithAccount = transactions
						.slice(0, 5) // Get last 5 transactions per account
						.map((tx) => ({ ...tx, accountName: account.accountName }));
					allTransactions.push(...transactionsWithAccount);
				} catch (error) {
					console.error(
						`Failed to load transactions for account ${account.id}:`,
						error
					);
				}
			}

			// Sort by date and take the most recent 10
			allTransactions.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			);
			setRecentTransactions(allTransactions.slice(0, 10));
		} catch (error: any) {
			toast.error(error.message || "Failed to load dashboard data");
		} finally {
			setLoading(false);
		}
	};

	const totalBalance = accounts.reduce(
		(sum, account) => sum + (account.balance || 0),
		0
	);

	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-gray-50">
				<Header />

				<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
						<p className="text-gray-600">
							Welcome back! Here's an overview of your accounts.
						</p>
					</div>

					{loading ? (
						<div className="flex items-center justify-center h-64">
							<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
						</div>
					) : (
						<>
							{/* Summary Cards */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
								<Card>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">
											Total Balance
										</CardTitle>
										<DollarSign className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">
											$
											{totalBalance.toLocaleString("en-US", {
												minimumFractionDigits: 2,
											})}
										</div>
										<p className="text-xs text-muted-foreground">
											Across all accounts
										</p>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">
											Active Accounts
										</CardTitle>
										<CreditCard className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{accounts.length}</div>
										<p className="text-xs text-muted-foreground">
											{accounts.length === 1 ? "Bank account" : "Bank accounts"}
										</p>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">
											Recent Transactions
										</CardTitle>
										<TrendingUp className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">
											{recentTransactions.length}
										</div>
										<p className="text-xs text-muted-foreground">
											In the last period
										</p>
									</CardContent>
								</Card>
							</div>

							{/* Accounts Section */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
								<Card>
									<CardHeader className="flex flex-row items-center justify-between">
										<div>
											<CardTitle>Your Accounts</CardTitle>
											<CardDescription>
												Manage your bank accounts
											</CardDescription>
										</div>
										<Button asChild size="sm" className="bg-blue-500">
											<Link href="/accounts/new">
												<Plus className="h-4 w-4 mr-2" />
												New Account
											</Link>
										</Button>
									</CardHeader>
									<CardContent>
										{accounts.length === 0 ? (
											<div className="text-center py-8">
												<CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
												<p className="text-gray-500 mb-4">No accounts yet</p>
												<Button asChild className="bg-blue-500">
													<Link href="/accounts/new">
														Create Your First Account
													</Link>
												</Button>
											</div>
										) : (
											<div className="space-y-4">
												{accounts.map((account) => (
													<div
														key={account.id}
														className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
													>
														<div>
															<h3 className="font-medium">
																{account.accountName}
															</h3>
															<p className="text-sm text-gray-500">
																{account.accountType} • {account.accountNumber}
															</p>
														</div>
														<div className="text-right">
															<p className="font-semibold">
																$
																{account.balance?.toLocaleString("en-US", {
																	minimumFractionDigits: 2,
																}) || "0.00"}
															</p>
															<Button
																asChild
																variant="ghost"
																size="sm"
																className="mt-1"
															>
																<Link href={`/accounts/${account.id}`}>
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

								{/* Recent Transactions */}
								<Card>
									<CardHeader className="flex flex-row items-center justify-between">
										<div>
											<CardTitle>Recent Transactions</CardTitle>
											<CardDescription>
												Your latest account activity
											</CardDescription>
										</div>
										<Button asChild variant="outline" size="sm">
											<Link href="/transactions">View All</Link>
										</Button>
									</CardHeader>
									<CardContent>
										{recentTransactions.length === 0 ? (
											<div className="text-center py-8">
												<TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
												<p className="text-gray-500">No recent transactions</p>
											</div>
										) : (
											<div className="space-y-4">
												{recentTransactions.map((transaction) => (
													<div
														key={transaction.id}
														className="flex items-center justify-between"
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
																<p className="text-sm text-gray-500">
																	{transaction.accountName}
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
															<p className="text-sm text-gray-500">
																{new Date(
																	transaction.createdAt
																).toLocaleDateString()}
															</p>
														</div>
													</div>
												))}
											</div>
										)}
									</CardContent>
								</Card>
							</div>
						</>
					)}
				</main>
			</div>
		</ProtectedRoute>
	);
}
