import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Car, Loader2 } from "lucide-react";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(1, { message: "Password is required." }),
});
export default function Login() {
    const [, setLocation] = useLocation();
    const { login: setAuthToken } = useAuth();
    const { toast } = useToast();
    const loginMutation = useLogin();
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    function onSubmit(data) {
        loginMutation.mutate({ data }, {
            onSuccess: (response) => {
                setAuthToken(response.token);
                toast({
                    title: "Welcome back!",
                    description: "You have successfully logged in.",
                });
                setLocation("/dashboard");
            },
            onError: (error) => {
                toast({
                    variant: "destructive",
                    title: "Login failed",
                    description: error.message || "Please check your credentials and try again.",
                });
            },
        });
    }
    return (<div className="flex min-h-[calc(100vh-16rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 shadow-lg">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-2">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <Car className="w-8 h-8 text-primary"/>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
          <CardDescription className="text-base">
            Enter your email to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="email" render={({ field }) => (<FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" type="email" autoComplete="email" className="h-11" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>)}/>
              <FormField control={form.control} name="password" render={({ field }) => (<FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <a href="#" className="text-sm font-medium text-primary hover:underline" tabIndex={-1}>
                        Forgot password?
                      </a>
                    </div>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" autoComplete="current-password" className="h-11" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>)}/>
              <Button type="submit" className="w-full h-11 text-base font-medium mt-2" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? (<>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin"/>
                    Signing in...
                  </>) : ("Sign In")}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-border/50 pt-6">
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>);
}
