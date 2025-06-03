import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLandlordSchema, type InsertLandlord, type Landlord } from "@shared/schema";
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
import { UserRoundCheck, Save, X } from "lucide-react";

interface LandlordModalProps {
  open: boolean;
  onClose: () => void;
  landlord?: Landlord;
}

export default function LandlordModal({ open, onClose, landlord }: LandlordModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!landlord;

  const form = useForm<InsertLandlord>({
    resolver: zodResolver(insertLandlordSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      nationalId: "",
      address: "",
      bankAccount: "",
      taxNumber: "",
    },
  });

  useEffect(() => {
    if (open && landlord) {
      form.reset({
        name: landlord.name,
        email: landlord.email,
        phone: landlord.phone,
        nationalId: landlord.nationalId,
        address: landlord.address || "",
        bankAccount: landlord.bankAccount || "",
        taxNumber: landlord.taxNumber || "",
      });
    } else if (open && !landlord) {
      form.reset({
        name: "",
        email: "",
        phone: "",
        nationalId: "",
        address: "",
        bankAccount: "",
        taxNumber: "",
      });
    }
  }, [open, landlord, form]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertLandlord) => {
      const response = await apiRequest("POST", "/api/landlords", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/landlords"] });
      toast({
        title: "Başarılı",
        description: "Ev sahibi başarıyla eklendi",
      });
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Ev sahibi eklenirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertLandlord) => {
      const response = await apiRequest("PUT", `/api/landlords/${landlord!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/landlords"] });
      toast({
        title: "Başarılı",
        description: "Ev sahibi bilgileri güncellendi",
      });
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Ev sahibi güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertLandlord) => {
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
            <UserRoundCheck className="h-5 w-5 text-[hsl(var(--kiratakip-secondary))]" />
            <span>{isEditing ? "Ev Sahibi Düzenle" : "Yeni Ev Sahibi Ekle"}</span>
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
                      placeholder="Ev sahibinin adı ve soyadı"
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
                      placeholder="Ev sahibinin adresi"
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
                name="bankAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[hsl(var(--kiratakip-neutral-800))]">
                      Banka Hesap No
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="TR123456789"
                        className="border-[hsl(var(--kiratakip-neutral-100))] focus:ring-2 focus:ring-[hsl(var(--kiratakip-primary))]/20 focus:border-[hsl(var(--kiratakip-primary))]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[hsl(var(--kiratakip-neutral-800))]">
                      Vergi Numarası
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="1234567890"
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
