import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Topbar from "@/components/layout/topbar";
import LandlordModal from "@/components/modals/landlord-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Eye, Mail, Phone, Search, Building } from "lucide-react";
import { getInitials, formatDate } from "@/lib/utils";
import type { Landlord } from "@shared/schema";

interface LandlordsProps {
  onMenuClick?: () => void;
}

export default function Landlords({ onMenuClick }: LandlordsProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingLandlord, setEditingLandlord] = useState<Landlord | undefined>();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: landlords, isLoading } = useQuery({
    queryKey: ["/api/landlords"],
  });

  const filteredLandlords = landlords?.filter((landlord: Landlord) =>
    landlord.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    landlord.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    landlord.phone.includes(searchTerm)
  ) || [];

  const handleEdit = (landlord: Landlord) => {
    setEditingLandlord(landlord);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingLandlord(undefined);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLandlord(undefined);
  };

  return (
    <div className="min-h-screen">
      <Topbar
        title="Ev Sahipleri"
        onMenuClick={onMenuClick || (() => {})}
        onQuickAction={handleAdd}
        quickActionLabel="Yeni Ev Sahibi"
      />

      <div className="p-6">
        {/* Search and Filters */}
        <Card className="mb-6 border-[hsl(var(--kiratakip-neutral-100))]">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--kiratakip-neutral-400))] h-4 w-4" />
                <Input
                  placeholder="Ev sahibi ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-[hsl(var(--kiratakip-neutral-100))]"
                />
              </div>
              <div className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                {isLoading ? "Yükleniyor..." : `${filteredLandlords.length} ev sahibi bulundu`}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Landlords Table */}
        <Card className="border-[hsl(var(--kiratakip-neutral-100))]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[hsl(var(--kiratakip-neutral-800))]">
              Ev Sahibi Listesi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[hsl(var(--kiratakip-neutral-50))]">
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      Ev Sahibi
                    </TableHead>
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      İletişim
                    </TableHead>
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      TC Kimlik
                    </TableHead>
                    <TableHead className="text-[hsl(var(--kiratakip-neutral-400))] font-medium">
                      Vergi No
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
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="text-[hsl(var(--kiratakip-neutral-400))]">
                          Yükleniyor...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredLandlords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="text-[hsl(var(--kiratakip-neutral-400))]">
                          {searchTerm ? "Arama kriterine uygun ev sahibi bulunamadı" : "Henüz ev sahibi kaydı bulunmuyor"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLandlords.map((landlord: Landlord) => (
                      <TableRow
                        key={landlord.id}
                        className="hover:bg-[hsl(var(--kiratakip-neutral-50))] transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-[hsl(var(--kiratakip-secondary))] text-white font-semibold text-sm">
                                {getInitials(landlord.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-[hsl(var(--kiratakip-neutral-800))]">
                                {landlord.name}
                              </p>
                              {landlord.address && (
                                <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                                  {landlord.address}
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
                                {landlord.email}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-3 w-3 text-[hsl(var(--kiratakip-neutral-400))]" />
                              <span className="text-sm text-[hsl(var(--kiratakip-neutral-600))]">
                                {landlord.phone}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-[hsl(var(--kiratakip-neutral-600))]">
                            {landlord.nationalId}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-[hsl(var(--kiratakip-neutral-600))]">
                            {landlord.taxNumber || "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-[hsl(var(--kiratakip-neutral-600))]">
                            {formatDate(landlord.createdAt)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(landlord)}
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
                              <Building className="h-4 w-4" />
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

      <LandlordModal
        open={showModal}
        onClose={handleCloseModal}
        landlord={editingLandlord}
      />
    </div>
  );
}
