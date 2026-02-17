'use server'

import '../../../../../assets/styles/pages/project/project.main.page.scss'
import { BaseTable, } from "@/components/global/control/BaseTable";
import { BasePagination } from '@/components/global/control/Pagination';
import { SubPageTemplate } from "@/components/page/main/global/SubPageTemplate";
import { ProjectListRaw } from '@/components/page/main/project/ProjectListRaw';
import { SearchProjectBox } from '@/components/page/main/project/SearchProjectBox';
import { SearchProjectHeader } from '@/components/page/main/project/SearchProjectHeader';
import authConfig from "@/config/auth/AuthConfig";
import { AuthProvider } from "@crepen/auth";
import { Badge, Box, Card, Center, Divider, Grid, Group, Pagination, Space, Text, Typography } from '@mantine/core';
import { ProjectApiProvider } from '@waim/api'
import { getLocale } from "next-intl/server";
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type ProjectMainPageProp = {
    searchParams: Promise<{ page?: number, keyword?: string }>
}

const ProjectMainPage = async (prop: ProjectMainPageProp) => {

    const locale = await getLocale();
    const searchParam = await prop.searchParams;

    const session = await AuthProvider.setConfig(
        authConfig(locale, '')
    ).getSession();


    const resultData = await ProjectApiProvider.searchProject(
        {
            page: (searchParam.page ?? 1) - 1,
            keyword: searchParam.keyword ?? "",
            size: 10
        },
        {
            locale: locale,
            token: session?.token?.accessToken ?? ""
        }
    )







    return (
        <SubPageTemplate
            pageTitle="Projects"
            className="project-page"
        >

            <SearchProjectHeader
                search={{
                    defaultKeyword: searchParam.keyword
                }}
            />

            <Space h={20} />


            <Divider />

            <Space h={20} />
            <div className="">
                {
                    (resultData.data ?? []).map(project => (
                        <ProjectListRaw
                            key={project.uid}
                            projectAlias={project.project_alias}
                            projectName={project.project_name}
                            projectOwnerName={project.project_owner_name}
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
                            <Typography>
                                데이터가 없습니다.
                            </Typography>
                        </Center>
                    </Box>
                }
            </div>

            <Space h={40} />    

            <BasePagination
                className='project-list-pagination'
                currentPage={searchParam.page ?? 1}
                totalPageCount={resultData.pageable?.total_page ?? 1}
                maxButtonCount={5}
            />

        </SubPageTemplate>
    )
}

export default ProjectMainPage;