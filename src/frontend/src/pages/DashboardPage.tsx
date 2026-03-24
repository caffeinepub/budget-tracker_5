import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Loader2,
  LogOut,
  Pencil,
  PiggyBank,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { ExpenseEntry } from "../backend.d";
import { ExpenseCategory } from "../backend.d";
import { ExpenseDialog } from "../components/ExpenseDialog";
import { IncomeDialog } from "../components/IncomeDialog";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useDeleteExpense,
  useExpensesForMonth,
  useMonthlyIncome,
  useMonthlySummary,
} from "../hooks/useQueries";
import { ALL_CATEGORIES, getCategoryMeta } from "../utils/categoryUtils";
import {
  formatCurrency,
  formatMonthYear,
  formatShortDate,
  shiftMonth,
  toMonthYear,
} from "../utils/dateUtils";

const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.food]: "🍽️",
  [ExpenseCategory.transport]: "🚌",
  [ExpenseCategory.rent]: "🏠",
  [ExpenseCategory.entertainment]: "🎬",
  [ExpenseCategory.health]: "💊",
  [ExpenseCategory.others]: "📦",
};

function SummaryCardSkeleton() {
  return (
    <div className="card-glow rounded-xl border border-border/50 bg-card p-5">
      <Skeleton className="h-4 w-20 mb-3" />
      <Skeleton className="h-7 w-32 mb-1" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

function ExpenseRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-5 w-16" />
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { clear, identity } = useInternetIdentity();

  const [currentMonth, setCurrentMonth] = useState(toMonthYear());
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseEntry | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<bigint | null>(null);

  const expensesQuery = useExpensesForMonth(currentMonth);
  const summaryQuery = useMonthlySummary(currentMonth);
  const incomeQuery = useMonthlyIncome();
  const deleteMutation = useDeleteExpense(currentMonth);

  const isLoading =
    expensesQuery.isLoading || summaryQuery.isLoading || incomeQuery.isLoading;

  const expenses = expensesQuery.data ?? [];
  const summary = summaryQuery.data ?? {
    totalIncome: 0,
    totalSpent: 0,
    savings: 0,
  };
  const monthlyIncome = incomeQuery.data ?? null;

  const hasSavings = summary.savings >= 0;
  const savingsPct =
    summary.totalIncome > 0
      ? Math.min(100, (summary.savings / summary.totalIncome) * 100)
      : 0;
  const spentPct =
    summary.totalIncome > 0
      ? Math.min(100, (summary.totalSpent / summary.totalIncome) * 100)
      : 0;

  // Per-category totals
  const categoryTotals = ALL_CATEGORIES.map((cat) => {
    const total = expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);
    return { cat, total };
  })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  const maxCategoryTotal = Math.max(...categoryTotals.map((c) => c.total), 1);

  const handleLogout = () => {
    clear();
    void navigate({ to: "/" });
  };

  const handleEditExpense = (expense: ExpenseEntry) => {
    setEditingExpense(expense);
    setExpenseDialogOpen(true);
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setExpenseDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget == null) return;
    await deleteMutation.mutateAsync(deleteTarget);
    setDeleteTarget(null);
  };

  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-5)}`
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <div>
              <span className="font-display text-base font-bold tracking-tight">
                BudgetTrack
              </span>
              {shortPrincipal && (
                <div className="text-[10px] text-muted-foreground hidden sm:block">
                  {shortPrincipal}
                </div>
              )}
            </div>
          </div>

          {/* Month navigator */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentMonth((m) => shiftMonth(m, -1))}
              data-ocid="dashboard.prev_month_button"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-display text-sm font-semibold min-w-[110px] text-center">
              {formatMonthYear(currentMonth)}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentMonth((m) => shiftMonth(m, 1))}
              data-ocid="dashboard.next_month_button"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
            data-ocid="nav.logout_button"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* ── Summary Cards ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {isLoading ? (
            <>
              <SummaryCardSkeleton />
              <SummaryCardSkeleton />
              <SummaryCardSkeleton />
            </>
          ) : (
            <>
              {/* Income Card */}
              <div className="card-glow relative overflow-hidden rounded-xl border border-border/50 bg-card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Monthly Income
                    </p>
                    <p className="font-display mt-1.5 text-2xl font-bold">
                      {formatCurrency(summary.totalIncome)}
                    </p>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                </div>
                {monthlyIncome == null && (
                  <button
                    type="button"
                    className="mt-3 text-xs text-primary hover:underline"
                    onClick={() => setIncomeDialogOpen(true)}
                    data-ocid="dashboard.set_income_button"
                  >
                    + Set income
                  </button>
                )}
                {monthlyIncome != null && (
                  <button
                    type="button"
                    className="mt-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setIncomeDialogOpen(true)}
                    data-ocid="dashboard.set_income_button"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit income
                  </button>
                )}
              </div>

              {/* Spent Card */}
              <div
                className={`relative overflow-hidden rounded-xl border bg-card p-5 ${
                  summary.totalSpent > summary.totalIncome
                    ? "card-glow-danger border-destructive/25"
                    : "card-glow border-border/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Total Spent
                    </p>
                    <p
                      className={`font-display mt-1.5 text-2xl font-bold ${
                        summary.totalSpent > summary.totalIncome
                          ? "text-destructive"
                          : ""
                      }`}
                    >
                      {formatCurrency(summary.totalSpent)}
                    </p>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  </div>
                </div>
                {summary.totalIncome > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                      <span>Budget used</span>
                      <span>{spentPct.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted/40">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          spentPct > 100
                            ? "bg-destructive"
                            : spentPct > 80
                              ? "bg-warning"
                              : "bg-primary"
                        }`}
                        style={{ width: `${Math.min(spentPct, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Savings Card */}
              <div
                className={`relative overflow-hidden rounded-xl border bg-card p-5 ${
                  hasSavings
                    ? "card-glow-success border-success/25"
                    : "card-glow-danger border-destructive/25"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Savings
                    </p>
                    <p
                      className={`font-display mt-1.5 text-2xl font-bold ${
                        hasSavings ? "text-success" : "text-destructive"
                      }`}
                    >
                      {formatCurrency(Math.abs(summary.savings))}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {hasSavings ? "saved this month" : "over budget"}
                    </p>
                  </div>
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      hasSavings ? "bg-success/15" : "bg-destructive/10"
                    }`}
                  >
                    <PiggyBank
                      className={`h-4 w-4 ${hasSavings ? "text-success" : "text-destructive"}`}
                    />
                  </div>
                </div>
                {summary.totalIncome > 0 && hasSavings && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                      <span>Savings rate</span>
                      <span>{savingsPct.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted/40">
                      <div
                        className="h-1.5 rounded-full bg-success transition-all"
                        style={{ width: `${savingsPct}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>

        {/* ── Main content grid ───────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* ── Category Breakdown ────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="card-glow rounded-xl border border-border/50 bg-card lg:col-span-1"
          >
            <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
              <h2 className="font-display text-sm font-bold">
                Category Breakdown
              </h2>
              <Badge variant="secondary" className="text-xs">
                {formatMonthYear(currentMonth)}
              </Badge>
            </div>

            <div className="p-5">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-14" />
                      </div>
                      <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                  ))}
                </div>
              ) : categoryTotals.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-8 text-center"
                  data-ocid="expense.empty_state"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-border/40 bg-muted/30">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No expenses this month
                  </p>
                  <button
                    type="button"
                    className="mt-2 text-xs text-primary hover:underline"
                    onClick={handleAddExpense}
                  >
                    Add your first expense →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {categoryTotals.map(({ cat, total }) => {
                    const meta = getCategoryMeta(cat);
                    const pct = (total / maxCategoryTotal) * 100;
                    return (
                      <div key={cat}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {CATEGORY_ICONS[cat]}
                            </span>
                            <span className="text-xs font-medium">
                              {meta.label}
                            </span>
                          </div>
                          <span className="text-xs font-semibold">
                            {formatCurrency(total)}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-muted/40">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="h-2 rounded-full"
                            style={{ background: meta.hex }}
                          />
                        </div>
                        {summary.totalSpent > 0 && (
                          <div className="mt-0.5 text-right text-[10px] text-muted-foreground">
                            {((total / summary.totalSpent) * 100).toFixed(0)}%
                            of spending
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Expense List ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="card-glow rounded-xl border border-border/50 bg-card lg:col-span-2"
          >
            <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
              <div>
                <h2 className="font-display text-sm font-bold">Expenses</h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {expenses.length} transaction
                  {expenses.length !== 1 ? "s" : ""}
                </p>
              </div>
              <Button
                size="sm"
                className="gap-1.5 h-8 text-xs font-semibold"
                onClick={handleAddExpense}
                data-ocid="dashboard.add_expense_button"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Expense
              </Button>
            </div>

            <div className="divide-y divide-border/40">
              {isLoading ? (
                <div data-ocid="expense.loading_state">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <ExpenseRowSkeleton key={i} />
                  ))}
                </div>
              ) : expenses.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-16 text-center"
                  data-ocid="expense.empty_state"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-border/40 bg-muted/30">
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">No expenses yet</p>
                  <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                    Start logging your expenses to see your spending breakdown.
                  </p>
                  <Button
                    size="sm"
                    className="mt-4 gap-1.5"
                    onClick={handleAddExpense}
                    data-ocid="dashboard.add_expense_button"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add First Expense
                  </Button>
                </div>
              ) : (
                expenses
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime(),
                  )
                  .map((expense, idx) => {
                    const meta = getCategoryMeta(expense.category);
                    const rowNum = idx + 1;
                    return (
                      <div
                        key={expense.id.toString()}
                        className="group flex items-center gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors"
                        data-ocid={`expense.item.${rowNum}`}
                      >
                        {/* Category icon */}
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base ${meta.bgClass}`}
                        >
                          {CATEGORY_ICONS[expense.category]}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">
                              {expense.description || meta.label}
                            </p>
                            <span
                              className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${meta.bgClass} ${meta.textClass} ${meta.borderClass}`}
                            >
                              {meta.label}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {formatShortDate(expense.date)}
                          </p>
                        </div>

                        {/* Amount */}
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold">
                            {formatCurrency(expense.amount)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => handleEditExpense(expense)}
                            data-ocid={`expense.edit_button.${rowNum}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => setDeleteTarget(expense.id)}
                            data-ocid={`expense.delete_button.${rowNum}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Error state ─────────────────────────────── */}
        {(expensesQuery.isError || summaryQuery.isError) && (
          <div
            className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
            data-ocid="expense.error_state"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            Failed to load data. Please refresh the page.
          </div>
        )}
      </main>

      {/* ── Loading overlay for delete ───────────────── */}
      {deleteMutation.isPending && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm"
          data-ocid="expense.loading_state"
        >
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {/* ── Dialogs ─────────────────────────────────── */}
      <ExpenseDialog
        open={expenseDialogOpen}
        onOpenChange={(o) => {
          setExpenseDialogOpen(o);
          if (!o) setEditingExpense(null);
        }}
        monthYear={currentMonth}
        editingExpense={editingExpense}
      />

      <IncomeDialog
        open={incomeDialogOpen}
        onOpenChange={setIncomeDialogOpen}
        currentIncome={monthlyIncome}
        monthYear={currentMonth}
      />

      {/* ── Delete confirmation ──────────────────────── */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The expense will be permanently
              removed from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeleteTarget(null)}
              data-ocid="expense.cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void handleDeleteConfirm()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="expense.confirm_button"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
