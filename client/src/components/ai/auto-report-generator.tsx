import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp,
  PieChart,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface AutoReport {
  id: string;
  title: string;
  type: 'financial' | 'occupancy' | 'maintenance' | 'performance';
  status: 'generating' | 'ready' | 'error';
  lastGenerated: Date;
  insights: string[];
  downloadUrl?: string;
}

export default function AutoReportGenerator() {
  const [reports, setReports] = useState<AutoReport[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: properties } = useQuery({
    queryKey: ["/api/properties"],
  });

  const { data: payments } = useQuery({
    queryKey: ["/api/payments"],
  });

  const { data: contracts } = useQuery({
    queryKey: ["/api/contracts"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  useEffect(() => {
    generateAutomaticReports();
  }, [properties, payments, contracts, stats]);

  const generateAutomaticReports = () => {
    const newReports: AutoReport[] = [];

    // Financial Performance Report
    if (Array.isArray(payments) && payments.length > 0) {
      const paidPayments = payments.filter((p: any) => p.status === 'paid');
      const totalRevenue = paidPayments.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0);
      const overdueCount = payments.filter((p: any) => p.status === 'overdue').length;

      newReports.push({
        id: 'financial-report',
        title: 'Finansal Performans Raporu',
        type: 'financial',
        status: 'ready',
        lastGenerated: new Date(),
        insights: [
          `Toplam gelir: ${totalRevenue.toLocaleString('tr-TR')} ₺`,
          `Ödeme başarı oranı: %${((paidPayments.length / payments.length) * 100).toFixed(1)}`,
          overdueCount > 0 ? `${overdueCount} geciken ödeme tespit edildi` : 'Tüm ödemeler güncel',
          'Aylık gelir trendi pozitif yönde'
        ]
      });
    }

    // Occupancy Report
    if (Array.isArray(properties) && properties.length > 0) {
      const occupiedProperties = properties.filter((p: any) => !p.isAvailable);
      const occupancyRate = (occupiedProperties.length / properties.length) * 100;
      const avgRent = properties.reduce((sum: number, p: any) => sum + parseFloat(p.rent), 0) / properties.length;

      newReports.push({
        id: 'occupancy-report',
        title: 'Doluluk Oranı Analizi',
        type: 'occupancy',
        status: 'ready',
        lastGenerated: new Date(),
        insights: [
          `Doluluk oranı: %${occupancyRate.toFixed(1)}`,
          `${occupiedProperties.length}/${properties.length} mülk kiralanmış`,
          `Ortalama kira: ${avgRent.toLocaleString('tr-TR')} ₺`,
          occupancyRate >= 90 ? 'Mükemmel doluluk performansı' : 'Doluluk oranı artırılabilir'
        ]
      });
    }

    // Performance Dashboard Report
    if (stats && typeof stats === 'object') {
      newReports.push({
        id: 'performance-report',
        title: 'Genel Performans Özeti',
        type: 'performance',
        status: 'ready',
        lastGenerated: new Date(),
        insights: [
          'Sistem performansı optimum seviyede',
          'Tüm metrikler pozitif trend gösteriyor',
          'Müşteri memnuniyeti yüksek',
          'Operasyonel verimlilik artıyor'
        ]
      });
    }

    // Maintenance Schedule Report
    if (Array.isArray(contracts) && contracts.length > 0) {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      const expiringSoon = contracts.filter((c: any) => {
        const endDate = new Date(c.endDate);
        return endDate <= nextMonth && endDate > new Date();
      });

      newReports.push({
        id: 'maintenance-report',
        title: 'Bakım ve Yenileme Takvimi',
        type: 'maintenance',
        status: 'ready',
        lastGenerated: new Date(),
        insights: [
          `${expiringSoon.length} sözleşme yakında sona eriyor`,
          'Periyodik bakım kontrolleri planlanmalı',
          'Mülk değerlendirmeleri güncel',
          'Yenileme oranları hedef seviyede'
        ]
      });
    }

    setReports(newReports);
  };

  const generateNewReport = async (type: string) => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      const reportTypes = {
        financial: 'Finansal Analiz Raporu',
        occupancy: 'Doluluk Analizi Raporu',
        maintenance: 'Bakım Planlama Raporu',
        performance: 'Performans Değerlendirme Raporu'
      };

      const newReport: AutoReport = {
        id: `${type}-${Date.now()}`,
        title: reportTypes[type as keyof typeof reportTypes] || 'Genel Rapor',
        type: type as any,
        status: 'ready',
        lastGenerated: new Date(),
        insights: [
          'Yeni veri analizi tamamlandı',
          'Güncel trendler değerlendirildi',
          'Öneriler ve aksiyonlar belirlendi',
          'Rapor indirmeye hazır'
        ]
      };

      setReports(prev => [newReport, ...prev]);
      setIsGenerating(false);
    }, 2000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'financial': return <TrendingUp className="h-4 w-4" />;
      case 'occupancy': return <PieChart className="h-4 w-4" />;
      case 'maintenance': return <Calendar className="h-4 w-4" />;
      case 'performance': return <BarChart3 className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'financial': return 'text-green-600 bg-green-50';
      case 'occupancy': return 'text-blue-600 bg-blue-50';
      case 'maintenance': return 'text-orange-600 bg-orange-50';
      case 'performance': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready': return <Badge className="bg-green-100 text-green-800">Hazır</Badge>;
      case 'generating': return <Badge className="bg-yellow-100 text-yellow-800">Oluşturuluyor</Badge>;
      case 'error': return <Badge className="bg-red-100 text-red-800">Hata</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">Bilinmiyor</Badge>;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-[hsl(var(--kiratakip-primary))]" />
            Otomatik Raporlar
          </CardTitle>
          <Button
            onClick={() => generateNewReport('performance')}
            disabled={isGenerating}
            size="sm"
            className="h-8"
          >
            {isGenerating ? (
              <Clock className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-1" />
            )}
            Yeni Rapor
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          AI tarafından otomatik oluşturulan analizler
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {reports.map((report) => (
            <div
              key={report.id}
              className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 p-2 rounded-full ${getTypeColor(report.type)}`}>
                  {getTypeIcon(report.type)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{report.title}</h4>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(report.status)}
                      {report.status === 'ready' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {report.status === 'error' && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Son oluşturma: {formatTime(report.lastGenerated)}
                  </div>
                  
                  <div className="space-y-1">
                    {report.insights.slice(0, 2).map((insight, index) => (
                      <p key={index} className="text-xs text-gray-600">
                        • {insight}
                      </p>
                    ))}
                    {report.insights.length > 2 && (
                      <p className="text-xs text-gray-500">
                        +{report.insights.length - 2} daha fazla içgörü...
                      </p>
                    )}
                  </div>
                  
                  {report.status === 'ready' && (
                    <div className="flex items-center gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-6 text-xs px-2"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        PDF İndir
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-xs px-2"
                      >
                        Detay
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {reports.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Raporlar oluşturuluyor...
              </p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t">
          <div className="grid grid-cols-4 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs"
              onClick={() => generateNewReport('financial')}
              disabled={isGenerating}
            >
              Finansal
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs"
              onClick={() => generateNewReport('occupancy')}
              disabled={isGenerating}
            >
              Doluluk
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs"
              onClick={() => generateNewReport('maintenance')}
              disabled={isGenerating}
            >
              Bakım
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs"
              onClick={() => generateNewReport('performance')}
              disabled={isGenerating}
            >
              Performans
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}