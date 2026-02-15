'use server'

import '../../../../../assets/styles/pages/project/project.main.page.scss'
import { BaseTable, } from "@/components/global/control/BaseTable";
import { BasePagination } from '@/components/global/control/Pagination';
import { SubPageTemplate } from "@/components/page/main/global/SubPageTemplate";
import { SearchProjectBox } from '@/components/page/main/project/SearchProject';
import authConfig from "@/config/auth/AuthConfig";
import { AuthProvider } from "@crepen/auth";
import { ProjectApiProvider } from '@waim/api'
import { getLocale } from "next-intl/server";
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
            <div className='project-search'>

                <SearchProjectBox
                    defaultKeyword={searchParam.keyword}
                />

                <Link href={'/project/add'}>
                    ADD PROJECT
                </Link>
            </div>
            <div className="project-list">
                {
                    (resultData.data ?? []).map(project => (
                        <Link 
                            key={project.uid}
                            href={`/project/${project.project_alias}`}
                            className='project-item'
                        >
                            <div className='item-alias'>
                                {project.project_alias}
                            </div>
                            <div className='item-name'>
                                {project.project_name}
                            </div>
                            <div className='item-owner-name'>
                                {project.project_owner_name}
                            </div>
                            <div className='item-action'>
                                ACTION
                            </div>
                        </Link>
                    ))
                }
                {
                    (resultData.data ?? []).length === 0 &&
                    <div className='no-data'>
                        NO DATA
                    </div>
                }
            </div>
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