'use server'

import authConfig from '@/config/auth/AuthConfig';
import { MainContainer, MainContainerHeader, MainContainerScrollContent } from '@/components/layout/common/page-container/PageContainer';
import { GroupResourceListPanel } from '@/components/page/main/group/GroupResourceListPanel';
import { AuthProvider } from '@crepen/auth';
import { ActionIcon, Alert, Group, Space, Title } from '@mantine/core';
import { GroupApiProvider, ProjectApiProvider } from '@waim/api';
import { getLocale, getTranslations } from 'next-intl/server';
import { SlSettings } from 'react-icons/sl';

type GroupDetailPageProp = {
    params: Promise<{ groupUid: string }>
}

const GroupDetailPage = async (prop: GroupDetailPageProp) => {
    const { groupUid } = await prop.params;
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

    const allGroups = allGroupResult.data ?? [];
    const resolvedGroup = allGroups.find((group) => group.uid === groupUid)
        ?? allGroups.find((group) => {
            const parentUid = group.parent_group_uid ?? '';
            return parentUid.length === 0 && (group.group_alias ?? '').toLowerCase() === groupUid.toLowerCase();
        });
    const resolvedGroupUid = resolvedGroup?.uid ?? groupUid;

    const groupResult = await GroupApiProvider.getGroupDetail(
        resolvedGroupUid,
        {
            locale,
            token: session?.token?.accessToken ?? ''
        }
    );

    const projectResult = await ProjectApiProvider.searchProject(
        {
            page: 0,
            size: 100,
            groupUid: resolvedGroupUid
        },
        {
            locale,
            token: session?.token?.accessToken ?? ''
        }
    );

    const data = groupResult.data;
    const byUid = new Map(allGroups.map((group) => [group.uid, group]));
    const currentGroupAliasPath: string[] = [];

    let currentUid: string | undefined = resolvedGroupUid;
    let guard = 0;

    while (currentUid && guard < 100) {
        const group = byUid.get(currentUid);

        if (!group) {
            break;
        }

        currentGroupAliasPath.unshift(group.group_alias ?? group.uid);
        currentUid = group.parent_group_uid ?? undefined;
        guard += 1;
    }

    const childGroups = (allGroupResult.data ?? [])
        .filter((group) => group.parent_group_uid === resolvedGroupUid)
        .sort((a, b) => (a.group_name ?? '').localeCompare(b.group_name ?? ''));
    const projects = projectResult.data ?? [];

    return (
        <MainContainer>
            <MainContainerHeader>
                <Group justify="space-between">
                    <Title order={5}>{data?.group_name ?? t('detail_default_title')}</Title>
                    <ActionIcon variant="white" component={'a'} href={`/group/${currentGroupAliasPath.map((x) => encodeURIComponent(x)).join('/')}/setting`}>
                        <SlSettings />
                    </ActionIcon>
                </Group>
            </MainContainerHeader>
            <MainContainerScrollContent>
                <Space h={10} />
                {(groupResult.state !== true || allGroupResult.state !== true || projectResult.state !== true) && (
                    <Alert color="orange" title={t('api_message_title')} mb="md">
                        {groupResult.state !== true
                            ? (groupResult.message ?? t('load_group_detail_error'))
                            : allGroupResult.state !== true
                                ? (allGroupResult.message ?? t('load_child_group_error'))
                                : (projectResult.message ?? t('load_projects_error'))}
                    </Alert>
                )}
                <GroupResourceListPanel
                    groupUid={resolvedGroupUid}
                    currentGroupAliasPath={currentGroupAliasPath}
                    childGroups={childGroups}
                    projects={projects}
                />
            </MainContainerScrollContent>
        </MainContainer>
    );
};

export default GroupDetailPage;
