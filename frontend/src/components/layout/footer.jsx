import { Car, Globe, Mail } from "lucide-react";
import { Link } from "wouter";
export function Footer() {
    return (<footer className="bg-background border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary/10 p-2 rounded-xl">
                <Car className="w-5 h-5 text-primary"/>
              </div>
              <span className="font-bold text-xl tracking-tight">
                Carpool<span className="text-primary">Connect</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              A smart, trustworthy carpooling platform for everyday commuters and travelers who want to share rides, save money, and reduce their carbon footprint.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Globe className="w-5 h-5"/>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-5 h-5"/>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/rides" className="hover:text-foreground transition-colors">Find a ride</Link></li>
              <li><Link href="/rides/new" className="hover:text-foreground transition-colors">Offer a ride</Link></li>
              <li><Link href="/register" className="hover:text-foreground transition-colors">Sign up</Link></li>
              <li><Link href="/login" className="hover:text-foreground transition-colors">Log in</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Trust & Safety</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CarpoolConnect. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            
          </p>
        </div>
      </div>
    </footer>);
}
