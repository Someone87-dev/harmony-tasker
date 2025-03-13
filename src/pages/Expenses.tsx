
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { BarChart4, Plus, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
];

const COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
  '#8b5cf6', '#06b6d4', '#6b7280'
];

const Expenses = () => {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('focusflow-expenses', []);
  const [currency, setCurrency] = useLocalStorage('focusflow-currency', CURRENCIES[0]);
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
      currency: currency.code,
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2
    }).format(value);
  };

  const handleCurrencyChange = (value: string) => {
    const selectedCurrency = CURRENCIES.find(c => c.code === value) || CURRENCIES[0];
    setCurrency(selectedCurrency);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="pb-16 pt-4 px-4 md:pl-16 transition-all duration-300">
        <div className="max-w-3xl mx-auto">
          <header className="py-8 md:py-12">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
                <BarChart4 className="h-8 w-8" />
                Expense Tracker
              </h1>
              <p className="text-muted-foreground mt-2">Track and manage your expenses</p>
            </div>
          </header>
          
          <div className="space-y-8 animate-fade-in">
            <div className="glass-card rounded-xl p-6 border border-border bg-white/50">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Add New Expense</h2>
                <div className="w-32">
                  <Select onValueChange={handleCurrencyChange} defaultValue={currency.code}>
                    <SelectTrigger>
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map(curr => (
                        <SelectItem key={curr.code} value={curr.code}>
                          {curr.symbol} {curr.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <form onSubmit={addExpense} className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-3">
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {currency.symbol}
                    </span>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      className="pl-7"
                    />
                  </div>
                </div>
                
                <div className="col-span-12 md:col-span-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-span-12 md:col-span-5">
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Description
                  </label>
                  <Input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's this expense for?"
                  />
                </div>
                
                <div className="col-span-12">
                  <Button type="submit" className="w-full">
                    <Plus size={20} className="mr-2" />
                    Add Expense
                  </Button>
                </div>
              </form>
            </div>

            <div className="glass-card rounded-xl p-6 border border-border bg-white/50">
              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              <Separator className="mb-4" />
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Spending</h3>
                <p className="text-3xl font-semibold">{formatCurrency(totalExpenses)}</p>
              </div>

              {/* Chart Section */}
              {categoryTotals.length > 0 ? (
                <div className="border border-border rounded-lg p-4 bg-white/50 h-[250px] mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryTotals}>
                      <XAxis 
                        dataKey="category" 
                        tickFormatter={(value) => value.split(' ')[0]}
                        fontSize={12}
                      />
                      <YAxis 
                        tickFormatter={(value) => `${currency.symbol}${value}`}
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
                <div className="border border-border rounded-lg p-8 bg-white/50 text-center text-muted-foreground mb-6">
                  <BarChart4 className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                  <p>No expense data to display yet</p>
                </div>
              )}

              {/* Recent Expenses */}
              <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
              <Separator className="mb-4" />
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {expenses.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No expenses yet. Add some expenses to get started!</p>
                  </div>
                ) : (
                  expenses.map(expense => (
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
        </div>
      </main>
    </div>
  );
};

export default Expenses;
