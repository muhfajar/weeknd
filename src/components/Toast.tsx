import React, {useEffect} from 'react';
import {CheckCircle2, X} from 'lucide-react';
import {motion, AnimatePresence} from 'motion/react';

interface ToastProps {
    message: string | null;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({message, onClose, duration = 3000}) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [message, onClose, duration]);

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{opacity: 0, y: 20, scale: 0.95}}
                    animate={{opacity: 1, y: 0, scale: 1}}
                    exit={{opacity: 0, y: 10, scale: 0.95}}
                    className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl text-zinc-100 text-sm font-mono"
                >
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0"/>
                    <span>{message}</span>
                    <button
                        onClick={onClose}
                        className="ml-2 p-1 text-zinc-400 hover:text-zinc-200 transition-colors rounded-md"
                        aria-label="Close toast"
                    >
                        <X className="w-3.5 h-3.5"/>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};