
export interface Student {
  id: string;
  name: string;
  mobile: string;
  isActive: boolean;
}

export interface ShoppingItem {
  id: string;
  studentId: string;
  date: string;
  item: string;
  amount: number;
}

export interface MealRecord {
  id: string;
  studentId: string;
  date: string;
  mealCount: number;
}

export interface DailyMenu {
  date: string;
  lunch: string;
  dinner: string;
}

export interface MonthSummary {
  month: string;
  totalSpent: number;
  totalMeals: number;
  mealRate: number;
  studentSummaries: StudentMonthlySummary[];
  shoppingItems?: ShoppingItem[];
  mealRecords?: MealRecord[];
}

export interface StudentMonthlySummary {
  studentId: string;
  studentName: string;
  mealsEaten: number;
  totalSpent: number;
  payableAmount: number;
  balance: number;
}

export type AppView = 'DASHBOARD' | 'MENU' | 'SHOPPING' | 'MEALS' | 'STUDENTS' | 'MANAGER' | 'HISTORY';
