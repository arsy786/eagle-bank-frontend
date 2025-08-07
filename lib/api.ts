import {
	Account,
	ApiError,
	CreateAccountRequest,
	CreateTransactionRequest,
	LoginResponse,
	RegisterRequest,
	Transaction,
	UpdateAccountRequest,
	UpdateUserRequest,
	User,
} from "./types";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

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
		options: RequestInit = {},
		skipAuth = false
	): Promise<T> {
		const url = `${this.baseURL}${endpoint}`;

		const config: RequestInit = {
			headers: {
				"Content-Type": "application/json",
				...(!skipAuth && this.token && { Authorization: `Bearer ${this.token}` }),
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
	async login(email: string, password: string): Promise<LoginResponse> {
		return this.request<LoginResponse>("/v1/users/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
		}, true);
	}

	async register(userData: RegisterRequest): Promise<User> {
		return this.request<User>("/v1/users", {
			method: "POST",
			body: JSON.stringify(userData),
		}, true);
	}

	async getMe(): Promise<User> {
		return this.request<User>("/v1/users/me");
	}

	// User operations
	async getUser(userId: string): Promise<User> {
		return this.request<User>(`/v1/users/${userId}`);
	}

	async updateUser(userId: string, userData: UpdateUserRequest): Promise<User> {
		return this.request<User>(`/v1/users/${userId}`, {
			method: "PATCH",
			body: JSON.stringify(userData),
		});
	}

	async deleteUser(userId: string): Promise<void> {
		return this.request<void>(`/v1/users/${userId}`, {
			method: "DELETE",
		});
	}

	// Account operations
	async getAccounts(): Promise<Account[]> {
		return this.request<Account[]>("/v1/accounts");
	}

	async getAccount(accountId: string): Promise<Account> {
		return this.request<Account>(`/v1/accounts/${accountId}`);
	}

	async createAccount(accountData: CreateAccountRequest): Promise<Account> {
		return this.request<Account>("/v1/accounts", {
			method: "POST",
			body: JSON.stringify(accountData),
		});
	}

	async updateAccount(
		accountId: string,
		accountData: UpdateAccountRequest
	): Promise<Account> {
		return this.request<Account>(`/v1/accounts/${accountId}`, {
			method: "PATCH",
			body: JSON.stringify(accountData),
		});
	}

	async deleteAccount(accountId: string): Promise<void> {
		return this.request<void>(`/v1/accounts/${accountId}`, {
			method: "DELETE",
		});
	}

	// Transaction operations
	async getTransactions(accountId: string): Promise<Transaction[]> {
		return this.request<Transaction[]>(
			`/v1/accounts/${accountId}/transactions`
		);
	}

	async getTransaction(
		accountId: string,
		transactionId: string
	): Promise<Transaction> {
		return this.request<Transaction>(
			`/v1/accounts/${accountId}/transactions/${transactionId}`
		);
	}

	async createTransaction(
		accountId: string,
		transactionData: CreateTransactionRequest
	): Promise<Transaction> {
		return this.request<Transaction>(`/v1/accounts/${accountId}/transactions`, {
			method: "POST",
			body: JSON.stringify(transactionData),
		});
	}
}

export const apiClient = new ApiClient(API_BASE_URL);
