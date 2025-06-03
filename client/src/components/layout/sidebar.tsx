import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  UserRoundCheck,
  Building,
  FileText,
  CreditCard,
  PieChart,
  Home,
  Settings,
  X,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Kiracılar", href: "/tenants", icon: Users },
  { name: "Ev Sahipleri", href: "/landlords", icon: UserRoundCheck },
  { name: "Mülkler", href: "/properties", icon: Building },
  { name: "Sözleşmeler", href: "/contracts", icon: FileText },
  { name: "Ödemeler", href: "/payments", icon: CreditCard },
  { name: "Raporlar", href: "/reports", icon: PieChart },
  { name: "AI & Yapay Zeka", href: "/ai-dashboard", icon: Brain },
  { name: "Ayarlar", href: "/settings", icon: Settings },
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [location] = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-30 transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-[hsl(var(--kiratakip-neutral-100))]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[hsl(var(--kiratakip-primary))] rounded-lg flex items-center justify-center">
                <Home className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[hsl(var(--kiratakip-neutral-800))]">
                  KiraTakip
                </h1>
                <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                  Emlak Yönetim Sistemi
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => window.innerWidth < 1024 && onToggle()}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium",
                  isActive
                    ? "bg-[hsl(var(--kiratakip-primary))] text-white"
                    : "hover:bg-[hsl(var(--kiratakip-neutral-50))] text-[hsl(var(--kiratakip-neutral-400))]"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-[hsl(var(--kiratakip-neutral-50))] rounded-lg p-4 hover:bg-[hsl(var(--kiratakip-neutral-100))] transition-colors cursor-pointer">
            <Link href="/settings" className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-[hsl(var(--kiratakip-primary))] text-white font-semibold">
                  NE
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-[hsl(var(--kiratakip-neutral-800))] truncate">
                  Nazlı Nur Esmeray
                </p>
                <p className="text-xs text-[hsl(var(--kiratakip-neutral-400))]">
                  Sistem Yöneticisi
                </p>
              </div>
              <Settings className="h-4 w-4 text-[hsl(var(--kiratakip-neutral-400))] hover:text-[hsl(var(--kiratakip-neutral-800))]" />
            </Link>
          </div>
          
          {/* Logout Button */}
          <div className="mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-[hsl(var(--kiratakip-neutral-400))] hover:text-red-600 hover:bg-red-50"
              onClick={() => {
                fetch("/api/auth/logout", { method: "POST" })
                  .then(() => {
                    window.location.href = "/";
                  });
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
