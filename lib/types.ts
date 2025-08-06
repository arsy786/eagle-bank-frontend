export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber?: string;
	dateOfBirth?: string;
	createdAt: string;
}

export interface Account {
	id: string;
	accountName: string;
	accountType: string;
	accountNumber: string;
	balance: number;
	createdAt: string;
}

export interface MappedTransactionWithId extends Transaction {
	accountId: string;
	accountName: string;
}

export interface MappedTransaction extends Transaction {
	accountName: string;
}

export interface Transaction {
	id: string;
	transactionType: TransactionType;
	amount: number;
	createdAt: string;
}

export type TransactionType = "DEPOSIT" | "WITHDRAWAL";

export const TRANSACTION_TYPES = {
	DEPOSIT: "DEPOSIT" as const,
	WITHDRAWAL: "WITHDRAWAL" as const,
} as const;

export const TRANSACTION_TYPE_LABELS = {
	[TRANSACTION_TYPES.DEPOSIT]: "Deposit",
	[TRANSACTION_TYPES.WITHDRAWAL]: "Withdrawal",
} as const;

export const ACCOUNT_TYPES = [
	{ value: "SAVINGS", label: "Savings Account" },
	{ value: "CHECKING", label: "Checking Account" },
	{ value: "BUSINESS", label: "Business Account" },
	{ value: "JOINT", label: "Joint Account" },
] as const;

export const ACCOUNT_TYPE_VALUES = {
	SAVINGS: "SAVINGS",
	CHECKING: "CHECKING",
	BUSINESS: "BUSINESS",
	JOINT: "JOINT",
} as const;

export interface LoginResponse {
	accessToken: string;
	email: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	phoneNumber?: string;
	dateOfBirth?: string;
}

export interface CreateAccountRequest {
	accountName: string;
	accountType: string;
}

export interface UpdateAccountRequest {
	accountName?: string;
	accountType?: string;
}

export interface CreateTransactionRequest {
	transactionType: TransactionType;
	amount: number;
}

export interface UpdateUserRequest {
	firstName?: string;
	lastName?: string;
	phoneNumber?: string;
	dateOfBirth?: string;
}

export interface ApiError {
	message: string;
	status: number;
}
