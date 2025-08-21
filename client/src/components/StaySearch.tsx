import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const staySearchSchema = z.object({
  location: z.string().min(1, "Local é obrigatório"),
  checkIn: z.string().min(1, "Data de entrada é obrigatória"),
  checkOut: z.string().min(1, "Data de saída é obrigatória"),
  guests: z.number().min(1, "Número de hóspedes é obrigatório").max(16, "Máximo 16 hóspedes"),
}).refine((data) => {
  const checkIn = new Date(data.checkIn);
  const checkOut = new Date(data.checkOut);
  return checkOut > checkIn;
}, {
  message: "Data de saída deve ser posterior à data de entrada",
  path: ["checkOut"],
});

type StaySearchForm = z.infer<typeof staySearchSchema>;

interface StaySearchProps {
  onSearch: (params: StaySearchForm) => void;
}

export default function StaySearch({ onSearch }: StaySearchProps) {
  const form = useForm<StaySearchForm>({
    resolver: zodResolver(staySearchSchema),
    defaultValues: {
      location: "",
      checkIn: "",
      checkOut: "",
      guests: 2,
    },
  });

  const handleSubmit = (data: StaySearchForm) => {
    onSearch(data);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-dark mb-8 text-center">Encontre sua próxima hospedagem</h2>
      
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="location" className="block text-sm font-medium text-gray-medium mb-2">
              Onde
            </Label>
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <Input
                id="location"
                data-testid="input-search-location"
                placeholder="Pesquisar destinos"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                {...form.register("location")}
              />
            </div>
            {form.formState.errors.location && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.location.message}</p>
            )}
          </div>
          
          <div className="md:col-span-1">
            <Label htmlFor="checkIn" className="block text-sm font-medium text-gray-medium mb-2">
              Entrada
            </Label>
            <Input
              id="checkIn"
              data-testid="input-checkin-date"
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              {...form.register("checkIn")}
            />
            {form.formState.errors.checkIn && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.checkIn.message}</p>
            )}
          </div>
          
          <div className="md:col-span-1">
            <Label htmlFor="checkOut" className="block text-sm font-medium text-gray-medium mb-2">
              Saída
            </Label>
            <Input
              id="checkOut"
              data-testid="input-checkout-date"
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              {...form.register("checkOut")}
            />
            {form.formState.errors.checkOut && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.checkOut.message}</p>
            )}
          </div>
          
          <div className="md:col-span-1">
            <Label htmlFor="guests" className="block text-sm font-medium text-gray-medium mb-2">
              Hóspedes
            </Label>
            <Select
              value={String(form.watch("guests"))}
              onValueChange={(value) => form.setValue("guests", parseInt(value))}
            >
              <SelectTrigger data-testid="select-guests">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((num) => (
                  <SelectItem key={num} value={String(num)}>
                    {num} {num === 1 ? 'hóspede' : 'hóspedes'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.guests && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.guests.message}</p>
            )}
          </div>
          
          <div className="md:col-span-1 flex items-end">
            <Button
              type="submit"
              data-testid="button-search-stays"
              className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              disabled={form.formState.isSubmitting}
            >
              <i className="fas fa-search mr-2"></i>Pesquisar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}