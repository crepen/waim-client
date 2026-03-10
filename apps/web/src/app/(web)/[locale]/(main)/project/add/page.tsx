import { MainContainer, MainContainerHeader, MainContainerScrollContent } from '@/components/layout/common/page-container/PageContainer';
import { AddProjectForm } from "@/components/page/main/project/AddProjectForm";
import authConfig from "@/config/auth/AuthConfig";
import { AuthProvider } from "@crepen/auth";
import { Alert, Box, Space, Text, Title } from '@mantine/core';
import { GroupApiProvider } from "@waim/api";
import { getLocale, getTranslations } from "next-intl/server";

type AddProjectPageProp = {
    searchParams: Promise<{ group_uid?: string }>
}

const AddProjectPage = async (prop: AddProjectPageProp) => {
    const locale = await getLocale();
    const t = await getTranslations('main.project');
    const searchParams = await prop.searchParams;

    const session = await AuthProvider
        .setConfig(authConfig(locale, ''))
        .getSession();

    const groupRes = await GroupApiProvider.searchGroup(
        {
            page: 0,
            size: 300
        },
        {
            locale,
            token: session?.token?.accessToken ?? ''
        }
    );

    return (
        <MainContainer>
            <MainContainerHeader>
                <Box>
                    <Title order={5}>{t('add_page_title')}</Title>
                    <Text c="dimmed">{t('add_page_desc')}</Text>
                </Box>
            </MainContainerHeader>
            <MainContainerScrollContent>
                <Space h={12} />
                {groupRes.state !== true && (
                    <Alert color="orange" title={t('api_list_error')} mb="md">
                        {groupRes.message ?? t('load_group_error')}
                    </Alert>
                )}
                <AddProjectForm
                    groups={groupRes.data ?? []}
                    initialGroupUid={searchParams.group_uid}
                />
            </MainContainerScrollContent>
        </MainContainer>
    )
}

export default AddProjectPage;