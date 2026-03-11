'use server'

import authConfig from '@/config/auth/AuthConfig';
import { MainContainer, MainContainerHeader, MainContainerScrollContent } from '@/components/layout/common/page-container/PageContainer';
import { GroupResourceListPanel } from '@/components/page/main/group/GroupResourceListPanel';
import { GroupSettingForm } from '@/components/page/main/group/GroupSettingForm';
import { AuthProvider } from '@crepen/auth';
import { ActionIcon, Alert, Group, Space, Title } from '@mantine/core';
import { GroupApiProvider, ProjectApiProvider } from '@waim/api';
import { getLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { SlSettings } from 'react-icons/sl';

const MAX_GROUP_DEPTH = 6;

type GroupDetailPageProp = {
    params: Promise<{ group_alias_path: string[] }>
}

const GroupDetailPage = async (prop: GroupDetailPageProp) => {
    const { group_alias_path } = await prop.params;
    const rawPath = (group_alias_path ?? []).map((x) => decodeURIComponent(x));
    const isSettingPage = rawPath.at(-1)?.toLowerCase() === 'setting';
    const aliasPath = isSettingPage ? rawPath.slice(0, -1) : rawPath;

    if (aliasPath.length === 0 || aliasPath.length > MAX_GROUP_DEPTH) {
        notFound();
    }

    const locale = await getLocale();
    const t = await getTranslations('main.group');

    const session = await AuthProvider
        .setConfig(authConfig(locale, ''))
        .getSession();

    const allGroupResult = await GroupApiProvider.searchGroup(
        {
            page: 0,
            size: 300
        },
        {
            locale,
            token: session?.token?.accessToken ?? ''
        }
    );

    let parentGroupUid: string | null = null;
    let matchedGroup = undefined;

    for (const alias of aliasPath) {
        matchedGroup = (allGroupResult.data ?? []).find((group) => {
            const groupParentUid = group.parent_group_uid ?? null;
            return (group.group_alias ?? '').toLowerCase() === alias.toLowerCase()
                && groupParentUid === parentGroupUid;
        });

        if (!matchedGroup?.uid) {
            notFound();
        }

        parentGroupUid = matchedGroup.uid;
    }

    const groupUid = matchedGroup?.uid ?? '';

    const groupResult = groupUid
        ? await GroupApiProvider.getGroupDetail(
            groupUid,
            {
                locale,
                token: session?.token?.accessToken ?? ''
            }
        )
        : {
            state: false,
            message: t('load_group_detail_error')
        };

    const projectResult = !isSettingPage && groupUid
        ? await ProjectApiProvider.searchProject(
            {
                page: 0,
                size: 100,
                groupUid
            },
            {
                locale,
                token: session?.token?.accessToken ?? ''
            }
        )
        : {
            state: false,
            message: t('load_projects_error')
        };

    const permissionResult = isSettingPage && groupUid
        ? await GroupApiProvider.getGroupPermissions(
            groupUid,
            {
                locale,
                token: session?.token?.accessToken ?? ''
            }
        )
        : {
            state: true,
            data: []
        };

    const permissionMetaResult = isSettingPage
        ? await GroupApiProvider.getGroupPermissionMeta(
            {
                locale,
                token: session?.token?.accessToken ?? ''
            }
        )
        : {
            state: true,
            data: []
        };

    const data = groupResult.data;
    const childGroups = (allGroupResult.data ?? [])
        .filter((group) => group.parent_group_uid === groupUid)
        .sort((a, b) => (a.group_name ?? '').localeCompare(b.group_name ?? ''));
    const projects = projectResult.data ?? [];

    return (
        <MainContainer>
            <MainContainerHeader>
                <Group justify="space-between">
                    <Title order={5}>{data?.group_name ?? t('detail_default_title')}</Title>
                    {!isSettingPage && (
                        <ActionIcon variant="white" component={'a'} href={`/group/${aliasPath.map((x) => encodeURIComponent(x)).join('/')}/setting`}>
                            <SlSettings />
                        </ActionIcon>
                    )}
                </Group>
            </MainContainerHeader>
            <MainContainerScrollContent>
                <Space h={10} />
                {(groupResult.state !== true
                    || allGroupResult.state !== true
                    || (!isSettingPage && projectResult.state !== true)
                    || (isSettingPage && permissionResult.state !== true)
                    || (isSettingPage && permissionMetaResult.state !== true)) && (
                    <Alert color="orange" title={t('api_message_title')} mb="md">
                        {groupResult.state !== true
                            ? (groupResult.message ?? t('load_group_detail_error'))
                            : allGroupResult.state !== true
                                ? (allGroupResult.message ?? t('load_child_group_error'))
                                : !isSettingPage && projectResult.state !== true
                                    ? (projectResult.message ?? t('load_projects_error'))
                                    : permissionResult.state !== true
                                        ? (permissionResult.message ?? t('permission_load_failed'))
                                        : (permissionMetaResult.message ?? t('permission_load_failed'))}
                    </Alert>
                )}
                {isSettingPage ? (
                    <GroupSettingForm
                        group={groupResult.data}
                        allGroups={allGroupResult.data ?? []}
                        permissions={permissionResult.data ?? []}
                        permissionMeta={permissionMetaResult.data ?? []}
                    />
                ) : (
                    <GroupResourceListPanel
                        groupUid={groupUid}
                        currentGroupAliasPath={aliasPath}
                        childGroups={childGroups}
                        projects={projects}
                    />
                )}
            </MainContainerScrollContent>
        </MainContainer>
    );
};

export default GroupDetailPage;
