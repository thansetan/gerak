import { useRouter } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { APP_CONFIG } from '../../shared/config';

interface AnnouncementModalProps {
    onClose?: () => void;
}

/**
 * Announcement dialog shown on first load (per browser session).
 *
 * Behavior: shows once when the app mounts; dismissing it hides it for the
 * rest of the session (survives rerenders/navigation) but it reappears on a
 * full page refresh. Controlled by APP_CONFIG.announcement.
 */
export function AnnouncementModal({ onClose }: AnnouncementModalProps) {
    const announcement = APP_CONFIG.announcement;
    const [dismissed, setDismissed] = useState(false);
    const router = useRouter();

    const shown =
        announcement?.shown === true &&
        !dismissed &&
        router.state.location.pathname === '/';

    function handleClose() {
        setDismissed(true);
        onClose?.();
    }

    useEffect(() => {
        if (!shown) return;
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') handleClose();
        }
        document.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shown]);

    if (!shown) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
        >
            <motion.div
                className="absolute inset-0 bg-bg/90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            />
            <motion.div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto border-2 border-border bg-surface"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
                <div className="h-1.5 w-full bg-accent" />
                <div className="flex items-start justify-between p-5 pb-3 border-b-2 border-border">
                    <h2 className="font-mono text-lg font-bold text-text leading-snug pr-4">
                        {announcement?.title ?? 'Announcement'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="font-mono text-sm text-text-muted hover:text-text transition-colors cursor-pointer px-1 py-0.5 border-2 border-transparent hover:border-border shrink-0"
                        aria-label="Close"
                    >
                        ESC
                    </button>
                </div>
                <div className="p-5">
                    <p className="font-mono text-sm text-text-muted whitespace-pre-line leading-relaxed">
                        {announcement?.message}
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
