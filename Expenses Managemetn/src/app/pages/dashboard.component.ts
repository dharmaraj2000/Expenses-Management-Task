import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { ExpenseService, Expense } from '../services/expense.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-900">ExpenseTracker</h1>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-gray-700 font-medium">{{ currentUser()?.name }}</span>
            <button
              (click)="logout()"
              class="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Total Expenses -->
          <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm font-medium">Total Expenses</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">\${{ totalExpenses() | number: '1.2-2' }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Categories Count -->
          <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm font-medium">Categories</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ getCategories().length }}</p>
              </div>
              <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 012 12V7a2 2 0 012-2z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Total Transactions -->
          <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-600">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm font-medium">Total Entries</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ expenses().length }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Expense Section -->
        <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Add New Expense</h2>
          <form [formGroup]="expenseForm" (ngSubmit)="addExpense()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                formControlName="category"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                formControlName="amount"
                placeholder="0.00"
                step="0.01"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                formControlName="description"
                placeholder="e.g., Lunch"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                formControlName="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div class="flex items-end">
              <button
                type="submit"
                [disabled]="expenseForm.invalid"
                class="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </form>
        </div>

        <!-- Expenses List -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Expense Table -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-bold text-gray-900">Recent Expenses</h2>
              </div>

              <div *ngIf="expenses().length === 0" class="px-6 py-12 text-center">
                <p class="text-gray-500">No expenses yet. Add your first expense above!</p>
              </div>

              <div *ngIf="expenses().length > 0" class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
                      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Category</th>
                      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Description</th>
                      <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700">Amount</th>
                      <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let expense of expenses()" class="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td class="px-6 py-4 text-sm text-gray-900">{{ formatDate(expense.date) }}</td>
                      <td class="px-6 py-4">
                        <span class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          {{ expense.category }}
                        </span>
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-600">{{ expense.description }}</td>
                      <td class="px-6 py-4 text-right text-sm font-semibold text-gray-900">\${{ expense.amount | number: '1.2-2' }}</td>
                      <td class="px-6 py-4 text-center">
                        <button
                          (click)="deleteExpense(expense.id)"
                          class="text-red-600 hover:text-red-800 text-sm font-medium transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Category Summary -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-6">Spending by Category</h3>
            <div *ngIf="categorySummary().length === 0" class="text-center py-8">
              <p class="text-gray-500">No expense data yet</p>
            </div>

            <div *ngIf="categorySummary().length > 0" class="space-y-4">
              <div *ngFor="let category of categorySummary()" class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700">{{ category.category }}</span>
                  <span class="text-sm font-bold text-gray-900">\${{ category.total | number: '1.2-2' }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all"
                    [style.width.%]="getPercentage(category.total)"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser = signal<User | null>(null);
  expenses = signal<Expense[]>([]);
  categorySummary = signal<{ category: string; total: number }[]>([]);
  totalExpenses = signal(0);

  expenseForm: FormGroup;

  constructor(
    private authService: AuthService,
    private expenseService: ExpenseService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.expenseForm = this.fb.group({
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required],
      date: [this.getTodayDate(), Validators.required]
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUser.set(user);
      this.loadExpenses(user.id);
    }
  }

  loadExpenses(userId: string): void {
    const userExpenses = this.expenseService.getExpensesByUser(userId);
    this.expenses.set(userExpenses);
    this.totalExpenses.set(this.expenseService.getTotalExpenses(userId));
    this.categorySummary.set(this.expenseService.getExpenseSummary(userId));
  }

  addExpense(): void {
    const user = this.authService.getCurrentUser();
    if (!user || this.expenseForm.invalid) {
      return;
    }

    const { category, amount, description, date } = this.expenseForm.value;
    this.expenseService.addExpense(user.id, category, amount, description, date);

    this.expenseForm.reset({
      category: '',
      amount: '',
      description: '',
      date: this.getTodayDate()
    });

    this.loadExpenses(user.id);
  }

  deleteExpense(expenseId: string): void {
    this.expenseService.deleteExpense(expenseId);
    const user = this.authService.getCurrentUser();
    if (user) {
      this.loadExpenses(user.id);
    }
  }

  getCategories(): string[] {
    const categories = new Set(this.expenses().map(e => e.category));
    return Array.from(categories);
  }

  getPercentage(amount: number): number {
    const max = Math.max(0, ...this.categorySummary().map(c => c.total));
    return max > 0 ? (amount / max) * 100 : 0;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
