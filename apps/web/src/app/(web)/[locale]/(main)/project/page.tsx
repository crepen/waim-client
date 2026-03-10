'use server'

import { BasePagination } from '@/components/global/control/Pagination';
import { MainContainer, MainContainerHeader, MainContainerScrollContent } from '@/components/layout/common/page-container/PageContainer';
import { ProjectListRaw } from '@/components/page/main/project/ProjectListRaw';
import { SearchProjectHeader } from '@/components/page/main/project/SearchProjectHeader';
import authConfig from "@/config/auth/AuthConfig";
import { AuthProvider } from "@crepen/auth";
import { Box, Center, Divider, Space, Text, Title } from '@mantine/core';
import { GroupApiProvider, ProjectApiProvider } from '@waim/api'
import { unstable_noStore as noStore } from 'next/cache';
import { getLocale, getTranslations } from "next-intl/server";

type ProjectMainPageProp = {
    searchParams: Promise<{ page?: number, keyword?: string, group_uid?: string }>
}

const ProjectMainPage = async (prop: ProjectMainPageProp) => {

    noStore();

    const locale = await getLocale();
    const t = await getTranslations('main.project');
    const searchParam = await prop.searchParams;

    const session = await AuthProvider.setConfig(
        authConfig(locale, '')
    ).getSession();


    const resultData = await ProjectApiProvider.searchProject(
        {
            page: (searchParam.page ?? 1) - 1,
            keyword: searchParam.keyword ?? "",
            groupUid: searchParam.group_uid ?? "",
            size: 10
        },
        {
            locale: locale,
            token: session?.token?.accessToken ?? ""
        }
    )

    const groupRes = await GroupApiProvider.searchGroup(
        {
            page: 0,
            size: 300
        },
        {
            locale,
            token: session?.token?.accessToken ?? ""
        }
    )

    const groupNameMap = new Map((groupRes.data ?? []).map(group => [group.uid, group.group_name]));







    return (
        <MainContainer>
            <MainContainerHeader>
                <Box>
                    <Title order={5}>
                        {t('title')}
                    </Title>
                    <Text c="dimmed">{t('description')}</Text>
                </Box>
            </MainContainerHeader>
            <MainContainerScrollContent>
                <Space h={10} />
                <SearchProjectHeader
                    search={{
                        defaultKeyword: searchParam.keyword,
                        defaultGroupUid: searchParam.group_uid
                    }}
                    groups={groupRes.data ?? []}
                />

                <Space h={20} />

                <Divider />

                <Space h={20} />
                <div className="">
                    {(resultData.state !== true || groupRes.state !== true) && (
                        <Box>
                            <Center mt={100}>
                                <Text c="dimmed">{t('api_list_error')}</Text>
                            </Center>
                        </Box>
                    )}

                    {(resultData.state === true && groupRes.state === true) && (
                        <>
                        {
                        (resultData.data ?? []).map(project => (
                            <ProjectListRaw
                                key={project.uid}
                                projectAlias={project.project_alias}
                                projectName={project.project_name}
                                projectOwnerName={project.project_owner_name}
                                groupUid={project.group_uid}
                                groupName={project.group_uid ? (groupNameMap.get(project.group_uid) ?? null) : t('root')}
                                projectUid={project.uid}
                            />
                        ))
                        }
                        {
                        (resultData.data ?? []).length === 0 &&
                        <Box>
                            <Center
                                mt={100}
                            >
                                <Text c="dimmed">{t('no_projects')}</Text>
                            </Center>
                        </Box>
                        }
                        </>
                    )}
                </div>

                <Space h={40} />

                <BasePagination
                    className='project-list-pagination'
                    currentPage={searchParam.page ?? 1}
                    totalPageCount={resultData.pageable?.total_page ?? 1}
                    maxButtonCount={5}
                />
            </MainContainerScrollContent>
        </MainContainer>

    )
}

export default ProjectMainPage;