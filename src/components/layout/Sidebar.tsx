import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Calendar, Clock } from "lucide-react";

export const navigationLinks = [
    { name: "Beranda", href: "/dashboard", icon: Home },
    { name: "Kalender Pajak", href: "/dashboard/calendar", icon: Calendar },
    { name: "Riwayat", href: "/dashboard/history", icon: Clock },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden w-64 flex-col border-r bg-card md:flex">
            <div className="flex h-16 items-center px-6 border-b">
                <Link href="/dashboard" className="flex items-center gap-2">
                    {/* A simple logo placeholder using primary colors */}
                    <div className="flex bg-primary text-primary-foreground font-bold p-1 rounded-md text-xl">
                        <span className="text-secondary">!</span>P
                    </div>
                    <span className="text-xl font-bold text-primary">ingat</span>
                    <span className="text-xl font-bold text-secondary -ml-1">Pajak.</span>
                </Link>
            </div>
            <nav className="flex-1 space-y-2 p-4">
                {navigationLinks.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
