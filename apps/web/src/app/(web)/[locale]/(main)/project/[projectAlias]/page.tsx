'use server'

import authConfig from "@/config/auth/AuthConfig";
import { AuthProvider } from "@crepen/auth";
import { ActionIcon, Anchor, Box, Card, Flex, Grid, GridCol, Group, NavLink, SimpleGrid, Space, Title, Typography } from "@mantine/core";
import { ProjectApiProvider } from "@waim/api";
import { getLocale } from "next-intl/server";
import type { ProjectData, CommonApiResult } from "@waim/api/types";
import { GitLabConnCard } from "@/components/page/main/project/detail/GitLabConnCard";
import { MainContainer, MainContainerHeader, MainContainerScrollContent } from "@/components/layout/common/page-container/PageContainer";
import { TriggerOff, TriggerOn, TriggerProvider } from "@/components/global/provider/TriggerProvider";
import { SlSettings } from "react-icons/sl";
import Link from "next/link";

type ProjectDetailPageProp = {
    params: Promise<{ projectAlias: string }>
}

const ProjectDetailPage = async (prop: ProjectDetailPageProp) => {
    const param = await prop.params;
    const locale = await getLocale();

    const session = await AuthProvider.setConfig(
        authConfig(locale, '')
    ).getSession();


    const resultData = await ProjectApiProvider.getProjectDetail(
        (session?.user?.id ?? ""),
        param.projectAlias,
        {
            locale: locale,
            token: (session?.token?.accessToken ?? "")
        }
    )


    return (
        <MainContainer>
            <MainContainerHeader>
                <Group justify="space-between">
                    <Title order={5}>
                        {resultData.data?.project_name ?? "Project Detail"}
                    </Title>

                    <ActionIcon
                        variant="white"
                        component={'a'}
                        href={`/project/${param.projectAlias}/setting`}
                    >
                        <SlSettings />
                    </ActionIcon>
                </Group>
            </MainContainerHeader>
            <MainContainerScrollContent>
                <Space h={10} />

                <TriggerProvider
                    isOn={resultData.state}
                >
                    <TriggerOn>
                        {/* API SUCCESS */}
                        <Box
                            flex={1}
                        >
                            <ProjectDetailContent />
                        </Box>
                    </TriggerOn>
                    <TriggerOff>
                        {/* API ERROR */}
                        <Flex>
                            {resultData.message ?? 'Error Message'}
                        </Flex>
                    </TriggerOff>
                </TriggerProvider>
            </MainContainerScrollContent>
        </MainContainer >

    )
}

export default ProjectDetailPage;




type ProjectDetailContentProps = {
    data?: CommonApiResult<ProjectData>
}

const ProjectDetailContent = (prop: ProjectDetailContentProps) => {



    return (
        <SimpleGrid
            spacing={'md'}
            px={10}
            cols={3}
        >
            <Card
                withBorder
                shadow="md"
            >
                1
            </Card>
            {/* <GitLabConnCard /> */}
            <Card
                withBorder
                shadow="md"
            >
                1
            </Card>
            <Card
                withBorder
                shadow="md"
            >
                1
            </Card>
        </SimpleGrid>
    )
}