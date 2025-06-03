import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Shield, 
  Home, 
  Target,
  Award,
  Heart,
  Globe,
  Zap,
  CheckCircle,
  Star,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Twitter
} from "lucide-react";

export default function About() {
  const stats = [
    { icon: Users, value: "10,000+", label: "Aktif Kullanıcı" },
    { icon: Building2, value: "50,000+", label: "Yönetilen Mülk" },
    { icon: TrendingUp, value: "₺2M+", label: "Aylık İşlem Hacmi" },
    { icon: Award, value: "5+", label: "Yıllık Deneyim" }
  ];

  const values = [
    {
      icon: Shield,
      title: "Güvenlik",
      description: "Verilerinizin güvenliği bizim için öncelik. Bankacılık seviyesinde şifreleme ve güvenlik protokolleri kullanıyoruz."
    },
    {
      icon: Heart,
      title: "Müşteri Odaklılık",
      description: "Müşterilerimizin ihtiyaçlarını anlayarak, onlara en iyi hizmeti sunmak için sürekli çalışıyoruz."
    },
    {
      icon: Zap,
      title: "İnovasyon",
      description: "Teknolojinin gücünü kullanarak emlak yönetiminde yenilikçi çözümler geliştiriyoruz."
    },
    {
      icon: Target,
      title: "Kalite",
      description: "Yüksek kaliteli yazılım geliştirme standartları ile güvenilir ve performanslı ürünler sunuyoruz."
    }
  ];

  const team = [
    {
      name: "Ahmet Yılmaz",
      role: "Kurucu & CEO",
      description: "15 yıllık emlak sektörü deneyimi ile KiraTakip'i hayata geçirdi.",
      image: "AY"
    },
    {
      name: "Zeynep Demir",
      role: "CTO",
      description: "Teknoloji lideri olarak ürün geliştirme süreçlerini yönetiyor.",
      image: "ZD"
    },
    {
      name: "Mehmet Kaya",
      role: "Müşteri Deneyimi Direktörü",
      description: "Müşteri memnuniyeti ve destek hizmetlerinden sorumlu.",
      image: "MK"
    },
    {
      name: "Ayşe Şahin",
      role: "Ürün Müdürü",
      description: "Ürün stratejisi ve kullanıcı deneyimi tasarımında uzman.",
      image: "AŞ"
    }
  ];

  const milestones = [
    {
      year: "2019",
      title: "Kuruluş",
      description: "KiraTakip projesi emlak sektöründeki ihtiyaçlar doğrultusunda başladı."
    },
    {
      year: "2020",
      title: "İlk Ürün Lansmanı",
      description: "Beta versiyonu ile ilk 100 kullanıcıya ulaştık."
    },
    {
      year: "2021",
      title: "Büyüme",
      description: "1,000+ aktif kullanıcı ve mobil uygulama lansmanı."
    },
    {
      year: "2022",
      title: "Ölçeklendirme",
      description: "5,000+ kullanıcı ve kurumsal müşteri segmenti."
    },
    {
      year: "2023",
      title: "Liderlik",
      description: "10,000+ kullanıcı ile Türkiye'nin önde gelen platformu olduk."
    },
    {
      year: "2024",
      title: "Gelecek",
      description: "AI destekli özellikler ve uluslararası pazara açılma hedefi."
    }
  ];

  const testimonials = [
    {
      name: "Serkan Özkan",
      role: "Gayrimenkul Yatırımcısı",
      content: "KiraTakip sayesinde 20 mülküm olan portföyümü çok daha kolay yönetiyorum. Zaman tasarrufu inanılmaz.",
      rating: 5
    },
    {
      name: "Fatma Arslan",
      role: "Emlak Uzmanı",
      content: "Müşterilerime önerdiğim en iyi platform. Profesyonel raporları çok beğeniyorlar.",
      rating: 5
    },
    {
      name: "Okan Tekin",
      role: "Mülk Sahibi",
      content: "Kiracı ödemelerini takip etmek hiç bu kadar kolay olmamıştı. Gerçekten işimi kolaylaştırdı.",
      rating: 5
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
            <span className="text-blue-700 font-semibold text-sm tracking-wide">TÜRKİYE'NİN GÜVENİLİR EMLAK YÖNETİM PLATFORMU</span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Hakkımızda
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto mb-12">
            2019 yılından bu yana emlak sektöründe dijital dönüşümün öncüsü olarak, 
            binlerce mülk sahibi ve emlak profesyonelinin güvendiği platform.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"></div>
              <CardHeader className="relative pt-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-black text-gray-900">
                  Misyonumuz
                </CardTitle>
              </CardHeader>
              <CardContent className="relative pb-8">
                <p className="text-gray-600 leading-relaxed text-lg">
                  Emlak yönetimini basitleştirerek, mülk sahiplerinin ve emlak profesyonellerinin 
                  işlerini daha verimli yönetmelerini sağlamak. Teknolojinin gücünü kullanarak 
                  sektörde dijital dönüşümü hızlandırmak.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50"></div>
              <CardHeader className="relative pt-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-black text-gray-900">
                  Vizyonumuz
                </CardTitle>
              </CardHeader>
              <CardContent className="relative pb-8">
                <p className="text-gray-600 leading-relaxed text-lg">
                  Türkiye'nin en güvenilir ve yenilikçi emlak yönetim platformu olmak. 
                  Kullanıcılarımızın ihtiyaçlarını öngörerek, sektörün standartlarını 
                  belirleyen teknoloji lideri konumuna ulaşmak.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Değerlerimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              İş yapış şeklimizi belirleyen temel değerler
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="group text-center border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"></div>
                <CardHeader className="relative pt-8 pb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-black text-gray-900 mb-3">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative pb-8">
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Yolculuğumuz
            </h2>
            <p className="text-xl text-gray-600">
              KiraTakip'in gelişim hikayesi
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className="bg-blue-100 text-blue-700 font-semibold">
                            {milestone.year}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Ekibimiz
            </h2>
            <p className="text-xl text-gray-600">
              Deneyimli ve tutkulu profesyonellerden oluşan ekibimiz
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center border-0 shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg text-white font-bold text-lg">
                    {member.image}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Müşterilerimiz Ne Diyor
            </h2>
            <p className="text-xl text-gray-600">
              Binlerce memnun kullanıcımızdan bazı görüşler
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl overflow-hidden">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-black text-white mb-6">
                Bizimle İletişime Geçin
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Sorularınız için buradayız. Size nasıl yardımcı olabiliriz?
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col items-center text-white">
                  <Phone className="h-8 w-8 mb-2" />
                  <span className="font-semibold">+90 212 XXX XX XX</span>
                </div>
                <div className="flex flex-col items-center text-white">
                  <Mail className="h-8 w-8 mb-2" />
                  <span className="font-semibold">info@kiratakip.com</span>
                </div>
                <div className="flex flex-col items-center text-white">
                  <MapPin className="h-8 w-8 mb-2" />
                  <span className="font-semibold">İstanbul, Türkiye</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = "/"}
                  className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-3 rounded-xl"
                >
                  Hemen Başlayın
                </Button>
                <Button 
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3 rounded-xl flex items-center"
                >
                  <span>Demo Talep Edin</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}