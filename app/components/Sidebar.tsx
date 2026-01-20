"use client";
import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Home,
    Inbox,
    Send,
    Settings,
    Users,
    Building2,
    Truck,
    ExternalLink,
    ChevronRight,
    LogOut
} from "lucide-react";

const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Inward Entry", href: "/transactions/inward", icon: Inbox },
    { name: "Outward Entry", href: "/transactions/outward", icon: Send },
    { type: "divider", label: "Masters" },
    { name: "Offices", href: "/masters/office", icon: Building2 },
    { name: "Modes", href: "/masters/mode", icon: ExternalLink },
    { name: "From/To", href: "/masters/from-to", icon: Users },
    { name: "Courier Companies", href: "/masters/courier", icon: Truck },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);
    const [user, setUser] = useState({ name: "User", email: "user@example.com" });

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        const storedName = localStorage.getItem("userName");
        const storedEmail = localStorage.getItem("userEmail");

        if (storedRole) setRole(storedRole);
        if (storedName && storedEmail) {
            setUser({ name: storedName, email: storedEmail });
        }
    }, [pathname]);

    const handleLogout = () => {
        localStorage.clear();
        router.push("/login");
    };

    // Don't show sidebar on login page
    if (pathname === "/login") return null;

    const filteredMenuItems = menuItems.filter(item => {
        if (role === 'clerk') {
            // Clerks only see Dashboard and Transaction entries
            return item.name === 'Dashboard' ||
                item.name === 'Inward Entry' ||
                item.name === 'Outward Entry';
        }
        return true; // Admin sees everything
    });

    return (
        <aside className="w-72 h-screen border-r border-[var(--border)] bg-white flex flex-col sticky top-0">
            <div className="p-8">
                {/* Logo Removed as requested */}
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-8">
                {filteredMenuItems.map((item, idx) => {
                    if (item.type === "divider") {
                        return (
                            <div key={idx} className="pt-6 pb-2 px-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {item.label}
                                </p>
                            </div>
                        );
                    }

                    const Icon = item.icon!;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.name}
                            href={item.href!}
                            className={`sidebar-link ${isActive ? "active" : ""}`}
                        >
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="flex-1">{item.name}</span>
                            {isActive && <ChevronRight size={14} className="opacity-50" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-[var(--border)] bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 border border-white overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
