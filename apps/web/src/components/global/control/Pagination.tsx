'use client'

import { DomUtil } from "@crepen/util";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

type BasePaginationProp = {
    className?: string;
    // totalElementCount : number;
    totalPageCount : number;
    currentPage : number;
    maxButtonCount? : number;
    
}

export const BasePagination = (prop : BasePaginationProp) => {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const currentPage = prop.currentPage || 1;

    const MAX_BUTTONS = prop.maxButtonCount || 5;

    let startPage = Math.max(1, currentPage - Math.floor(MAX_BUTTONS / 2));
    let endPage = startPage + MAX_BUTTONS - 1;

    if (endPage > prop.totalPageCount) {
        endPage = prop.totalPageCount;
        startPage = Math.max(1, endPage - MAX_BUTTONS + 1);
    }

    const handlePageChange = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', pageNumber.toString()); 
        
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className={DomUtil.joinClassName("pagination" , prop.className)}>
            {currentPage > 1 && (
                <button onClick={() => handlePageChange(currentPage - 1)}>Prev</button>
            )}

            {prop.totalPageCount !== 1 &&  Array.from({ length: (endPage - startPage) + 1 }, (_, i) => startPage + i).map((p) => (
                <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={DomUtil.joinClassName(
                        'num-button',
                        Number(currentPage) === Number(p) ? 'active' : ''
                    )}
                >
                    {p}
                </button>
                
            ))}

            {currentPage < prop.totalPageCount && (
                <button onClick={() => handlePageChange(Number(currentPage) + 1)}>Next</button>
            )}
        </div>
    )
}

