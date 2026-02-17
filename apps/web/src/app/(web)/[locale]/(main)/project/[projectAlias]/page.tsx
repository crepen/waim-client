'use server'

import { SubPageTemplate } from "@/components/page/main/global/SubPageTemplate";
import authConfig from "@/config/auth/AuthConfig";
import { AuthProvider } from "@crepen/auth";
import { ActionIcon, Box, Card, Center, Flex, Grid, GridCol, Group, Text, Title } from "@mantine/core";
import { ProjectApiProvider } from "@waim/api";
import { getLocale } from "next-intl/server";
import type { ProjectData, CommonApiResult } from "@waim/api/types";
import { VscDebugDisconnect } from "react-icons/vsc";
import { IoSettingsOutline } from "react-icons/io5";
import { UpdateGitLabIntegrationButton, UpdateGitLabIntegrationDrawer } from "@/components/page/main/project/detail/UpdateGitLabIntegration";
import { GitLabConnCard } from "@/components/page/main/project/detail/GitLabConnCard";

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
        <SubPageTemplate
            pageTitle={resultData.data?.project_name ?? "Project Detail"}
            className="project-detail-page"
        >
            {
                resultData.state === false &&
                <Flex>
                    {resultData.message}
                </Flex>
            }


            {
                resultData.state === true &&
                <ProjectDetailContent />
            }

        </SubPageTemplate>
    )
}

export default ProjectDetailPage;




type ProjectDetailContentProps = {
    data?: CommonApiResult<ProjectData>
}

const ProjectDetailContent = (prop: ProjectDetailContentProps) => {



    return (
        <Box>
            <Grid>
                <GridCol span={8}>
                    <Card
                        withBorder
                        shadow="md"
                    >
                        1
                    </Card>
                </GridCol>
                <GridCol span={4}>
                    <GitLabConnCard />
                </GridCol>
                <GridCol span={4}>
                    <Card
                        withBorder
                        shadow="md"
                    >
                        1
                    </Card>
                </GridCol>
            </Grid>



            
        </Box>
    )
}