"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    ExternalLink,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle
} from "lucide-react";

// Data fetching and states
const useModes = () => {
    const [modes, setModes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchModes = async () => {
        try {
            const res = await fetch("/api/masters/mode");
            const data = await res.json();
            setModes(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModes();
    }, []);

    return { modes, loading, fetchModes };
};

export default function ModeMaster() {
    const router = useRouter();
    const { modes, loading, fetchModes } = useModes();
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        InOutwardModeName: "",
        IsActive: true,
        Sequence: "1",
        Remarks: ""
    });

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role !== "admin") {
            router.push("/dashboard");
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/masters/mode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setShowForm(false);
                fetchModes();
                setFormData({
                    InOutwardModeName: "",
                    IsActive: true,
                    Sequence: "1",
                    Remarks: ""
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
                        <ExternalLink size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Master Directory</span>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Mode Master</h1>
                    <p className="text-slate-500 mt-2 font-medium">Define transfer modes for your documents and parcels.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="pastel-button flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800"
                >
                    <Plus size={20} />
                    Add Mode
                </button>
            </header>

            <div className="bg-white border border-[var(--border)] rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div className="relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search modes..."
                            className="pastel-input py-2.5 pl-12 text-sm w-80 bg-white"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Mode Name</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Sequence</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Remarks</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-10 text-center text-slate-400">Loading modes...</td>
                                </tr>
                            ) : modes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-10 text-center text-slate-400">No modes found.</td>
                                </tr>
                            ) : modes.map((mode) => (
                                <tr key={mode.InOutwardModeID} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center text-slate-700">
                                                <ExternalLink size={20} />
                                            </div>
                                            <span className="font-bold text-slate-800">{mode.InOutwardModeName}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex justify-center">
                                            {mode.IsActive ? (
                                                <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                                                    <CheckCircle2 size={12} />
                                                    Active
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                                                    <XCircle size={12} />
                                                    Inactive
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center text-sm font-bold text-slate-500">{mode.Sequence}</td>
                                    <td className="px-8 py-6 text-sm text-slate-500 font-medium max-w-xs truncate">{mode.Remarks}</td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100 shadow-sm">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all border border-transparent hover:border-rose-100 shadow-sm">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/20 text-sm font-medium text-slate-500">
                    <p>Showing 4 of 4 modes</p>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[2rem] border border-[var(--border)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <h2 className="text-xl font-bold text-slate-900">Add New Mode</h2>
                            <button onClick={() => setShowForm(false)} className="text-2xl text-slate-400 hover:text-slate-900">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Mode Name</label>
                                    <input
                                        type="text"
                                        className="pastel-input"
                                        placeholder="e.g. Courier"
                                        value={formData.InOutwardModeName}
                                        onChange={(e) => setFormData({ ...formData, InOutwardModeName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Sequence</label>
                                    <input
                                        type="number"
                                        className="pastel-input"
                                        placeholder="1"
                                        value={formData.Sequence}
                                        onChange={(e) => setFormData({ ...formData, Sequence: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                                    <select
                                        className="pastel-input"
                                        value={formData.IsActive ? "Active" : "Inactive"}
                                        onChange={(e) => setFormData({ ...formData, IsActive: e.target.value === "Active" })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Remarks</label>
                                    <textarea
                                        className="pastel-input min-h-[100px]"
                                        placeholder="Add any details..."
                                        value={formData.Remarks}
                                        onChange={(e) => setFormData({ ...formData, Remarks: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3.5 rounded-2xl border border-[var(--border)] font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-[2] py-3.5 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 disabled:opacity-50"
                                >
                                    {submitting ? "Saving..." : "Save Mode"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
