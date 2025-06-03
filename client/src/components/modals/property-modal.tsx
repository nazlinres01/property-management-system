import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPropertySchema, type InsertProperty, type Property, type Landlord } from "@shared/schema";
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
import { Building, Save, X } from "lucide-react";

interface PropertyModalProps {
  open: boolean;
  onClose: () => void;
  property?: Property;
}

export default function PropertyModal({ open, onClose, property }: PropertyModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!property;

  const { data: landlords } = useQuery({
    queryKey: ["/api/landlords"],
    enabled: open,
  });

  const form = useForm<InsertProperty>({
    resolver: zodResolver(insertPropertySchema),
    defaultValues: {
      landlordId: 0,
      address: "",
      type: "",
      area: 0,
      floor: 0,
      hasBalcony: false,
      hasParking: false,
      isAvailable: true,
      monthlyRent: "0",
      deposit: "0",
      description: "",
    },
  });

  useEffect(() => {
    if (open && property) {
      form.reset({
        landlordId: property.landlordId,
        address: property.address,
        type: property.type,
        area: property.area || 0,
        floor: property.floor || 0,
        hasBalcony: property.hasBalcony,
        hasParking: property.hasParking,
        isAvailable: property.isAvailable,
        monthlyRent: property.monthlyRent,
        deposit: property.deposit || "0",
        description: property.description || "",
      });
    } else if (open && !property) {
      form.reset({
        landlordId: 0,
        address: "",
        type: "",
        area: 0,
        floor: 0,
        hasBalcony: false,
        hasParking: false,
        isAvailable: true,
        monthlyRent: "0",
        deposit: "0",
        description: "",
      });
    }
  }, [open, property, form]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertProperty) => {
      const response = await apiRequest("POST", "/api/properties", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({
        title: "Başarılı",
        description: "Mülk başarıyla eklendi",
      });
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Mülk eklenirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertProperty) => {
      const response = await apiRequest("PUT", `/api/properties/${property!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({
        title: "Başarılı",
        description: "Mülk bilgileri güncellendi",
      });
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Mülk güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProperty) => {
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-[hsl(var(--kiratakip-neutral-800))]">
            <Building className="h-5 w-5 text-[hsl(var(--kiratakip-secondary))]" />
            <span>{isEditing ? "Mülk Düzenle" : "Yeni Mülk Ekle"}</span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[hsl(var(--kiratakip-neutral-800))]">
                    Adres *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Mülkün tam adresi"
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[hsl(var(--kiratakip-neutral-800))]">
                      Tip *
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-[hsl(var(--kiratakip-neutral-100))]">
                          <SelectValue placeholder="Mülk tipi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1+0">1+0</SelectItem>
                        <SelectItem value="1+1">1+1</SelectItem>
                        <SelectItem value="2+1">2+1</SelectItem>
                        <SelectItem value="3+1">3+1</SelectItem>
                        <SelectItem value="4+1">4+1</SelectItem>
                        <SelectItem value="5+1">5+1</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="dubleks">Dubleks</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[hsl(var(--kiratakip-neutral-800))]">
                      Alan (m²)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="85"
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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
                name="floor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[hsl(var(--kiratakip-neutral-800))]">
                      Kat
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="3"
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        className="border-[hsl(var(--kiratakip-neutral-100))] focus:ring-2 focus:ring-[hsl(var(--kiratakip-primary))]/20 focus:border-[hsl(var(--kiratakip-primary))]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </div>

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

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="hasBalcony"
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
                        Balkon
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasParking"
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
                        Otopark
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isAvailable"
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
                        Müsait
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[hsl(var(--kiratakip-neutral-800))]">
                    Açıklama
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Mülk hakkında ek bilgiler"
                      rows={3}
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
                {isPending ? "Kaydediliyor..." : isEditing ? "Güncelle" : "Kaydet"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
