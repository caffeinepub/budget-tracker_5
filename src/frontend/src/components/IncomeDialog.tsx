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
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSetMonthlyIncome } from "../hooks/useQueries";

interface IncomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentIncome: number | null;
  monthYear: string;
}

export function IncomeDialog({
  open,
  onOpenChange,
  currentIncome,
  monthYear,
}: IncomeDialogProps) {
  const [income, setIncome] = useState("");
  const [error, setError] = useState("");
  const mutation = useSetMonthlyIncome(monthYear);

  useEffect(() => {
    if (open) {
      setIncome(currentIncome != null ? String(currentIncome) : "");
      setError("");
    }
  }, [open, currentIncome]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(income);
    if (!income || Number.isNaN(val) || val < 0) {
      setError("Please enter a valid income amount");
      return;
    }
    await mutation.mutateAsync(val);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm" data-ocid="income.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            Set Monthly Income
          </DialogTitle>
          <DialogDescription>
            Enter your total monthly income. This helps calculate your savings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="monthly-income" className="text-sm font-medium">
              Monthly Income (₹)
            </Label>
            <Input
              id="monthly-income"
              type="number"
              min="0"
              step="100"
              placeholder="e.g. 85000"
              value={income}
              onChange={(e) => {
                setIncome(e.target.value);
                if (error) setError("");
              }}
              data-ocid="income.input"
              className={error ? "border-destructive" : ""}
              autoFocus
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
              data-ocid="expense.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              data-ocid="income.save_button"
              className="gap-2"
            >
              {mutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Save Income
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
