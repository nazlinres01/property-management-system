import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getDaysOverdue(dueDate: Date | string): number {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const now = new Date();
  const diffTime = now.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

export function getPaymentStatusText(status: string, dueDate: Date | string): {
  text: string;
  variant: "default" | "secondary" | "destructive" | "outline";
} {
  const daysOverdue = getDaysOverdue(dueDate);
  
  if (status === "paid") {
    return { text: "Ödendi", variant: "secondary" };
  }
  
  if (status === "overdue" || daysOverdue > 0) {
    return { text: `${daysOverdue} gün gecikme`, variant: "destructive" };
  }
  
  if (status === "pending") {
    const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return { text: "Bugün", variant: "outline" };
    } else if (diffDays === 1) {
      return { text: "Yarın", variant: "outline" };
    } else if (diffDays > 1) {
      return { text: `${diffDays} gün kaldı`, variant: "default" };
    }
  }
  
  return { text: "Bekliyor", variant: "outline" };
}
