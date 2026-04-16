import { Progress } from "@/components/ui/progress";
export function MatchScore({ score, className = "", showText = true }) {
    let colorClass = "bg-green-500";
    if (score < 50)
        colorClass = "bg-red-500";
    else if (score < 80)
        colorClass = "bg-yellow-500";
    return (<div className={`flex flex-col gap-1.5 ${className}`}>
      {showText && (<div className="flex justify-between text-xs font-medium text-muted-foreground">
          <span>Match Score</span>
          <span className="font-bold text-foreground">{score}%</span>
        </div>)}
      <Progress value={score} className="h-2" indicatorClassName={colorClass}/>
    </div>);
}
