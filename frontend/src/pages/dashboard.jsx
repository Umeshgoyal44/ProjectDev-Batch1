import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useGetDashboardStats, useGetRecentRides, useListNotifications, getGetDashboardStatsQueryKey, } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RideCard } from "@/components/ride-card";
import { Car, Users, DollarSign, Star, ArrowRight, Bell, Plus, Search } from "lucide-react";
export default function Dashboard() {
    const [, setLocation] = useLocation();
    const { user } = useAuth();
    const { data: stats, isLoading: statsLoading } = useGetDashboardStats({
        query: { queryKey: getGetDashboardStatsQueryKey() },
    });
    const { data: recentRides, isLoading: ridesLoading } = useGetRecentRides();
    const { data: notifications } = useListNotifications();
    const unread = notifications?.filter((n) => !n.isRead).length ?? 0;
    if (!user) {
        return (<div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Please log in to view your dashboard</p>
          <Button onClick={() => setLocation("/login")}>Sign in</Button>
        </div>
      </div>);
    }
    return (<div className="max-w-6xl mx-auto px-4 py-8 space-y-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="text-muted-foreground text-sm mt-1 capitalize">
            {user.role === "both" ? "Driver & Rider" : user.role}
            {user.isVerified && <span className="ml-2 text-primary font-medium">Verified</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setLocation("/rides")}>
            <Search className="w-4 h-4 mr-2"/>
            Find a ride
          </Button>
          {(user.role === "driver" || user.role === "both") && (<Button size="sm" onClick={() => setLocation("/rides/new")}>
              <Plus className="w-4 h-4 mr-2"/>
              Offer a ride
            </Button>)}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (Array.from({ length: 4 }).map((_, i) => (<Card key={i}><CardContent className="pt-6"><Skeleton className="h-16"/></CardContent></Card>))) : (<>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg"><Car className="w-5 h-5 text-primary"/></div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.totalRidesAsDriver ?? 0}</p>
                    <p className="text-xs text-muted-foreground">Rides offered</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/50 rounded-lg"><Users className="w-5 h-5 text-secondary-foreground"/></div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.totalRidesAsRider ?? 0}</p>
                    <p className="text-xs text-muted-foreground">Rides taken</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg"><DollarSign className="w-5 h-5 text-green-600"/></div>
                  <div>
                    <p className="text-2xl font-bold">${(stats?.totalEarnings ?? 0).toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">Total earned</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg"><Star className="w-5 h-5 text-yellow-500"/></div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.averageRating?.toFixed(1) ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">Average rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>)}
      </div>

      {unread > 0 && (<Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary"/>
                <p className="text-sm font-medium">You have {unread} unread notification{unread > 1 ? "s" : ""}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setLocation("/notifications")}>
                View all <ArrowRight className="w-4 h-4 ml-1"/>
              </Button>
            </div>
          </CardContent>
        </Card>)}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent rides</h2>
          <Button variant="ghost" size="sm" onClick={() => setLocation("/rides?driverId=" + user.id)}>
            View all <ArrowRight className="w-4 h-4 ml-1"/>
          </Button>
        </div>
        {ridesLoading ? (<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl"/>)}
          </div>) : recentRides && recentRides.length > 0 ? (<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentRides.map((ride) => <RideCard key={ride.id} ride={ride}/>)}
          </div>) : (<Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Car className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40"/>
              <p className="text-muted-foreground">No rides yet</p>
              <Button className="mt-4" onClick={() => setLocation("/rides/new")}>Offer your first ride</Button>
            </CardContent>
          </Card>)}
      </div>
    </div>);
}
