"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Truck,
    MoreVertical,
    Mail,
    Phone,
    MapPin,
    ExternalLink
} from "lucide-react";

// Data fetching and states
const useCouriers = () => {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCouriers = async () => {
        try {
            const res = await fetch("/api/masters/courier");
            const data = await res.json();
            setCompanies(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCouriers();
    }, []);

    return { companies, loading, fetchCouriers };
};

export default function CourierMaster() {
    const router = useRouter();
    const { companies, loading, fetchCouriers } = useCouriers();
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        CourierCompanyName: "",
        ContactPersonName: "",
        DefaultRate: "",
        PhoneNo: "",
        Email: "",
        Address: ""
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
            const res = await fetch("/api/masters/courier", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setShowForm(false);
                fetchCouriers();
                setFormData({
                    CourierCompanyName: "",
                    ContactPersonName: "",
                    DefaultRate: "",
                    PhoneNo: "",
                    Email: "",
                    Address: ""
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
                        <Truck size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Master Directory</span>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Courier Master</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage your shipping partners and delivery rates.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="pastel-button flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800"
                >
                    <Plus size={20} />
                    Add Courier
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full p-20 text-center text-slate-400 font-bold">Loading courier partners...</div>
                ) : companies.length === 0 ? (
                    <div className="col-span-full p-20 text-center text-slate-400 font-bold">No courier partners found.</div>
                ) : companies.map((company) => (
                    <div key={company.CourierCompanyID} className="pastel-card hover:translate-y-[-4px] group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-[var(--primary)] text-slate-700 flex items-center justify-center shadow-sm">
                                <Truck size={28} />
                            </div>
                            <div className="flex gap-1">
                                <button className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-white transition-all">
                                    <Edit2 size={16} />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-1">{company.CourierCompanyName}</h3>
                        <p className="text-sm text-slate-500 font-medium mb-6">Contact: {company.ContactPersonName}</p>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                <Phone size={14} className="text-slate-400" />
                                {company.PhoneNo}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                <Mail size={14} className="text-slate-400" />
                                <span className="truncate">{company.Email}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Base Rate</span>
                            <span className="text-lg font-bold text-slate-900">₹{company.DefaultRate}</span>
                        </div>
                    </div>
                ))}

                <button
                    onClick={() => setShowForm(true)}
                    className="pastel-card border-dashed border-2 flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:bg-slate-50/50 transition-all min-h-[300px]"
                >
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <Plus size={24} />
                    </div>
                    <span className="font-bold text-sm uppercase tracking-widest">Add New Partner</span>
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] border border-[var(--border)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-slate-900">Configure Courier</h2>
                            <button onClick={() => setShowForm(false)} className="text-3xl text-slate-400 hover:text-slate-900">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Company Name</label>
                                    <input
                                        type="text"
                                        className="pastel-input"
                                        placeholder="e.g. Blue Dart"
                                        value={formData.CourierCompanyName}
                                        onChange={(e) => setFormData({ ...formData, CourierCompanyName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Contact Person</label>
                                    <input
                                        type="text"
                                        className="pastel-input"
                                        placeholder="Name"
                                        value={formData.ContactPersonName}
                                        onChange={(e) => setFormData({ ...formData, ContactPersonName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Base Rate (₹)</label>
                                    <input
                                        type="number"
                                        className="pastel-input"
                                        placeholder="0.00"
                                        value={formData.DefaultRate}
                                        onChange={(e) => setFormData({ ...formData, DefaultRate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="pastel-input"
                                        placeholder="+91"
                                        value={formData.PhoneNo}
                                        onChange={(e) => setFormData({ ...formData, PhoneNo: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Email Address</label>
                                    <input
                                        type="email"
                                        className="pastel-input"
                                        placeholder="contact@company.com"
                                        value={formData.Email}
                                        onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Full Address</label>
                                    <textarea
                                        className="pastel-input min-h-[80px]"
                                        placeholder="Office address..."
                                        value={formData.Address}
                                        onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-4 rounded-2xl border border-[var(--border)] font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-[2] py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all disabled:opacity-50"
                                >
                                    {submitting ? "Registering..." : "Register Partner"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
