'use client'

import { UpdateGroupAction } from '@/libs/actions/GroupAction';
import { GroupPermissionForm } from './GroupPermissionForm';
import type { GroupData, GroupPermissionData, GroupPermissionMetaData } from '@waim/api/types';
import { Box, Button, Card, Divider, Group, Input, Modal, Space, Stack, Text, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

type GroupSettingFormProps = {
    group?: GroupData;
    allGroups: GroupData[];
    permissions: GroupPermissionData[];
    permissionMeta: GroupPermissionMetaData[];
}

export const GroupSettingForm = ({ group, allGroups, permissions, permissionMeta }: GroupSettingFormProps) => {
    const t = useTranslations('main.group');
    const router = useRouter();

    const [groupName, setGroupName] = useState(group?.group_name ?? '');
    const [groupAlias, setGroupAlias] = useState(group?.group_alias ?? '');
    const [parentGroupUid, setParentGroupUid] = useState(group?.parent_group_uid ?? '');
    const [pickerOpen, setPickerOpen] = useState(false);
    const [pickerSearch, setPickerSearch] = useState('');

    const parentGroupName = useMemo(
        () => parentGroupUid ? (allGroups.find((x) => x.uid === parentGroupUid)?.group_name ?? parentGroupUid) : t('root'),
        [allGroups, parentGroupUid]
    );

    const candidates = useMemo(() => {
        const term = pickerSearch.trim().toLowerCase();
        return allGroups
            .filter((x) => x.uid !== group?.uid)
            .filter((x) => !term || (x.group_name ?? '').toLowerCase().includes(term) || (x.group_alias ?? '').toLowerCase().includes(term))
            .sort((a, b) => (a.group_name ?? '').localeCompare(b.group_name ?? ''));
    }, [allGroups, group?.uid, pickerSearch]);

    const submit = async (formData: FormData) => {
        const result = await UpdateGroupAction(formData);

        if (!result.state) {
            toast.error(result.message ?? t('update_failed'));
            return;
        }

        toast.success(result.message ?? t('updated'));
        router.refresh();
    };

    return (
        <Stack gap="md">
            <Card withBorder>
                <Stack gap="xs">
                    <Box>
                        <Text size="xs" c="dimmed">{t('alias')}</Text>
                        <Text>{group?.group_alias ?? '-'}</Text>
                    </Box>
                    <Box>
                        <Text size="xs" c="dimmed">{t('parent')}</Text>
                        <Text>{group?.parent_group_uid ?? t('root')}</Text>
                    </Box>
                    <Group grow>
                        <Box>
                            <Text size="xs" c="dimmed">{t('child_groups')}</Text>
                            <Text>{group?.child_group_count ?? 0}</Text>
                        </Box>
                        <Box>
                            <Text size="xs" c="dimmed">{t('linked_projects')}</Text>
                            <Text>{group?.linked_project_count ?? 0}</Text>
                        </Box>
                    </Group>
                </Stack>
            </Card>

            <Card withBorder>
                <Box component="form" action={submit}>
                    <input type="hidden" name="group-uid" value={group?.uid ?? ''} />
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
                        <TextInput
                            label={t('form_parent_group')}
                            value={parentGroupName}
                            readOnly
                            rightSection={<Button type="button" size="xs" variant="light" onClick={() => setPickerOpen(true)}>{t('select')}</Button>}
                            rightSectionWidth={72}
                        />
                        <Group justify="flex-end">
                            <Button type="submit">{t('save_changes')}</Button>
                        </Group>
                    </Stack>
                </Box>
            </Card>

            {group?.uid && (
                <GroupPermissionForm
                    groupUid={group.uid}
                    permissions={permissions}
                    permissionMeta={permissionMeta}
                />
            )}

            <Modal opened={pickerOpen} onClose={() => setPickerOpen(false)} title={t('modal_select_parent')} size="lg">
                <Stack>
                    <Input
                        placeholder={t('modal_search_group')}
                        value={pickerSearch}
                        onChange={(e) => setPickerSearch(e.currentTarget.value)}
                    />
                    <Button variant="outline" onClick={() => { setParentGroupUid(''); setPickerOpen(false); }}>{t('set_root')}</Button>
                    <Divider />
                    <Stack gap="xs" mah={360} style={{ overflowY: 'auto' }}>
                        {candidates.map((item) => (
                            <Card withBorder key={item.uid}>
                                <Group justify="space-between">
                                    <Box>
                                        <Text fw={600}>{item.group_name}</Text>
                                        <Text size="xs" c="dimmed">{item.group_alias}</Text>
                                    </Box>
                                    <Button
                                        type="button"
                                        size="xs"
                                        onClick={() => {
                                            setParentGroupUid(item.uid);
                                            setPickerOpen(false);
                                        }}
                                    >
                                        {t('select')}
                                    </Button>
                                </Group>
                            </Card>
                        ))}
                        {candidates.length === 0 && <Text c="dimmed">{t('modal_no_groups')}</Text>}
                    </Stack>
                </Stack>
            </Modal>
        </Stack>
    );
};
