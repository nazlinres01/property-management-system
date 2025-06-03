import { useQuery } from "@tanstack/react-query";
import Topbar from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  FileText,
  Download,
  TrendingUp,
  Users,
  Building,
  CreditCard,
  Calendar,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { PropertyWithDetails, PaymentWithDetails } from "@shared/schema";

interface ReportsProps {
  onMenuClick?: () => void;
}

export default function Reports({ onMenuClick }: ReportsProps) {
  const { data: properties } = useQuery({
    queryKey: ["/api/properties"],
  });

  const { data: payments } = useQuery({
    queryKey: ["/api/payments"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  // Calculate monthly revenue data
  const getMonthlyRevenueData = () => {
    if (!payments) return [];
    
    const monthlyData: { [key: string]: number } = {};
    const paidPayments = payments.filter((p: PaymentWithDetails) => p.status === "paid");
    
    paidPayments.forEach((payment: PaymentWithDetails) => {
      if (payment.paidDate) {
        const month = new Date(payment.paidDate).toLocaleDateString('tr-TR', { 
          year: 'numeric', 
          month: 'short' 
        });
        monthlyData[month] = (monthlyData[month] || 0) + parseFloat(payment.amount);
      }
    });

    return Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount,
    }));
  };

  // Calculate property status distribution
  const getPropertyStatusData = () => {
    if (!properties) return [];
    
    const occupied = properties.filter((p: PropertyWithDetails) => !p.isAvailable).length;
    const vacant = properties.filter((p: PropertyWithDetails) => p.isAvailable).length;
    
    return [
      { name: 'Dolu', value: occupied, color: '#388E3C' },
      { name: 'Boş', value: vacant, color: '#757575' },
    ];
  };

  // Calculate payment status data
  const getPaymentStatusData = () => {
    if (!payments) return [];
    
    const paid = payments.filter((p: PaymentWithDetails) => p.status === "paid").length;
    const pending = payments.filter((p: PaymentWithDetails) => p.status === "pending").length;
    const overdue = payments.filter((p: PaymentWithDetails) => p.status === "overdue").length;
    
    return [
      { name: 'Ödenen', value: paid, color: '#388E3C' },
      { name: 'Bekleyen', value: pending, color: '#FF6F00' },
      { name: 'Geciken', value: overdue, color: '#f44336' },
    ];
  };

  const monthlyRevenueData = getMonthlyRevenueData();
  const propertyStatusData = getPropertyStatusData();
  const paymentStatusData = getPaymentStatusData();

  const totalRevenue = payments?.filter((p: PaymentWithDetails) => p.status === "paid")
    .reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;

  const averageRent = properties?.reduce((sum, p: PropertyWithDetails) => 
    sum + parseFloat(p.monthlyRent), 0) / (properties?.length || 1) || 0;

  return (
    <div className="min-h-screen">
      <Topbar
        title="Raporlar"
        onMenuClick={onMenuClick || (() => {})}
      />

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))] mb-1">
                    Toplam Gelir
                  </p>
                  <p className="text-2xl font-bold text-[hsl(var(--kiratakip-neutral-800))]">
                    {formatCurrency(totalRevenue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-[hsl(var(--kiratakip-secondary))] h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))] mb-1">
                    Ortalama Kira
                  </p>
                  <p className="text-2xl font-bold text-[hsl(var(--kiratakip-neutral-800))]">
                    {formatCurrency(averageRent)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Building className="text-[hsl(var(--kiratakip-primary))] h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))] mb-1">
                    Aktif Kiracı
                  </p>
                  <p className="text-2xl font-bold text-[hsl(var(--kiratakip-neutral-800))]">
                    {stats?.totalTenants || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Users className="text-[hsl(var(--kiratakip-accent))] h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))] mb-1">
                    Dolu Mülk
                  </p>
                  <p className="text-2xl font-bold text-[hsl(var(--kiratakip-neutral-800))]">
                    {stats?.activeProperties || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Building className="text-purple-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Revenue Chart */}
          <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[hsl(var(--kiratakip-neutral-800))]">
                Aylık Gelir Trendi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#757575"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#757575"
                      fontSize={12}
                      tickFormatter={(value) => `₺${(value / 1000).toFixed(0)}K`}
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(Number(value)), 'Gelir']}
                      labelStyle={{ color: '#212121' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#1976D2" 
                      strokeWidth={3}
                      dot={{ fill: '#1976D2', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Property Status Chart */}
          <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[hsl(var(--kiratakip-neutral-800))]">
                Mülk Durumu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={propertyStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {propertyStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Status and Export Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Status Chart */}
          <Card className="lg:col-span-2 border-[hsl(var(--kiratakip-neutral-100))]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[hsl(var(--kiratakip-neutral-800))]">
                Ödeme Durumu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentStatusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#757575"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#757575"
                      fontSize={12}
                    />
                    <Tooltip />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {paymentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Export Actions */}
          <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[hsl(var(--kiratakip-neutral-800))]">
                Rapor Dışa Aktarma
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full justify-start space-x-3 h-auto p-4 bg-[hsl(var(--kiratakip-primary))] text-white hover:bg-[hsl(var(--kiratakip-primary))]/90"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Gelir Raporu</p>
                  <p className="text-sm opacity-80">PDF olarak indir</p>
                </div>
              </Button>

              <Button 
                variant="outline"
                className="w-full justify-start space-x-3 h-auto p-4 border-[hsl(var(--kiratakip-neutral-100))]"
              >
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Download className="text-[hsl(var(--kiratakip-secondary))] h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-[hsl(var(--kiratakip-neutral-800))]">
                    Kiracı Listesi
                  </p>
                  <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                    Excel olarak indir
                  </p>
                </div>
              </Button>

              <Button 
                variant="outline"
                className="w-full justify-start space-x-3 h-auto p-4 border-[hsl(var(--kiratakip-neutral-100))]"
              >
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Calendar className="text-[hsl(var(--kiratakip-accent))] h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-[hsl(var(--kiratakip-neutral-800))]">
                    Ödeme Takvimi
                  </p>
                  <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                    PDF olarak indir
                  </p>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Property Performance */}
        <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-[hsl(var(--kiratakip-neutral-800))]">
                Mülk Performansı
              </CardTitle>
              <Button variant="outline" size="sm">
                Detay Rapor
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[hsl(var(--kiratakip-neutral-50))]">
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      Mülk
                    </TableHead>
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      Aylık Kira
                    </TableHead>
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      Doluluk Oranı
                    </TableHead>
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      Son Ödeme
                    </TableHead>
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      Durum
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!properties || properties.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="text-[hsl(var(--kiratakip-neutral-400))]">
                          Henüz mülk kaydı bulunmuyor
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    properties.slice(0, 5).map((property: PropertyWithDetails) => (
                      <TableRow
                        key={property.id}
                        className="hover:bg-[hsl(var(--kiratakip-neutral-50))] transition-colors"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium text-[hsl(var(--kiratakip-neutral-800))]">
                              {property.address}
                            </p>
                            <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                              {property.type} • {property.area}m²
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-semibold text-[hsl(var(--kiratakip-neutral-800))]">
                            {formatCurrency(property.monthlyRent)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-[hsl(var(--kiratakip-neutral-600))]">
                            {property.isAvailable ? "0%" : "100%"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-[hsl(var(--kiratakip-neutral-600))]">
                            {property.lastPayment 
                              ? formatDate(property.lastPayment.paidDate || property.lastPayment.dueDate)
                              : "-"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            property.isAvailable 
                              ? "bg-gray-100 text-gray-700 hover:bg-gray-100"
                              : "bg-green-100 text-green-700 hover:bg-green-100"
                          }>
                            {property.isAvailable ? "Boş" : "Dolu"}
                          </Badge>
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
