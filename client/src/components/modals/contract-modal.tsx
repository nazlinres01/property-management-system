import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContractSchema, type InsertContract, type Contract, type Tenant, type Property, type Landlord } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { File, Save, X } from "lucide-react";

interface ContractModalProps {
  open: boolean;
  onClose: () => void;
  contract?: Contract;
}

export default function ContractModal({ open, onClose, contract }: ContractModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!contract;

  const { data: tenants } = useQuery({
    queryKey: ["/api/tenants"],
    enabled: open,
  });

  const { data: properties } = useQuery({
    queryKey: ["/api/properties"],
    enabled: open,
  });

  const { data: landlords } = useQuery({
    queryKey: ["/api/landlords"],
    enabled: open,
  });

  const form = useForm<InsertContract>({
    resolver: zodResolver(insertContractSchema),
    defaultValues: {
      tenantId: 0,
      propertyId: 0,
      landlordId: 0,
      startDate: new Date(),
      endDate: new Date(),
      monthlyRent: "0",
      deposit: "0",
      isActive: true,
      terms: "",
    },
  });

  useEffect(() => {
    if (open && contract) {
      form.reset({
        tenantId: contract.tenantId,
        propertyId: contract.propertyId,
        landlordId: contract.landlordId,
        startDate: new Date(contract.startDate),
        endDate: new Date(contract.endDate),
        monthlyRent: contract.monthlyRent,
        deposit: contract.deposit || "0",
        isActive: contract.isActive,
        terms: contract.terms || "",
      });
    } else if (open && !contract) {
      const today = new Date();
      const nextYear = new Date();
      nextYear.setFullYear(today.getFullYear() + 1);

      form.reset({
        tenantId: 0,
        propertyId: 0,
        landlordId: 0,
        startDate: today,
        endDate: nextYear,
        monthlyRent: "0",
        deposit: "0",
        isActive: true,
        terms: "",
      });
    }
  }, [open, contract, form]);

  const selectedProperty = properties?.find((p: Property) => p.id === form.watch("propertyId"));

  useEffect(() => {
    if (selectedProperty) {
      form.setValue("landlordId", selectedProperty.landlordId);
      form.setValue("monthlyRent", selectedProperty.monthlyRent);
      if (selectedProperty.deposit) {
        form.setValue("deposit", selectedProperty.deposit);
      }
    }
  }, [selectedProperty, form]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertContract) => {
      const response = await apiRequest("POST", "/api/contracts", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({
        title: "Başarılı",
        description: "Sözleşme başarıyla oluşturuldu",
      });
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Sözleşme oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertContract) => {
      const response = await apiRequest("PUT", `/api/contracts/${contract!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({
        title: "Başarılı",
        description: "Sözleşme bilgileri güncellendi",
      });
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Sözleşme güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContract) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const availableProperties = properties?.filter((p: Property) => p.isAvailable || p.id === contract?.propertyId) || [];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-[hsl(var(--kiratakip-neutral-800))]">
            <File className="h-5 w-5 text-[hsl(var(--kiratakip-accent))]" />
            <span>{isEditing ? "Sözleşme Düzenle" : "Yeni Sözleşme Oluştur"}</span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tenantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[hsl(var(--kiratakip-neutral-800))]">
                    Kiracı *
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="border-[hsl(var(--kiratakip-neutral-100))]">
                        <SelectValue placeholder="Kiracı seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tenants?.map((tenant: Tenant) => (
                        <SelectItem key={tenant.id} value={tenant.id.toString()}>
                          {tenant.name} - {tenant.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="propertyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[hsl(var(--kiratakip-neutral-800))]">
                    Mülk *
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="border-[hsl(var(--kiratakip-neutral-100))]">
                        <SelectValue placeholder="Mülk seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableProperties?.map((property: Property) => (
                        <SelectItem key={property.id} value={property.id.toString()}>
                          {property.address} - {property.type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="landlordId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[hsl(var(--kiratakip-neutral-800))]">
                    Ev Sahibi *
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value.toString()}
                    disabled={!!selectedProperty}
                  >
                    <FormControl>
                      <SelectTrigger className="border-[hsl(var(--kiratakip-neutral-100))]">
                        <SelectValue placeholder="Ev sahibi seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {landlords?.map((landlord: Landlord) => (
                        <SelectItem key={landlord.id} value={landlord.id.toString()}>
                          {landlord.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[hsl(var(--kiratakip-neutral-800))]">
                      Başlangıç Tarihi *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={formatDateForInput(field.value)}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                        className="border-[hsl(var(--kiratakip-neutral-100))] focus:ring-2 focus:ring-[hsl(var(--kiratakip-primary))]/20 focus:border-[hsl(var(--kiratakip-primary))]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[hsl(var(--kiratakip-neutral-800))]">
                      Bitiş Tarihi *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={formatDateForInput(field.value)}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                        className="border-[hsl(var(--kiratakip-neutral-100))] focus:ring-2 focus:ring-[hsl(var(--kiratakip-primary))]/20 focus:border-[hsl(var(--kiratakip-primary))]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="monthlyRent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[hsl(var(--kiratakip-neutral-800))]">
                      Aylık Kira (₺) *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="4500"
                        className="border-[hsl(var(--kiratakip-neutral-100))] focus:ring-2 focus:ring-[hsl(var(--kiratakip-primary))]/20 focus:border-[hsl(var(--kiratakip-primary))]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[hsl(var(--kiratakip-neutral-800))]">
                      Depozito (₺)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="9000"
                        className="border-[hsl(var(--kiratakip-neutral-100))] focus:ring-2 focus:ring-[hsl(var(--kiratakip-primary))]/20 focus:border-[hsl(var(--kiratakip-primary))]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-[hsl(var(--kiratakip-neutral-800))]">
                      Aktif Sözleşme
                    </FormLabel>
                    <p className="text-sm text-[hsl(var(--kiratakip-neutral-400))]">
                      Bu sözleşme şu anda aktif mi?
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[hsl(var(--kiratakip-neutral-800))]">
                    Sözleşme Şartları
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Sözleşme şartları ve özel notlar"
                      rows={4}
                      className="border-[hsl(var(--kiratakip-neutral-100))] focus:ring-2 focus:ring-[hsl(var(--kiratakip-primary))]/20 focus:border-[hsl(var(--kiratakip-primary))]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 border-[hsl(var(--kiratakip-neutral-100))] text-[hsl(var(--kiratakip-neutral-600))] hover:bg-[hsl(var(--kiratakip-neutral-50))]"
              >
                <X className="h-4 w-4 mr-2" />
                İptal
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-[hsl(var(--kiratakip-primary))] text-white hover:bg-[hsl(var(--kiratakip-primary))]/90"
              >
                <Save className="h-4 w-4 mr-2" />
                {isPending ? "Kaydediliyor..." : isEditing ? "Güncelle" : "Oluştur"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
