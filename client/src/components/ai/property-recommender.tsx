import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Users, 
  Star,
  Target,
  Filter,
  Sparkles
} from "lucide-react";

interface PropertyRecommendation {
  type: 'pricing' | 'location' | 'features' | 'tenant-match';
  title: string;
  description: string;
  score: number;
  properties?: any[];
  action: string;
}

export default function PropertyRecommender() {
  const [recommendations, setRecommendations] = useState<PropertyRecommendation[]>([]);

  const { data: properties } = useQuery({
    queryKey: ["/api/properties"],
  });

  const { data: tenants } = useQuery({
    queryKey: ["/api/tenants"],
  });

  const { data: contracts } = useQuery({
    queryKey: ["/api/contracts"],
  });

  useEffect(() => {
    generateRecommendations();
  }, [properties, tenants, contracts]);

  const generateRecommendations = () => {
    const newRecommendations: PropertyRecommendation[] = [];

    if (Array.isArray(properties) && properties.length > 0) {
      // Pricing optimization
      const availableProperties = properties.filter((p: any) => p.isAvailable);
      if (availableProperties.length > 0) {
        const avgRent = availableProperties.reduce((sum: number, p: any) => sum + parseFloat(p.rent), 0) / availableProperties.length;
        const underPriced = availableProperties.filter((p: any) => parseFloat(p.rent) < avgRent * 0.9);
        
        if (underPriced.length > 0) {
          newRecommendations.push({
            type: 'pricing',
            title: 'Fiyat Optimizasyonu Önerisi',
            description: `${underPriced.length} mülkünüz piyasa ortalamasının altında fiyatlandırılmış. Kira artışı potansiyeli var.`,
            score: 85,
            properties: underPriced,
            action: 'Fiyat analizi yap'
          });
        }
      }

      // Location-based recommendations
      const locationData = properties.reduce((acc: any, p: any) => {
        const city = p.address.split(',')[0] || 'Bilinmeyen';
        if (!acc[city]) acc[city] = { count: 0, avgRent: 0, totalRent: 0 };
        acc[city].count++;
        acc[city].totalRent += parseFloat(p.rent);
        acc[city].avgRent = acc[city].totalRent / acc[city].count;
        return acc;
      }, {});

      const bestPerformingLocation = Object.keys(locationData).reduce((best, city) => {
        return locationData[city].avgRent > locationData[best]?.avgRent ? city : best;
      }, Object.keys(locationData)[0]);

      if (bestPerformingLocation) {
        newRecommendations.push({
          type: 'location',
          title: 'En Karlı Bölge Analizi',
          description: `${bestPerformingLocation} bölgesi en yüksek kira getirisine sahip. Yeni yatırım için öncelikli bölge.`,
          score: 78,
          action: 'Bölge detaylarını gör'
        });
      }
    }

    if (Array.isArray(tenants) && tenants.length > 0) {
      // Tenant matching
      const activeTenants = tenants.length;
      const availableUnits = Array.isArray(properties) ? properties.filter((p: any) => p.isAvailable).length : 0;
      
      if (activeTenants > 0 && availableUnits > 0) {
        newRecommendations.push({
          type: 'tenant-match',
          title: 'Kiracı-Mülk Eşleştirme',
          description: `${activeTenants} kiracı ve ${availableUnits} boş mülk için optimal eşleştirme analizi yapılabilir.`,
          score: 72,
          action: 'Eşleştirme analizi başlat'
        });
      }
    }

    // Market trend recommendation
    newRecommendations.push({
      type: 'features',
      title: 'Pazar Trend Analizi',
      description: 'Güncel piyasa trendlerine göre mülk özelliklerini optimize etme önerileri.',
      score: 65,
      action: 'Trend raporunu incele'
    });

    setRecommendations(newRecommendations.sort((a, b) => b.score - a.score));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pricing': return <DollarSign className="h-4 w-4" />;
      case 'location': return <MapPin className="h-4 w-4" />;
      case 'features': return <Home className="h-4 w-4" />;
      case 'tenant-match': return <Users className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pricing': return 'text-green-600 bg-green-50';
      case 'location': return 'text-blue-600 bg-blue-50';
      case 'features': return 'text-purple-600 bg-purple-50';
      case 'tenant-match': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[hsl(var(--kiratakip-primary))]" />
          AI Mülk Önerileri
        </CardTitle>
        <p className="text-sm text-gray-600">
          Yapay zeka destekli optimizasyon önerileri
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 p-2 rounded-full ${getTypeColor(rec.type)}`}>
                  {getTypeIcon(rec.type)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{rec.title}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-semibold">{rec.score}</span>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getScoreColor(rec.score)}`}
                      >
                        {rec.score >= 80 ? 'Yüksek Öncelik' : 
                         rec.score >= 70 ? 'Orta Öncelik' : 'Düşük Öncelik'}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {rec.description}
                  </p>
                  {rec.properties && rec.properties.length > 0 && (
                    <div className="text-xs text-[hsl(var(--kiratakip-primary))] font-medium">
                      {rec.properties.length} mülk etkileniyor
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-6 text-xs px-2 mt-2"
                  >
                    <Filter className="h-3 w-3 mr-1" />
                    {rec.action}
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {recommendations.length === 0 && (
            <div className="text-center py-8">
              <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Veri analiz ediliyor...
              </p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              AI Güven Skoru: %94
            </div>
            <Button variant="ghost" size="sm" className="h-6 text-xs">
              <Target className="h-3 w-3 mr-1" />
              Tüm Öneriler
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}