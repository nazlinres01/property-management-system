import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/landing";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard-simple";
import TenantManagement from "@/pages/tenant-management";
import Landlords from "@/pages/landlords";
import Properties from "@/pages/properties";
import Contracts from "@/pages/contracts";
import Payments from "@/pages/payments";
import Reports from "@/pages/reports";
import Features from "@/pages/features";
import About from "@/pages/about";
import AIDashboard from "@/pages/ai-dashboard";
import Settings from "@/pages/settings";
import Sidebar from "@/components/layout/sidebar";
import ChatWidget from "@/components/chat/chat-widget";
import { useState } from "react";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Check if user wants to see the landing page (default) or dashboard
  const showLandingPage = true;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          {/* Landing page as homepage */}
          <Route path="/" component={Landing} />
          
          {/* Static pages */}
          <Route path="/features" component={Features} />
          <Route path="/about" component={About} />
          
          {/* Dashboard routes with sidebar */}
          <Route path="/dashboard">
            <div className="min-h-screen bg-[hsl(var(--kiratakip-surface))]">
              <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
              <main className="lg:ml-64 min-h-screen">
                <Dashboard 
                  onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                  onOpenChat={() => setChatOpen(true)}
                />
              </main>
            </div>
          </Route>
          
          <Route path="/tenants">
            <div className="min-h-screen bg-[hsl(var(--kiratakip-surface))]">
              <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
              <main className="lg:ml-64 min-h-screen">
                <TenantManagement onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
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
          
          <Route path="/ai-dashboard">
            <div className="min-h-screen bg-[hsl(var(--kiratakip-surface))]">
              <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
              <main className="lg:ml-64 min-h-screen">
                <AIDashboard onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
              </main>
            </div>
          </Route>
          
          <Route path="/settings">
            <div className="min-h-screen bg-[hsl(var(--kiratakip-surface))]">
              <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
              <main className="lg:ml-64 min-h-screen">
                <Settings onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
              </main>
            </div>
          </Route>
          
          <Route component={NotFound} />
        </Switch>
        
        {/* Global Chat Widget - Available on all dashboard pages */}
        <ChatWidget 
          isOpen={chatOpen} 
          onToggle={() => setChatOpen(!chatOpen)} 
        />
        
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
