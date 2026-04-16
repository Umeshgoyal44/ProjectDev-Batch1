import { useListNotifications, useMarkNotificationRead, useMarkAllNotificationsRead, getListNotificationsQueryKey, } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, CheckCheck, Car, AlertCircle, Users } from "lucide-react";
import { format } from "date-fns";
import { useLocation } from "wouter";
const typeIcons = {
    new_request: <Users className="w-4 h-4 text-blue-500"/>,
    ride_accepted: <Car className="w-4 h-4 text-green-500"/>,
    ride_rejected: <AlertCircle className="w-4 h-4 text-red-500"/>,
    driver_arrived: <Car className="w-4 h-4 text-primary"/>,
    ride_completed: <CheckCheck className="w-4 h-4 text-blue-500"/>,
};
export default function Notifications() {
    const [, setLocation] = useLocation();
    const queryClient = useQueryClient();
    const { data: notifications, isLoading } = useListNotifications({
        query: { queryKey: getListNotificationsQueryKey() },
    });
    const markRead = useMarkNotificationRead();
    const markAllRead = useMarkAllNotificationsRead();
    const unread = notifications?.filter((n) => !n.isRead).length ?? 0;
    async function handleMarkRead(id) {
        await markRead.mutateAsync({ id });
        queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
    }
    async function handleMarkAllRead() {
        await markAllRead.mutateAsync(undefined);
        queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
    }
    return (<div className="max-w-2xl mx-auto px-4 py-8 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          {unread > 0 && <p className="text-sm text-muted-foreground mt-1">{unread} unread</p>}
        </div>
        {unread > 0 && (<Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="w-4 h-4 mr-2"/> Mark all read
          </Button>)}
      </div>

      {isLoading ? (<div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl"/>)}
        </div>) : notifications && notifications.length > 0 ? (<div className="space-y-2">
          {notifications.map((n) => (<Card key={n.id} className={`cursor-pointer transition-all hover-elevate ${!n.isRead ? "border-primary/30 bg-primary/5" : "border-border/50"}`} onClick={() => {
                    if (!n.isRead)
                        handleMarkRead(n.id);
                    if (n.rideId)
                        setLocation(`/rides/${n.rideId}`);
                }}>
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{typeIcons[n.type] ?? <Bell className="w-4 h-4 text-muted-foreground"/>}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{n.body}</p>
                    <p className="text-xs text-muted-foreground mt-1">{format(new Date(n.createdAt), "MMM d, h:mm a")}</p>
                  </div>
                  {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary mt-1 flex-shrink-0"/>}
                </div>
              </CardContent>
            </Card>))}
        </div>) : (<Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30"/>
            <p className="text-lg font-medium text-muted-foreground">All caught up</p>
            <p className="text-sm text-muted-foreground mt-1">No notifications yet</p>
          </CardContent>
        </Card>)}
    </div>);
}
