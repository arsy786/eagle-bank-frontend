const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

interface ApiError {
	message: string;
	status: number;
}

class ApiClient {
	private baseURL: string;
	private token: string | null = null;
	private onTokenExpired: (() => void) | null = null;

	constructor(baseURL: string) {
		this.baseURL = baseURL;
		if (typeof window !== "undefined") {
			this.token = localStorage.getItem("token");
		}
	}

	setToken(token: string | null) {
		this.token = token;
		if (typeof window !== "undefined") {
			if (token) {
				localStorage.setItem("token", token);
			} else {
				localStorage.removeItem("token");
			}
		}
	}

	setOnTokenExpired(callback: () => void) {
		this.onTokenExpired = callback;
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> {
		const url = `${this.baseURL}${endpoint}`;
		const config: RequestInit = {
			headers: {
				"Content-Type": "application/json",
				...(this.token && { Authorization: `Bearer ${this.token}` }),
				...options.headers,
			},
			...options,
		};

		try {
			const response = await fetch(url, config);

			if (!response.ok) {
				// Handle JWT expiration (401 Unauthorized)
				if (response.status === 401) {
					this.setToken(null);
					if (this.onTokenExpired) {
						this.onTokenExpired();
					}
					throw {
						message: "Session expired. Please log in again.",
						status: 401,
					} as ApiError;
				}

				const errorData = await response.json().catch(() => null);
				throw {
					message:
						errorData?.message ||
						`HTTP ${response.status}: ${response.statusText}`,
					status: response.status,
				} as ApiError;
			}

			// Handle empty responses (like DELETE operations)
			if (
				response.status === 204 ||
				response.headers.get("content-length") === "0"
			) {
				return {} as T;
			}

			return response.json();
		} catch (error) {
			if ((error as ApiError).status) {
				throw error;
			}
			throw {
				message: "Network error or server unavailable",
				status: 0,
			} as ApiError;
		}
	}

	// Authentication
	async login(email: string, password: string) {
		return this.request<{ accessToken: string; email: string }>(
			"/v1/users/login",
			{
				method: "POST",
				body: JSON.stringify({ email, password }),
			}
		);
	}

	// Type userData
	async register(userData: any) {
		return this.request<any>("/v1/users", {
			method: "POST",
			body: JSON.stringify(userData),
		});
	}

	// get Me
	async getMe() {
		return this.request<any>(`/v1/users/me`);
	}

	// User operations
	async getUser(userId: string) {
		return this.request<any>(`/v1/users/${userId}`);
	}

	// Type userData
	async updateUser(userId: string, userData: any) {
		return this.request<any>(`/v1/users/${userId}`, {
			method: "PATCH",
			body: JSON.stringify(userData),
		});
	}

	async deleteUser(userId: string) {
		return this.request<void>(`/v1/users/${userId}`, {
			method: "DELETE",
		});
	}

	// Account operations
	async getAccounts() {
		return this.request<any[]>("/v1/accounts");
	}

	async getAccount(accountId: string) {
		return this.request<any>(`/v1/accounts/${accountId}`);
	}

	async createAccount(accountData: any) {
		return this.request<any>("/v1/accounts", {
			method: "POST",
			body: JSON.stringify(accountData),
		});
	}

	async updateAccount(accountId: string, accountData: any) {
		return this.request<any>(`/v1/accounts/${accountId}`, {
			method: "PATCH",
			body: JSON.stringify(accountData),
		});
	}

	async deleteAccount(accountId: string) {
		return this.request<void>(`/v1/accounts/${accountId}`, {
			method: "DELETE",
		});
	}

	// Transaction operations
	async getTransactions(accountId: string) {
		return this.request<any[]>(`/v1/accounts/${accountId}/transactions`);
	}

	async getTransaction(accountId: string, transactionId: string) {
		return this.request<any>(
			`/v1/accounts/${accountId}/transactions/${transactionId}`
		);
	}

	async createTransaction(accountId: string, transactionData: any) {
		return this.request<any>(`/v1/accounts/${accountId}/transactions`, {
			method: "POST",
			body: JSON.stringify(transactionData),
		});
	}
}

export const apiClient = new ApiClient(API_BASE_URL);
export type { ApiError };
