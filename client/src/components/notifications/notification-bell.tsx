import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, X, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  isRead: boolean;
  createdAt: Date;
  relatedTo?: string;
  relatedId?: number;
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  const notifications: Notification[] = [
    {
      id: 1,
      title: "Ödeme Gecikti",
      message: "Elif Kaya'nın Kasım ayı kirası 15 gün gecikti. Lütfen iletişime geçin.",
      type: "error",
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      relatedTo: "payment",
      relatedId: 123
    },
    {
      id: 2,
      title: "Yeni Kira Ödemesi",
      message: "Ali Demir Aralık ayı kirasını ödedi. ₺25.000",
      type: "success",
      isRead: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      relatedTo: "payment",
      relatedId: 124
    },
    {
      id: 3,
      title: "Sözleşme Sona Eriyor",
      message: "Burak Şahin'in sözleşmesi 30 gün içinde sona erecek.",
      type: "warning",
      isRead: false,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      relatedTo: "contract",
      relatedId: 18
    },
    {
      id: 4,
      title: "Mülk Kayıt Güncellendi",
      message: "Barbaros Bulvarı daire bilgileri güncellendi.",
      type: "info",
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      relatedTo: "property",
      relatedId: 10
    }
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationBgColor = (type: string, isRead: boolean) => {
    const baseClasses = isRead ? "opacity-60" : "";
    switch (type) {
      case "error":
        return `bg-red-50 border-red-100 ${baseClasses}`;
      case "warning":
        return `bg-orange-50 border-orange-100 ${baseClasses}`;
      case "success":
        return `bg-green-50 border-green-100 ${baseClasses}`;
      default:
        return `bg-blue-50 border-blue-100 ${baseClasses}`;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[hsl(var(--kiratakip-neutral-800))]">
              Bildirimler
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-[hsl(var(--kiratakip-neutral-400))]">
              Bildirim bulunmuyor
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-l-4 cursor-pointer hover:bg-gray-50 transition-colors ${getNotificationBgColor(notification.type, notification.isRead)}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[hsl(var(--kiratakip-neutral-800))]">
                        {notification.title}
                      </p>
                      <p className="text-sm text-[hsl(var(--kiratakip-neutral-600))] mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-[hsl(var(--kiratakip-neutral-400))] mt-2">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="border-t border-gray-200 p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-[hsl(var(--kiratakip-primary))]"
            >
              Tümünü Gör
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}