import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Topbar from "@/components/layout/topbar";
import TenantModal from "@/components/modals/tenant-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Eye, Mail, Phone, Search, Filter, Download, ArrowUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getInitials, formatDate } from "@/lib/utils";
import type { Tenant } from "@shared/schema";

interface TenantsProps {
  onMenuClick?: () => void;
}

export default function Tenants({ onMenuClick }: TenantsProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { data: tenants, isLoading } = useQuery({
    queryKey: ["/api/tenants"],
  });

  const filteredTenants = (tenants || []).filter((tenant: Tenant) =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.phone.includes(searchTerm)
  );

  const sortedTenants = [...filteredTenants].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case "name":
        aValue = a.name;
        bValue = b.name;
        break;
      case "date":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        aValue = a.name;
        bValue = b.name;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc" 
        ? aValue.localeCompare(bValue, 'tr-TR')
        : bValue.localeCompare(aValue, 'tr-TR');
    }

    return sortOrder === "asc" 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const handleSort = (column: "name" | "date") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleExport = () => {
    const csvData = sortedTenants.map(tenant => ({
      'Ad Soyad': tenant.name,
      'Email': tenant.email,
      'Telefon': tenant.phone,
      'TC Kimlik': tenant.nationalId,
      'Adres': tenant.address || '-',
      'Kayıt Tarihi': formatDate(tenant.createdAt)
    }));

    const csvContent = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `kiracilar_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingTenant(undefined);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTenant(undefined);
  };

  return (
    <div className="min-h-screen">
      <Topbar
        title="Kiracılar"
        onMenuClick={onMenuClick || (() => {})}
        onQuickAction={handleAdd}
        quickActionLabel="Yeni Kiracı"
      />

      <div className="p-6">
        {/* Search and Filters */}
        <Card className="mb-6 border-[hsl(var(--kiratakip-neutral-100))]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-[hsl(var(--kiratakip-neutral-800))]">
                Kiracı Yönetimi
              </CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-[hsl(var(--kiratakip-neutral-600))]">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrele
                </Button>
                <Button 
                  onClick={handleExport}
                  className="bg-[hsl(var(--kiratakip-primary))] text-white hover:bg-[hsl(var(--kiratakip-primary))]/90"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Dışa Aktar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--kiratakip-neutral-400))] h-4 w-4" />
                <Input
                  placeholder="Kiracı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-[hsl(var(--kiratakip-neutral-100))]"
                />
              </div>
              <div className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                {isLoading ? "Yükleniyor..." : `${sortedTenants.length} kiracı bulundu`}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tenants Table */}
        <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[hsl(var(--kiratakip-neutral-800))]">
              Kiracı Listesi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[hsl(var(--kiratakip-neutral-50))]">
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      Kiracı
                    </TableHead>
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      İletişim
                    </TableHead>
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      TC Kimlik
                    </TableHead>
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      Kayıt Tarihi
                    </TableHead>
                    <TableHead className="text-center text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      İşlemler
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="text-[hsl(var(--kiratakip-neutral-400))]">
                          Yükleniyor...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : sortedTenants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="text-[hsl(var(--kiratakip-neutral-400))]">
                          {searchTerm ? "Arama kriterine uygun kiracı bulunamadı" : "Henüz kiracı kaydı bulunmuyor"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedTenants.map((tenant: Tenant) => (
                      <TableRow
                        key={tenant.id}
                        className="hover:bg-[hsl(var(--kiratakip-neutral-50))] transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-[hsl(var(--kiratakip-primary))] text-white font-semibold text-sm">
                                {getInitials(tenant.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-[hsl(var(--kiratakip-neutral-800))]">
                                {tenant.name}
                              </p>
                              {tenant.address && (
                                <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                                  {tenant.address}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Mail className="h-3 w-3 text-[hsl(var(--kiratakip-neutral-400))]" />
                              <span className="text-sm text-[hsl(var(--kiratakip-neutral-600))]">
                                {tenant.email}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-3 w-3 text-[hsl(var(--kiratakip-neutral-400))]" />
                              <span className="text-sm text-[hsl(var(--kiratakip-neutral-600))]">
                                {tenant.phone}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-[hsl(var(--kiratakip-neutral-600))]">
                            {tenant.nationalId}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-[hsl(var(--kiratakip-neutral-600))]">
                            {formatDate(tenant.createdAt)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(tenant)}
                              className="text-[hsl(var(--kiratakip-neutral-400))] hover:text-[hsl(var(--kiratakip-primary))]"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[hsl(var(--kiratakip-neutral-400))] hover:text-[hsl(var(--kiratakip-secondary))]"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <TenantModal
        open={showModal}
        onClose={handleCloseModal}
        tenant={editingTenant}
      />
    </div>
  );
}
