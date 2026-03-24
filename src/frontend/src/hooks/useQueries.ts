import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ExpenseCategory } from "../backend.d";
import { useActor } from "./useActor";

// Re-export so consumers can import from one place
export { ExpenseCategory };

/* ─── Query Keys ─────────────────────────────────────────── */
export const queryKeys = {
  expenses: (monthYear: string) => ["expenses", monthYear],
  summary: (monthYear: string) => ["summary", monthYear],
  income: ["income"],
  profile: ["profile"],
};

/* ─── Queries ────────────────────────────────────────────── */

export function useExpensesForMonth(monthYear: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: queryKeys.expenses(monthYear),
    queryFn: async () => {
      if (!actor) return [];
      return actor.getExpensesForMonth(monthYear);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMonthlySummary(monthYear: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: queryKeys.summary(monthYear),
    queryFn: async () => {
      if (!actor) return { totalIncome: 0, totalSpent: 0, savings: 0 };
      return actor.getMonthlySummary(monthYear);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMonthlyIncome() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: queryKeys.income,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMonthlyIncome();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

/* ─── Mutations ──────────────────────────────────────────── */

export function useAddExpense(monthYear: string) {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      category: ExpenseCategory;
      amount: number;
      date: string;
      description: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.addExpense(
        data.category,
        data.amount,
        data.date,
        data.description,
        monthYear,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.expenses(monthYear) });
      void qc.invalidateQueries({ queryKey: queryKeys.summary(monthYear) });
      toast.success("Expense added successfully");
    },
    onError: () => toast.error("Failed to add expense"),
  });
}

export function useUpdateExpense(monthYear: string) {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      category: ExpenseCategory;
      amount: number;
      date: string;
      description: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateExpense(
        data.id,
        data.category,
        data.amount,
        data.date,
        data.description,
        monthYear,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.expenses(monthYear) });
      void qc.invalidateQueries({ queryKey: queryKeys.summary(monthYear) });
      toast.success("Expense updated");
    },
    onError: () => toast.error("Failed to update expense"),
  });
}

export function useDeleteExpense(monthYear: string) {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (expenseId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteExpense(monthYear, expenseId);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.expenses(monthYear) });
      void qc.invalidateQueries({ queryKey: queryKeys.summary(monthYear) });
      toast.success("Expense deleted");
    },
    onError: () => toast.error("Failed to delete expense"),
  });
}

export function useSetMonthlyIncome(monthYear: string) {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (income: number) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.setMonthlyIncome(income);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.income });
      void qc.invalidateQueries({ queryKey: queryKeys.summary(monthYear) });
      toast.success("Monthly income updated");
    },
    onError: () => toast.error("Failed to update income"),
  });
}
