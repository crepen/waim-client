'use client'

import { DomUtil } from "@crepen/util"
import { Box, Button, Card, Flex, Group, Text } from "@mantine/core"
import { SearchProjectBox } from "./SearchProjectBox"
import Link from "next/link"
import { PiPlus } from "react-icons/pi"
import type { GroupData } from "@waim/api"
import { useTranslations } from "next-intl"

type SearchProjectHeaderProps = {
    className?: string,
    search?: {
        defaultKeyword?: string
        defaultGroupUid?: string
    },
    groups?: GroupData[]
}

export const SearchProjectHeader = (prop: SearchProjectHeaderProps) => {
    const t = useTranslations('main.project');

    return (
        <Card
            withBorder
            className={DomUtil.joinClassName("search-project-header", prop.className)}
        >
            <Flex
                justify='space-between'
                wrap={'wrap'}
                align={'center'}
                gap='sm'
            >
                <Box>
                    <Text fw={700}>{t('search_title')}</Text>
                    <Text size='sm' c='dimmed'>{t('search_desc')}</Text>
                </Box>
                <Group>
                    <Button
                        component={Link}
                        href={'/project/add'}
                        leftSection={<PiPlus />}
                        size='xs'
                    >
                        {t('add_project')}
                    </Button>
                </Group>
            </Flex>
            <SearchProjectBox
                defaultKeyword={prop.search?.defaultKeyword}
                defaultGroupUid={prop.search?.defaultGroupUid}
                groups={prop.groups}
            />
        </Card>
    )
}