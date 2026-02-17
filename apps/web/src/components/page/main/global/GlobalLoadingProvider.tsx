'use client'

import { LoadingOverlay } from "@mantine/core";
import { useContext, useState } from "react";
import { createContext } from "react";

type GlobalLoadingContextType = {
    setLoadingState: (state: boolean) => void;
}



const LoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined);


export const GlobalLoadingProvider = (prop: { children: React.ReactNode }) => {

    const [loading, setLoading] = useState(false);

    const setLoadingState = (state: boolean) => {
        setLoading(state);
    }

    return (
        <LoadingContext.Provider value={{ setLoadingState }}>

            <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{ blur: 2 }}
                loaderProps={{ color: 'blue', type: 'bars' }}
            />

            {prop.children}
        </LoadingContext.Provider>
    )
}

export const useGlobalLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useGlobalLoading must be used within a LoadingProvider');
    }
    return context;
}