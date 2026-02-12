"use client";

import React, { useEffect } from 'react';

export interface ToastMessage {
    id: string;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
}

interface ToastProps {
    toast: ToastMessage;
    onClose: (id: string) => void;
}

const Toast = ({ toast, onClose }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(toast.id);
        }, 3000);
        return () => clearTimeout(timer);
    }, [toast.id, onClose]);

    const bgMap = {
        success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        info: 'bg-primary/10 border-primary/30 text-primary',
        warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        error: 'bg-red-500/10 border-red-500/30 text-red-400'
    };

    const iconMap = {
        success: 'check_circle',
        info: 'info',
        warning: 'warning',
        error: 'error'
    };

    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl animate-in slide-in-from-right-10 fade-in duration-300 ${bgMap[toast.type]}`}>
            <span className="material-icons text-lg">{iconMap[toast.type]}</span>
            <p className="text-sm font-medium">{toast.message}</p>
            <button
                onClick={() => onClose(toast.id)}
                className="ml-2 hover:opacity-70 transition-opacity"
            >
                <span className="material-icons text-sm">close</span>
            </button>
        </div>
    );
};

export default Toast;
