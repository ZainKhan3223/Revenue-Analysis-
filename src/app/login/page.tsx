"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate a brief login delay
        setTimeout(() => {
            router.push('/');
        }, 800);
    };

    return (
        <div className="bg-background-dark font-display min-h-screen flex items-center justify-center [background:radial-gradient(circle_at_center,_#1a2a3a_0%,_#101922_100%)] text-slate-200">
            <div className="w-full max-w-md px-6 py-12">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 border border-primary/30">
                        <span className="material-icons text-primary text-3xl">insights</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tighter text-white">PRO<span className="text-primary">JECT</span></h1>
                    <p className="text-slate-400 text-sm mt-2">Revenue Optimization for Small Business</p>
                </div>

                <div className="bg-surface-dark/70 backdrop-blur-xl border border-white/5 rounded-xl p-8 shadow-2xl">
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-white">Sign In</h2>
                        <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-medium">Access your Project dashboard</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Work Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-icons text-slate-500 text-lg group-focus-within:text-primary transition-colors">alternate_email</span>
                                </div>
                                <input
                                    className="block w-full pl-10 pr-4 py-3 bg-background-dark/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-300"
                                    placeholder="name@company.com"
                                    type="email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                                <a className="text-xs text-primary hover:text-primary/80 transition-colors font-medium" href="#">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-icons text-slate-500 text-lg group-focus-within:text-primary transition-colors">lock_outline</span>
                                </div>
                                <input
                                    className="block w-full pl-10 pr-12 py-3 bg-background-dark/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-300"
                                    placeholder="••••••••"
                                    type="password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-primary to-accent-purple text-white font-semibold py-3.5 rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>{isLoading ? 'Connecting...' : 'Sign In to Project'}</span>
                            {!isLoading && <span className="material-icons text-sm">arrow_forward</span>}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col items-center space-y-4">
                        <p className="text-sm text-slate-400">Don&apos;t have a Project account?</p>
                        <button className="px-6 py-2 border border-slate-700 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors text-white">
                            Request Platform Access
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
