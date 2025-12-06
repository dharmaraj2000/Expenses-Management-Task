import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Expense {
  id: string;
  userId: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private expensesSubject = new BehaviorSubject<Expense[]>(this.getStoredExpenses());
  public expenses$ = this.expensesSubject.asObservable();

  constructor() {}

  getExpensesByUser(userId: string): Expense[] {
    return this.getStoredExpenses().filter(exp => exp.userId === userId);
  }

  addExpense(userId: string, category: string, amount: number, description: string, date: string): void {
    const expenses = this.getStoredExpenses();
    const newExpense: Expense = {
      id: this.generateId(),
      userId,
      category,
      amount,
      description,
      date,
      createdAt: new Date().toISOString()
    };

    expenses.push(newExpense);
    this.saveExpenses(expenses);
    this.expensesSubject.next(expenses);
  }

  updateExpense(expenseId: string, category: string, amount: number, description: string, date: string): void {
    const expenses = this.getStoredExpenses();
    const expense = expenses.find(e => e.id === expenseId);

    if (expense) {
      expense.category = category;
      expense.amount = amount;
      expense.description = description;
      expense.date = date;
      this.saveExpenses(expenses);
      this.expensesSubject.next(expenses);
    }
  }

  deleteExpense(expenseId: string): void {
    const expenses = this.getStoredExpenses().filter(e => e.id !== expenseId);
    this.saveExpenses(expenses);
    this.expensesSubject.next(expenses);
  }

  getExpenseSummary(userId: string): { category: string; total: number }[] {
    const expenses = this.getExpensesByUser(userId);
    const summary: { [key: string]: number } = {};

    expenses.forEach(exp => {
      if (!summary[exp.category]) {
        summary[exp.category] = 0;
      }
      summary[exp.category] += exp.amount;
    });

    return Object.entries(summary).map(([category, total]) => ({
      category,
      total
    }));
  }

  getTotalExpenses(userId: string): number {
    return this.getExpensesByUser(userId).reduce((sum, exp) => sum + exp.amount, 0);
  }

  private getStoredExpenses(): Expense[] {
    const expenses = localStorage.getItem('expenses');
    return expenses ? JSON.parse(expenses) : [];
  }

  private saveExpenses(expenses: Expense[]): void {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }

  private generateId(): string {
    return 'expense_' + Math.random().toString(36).substring(2, 9);
  }
}
