"use client";

import { useAuth } from "@/app/contexts/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
	const { user, logout } = useAuth();

	if (!user) return null;

	const initials = `${user.firstName?.[0] || ""}${
		user.lastName?.[0] || ""
	}`.toUpperCase();

	return (
		<header className="border-b bg-white shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<Link href="/dashboard" className="flex items-center space-x-2">
						<div className="w-8 h-8 flex items-center justify-center">
							<Image
								src="/icon.png"
								alt="Eagle Bank Logo"
								width={100}
								height={100}
							/>{" "}
						</div>
						<span className="text-xl font-bold text-gray-900">Eagle Bank</span>
					</Link>

					<nav className="hidden md:flex space-x-8">
						<Link
							href="/dashboard"
							className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
						>
							Dashboard
						</Link>
						<Link
							href="/accounts"
							className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
						>
							Accounts
						</Link>
						<Link
							href="/transactions"
							className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
						>
							Transactions
						</Link>
					</nav>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="relative h-8 w-8 rounded-full">
								<Avatar className="h-8 w-8">
									<AvatarFallback className="bg-blue-100 text-blue-600">
										{initials}
									</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56" align="end" forceMount>
							<div className="flex items-center justify-start gap-2 p-2">
								<div className="flex flex-col space-y-1 leading-none">
									<p className="font-medium">
										{user.firstName} {user.lastName}
									</p>
									<p className="w-[200px] truncate text-sm text-muted-foreground">
										{user.email}
									</p>
								</div>
							</div>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link href="/profile" className="w-full flex items-center">
									<User className="mr-2 h-4 w-4" />
									<span>Profile</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={logout} className="text-red-600">
								<LogOut className="mr-2 h-4 w-4" />
								<span>Log out</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
