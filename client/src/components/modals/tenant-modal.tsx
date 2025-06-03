import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTenantSchema, type InsertTenant, type Tenant } from "@shared/schema";
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
import { UserPlus, Save, X } from "lucide-react";

interface TenantModalProps {
  open: boolean;
  onClose: () => void;
  tenant?: Tenant;
}

export default function TenantModal({ open, onClose, tenant }: TenantModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!tenant;

  const form = useForm<InsertTenant>({
    resolver: zodResolver(insertTenantSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      nationalId: "",
      address: "",
      emergencyContact: "",
      emergencyPhone: "",
    },
  });

  useEffect(() => {
    if (open && tenant) {
      form.reset({
        name: tenant.name,
        email: tenant.email,
        phone: tenant.phone,
        nationalId: tenant.nationalId,
        address: tenant.address || "",
        emergencyContact: tenant.emergencyContact || "",
        emergencyPhone: tenant.emergencyPhone || "",
      });
    } else if (open && !tenant) {
      form.reset({
        name: "",
        email: "",
        phone: "",
        nationalId: "",
        address: "",
        emergencyContact: "",
        emergencyPhone: "",
      });
    }
  }, [open, tenant, form]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertTenant) => {
      const response = await apiRequest("POST", "/api/tenants", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenants"] });
      toast({
        title: "Başarılı",
        description: "Kiracı başarıyla eklendi",
      });
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Kiracı eklenirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertTenant) => {
      const response = await apiRequest("PUT", `/api/tenants/${tenant!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenants"] });
      toast({
        title: "Başarılı",
        description: "Kiracı bilgileri güncellendi",
      });
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Kiracı güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertTenant) => {
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-[hsl(var(--kiratakip-neutral-800))]">
            <UserPlus className="h-5 w-5 text-[hsl(var(--kiratakip-primary))]" />
            <span>{isEditing ? "Kiracı Düzenle" : "Yeni Kiracı Ekle"}</span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[hsl(var(--kiratakip-neutral-800))]">
                    Ad Soyad *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Kiracının adı ve soyadı"
                      className="border-[hsl(var(--kiratakip-neutral-100))] focus:ring-2 focus:ring-[hsl(var(--kiratakip-primary))]/20 focus:border-[hsl(var(--kiratakip-primary))]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[hsl(var(--kiratakip-neutral-800))]">
                      E-posta *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="ornek@email.com"
                        className="border-[hsl(var(--kiratakip-neutral-100))] focus:ring-2 focus:ring-[hsl(var(--kiratakip-primary))]/20 focus:border-[hsl(var(--kiratakip-primary))]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[hsl(var(--kiratakip-neutral-800))]">
                      Telefon *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="0532 123 45 67"
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
              name="nationalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[hsl(var(--kiratakip-neutral-800))]">
                    TC Kimlik Numarası *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="12345678901"
                      maxLength={11}
                      className="border-[hsl(var(--kiratakip-neutral-100))] focus:ring-2 focus:ring-[hsl(var(--kiratakip-primary))]/20 focus:border-[hsl(var(--kiratakip-primary))]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[hsl(var(--kiratakip-neutral-800))]">
                    Adres
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Kiracının ikamet adresi"
                      rows={3}
                      className="border-[hsl(var(--kiratakip-neutral-100))] focus:ring-2 focus:ring-[hsl(var(--kiratakip-primary))]/20 focus:border-[hsl(var(--kiratakip-primary))]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="emergencyContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[hsl(var(--kiratakip-neutral-800))]">
                      Acil Durum Kişisi
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Yakın kişinin adı"
                        className="border-[hsl(var(--kiratakip-neutral-100))] focus:ring-2 focus:ring-[hsl(var(--kiratakip-primary))]/20 focus:border-[hsl(var(--kiratakip-primary))]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[hsl(var(--kiratakip-neutral-800))]">
                      Acil Durum Telefon
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="0532 123 45 67"
                        className="border-[hsl(var(--kiratakip-neutral-100))] focus:ring-2 focus:ring-[hsl(var(--kiratakip-primary))]/20 focus:border-[hsl(var(--kiratakip-primary))]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                {isPending ? "Kaydediliyor..." : isEditing ? "Güncelle" : "Kaydet"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
