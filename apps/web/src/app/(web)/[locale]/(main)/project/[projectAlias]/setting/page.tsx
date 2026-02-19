import { MainContainer, MainContainerContent, MainContainerHeader, MainContainerScrollContent } from "@/components/layout/common/page-container/PageContainer";
import { SubPageTemplate } from "@/components/page/main/global/SubPageTemplate";
import { Anchor, Box, Grid, GridCol, NavLink, ScrollArea, Space, Text, Title } from "@mantine/core";

const ProjectSettingPage = () => {

    return (
        <MainContainer>
            <MainContainerHeader>
            
                <Title order={5}>
                    Project Setting
                </Title>
            </MainContainerHeader>

            <MainContainerScrollContent>
                DS
                {
                    new Array(100).fill(0).map((_, idx) => (
                        <Text key={idx}>
                            Setting {idx + 1}
                        </Text>
                    ))
                }
            </MainContainerScrollContent>
        </MainContainer>
    )

}

export default ProjectSettingPage;