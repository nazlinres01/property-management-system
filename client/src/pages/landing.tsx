import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Users, TrendingUp, Shield, CheckCircle, Home, UserCheck, Briefcase, Key } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
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
  const [activeTab, setActiveTab] = useState("login");
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
                onClick={() => window.location.href = "/dashboard"}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Dashboard'a Git
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
          </div>

            {/* Right Content - Auth Forms */}
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
                      Hoş Geldiniz
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-lg">
                      Profesyonel emlak yönetimi deneyimini başlatın
                    </CardDescription>
                  </CardHeader>
                <CardContent className="relative px-8 pb-12">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100/80 rounded-2xl p-1 h-14">
                      <TabsTrigger 
                        value="login"
                        className="rounded-xl font-semibold text-base data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-blue-600"
                      >
                        Giriş Yap
                      </TabsTrigger>
                      <TabsTrigger 
                        value="register"
                        className="rounded-xl font-semibold text-base data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-blue-600"
                      >
                        Kayıt Ol
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                      <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="ornek@email.com"
                            {...loginForm.register("email")}
                          />
                          {loginForm.formState.errors.email && (
                            <p className="text-sm text-red-500">
                              {loginForm.formState.errors.email.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Şifre</Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="********"
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
                          className="w-full bg-[hsl(var(--kiratakip-primary))] hover:bg-[hsl(var(--kiratakip-primary))]/90"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="register">
                      <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Ad Soyad</Label>
                          <Input
                            id="fullName"
                            placeholder="Adınız Soyadınız"
                            {...registerForm.register("fullName")}
                          />
                          {registerForm.formState.errors.fullName && (
                            <p className="text-sm text-red-500">
                              {registerForm.formState.errors.fullName.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="regEmail">Email</Label>
                          <Input
                            id="regEmail"
                            type="email"
                            placeholder="ornek@email.com"
                            {...registerForm.register("email")}
                          />
                          {registerForm.formState.errors.email && (
                            <p className="text-sm text-red-500">
                              {registerForm.formState.errors.email.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="userType">Kullanıcı Tipi</Label>
                          <Select onValueChange={(value) => registerForm.setValue("userType", value)}>
                            <SelectTrigger>
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
                          <Label htmlFor="regPassword">Şifre</Label>
                          <Input
                            id="regPassword"
                            type="password"
                            placeholder="********"
                            {...registerForm.register("password")}
                          />
                          {registerForm.formState.errors.password && (
                            <p className="text-sm text-red-500">
                              {registerForm.formState.errors.password.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="********"
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
                          className="w-full bg-[hsl(var(--kiratakip-primary))] hover:bg-[hsl(var(--kiratakip-primary))]/90"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-[hsl(var(--kiratakip-neutral-800))] mb-4">
              Neden KiraTakip?
            </h3>
            <p className="text-lg text-[hsl(var(--kiratakip-neutral-600))] max-w-2xl mx-auto">
              Modern emlak yönetimi için ihtiyacınız olan tüm araçlar tek platformda
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-r from-[hsl(var(--kiratakip-primary))] to-[hsl(var(--kiratakip-secondary))] rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-[hsl(var(--kiratakip-neutral-800))]">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[hsl(var(--kiratakip-neutral-600))]">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[hsl(var(--kiratakip-neutral-800))] text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-[hsl(var(--kiratakip-primary))] to-[hsl(var(--kiratakip-secondary))] rounded-lg flex items-center justify-center">
                <Key className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-xl font-bold">KiraTakip</h4>
            </div>
            <p className="text-gray-400">
              Emlak yönetiminde güvenilir çözüm ortağınız
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}