import { useGetAdminStats, getGetAdminStatsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Car, DollarSign, TrendingUp, Activity, UserPlus } from "lucide-react";
export default function Admin() {
    const { data: stats, isLoading } = useGetAdminStats({
        query: { queryKey: getGetAdminStatsQueryKey() },
    });
    const weeklyData = stats
        ? [
            { name: "This week", rides: stats.ridesThisWeek, users: stats.newUsersThisWeek },
            { name: "Total", rides: stats.totalRides, users: stats.totalUsers },
        ]
        : [];
    return (<div className="max-w-6xl mx-auto px-4 py-8 space-y-8 w-full">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform-wide overview and analytics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (Array.from({ length: 6 }).map((_, i) => (<Card key={i}><CardContent className="pt-6"><Skeleton className="h-16"/></CardContent></Card>))) : stats ? (<>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"><Users className="w-5 h-5 text-blue-600"/></div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    <p className="text-xs text-muted-foreground">Total users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg"><Car className="w-5 h-5 text-green-600"/></div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalRides}</p>
                    <p className="text-xs text-muted-foreground">Total rides</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg"><Activity className="w-5 h-5 text-yellow-600"/></div>
                  <div>
                    <p className="text-2xl font-bold">{stats.activeRides}</p>
                    <p className="text-xs text-muted-foreground">Active rides</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg"><DollarSign className="w-5 h-5 text-primary"/></div>
                  <div>
                    <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">Total revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg"><TrendingUp className="w-5 h-5 text-purple-600"/></div>
                  <div>
                    <p className="text-2xl font-bold">{stats.ridesThisWeek}</p>
                    <p className="text-xs text-muted-foreground">Rides this week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg"><UserPlus className="w-5 h-5 text-orange-600"/></div>
                  <div>
                    <p className="text-2xl font-bold">{stats.newUsersThisWeek}</p>
                    <p className="text-xs text-muted-foreground">New users this week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>) : null}
      </div>

      <Card>
        <CardHeader><CardTitle>Activity Overview</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border"/>
              <XAxis dataKey="name" className="text-xs fill-muted-foreground"/>
              <YAxis className="text-xs fill-muted-foreground"/>
              <Tooltip />
              <Bar dataKey="rides" name="Rides" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}/>
              <Bar dataKey="users" name="Users" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>);
}
