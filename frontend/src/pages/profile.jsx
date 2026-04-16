import { useRoute } from "wouter";
import { useGetUser, useListRatings, getGetUserQueryKey, getListRatingsQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RatingStars } from "@/components/rating-stars";
import { Shield, Car, Star } from "lucide-react";
import { format } from "date-fns";
export default function Profile() {
    const [, params] = useRoute("/profile/:id");
    const { user: currentUser } = useAuth();
    const userId = params?.id ? parseInt(params.id, 10) : 0;
    const { data: user, isLoading } = useGetUser(userId, {
        query: { enabled: !!userId, queryKey: getGetUserQueryKey(userId) },
    });
    const { data: ratings, isLoading: ratingsLoading } = useListRatings({ userId }, { query: { enabled: !!userId, queryKey: getListRatingsQueryKey({ userId }) } });
    if (isLoading) {
        return (<div className="max-w-2xl mx-auto px-4 py-8 space-y-4 w-full">
        <Skeleton className="h-32 rounded-xl"/>
        <Skeleton className="h-48 rounded-xl"/>
      </div>);
    }
    if (!user) {
        return (<div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">User not found</p>
      </div>);
    }
    return (<div className="max-w-2xl mx-auto px-4 py-8 space-y-6 w-full">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20 border-2 border-border">
              <AvatarImage src={user.avatarUrl || ""}/>
              <AvatarFallback className="text-2xl">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                {user.isVerified && (<Badge variant="secondary" className="gap-1">
                    <Shield className="w-3 h-3"/> Verified
                  </Badge>)}
              </div>
              <p className="text-muted-foreground text-sm capitalize mt-0.5">
                {user.role === "both" ? "Driver & Rider" : user.role}
              </p>
              {user.rating != null && (<div className="mt-2"><RatingStars rating={user.rating} size={16}/></div>)}
              {user.bio && <p className="text-sm mt-3 text-muted-foreground">{user.bio}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border/50">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{user.totalRides}</p>
              <p className="text-xs text-muted-foreground">Total rides</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{user.rating?.toFixed(1) ?? "—"}</p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{ratings?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">Reviews</p>
            </div>
          </div>

          {user.vehicleInfo && (<div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Car className="w-4 h-4"/>
              <span>{user.vehicleInfo}</span>
            </div>)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500"/> Reviews ({ratings?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {ratingsLoading ? (Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg"/>)) : ratings && ratings.length > 0 ? (ratings.map((r) => (<div key={r.id} className="border border-border/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{r.raterName}</p>
                  <RatingStars rating={r.score} size={14}/>
                </div>
                {r.comment && <p className="text-sm text-muted-foreground italic">"{r.comment}"</p>}
                <p className="text-xs text-muted-foreground">{format(new Date(r.createdAt), "MMM d, yyyy")}</p>
              </div>))) : (<p className="text-sm text-muted-foreground text-center py-4">No reviews yet</p>)}
        </CardContent>
      </Card>
    </div>);
}
