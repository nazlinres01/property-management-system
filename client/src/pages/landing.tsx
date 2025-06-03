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
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--kiratakip-primary))]/5 to-[hsl(var(--kiratakip-secondary))]/10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[hsl(var(--kiratakip-neutral-100))] sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[hsl(var(--kiratakip-primary))] to-[hsl(var(--kiratakip-secondary))] rounded-lg flex items-center justify-center">
                  <Key className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-[hsl(var(--kiratakip-neutral-800))]">
                  KiraTakip
                </h1>
              </div>
              <Button 
                onClick={() => window.location.href = "/dashboard"}
                className="bg-[hsl(var(--kiratakip-primary))] hover:bg-[hsl(var(--kiratakip-primary))]/90 text-white"
              >
                Dashboard'a Git
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-[hsl(var(--kiratakip-primary))]/10 text-[hsl(var(--kiratakip-primary))] border-[hsl(var(--kiratakip-primary))]/20">
                  Türkiye'nin Emlak Yönetim Platformu
                </Badge>
                <h2 className="text-5xl font-bold text-[hsl(var(--kiratakip-neutral-800))] leading-tight">
                  Emlak Yönetiminde
                  <span className="text-[hsl(var(--kiratakip-primary))]"> Yeni Nesil </span>
                  Çözüm
                </h2>
                <p className="text-xl text-[hsl(var(--kiratakip-neutral-600))] leading-relaxed">
                  Ev sahipleri, kiracılar, emlakçılar ve yönetim şirketleri için 
                  tasarlanmış kapsamlı emlak yönetim sistemi. Tüm süreçlerinizi 
                  dijitalleştirin, verimliliğinizi artırın.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-[hsl(var(--kiratakip-neutral-700))]">Sözleşme Yönetimi</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-[hsl(var(--kiratakip-neutral-700))]">Otomatik Bildirimler</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-[hsl(var(--kiratakip-neutral-700))]">Finansal Raporlar</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-[hsl(var(--kiratakip-neutral-700))]">Mobil Uyumlu</span>
                </div>
              </div>
            </div>

            {/* Right Content - Auth Forms */}
            <div className="lg:pl-8">
              <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl text-[hsl(var(--kiratakip-neutral-800))]">
                    Hesabınıza Erişin
                  </CardTitle>
                  <CardDescription>
                    Emlak yönetimi platformuna giriş yapın veya hesap oluşturun
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="login">Giriş Yap</TabsTrigger>
                      <TabsTrigger value="register">Kayıt Ol</TabsTrigger>
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