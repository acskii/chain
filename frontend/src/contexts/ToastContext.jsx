import { createContext, useState, useContext, useCallback } from 'react';
import ToastItem from '../components/general/ToastItem';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    // Stores all toasts
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = "info", persist = false) => {
        const id = Date.now(); // Unique ID for filtering
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-remove after 4 seconds
        if (!persist) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 4000);
        }
    }, []);
    
    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none">
                <div className="w-full max-w-2xl px-4 pt-4 flex flex-col gap-2">
                    {toasts.map((toast) => (
                        <ToastItem 
                            key={toast.id} 
                            toast={toast} 
                            onClose={() => removeToast(toast.id)} 
                        />
                    ))}
                </div>
            </div>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);