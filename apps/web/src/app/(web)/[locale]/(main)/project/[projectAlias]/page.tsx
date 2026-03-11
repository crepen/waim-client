'use server'

import authConfig from "@/config/auth/AuthConfig";
import { AuthProvider } from "@crepen/auth";
import { ProjectJobMonitoringPanel } from "@/components/page/main/project/ProjectJobMonitoringPanel";
import { ActionIcon, Box, Button, Card, Flex, Grid, GridCol, Group, SimpleGrid, Space, Stack, Text, Title } from "@mantine/core";
import { ProjectApiProvider } from "@waim/api";
import { getLocale, getTranslations } from "next-intl/server";
import type { ProjectData } from "@waim/api/types";
import { MainContainer, MainContainerHeader, MainContainerScrollContent } from "@/components/layout/common/page-container/PageContainer";
import { TriggerOff, TriggerOn, TriggerProvider } from "@/components/global/provider/TriggerProvider";
import { SlClock } from "react-icons/sl";
import { SlSettings } from "react-icons/sl";

type ProjectDetailPageProp = {
    params: Promise<{ projectAlias: string }>
}

const ProjectDetailPage = async (prop: ProjectDetailPageProp) => {
    const param = await prop.params;
    const locale = await getLocale();
    const t = await getTranslations('main.project');

    const session = await AuthProvider.setConfig(
        authConfig(locale, '')
    ).getSession();


    const resultData = await ProjectApiProvider.getProjectDetail(
        param.projectAlias,
        {
            locale: locale,
            token: (session?.token?.accessToken ?? "")
        }
    )

    const jobsResult = resultData.data?.uid
        ? await ProjectApiProvider.searchProjectJobs(
            resultData.data.uid,
            { page: 0, size: 50 },
            {
                locale,
                token: (session?.token?.accessToken ?? "")
            }
        )
        : { state: false, message: t('job_load_failed') };

    const logsResult = resultData.data?.uid
        ? await ProjectApiProvider.searchProjectJobLogs(
            resultData.data.uid,
            { page: 0, size: 100 },
            {
                locale,
                token: (session?.token?.accessToken ?? "")
            }
        )
        : { state: false, message: t('job_log_load_failed') };


    return (
        <MainContainer>
            <MainContainerHeader>
                <Group justify="space-between">
                    <Title order={5}>
                        {resultData.data?.project_name ?? t('detail_fallback_title')}
                    </Title>
                    <Group gap='xs'>
                        <Button
                            variant='light'
                            leftSection={<SlClock />}
                            component={'a'}
                            href={`/project/${param.projectAlias}/job?project_alias=${encodeURIComponent(param.projectAlias)}`}
                        >
                            {t('job_page_button_label')}
                        </Button>
                        <ActionIcon
                            variant="white"
                            component={'a'}
                            href={`/project/${param.projectAlias}/setting?project_alias=${encodeURIComponent(param.projectAlias)}`}
                        >
                            <SlSettings />
                        </ActionIcon>
                    </Group>
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
                            <ProjectDetailContent
                                data={resultData.data}
                                jobs={jobsResult.data ?? []}
                                logs={logsResult.data ?? []}
                                t={t}
                            />
                        </Box>
                    </TriggerOn>
                    <TriggerOff>
                        {/* API ERROR */}
                        <Flex>
                            {resultData.message ?? t('api_list_error')}
                        </Flex>
                    </TriggerOff>
                </TriggerProvider>
            </MainContainerScrollContent>
        </MainContainer >

    )
}

export default ProjectDetailPage;




type ProjectDetailContentProps = {
    data?: ProjectData;
    jobs: import("@waim/api/types").ProjectJobData[];
    logs: import("@waim/api/types").ProjectJobLogData[];
    t: Awaited<ReturnType<typeof getTranslations>>;
}

const ProjectDetailContent = (prop: ProjectDetailContentProps) => {
    const data = {
        [prop.t('detail_project_alias')]: prop.data?.project_alias,
        [prop.t('detail_project_name')]: prop.data?.project_name,
        [prop.t('detail_project_owner')]: prop.data?.project_owner_name,
        [prop.t('detail_create_date')]: new Date(prop.data?.create_timestamp ?? 0).toString(),
        [prop.t('detail_update_date')]: new Date(prop.data?.update_timestamp ?? 0).toString(),
    }

    return (
        <Grid gutter={0}>
            <GridCol
                span={{ xl: 9, lg: 8, md: 8, sm: 6, xs: 12 }}
                mb={'md'}
            >
                <SimpleGrid
                    spacing={'md'}
                    px={10}
                    cols={{ xl: 3, lg: 2 , md: 2, sm: 1, xs: 1 }}
                >
                    <ProjectJobMonitoringPanel jobs={prop.jobs} logs={prop.logs} />
                </SimpleGrid>

            </GridCol>
            <GridCol span={{ xl: 3, lg: 4, md: 4, sm: 6, xs: 12 }}>
                <Stack
                    px={10}
                    gap={'md'}
                >
                    <Card
                        withBorder
                        shadow="md"
                    >
                        <Title order={6}>{prop.t('detail_info_title')}</Title>

                        <Space h={10} />

                        {
                            Object.entries(data).map(([label, value]) => (
                                <Group
                                    key={label}
                                    justify="space-between"
                                    wrap="nowrap"
                                >
                                    <Text size={'sm'}>
                                        {label}
                                    </Text>
                                    <Text size={'sm'}>
                                        {value ?? '-'}
                                    </Text>
                                </Group>
                            ))
                        }



                    </Card>
                </Stack>

            </GridCol>
        </Grid>
        // <SimpleGrid
        //     spacing={'md'}
        //     px={10}
        //     cols={3}
        // >
        //     <Card
        //         withBorder
        //         shadow="md"
        //     >
        //         1
        //     </Card>
        //     {/* <GitLabConnCard /> */}
        //     <Card
        //         withBorder
        //         shadow="md"
        //     >
        //         1
        //     </Card>
        //     <Card
        //         withBorder
        //         shadow="md"
        //     >
        //         1
        //     </Card>
        // </SimpleGrid>
    )
}