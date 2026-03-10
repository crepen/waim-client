'use client'

import { useRouter } from 'next/navigation';

type NotFoundBackButtonProps = {
    label: string;
    fallbackHref: string;
    className?: string;
}

export const NotFoundBackButton = ({ label, fallbackHref, className }: NotFoundBackButtonProps) => {
    const router = useRouter();

    const handleClick = () => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back();
            return;
        }

        router.push(fallbackHref);
    };

    return (
        <button type='button' onClick={handleClick} className={className}>
            {label}
        </button>
    );
};
