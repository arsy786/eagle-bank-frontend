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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api";
import { Settings, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/auth-context";

export default function ProfilePage() {
	const { user, refreshUser } = useAuth();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phoneNumber: "",
		dateOfBirth: "",
	});

	useEffect(() => {
		if (user) {
			setFormData({
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				email: user.email || "",
				phoneNumber: user.phoneNumber || "",
				dateOfBirth: user.dateOfBirth || "",
			});
		}

	}, [user]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		if (!user) return;
		e.preventDefault();
		setLoading(true);

		try {
			await apiClient.updateUser(user.id, formData);
			await refreshUser();
			toast.success("Profile updated successfully!");
		} catch (error: any) {
			toast.error(error.message || "Failed to update profile");
		} finally {
			setLoading(false);
		}
	};

	if (!user) return null; // Or loading indicator

	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-gray-50">
				<Header />

				<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-gray-900">
							Profile Settings
						</h1>
						<p className="text-gray-600">
							Manage your account information and preferences
						</p>
					</div>

					<Tabs defaultValue="profile" className="space-y-6">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger
								value="profile"
								className="flex items-center space-x-2"
							>
								<User className="h-4 w-4" />
								<span>Profile</span>
							</TabsTrigger>
							<TabsTrigger
								value="security"
								className="flex items-center space-x-2"
							>
								<Shield className="h-4 w-4" />
								<span>Security</span>
							</TabsTrigger>
							<TabsTrigger
								value="preferences"
								className="flex items-center space-x-2"
							>
								<Settings className="h-4 w-4" />
								<span>Preferences</span>
							</TabsTrigger>
						</TabsList>

						<TabsContent value="profile" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Personal Information</CardTitle>
									<CardDescription>
										Update your personal details and contact information
									</CardDescription>
								</CardHeader>
								<CardContent>
									<form onSubmit={handleSubmit} className="space-y-6">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<Label htmlFor="firstName">First Name</Label>
												<Input
													id="firstName"
													name="firstName"
													value={formData.firstName}
													onChange={handleChange}
													required
													disabled
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="lastName">Last Name</Label>
												<Input
													id="lastName"
													name="lastName"
													value={formData.lastName}
													onChange={handleChange}
													required
													disabled
												/>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="email">Email Address</Label>
											<Input
												id="email"
												name="email"
												type="email"
												value={formData.email}
												onChange={handleChange}
												required
												disabled
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor="phoneNumber">Phone Number</Label>
											<Input
												id="phoneNumber"
												name="phoneNumber"
												type="tel"
												value={formData.phoneNumber}
												onChange={handleChange}
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor="dateOfBirth">Date of Birth</Label>
											<Input
												id="dateOfBirth"
												name="dateOfBirth"
												type="date"
												value={formData.dateOfBirth}
												onChange={handleChange}
											/>
										</div>

										<Button
											type="submit"
											disabled={loading}
											className="bg-blue-500"
										>
											{loading ? "Updating..." : "Update Profile"}
										</Button>
									</form>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="security" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Security Settings</CardTitle>
									<CardDescription>
										Manage your account security and authentication
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div>
										<h3 className="text-lg font-medium mb-4">Password</h3>
										<p className="text-sm text-gray-600 mb-4">
											Keep your account secure by using a strong password
										</p>
										<Button variant="outline" disabled>
											Change Password (Coming Soon)
										</Button>
									</div>

									<Separator />

									<div>
										<h3 className="text-lg font-medium mb-4">
											Two-Factor Authentication
										</h3>
										<p className="text-sm text-gray-600 mb-4">
											Add an extra layer of security to your account
										</p>
										<Button variant="outline" disabled>
											Enable 2FA (Coming Soon)
										</Button>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="preferences" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Account Preferences</CardTitle>
									<CardDescription>
										Customize your banking experience
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div>
										<h3 className="text-lg font-medium mb-4">Notifications</h3>
										<p className="text-sm text-gray-600 mb-4">
											Choose how you want to receive notifications
										</p>
										<Button variant="outline" disabled>
											Notification Settings (Coming Soon)
										</Button>
									</div>

									<Separator />

									<div>
										<h3 className="text-lg font-medium mb-4">Theme</h3>
										<p className="text-sm text-gray-600 mb-4">
											Customize the appearance of your dashboard
										</p>
										<Button variant="outline" disabled>
											Theme Settings (Coming Soon)
										</Button>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</main>
			</div>
		</ProtectedRoute>
	);
}
