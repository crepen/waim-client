'use client'

import './page-container.scss';

import { DomUtil } from "@crepen/util";
import { Box, BoxProps, MantineStyleProp, ScrollArea } from "@mantine/core";
import { PropsWithChildren, useLayoutEffect, useRef, useState, createContext, useContext } from "react";

type HeaderHeightContextType = {
    setHeaderRef: (el: HTMLElement | null) => void;
    contentHeight?: number | null;
}


// 헤더 높이 정보를 전달하기 위한 컨텍스트
const HeaderHeightContext = createContext<HeaderHeightContextType>({
    setHeaderRef: () => { },
});

interface MainContentProps extends PropsWithChildren {
    style?: MantineStyleProp;
}

export const MainContainer = ({ children, style }: MainContentProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [headerEl, setHeaderEl] = useState<HTMLElement | null>(null);


    useLayoutEffect(() => {
        if(!containerRef.current) {
            return;
        }

        const updateHeight = () => {
            const height = containerRef.current?.offsetHeight;
            containerRef.current?.style.setProperty("--crp-mch", `${height}px`);
        }

        const resizeObserver = new ResizeObserver(updateHeight)
        resizeObserver.observe(containerRef.current);

        updateHeight();

        return (() => {
            resizeObserver.disconnect()
        });
    }, [containerRef])



    useLayoutEffect(() => {
        if (!containerRef.current || !headerEl) {
            containerRef.current?.style.removeProperty("--crp-mchh");
            return;
        }

        const updateHeight = () => {
            const height = headerEl.offsetHeight;
            containerRef.current?.style.setProperty("--crp-mchh", `${height}px`);
        };

        const resizeObserver = new ResizeObserver(updateHeight);
        resizeObserver.observe(headerEl);

        updateHeight();

        return (() => {
            resizeObserver.disconnect()
        });
    }, [headerEl]);

    return (
        <HeaderHeightContext.Provider value={{ setHeaderRef: setHeaderEl }}>
            <Box
                ref={containerRef}
                className="crp-main-container"
                style={style}
            >
                {children}
            </Box>
        </HeaderHeightContext.Provider>
    );
};

interface MainContainerHeaderProps extends PropsWithChildren, BoxProps {
    className?: string;
}

export const MainContainerHeader = (prop: MainContainerHeaderProps) => {
    const { setHeaderRef } = useContext(HeaderHeightContext);

    return (
        <Box
            {...prop}
            ref={setHeaderRef} 
            className={DomUtil.joinClassName("crp-main-container-header", prop.className)}
        >
            {prop.children}
        </Box>
    );
};

export const MainContainerContent = (prop: PropsWithChildren) => {
    return (
        <Box
            className="crp-main-container-content"
        >
            {prop.children}
        </Box>
    );
};

export const MainContainerScrollContent = (prop: PropsWithChildren) => {
    return (
        <ScrollArea
            type='auto'
            className="crp-main-container-content"
        >
            {prop.children}
        </ScrollArea>
    );
};