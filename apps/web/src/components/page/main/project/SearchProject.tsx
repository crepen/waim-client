'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { KeyboardEvent, MouseEvent, useRef } from "react"

type SearchProjectBoxProp = {
    defaultKeyword?: string
}

export const SearchProjectBox = (prop: SearchProjectBoxProp) => {

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const inputRef = useRef<HTMLInputElement>(null);


    const applyKeyword = (keyword?: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (inputRef.current?.value) {
            params.set('keyword', keyword ?? "");
        }
        else {
            params.delete('keyword');
        }

        params.delete('page')


        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <div>
            <input
                type="text"
                ref={inputRef}
                onKeyUp={(evt) => evt.key === 'Enter' && applyKeyword(evt.currentTarget.value)}
                defaultValue={prop.defaultKeyword}
            />
            <button onClick={() => applyKeyword(inputRef.current?.value)}>
                Search
            </button>
        </div>
    )
}