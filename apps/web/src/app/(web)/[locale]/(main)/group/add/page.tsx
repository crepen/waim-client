'use server'

import { MainContainer, MainContainerHeader, MainContainerScrollContent } from '@/components/layout/common/page-container/PageContainer';
import { AddGroupForm } from '@/components/page/main/group/AddGroupForm';
import authConfig from '@/config/auth/AuthConfig';
import { AuthProvider } from '@crepen/auth';
import { Alert, Box, Space, Text, Title } from '@mantine/core';
import { GroupApiProvider } from '@waim/api';
import { getLocale, getTranslations } from 'next-intl/server';

type AddGroupPageProp = {
    searchParams: Promise<{ parent_group_uid?: string }>
}

const AddGroupPage = async (prop: AddGroupPageProp) => {
    const locale = await getLocale();
    const t = await getTranslations('main.group');
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

    const selectedParent = (groupRes.data ?? []).find((x) => x.uid === searchParams.parent_group_uid);

    return (
        <MainContainer>
            <MainContainerHeader>
                <Box>
                    <Title order={5}>{t('add_page_title')}</Title>
                    <Text c="dimmed">
                        {selectedParent
                            ? t('add_page_desc_with_parent', { parentName: selectedParent.group_name })
                            : t('add_page_desc_default')}
                    </Text>
                </Box>
            </MainContainerHeader>
            <MainContainerScrollContent>
                <Space h={12} />
                {groupRes.state !== true && (
                    <Alert color="orange" title={t('api_message_title')} mb="md">
                        {t('load_group_list_error')}
                    </Alert>
                )}
                <AddGroupForm
                    allGroups={groupRes.data ?? []}
                    initialParentGroupUid={searchParams.parent_group_uid}
                />
            </MainContainerScrollContent>
        </MainContainer>
    );
};

export default AddGroupPage;
