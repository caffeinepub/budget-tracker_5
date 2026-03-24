import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ExpenseCategory } from "../backend.d";
import type { ExpenseEntry } from "../backend.d";
import { useAddExpense, useUpdateExpense } from "../hooks/useQueries";
import { ALL_CATEGORIES, getCategoryMeta } from "../utils/categoryUtils";

interface ExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  monthYear: string;
  editingExpense?: ExpenseEntry | null;
}

const TODAY = new Date().toISOString().split("T")[0];

export function ExpenseDialog({
  open,
  onOpenChange,
  monthYear,
  editingExpense,
}: ExpenseDialogProps) {
  const addMutation = useAddExpense(monthYear);
  const updateMutation = useUpdateExpense(monthYear);

  const isEditing = !!editingExpense;
  const isPending = addMutation.isPending || updateMutation.isPending;

  const [category, setCategory] = useState<ExpenseCategory>(
    ExpenseCategory.food,
  );
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(TODAY);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill when editing (reset whenever editingExpense changes or dialog reopens)
  // biome-ignore lint/correctness/useExhaustiveDependencies: open is intentionally used to reset form on dialog reopen
  useEffect(() => {
    if (editingExpense) {
      setCategory(editingExpense.category);
      setAmount(String(editingExpense.amount));
      setDate(editingExpense.date);
      setDescription(editingExpense.description);
    } else {
      setCategory(ExpenseCategory.food);
      setAmount("");
      setDate(TODAY);
      setDescription("");
    }
    setErrors({});
  }, [editingExpense, open]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!amount || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
      errs.amount = "Enter a valid amount greater than 0";
    }
    if (!date) {
      errs.date = "Please select a date";
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const data = {
      category,
      amount: Number(amount),
      date,
      description: description.trim(),
    };

    if (isEditing && editingExpense) {
      await updateMutation.mutateAsync({ ...data, id: editingExpense.id });
    } else {
      await addMutation.mutateAsync(data);
    }

    onOpenChange(false);
  };

  const meta = getCategoryMeta(category);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-ocid="expense.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            {isEditing ? "Edit Expense" : "Add Expense"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of your expense."
              : "Log a new expense to your monthly budget."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 py-2">
          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="expense-category" className="text-sm font-medium">
              Category
            </Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as ExpenseCategory)}
            >
              <SelectTrigger
                id="expense-category"
                data-ocid="expense.category_select"
                className="border-input"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_CATEGORIES.map((cat) => {
                  const m = getCategoryMeta(cat);
                  return (
                    <SelectItem key={cat} value={cat}>
                      <span className="flex items-center gap-2">
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full"
                          style={{ background: m.hex }}
                        />
                        {m.label}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="expense-amount" className="text-sm font-medium">
              Amount (₹)
            </Label>
            <Input
              id="expense-amount"
              type="number"
              min="1"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors((p) => ({ ...p, amount: "" }));
              }}
              data-ocid="expense.amount_input"
              className={errors.amount ? "border-destructive" : ""}
            />
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label htmlFor="expense-date" className="text-sm font-medium">
              Date
            </Label>
            <Input
              id="expense-date"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors((p) => ({ ...p, date: "" }));
              }}
              data-ocid="expense.date_input"
              className={errors.date ? "border-destructive" : ""}
            />
            {errors.date && (
              <p className="text-xs text-destructive">{errors.date}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="expense-description"
              className="text-sm font-medium"
            >
              Description{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="expense-description"
              placeholder={`e.g. ${meta.label} expenses for this day`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              data-ocid="expense.description_input"
              className="resize-none"
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              data-ocid="expense.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="expense.submit_button"
              className="gap-2"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Add Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
