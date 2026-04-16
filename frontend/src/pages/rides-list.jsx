import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { useListRides, getListRidesQueryKey } from "@workspace/api-client-react";
import { RideCard } from "@/components/ride-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Car } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
const schema = z.object({
    origin: z.string().optional(),
    destination: z.string().optional(),
    date: z.string().optional(),
    seats: z.coerce.number().min(1).optional(),
});
export default function RidesList() {
    const [location] = useLocation();
    const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            origin: searchParams.get("origin") || "",
            destination: searchParams.get("destination") || "",
            date: searchParams.get("date") || "",
            seats: searchParams.get("seats") ? Number(searchParams.get("seats")) : 1,
        },
    });
    const [filters, setFilters] = useState({
        origin: searchParams.get("origin") || undefined,
        destination: searchParams.get("destination") || undefined,
        date: searchParams.get("date") || undefined,
        seats: searchParams.get("seats") ? Number(searchParams.get("seats")) : undefined,
    });
    const { data: rides, isLoading } = useListRides({ ...filters }, { query: { queryKey: getListRidesQueryKey(filters) } });
    function onSearch(data) {
        setFilters({
            origin: data.origin || undefined,
            destination: data.destination || undefined,
            date: data.date || undefined,
            seats: data.seats || undefined,
        });
    }
    return (<div className="max-w-6xl mx-auto px-4 py-8 space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Find a ride</h1>
        <p className="text-muted-foreground text-sm mt-1">Browse available carpools near you</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSearch)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label>From</Label>
              <Input placeholder="Departure city" {...form.register("origin")}/>
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Input placeholder="Destination city" {...form.register("destination")}/>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" {...form.register("date")}/>
            </div>
            <div className="space-y-2">
              <Label>Seats needed</Label>
              <div className="flex gap-2">
                <Input type="number" min={1} max={8} {...form.register("seats")} className="w-20"/>
                <Button type="submit" className="flex-1">
                  <Search className="w-4 h-4 mr-2"/> Search
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div>
        {isLoading ? (<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-xl"/>)}
          </div>) : rides && rides.length > 0 ? (<>
            <p className="text-sm text-muted-foreground mb-4">{rides.length} ride{rides.length !== 1 ? "s" : ""} available</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rides.map((ride) => <RideCard key={ride.id} ride={ride} showMatchScore/>)}
            </div>
          </>) : (<Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <Car className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30"/>
              <p className="text-lg font-medium text-muted-foreground">No rides found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search filters</p>
            </CardContent>
          </Card>)}
      </div>
    </div>);
}
