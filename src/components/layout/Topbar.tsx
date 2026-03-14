"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, User as UserIcon, Home, Calendar, Clock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logoutUser } from "@/lib/actions";
import { cn } from "@/lib/utils";
import type { User as UserType } from "@prisma/client";

export const navigationLinks = [
    { name: "Beranda", href: "/dashboard", icon: Home },
    { name: "Kalender Pajak", href: "/dashboard/calendar", icon: Calendar },
    { name: "Riwayat", href: "/dashboard/history", icon: Clock },
];

interface TopbarProps {
    user: UserType;
}

export function Topbar({ user }: TopbarProps) {
    const pathname = usePathname();
    const initials = user.name ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "WP";

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm shrink-0">
            <div className="flex h-16 items-center px-6 md:px-8 max-w-7xl mx-auto">
                {/* Left Side: Logo & Mobile Trigger */}
                <div className="flex items-center gap-4 flex-1">
                    <Sheet>
                        <SheetTrigger render={<Button variant="ghost" size="icon" className="shrink-0 md:hidden -ml-2" />}>
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64">
                            <SheetTitle className="sr-only">Menu</SheetTitle>
                            <div className="flex items-center gap-2 mb-8">
                                <div className="flex bg-primary text-primary-foreground font-bold rounded-lg text-xl w-9 h-9 items-center justify-center shrink-0 shadow-sm">
                                    <span className="text-secondary">!</span>P
                                </div>
                                <div className="flex flex-col -space-y-1">
                                    <span className="text-sm font-bold text-primary tracking-tight leading-none pt-1">ingat</span>
                                    <span className="text-sm font-bold text-secondary tracking-tight leading-none">Pajak.</span>
                                </div>
                            </div>
                            <nav className="grid gap-2">
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
                        </SheetContent>
                    </Sheet>

                    {/* Desktop Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        <div className="flex bg-primary text-primary-foreground font-bold rounded-lg text-xl w-9 h-9 items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                            <span className="text-secondary">!</span>P
                        </div>
                        <div className="flex flex-col -space-y-1">
                            <span className="text-sm font-bold text-primary tracking-tight leading-none pt-1">ingat</span>
                            <span className="text-sm font-bold text-secondary tracking-tight leading-none">Pajak.</span>
                        </div>
                    </Link>
                </div>

                {/* Center Navigation */}
                <nav className="hidden md:flex items-center gap-1 h-full flex-initial">
                    {navigationLinks.map((item) => {
                        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 px-6 h-full text-sm font-medium transition-all relative border-b-2 whitespace-nowrap",
                                    isActive
                                        ? "text-primary border-primary bg-primary/5"
                                        : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Side: Actions & Profile */}
                <div className="flex items-center justify-end gap-3 flex-1">
                    {/* <Button variant="ghost" size="icon" className="rounded-full relative">
                        <Bell className="h-5 w-5" />
                        <span className="sr-only">Notifications</span>
                        <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
                    </Button> */}

                    <div className="flex items-center gap-4 pl-4 border-l border-slate-100 ml-2">
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex flex-col items-end leading-tight">
                                <span className="text-[13px] font-bold text-slate-700 truncate max-w-[120px]">{user.name}</span>
                                <span className="text-[10px] text-slate-400 font-medium">Wajib Pajak</span>
                            </div>
                            <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-slate-100">
                                <AvatarFallback className="text-primary-foreground bg-primary text-xs font-bold leading-none">{initials}</AvatarFallback>
                            </Avatar>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full text-slate-400 hover:text-destructive hover:bg-destructive/5 transition-all duration-200"
                            onClick={() => logoutUser()}
                            title="Keluar"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
