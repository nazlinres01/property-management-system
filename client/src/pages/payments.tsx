import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Topbar from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Calendar, DollarSign, CheckCircle, Filter, Download, ArrowUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatDate, getPaymentStatusText } from "@/lib/utils";
import type { PaymentWithDetails } from "@shared/schema";

interface PaymentsProps {
  onMenuClick?: () => void;
}

export default function Payments({ onMenuClick }: PaymentsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "paid" | "overdue">("all");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "tenant">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: payments, isLoading } = useQuery({
    queryKey: ["/api/payments"],
  });

  const { data: pendingPayments } = useQuery({
    queryKey: ["/api/payments/pending"],
  });

  const { data: overduePayments } = useQuery({
    queryKey: ["/api/payments/overdue"],
  });

  const filteredPayments = (payments || []).filter((payment: PaymentWithDetails) => {
    const matchesSearch = 
      payment.tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.contract.property.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "all") return matchesSearch;
    
    return matchesSearch && payment.status === filterStatus;
  });

  const getStatusBadge = (payment: PaymentWithDetails) => {
    const { text, variant } = getPaymentStatusText(payment.status, payment.dueDate);
    
    const variantClasses = {
      default: "bg-gray-100 text-gray-700",
      secondary: "bg-green-100 text-green-700",
      destructive: "bg-red-100 text-red-700",
      outline: "bg-orange-100 text-orange-700",
    };
    
    return (
      <Badge className={variantClasses[variant] + " hover:" + variantClasses[variant]}>
        {text}
      </Badge>
    );
  };

  const totalPaidAmount = (payments || []).filter((p: PaymentWithDetails) => p.status === "paid")
    .reduce((sum: number, p: PaymentWithDetails) => sum + parseFloat(p.amount), 0);

  const totalPendingAmount = (pendingPayments || []).reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0);

  return (
    <div className="min-h-screen">
      <Topbar
        title="Ödemeler"
        onMenuClick={onMenuClick || (() => {})}
      />

      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))] mb-1">
                    Toplam Tahsilat
                  </p>
                  <p className="text-2xl font-bold text-[hsl(var(--kiratakip-neutral-800))]">
                    {formatCurrency(totalPaidAmount)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-[hsl(var(--kiratakip-secondary))] h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))] mb-1">
                    Bekleyen Tutar
                  </p>
                  <p className="text-2xl font-bold text-[hsl(var(--kiratakip-neutral-800))]">
                    {formatCurrency(totalPendingAmount)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Calendar className="text-[hsl(var(--kiratakip-accent))] h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))] mb-1">
                    Geciken Ödeme
                  </p>
                  <p className="text-2xl font-bold text-[hsl(var(--kiratakip-neutral-800))]">
                    {overduePayments?.length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-red-500 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 border-[hsl(var(--kiratakip-neutral-100))]">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--kiratakip-neutral-400))] h-4 w-4" />
                <Input
                  placeholder="Ödeme ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-[hsl(var(--kiratakip-neutral-100))]"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                  className={filterStatus === "all" ? "bg-[hsl(var(--kiratakip-primary))]" : ""}
                >
                  Tümü
                </Button>
                <Button
                  variant={filterStatus === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("pending")}
                  className={filterStatus === "pending" ? "bg-[hsl(var(--kiratakip-primary))]" : ""}
                >
                  Bekleyen
                </Button>
                <Button
                  variant={filterStatus === "paid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("paid")}
                  className={filterStatus === "paid" ? "bg-[hsl(var(--kiratakip-primary))]" : ""}
                >
                  Ödenen
                </Button>
                <Button
                  variant={filterStatus === "overdue" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("overdue")}
                  className={filterStatus === "overdue" ? "bg-[hsl(var(--kiratakip-primary))]" : ""}
                >
                  Geciken
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[hsl(var(--kiratakip-neutral-800))]">
              Ödeme Listesi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[hsl(var(--kiratakip-neutral-50))]">
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      Kiracı
                    </TableHead>
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      Mülk
                    </TableHead>
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      Tutar
                    </TableHead>
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      Vade Tarihi
                    </TableHead>
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      Ödeme Tarihi
                    </TableHead>
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      Durum
                    </TableHead>
                    <TableHead className="text-center text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      İşlemler
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="text-[hsl(var(--kiratakip-neutral-400))]">
                          Yükleniyor...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="text-[hsl(var(--kiratakip-neutral-400))]">
                          {searchTerm || filterStatus !== "all" 
                            ? "Arama kriterine uygun ödeme bulunamadı" 
                            : "Henüz ödeme kaydı bulunmuyor"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment: PaymentWithDetails) => (
                      <TableRow
                        key={payment.id}
                        className="hover:bg-[hsl(var(--kiratakip-neutral-50))] transition-colors"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium text-[hsl(var(--kiratakip-neutral-800))]">
                              {payment.tenant.name}
                            </p>
                            <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                              {payment.tenant.phone}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-[hsl(var(--kiratakip-neutral-800))]">
                              {payment.contract.property.address}
                            </p>
                            <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                              {payment.contract.property.type}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-semibold text-[hsl(var(--kiratakip-neutral-800))]">
                            {formatCurrency(payment.amount)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-[hsl(var(--kiratakip-neutral-600))]">
                            {formatDate(payment.dueDate)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-[hsl(var(--kiratakip-neutral-600))]">
                            {payment.paidDate ? formatDate(payment.paidDate) : "-"}
                          </p>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(payment)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-2">
                            {payment.status === "pending" && (
                              <Button
                                size="sm"
                                className="bg-[hsl(var(--kiratakip-secondary))] text-white hover:bg-[hsl(var(--kiratakip-secondary))]/90"
                              >
                                Öde
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
