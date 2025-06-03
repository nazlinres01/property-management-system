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

  // Check if user wants to see the landing page (default) or dashboard
  const showLandingPage = true;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          {/* Landing page as homepage */}
          <Route path="/" component={Landing} />
          
          {/* Dashboard routes with sidebar */}
          <Route path="/dashboard">
            <div className="min-h-screen bg-[hsl(var(--kiratakip-surface))]">
              <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
              <main className="lg:ml-64 min-h-screen">
                <Dashboard onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
              </main>
            </div>
          </Route>
          
          <Route path="/tenants">
            <div className="min-h-screen bg-[hsl(var(--kiratakip-surface))]">
              <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
              <main className="lg:ml-64 min-h-screen">
                <Tenants onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
              </main>
            </div>
          </Route>
          
          <Route path="/landlords">
            <div className="min-h-screen bg-[hsl(var(--kiratakip-surface))]">
              <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
              <main className="lg:ml-64 min-h-screen">
                <Landlords onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
              </main>
            </div>
          </Route>
          
          <Route path="/properties">
            <div className="min-h-screen bg-[hsl(var(--kiratakip-surface))]">
              <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
              <main className="lg:ml-64 min-h-screen">
                <Properties onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
              </main>
            </div>
          </Route>
          
          <Route path="/contracts">
            <div className="min-h-screen bg-[hsl(var(--kiratakip-surface))]">
              <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
              <main className="lg:ml-64 min-h-screen">
                <Contracts onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
              </main>
            </div>
          </Route>
          
          <Route path="/payments">
            <div className="min-h-screen bg-[hsl(var(--kiratakip-surface))]">
              <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
              <main className="lg:ml-64 min-h-screen">
                <Payments onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
              </main>
            </div>
          </Route>
          
          <Route path="/reports">
            <div className="min-h-screen bg-[hsl(var(--kiratakip-surface))]">
              <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
              <main className="lg:ml-64 min-h-screen">
                <Reports onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
              </main>
            </div>
          </Route>
          
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
