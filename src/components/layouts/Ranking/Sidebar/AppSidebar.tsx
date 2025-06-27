import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GoSidebarExpand, GoSidebarCollapse } from "react-icons/go";
import { LogOutIcon } from "lucide-react";
import { navStructure, NavItem } from "@/components/layouts/Ranking/Sidebar/NavStructure";

export function AppSidebar() {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [desktopOpen, setDesktopOpen] = useState(true);
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
    const [searchQuery, setSearchQuery] = useState("");

    const toggleSection = (label: string) => {
        setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
    };

    const filterNav = (items: NavItem[]) =>
        items
            .map((item) => {
                const subItems = item.subItems?.filter((sub) =>
                    sub.label.toLowerCase().includes(searchQuery.toLowerCase())
                );
                const matchesMain = item.label.toLowerCase().includes(searchQuery.toLowerCase());

                if (!matchesMain && (!subItems || subItems.length === 0)) return null;

                return {
                    ...item,
                    subItems: subItems?.length ? subItems : item.subItems,
                };
            })
            .filter((item): item is NavItem => item !== null);

    const SidebarContent = (
        <div
            className={cn(
                "h-full bg-primary border-r border-border shadow-sm flex flex-col transition-all duration-300 overflow-y-auto",
                desktopOpen ? "w-64" : "w-16"
            )}
        >
            <div className="h-16 px-2 flex items-center justify-between border-b">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start gap-y-0.5",
                        !desktopOpen && "justify-center"
                    )}
                    onClick={() => setDesktopOpen(!desktopOpen)}
                >
                    {desktopOpen ? (
                        <GoSidebarCollapse className="h-5 w-5" />
                    ) : (
                        <GoSidebarExpand className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {desktopOpen && (
                <div className="px-2 pt-4">
                    <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8"
                    />
                </div>
            )}

            <nav className="flex-1 px-2 py-4 space-y-2">
                {filterNav(navStructure).map((item) => {
                    const isActive = location.pathname === item.path;
                    const hasSubItems = item.subItems && item.subItems.length > 0;

                    return (
                        <div key={item.label}>
                            {item.path && !hasSubItems ? (
                                <Link
                                    to={item.path}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded hover:bg-muted/70",
                                        isActive ? "bg-muted text-primary" : "text-default",
                                        !desktopOpen && "justify-center"
                                    )}
                                >
                                    {item.icon}
                                    {desktopOpen && item.label}
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => toggleSection(item.label)}
                                    className={cn(
                                        "w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-muted/70",
                                        location.pathname.startsWith(`/gameplay/${item.label.toLowerCase()}`)
                                            ? "bg-muted text-primary"
                                            : "text-default",
                                        !desktopOpen && "justify-center"
                                    )}
                                >
                                    {item.icon}
                                    {desktopOpen && item.label}
                                </button>
                            )}

                            {desktopOpen && openSections[item.label] && hasSubItems && (
                                <div className="ml-6">
                                    {item.subItems!.map((sub) => {
                                        const subIsActive = location.pathname === sub.path;
                                        return (
                                            <Link
                                                key={sub.label}
                                                to={sub.path}
                                                onClick={() => setMobileOpen(false)}
                                                className={cn(
                                                    "block w-full px-2 py-1 text-sm rounded hover:bg-muted/70",
                                                    subIsActive ? "bg-muted text-primary" : "text-default"
                                                )}
                                            >
                                                {sub.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            <Link
                to="/logout"
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded hover:bg-muted/70",
                    !desktopOpen ? "justify-center" : "text-default"
                )}
            >
                <LogOutIcon className="h-5 w-5" />
                {desktopOpen && "Logout"}
            </Link>
        </div>
    );

    return (
        <>
            {/* Mobile sidebar toggle */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetTrigger asChild>
                        <Button variant="link" size="icon">
                            <GoSidebarExpand className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        {SidebarContent}
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop sidebar */}
            <aside className="hidden md:flex fixed top-20 bottom-0 z-40">
                {SidebarContent}
            </aside>
        </>
    );
}
