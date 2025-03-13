
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Notes from "./pages/Notes";
import Expenses from "./pages/Expenses";
import Habits from "./pages/Habits";
import Focus from "./pages/Focus";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import RequireUser from "./components/RequireUser";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          
          <Route element={<RequireUser />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/focus" element={<Focus />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          {/* Redirects */}
          <Route path="/index" element={<Navigate to="/" replace />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
