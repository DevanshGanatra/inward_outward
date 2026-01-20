"use client";

import { useState, useEffect } from "react";
import {
    Send,
    Plus,
    Search,
    Calendar,
    User,
    Truck,
    FileText,
    Save,
    X,
    History,
    CreditCard,
    Target
} from "lucide-react";

export default function OutwardEntry() {
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [entries, setEntries] = useState<any[]>([]);

    // Masters for dropdowns
    const [offices, setOffices] = useState<any[]>([]);
    const [modes, setModes] = useState<any[]>([]);
    const [couriers, setCouriers] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        OutwardNo: "",
        OutwardDate: new Date().toISOString().split('T')[0],
        Subject: "",
        Description: "",
        CourierCompanyName: "",
        OutwardLetterNo: "",
        OutwardLetterDate: "",
        FromInwardOutwardOfficeID: "",
        InOutwardModeID: ""
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [entriesRes, officesRes, modesRes, couriersRes] = await Promise.all([
                fetch("/api/transactions/outward"),
                fetch("/api/masters/office"),
                fetch("/api/masters/mode"),
                fetch("/api/masters/courier")
            ]);

            const [entriesData, officesData, modesData, couriersData] = await Promise.all([
                entriesRes.json(),
                officesRes.json(),
                modesRes.json(),
                couriersRes.json()
            ]);

            setEntries(entriesData);
            setOffices(officesData);
            setModes(modesData);
            setCouriers(couriersData);

            // Set default office if available
            if (officesData.length > 0) {
                setFormData(prev => ({ ...prev, FromInwardOutwardOfficeID: officesData[0].InwardOutwardOfficeID.toString() }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/transactions/outward", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setShowForm(false);
                fetchData();
                setFormData({
                    OutwardNo: "",
                    OutwardDate: new Date().toISOString().split('T')[0],
                    Subject: "",
                    Description: "",
                    CourierCompanyName: "",
                    OutwardLetterNo: "",
                    OutwardLetterDate: "",
                    FromInwardOutwardOfficeID: offices[0]?.InwardOutwardOfficeID?.toString() || "",
                    InOutwardModeID: ""
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-10 space-y-8 font-sans">
            <header className="flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <Send size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Transactions</span>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Outward Entry</h1>
                    <p className="text-slate-500 mt-2 font-medium">Register outgoing documents, parcels, and dispatches.</p>
                </div>
                <div className="flex gap-3">

                    <button
                        onClick={() => setShowForm(false)} // placeholder for switching
                        className="p-3 border border-[var(--border)] rounded-2xl bg-slate-900 text-white"
                    >
                        <History size={20} />
                    </button>
                    <button
                        onClick={() => setShowForm(true)}
                        className="pastel-button bg-orange-500 text-white hover:bg-orange-600 flex items-center gap-2 px-6 py-3.5 shadow-lg shadow-orange-100"
                    >
                        <Plus size={20} />
                        New Dispatch
                    </button>
                </div>
            </header>

            {/* Main Table view of recent Outwards */}
            <div className="bg-white border border-[var(--border)] rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-50 bg-slate-50/20 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Dispatch Records</h2>
                    <div className="relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search tracking numbers..." className="pastel-input py-2.5 pl-12 text-sm w-72 bg-white" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center w-20">No</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Outward Date</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Subject</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Courier/Mode</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Reference No</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={5} className="p-20 text-center text-slate-400">Loading records...</td></tr>
                            ) : entries.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Truck size={32} className="text-orange-200" />
                                        </div>
                                        <p className="text-lg font-bold text-slate-400">No dispatch records found</p>
                                    </td>
                                </tr>
                            ) : entries.map((entry) => (
                                <tr key={entry.OutwardID} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-8 py-6 text-center font-bold text-slate-900">{entry.OutwardNo}</td>
                                    <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                                        {new Date(entry.OutwardDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-slate-800">{entry.Subject}</p>
                                        <p className="text-xs text-slate-400 truncate max-w-xs">{entry.Description}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                                                <Truck size={14} />
                                            </div>
                                            <span className="text-sm font-medium text-slate-600">{entry.CourierCompanyName || "Direct"}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                            {entry.OutwardLetterNo}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/10 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="h-full w-full max-w-4xl bg-white shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto">
                        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md p-8 border-b border-orange-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">New Outward Dispatch</h2>
                                <div className="flex items-center gap-4 mt-1">
                                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                        Batch: OUT/2026/001
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowForm(false)}
                                className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-orange-50 text-orange-400 transition-all border border-transparent hover:border-orange-100"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-10">
                            {/* Section 1: Source & Mode */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 border-l-4 border-orange-500 pl-4">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Outward Details</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="col-span-1">
                                        <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Outward Number</label>
                                        <input
                                            type="text"
                                            className="pastel-input"
                                            placeholder="e.g. 2024/001"
                                            value={formData.OutwardNo}
                                            onChange={(e) => setFormData({ ...formData, OutwardNo: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Dispatch Date</label>
                                        <input
                                            type="date"
                                            className="pastel-input"
                                            value={formData.OutwardDate}
                                            onChange={(e) => setFormData({ ...formData, OutwardDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-bold text-slate-700 mb-2 px-1">From Office</label>
                                        <select
                                            className="pastel-input py-3"
                                            value={formData.FromInwardOutwardOfficeID}
                                            onChange={(e) => setFormData({ ...formData, FromInwardOutwardOfficeID: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Office...</option>
                                            {offices.map(o => (
                                                <option key={o.InwardOutwardOfficeID} value={o.InwardOutwardOfficeID}>
                                                    {o.OfficeName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Mode of Transfer</label>
                                        <select
                                            className="pastel-input py-3"
                                            value={formData.InOutwardModeID}
                                            onChange={(e) => setFormData({ ...formData, InOutwardModeID: e.target.value })}
                                        >
                                            <option value="">Select Mode...</option>
                                            {modes.map(m => (
                                                <option key={m.InOutwardModeID} value={m.InOutwardModeID}>
                                                    {m.InOutwardModeName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Courier Company</label>
                                        <select
                                            className="pastel-input py-3"
                                            value={formData.CourierCompanyName}
                                            onChange={(e) => setFormData({ ...formData, CourierCompanyName: e.target.value })}
                                        >
                                            <option value="">Select Company...</option>
                                            {couriers.map(c => (
                                                <option key={c.CourierCompanyID} value={c.CourierCompanyName}>
                                                    {c.CourierCompanyName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Document Details */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 border-l-4 border-slate-900 pl-4">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Content & Reference</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Subject</label>
                                        <input
                                            type="text"
                                            className="pastel-input"
                                            placeholder="What is this dispatch about?"
                                            value={formData.Subject}
                                            onChange={(e) => setFormData({ ...formData, Subject: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Description / Remarks</label>
                                        <textarea
                                            className="pastel-input min-h-[80px]"
                                            placeholder="Additional details..."
                                            value={formData.Description}
                                            onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Reference Letter No.</label>
                                        <input
                                            type="text"
                                            className="pastel-input"
                                            placeholder="e.g. LTR/55/2024"
                                            value={formData.OutwardLetterNo}
                                            onChange={(e) => setFormData({ ...formData, OutwardLetterNo: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Letter Date</label>
                                        <input
                                            type="date"
                                            className="pastel-input"
                                            value={formData.OutwardLetterDate}
                                            onChange={(e) => setFormData({ ...formData, OutwardLetterDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-white/80 backdrop-blur-md pt-8 pb-12 border-t border-slate-50 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 py-4.5 rounded-2xl border border-[var(--border)] font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-[3] py-4.5 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-2xl shadow-slate-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <Save size={20} />
                                    {submitting ? "Finalizing..." : "Finalize Dispatch"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
