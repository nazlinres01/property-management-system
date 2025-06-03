import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Topbar from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Mail,
  Phone,
  Key,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw
} from "lucide-react";

interface SettingsProps {
  onMenuClick?: () => void;
}

export default function Settings({ onMenuClick }: SettingsProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    fullName: "Nazlı Nur Esmeray",
    email: "nazli@example.com",
    phone: "+90 555 123 4567",
    company: "KiraTakip Ltd.",
    userType: "admin"
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    paymentReminders: true,
    contractExpiry: true,
    maintenanceAlerts: false,
    marketingEmails: false
  });

  // System settings
  const [systemSettings, setSystemSettings] = useState({
    language: "tr",
    currency: "TRY",
    dateFormat: "DD/MM/YYYY",
    timezone: "Europe/Istanbul",
    theme: "light",
    autoBackup: true,
    dataRetention: "12"
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Profil güncellenemedi");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Profil bilgileri güncellendi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Profil güncellenemedi",
        variant: "destructive",
      });
    },
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/user/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Bildirim ayarları güncellenemedi");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Bildirim ayarları güncellendi",
      });
    },
  });

  const exportDataMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/export/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Veri dışa aktarılamadı");
      return response.blob();
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kiratakip-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Başarılı",
        description: "Veriler dışa aktarıldı",
      });
    },
  });

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "notifications", label: "Bildirimler", icon: Bell },
    { id: "security", label: "Güvenlik", icon: Shield },
    { id: "system", label: "Sistem", icon: SettingsIcon },
    { id: "data", label: "Veri Yönetimi", icon: Database },
  ];

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Kişisel Bilgiler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Ad Soyad</Label>
              <Input
                id="fullName"
                value={profileData.fullName}
                onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="company">Şirket</Label>
              <Input
                id="company"
                value={profileData.company}
                onChange={(e) => setProfileData({...profileData, company: e.target.value})}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="userType">Kullanıcı Tipi</Label>
            <Select value={profileData.userType} onValueChange={(value) => setProfileData({...profileData, userType: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Yönetici</SelectItem>
                <SelectItem value="landlord">Ev Sahibi</SelectItem>
                <SelectItem value="agent">Emlak Uzmanı</SelectItem>
                <SelectItem value="tenant">Kiracı</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={() => updateProfileMutation.mutate(profileData)}
            disabled={updateProfileMutation.isPending}
            className="bg-[hsl(var(--kiratakip-primary))]"
          >
            <Save className="h-4 w-4 mr-2" />
            {updateProfileMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Bildirim Tercihleri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>E-posta Bildirimleri</Label>
                <p className="text-sm text-gray-500">Önemli güncellemeler için e-posta al</p>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => setNotifications({...notifications, emailNotifications: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>SMS Bildirimleri</Label>
                <p className="text-sm text-gray-500">Acil durumlar için SMS al</p>
              </div>
              <Switch
                checked={notifications.smsNotifications}
                onCheckedChange={(checked) => setNotifications({...notifications, smsNotifications: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Ödeme Hatırlatmaları</Label>
                <p className="text-sm text-gray-500">Ödeme tarihleri yaklaştığında bildir</p>
              </div>
              <Switch
                checked={notifications.paymentReminders}
                onCheckedChange={(checked) => setNotifications({...notifications, paymentReminders: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Sözleşme Sonu Uyarıları</Label>
                <p className="text-sm text-gray-500">Sözleşme bitiş tarihleri için uyarı</p>
              </div>
              <Switch
                checked={notifications.contractExpiry}
                onCheckedChange={(checked) => setNotifications({...notifications, contractExpiry: checked})}
              />
            </div>
          </div>
          
          <Button 
            onClick={() => updateNotificationsMutation.mutate(notifications)}
            disabled={updateNotificationsMutation.isPending}
            className="bg-[hsl(var(--kiratakip-primary))]"
          >
            <Save className="h-4 w-4 mr-2" />
            Bildirimleri Kaydet
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Güvenlik Ayarları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Şifre Değiştir</Label>
            <div className="space-y-2 mt-2">
              <Input type="password" placeholder="Mevcut şifre" />
              <Input type="password" placeholder="Yeni şifre" />
              <Input type="password" placeholder="Yeni şifre tekrar" />
            </div>
            <Button className="mt-2" variant="outline">
              <Key className="h-4 w-4 mr-2" />
              Şifreyi Güncelle
            </Button>
          </div>
          
          <Separator />
          
          <div>
            <Label>İki Faktörlü Doğrulama</Label>
            <p className="text-sm text-gray-500 mt-1">Hesap güvenliğini artır</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="bg-red-50 text-red-700">Pasif</Badge>
              <Button size="sm" variant="outline">Etkinleştir</Button>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <Label>Aktif Oturumlar</Label>
            <p className="text-sm text-gray-500 mt-1">Diğer cihazlardaki oturumları yönet</p>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="text-sm font-medium">Windows - Chrome</p>
                  <p className="text-xs text-gray-500">Bu cihaz - Şimdi aktif</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Aktif</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Sistem Tercihleri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Dil</Label>
              <Select value={systemSettings.language} onValueChange={(value) => setSystemSettings({...systemSettings, language: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tr">Türkçe</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Para Birimi</Label>
              <Select value={systemSettings.currency} onValueChange={(value) => setSystemSettings({...systemSettings, currency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRY">₺ Türk Lirası</SelectItem>
                  <SelectItem value="USD">$ Amerikan Doları</SelectItem>
                  <SelectItem value="EUR">€ Euro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Tarih Formatı</Label>
              <Select value={systemSettings.dateFormat} onValueChange={(value) => setSystemSettings({...systemSettings, dateFormat: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Tema</Label>
              <Select value={systemSettings.theme} onValueChange={(value) => setSystemSettings({...systemSettings, theme: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Açık Tema</SelectItem>
                  <SelectItem value="dark">Koyu Tema</SelectItem>
                  <SelectItem value="auto">Otomatik</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button className="bg-[hsl(var(--kiratakip-primary))]">
            <Save className="h-4 w-4 mr-2" />
            Sistem Ayarlarını Kaydet
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderDataManagement = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Veri Yönetimi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Veri Dışa Aktarma</Label>
            <p className="text-sm text-gray-500 mt-1">Tüm verilerinizi JSON formatında indirin</p>
            <Button 
              className="mt-2" 
              variant="outline"
              onClick={() => exportDataMutation.mutate()}
              disabled={exportDataMutation.isPending}
            >
              <Download className="h-4 w-4 mr-2" />
              {exportDataMutation.isPending ? "Hazırlanıyor..." : "Verileri İndir"}
            </Button>
          </div>
          
          <Separator />
          
          <div>
            <Label>Veri İçe Aktarma</Label>
            <p className="text-sm text-gray-500 mt-1">JSON dosyasından veri yükleyin</p>
            <div className="flex items-center gap-2 mt-2">
              <Input type="file" accept=".json" className="flex-1" />
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Yükle
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <Label className="text-red-600">Tehlikeli Bölge</Label>
            <p className="text-sm text-gray-500 mt-1">Bu işlemler geri alınamaz</p>
            <div className="space-y-2 mt-2">
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Tüm Verileri Sil
              </Button>
              <p className="text-xs text-gray-400">Bu işlem tüm verilerinizi kalıcı olarak siler</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Topbar
        title="Ayarlar"
        onMenuClick={onMenuClick}
      />

      <div className="flex">
        {/* Settings Sidebar */}
        <div className="w-64 bg-white border-r p-4">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-[hsl(var(--kiratakip-primary))] text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-6">
          {activeTab === "profile" && renderProfileSettings()}
          {activeTab === "notifications" && renderNotificationSettings()}
          {activeTab === "security" && renderSecuritySettings()}
          {activeTab === "system" && renderSystemSettings()}
          {activeTab === "data" && renderDataManagement()}
        </div>
      </div>
    </div>
  );
}