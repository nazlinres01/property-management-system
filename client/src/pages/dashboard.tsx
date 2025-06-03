import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Topbar from "@/components/layout/topbar";
import StatsCard from "@/components/cards/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  Building,
  CreditCard,
  AlertTriangle,
  UserPlus,
  File,
  ArrowUpRight,
  Check,
  TriangleAlert,
  TrendingUp,
} from "lucide-react";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import TenantModal from "@/components/modals/tenant-modal";
import PropertyModal from "@/components/modals/property-modal";
import ContractModal from "@/components/modals/contract-modal";
import PropertyTable from "@/components/tables/property-table";

interface DashboardProps {
  onMenuClick?: () => void;
}

export default function Dashboard({ onMenuClick }: DashboardProps) {
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: pendingPayments, isLoading: paymentsLoading } = useQuery({
    queryKey: ["/api/payments/pending"],
  });

  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ["/api/properties"],
  });

  return (
    <div className="min-h-screen">
      <Topbar
        title="Dashboard"
        onMenuClick={onMenuClick || (() => {})}
        onQuickAction={() => setShowTenantModal(true)}
        quickActionLabel="Yeni Kayıt"
      />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Toplam Kiracı"
            value={statsLoading ? "..." : stats?.totalTenants || 0}
            change={{
              value: "+12%",
              label: "bu ay",
              trend: "up",
            }}
            icon={Users}
            iconColor="blue"
          />
          <StatsCard
            title="Aktif Mülk"
            value={statsLoading ? "..." : stats?.activeProperties || 0}
            change={{
              value: "+5%",
              label: "bu ay",
              trend: "up",
            }}
            icon={Building}
            iconColor="green"
          />
          <StatsCard
            title="Aylık Gelir"
            value={statsLoading ? "..." : formatCurrency(stats?.monthlyIncome || 0)}
            change={{
              value: "+8%",
              label: "geçen aya göre",
              trend: "up",
            }}
            icon={CreditCard}
            iconColor="orange"
          />
          <StatsCard
            title="Bekleyen Ödeme"
            value={statsLoading ? "..." : stats?.pendingPayments || 0}
            change={{
              value: "7 ödeme",
              label: "bekliyor",
              trend: "neutral",
            }}
            icon={AlertTriangle}
            iconColor="red"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
              <CardHeader className="border-b border-[hsl(var(--kiratakip-neutral-100))]">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-[hsl(var(--kiratakip-neutral-800))]">
                    Son Aktiviteler
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-[hsl(var(--kiratakip-primary))]">
                    Tümünü Gör
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Activity items would be populated from API */}
                  <div className="flex items-start space-x-4 p-4 hover:bg-[hsl(var(--kiratakip-neutral-50))] rounded-lg transition-colors">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserPlus className="text-[hsl(var(--kiratakip-primary))] h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[hsl(var(--kiratakip-neutral-800))]">
                        Sistem başlatıldı ve kullanıma hazır
                      </p>
                      <p className="text-xs text-[hsl(var(--kiratakip-neutral-400))] mt-1">
                        Az önce
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      Sistem
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Pending Payments */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
              <CardHeader className="border-b border-[hsl(var(--kiratakip-neutral-100))]">
                <CardTitle className="text-lg font-semibold text-[hsl(var(--kiratakip-neutral-800))]">
                  Hızlı İşlemler
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start space-x-3 h-auto p-4 border-[hsl(var(--kiratakip-neutral-100))] hover:border-[hsl(var(--kiratakip-primary))] hover:bg-blue-50"
                  onClick={() => setShowTenantModal(true)}
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <UserPlus className="text-[hsl(var(--kiratakip-primary))] h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-[hsl(var(--kiratakip-neutral-800))]">
                      Yeni Kiracı
                    </p>
                    <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                      Kiracı bilgilerini kaydet
                    </p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start space-x-3 h-auto p-4 border-[hsl(var(--kiratakip-neutral-100))] hover:border-[hsl(var(--kiratakip-secondary))] hover:bg-green-50"
                  onClick={() => setShowPropertyModal(true)}
                >
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <Building className="text-[hsl(var(--kiratakip-secondary))] h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-[hsl(var(--kiratakip-neutral-800))]">
                      Mülk Ekle
                    </p>
                    <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                      Yeni mülk kaydı oluştur
                    </p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start space-x-3 h-auto p-4 border-[hsl(var(--kiratakip-neutral-100))] hover:border-[hsl(var(--kiratakip-accent))] hover:bg-orange-50"
                  onClick={() => setShowContractModal(true)}
                >
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <File className="text-[hsl(var(--kiratakip-accent))] h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-[hsl(var(--kiratakip-neutral-800))]">
                      Sözleşme Yap
                    </p>
                    <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                      Kira sözleşmesi oluştur
                    </p>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Pending Payments */}
            <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
              <CardHeader className="border-b border-[hsl(var(--kiratakip-neutral-100))]">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-[hsl(var(--kiratakip-neutral-800))]">
                    Bekleyen Ödemeler
                  </CardTitle>
                  <Badge className="bg-red-100 text-red-700">
                    {paymentsLoading ? "..." : pendingPayments?.length || 0} Ödeme
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {paymentsLoading ? (
                  <div className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                    Yükleniyor...
                  </div>
                ) : !pendingPayments || pendingPayments.length === 0 ? (
                  <div className="text-center py-8">
                    <Check className="h-12 w-12 text-[hsl(var(--kiratakip-secondary))] mx-auto mb-2" />
                    <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                      Tüm ödemeler güncel!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingPayments.slice(0, 3).map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-3 border border-[hsl(var(--kiratakip-neutral-100))] rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-sm text-[hsl(var(--kiratakip-neutral-800))]">
                            {payment.tenant.name}
                          </p>
                          <p className="text-xs text-[hsl(var(--kiratakip-neutral-400))]">
                            {payment.contract.property.address}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm text-[hsl(var(--kiratakip-neutral-800))]">
                            {formatCurrency(payment.amount)}
                          </p>
                          <p className="text-xs text-red-500">
                            {formatDate(payment.dueDate)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-[hsl(var(--kiratakip-primary))]"
                    >
                      Tüm Ödemeleri Görüntüle
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Property Overview */}
        <div className="mt-8">
          <PropertyTable />
        </div>
      </div>

      {/* Modals */}
      <TenantModal 
        open={showTenantModal} 
        onClose={() => setShowTenantModal(false)} 
      />
      <PropertyModal 
        open={showPropertyModal} 
        onClose={() => setShowPropertyModal(false)} 
      />
      <ContractModal 
        open={showContractModal} 
        onClose={() => setShowContractModal(false)} 
      />
    </div>
  );
}
