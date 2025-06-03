import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Shield, 
  CheckCircle, 
  Home, 
  UserCheck, 
  Briefcase,
  BarChart3,
  CreditCard,
  Bell,
  Lock,
  Smartphone,
  Cloud,
  Zap,
  FileText,
  Calendar,
  Mail
} from "lucide-react";

export default function Features() {
  const mainFeatures = [
    {
      icon: Building2,
      title: "Mülk Yönetimi",
      description: "Tüm mülklerinizi tek platformdan yönetin. Detaylı mülk bilgileri, fotoğraflar ve belgeleri güvenle saklayın.",
      features: ["Mülk portföyü yönetimi", "Fotoğraf ve belge depolama", "Mülk durumu takibi", "Bakım ve onarım kayıtları"]
    },
    {
      icon: Users,
      title: "Kiracı Takibi",
      description: "Kiracı bilgilerini güncel tutun. İletişim bilgileri, sözleşme geçmişi ve ödeme durumlarını takip edin.",
      features: ["Kiracı profil yönetimi", "İletişim bilgileri", "Sözleşme geçmişi", "Ödeme performansı"]
    },
    {
      icon: CreditCard,
      title: "Ödeme Takibi",
      description: "Kira ödemelerini otomatik takip edin. Gecikme bildirimleri ve ödeme hatırlatmaları alın.",
      features: ["Otomatik ödeme takibi", "Gecikme bildirimleri", "Ödeme geçmişi", "Tahsilat raporları"]
    },
    {
      icon: FileText,
      title: "Sözleşme Yönetimi",
      description: "Kira sözleşmelerini dijital ortamda yönetin. Süre takibi ve yenileme hatırlatmaları.",
      features: ["Dijital sözleşme saklama", "Süre takibi", "Yenileme hatırlatmaları", "Şablon sözleşmeler"]
    },
    {
      icon: BarChart3,
      title: "Raporlar ve Analizler",
      description: "Detaylı raporlar ve analizlerle portföy performansınızı ölçün. Gelir-gider analizi yapın.",
      features: ["Gelir-gider raporları", "Performans analizi", "Grafik ve tablolar", "Excel export"]
    },
    {
      icon: Bell,
      title: "Bildirim Sistemi",
      description: "Önemli olaylar için anında bildirim alın. Ödeme gecikmeleri, sözleşme süreleri ve daha fazlası.",
      features: ["SMS bildirimleri", "E-posta uyarıları", "Push bildirimleri", "Özelleştirilebilir uyarılar"]
    }
  ];

  const technicalFeatures = [
    { icon: Shield, title: "256-bit SSL Şifreleme", description: "Bankacılık seviyesinde güvenlik" },
    { icon: Cloud, title: "Bulut Depolama", description: "Verileriniz güvenli sunucularda" },
    { icon: Smartphone, title: "Mobil Uyumlu", description: "Tüm cihazlarda mükemmel deneyim" },
    { icon: Zap, title: "Yüksek Performans", description: "Hızlı yükleme ve işlem süreleri" },
    { icon: Lock, title: "Veri Koruması", description: "KVKK uyumlu veri işleme" },
    { icon: Calendar, title: "7/24 Erişim", description: "İstediğiniz zaman her yerden erişim" }
  ];

  const pricing = [
    {
      name: "Başlangıç",
      price: "299",
      period: "aylık",
      description: "Küçük portföyler için ideal",
      features: [
        "5 mülke kadar",
        "Temel raporlar",
        "E-posta desteği",
        "1 kullanıcı hesabı"
      ],
      popular: false
    },
    {
      name: "Profesyonel",
      price: "599",
      period: "aylık",
      description: "Orta ölçekli yatırımcılar için",
      features: [
        "25 mülke kadar",
        "Gelişmiş raporlar",
        "Öncelikli destek",
        "3 kullanıcı hesabı",
        "SMS bildirimleri"
      ],
      popular: true
    },
    {
      name: "Kurumsal",
      price: "1299",
      period: "aylık",
      description: "Büyük portföyler için",
      features: [
        "Sınırsız mülk",
        "Tüm raporlar",
        "7/24 telefon desteği",
        "Sınırsız kullanıcı",
        "API entegrasyonu",
        "Özel eğitim"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900 tracking-tight">
                  KiraTakip
                </h1>
                <p className="text-xs text-gray-500 font-medium tracking-wide">PROFESSIONAL EDITION</p>
              </div>
            </div>
            <Button 
              onClick={() => window.location.href = "/"}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-2 rounded-xl"
            >
              Ana Sayfaya Dön
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-full px-6 py-3 shadow-sm mb-8">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-700 font-semibold text-sm tracking-wide">TÜRKİYE'NİN EN GELİŞMİŞ EMLAK YÖNETİM PLATFORMU</span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Özellikler
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
            Emlak portföyünüzü yönetmek için ihtiyacınız olan tüm araçlar bir arada. 
            Profesyonel düzeyde özellikler ile işinizi kolaylaştırın.
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => (
              <Card key={index} className="group relative border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"></div>
                <CardHeader className="relative pt-8 pb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-black text-gray-900 mb-3 text-center">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative pb-8">
                  <p className="text-gray-600 leading-relaxed text-center mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Teknik Özellikler
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise seviye altyapı ile güvenli ve hızlı hizmet
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicalFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-4 bg-white/80 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Fiyatlandırma
            </h2>
            <p className="text-xl text-gray-600">
              İhtiyacınıza uygun paketi seçin
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricing.map((plan, index) => (
              <Card key={index} className={`relative rounded-3xl overflow-hidden ${plan.popular ? 'ring-2 ring-blue-500 shadow-2xl scale-105' : 'shadow-xl'}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-2 text-sm font-semibold">
                    EN POPÜLER
                  </div>
                )}
                <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-8'}`}>
                  <CardTitle className="text-2xl font-black text-gray-900">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-black text-gray-900">₺{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent className="pb-8">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-6 ${plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                      : 'bg-gray-900 hover:bg-gray-800'} text-white font-semibold py-3 rounded-xl`}
                  >
                    Başlayın
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl overflow-hidden">
            <CardContent className="p-12">
              <h2 className="text-4xl font-black text-white mb-6">
                Hemen Başlayın
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                30 gün ücretsiz deneme ile tüm özellikleri keşfedin
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = "/"}
                  className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-3 rounded-xl"
                >
                  Ücretsiz Deneyin
                </Button>
                <Button 
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3 rounded-xl"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  İletişime Geçin
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}