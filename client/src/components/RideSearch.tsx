import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const rideSearchSchema = z.object({
  from: z.string().min(1, "Pickup location is required"),
  to: z.string().min(1, "Destination is required"),
  when: z.string().min(1, "Date and time is required"),
});

type RideSearchForm = z.infer<typeof rideSearchSchema>;

interface RideSearchProps {
  onSearch: (params: RideSearchForm) => void;
}

export default function RideSearch({ onSearch }: RideSearchProps) {
  const form = useForm<RideSearchForm>({
    resolver: zodResolver(rideSearchSchema),
    defaultValues: {
      from: "",
      to: "",
      when: "",
    },
  });

  const handleSubmit = (data: RideSearchForm) => {
    onSearch(data);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-dark mb-8 text-center">Where do you want to go?</h2>
      
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <Label htmlFor="from" className="block text-sm font-medium text-gray-medium mb-2">
              From
            </Label>
            <div className="relative">
              <i className="fas fa-map-marker-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <Input
                id="from"
                data-testid="input-pickup-location"
                placeholder="Pickup location"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                {...form.register("from")}
              />
            </div>
            {form.formState.errors.from && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.from.message}</p>
            )}
          </div>
          
          <div className="md:col-span-1">
            <Label htmlFor="to" className="block text-sm font-medium text-gray-medium mb-2">
              To
            </Label>
            <div className="relative">
              <i className="fas fa-map-marker-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <Input
                id="to"
                data-testid="input-destination"
                placeholder="Destination"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                {...form.register("to")}
              />
            </div>
            {form.formState.errors.to && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.to.message}</p>
            )}
          </div>
          
          <div className="md:col-span-1">
            <Label htmlFor="when" className="block text-sm font-medium text-gray-medium mb-2">
              When
            </Label>
            <div className="relative">
              <i className="fas fa-calendar absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <Input
                id="when"
                data-testid="input-pickup-time"
                type="datetime-local"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                {...form.register("when")}
              />
            </div>
            {form.formState.errors.when && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.when.message}</p>
            )}
          </div>
          
          <div className="md:col-span-1 flex items-end">
            <Button
              type="submit"
              data-testid="button-search-rides"
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              disabled={form.formState.isSubmitting}
            >
              <i className="fas fa-search mr-2"></i>Find Rides
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}