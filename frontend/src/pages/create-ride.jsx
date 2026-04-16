import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateRide, getListRidesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Settings } from "lucide-react";
const schema = z.object({
    origin: z.string().min(2, "Required"),
    destination: z.string().min(2, "Required"),
    departureTime: z.string().min(1, "Required"),
    totalSeats: z.coerce.number().min(1).max(8),
    pricePerSeat: z.coerce.number().min(0),
    preferences: z.string().optional(),
});
export default function CreateRide() {
    const [, setLocation] = useLocation();
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const createRide = useCreateRide();
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: { origin: "", destination: "", departureTime: "", totalSeats: 3, pricePerSeat: 10, preferences: "" },
    });
    if (!user) {
        return (<div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Please log in to offer a ride</p>
      </div>);
    }
    async function onSubmit(data) {
        try {
            const ride = await createRide.mutateAsync({
                data: {
                    origin: data.origin,
                    destination: data.destination,
                    departureTime: new Date(data.departureTime).toISOString(),
                    totalSeats: data.totalSeats,
                    pricePerSeat: data.pricePerSeat,
                    preferences: data.preferences || undefined,
                },
            });
            queryClient.invalidateQueries({ queryKey: getListRidesQueryKey() });
            toast({ title: "Ride created!", description: "Your ride is now live and visible to riders." });
            setLocation(`/rides/${ride.id}`);
        }
        catch {
            toast({ title: "Failed to create ride", variant: "destructive" });
        }
    }
    return (<div className="max-w-2xl mx-auto px-4 py-8 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Offer a ride</h1>
        <p className="text-muted-foreground text-sm mt-1">Share your journey and split the cost</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary"/> Route
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Departure city / address</Label>
              <Input placeholder="e.g. San Francisco, CA" {...form.register("origin")}/>
              {form.formState.errors.origin && (<p className="text-sm text-destructive">{form.formState.errors.origin.message}</p>)}
            </div>
            <div className="space-y-2">
              <Label>Destination</Label>
              <Input placeholder="e.g. Los Angeles, CA" {...form.register("destination")}/>
              {form.formState.errors.destination && (<p className="text-sm text-destructive">{form.formState.errors.destination.message}</p>)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary"/> Timing & seats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Departure date & time</Label>
              <Input type="datetime-local" {...form.register("departureTime")}/>
              {form.formState.errors.departureTime && (<p className="text-sm text-destructive">{form.formState.errors.departureTime.message}</p>)}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Available seats</Label>
                <Input type="number" min={1} max={8} {...form.register("totalSeats")}/>
              </div>
              <div className="space-y-2">
                <Label>Price per seat ($)</Label>
                <Input type="number" min={0} step={0.5} {...form.register("pricePerSeat")}/>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary"/> Preferences (optional)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea placeholder="e.g. No smoking, pets welcome, prefer quiet ride..." rows={3} {...form.register("preferences")}/>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={() => setLocation("/dashboard")}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={createRide.isPending}>
            {createRide.isPending ? "Creating..." : "Publish ride"}
          </Button>
        </div>
      </form>
    </div>);
}
