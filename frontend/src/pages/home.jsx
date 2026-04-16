import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Search, Shield, Leaf, Wallet, Car } from "lucide-react";
import { useGetRecentRides } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { RideCard } from "@/components/ride-card";
import { Skeleton } from "@/components/ui/skeleton";
const searchSchema = z.object({
    origin: z.string().optional(),
    destination: z.string().optional(),
    date: z.date().optional(),
    seats: z.coerce.number().min(1).default(1),
});
export default function Home() {
    const [, setLocation] = useLocation();
    const { data: recentRides, isLoading } = useGetRecentRides();
    const form = useForm({
        resolver: zodResolver(searchSchema),
        defaultValues: {
            origin: "",
            destination: "",
            seats: 1,
        },
    });
    function onSubmit(data) {
        const params = new URLSearchParams();
        if (data.origin)
            params.append("origin", data.origin);
        if (data.destination)
            params.append("destination", data.destination);
        if (data.date)
            params.append("date", data.date.toISOString());
        if (data.seats && data.seats > 1)
            params.append("seats", data.seats.toString());
        setLocation(`/rides?${params.toString()}`);
    }
    return (<div className="w-full flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-muted pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"/>
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl opacity-50"/>
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl opacity-50"/>
        </div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-foreground">
              Your ride, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">your way</span>
            </h1>
            <p className="text-xl text-muted-foreground md:px-12 leading-relaxed">
              Share the journey, split the cost, and meet great people along the way. Commuting has never been this smart.
            </p>
          </div>

          <div className="w-full max-w-4xl bg-card rounded-2xl shadow-xl border border-border/50 p-2 md:p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-2">
                <FormField control={form.control} name="origin" render={({ field }) => (<FormItem className="flex-1">
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground"/>
                          <Input placeholder="Leaving from..." className="pl-10 h-12 text-base border-0 bg-muted/50 focus-visible:ring-1 focus-visible:bg-background" {...field}/>
                        </div>
                      </FormControl>
                    </FormItem>)}/>
                
                <div className="hidden md:flex items-center justify-center text-muted-foreground w-6">
                  <span className="w-px h-8 bg-border"></span>
                </div>
                
                <FormField control={form.control} name="destination" render={({ field }) => (<FormItem className="flex-1">
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground"/>
                          <Input placeholder="Going to..." className="pl-10 h-12 text-base border-0 bg-muted/50 focus-visible:ring-1 focus-visible:bg-background" {...field}/>
                        </div>
                      </FormControl>
                    </FormItem>)}/>

                <div className="hidden md:flex items-center justify-center text-muted-foreground w-6">
                  <span className="w-px h-8 bg-border"></span>
                </div>

                <FormField control={form.control} name="date" render={({ field }) => (<FormItem className="flex-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className={cn("w-full h-12 justify-start text-left font-normal border-0 bg-muted/50 hover:bg-muted/80 text-base", !field.value && "text-muted-foreground")}>
                              <CalendarIcon className="mr-2 h-5 w-5"/>
                              {field.value ? format(field.value, "PPP") : <span>Any date</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} initialFocus/>
                        </PopoverContent>
                      </Popover>
                    </FormItem>)}/>

                <div className="hidden md:flex items-center justify-center text-muted-foreground w-6">
                  <span className="w-px h-8 bg-border"></span>
                </div>

                <FormField control={form.control} name="seats" render={({ field }) => (<FormItem className="w-full md:w-24">
                      <FormControl>
                        <Input type="number" min={1} max={8} className="h-12 text-base text-center border-0 bg-muted/50 focus-visible:ring-1 focus-visible:bg-background" {...field}/>
                      </FormControl>
                    </FormItem>)}/>

                <Button type="submit" size="lg" className="h-12 px-8 text-base font-bold shadow-md md:ml-2">
                  <Search className="w-5 h-5 mr-2"/>
                  Search
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why ride with us?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We've built a community-driven platform that makes sharing journeys safe, affordable, and enjoyable.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                <Shield className="w-8 h-8"/>
              </div>
              <h3 className="text-xl font-bold mb-3">Trust & Safety</h3>
              <p className="text-muted-foreground">Every member is verified. We check IDs, phone numbers, and reviews so you know exactly who you're traveling with.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
                <Wallet className="w-8 h-8"/>
              </div>
              <h3 className="text-xl font-bold mb-3">Save Money</h3>
              <p className="text-muted-foreground">Share the cost of fuel and tolls. Drivers offset their expenses, and riders travel cheaper than by bus or train.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
                <Leaf className="w-8 h-8"/>
              </div>
              <h3 className="text-xl font-bold mb-3">Eco-Friendly</h3>
              <p className="text-muted-foreground">Empty seats mean wasted emissions. By filling them, we collectively reduce our carbon footprint every single day.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Rides */}
      <section className="py-24 bg-muted/30 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Upcoming Rides</h2>
              <p className="text-muted-foreground">Discover journeys happening soon</p>
            </div>
            <Button variant="outline" onClick={() => setLocation("/rides")}>
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (Array.from({ length: 6 }).map((_, i) => (<div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[220px] w-full rounded-xl"/>
                </div>))) : recentRides?.length ? (recentRides.slice(0, 6).map((ride) => (<RideCard key={ride.id} ride={ride}/>))) : (<div className="col-span-full text-center py-12 bg-card rounded-xl border border-border border-dashed">
                <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50"/>
                <h3 className="text-lg font-medium text-foreground">No rides available right now</h3>
                <p className="text-muted-foreground mt-1">Be the first to offer a ride!</p>
                <Button className="mt-6" onClick={() => setLocation("/rides/new")}>Offer a Ride</Button>
              </div>)}
          </div>
        </div>
      </section>
    </div>);
}
