'use client'

import { AddGroupAction } from '@/libs/actions/GroupAction';
import type { GroupData } from '@waim/api';
import { Box, Button, Card, Group, Stack, Text, TextInput } from '@mantine/core';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

const MAX_GROUP_DEPTH = 6;

type AddGroupFormProps = {
    allGroups: GroupData[];
    initialParentGroupUid?: string;
}

export const AddGroupForm = ({ allGroups, initialParentGroupUid }: AddGroupFormProps) => {
    const t = useTranslations('main.group');
    const locale = useLocale();

    const [groupName, setGroupName] = useState('');
    const [groupAlias, setGroupAlias] = useState('');
    const parentGroupUid = initialParentGroupUid ?? '';

    const parentGroupName = useMemo(
        () => parentGroupUid ? (allGroups.find((x) => x.uid === parentGroupUid)?.group_name ?? parentGroupUid) : t('top_level'),
        [allGroups, parentGroupUid]
    );

    const buildAliasPathByUid = (uid: string) => {
        const aliasPath: string[] = [];
        const byUid = new Map(allGroups.map((x) => [x.uid, x]));

        let currentUid: string | undefined = uid;
        let guard = 0;

        while (currentUid && guard < 100) {
            const group = byUid.get(currentUid);

            if (!group) {
                break;
            }

            aliasPath.unshift(group.group_alias ?? group.uid);
            currentUid = group.parent_group_uid ?? undefined;
            guard += 1;
        }

        return aliasPath;
    };

    const parentDepth = parentGroupUid ? buildAliasPathByUid(parentGroupUid).length : 0;
    const isDepthLimitReached = parentDepth >= MAX_GROUP_DEPTH;

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const formData = new FormData(e.currentTarget);
        const result = await AddGroupAction(formData);

        if (!result.state) {
            toast.error(result.message ?? t('create_failed'));
            return;
        }

        if (isDepthLimitReached) {
            toast.error(`Maximum group depth is ${MAX_GROUP_DEPTH}.`);
            return;
        }

        toast.success(result.message ?? t('created'));
        const createdGroupAlias = groupAlias.trim();
        const parentAliasPath = parentGroupUid ? buildAliasPathByUid(parentGroupUid) : [];
        const targetAliasPath = [...parentAliasPath, createdGroupAlias].filter((x) => x.length > 0);
        const targetPath = targetAliasPath.map((x) => encodeURIComponent(x)).join('/');
        window.location.assign(targetPath ? `/${locale}/group/${targetPath}` : `/${locale}/group`);
    };

    const canSubmit = groupName.trim().length > 0 && groupAlias.trim().length > 0 && !isDepthLimitReached;

    return (
        <Card withBorder>
            <Box component="form" onSubmit={submit}>
                <input type="hidden" name="parent-group-uid" value={parentGroupUid} />

                <Stack>
                    <TextInput
                        name="group-name"
                        label={t('form_group_name')}
                        value={groupName}
                        onChange={(e) => setGroupName(e.currentTarget.value)}
                        required
                    />
                    <TextInput
                        name="group-alias"
                        label={t('form_group_alias')}
                        value={groupAlias}
                        onChange={(e) => setGroupAlias(e.currentTarget.value)}
                        required
                    />
                    <Box>
                        <Text size="sm" fw={500}>{t('form_parent_group')}</Text>
                        <Text size="sm" c="dimmed">{parentGroupName}</Text>
                        {isDepthLimitReached && (
                            <Text size="xs" c="red">Maximum group depth is {MAX_GROUP_DEPTH}.</Text>
                        )}
                    </Box>
                    <Group justify="flex-end">
                        <Button type="submit" disabled={!canSubmit}>{t('create_group')}</Button>
                    </Group>
                </Stack>
            </Box>
        </Card>
    );
};
