'use server'

import { SubPageTemplate } from "@/components/page/main/global/SubPageTemplate";
import authConfig from "@/config/auth/AuthConfig";
import { AuthProvider } from "@crepen/auth";
import { ProjectApiProvider } from "@waim/api";
import { getLocale } from "next-intl/server";

type ProjectDetailPageProp = {
    params: Promise<{ projectAlias: string }>
}

const ProjectDetailPage = async (prop : ProjectDetailPageProp) => {
    const param = await prop.params;
     const locale = await getLocale();

    const session = await AuthProvider.setConfig(
        authConfig(locale, '')
    ).getSession();


    const resultData = await ProjectApiProvider.getProjectDetail(
        session?.user?.id ?? "",
        param.projectAlias,
        {
            locale: locale,
            token: (session?.token?.accessToken ?? "") 
        }
    )

    console.log(resultData);

    return (
        <SubPageTemplate
            pageTitle="Project Detail"
            className="project-detail-page"
        >
            {resultData.state !== true && resultData.message}
            {param.projectAlias}
        </SubPageTemplate>
    )
}

export default ProjectDetailPage;