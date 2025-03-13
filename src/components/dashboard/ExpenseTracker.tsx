
import React, { useState } from 'react';
import { BarChart4, Plus, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import DashboardCard from '../ui/DashboardCard';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Expense } from '@/types';

const CATEGORIES = [
  'Food & Drinks',
  'Shopping',
  'Housing',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Other'
];

const COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
  '#8b5cf6', '#06b6d4', '#6b7280'
];

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('focusflow-expenses', []);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      amount: parsedAmount,
      category,
      description,
      date: new Date(),
    };
    
    setExpenses([newExpense, ...expenses]);
    setAmount('');
    setDescription('');
  };

  const deleteExpense = (expenseId: string) => {
    setExpenses(expenses.filter(expense => expense.id !== expenseId));
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Data for the chart
  const categoryTotals = CATEGORIES.map(cat => {
    const total = expenses
      .filter(expense => expense.category === cat)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      category: cat,
      total
    };
  }).filter(item => item.total > 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <DashboardCard 
      title="Expense Tracker" 
      icon={<BarChart4 />}
      className="col-span-2 md:col-span-1"
    >
      <form onSubmit={addExpense} className="mb-4 grid grid-cols-12 gap-2">
        <div className="col-span-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            min="0.01"
            step="0.01"
            className="w-full px-3 py-2 bg-white/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="col-span-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-white/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="col-span-4">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full px-3 py-2 bg-white/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="col-span-2">
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors duration-200 focus-ring flex items-center justify-center"
          >
            <Plus size={20} />
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <div className="border border-border rounded-lg p-4 bg-white/50">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Spending</h3>
          <p className="text-2xl font-semibold">{formatCurrency(totalExpenses)}</p>
        </div>

        {/* Chart Section */}
        {categoryTotals.length > 0 ? (
          <div className="border border-border rounded-lg p-4 bg-white/50 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryTotals}>
                <XAxis 
                  dataKey="category" 
                  tickFormatter={(value) => value.split(' ')[0]}
                  fontSize={12}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value}`}
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value as number), 'Total']}
                  labelFormatter={(label) => `Category: ${label}`}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {categoryTotals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[CATEGORIES.indexOf(entry.category) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="border border-border rounded-lg p-8 bg-white/50 text-center text-muted-foreground">
            No expense data to display yet
          </div>
        )}

        {/* Recent Expenses */}
        <div>
          <h3 className="font-medium mb-2">Recent Expenses</h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
            {expenses.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                No expenses yet. Add some expenses to get started!
              </p>
            ) : (
              expenses.slice(0, 5).map(expense => (
                <div 
                  key={expense.id}
                  className="px-4 py-3 rounded-lg border border-border bg-white flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{expense.description || expense.category}</p>
                    <p className="text-xs text-muted-foreground">
                      {expense.category} • {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{formatCurrency(expense.amount)}</span>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="text-muted-foreground hover:text-destructive focus-ring rounded"
                      aria-label="Delete expense"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default ExpenseTracker;
