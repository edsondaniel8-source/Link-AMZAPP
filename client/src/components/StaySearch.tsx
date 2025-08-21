import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const staySearchSchema = z.object({
  location: z.string().min(1, "Location is required"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
}).refine((data) => {
  const checkIn = new Date(data.checkIn);
  const checkOut = new Date(data.checkOut);
  return checkOut > checkIn;
}, {
  message: "Check-out date must be after check-in date",
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
    },
  });

  const handleSubmit = (data: StaySearchForm) => {
    onSearch(data);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-dark mb-8 text-center">Find your next stay</h2>
      
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="location" className="block text-sm font-medium text-gray-medium mb-2">
              Where
            </Label>
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <Input
                id="location"
                data-testid="input-search-location"
                placeholder="Search destinations"
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
              Check-in
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
              Check-out
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
          
          <div className="md:col-span-1 flex items-end">
            <Button
              type="submit"
              data-testid="button-search-stays"
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              disabled={form.formState.isSubmitting}
            >
              <i className="fas fa-search mr-2"></i>Search
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
