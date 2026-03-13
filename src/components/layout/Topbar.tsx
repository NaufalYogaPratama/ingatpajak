"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { navigationLinks } from "./Sidebar";
import { cn } from "@/lib/utils";
import type { User as UserType } from "@prisma/client";

interface TopbarProps {
    user: UserType;
}

export function Topbar({ user }: TopbarProps) {
    const pathname = usePathname();
    const initials = user.name ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "WP";

    return (
        <header className="flex h-16 items-center gap-4 border-b bg-card px-6 md:px-8 shrink-0">
            <Sheet>
                <SheetTrigger render={<Button variant="outline" size="icon" className="shrink-0 md:hidden" />}>
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                    <div className="flex items-center gap-2 mb-8">
                        <div className="flex bg-primary text-primary-foreground font-bold p-1 rounded-md text-xl">
                            <span className="text-secondary">!</span>P
                        </div>
                        <span className="text-xl font-bold text-primary">ingat</span>
                        <span className="text-xl font-bold text-secondary -ml-1">Pajak.</span>
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

            <div className="w-full flex-1 md:w-auto md:flex-none">
                {/* Optional Page Title or Breadcrumb space */}
            </div>

            <div className="flex items-center gap-4 ml-auto">
                <Button variant="ghost" size="icon" className="rounded-full relative">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                    <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" className="relative h-10 w-auto flex items-center gap-3 rounded-full hover:bg-muted/50 pl-2 pr-4" />}>
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-semibold">{user.name}</span>
                            <span className="text-xs text-muted-foreground">Wajib Pajak</span>
                        </div>
                        <Avatar className="h-8 w-8 bg-primary">
                            <AvatarFallback className="text-primary-foreground bg-primary">{initials}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Pengaturan Profil</DropdownMenuItem>
                        <DropdownMenuItem>Bantuan</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                            Keluar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
