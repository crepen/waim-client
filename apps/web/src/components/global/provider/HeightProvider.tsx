'use client'

import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

type GlobalHeightContextType = {
    height: number | undefined;
}

const GlobalHeightContext = createContext<GlobalHeightContextType | undefined>(undefined);


interface GlobalHeightProviderProps extends PropsWithChildren {
    customPropertyName?: string
}

export const GlobalHeightProvider = (prop: GlobalHeightProviderProps) => {
    const [height, setHeight] = useState<number | undefined>(undefined);

    useEffect(() => {
        const updateHeight = () => {
            const currentHeight = window.innerHeight;
            setHeight(currentHeight);

            document.documentElement.style.setProperty(
                `--${prop.customPropertyName ?? "gwh"}`,
                `${currentHeight}px`
            );
        };

        updateHeight();
        window.addEventListener("resize", updateHeight);

        return () => {
            window.removeEventListener("resize", updateHeight);
            document.documentElement.style.removeProperty(
                `--${prop.customPropertyName ?? "gwh"}`
            );
        };
    }, []);

    return (
        <GlobalHeightContext.Provider value={{ height }}>
            {prop.children}
        </GlobalHeightContext.Provider>
    );
};

export const useGlobalHeight = () => {
    const context = useContext(GlobalHeightContext);
    if (!context) {
        throw new Error('useGlobalHeight must be used within a GlobalHeightProvider');
    }
    return context;
};