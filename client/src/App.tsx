import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/landing";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Tenants from "@/pages/tenants";
import Landlords from "@/pages/landlords";
import Properties from "@/pages/properties";
import Contracts from "@/pages/contracts";
import Payments from "@/pages/payments";
import Reports from "@/pages/reports";
import Sidebar from "@/components/layout/sidebar";
import { useState } from "react";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // For demo purposes, we'll show the dashboard. In production, this would check authentication
  const showDashboard = true;

  if (!showDashboard) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Landing />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-[hsl(var(--kiratakip-surface))]">
          <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="lg:ml-64 min-h-screen">
            <Switch>
              <Route path="/" component={() => <Dashboard onMenuClick={() => setSidebarOpen(!sidebarOpen)} />} />
              <Route path="/dashboard" component={() => <Dashboard onMenuClick={() => setSidebarOpen(!sidebarOpen)} />} />
              <Route path="/tenants" component={() => <Tenants onMenuClick={() => setSidebarOpen(!sidebarOpen)} />} />
              <Route path="/landlords" component={() => <Landlords onMenuClick={() => setSidebarOpen(!sidebarOpen)} />} />
              <Route path="/properties" component={() => <Properties onMenuClick={() => setSidebarOpen(!sidebarOpen)} />} />
              <Route path="/contracts" component={() => <Contracts onMenuClick={() => setSidebarOpen(!sidebarOpen)} />} />
              <Route path="/payments" component={() => <Payments onMenuClick={() => setSidebarOpen(!sidebarOpen)} />} />
              <Route path="/reports" component={() => <Reports onMenuClick={() => setSidebarOpen(!sidebarOpen)} />} />
              <Route path="/landing" component={Landing} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
