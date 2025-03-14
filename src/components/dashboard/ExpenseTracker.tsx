
import React, { useState } from 'react';
import { BarChart4, Plus, Trash2, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import DashboardCard from '../ui/DashboardCard';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Expense } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

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

const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'INR', symbol: '₹' },
  { code: 'CAD', symbol: 'C$' },
  { code: 'AUD', symbol: 'A$' },
];

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('focusflow-expenses', []);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [currencyCode, setCurrencyCode] = useLocalStorage<string>('focusflow-currency', 'USD');
  const isMobile = useIsMobile();
  
  const currentCurrency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];

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
      currency: currencyCode
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
    // Ensure currencyCode is a string, not an object
    const code = typeof currencyCode === 'string' ? currencyCode : 'USD';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <DashboardCard 
      title="Expense Tracker" 
      icon={<BarChart4 />}
      className="col-span-2 md:col-span-1"
    >
      <form onSubmit={addExpense} className={`mb-4 grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-12 gap-2'}`}>
        <div className={isMobile ? 'w-full' : 'col-span-3'}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign size={16} className="text-muted-foreground" />
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              min="0.01"
              step="0.01"
              className="w-full pl-9 pr-3 py-2 bg-white/80 dark:bg-gray-700/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        <div className={isMobile ? 'w-full' : 'col-span-3'}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-white/80 dark:bg-gray-700/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className={isMobile ? 'w-full' : 'col-span-4'}>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full px-3 py-2 bg-white/80 dark:bg-gray-700/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
        <div className={isMobile ? 'w-full' : 'col-span-2'}>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200"
            variant="default"
          >
            <Plus size={20} />
            {isMobile && <span className="ml-2">Add Expense</span>}
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        <div className={`flex ${isMobile ? 'flex-col' : 'items-center justify-between'} mb-4 gap-4`}>
          <div className="border border-border rounded-lg p-4 bg-white/80 dark:bg-gray-700/50 w-full">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Spending</h3>
            <p className="text-2xl font-semibold">{formatCurrency(totalExpenses)}</p>
          </div>
          
          <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} w-full`}>
            <label className={`${isMobile ? 'mb-2' : 'mr-2'} text-sm font-medium`}>Currency:</label>
            <select
              value={currencyCode}
              onChange={(e) => setCurrencyCode(e.target.value)}
              className="px-3 py-2 bg-white/80 dark:bg-gray-700/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary w-full"
            >
              {CURRENCIES.map(curr => (
                <option key={curr.code} value={curr.code}>
                  {curr.code} ({curr.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chart Section */}
        {categoryTotals.length > 0 ? (
          <div className="border border-border rounded-lg p-4 bg-white/80 dark:bg-gray-700/50 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryTotals} margin={isMobile ? { top: 5, right: 5, bottom: 20, left: 5 } : {}}>
                <XAxis 
                  dataKey="category" 
                  tickFormatter={(value) => value.split(' ')[0]}
                  fontSize={12}
                  stroke="#888888"
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? "end" : "middle"}
                  height={60}
                />
                <YAxis 
                  tickFormatter={(value) => `${currentCurrency.symbol}${value}`}
                  fontSize={12}
                  stroke="#888888"
                  width={isMobile ? 40 : 60}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value as number), 'Total']}
                  labelFormatter={(label) => `Category: ${label}`}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#ddd' }}
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
          <div className="border border-border rounded-lg p-8 bg-white/80 dark:bg-gray-700/50 text-center text-muted-foreground">
            No expense data to display yet
          </div>
        )}

        {/* Recent Expenses */}
        <div>
          <h3 className="font-medium mb-2">Recent Expenses</h3>
          <ScrollArea className="h-[250px] rounded-md border border-border bg-white/80 dark:bg-gray-700/50">
            <div className="space-y-2 p-4">
              {expenses.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  No expenses yet. Add some expenses to get started!
                </p>
              ) : (
                expenses.map(expense => (
                  <div 
                    key={expense.id}
                    className="px-4 py-3 rounded-lg border border-border bg-white/80 dark:bg-gray-700/50 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{expense.description || expense.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {expense.category} • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{formatCurrency(expense.amount)}</span>
                      <Button
                        onClick={() => deleteExpense(expense.id)}
                        className="text-muted-foreground hover:text-destructive focus-ring rounded p-1"
                        variant="ghost"
                        size="sm"
                        aria-label="Delete expense"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </DashboardCard>
  );
};

export default ExpenseTracker;
