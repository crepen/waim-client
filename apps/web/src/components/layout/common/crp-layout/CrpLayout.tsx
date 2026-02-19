'use client'
import './crp-layout.scss';

import { DomUtil } from '@crepen/util';
import { Box, ScrollArea } from "@mantine/core";
import { createContext, PropsWithChildren, useContext, useLayoutEffect, useRef, useState } from "react";

type CrpLayoutContextType = {
    setHeaderRef?: (el: HTMLElement | null) => void;
    setContentRef?: (el: HTMLElement | null) => void;
    setNavRef?: (el: HTMLElement | null) => void;
}

const CrpLayoutContext = createContext<CrpLayoutContextType>({
    setHeaderRef: () => { },
    setContentRef: () => { },
    setNavRef: () => { },
});



interface CrpLayoutProps extends PropsWithChildren {
    className?: string;
}

export const CrpLayout = (prop: CrpLayoutProps) => {

    const layoutRef = useRef<HTMLDivElement>(null);
    const [headerElement, setHeaderElement] = useState<HTMLElement | null>(null);
    const [contentElement, setContentElement] = useState<HTMLElement | null>(null);
    const [navElement, setNavElement] = useState<HTMLElement | null>(null);

    useLayoutEffect(() => {

        console.log("Layout useLayoutEffect");

        const detectWindowHeight = () => {
            if (!layoutRef.current) {
                return;
            }

            const currentHeight = window.innerHeight;
            document.documentElement.style.setProperty("--crp-w-h", `${currentHeight}px`);
        }

        detectWindowHeight();
        window.addEventListener('resize', detectWindowHeight);

        return () => {
            window.removeEventListener('resize', detectWindowHeight);
        }
    }, [])

    useLayoutEffect(() => {
        if (!layoutRef.current || !headerElement) {
            return;
        }

        const updateHeight = () => {
            const headerHeight = headerElement.offsetHeight;
            document.documentElement.style.setProperty("--crp-hd-h", `${headerHeight}px`);
        }

        updateHeight();

        const resizeObserver = new ResizeObserver(updateHeight);
        resizeObserver.observe(headerElement);

        return () => {
            resizeObserver.disconnect();
        }
    }, [layoutRef, headerElement, navElement]);

    return (
        <CrpLayoutContext.Provider value={{
            setHeaderRef: setHeaderElement,
            setContentRef: setContentElement,
            setNavRef: setNavElement,
        }}>
            <Box
                className={DomUtil.joinClassName("crp-layout", prop.className)}
                ref={layoutRef}
            >
                {prop.children}
            </Box>
        </CrpLayoutContext.Provider>
    )
}

interface CrpLayoutHeaderProps extends PropsWithChildren {
    className?: string;
}

export const CrpLayoutHeader = (prop: CrpLayoutHeaderProps) => {

    const layoutContext = useContext(CrpLayoutContext);

    return (
        <Box
            className={DomUtil.joinClassName("crp-layout-header", prop.className)}
            ref={layoutContext.setHeaderRef}
        >
            {prop.children}
        </Box>
    )
}

interface CrpLayoutContentProps extends PropsWithChildren {
    className?: string;
}

export const CrpLayoutContent = (prop: CrpLayoutContentProps) => {


    return (
        <Box
            className={DomUtil.joinClassName("crp-layout-content", prop.className)}
        >
            {prop.children}
        </Box>
    )
}

interface CrpLayoutNavProps extends PropsWithChildren {
    className? : string
}

export const CrpLayoutNav = (prop: CrpLayoutNavProps) => {

    return (
        <Box 
            className={DomUtil.joinClassName("crp-layout-nav", prop.className)}
        >
            {prop.children}
        </Box>
    )
}
