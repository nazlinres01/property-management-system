import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdvancedFilter from "@/components/filters/advanced-filter";
import QuickSearch from "@/components/filters/quick-search";
import { Edit, Eye, Mail, Search, ArrowUpDown, Filter, Download, RefreshCw } from "lucide-react";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import type { PropertyWithDetails } from "@shared/schema";

export default function PropertyTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "occupied">("all");
  const [sortBy, setSortBy] = useState<"address" | "rent" | "date">("address");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, any>>({});

  const { data: properties, isLoading } = useQuery({
    queryKey: ["/api/properties"],
  });

  // Define filter configuration
  const filterConfig = [
    {
      type: 'text' as const,
      label: 'Adres',
      key: 'address',
      placeholder: 'Adres ara...'
    },
    {
      type: 'select' as const,
      label: 'Mülk Tipi',
      key: 'type',
      options: [
        { value: 'Daire', label: 'Daire' },
        { value: 'Villa', label: 'Villa' },
        { value: 'Ofis', label: 'Ofis' },
        { value: 'Dükkan', label: 'Dükkan' }
      ],
      placeholder: 'Mülk tipi seçin'
    },
    {
      type: 'select' as const,
      label: 'Durum',
      key: 'status',
      options: [
        { value: 'available', label: 'Boş' },
        { value: 'occupied', label: 'Dolu' }
      ],
      placeholder: 'Durum seçin'
    },
    {
      type: 'number' as const,
      label: 'Min Kira',
      key: 'minRent',
      placeholder: 'Minimum kira'
    },
    {
      type: 'number' as const,
      label: 'Max Kira',
      key: 'maxRent',
      placeholder: 'Maksimum kira'
    }
  ];

  // Apply filters using useMemo for performance
  const filteredProperties = useMemo(() => {
    if (!Array.isArray(properties)) return [];
    
    return properties.filter((property: PropertyWithDetails) => {
      // Quick search filter
      const matchesSearch = !searchTerm || (
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.landlord.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (property.tenant && property.tenant.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      // Status filter (basic)
      let matchesStatus = true;
      if (statusFilter === "available") {
        matchesStatus = Boolean(property.isAvailable);
      } else if (statusFilter === "occupied") {
        matchesStatus = !Boolean(property.isAvailable);
      }

      // Advanced filters
      let matchesAdvanced = true;
      if (Object.keys(advancedFilters).length > 0) {
        // Address filter
        if (advancedFilters.address) {
          matchesAdvanced = matchesAdvanced && property.address.toLowerCase().includes(advancedFilters.address.toLowerCase());
        }

        // Type filter
        if (advancedFilters.type) {
          matchesAdvanced = matchesAdvanced && property.type === advancedFilters.type;
        }

        // Status filter (advanced)
        if (advancedFilters.status) {
          if (advancedFilters.status === 'available') {
            matchesAdvanced = matchesAdvanced && (property.isAvailable === true);
          } else if (advancedFilters.status === 'occupied') {
            matchesAdvanced = matchesAdvanced && (property.isAvailable === false);
          }
        }

        // Rent range filters
        if (advancedFilters.minRent) {
          matchesAdvanced = matchesAdvanced && parseFloat(property.monthlyRent) >= parseFloat(advancedFilters.minRent);
        }
        if (advancedFilters.maxRent) {
          matchesAdvanced = matchesAdvanced && parseFloat(property.monthlyRent) <= parseFloat(advancedFilters.maxRent);
        }
      }

      return matchesSearch && matchesStatus && matchesAdvanced;
    });
  }, [properties, searchTerm, statusFilter, advancedFilters]);

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case "address":
        aValue = a.address;
        bValue = b.address;
        break;
      case "rent":
        aValue = parseFloat(a.monthlyRent);
        bValue = parseFloat(b.monthlyRent);
        break;
      case "date":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        aValue = a.address;
        bValue = b.address;
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

  const handleSort = (column: "address" | "rent" | "date") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleExport = () => {
    const csvData = sortedProperties.map(property => ({
      'Adres': property.address,
      'Tip': property.type,
      'Alan (m²)': property.area,
      'Kat': property.floor,
      'Aylık Kira': property.monthlyRent,
      'Durum': property.isAvailable ? 'Müsait' : 'Dolu',
      'Ev Sahibi': property.landlord.name,
      'Kiracı': property.tenant?.name || 'Yok',
      'Kiracı Telefon': property.tenant?.phone || '-',
      'Son Ödeme Tarihi': property.lastPayment ? formatDate(property.lastPayment.dueDate) : '-',
      'Ödeme Durumu': property.lastPayment?.status === 'paid' ? 'Ödendi' : 
                     property.lastPayment?.status === 'overdue' ? 'Gecikme' :
                     property.lastPayment?.status === 'pending' ? 'Bekliyor' : '-'
    }));

    const csvContent = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `mulkler_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getStatusBadge = (property: PropertyWithDetails) => {
    if (property.isAvailable) {
      return (
        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
          Müsait
        </Badge>
      );
    }

    if (property.lastPayment) {
      const dueDate = new Date(property.lastPayment.dueDate);
      const now = new Date();
      const isOverdue = dueDate < now && property.lastPayment.status !== "paid";

      if (isOverdue) {
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Ödeme Gecikme
          </Badge>
        );
      }
    }

    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
        Aktif
      </Badge>
    );
  };

  return (
    <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-[hsl(var(--kiratakip-neutral-800))]">
            Mülk Durumu
          </CardTitle>
          <div className="flex space-x-2">
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
        
        {/* Quick Search */}
        <QuickSearch
          placeholder="Mülk ara... (adres, tip, ev sahibi, kiracı)"
          onSearch={setSearchTerm}
          className="mb-4"
        />

        {/* Advanced Filter Component */}
        <AdvancedFilter
          title="Mülk"
          filters={filterConfig}
          onFilterChange={setAdvancedFilters}
          onReset={() => setAdvancedFilters({})}
          activeFilters={advancedFilters}
          isOpen={showAdvancedFilter}
          onToggle={() => setShowAdvancedFilter(!showAdvancedFilter)}
        />

        {/* Basic Status Filter */}
        <div className="flex items-center space-x-4 mb-4">
          <Select value={statusFilter} onValueChange={(value: "all" | "available" | "occupied") => setStatusFilter(value)}>
            <SelectTrigger className="w-[180px] border-[hsl(var(--kiratakip-neutral-100))]">
              <SelectValue placeholder="Durum filtrele" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Mülkler</SelectItem>
              <SelectItem value="available">Müsait</SelectItem>
              <SelectItem value="occupied">Dolu</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
            {isLoading ? "Yükleniyor..." : `${sortedProperties.length} mülk bulundu`}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[hsl(var(--kiratakip-neutral-50))]">
                <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("address")}
                    className="h-auto p-0 font-medium text-[hsl(var(--kiratakip-neutral-400))] hover:text-[hsl(var(--kiratakip-neutral-800))]"
                  >
                    Mülk
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                  Kiracı
                </TableHead>
                <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("rent")}
                    className="h-auto p-0 font-medium text-[hsl(var(--kiratakip-neutral-400))] hover:text-[hsl(var(--kiratakip-neutral-800))]"
                  >
                    Kira
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                  Durum
                </TableHead>
                <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                  Son Ödeme
                </TableHead>
                <TableHead className="text-center text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                  İşlemler
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-[hsl(var(--kiratakip-neutral-400))]">
                      Yükleniyor...
                    </div>
                  </TableCell>
                </TableRow>
              ) : sortedProperties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-[hsl(var(--kiratakip-neutral-400))]">
                      {searchTerm || statusFilter !== "all" 
                        ? "Arama kriterine uygun mülk bulunamadı" 
                        : "Henüz mülk kaydı bulunmuyor"}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sortedProperties.map((property: PropertyWithDetails) => (
                  <TableRow
                    key={property.id}
                    className="hover:bg-[hsl(var(--kiratakip-neutral-50))] transition-colors"
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm text-[hsl(var(--kiratakip-neutral-800))]">
                          {property.address}
                        </p>
                        <p className="text-xs text-[hsl(var(--kiratakip-neutral-400))]">
                          {property.type} • {property.area}m² • {property.floor}. Kat
                          {property.hasBalcony && " • Balkonlu"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {property.tenant ? (
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-[hsl(var(--kiratakip-primary))] text-white font-semibold text-xs">
                              {getInitials(property.tenant.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm text-[hsl(var(--kiratakip-neutral-800))]">
                              {property.tenant.name}
                            </p>
                            <p className="text-xs text-[hsl(var(--kiratakip-neutral-400))]">
                              {property.tenant.phone}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">
                            Boş
                          </Badge>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-sm text-[hsl(var(--kiratakip-neutral-800))]">
                          {formatCurrency(property.monthlyRent)}
                        </p>
                        <p className="text-xs text-[hsl(var(--kiratakip-neutral-400))]">
                          Aylık
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(property)}
                    </TableCell>
                    <TableCell>
                      {property.lastPayment ? (
                        <div>
                          <p className="text-sm text-[hsl(var(--kiratakip-neutral-800))]">
                            {formatDate(property.lastPayment.paidDate || property.lastPayment.dueDate)}
                          </p>
                          <p className={`text-xs ${
                            property.lastPayment.status === "paid" 
                              ? "text-green-600" 
                              : property.lastPayment.status === "overdue"
                              ? "text-red-600"
                              : "text-orange-600"
                          }`}>
                            {property.lastPayment.status === "paid" 
                              ? "Zamanında" 
                              : property.lastPayment.status === "overdue"
                              ? "Gecikme"
                              : "Bekliyor"}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                          -
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
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
                        {property.tenant && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[hsl(var(--kiratakip-neutral-400))] hover:text-[hsl(var(--kiratakip-accent))]"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {sortedProperties.length > 0 && (
          <div className="p-6 border-t border-[hsl(var(--kiratakip-neutral-100))]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                <span className="font-medium">1-{Math.min(10, sortedProperties.length)}</span> / 
                <span className="ml-1">{sortedProperties.length}</span> mülk gösteriliyor
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[hsl(var(--kiratakip-neutral-100))] text-[hsl(var(--kiratakip-neutral-600))] hover:bg-[hsl(var(--kiratakip-neutral-50))]"
                >
                  Önceki
                </Button>
                <Button
                  size="sm"
                  className="bg-[hsl(var(--kiratakip-primary))] text-white hover:bg-[hsl(var(--kiratakip-primary))]/90"
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[hsl(var(--kiratakip-neutral-100))] text-[hsl(var(--kiratakip-neutral-600))] hover:bg-[hsl(var(--kiratakip-neutral-50))]"
                >
                  Sonraki
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
