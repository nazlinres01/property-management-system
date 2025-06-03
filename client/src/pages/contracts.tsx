import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Topbar from "@/components/layout/topbar";
import ContractModal from "@/components/modals/contract-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Eye, Search, FileText } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ContractWithDetails } from "@shared/schema";

interface ContractsProps {
  onMenuClick?: () => void;
}

export default function Contracts({ onMenuClick }: ContractsProps) {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: contracts, isLoading } = useQuery({
    queryKey: ["/api/contracts"],
  });

  const filteredContracts = contracts?.filter((contract: ContractWithDetails) =>
    contract.tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.landlord.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusBadge = (contract: ContractWithDetails) => {
    const now = new Date();
    const endDate = new Date(contract.endDate);
    
    if (!contract.isActive) {
      return <Badge variant="secondary">Pasif</Badge>;
    }
    
    if (endDate < now) {
      return <Badge variant="destructive">Süresi Dolmuş</Badge>;
    }
    
    const daysToExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysToExpiry <= 30) {
      return <Badge variant="outline" className="text-orange-600 border-orange-600">Yakında Bitecek</Badge>;
    }
    
    return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Aktif</Badge>;
  };

  return (
    <div className="min-h-screen">
      <Topbar
        title="Sözleşmeler"
        onMenuClick={onMenuClick || (() => {})}
        onQuickAction={() => setShowModal(true)}
        quickActionLabel="Yeni Sözleşme"
      />

      <div className="p-6">
        {/* Search and Filters */}
        <Card className="mb-6 border-[hsl(var(--kiratakip-neutral-100))]">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--kiratakip-neutral-400))] h-4 w-4" />
                <Input
                  placeholder="Sözleşme ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-[hsl(var(--kiratakip-neutral-100))]"
                />
              </div>
              <div className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                {isLoading ? "Yükleniyor..." : `${filteredContracts.length} sözleşme bulundu`}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contracts Table */}
        <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[hsl(var(--kiratakip-neutral-800))]">
              Sözleşme Listesi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[hsl(var(--kiratakip-neutral-50))]">
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      Mülk
                    </TableHead>
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      Kiracı
                    </TableHead>
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      Ev Sahibi
                    </TableHead>
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      Kira
                    </TableHead>
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      Süre
                    </TableHead>
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      Durum
                    </TableHead>
                    <TableHead className="text-center text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      İşlemler
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="text-[hsl(var(--kiratakip-neutral-400))]">
                          Yükleniyor...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredContracts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="text-[hsl(var(--kiratakip-neutral-400))]">
                          {searchTerm ? "Arama kriterine uygun sözleşme bulunamadı" : "Henüz sözleşme kaydı bulunmuyor"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredContracts.map((contract: ContractWithDetails) => (
                      <TableRow
                        key={contract.id}
                        className="hover:bg-[hsl(var(--kiratakip-neutral-50))] transition-colors"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium text-[hsl(var(--kiratakip-neutral-800))]">
                              {contract.property.address}
                            </p>
                            <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                              {contract.property.type} • {contract.property.area}m²
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-[hsl(var(--kiratakip-neutral-800))]">
                              {contract.tenant.name}
                            </p>
                            <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                              {contract.tenant.phone}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-[hsl(var(--kiratakip-neutral-800))]">
                              {contract.landlord.name}
                            </p>
                            <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                              {contract.landlord.phone}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-[hsl(var(--kiratakip-neutral-800))]">
                              {formatCurrency(contract.monthlyRent)}
                            </p>
                            <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                              Aylık
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm text-[hsl(var(--kiratakip-neutral-800))]">
                              {formatDate(contract.startDate)}
                            </p>
                            <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                              {formatDate(contract.endDate)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(contract)}
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
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[hsl(var(--kiratakip-neutral-400))] hover:text-[hsl(var(--kiratakip-accent))]"
                            >
                              <FileText className="h-4 w-4" />
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

      <ContractModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
