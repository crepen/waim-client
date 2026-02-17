'use client'

import { DomUtil } from "@crepen/util"
import { Button, Flex, FocusTrap, Grid } from "@mantine/core"
import { SearchProjectBox } from "./SearchProjectBox"
import Link from "next/link"
import { PiPlus } from "react-icons/pi"

type SearchProjectHeaderProps = {
    className?: string,
    search?: {
        defaultKeyword?: string
    }
}

export const SearchProjectHeader = (prop: SearchProjectHeaderProps) => {
    return (
        <div
            className={DomUtil.joinClassName("search-project-header", prop.className)}
        >

            <Flex
                justify='space-between'
                wrap={'wrap'}
                align={'center'}
            >
                 <SearchProjectBox
                        defaultKeyword={prop.search?.defaultKeyword}
                    />
                     <Button
                        component={Link}
                        href={'/project/add'}
                        variant="white"
                        p={0}
                        leftSection={
                            <PiPlus />
                        }
                    >
                        ADD PROJECT
                    </Button>


            </Flex>
        </div>
    )
}