import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  Bot, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  AlertCircle,
  Lightbulb,
  FileText,
  Calculator
} from "lucide-react";

interface AISuggestion {
  type: 'property' | 'tenant' | 'payment' | 'maintenance';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action?: string;
}

interface AIPanelProps {
  onOpenChat: () => void;
}

export default function AIPanel({ onOpenChat }: AIPanelProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: properties } = useQuery({
    queryKey: ["/api/properties"],
  });

  const { data: payments } = useQuery({
    queryKey: ["/api/payments"],
  });

  useEffect(() => {
    generateAISuggestions();
  }, [stats, properties, payments]);

  const generateAISuggestions = () => {
    const newSuggestions: AISuggestion[] = [];

    // Property optimization suggestions
    if (Array.isArray(properties) && properties.length > 0) {
      const availableProperties = properties.filter((p: any) => p.isAvailable);
      if (availableProperties.length > 0) {
        newSuggestions.push({
          type: 'property',
          title: 'Boş Mülk Optimizasyonu',
          description: `${availableProperties.length} adet boş mülkünüz var. Pazarlama stratejinizi gözden geçirin.`,
          priority: 'medium',
          action: 'Mülk sayfasını görüntüle'
        });
      }
    }

    // Payment analysis
    if (Array.isArray(payments) && payments.length > 0) {
      const overduePayments = payments.filter((p: any) => p.status === 'overdue');
      if (overduePayments.length > 0) {
        newSuggestions.push({
          type: 'payment',
          title: 'Geciken Ödemeler',
          description: `${overduePayments.length} adet geciken ödeme var. Hemen takip başlatın.`,
          priority: 'high',
          action: 'Ödeme takibi başlat'
        });
      }
    }

    // General suggestions
    newSuggestions.push({
      type: 'maintenance',
      title: 'Periyodik Bakım Hatırlatması',
      description: 'Mülklerinizin yıllık bakım kontrollerini planlamayı unutmayın.',
      priority: 'low',
      action: 'Bakım takvimi oluştur'
    });

    if (stats && typeof stats === 'object' && 'monthlyIncome' in stats && (stats as any).monthlyIncome > 0) {
      newSuggestions.push({
        type: 'tenant',
        title: 'Gelir Analizi',
        description: `Bu ay ${(stats as any).monthlyIncome.toLocaleString('tr-TR')} ₺ gelir elde ettiniz. Geçen ayla karşılaştırın.`,
        priority: 'medium',
        action: 'Detaylı raporu görüntüle'
      });
    }

    setSuggestions(newSuggestions);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'property': return <TrendingUp className="h-4 w-4" />;
      case 'tenant': return <Users className="h-4 w-4" />;
      case 'payment': return <Calculator className="h-4 w-4" />;
      case 'maintenance': return <AlertCircle className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="h-5 w-5 text-[hsl(var(--kiratakip-primary))]" />
            AI Asistan
          </CardTitle>
          <Button
            onClick={onOpenChat}
            variant="outline"
            size="sm"
            className="h-8"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Sohbet
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          Akıllı öneriler ve analizler
        </div>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-[hsl(var(--kiratakip-primary))]">
                  {getTypeIcon(suggestion.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{suggestion.title}</h4>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getPriorityColor(suggestion.priority)}`}
                    >
                      {suggestion.priority === 'high' ? 'Yüksek' : 
                       suggestion.priority === 'medium' ? 'Orta' : 'Düşük'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {suggestion.description}
                  </p>
                  {suggestion.action && (
                    <p className="text-xs text-[hsl(var(--kiratakip-primary))] font-medium">
                      → {suggestion.action}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t">
          <div className="text-xs text-gray-500 text-center">
            AI önerileri gerçek verilerinize dayanmaktadır
          </div>
        </div>
      </CardContent>
    </Card>
  );
}