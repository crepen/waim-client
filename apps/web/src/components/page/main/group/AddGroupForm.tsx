'use client'

import { AddGroupAction } from '@/libs/actions/GroupAction';
import type { GroupData } from '@waim/api';
import { Box, Button, Card, Group, Stack, Text, TextInput } from '@mantine/core';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

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

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const formData = new FormData(e.currentTarget);
        const result = await AddGroupAction(formData);

        if (!result.state) {
            toast.error(result.message ?? t('create_failed'));
            return;
        }

        toast.success(result.message ?? t('created'));
        const createdGroupUid = result.data?.groupUid;
        window.location.assign(createdGroupUid ? `/${locale}/group/${createdGroupUid}?group_alias=${encodeURIComponent(groupAlias.trim())}` : `/${locale}/group`);
    };

    const canSubmit = groupName.trim().length > 0 && groupAlias.trim().length > 0;

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
                    </Box>
                    <Group justify="flex-end">
                        <Button type="submit" disabled={!canSubmit}>{t('create_group')}</Button>
                    </Group>
                </Stack>
            </Box>
        </Card>
    );
};
