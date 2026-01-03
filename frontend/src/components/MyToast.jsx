import { Toast, ToastToggle } from "flowbite-react";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";

export default function MyToast({ type, message, onClose }) {
    const iconMap = {
        success: <HiCheck className="h-5 w-5" />,
        error: <HiX className="h-5 w-5" />,
        warning: <HiExclamation className="h-5 w-5" />,
    };

    const bgColorMap = {
        success: "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200",
        error: "bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200",
        warning: "bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200",
    };

    return (
        <div className="flex flex-col gap-4 fixed bottom-4 right-4 z-50">
            <Toast>
                <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bgColorMap[type]}`}>
                    {iconMap[type]}
                </div>
                <div className="ml-3 text-sm font-normal">{message}</div>
                <ToastToggle onDismiss={onClose} />
            </Toast>
            
        </div>
    );
}
