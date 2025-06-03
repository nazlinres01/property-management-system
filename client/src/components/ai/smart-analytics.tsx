import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Brain,
  BarChart3,
  PieChart,
  Calculator
} from "lucide-react";

interface SmartInsight {
  type: 'trend' | 'warning' | 'opportunity' | 'success';
  title: string;
  description: string;
  value?: string;
  change?: number;
  actionable: boolean;
}

export default function SmartAnalytics() {
  const [insights, setInsights] = useState<SmartInsight[]>([]);

  const { data: properties } = useQuery({
    queryKey: ["/api/properties"],
  });

  const { data: payments } = useQuery({
    queryKey: ["/api/payments"],
  });

  const { data: contracts } = useQuery({
    queryKey: ["/api/contracts"],
  });

  useEffect(() => {
    generateSmartInsights();
  }, [properties, payments, contracts]);

  const generateSmartInsights = () => {
    const newInsights: SmartInsight[] = [];

    if (Array.isArray(payments) && payments.length > 0) {
      // Revenue trend analysis
      const currentMonth = new Date().getMonth();
      const currentMonthPayments = payments.filter((p: any) => 
        new Date(p.dueDate).getMonth() === currentMonth && p.status === 'paid'
      );
      const lastMonthPayments = payments.filter((p: any) => 
        new Date(p.dueDate).getMonth() === currentMonth - 1 && p.status === 'paid'
      );

      if (currentMonthPayments.length > lastMonthPayments.length) {
        newInsights.push({
          type: 'trend',
          title: 'Gelir Artışı Tespit Edildi',
          description: `Bu ay geçen aya göre %${Math.round(((currentMonthPayments.length - lastMonthPayments.length) / lastMonthPayments.length) * 100)} daha fazla ödeme alındı.`,
          change: ((currentMonthPayments.length - lastMonthPayments.length) / lastMonthPayments.length) * 100,
          actionable: true
        });
      }

      // Payment pattern analysis
      const overduePayments = payments.filter((p: any) => p.status === 'overdue');
      if (overduePayments.length > 0) {
        newInsights.push({
          type: 'warning',
          title: 'Ödeme Gecikmesi Analizi',
          description: `${overduePayments.length} adet geciken ödeme var. Ortalama gecikme süresi analiz edilmeli.`,
          actionable: true
        });
      }
    }

    if (Array.isArray(properties) && properties.length > 0) {
      // Occupancy rate analysis
      const occupiedProperties = properties.filter((p: any) => !p.isAvailable);
      const occupancyRate = (occupiedProperties.length / properties.length) * 100;

      if (occupancyRate >= 90) {
        newInsights.push({
          type: 'success',
          title: 'Yüksek Doluluk Oranı',
          description: `Mülklerinizin %${occupancyRate.toFixed(1)}'i dolu. Mükemmel performans!`,
          value: `%${occupancyRate.toFixed(1)}`,
          actionable: false
        });
      } else if (occupancyRate < 70) {
        newInsights.push({
          type: 'opportunity',
          title: 'Doluluk Oranı İyileştirilebilir',
          description: `%${occupancyRate.toFixed(1)} doluluk oranı. Pazarlama stratejilerini gözden geçirin.`,
          value: `%${occupancyRate.toFixed(1)}`,
          actionable: true
        });
      }
    }

    if (Array.isArray(contracts) && contracts.length > 0) {
      // Contract expiration analysis
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      const expiringSoon = contracts.filter((c: any) => {
        const endDate = new Date(c.endDate);
        return endDate <= nextMonth && endDate > new Date();
      });

      if (expiringSoon.length > 0) {
        newInsights.push({
          type: 'warning',
          title: 'Yakında Sona Eren Sözleşmeler',
          description: `${expiringSoon.length} adet sözleşme önümüzdeki ay sona eriyor. Yenileme planını hazırlayın.`,
          actionable: true
        });
      }
    }

    // Market analysis insight
    newInsights.push({
      type: 'trend',
      title: 'Pazar Analizi',
      description: 'Bölgenizdeki kira fiyatları trend analizi için veri toplama önerisi.',
      actionable: true
    });

    setInsights(newInsights);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'opportunity': return <BarChart3 className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trend': return 'text-blue-600 bg-blue-50';
      case 'warning': return 'text-red-600 bg-red-50';
      case 'opportunity': return 'text-orange-600 bg-orange-50';
      case 'success': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'trend': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-red-100 text-red-800';
      case 'opportunity': return 'bg-orange-100 text-orange-800';
      case 'success': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="h-5 w-5 text-[hsl(var(--kiratakip-primary))]" />
          Akıllı Analizler
        </CardTitle>
        <p className="text-sm text-gray-600">
          AI destekli iş zekası ve öngörüler
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 p-2 rounded-full ${getInsightColor(insight.type)}`}>
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <div className="flex items-center gap-2">
                      {insight.value && (
                        <span className="text-sm font-semibold text-[hsl(var(--kiratakip-primary))]">
                          {insight.value}
                        </span>
                      )}
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getBadgeColor(insight.type)}`}
                      >
                        {insight.type === 'trend' ? 'Trend' : 
                         insight.type === 'warning' ? 'Uyarı' : 
                         insight.type === 'opportunity' ? 'Fırsat' : 'Başarı'}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {insight.description}
                  </p>
                  {insight.change && (
                    <div className="flex items-center gap-1">
                      {insight.change > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={`text-xs font-medium ${
                        insight.change > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        %{Math.abs(insight.change).toFixed(1)}
                      </span>
                    </div>
                  )}
                  {insight.actionable && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-6 text-xs px-2 mt-2"
                    >
                      Detaylı İncele
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}
            </div>
            <Button variant="ghost" size="sm" className="h-6 text-xs">
              <PieChart className="h-3 w-3 mr-1" />
              Rapor Al
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}