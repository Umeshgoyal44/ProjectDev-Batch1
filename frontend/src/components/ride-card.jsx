import { Link } from "wouter";
import { format } from "date-fns";
import { MapPin, Calendar, Clock, Users } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MatchScore } from "./match-score";
import { RatingStars } from "./rating-stars";
export function RideCard({ ride, showMatchScore = false }) {
    const departureDate = new Date(ride.departureTime);
    const isFull = ride.availableSeats === 0;
    return (<Link href={`/rides/${ride.id}`}>
      <Card className="hover-elevate cursor-pointer transition-all duration-200 border-border/50 overflow-hidden group">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-border">
                <AvatarImage src={ride.driverAvatar || ""} alt={ride.driverName}/>
                <AvatarFallback>{ride.driverName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{ride.driverName}</p>
                {ride.driverRating != null && (<RatingStars rating={ride.driverRating} size={12}/>)}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-primary">${ride.pricePerSeat}</p>
              <p className="text-xs text-muted-foreground">per seat</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-2 relative">
              <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-muted rounded-full"></div>
              
              <div className="flex items-start gap-3 relative z-10">
                <div className="bg-primary/10 p-1 rounded-full text-primary mt-0.5">
                  <MapPin className="w-3 h-3"/>
                </div>
                <div>
                  <p className="font-medium text-foreground">{ride.origin}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 relative z-10">
                <div className="bg-secondary p-1 rounded-full text-secondary-foreground mt-0.5">
                  <MapPin className="w-3 h-3"/>
                </div>
                <div>
                  <p className="font-medium text-foreground">{ride.destination}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4"/>
                <span>{format(departureDate, "MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4"/>
                <span>{format(departureDate, "h:mm a")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4"/>
                <span>
                  {ride.availableSeats} {ride.availableSeats === 1 ? "seat" : "seats"} left
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        
        {(showMatchScore || isFull) && (<CardFooter className="p-4 bg-muted/30 flex justify-between items-center border-t border-border/50">
            {showMatchScore && ride.matchScore != null ? (<MatchScore score={ride.matchScore} className="w-full max-w-[120px]"/>) : (<div />)}
            
            {isFull && (<Badge variant="secondary" className="font-medium">Full</Badge>)}
          </CardFooter>)}
      </Card>
    </Link>);
}
