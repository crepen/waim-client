'use client'

import { Box, Button, CloseButton, Flex, FocusTrap, Grid, Group, Input } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, KeyboardEvent, MouseEvent, useRef, useState } from "react"

type SearchProjectBoxProp = {
    defaultKeyword?: string
}

export const SearchProjectBox = (prop: SearchProjectBoxProp) => {

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const inputRef = useRef<HTMLInputElement>(null);

    const [inputValue, setInputValue] = useState(prop.defaultKeyword || "");


    const applyKeyword = (keyword?: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (keyword) {
            params.set('keyword', keyword ?? "");
        }
        else {
            params.delete('keyword');
        }

        params.delete('page')


        router.push(`${pathname}?${params.toString()}`);
    }

    return (

        <FocusTrap active={true}>
            <Flex
                align='center'
                gap={'sm'}
            >
                <Box
                    w={400}
                >
                    <Input
                        placeholder="Search Project / Project Alias"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.currentTarget.value)}
                        onKeyUp={(evt) => evt.key === 'Enter' && applyKeyword(inputValue)}
                        rightSectionPointerEvents="all"
                        rightSection={
                            inputValue && <CloseButton
                                aria-label="Clear input"
                                onClick={() => {
                                    setInputValue('');
                                    applyKeyword('');
                                }}
                                style={{ display: inputValue ? undefined : 'none' }}
                            />
                        }
                    />
                </Box>

                <Button
                    onClick={() => applyKeyword(inputValue)}
                >
                    Search
                </Button>
            </Flex>
        </FocusTrap>

    )
}