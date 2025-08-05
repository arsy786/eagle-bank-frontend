"use client";

import { Header } from "@/components/layout/header";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiClient } from "@/lib/api";
import { CreditCard, Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
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

export default function AccountsPage() {
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [loading, setLoading] = useState(true);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

	useEffect(() => {
		loadAccounts();
	}, []);

	const loadAccounts = async () => {
		try {
			const accountsData = await apiClient.getAccounts();
			setAccounts(accountsData);
		} catch (error: any) {
			toast.error(error.message || "Failed to load accounts");
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteClick = (account: any) => {
		setAccountToDelete(account);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!accountToDelete) return;

		try {
			await apiClient.deleteAccount(accountToDelete.id);
			toast.success("Account deleted successfully");
			loadAccounts();
		} catch (error: any) {
			toast.error(error.message || "Failed to delete account");
		} finally {
			setDeleteDialogOpen(false);
			setAccountToDelete(null);
		}
	};

	const handleDeleteCancel = () => {
		setDeleteDialogOpen(false);
		setAccountToDelete(null);
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

	if (accounts.length === 0) {
		return (
			<ProtectedRoute>
				<div className="min-h-screen bg-gray-50">
					<Header />
					<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						<div className="flex justify-between items-center mb-8">
							<div>
								<h1 className="text-3xl font-bold text-gray-900">
									Bank Accounts
								</h1>
								<p className="text-gray-600">
									Manage your bank accounts and view balances
								</p>
							</div>
							<Button asChild className="bg-blue-500">
								<Link href="/accounts/new">
									<Plus className="h-4 w-4 mr-2" />
									New Account
								</Link>
							</Button>
						</div>
						<Card>
							<CardContent className="text-center py-16">
								<CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									No accounts yet
								</h3>
								<p className="text-gray-500 mb-6">
									Create your first bank account to get started
								</p>
								<Button asChild className="bg-blue-500">
									<Link href="/accounts/new">Create Your First Account</Link>
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
								Bank Accounts
							</h1>
							<p className="text-gray-600">
								Manage your bank accounts and view balances
							</p>
						</div>
						<Button asChild className="bg-blue-500">
							<Link href="/accounts/new">
								<Plus className="h-4 w-4 mr-2" />
								New Account
							</Link>
						</Button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{accounts.map((account) => (
							<Card
								key={account.id}
								className="relative hover:shadow-lg transition-shadow"
							>
								<CardHeader className="pb-4">
									<div className="flex justify-between items-start">
										<div className="bank-card-gradient p-4 rounded-lg text-white flex-1 mr-4">
											<div className="flex justify-between items-start mb-4">
												<div>
													<p className="text-sm opacity-90">Balance</p>
													<p className="text-2xl font-bold">
														$
														{account.balance?.toLocaleString("en-US", {
															minimumFractionDigits: 2,
														}) || "0.00"}
													</p>
												</div>
												<CreditCard className="h-6 w-6 opacity-80" />
											</div>
											<div>
												<p className="text-sm opacity-90">Account Number</p>
												<p className="font-mono text-sm">
													{account.accountNumber}
												</p>
											</div>
										</div>

										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="sm">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem asChild>
													<Link href={`/accounts/${account.id}/edit`}>
														<Edit className="h-4 w-4 mr-2" />
														Edit
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem
													className="text-red-600"
													onClick={() => handleDeleteClick(account)}
												>
													<Trash2 className="h-4 w-4 mr-2" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</CardHeader>

								<CardContent className="pt-0">
									<div className="space-y-2 mb-4">
										<h3 className="font-semibold text-lg">
											{account.accountName}
										</h3>
										<p className="text-sm text-gray-500 capitalize">
											{account.accountType?.replace("_", " ")}
										</p>
									</div>

									<div className="flex space-x-2">
										<Button
											asChild
											variant="outline"
											size="sm"
											className="flex-1"
										>
											<Link href={`/accounts/${account.id}`}>View Details</Link>
										</Button>
										<Button asChild size="sm" className="flex-1 bg-blue-500">
											<Link href={`/accounts/${account.id}/transactions/new`}>
												New Transaction
											</Link>
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</main>
			</div>

			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Deletion</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete &quot;
							{accountToDelete?.accountName}&quot;? This action cannot be
							undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={handleDeleteCancel}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDeleteConfirm}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</ProtectedRoute>
	);
}
