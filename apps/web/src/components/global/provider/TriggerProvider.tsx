'use client';

import { createContext, Fragment, PropsWithChildren, useContext, useState } from "react"

type TriggerContextType = {
    trigger: boolean;
}

export const TriggerContext = createContext<TriggerContextType>({
    trigger: false,
});

interface TriggerProviderProps extends PropsWithChildren {
    isOn: boolean;
}

export const TriggerProvider = (prop: TriggerProviderProps) => {

    return (
        <TriggerContext.Provider value={{
            trigger: prop.isOn ?? false
        }}>
            {prop.children}
        </TriggerContext.Provider>
    )
}



export const TriggerOn = (prop: PropsWithChildren) => {

    const triggetContext = useContext(TriggerContext);

    return triggetContext.trigger ? prop.children : undefined;
}

export const TriggerOff = (prop: PropsWithChildren) => {
    const triggetContext = useContext(TriggerContext);
    return !triggetContext.trigger ? prop.children : undefined;
}