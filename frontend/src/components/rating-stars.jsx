import { Star } from "lucide-react";
export function RatingStars({ rating, maxStars = 5, size = 16, className = "" }) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);
    return (<div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: fullStars }).map((_, i) => (<Star key={`full-${i}`} size={size} className="fill-yellow-400 text-yellow-400"/>))}
      {hasHalfStar && (<div className="relative">
          <Star size={size} className="text-gray-300 dark:text-gray-600"/>
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star size={size} className="fill-yellow-400 text-yellow-400"/>
          </div>
        </div>)}
      {Array.from({ length: emptyStars }).map((_, i) => (<Star key={`empty-${i}`} size={size} className="text-gray-300 dark:text-gray-600"/>))}
    </div>);
}
