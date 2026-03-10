'use server'

import { MainContainer, MainContainerHeader, MainContainerScrollContent } from '@/components/layout/common/page-container/PageContainer';
import { GroupManagePanel } from '@/components/page/main/group/GroupManagePanel';
import authConfig from '@/config/auth/AuthConfig';
import { AuthProvider } from '@crepen/auth';
import { Box, Space, Text, Title } from '@mantine/core';
import { GroupApiProvider } from '@waim/api';
import { getLocale, getTranslations } from 'next-intl/server';

const GroupPage = async () => {
    const locale = await getLocale();
    const t = await getTranslations('main.group');

    const session = await AuthProvider
        .setConfig(authConfig(locale, ''))
        .getSession();

    const groupResult = await GroupApiProvider.searchGroup(
        {
            page: 0,
            size: 300
        },
        {
            locale,
            token: session?.token?.accessToken ?? ''
        }
    );

    const topGroups = (groupResult.data ?? []).filter((group) => !group.parent_group_uid);

    return (
        <MainContainer>
            <MainContainerHeader>
                <Box>
                    <Title order={5}>{t('title')}</Title>
                    <Text c="dimmed">{t('description')}</Text>
                </Box>
            </MainContainerHeader>
            <MainContainerScrollContent>
                <Space h={12} />
                <GroupManagePanel
                    topGroups={topGroups}
                    hasApiError={groupResult.state !== true}
                />
            </MainContainerScrollContent>
        </MainContainer>
    );
};

export default GroupPage;
