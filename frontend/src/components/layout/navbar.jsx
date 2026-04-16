import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Car, Bell, User as UserIcon, LogOut, Menu, ShieldAlert } from "lucide-react";
import { useListNotifications } from "@workspace/api-client-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
export function Navbar() {
    const { user, logout } = useAuth();
    const [, setLocation] = useLocation();
    const { data: notifications } = useListNotifications({
        query: {
            enabled: !!user,
            refetchInterval: 10000,
        }
    });
    const unreadCount = notifications?.filter(n => !n.isRead).length || 0;
    const handleLogout = () => {
        logout();
        setLocation("/");
    };
    const NavLinks = () => (<>
      <Link href="/rides" className="text-sm font-medium hover:text-primary transition-colors">
        Find a Ride
      </Link>
      {(user?.role === "driver" || user?.role === "both") && (<Link href="/rides/new" className="text-sm font-medium hover:text-primary transition-colors">
          Offer a Ride
        </Link>)}
      {user && (<Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
          Dashboard
        </Link>)}
    </>);
    return (<nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Car className="w-5 h-5 text-primary"/>
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
              Carpool<span className="text-primary">Connect</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6 ml-6 border-l border-border pl-6">
            <NavLinks />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (<>
              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="relative hover:bg-muted/50 rounded-full">
                  <Bell className="w-5 h-5 text-muted-foreground"/>
                  {unreadCount > 0 && (<Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-[10px]">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>)}
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary transition-colors">
                      <AvatarImage src={user.avatarUrl || ""} alt={user.name}/>
                      <AvatarFallback className="bg-primary/5 text-primary">
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${user.id}`} className="cursor-pointer flex w-full items-center">
                      <UserIcon className="mr-2 h-4 w-4"/>
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (<DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer flex w-full items-center">
                        <ShieldAlert className="mr-2 h-4 w-4 text-primary"/>
                        <span className="text-primary font-medium">Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>)}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4"/>
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>) : (<div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="hidden sm:flex">Log in</Button>
              </Link>
              <Link href="/register">
                <Button>Sign up</Button>
              </Link>
            </div>)}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5"/>
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <NavLinks />
                {!user && (<>
                    <div className="h-px bg-border my-2"/>
                    <Link href="/login" className="text-sm font-medium">Log in</Link>
                  </>)}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>);
}
