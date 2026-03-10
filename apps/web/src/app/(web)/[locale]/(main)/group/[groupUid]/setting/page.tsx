'use server'

import authConfig from '@/config/auth/AuthConfig';
import { MainContainer, MainContainerHeader, MainContainerScrollContent } from '@/components/layout/common/page-container/PageContainer';
import { AuthProvider } from '@crepen/auth';
import { Alert, Space, Title } from '@mantine/core';
import { GroupApiProvider } from '@waim/api';
import { getLocale, getTranslations } from 'next-intl/server';
import { GroupSettingForm } from '@/components/page/main/group/GroupSettingForm';

type GroupSettingPageProp = {
    params: Promise<{ groupUid: string }>
}

const GroupSettingPage = async (prop: GroupSettingPageProp) => {
    const { groupUid } = await prop.params;
    const locale = await getLocale();
    const t = await getTranslations('main.group');

    const session = await AuthProvider
        .setConfig(authConfig(locale, ''))
        .getSession();

    const groupResult = await GroupApiProvider.getGroupDetail(
        groupUid,
        {
            locale,
            token: session?.token?.accessToken ?? ''
        }
    );

    const groupsResult = await GroupApiProvider.searchGroup(
        {
            page: 0,
            size: 300
        },
        {
            locale,
            token: session?.token?.accessToken ?? ''
        }
    );

    const permissionResult = await GroupApiProvider.getGroupPermissions(
        groupUid,
        {
            locale,
            token: session?.token?.accessToken ?? ''
        }
    );

    const permissionMetaResult = await GroupApiProvider.getGroupPermissionMeta(
        {
            locale,
            token: session?.token?.accessToken ?? ''
        }
    );

    return (
        <MainContainer>
            <MainContainerHeader>
                <Title order={5}>{t('setting_title')}</Title>
            </MainContainerHeader>
            <MainContainerScrollContent>
                <Space h={10} />
                {(groupResult.state !== true || groupsResult.state !== true || permissionResult.state !== true || permissionMetaResult.state !== true) && (
                    <Alert color="orange" title={t('api_message_title')} mb="md">
                        {groupResult.state !== true
                            ? (groupResult.message ?? t('load_group_detail_error'))
                            : groupsResult.state !== true
                                ? (groupsResult.message ?? t('load_group_list_error'))
                                : permissionResult.state !== true
                                    ? (permissionResult.message ?? t('permission_load_failed'))
                                    : (permissionMetaResult.message ?? t('permission_load_failed'))}
                    </Alert>
                )}
                <GroupSettingForm
                    group={groupResult.data}
                    allGroups={groupsResult.data ?? []}
                    permissions={permissionResult.data ?? []}
                    permissionMeta={permissionMetaResult.data ?? []}
                />
            </MainContainerScrollContent>
        </MainContainer>
    );
};

export default GroupSettingPage;
