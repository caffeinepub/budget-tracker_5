import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MonthlySummary {
    totalIncome: number;
    totalSpent: number;
    savings: number;
}
export interface ExpenseEntry {
    id: bigint;
    date: string;
    description: string;
    category: ExpenseCategory;
    amount: number;
    monthYear: string;
}
export interface UserProfile {
    monthlyIncome: number;
}
export enum ExpenseCategory {
    entertainment = "entertainment",
    food = "food",
    rent = "rent",
    transport = "transport",
    others = "others",
    health = "health"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addExpense(category: ExpenseCategory, amount: number, date: string, description: string, monthYear: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteExpense(monthYear: string, expenseId: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getExpensesForMonth(monthYear: string): Promise<Array<ExpenseEntry>>;
    getMonthlyIncome(): Promise<number | null>;
    getMonthlySummary(monthYear: string): Promise<MonthlySummary>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setMonthlyIncome(income: number): Promise<void>;
    updateExpense(expenseId: bigint, category: ExpenseCategory, amount: number, date: string, description: string, monthYear: string): Promise<void>;
}
