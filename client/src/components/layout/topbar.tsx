import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, Plus } from "lucide-react";
import NotificationBell from "@/components/notifications/notification-bell";

interface TopbarProps {
  title: string;
  onMenuClick: () => void;
  onQuickAction?: () => void;
  quickActionLabel?: string;
}

export default function Topbar({ 
  title, 
  onMenuClick, 
  onQuickAction, 
  quickActionLabel = "Yeni Kayıt" 
}: TopbarProps) {
  return (
    <header className="bg-white shadow-sm border-b border-[hsl(var(--kiratakip-neutral-100))] sticky top-0 z-20">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden text-[hsl(var(--kiratakip-neutral-400))] hover:text-[hsl(var(--kiratakip-neutral-800))]"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl font-bold text-[hsl(var(--kiratakip-neutral-800))]">
              {title}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Input
                type="text"
                placeholder="Ara..."
                className="w-80 pl-10 pr-4 border-[hsl(var(--kiratakip-neutral-100))] focus:ring-2 focus:ring-[hsl(var(--kiratakip-primary))]/20 focus:border-[hsl(var(--kiratakip-primary))]"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--kiratakip-neutral-400))] h-4 w-4" />
            </div>

            {/* Notifications */}
            <NotificationBell />

            {/* Quick Action */}
            {onQuickAction && (
              <Button
                onClick={onQuickAction}
                className="bg-[hsl(var(--kiratakip-primary))] text-white hover:bg-[hsl(var(--kiratakip-primary))]/90 font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                {quickActionLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
