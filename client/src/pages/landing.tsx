import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Users, TrendingUp, Shield, CheckCircle, Home, UserCheck, Briefcase, Key, Building, BarChart3 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function Landing() {
  const [activeTab, setActiveTab] = useState("");
  const { toast } = useToast();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      userType: "",
      isActive: true,
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Giriş yapılamadı");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Giriş yapıldı. Dashboard'a yönlendiriliyorsunuz...",
      });
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Giriş yapılırken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      const { confirmPassword, ...userData } = data;
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error("Hesap oluşturulamadı");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Hesap oluşturuldu. Giriş yapabilirsiniz.",
      });
      setActiveTab("login");
      registerForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Hesap oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  const onLogin = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  const onRegister = (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  const features = [
    {
      icon: Building2,
      title: "Mülk Yönetimi",
      description: "Tüm mülklerinizi tek yerden yönetin. Daire, ofis, dükkan - her türlü gayrimenkul için.",
    },
    {
      icon: Users,
      title: "Kiracı Takibi",
      description: "Kiracı bilgileri, sözleşmeler ve iletişim detayları güvenle saklanır.",
    },
    {
      icon: TrendingUp,
      title: "Finansal Analiz",
      description: "Kira gelirlerinizi, ödemeleri ve trendleri detaylı raporlarla izleyin.",
    },
    {
      icon: Shield,
      title: "Güvenli Platform",
      description: "Verileriniz şifrelenir ve güvenli sunucularda saklanır.",
    },
  ];

  const userTypes = [
    { value: "landlord", label: "Ev Sahibi", icon: Home, desc: "Mülklerimi yönetmek istiyorum" },
    { value: "tenant", label: "Kiracı", icon: UserCheck, desc: "Kira ödemelerimi takip etmek istiyorum" },
    { value: "agent", label: "Emlakçı", icon: Briefcase, desc: "Müşterilerimi yönetmek istiyorum" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-400/10 to-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-gray-900/5 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <Key className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  KiraTakip
                </h1>
                <p className="text-xs text-gray-500 font-medium tracking-wide">PROFESSIONAL EDITION</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost"
                className="text-gray-600 hover:text-gray-900 font-medium px-6"
              >
                Özellikler
              </Button>
              <Button 
                variant="ghost"
                className="text-gray-600 hover:text-gray-900 font-medium px-6"
              >
                Hakkımızda
              </Button>
              <Button 
                onClick={() => setActiveTab("login")}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-6 py-2 rounded-xl transition-all duration-200"
              >
                Giriş Yap
              </Button>
              <Button 
                onClick={() => setActiveTab("register")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Kayıt Ol
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-10">
              <div className="space-y-8">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-full px-6 py-3 shadow-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-700 font-semibold text-sm tracking-wide">TÜRKİYE'NİN #1 EMLAK YÖNETİM PLATFORMU</span>
                </div>
                
                <div className="space-y-6">
                  <h1 className="text-6xl lg:text-7xl font-black leading-tight">
                    <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                      Emlak Yönetiminde
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Dijital Devrim
                    </span>
                  </h1>
                  
                  <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed font-light max-w-2xl">
                    Fortune 500 şirketlerinin tercih ettiği teknoloji ile emlak portföyünüzü yönetin. 
                    <span className="font-semibold text-gray-800"> %40 daha verimli, %60 daha hızlı.</span>
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 pt-8">
                  <div className="text-center">
                    <div className="text-3xl font-black text-blue-600">10K+</div>
                    <div className="text-sm text-gray-600 font-medium">Aktif Kullanıcı</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-indigo-600">50K+</div>
                    <div className="text-sm text-gray-600 font-medium">Yönetilen Mülk</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-purple-600">₺2M+</div>
                    <div className="text-sm text-gray-600 font-medium">Aylık İşlem</div>
                  </div>
                </div>
              </div>

              {/* Feature badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 bg-emerald-50 border border-emerald-200/50 rounded-xl p-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-emerald-800 font-semibold">AI Destekli Analiz</span>
                </div>
                <div className="flex items-center space-x-3 bg-blue-50 border border-blue-200/50 rounded-xl p-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-blue-800 font-semibold">Blockchain Güvenlik</span>
                </div>
                <div className="flex items-center space-x-3 bg-purple-50 border border-purple-200/50 rounded-xl p-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-purple-800 font-semibold">Otomatik Raporlama</span>
                </div>
                <div className="flex items-center space-x-3 bg-orange-50 border border-orange-200/50 rounded-xl p-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-orange-800 font-semibold">24/7 Destek</span>
                </div>
              </div>
            </div>

            {/* Right Content - Visual or Auth Forms */}
            {activeTab === "login" || activeTab === "register" ? (
              <div className="lg:pl-8">
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-3xl blur-2xl"></div>
                  <Card className="relative w-full max-w-lg mx-auto bg-white/95 backdrop-blur-xl border-0 shadow-2xl shadow-gray-900/10 rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"></div>
                    <CardHeader className="relative text-center pb-6 pt-12 px-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Key className="h-10 w-10 text-white" />
                      </div>
                      <CardTitle className="text-3xl font-black text-gray-900 mb-2">
                        {activeTab === "login" ? "Giriş Yap" : "Hesap Oluştur"}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-lg">
                        {activeTab === "login" 
                          ? "Hesabınıza erişim sağlayın" 
                          : "Profesyonel emlak yönetimi deneyimini başlatın"
                        }
                      </CardDescription>
                      <Button
                        variant="ghost"
                        onClick={() => setActiveTab("")}
                        className="absolute top-4 right-4 h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </Button>
                    </CardHeader>
                    <CardContent className="relative px-8 pb-12">
                      {activeTab === "login" && (
                        <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 font-semibold">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="ornek@email.com"
                              className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              {...loginForm.register("email")}
                            />
                            {loginForm.formState.errors.email && (
                              <p className="text-sm text-red-500">
                                {loginForm.formState.errors.email.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700 font-semibold">Şifre</Label>
                            <Input
                              id="password"
                              type="password"
                              placeholder="********"
                              className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              {...loginForm.register("password")}
                            />
                            {loginForm.formState.errors.password && (
                              <p className="text-sm text-red-500">
                                {loginForm.formState.errors.password.message}
                              </p>
                            )}
                          </div>
                          <Button
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                            disabled={loginMutation.isPending}
                          >
                            {loginMutation.isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
                          </Button>
                        </form>
                      )}

                      {activeTab === "register" && (
                        <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-gray-700 font-semibold">Ad Soyad</Label>
                            <Input
                              id="fullName"
                              placeholder="Adınız Soyadınız"
                              className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              {...registerForm.register("fullName")}
                            />
                            {registerForm.formState.errors.fullName && (
                              <p className="text-sm text-red-500">
                                {registerForm.formState.errors.fullName.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="regEmail" className="text-gray-700 font-semibold">Email</Label>
                            <Input
                              id="regEmail"
                              type="email"
                              placeholder="ornek@email.com"
                              className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              {...registerForm.register("email")}
                            />
                            {registerForm.formState.errors.email && (
                              <p className="text-sm text-red-500">
                                {registerForm.formState.errors.email.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="userType" className="text-gray-700 font-semibold">Kullanıcı Tipi</Label>
                            <Select onValueChange={(value) => registerForm.setValue("userType", value)}>
                              <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                                <SelectValue placeholder="Kullanıcı tipinizi seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                {userTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    <div className="flex items-center space-x-2">
                                      <type.icon className="h-4 w-4" />
                                      <div>
                                        <p className="font-medium">{type.label}</p>
                                        <p className="text-xs text-gray-500">{type.desc}</p>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {registerForm.formState.errors.userType && (
                              <p className="text-sm text-red-500">
                                {registerForm.formState.errors.userType.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="regPassword" className="text-gray-700 font-semibold">Şifre</Label>
                            <Input
                              id="regPassword"
                              type="password"
                              placeholder="********"
                              className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              {...registerForm.register("password")}
                            />
                            {registerForm.formState.errors.password && (
                              <p className="text-sm text-red-500">
                                {registerForm.formState.errors.password.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold">Şifre Tekrar</Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              placeholder="********"
                              className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              {...registerForm.register("confirmPassword")}
                            />
                            {registerForm.formState.errors.confirmPassword && (
                              <p className="text-sm text-red-500">
                                {registerForm.formState.errors.confirmPassword.message}
                              </p>
                            )}
                          </div>
                          <Button
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                            disabled={registerMutation.isPending}
                          >
                            {registerMutation.isPending ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
                          </Button>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              /* Visual Dashboard Illustration */
              <div className="lg:pl-8">
                <div className="relative">
                  <div className="absolute -top-8 -left-8 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
                  <div className="relative">
                    <svg 
                      viewBox="0 0 600 500" 
                      className="w-full h-auto max-w-2xl mx-auto"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Dashboard Background */}
                      <rect x="50" y="60" width="500" height="380" rx="20" fill="url(#dashboardGradient)" stroke="url(#borderGradient)" strokeWidth="2"/>
                      
                      {/* Header Bar */}
                      <rect x="70" y="80" width="460" height="50" rx="8" fill="url(#headerGradient)"/>
                      <circle cx="100" cy="105" r="8" fill="#3b82f6"/>
                      <circle cx="120" cy="105" r="8" fill="#10b981"/>
                      <circle cx="140" cy="105" r="8" fill="#f59e0b"/>
                      
                      {/* Stats Cards */}
                      <rect x="80" y="150" width="120" height="80" rx="12" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
                      <rect x="220" y="150" width="120" height="80" rx="12" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
                      <rect x="360" y="150" width="120" height="80" rx="12" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
                      
                      {/* Chart Area */}
                      <rect x="80" y="250" width="200" height="150" rx="12" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
                      
                      {/* Chart Lines */}
                      <polyline points="100,350 120,330 140,340 160,320 180,310 200,300 220,290 240,280 260,270" 
                                fill="none" stroke="url(#chartGradient)" strokeWidth="3" strokeLinecap="round"/>
                      
                      {/* Property List */}
                      <rect x="300" y="250" width="180" height="150" rx="12" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
                      <rect x="315" y="265" width="150" height="25" rx="4" fill="#f8fafc"/>
                      <rect x="315" y="295" width="150" height="25" rx="4" fill="#f8fafc"/>
                      <rect x="315" y="325" width="150" height="25" rx="4" fill="#f8fafc"/>
                      <rect x="315" y="355" width="150" height="25" rx="4" fill="#f8fafc"/>
                      
                      {/* Notification Bell */}
                      <circle cx="480" cy="105" r="12" fill="#ef4444"/>
                      <text x="480" y="109" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">3</text>
                      
                      {/* Property Icons */}
                      <rect x="90" y="160" width="15" height="12" rx="2" fill="#3b82f6"/>
                      <rect x="230" y="160" width="15" height="12" rx="2" fill="#10b981"/>
                      <rect x="370" y="160" width="15" height="12" rx="2" fill="#f59e0b"/>
                      
                      {/* Text Labels */}
                      <text x="140" y="185" textAnchor="middle" fill="#374151" fontSize="12" fontWeight="600">Toplam Mülk</text>
                      <text x="140" y="220" textAnchor="middle" fill="#3b82f6" fontSize="18" fontWeight="bold">127</text>
                      
                      <text x="280" y="185" textAnchor="middle" fill="#374151" fontSize="12" fontWeight="600">Aktif Kiracı</text>
                      <text x="280" y="220" textAnchor="middle" fill="#10b981" fontSize="18" fontWeight="bold">98</text>
                      
                      <text x="420" y="185" textAnchor="middle" fill="#374151" fontSize="12" fontWeight="600">Aylık Gelir</text>
                      <text x="420" y="220" textAnchor="middle" fill="#f59e0b" fontSize="18" fontWeight="bold">₺245K</text>
                      
                      {/* Floating Elements */}
                      <circle cx="520" cy="180" r="25" fill="url(#floatingGradient1)" opacity="0.8"/>
                      <circle cx="540" cy="320" r="18" fill="url(#floatingGradient2)" opacity="0.6"/>
                      <circle cx="30" cy="200" r="20" fill="url(#floatingGradient3)" opacity="0.7"/>
                      
                      {/* Gradients */}
                      <defs>
                        <linearGradient id="dashboardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f8fafc"/>
                          <stop offset="100%" stopColor="#f1f5f9"/>
                        </linearGradient>
                        <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6"/>
                          <stop offset="100%" stopColor="#6366f1"/>
                        </linearGradient>
                        <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#e2e8f0"/>
                          <stop offset="100%" stopColor="#cbd5e1"/>
                        </linearGradient>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6"/>
                          <stop offset="50%" stopColor="#6366f1"/>
                          <stop offset="100%" stopColor="#8b5cf6"/>
                        </linearGradient>
                        <radialGradient id="floatingGradient1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4"/>
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1"/>
                        </radialGradient>
                        <radialGradient id="floatingGradient2">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.4"/>
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.1"/>
                        </radialGradient>
                        <radialGradient id="floatingGradient3">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4"/>
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1"/>
                        </radialGradient>
                      </defs>
                    </svg>
                    
                    {/* Floating Action Buttons */}
                    <div className="absolute top-4 right-4 space-y-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-200 animate-pulse">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-200 animate-pulse" style={{animationDelay: '0.5s'}}>
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-200 animate-pulse" style={{animationDelay: '1s'}}>
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h3 className="text-5xl font-black text-gray-900 mb-6">
              Enterprise Seviye Özellikler
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Kurumsal müşterilerimizin güvendiği teknoloji altyapısı ile emlak portföyünüzü yönetin
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <Card className="relative text-center border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"></div>
                  <CardHeader className="relative pt-12 pb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-black text-gray-900 mb-3">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative pb-12">
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Key className="h-8 w-8 text-white" />
              </div>
              <div>
                <h4 className="text-3xl font-black bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  KiraTakip
                </h4>
                <p className="text-blue-200 text-sm font-medium tracking-wide">PROFESSIONAL EDITION</p>
              </div>
            </div>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
              Fortune 500 şirketlerinin güvendiği teknoloji ile emlak portföyünüzü dijitalleştirin.
              Türkiye'nin en kapsamlı emlak yönetim platformu.
            </p>
            <div className="mt-8 pt-8 border-t border-blue-800/50">
              <p className="text-blue-300 text-sm">
                © 2024 KiraTakip Professional Edition. Tüm hakları saklıdır.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}