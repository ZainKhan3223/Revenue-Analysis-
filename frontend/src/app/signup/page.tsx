"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate a brief signup delay
        setTimeout(() => {
            router.push('/');
        }, 800);
    };

    return (
        <div className="bg-background-dark min-h-screen flex flex-col items-center justify-center p-4 [background-image:radial-gradient(at_0%_0%,_rgba(13,127,242,0.12)_0px,_transparent_50%),radial-gradient(at_100%_100%,_rgba(57,255,20,0.05)_0px,_transparent_50%)]">
            <header className="mb-10 text-center">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-11 h-11 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-white text-2xl">rocket_launch</span>
                    </div>
                    <span className="text-3xl font-bold tracking-tight text-white">Project</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">Optimize Your Revenue.</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm md:text-base">Experience the next generation of financial intelligence for high-growth small businesses.</p>
            </header>

            <main className="w-full max-w-md">
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                    <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Business Name</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">corporate_fare</span>
                                <input className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder:text-slate-600 text-white" placeholder="Acme Inc." type="text" required />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Work Email</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">alternate_email</span>
                                <input className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder:text-slate-600 text-white" placeholder="ceo@company.com" type="email" required />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">encrypted</span>
                                <input className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder:text-slate-600 text-white" placeholder="••••••••" type="password" required />
                            </div>
                        </div>

                        <button
                            disabled={isLoading}
                            className="w-full py-4 px-4 bg-neon-green text-black font-bold rounded-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4 shadow-lg shadow-neon-green/10 disabled:opacity-50"
                        >
                            {isLoading ? 'Creating Account...' : 'Start Free Trial'}
                            {!isLoading && <span className="material-symbols-outlined text-xl">arrow_forward</span>}
                        </button>
                    </form>

                    <div className="my-8 flex items-center gap-4 text-white">
                        <div className="h-[1px] flex-1 bg-slate-800"></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">or continue with</span>
                        <div className="h-[1px] flex-1 bg-slate-800"></div>
                    </div>

                    <button className="w-full py-3 px-4 bg-transparent border border-slate-700/60 rounded-xl text-sm font-semibold hover:bg-slate-800/50 transition-all flex items-center justify-center gap-3 text-white">
                        <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtXCd6EjTXqwiKYPxd_AUJgT4VmQEU9DR24ubV7lidjew-LCmHAeVDCVJowS-pJy0vG_FjvNAGLssd8oedrJuo9oBGt7dcnnyASK1jNGiQPJYwBt3jwhvF8IJCs13sDWEN0BCfu0HiF5zutm9cgAizcS2XRtUYOYBSvgm-5UBUpULEr5ykjOHVwsj_ck1wPrKJk1XmArGz85_nRW4TMZOIPR_XpWGuR-LHGzZ-850PQXXctjZBC2epsCShByZHqmd-iCmR4Z9f6Rc"
                            alt="Google"
                            width={20}
                            height={20}
                        />
                        Google
                    </button>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Already registered? <a className="text-primary hover:text-blue-400 transition-colors font-semibold" href="/login">Sign in</a>
                    </p>
                </div>
            </main>
        </div>
    );
}
