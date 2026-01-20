"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Building2,
    Calendar,
    Hash,
    MoreVertical,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

// Data fetching and states
const useOffices = () => {
    const [offices, setOffices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOffices = async () => {
        try {
            const res = await fetch("/api/masters/office");
            const data = await res.json();
            setOffices(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOffices();
    }, []);

    return { offices, loading, fetchOffices };
};

export default function OfficeMaster() {
    const router = useRouter();
    const { offices, loading, fetchOffices } = useOffices();
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        OfficeName: "",
        InstituteID: "1",
        DepartmentID: "",
        OpeningDate: new Date().toISOString().split('T')[0],
        OpeningInwardNo: "1",
        OpeningOutwardNo: "1"
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
            const res = await fetch("/api/masters/office", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setShowForm(false);
                fetchOffices();
                setFormData({
                    OfficeName: "",
                    InstituteID: "1",
                    DepartmentID: "",
                    OpeningDate: new Date().toISOString().split('T')[0],
                    OpeningInwardNo: "1",
                    OpeningOutwardNo: "1"
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
                        <Building2 size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Master Directory</span>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Office Master</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage your organization's branches and departments.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="pastel-button flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800"
                >
                    <Plus size={20} />
                    Add Office
                </button>
            </header>

            {/* Main Content Area */}
            <div className="bg-white border border-[var(--border)] rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div className="relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search offices..."
                            className="pastel-input py-2.5 pl-12 text-sm w-80 bg-white"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2.5 text-slate-500 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-slate-100">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Office Name</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Institute</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Opening Date</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Inward Start</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Outward Start</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-10 text-center text-slate-400">Loading offices...</td>
                                </tr>
                            ) : offices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-10 text-center text-slate-400">No offices found.</td>
                                </tr>
                            ) : offices.map((office) => (
                                <tr key={office.InwardOutwardOfficeID} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center text-slate-700">
                                                <Building2 size={20} />
                                            </div>
                                            <span className="font-bold text-slate-800">{office.OfficeName}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-medium text-slate-500">{office.InstituteID}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                            <Calendar size={14} className="text-slate-400" />
                                            {new Date(office.OpeningDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold">
                                            #{office.OpeningInwardNo}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="inline-block bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-xs font-bold">
                                            #{office.OpeningOutwardNo}
                                        </span>
                                    </td>
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

                <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/20">
                    <p className="text-sm font-medium text-slate-500">Showing 2 of 2 offices</p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-30" disabled>
                            <ChevronLeft size={20} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-30" disabled>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Form Dialog Placeholder */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[2rem] border border-[var(--border)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Add New Office</h2>
                                <p className="text-sm text-slate-500 mt-1">Fill in the office registration details below.</p>
                            </div>
                            <button
                                onClick={() => setShowForm(false)}
                                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 text-slate-400 hover:text-slate-900 transition-all"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Office Name</label>
                                    <input
                                        type="text"
                                        className="pastel-input"
                                        placeholder="e.g. Main Branch"
                                        value={formData.OfficeName}
                                        onChange={(e) => setFormData({ ...formData, OfficeName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Institute ID</label>
                                    <input
                                        type="number"
                                        className="pastel-input"
                                        placeholder="1"
                                        value={formData.InstituteID}
                                        onChange={(e) => setFormData({ ...formData, InstituteID: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Department ID</label>
                                    <input
                                        type="number"
                                        className="pastel-input"
                                        placeholder="Optional"
                                        value={formData.DepartmentID}
                                        onChange={(e) => setFormData({ ...formData, DepartmentID: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Opening Date</label>
                                    <input
                                        type="date"
                                        className="pastel-input"
                                        value={formData.OpeningDate}
                                        onChange={(e) => setFormData({ ...formData, OpeningDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Opening Inward No</label>
                                    <input
                                        type="number"
                                        className="pastel-input"
                                        placeholder="1"
                                        value={formData.OpeningInwardNo}
                                        onChange={(e) => setFormData({ ...formData, OpeningInwardNo: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Opening Outward No</label>
                                    <input
                                        type="number"
                                        className="pastel-input"
                                        placeholder="1"
                                        value={formData.OpeningOutwardNo}
                                        onChange={(e) => setFormData({ ...formData, OpeningOutwardNo: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 py-3.5 rounded-2xl border border-[var(--border)] font-bold text-slate-600 hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-[2] py-3.5 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                                >
                                    {submitting ? "Saving..." : "Save Office"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
