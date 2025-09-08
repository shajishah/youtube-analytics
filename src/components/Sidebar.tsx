import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Home,
  PlayCircle,
  TrendingUp,
  Search,
  Clock,
  Heart,
  Settings,
  Youtube,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
    current: true,
  },
  {
    name: "Videos",
    href: "/videos",
    icon: PlayCircle,
    current: false,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    current: false,
  },
  {
    name: "Trending",
    href: "/trending",
    icon: TrendingUp,
    current: false,
  },
];

const secondaryNavigation = [
  {
    name: "Search History",
    href: "/search-history",
    icon: Clock,
  },
  {
    name: "Favorites",
    href: "/favorites",
    icon: Heart,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-card border-r border-border shadow-sm hidden md:block">
      <div className="flex h-full flex-col">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2 p-6 border-b border-border">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Youtube className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">YouTube</span>
            <span className="text-xs text-muted-foreground">Analytics</span>
          </div>
        </div>

        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 py-4">
            {/* Main Navigation */}
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Button
                    key={item.name}
                    variant={active ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-9",
                      active
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                    asChild
                  >
                    <Link to={item.href}>
                      <Icon className="w-4 h-4" />
                      {item.name}
                      {active && (
                        <Badge variant="secondary" className="ml-auto px-1.5 py-0.5 text-xs">
                          Active
                        </Badge>
                      )}
                    </Link>
                  </Button>
                );
              })}
            </div>

            <Separator className="my-4" />

            {/* Secondary Navigation */}
            <div className="space-y-1">
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Library
                </h3>
              </div>
              {secondaryNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className="w-full justify-start gap-3 h-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                    asChild
                  >
                    <Link to={item.href}>
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>API Connected</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

