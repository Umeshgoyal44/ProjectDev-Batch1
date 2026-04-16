import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useGetRide, useListMessages, useSendMessage, useCreateRequest, useAcceptRequest, useRejectRequest, useCompleteRide, useCreateRating, getGetRideQueryKey, getListMessagesQueryKey, getListRidesQueryKey, } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RatingStars } from "@/components/rating-stars";
import { SosButton } from "@/components/sos-button";
import { format } from "date-fns";
import { MapPin, Calendar, Clock, Users, Shield, Send, CheckCircle, XCircle, MessageSquare, Star } from "lucide-react";
export default function RideDetail() {
    const [, params] = useRoute("/rides/:id");
    const [, setLocation] = useLocation();
    const rideId = params?.id ? parseInt(params.id, 10) : 0;
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [message, setMessage] = useState("");
    const [requestMessage, setRequestMessage] = useState("");
    const [ratingScore, setRatingScore] = useState(5);
    const [showRating, setShowRating] = useState(false);
    const { data: ride, isLoading } = useGetRide(rideId, {
        query: { enabled: !!rideId, queryKey: getGetRideQueryKey(rideId) },
    });
    const { data: messages, isLoading: msgsLoading } = useListMessages({ rideId }, { query: { enabled: !!rideId, queryKey: getListMessagesQueryKey({ rideId }), refetchInterval: 3000 } });
    const sendMessage = useSendMessage();
    const createRequest = useCreateRequest();
    const acceptRequest = useAcceptRequest();
    const rejectRequest = useRejectRequest();
    const completeRide = useCompleteRide();
    const createRating = useCreateRating();
    const isDriver = user?.id === ride?.driverId;
    const myRequest = ride?.requests.find((r) => r.riderId === user?.id);
    const isParticipant = isDriver || myRequest?.status === "accepted";
    async function handleSendMessage() {
        if (!message.trim() || !rideId)
            return;
        try {
            await sendMessage.mutateAsync({ data: { rideId, content: message.trim() } });
            setMessage("");
            queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey({ rideId }) });
        }
        catch {
            toast({ title: "Failed to send message", variant: "destructive" });
        }
    }
    async function handleRequest() {
        try {
            await createRequest.mutateAsync({ data: { rideId, seats: 1, message: requestMessage || undefined } });
            toast({ title: "Request sent!", description: "The driver will review your request." });
            queryClient.invalidateQueries({ queryKey: getGetRideQueryKey(rideId) });
        }
        catch {
            toast({ title: "Request failed", variant: "destructive" });
        }
    }
    async function handleAccept(requestId) {
        await acceptRequest.mutateAsync({ id: requestId });
        queryClient.invalidateQueries({ queryKey: getGetRideQueryKey(rideId) });
        toast({ title: "Request accepted" });
    }
    async function handleReject(requestId) {
        await rejectRequest.mutateAsync({ id: requestId });
        queryClient.invalidateQueries({ queryKey: getGetRideQueryKey(rideId) });
        toast({ title: "Request rejected" });
    }
    async function handleComplete() {
        await completeRide.mutateAsync({ id: rideId });
        queryClient.invalidateQueries({ queryKey: getGetRideQueryKey(rideId) });
        queryClient.invalidateQueries({ queryKey: getListRidesQueryKey() });
        toast({ title: "Ride completed" });
    }
    async function handleRate() {
        if (!ride)
            return;
        await createRating.mutateAsync({
            data: { rideId, ratedUserId: ride.driverId, score: ratingScore, comment: undefined },
        });
        setShowRating(false);
        toast({ title: "Rating submitted, thank you!" });
    }
    if (isLoading) {
        return (<div className="max-w-3xl mx-auto px-4 py-8 space-y-4 w-full">
        <Skeleton className="h-8 w-48"/>
        <Skeleton className="h-64 rounded-xl"/>
        <Skeleton className="h-48 rounded-xl"/>
      </div>);
    }
    if (!ride) {
        return (<div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Ride not found</p>
      </div>);
    }
    const statusColors = {
        active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return (<div className="max-w-3xl mx-auto px-4 py-8 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setLocation("/rides")}>Back to rides</Button>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[ride.status] ?? ""}`}>
            {ride.status}
          </span>
          {isParticipant && ride.status === "active" && <SosButton />}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border">
                <AvatarImage src={ride.driverAvatar || ""}/>
                <AvatarFallback>{ride.driverName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{ride.driverName}</p>
                  {ride.driverIsVerified && <Shield className="w-4 h-4 text-primary"/>}
                </div>
                {ride.driverRating != null && <RatingStars rating={ride.driverRating} size={14}/>}
                {ride.driverVehicle && <p className="text-xs text-muted-foreground mt-0.5">{ride.driverVehicle}</p>}
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">${ride.pricePerSeat}</p>
              <p className="text-xs text-muted-foreground">per seat</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center"><MapPin className="w-4 h-4 text-primary"/></div>
              <div>
                <p className="text-xs text-muted-foreground">From</p>
                <p className="font-medium">{ride.origin}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-secondary/50 rounded-full flex items-center justify-center"><MapPin className="w-4 h-4 text-secondary-foreground"/></div>
              <div>
                <p className="text-xs text-muted-foreground">To</p>
                <p className="font-medium">{ride.destination}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground"/>
              <span className="text-sm">{format(new Date(ride.departureTime), "MMM d")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground"/>
              <span className="text-sm">{format(new Date(ride.departureTime), "h:mm a")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground"/>
              <span className="text-sm">{ride.availableSeats} / {ride.totalSeats} seats</span>
            </div>
          </div>

          {ride.preferences && (<div className="bg-muted/30 rounded-lg p-3 text-sm text-muted-foreground">
              {ride.preferences}
            </div>)}
        </CardContent>
      </Card>

      {!isDriver && !myRequest && ride.status === "active" && user && (<Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Request a seat</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Textarea placeholder="Optional message to driver..." rows={2} value={requestMessage} onChange={(e) => setRequestMessage(e.target.value)}/>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total: <span className="font-semibold text-foreground">${ride.pricePerSeat}</span></p>
              <Button onClick={handleRequest} disabled={createRequest.isPending}>
                {createRequest.isPending ? "Requesting..." : "Request to join"}
              </Button>
            </div>
          </CardContent>
        </Card>)}

      {myRequest && (<Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Your request status</p>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${myRequest.status === "accepted" ? "bg-green-100 text-green-700" :
                myRequest.status === "rejected" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"}`}>
                {myRequest.status}
              </span>
            </div>
            {myRequest.fareShare != null && (<p className="text-sm text-muted-foreground mt-1">Fare: ${myRequest.fareShare.toFixed(2)}</p>)}
          </CardContent>
        </Card>)}

      {isDriver && ride.requests.length > 0 && (<Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Ride requests ({ride.requests.length})</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {ride.requests.map((r) => (<div key={r.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={r.riderAvatar || ""}/>
                    <AvatarFallback>{r.riderName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{r.riderName}</p>
                    <p className="text-xs text-muted-foreground">{r.seats} seat{r.seats > 1 ? "s" : ""}</p>
                    {r.message && <p className="text-xs text-muted-foreground italic">"{r.message}"</p>}
                  </div>
                </div>
                {r.status === "pending" ? (<div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleReject(r.id)}>
                      <XCircle className="w-4 h-4"/>
                    </Button>
                    <Button size="sm" onClick={() => handleAccept(r.id)}>
                      <CheckCircle className="w-4 h-4"/>
                    </Button>
                  </div>) : (<span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${r.status === "accepted" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{r.status}</span>)}
              </div>))}
          </CardContent>
        </Card>)}

      {isDriver && ride.status === "active" && (<Button variant="outline" className="w-full" onClick={handleComplete} disabled={completeRide.isPending}>
          Mark ride as completed
        </Button>)}

      {!isDriver && myRequest?.status === "accepted" && ride.status === "completed" && (<Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500"/> Rate this ride</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (<button key={s} onClick={() => setRatingScore(s)} className={`text-2xl transition-transform hover:scale-110 ${s <= ratingScore ? "text-yellow-400" : "text-muted"}`}>
                  ★
                </button>))}
            </div>
            <Button onClick={handleRate} disabled={createRating.isPending}>Submit rating</Button>
          </CardContent>
        </Card>)}

      {isParticipant && (<Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary"/> In-ride chat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-64 overflow-y-auto space-y-2 border border-border/50 rounded-lg p-3 bg-muted/10">
              {msgsLoading ? (<Skeleton className="h-full"/>) : messages && messages.length > 0 ? (messages.map((m) => {
                const isMe = m.senderId === user?.id;
                return (<div key={m.id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                      <Avatar className="w-7 h-7 flex-shrink-0">
                        <AvatarFallback className="text-xs">{m.senderName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                        <div className={`px-3 py-2 rounded-2xl text-sm ${isMe ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                          {m.content}
                        </div>
                        <span className="text-xs text-muted-foreground mt-0.5">{format(new Date(m.createdAt), "h:mm a")}</span>
                      </div>
                    </div>);
            })) : (<div className="h-full flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">No messages yet. Say hi!</p>
                </div>)}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}/>
              <Button size="icon" onClick={handleSendMessage} disabled={sendMessage.isPending || !message.trim()}>
                <Send className="w-4 h-4"/>
              </Button>
            </div>
          </CardContent>
        </Card>)}
    </div>);
}
