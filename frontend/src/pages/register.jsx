import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Car, UserCheck, Users } from "lucide-react";
const schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().optional(),
    role: z.enum(["driver", "rider", "both"]),
});
export default function Register() {
    const [, setLocation] = useLocation();
    const { login } = useAuth();
    const { toast } = useToast();
    const registerMutation = useRegister();
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: { name: "", email: "", password: "", phone: "", role: "rider" },
    });
    async function onSubmit(data) {
        try {
            const result = await registerMutation.mutateAsync({
                data: { ...data, phone: data.phone || undefined },
            });
            login(result.token);
            setLocation("/dashboard");
        }
        catch {
            toast({ title: "Registration failed", description: "Email may already be in use", variant: "destructive" });
        }
    }
    return (<div className="flex-1 flex items-center justify-center min-h-[80vh] px-4 bg-gradient-to-br from-background to-muted/30">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Create account</h1>
          <p className="text-muted-foreground">Join thousands of commuters sharing rides every day</p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardContent className="pt-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" placeholder="Jane Doe" {...form.register("name")}/>
                {form.formState.errors.name && (<p className="text-sm text-destructive">{form.formState.errors.name.message}</p>)}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" {...form.register("email")}/>
                {form.formState.errors.email && (<p className="text-sm text-destructive">{form.formState.errors.email.message}</p>)}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Min 6 characters" {...form.register("password")}/>
                {form.formState.errors.password && (<p className="text-sm text-destructive">{form.formState.errors.password.message}</p>)}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" type="tel" placeholder="+1 555 000 0000" {...form.register("phone")}/>
              </div>

              <div className="space-y-2">
                <Label>I want to</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["rider", "driver", "both"].map((role) => {
            const icons = { rider: <Users className="w-4 h-4"/>, driver: <Car className="w-4 h-4"/>, both: <UserCheck className="w-4 h-4"/> };
            const labels = { rider: "Find rides", driver: "Offer rides", both: "Both" };
            const selected = form.watch("role") === role;
            return (<button key={role} type="button" onClick={() => form.setValue("role", role)} className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-sm font-medium transition-all ${selected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"}`}>
                        {icons[role]}
                        {labels[role]}
                      </button>);
        })}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={registerMutation.isPending} size="lg">
                {registerMutation.isPending ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>);
}
