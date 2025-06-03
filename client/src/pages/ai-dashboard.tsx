import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Topbar from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AIPanel from "@/components/chat/ai-panel";
import SmartAnalytics from "@/components/ai/smart-analytics";
import PropertyRecommender from "@/components/ai/property-recommender";
import AutoReportGenerator from "@/components/ai/auto-report-generator";
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  MessageSquare,
  BarChart3,
  Target,
  Lightbulb,
  Cpu
} from "lucide-react";

interface AIDashboardProps {
  onMenuClick?: () => void;
}

export default function AIDashboard({ onMenuClick }: AIDashboardProps) {
  const [chatOpen, setChatOpen] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: chatStatus } = useQuery({
    queryKey: ["/api/chat/status"],
  });

  return (
    <div className="min-h-screen">
      <Topbar
        title="AI & Yapay Zeka"
        onMenuClick={onMenuClick}
        onQuickAction={() => setChatOpen(true)}
        quickActionLabel="AI Sohbet"
      />

      <div className="p-6 space-y-6">
        {/* AI Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Brain className="text-[hsl(var(--kiratakip-primary))] h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[hsl(var(--kiratakip-neutral-800))]">
                    %94
                  </p>
                  <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                    AI Güven Skoru
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <Zap className="text-[hsl(var(--kiratakip-secondary))] h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[hsl(var(--kiratakip-neutral-800))]">
                    {Array.isArray(chatStatus) ? chatStatus.length : chatStatus?.activeConnections || 0}
                  </p>
                  <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                    Aktif Bağlantı
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="text-[hsl(var(--kiratakip-accent))] h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[hsl(var(--kiratakip-neutral-800))]">
                    12
                  </p>
                  <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                    Aktif Analiz
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Target className="text-purple-600 h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[hsl(var(--kiratakip-neutral-800))]">
                    8
                  </p>
                  <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                    AI Önerisi
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Smart Analytics */}
          <SmartAnalytics />

          {/* Property Recommender */}
          <PropertyRecommender />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Assistant Panel */}
          <AIPanel onOpenChat={() => setChatOpen(true)} />

          {/* Auto Report Generator */}
          <AutoReportGenerator />
        </div>

        {/* AI Capabilities Overview */}
        <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
          <CardHeader className="border-b border-[hsl(var(--kiratakip-neutral-100))]">
            <CardTitle className="text-lg font-semibold text-[hsl(var(--kiratakip-neutral-800))] flex items-center gap-2">
              <Cpu className="h-5 w-5 text-[hsl(var(--kiratakip-primary))]" />
              AI Yetenekleri
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium text-blue-900">Akıllı Sohbet</h3>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  7/24 AI asistan desteği, anında cevaplar ve rehberlik
                </p>
                <Badge className="bg-blue-200 text-blue-800">Aktif</Badge>
              </div>

              <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <h3 className="font-medium text-green-900">Trend Analizi</h3>
                </div>
                <p className="text-sm text-green-700 mb-3">
                  Pazar trendleri ve gelir optimizasyonu önerileri
                </p>
                <Badge className="bg-green-200 text-green-800">Aktif</Badge>
              </div>

              <div className="p-4 rounded-lg bg-orange-50 border border-orange-100">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="h-5 w-5 text-orange-600" />
                  <h3 className="font-medium text-orange-900">Akıllı Öneriler</h3>
                </div>
                <p className="text-sm text-orange-700 mb-3">
                  Mülk optimizasyonu ve kiracı eşleştirme önerileri
                </p>
                <Badge className="bg-orange-200 text-orange-800">Aktif</Badge>
              </div>

              <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                <div className="flex items-center gap-3 mb-3">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <h3 className="font-medium text-purple-900">Otomatik Raporlar</h3>
                </div>
                <p className="text-sm text-purple-700 mb-3">
                  AI ile oluşturulan performans ve finansal raporlar
                </p>
                <Badge className="bg-purple-200 text-purple-800">Aktif</Badge>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Sistem Durumu: Çevrimiçi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Son 24 saatte 47 öngörü üretildi</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setChatOpen(true)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  AI ile Konuş
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}