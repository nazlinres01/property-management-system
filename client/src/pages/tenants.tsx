import { useState, useMemo } from "react";
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
import AdvancedFilter from "@/components/filters/advanced-filter";
import QuickSearch from "@/components/filters/quick-search";
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
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<"name" | "email" | "date">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, any>>({});

  const { data: tenants, isLoading } = useQuery({
    queryKey: ["/api/tenants"],
  });

  // Define filter configuration for tenants
  const filterConfig = [
    {
      type: 'text' as const,
      label: 'İsim',
      key: 'name',
      placeholder: 'İsim ara...'
    },
    {
      type: 'text' as const,
      label: 'E-posta',
      key: 'email',
      placeholder: 'E-posta ara...'
    },
    {
      type: 'text' as const,
      label: 'Telefon',
      key: 'phone',
      placeholder: 'Telefon ara...'
    },
    {
      type: 'select' as const,
      label: 'Durum',
      key: 'status',
      options: [
        { value: 'active', label: 'Aktif' },
        { value: 'inactive', label: 'Pasif' }
      ],
      placeholder: 'Durum seçin'
    }
  ];

  // Apply filters using useMemo for performance
  const filteredTenants = useMemo(() => {
    if (!Array.isArray(tenants)) return [];
    
    return tenants.filter((tenant: Tenant) => {
      // Quick search filter
      const matchesSearch = !searchTerm || (
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.phone.includes(searchTerm)
      );

      // Status filter (basic) - using created date as activity indicator
      let matchesStatus = true;
      if (statusFilter === "active") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        matchesStatus = new Date(tenant.createdAt) > thirtyDaysAgo;
      } else if (statusFilter === "inactive") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        matchesStatus = new Date(tenant.createdAt) <= thirtyDaysAgo;
      }

      // Advanced filters
      let matchesAdvanced = true;
      if (Object.keys(advancedFilters).length > 0) {
        // Name filter
        if (advancedFilters.name) {
          matchesAdvanced = matchesAdvanced && tenant.name.toLowerCase().includes(advancedFilters.name.toLowerCase());
        }

        // Email filter
        if (advancedFilters.email) {
          matchesAdvanced = matchesAdvanced && tenant.email.toLowerCase().includes(advancedFilters.email.toLowerCase());
        }

        // Phone filter
        if (advancedFilters.phone) {
          matchesAdvanced = matchesAdvanced && tenant.phone.includes(advancedFilters.phone);
        }

        // Status filter (advanced) - using created date as activity indicator
        if (advancedFilters.status) {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          if (advancedFilters.status === 'active') {
            matchesAdvanced = matchesAdvanced && (new Date(tenant.createdAt) > thirtyDaysAgo);
          } else if (advancedFilters.status === 'inactive') {
            matchesAdvanced = matchesAdvanced && (new Date(tenant.createdAt) <= thirtyDaysAgo);
          }
        }
      }

      return matchesSearch && matchesStatus && matchesAdvanced;
    });
  }, [tenants, searchTerm, statusFilter, advancedFilters]);

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
            {/* Quick Search */}
            <QuickSearch
              placeholder="Kiracı ara... (isim, e-posta, telefon)"
              onSearch={setSearchTerm}
              className="mb-4"
            />

            {/* Advanced Filter Component */}
            <AdvancedFilter
              title="Kiracı"
              filters={filterConfig}
              onFilterChange={setAdvancedFilters}
              onReset={() => setAdvancedFilters({})}
              activeFilters={advancedFilters}
              isOpen={showAdvancedFilter}
              onToggle={() => setShowAdvancedFilter(!showAdvancedFilter)}
            />

            {/* Basic Status Filter */}
            <div className="flex items-center justify-between">
              <Select value={statusFilter} onValueChange={(value: "all" | "active" | "inactive") => setStatusFilter(value)}>
                <SelectTrigger className="w-[180px] border-[hsl(var(--kiratakip-neutral-100))]">
                  <SelectValue placeholder="Durum filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kiracılar</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Pasif</SelectItem>
                </SelectContent>
              </Select>

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
