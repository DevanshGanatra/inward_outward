"use client";

import { useState, useEffect } from "react";
import {
    Inbox,
    Send,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    Plus
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    const [role, setRole] = useState<string | null>(null);
    const [userName, setUserName] = useState("Manager");
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>({
        stats: {
            totalInward: 0,
            totalOutward: 0,
            pendingItems: 0,
            activeOffices: 0
        },
        recentTraffic: []
    });

    const fetchDashboardData = async () => {
        try {
            const res = await fetch("/api/dashboard");
            const d = await res.json();
            setData(d);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setRole(localStorage.getItem("userRole"));
        setUserName(localStorage.getItem("userName")?.split(" ")[0] || "Manager");
        fetchDashboardData();
    }, []);

    const stats = [
        { name: "Total Inward", value: data.stats.totalInward.toString(), change: "+0%", trend: "up" },
        { name: "Total Outward", value: data.stats.totalOutward.toString(), change: "+0%", trend: "up" },
        { name: "Pending Items", value: data.stats.pendingItems.toString(), change: "0", trend: "neutral" },
        { name: "Active Offices", value: data.stats.activeOffices.toString(), change: "0", trend: "neutral" },
    ];

    const filteredStats = stats.filter(stat => {
        if (role === 'clerk') {
            return stat.name !== "Active Offices";
        }
        return true;
    });
    return (
        <div className="p-10 space-y-10">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 mt-2 font-medium">Welcome back, {userName}. Here's what's happening today.</p>
                </div>
                <div className="flex gap-4">
                    <button className="pastel-button flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800">
                        <Plus size={20} />
                        Quick Entry
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredStats.map((stat) => (
                    <div key={stat.name} className="pastel-card group">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.name}</p>
                            <div className={`p-1.5 rounded-lg ${stat.trend === "up" ? "bg-emerald-50 text-emerald-600" :
                                stat.trend === "down" ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-600"
                                }`}>
                                {stat.trend === "up" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                            <p className={`text-xs font-bold ${stat.trend === "up" ? "text-emerald-500" :
                                stat.trend === "down" ? "text-rose-500" : "text-slate-400"
                                }`}>
                                {stat.change}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Recent Activity Table */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recent Traffic</h2>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search entries..."
                                    className="pastel-input py-1.5 pl-10 text-sm w-64"
                                />
                            </div>
                            <button className="p-2 border border-[var(--border)] rounded-lg hover:bg-slate-50 transition-colors">
                                <Filter size={18} className="text-slate-500" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border border-[var(--border)] rounded-3xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-[var(--border)]">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Type</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Subject</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date/Time</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan={4} className="p-10 text-center text-slate-400">Loading traffic...</td></tr>
                                ) : data.recentTraffic.length === 0 ? (
                                    <tr><td colSpan={4} className="p-10 text-center text-slate-400">No recent activity</td></tr>
                                ) : data.recentTraffic.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group cursor-pointer">
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${item.type.toLowerCase() === "inward"
                                                ? "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                                                : "bg-orange-50 text-orange-600 group-hover:bg-orange-100"
                                                }`}>
                                                {item.type.toLowerCase() === "inward" ? <Inbox size={12} /> : <Send size={12} />}
                                                {item.type}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">{item.subject}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">{item.time}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="p-6 text-center border-t border-slate-50">
                            <button className="text-sm font-bold text-[var(--primary-foreground)] hover:underline">
                                View All Transactions
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions / Shortcuts */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Quick Entry</h2>
                    <div className="space-y-4">
                        <Link href="/transactions/inward">
                            <div className="pastel-card bg-blue-50/50 border-blue-100 cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-200 transition-transform group-hover:scale-110">
                                        <Inbox size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-blue-900">Inward Log</h3>
                                        <p className="text-xs text-blue-600/70 font-medium">Record a new incoming parcel</p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link href="/transactions/outward">
                            <div className="pastel-card bg-orange-50/50 border-orange-100 cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-200 transition-transform group-hover:scale-110">
                                        <Send size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-orange-900">Outward Log</h3>
                                        <p className="text-xs text-orange-600/70 font-medium">Record a new outgoing dispatch</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
