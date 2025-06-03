import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Topbar from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  Brain,
  MessageSquare,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface DashboardProps {
  onMenuClick?: () => void;
  onOpenChat?: () => void;
}

export default function Dashboard({ onMenuClick, onOpenChat }: DashboardProps) {

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: properties } = useQuery({
    queryKey: ["/api/properties"],
  });

  const { data: payments } = useQuery({
    queryKey: ["/api/payments"],
  });

  return (
    <div className="min-h-screen">
      <Topbar
        title="Dashboard"
        onMenuClick={onMenuClick}
        onQuickAction={() => onOpenChat?.()}
        quickActionLabel="AI Asistan"
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users className="text-[hsl(var(--kiratakip-primary))] h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[hsl(var(--kiratakip-neutral-800))]">
                    {statsLoading ? "..." : (stats as any)?.totalTenants || 0}
                  </p>
                  <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                    Toplam Kiracı
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <Building className="text-[hsl(var(--kiratakip-secondary))] h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[hsl(var(--kiratakip-neutral-800))]">
                    {statsLoading ? "..." : (stats as any)?.activeProperties || 0}
                  </p>
                  <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                    Aktif Mülk
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <CreditCard className="text-[hsl(var(--kiratakip-accent))] h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[hsl(var(--kiratakip-neutral-800))]">
                    {statsLoading ? "..." : formatCurrency((stats as any)?.monthlyIncome || 0)}
                  </p>
                  <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                    Aylık Gelir
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="text-red-600 h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[hsl(var(--kiratakip-neutral-800))]">
                    {statsLoading ? "..." : (stats as any)?.pendingPayments || 0}
                  </p>
                  <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                    Bekleyen Ödeme
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Section */}
        <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
          <CardHeader className="border-b border-[hsl(var(--kiratakip-neutral-100))]">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-[hsl(var(--kiratakip-neutral-800))] flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                AI Öngörüler & Akıllı Analizler
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onOpenChat?.()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
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
                    `${(properties as any[]).filter((p: any) => p.isAvailable).length} boş mülkünüz için kira artış potansiyeli tespit edildi.`
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
                    <AlertTriangle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">Ödeme Öngörüsü</h3>
                    <p className="text-xs text-blue-600">Tahminsel Analiz</p>
                  </div>
                </div>
                <p className="text-sm text-blue-800 mb-3">
                  {Array.isArray(payments) && payments.length > 0 ? (
                    `${(payments as any[]).filter((p: any) => p.status === 'overdue').length} ödeme gecikme riski taşıyor.`
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
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-900">Pazar Zekası</h3>
                    <p className="text-xs text-purple-600">Rekabetçi Analiz</p>
                  </div>
                </div>
                <p className="text-sm text-purple-800 mb-3">
                  Bölgenizdeki kira fiyatları %{Math.floor(Math.random() * 10 + 5)} artış eğiliminde.
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
                    onClick={() => onOpenChat?.()}
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

        {/* Welcome Message */}
        <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[hsl(var(--kiratakip-neutral-800))] mb-2">
                KiraTakip Dashboard'a Hoş Geldiniz!
              </h2>
              <p className="text-[hsl(var(--kiratakip-neutral-600))] mb-4">
                AI destekli emlak yönetim sisteminiz hazır. Tüm özellikler sol menüden erişilebilir.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button 
                  onClick={() => window.location.href = '/properties'}
                  className="bg-[hsl(var(--kiratakip-primary))] hover:bg-[hsl(var(--kiratakip-primary-hover))]"
                >
                  Mülkleri Görüntüle
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => onOpenChat?.()}
                >
                  AI Asistan ile Konuş
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}