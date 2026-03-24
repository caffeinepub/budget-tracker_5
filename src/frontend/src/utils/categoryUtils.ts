import { ExpenseCategory } from "../backend.d";

export interface CategoryMeta {
  label: string;
  color: string; // CSS variable based class
  bgClass: string;
  textClass: string;
  borderClass: string;
  hex: string; // For inline styles where needed
}

export const CATEGORY_META: Record<ExpenseCategory, CategoryMeta> = {
  [ExpenseCategory.food]: {
    label: "Food",
    color: "food",
    bgClass: "bg-category-food/15",
    textClass: "text-category-food",
    borderClass: "border-category-food/30",
    hex: "oklch(0.70 0.18 50)",
  },
  [ExpenseCategory.transport]: {
    label: "Transport",
    color: "transport",
    bgClass: "bg-category-transport/15",
    textClass: "text-category-transport",
    borderClass: "border-category-transport/30",
    hex: "oklch(0.62 0.17 230)",
  },
  [ExpenseCategory.rent]: {
    label: "Rent",
    color: "rent",
    bgClass: "bg-category-rent/15",
    textClass: "text-category-rent",
    borderClass: "border-category-rent/30",
    hex: "oklch(0.65 0.20 295)",
  },
  [ExpenseCategory.entertainment]: {
    label: "Entertainment",
    color: "entertainment",
    bgClass: "bg-category-entertainment/15",
    textClass: "text-category-entertainment",
    borderClass: "border-category-entertainment/30",
    hex: "oklch(0.68 0.22 340)",
  },
  [ExpenseCategory.health]: {
    label: "Health",
    color: "health",
    bgClass: "bg-category-health/15",
    textClass: "text-category-health",
    borderClass: "border-category-health/30",
    hex: "oklch(0.68 0.19 145)",
  },
  [ExpenseCategory.others]: {
    label: "Others",
    color: "others",
    bgClass: "bg-category-others/15",
    textClass: "text-category-others",
    borderClass: "border-category-others/30",
    hex: "oklch(0.60 0.04 250)",
  },
};

export function getCategoryMeta(cat: ExpenseCategory): CategoryMeta {
  return CATEGORY_META[cat] ?? CATEGORY_META[ExpenseCategory.others];
}

export const ALL_CATEGORIES = Object.values(ExpenseCategory);
