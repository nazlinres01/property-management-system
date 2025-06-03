import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/tenants" component={Tenants} />
      <Route path="/landlords" component={Landlords} />
      <Route path="/properties" component={Properties} />
      <Route path="/contracts" component={Contracts} />
      <Route path="/payments" component={Payments} />
      <Route path="/reports" component={Reports} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-[hsl(var(--kiratakip-surface))]">
          <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="lg:ml-64 min-h-screen">
            <Router />
          </main>
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
