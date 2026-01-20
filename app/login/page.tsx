"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent, customCredentials?: { e: string; p: string }) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError("");

        const loginEmail = customCredentials?.e || email;
        const loginPassword = customCredentials?.p || password;

        // Simulate authentication with temporary credentials
        setTimeout(() => {
            if (loginEmail === "admin@123.com" && loginPassword === "admin123") {
                localStorage.setItem("userRole", "admin");
                localStorage.setItem("userName", "Admin User");
                localStorage.setItem("userEmail", "admin@123.com");
                router.push("/dashboard");
            } else if (loginEmail === "clerk@123.com" && loginPassword === "clerk123") {
                localStorage.setItem("userRole", "clerk");
                localStorage.setItem("userName", "Clerk User");
                localStorage.setItem("userEmail", "clerk@123.com");
                router.push("/dashboard");
            } else {
                setError("Invalid credentials. Please use the temporary logins.");
                setLoading(false);
            }
        }, 800);
    };

    const quickLogin = (role: 'admin' | 'clerk') => {
        const credentials = role === 'admin'
            ? { e: "admin@123.com", p: "admin123" }
            : { e: "clerk@123.com", p: "clerk123" };

        setEmail(credentials.e);
        setPassword(credentials.p);
        // @ts-ignore - passing null for event
        handleLogin(null, credentials);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fafafa] p-4 font-sans">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--primary)] mb-6 shadow-sm">
                        <div className="w-8 h-8 bg-slate-900 rounded-md" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
                    <p className="text-slate-500 mt-2">Sign in to manage your records</p>
                </div>

                <div className="bg-white border border-[var(--border)] rounded-3xl p-8 shadow-sm">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2 px-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@123.com"
                                    className="pastel-input pl-12"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2 px-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="pastel-input pl-12"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full pastel-button py-3.5 flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <p className="text-xs text-slate-400 text-center uppercase tracking-widest font-bold mb-4">
                            Quick Access (Click to Enter)
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => quickLogin('admin')}
                                type="button"
                                className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 hover:border-slate-200 transition-all text-left"
                            >
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Admin</p>
                                <p className="text-[11px] text-slate-400 truncate">admin@123.com</p>
                            </button>
                            <button
                                onClick={() => quickLogin('clerk')}
                                type="button"
                                className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 hover:border-slate-200 transition-all text-left"
                            >
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Clerk</p>
                                <p className="text-[11px] text-slate-400 truncate">clerk@123.com</p>
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-8 text-sm text-slate-400">
                    Inward-Outward Management System &copy; 2026
                </p>
            </div>
        </div>
    );
}
