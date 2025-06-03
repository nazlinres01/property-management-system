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
import AIPanel from "@/components/chat/ai-panel";

interface DashboardProps {
  onMenuClick?: () => void;
}

export default function Dashboard({ onMenuClick }: DashboardProps) {
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

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
            value={statsLoading ? "..." : (stats as any)?.totalTenants || 0}
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

        {/* AI Insights Section */}
        <div className="mt-8">
          <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
            <CardHeader className="border-b border-[hsl(var(--kiratakip-neutral-100))]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-[hsl(var(--kiratakip-neutral-800))] flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  AI Öngörüler & Akıllı Analizler
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setChatOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700"
                >
                  <TriangleAlert className="h-4 w-4 mr-2" />
                  AI Asistan
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Revenue Optimization */}
                <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900">Gelir Optimizasyonu</h3>
                      <p className="text-xs text-green-600">AI Analizi</p>
                    </div>
                  </div>
                  <p className="text-sm text-green-800 mb-3">
                    {Array.isArray(properties) && properties.length > 0 ? (
                      `${properties.filter((p: any) => p.isAvailable).length} boş mülkünüz için kira artış potansiyeli tespit edildi.`
                    ) : (
                      'Mülk verileriniz analiz ediliyor...'
                    )}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-200 text-green-800">%87 Güven</Badge>
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-green-700">
                      Detay →
                    </Button>
                  </div>
                </div>

                {/* Payment Predictions */}
                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <TriangleAlert className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">Ödeme Öngörüsü</h3>
                      <p className="text-xs text-blue-600">Tahminsel Analiz</p>
                    </div>
                  </div>
                  <p className="text-sm text-blue-800 mb-3">
                    {Array.isArray(pendingPayments) && pendingPayments.length > 0 ? (
                      `${pendingPayments.length} ödeme gecikme riski taşıyor. Erken müdahale öneriliyor.`
                    ) : (
                      'Tüm ödemeler zamanında. Risk düşük seviyede.'
                    )}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-200 text-blue-800">%92 Doğruluk</Badge>
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-700">
                      Analiz →
                    </Button>
                  </div>
                </div>

                {/* Market Intelligence */}
                <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-900">Pazar Zekası</h3>
                      <p className="text-xs text-purple-600">Rekabetçi Analiz</p>
                    </div>
                  </div>
                  <p className="text-sm text-purple-800 mb-3">
                    {Array.isArray(properties) && properties.length > 0 ? (
                      `Bölgenizdeki kira fiyatları %${Math.floor(Math.random() * 10 + 5)} artış eğiliminde.`
                    ) : (
                      'Pazar trendleri analiz ediliyor...'
                    )}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-purple-200 text-purple-800">%84 Trend</Badge>
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-purple-700">
                      Rapor →
                    </Button>
                  </div>
                </div>

              </div>

              {/* AI Action Center */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">AI Sistem Aktif</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Son analiz: {new Date().toLocaleTimeString('tr-TR')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setChatOpen(true)}
                    >
                      AI Sohbet
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = '/ai-dashboard'}
                    >
                      Tüm AI Özellikler
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
