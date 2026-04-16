import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import RidesList from "@/pages/rides-list";
import CreateRide from "@/pages/create-ride";
import RideDetail from "@/pages/ride-detail";
import Profile from "@/pages/profile";
import Notifications from "@/pages/notifications";
import Admin from "@/pages/admin";
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});
function AppLayout({ children }) {
    return (<div className="flex flex-col min-h-[100dvh]">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>);
}
function Router() {
    return (<Switch>
      <Route path="/" component={Home}/>
      <Route path="/login" component={Login}/>
      <Route path="/register" component={Register}/>
      <Route path="/dashboard" component={Dashboard}/>
      <Route path="/rides/new" component={CreateRide}/>
      <Route path="/rides/:id" component={RideDetail}/>
      <Route path="/rides" component={RidesList}/>
      <Route path="/profile/:id" component={Profile}/>
      <Route path="/notifications" component={Notifications}/>
      <Route path="/admin" component={Admin}/>
      <Route component={NotFound}/>
    </Switch>);
}
function App() {
    return (<QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AppLayout>
              <Router />
            </AppLayout>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>);
}
export default App;
