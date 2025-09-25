import { MdClose} from "react-icons/md";

interface Props {
    variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
    children: React.ReactNode;
}

const colors = {
    default: {
        bg: 'bg-gray-50',
        text: 'text-gray-800',
        border: 'border-gray-400',
    },
    success: {
        bg: 'bg-green-50',
        text: 'text-green-800',
        border: 'border-green-400',
    },
    error: {
        bg: 'bg-red-50',
        text: 'text-red-800',
        border: 'border-red-400',
    },
    warning: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-800',
        border: 'border-yellow-400',
    },
    info: {
        bg: 'bg-blue-50',
        text: 'text-blue-800',
        border: 'border-blue-400',
    },
};

export default function Alert({ variant = 'default', children }: Props) {
    return (
        <div className={`px-4 py-2 text-sm rounded flex items-center gap-3 border ${colors[variant].border} ${colors[variant].bg} ${colors[variant].text}`}>
            {children}
            <button className="cursor-pointer"><MdClose /></button>
        </div>
    );
}