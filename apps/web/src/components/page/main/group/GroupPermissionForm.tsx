'use client'

import { AddGroupPermissionAction, RemoveGroupPermissionAction, UpdateGroupPermissionAction } from '@/libs/actions/GroupPermissionAction';
import type { GroupPermissionData } from '@waim/api/types';
import type { GroupPermissionMetaData, GroupPermissionRole } from '@waim/api/types';
import { Badge, Box, Button, Card, Group, Select, Stack, Table, Text, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type GroupPermissionFormProps = {
    groupUid: string;
    permissions: GroupPermissionData[];
    permissionMeta: GroupPermissionMetaData[];
};

const normalizeGroupRole = (role?: string): GroupPermissionRole => {
    if (role === 'ROLE_GROUP_READ' || role === 'GENERAL') {
        return 'ROLE_GROUP_READ';
    }
    if (role === 'ROLE_GROUP_MODIFY' || role === 'EDITOR') {
        return 'ROLE_GROUP_MODIFY';
    }
    if (role === 'ROLE_GROUP_PROJECT_READ') {
        return 'ROLE_GROUP_PROJECT_READ';
    }
    if (role === 'ROLE_GROUP_PROJECT_MODIFY') {
        return 'ROLE_GROUP_PROJECT_MODIFY';
    }
    if (role === 'ROLE_GROUP_USER_READ') {
        return 'ROLE_GROUP_USER_READ';
    }
    return 'ROLE_GROUP_USER_MODIFY';
};

export const GroupPermissionForm = ({ groupUid, permissions, permissionMeta }: GroupPermissionFormProps) => {
    const t = useTranslations('main.group');
    const router = useRouter();
    const [userIdOrEmail, setUserIdOrEmail] = useState('');
    const [role, setRole] = useState<GroupPermissionRole>('ROLE_GROUP_READ');

    const roleOptions = permissionMeta.map((x) => ({
        value: x.role,
        label: `${x.display_name} - ${x.description}`
    }));

    const submitAdd = async (formData: FormData) => {
        const result = await AddGroupPermissionAction(formData);
        if (!result.state) {
            toast.error(result.message ?? t('permission_add_failed'));
            return;
        }

        toast.success(result.message ?? t('permission_added'));
        setUserIdOrEmail('');
        setRole('ROLE_GROUP_READ');
        router.refresh();
    };

    const updateRole = async (permissionUid: string, nextRole: GroupPermissionRole) => {
        const formData = new FormData();
        formData.set('group-uid', groupUid);
        formData.set('permission-uid', permissionUid);
        formData.set('role', nextRole);

        const result = await UpdateGroupPermissionAction(formData);

        if (!result.state) {
            toast.error(result.message ?? t('permission_update_failed'));
            return;
        }

        toast.success(result.message ?? t('permission_updated'));
        router.refresh();
    };

    const removePermission = async (permissionUid: string) => {
        const result = await RemoveGroupPermissionAction(groupUid, permissionUid);

        if (!result.state) {
            toast.error(result.message ?? t('permission_remove_failed'));
            return;
        }

        toast.success(result.message ?? t('permission_removed'));
        router.refresh();
    };

    return (
        <Card withBorder>
            <Stack gap="md">
                <Text fw={700}>{t('permission_title')}</Text>
                <Text size="sm" c="dimmed">{t('permission_desc')}</Text>
                <Badge variant="light" color="blue" w="fit-content">{t('permission_backend_managed')}</Badge>
                <Text size="sm" c="dimmed">{t('permission_role_desc_general')}</Text>
                <Text size="sm" c="dimmed">{t('permission_role_desc_editor')}</Text>
                <Text size="sm" c="dimmed">{t('permission_role_desc_admin')}</Text>

                <Box component="form" action={submitAdd}>
                    <Group align="end" grow>
                        <input type="hidden" name="group-uid" value={groupUid} />
                        <TextInput
                            name="user-id-or-email"
                            label={t('permission_user_label')}
                            placeholder={t('permission_user_placeholder')}
                            value={userIdOrEmail}
                            onChange={(e) => setUserIdOrEmail(e.currentTarget.value)}
                            required
                        />
                        <Select
                            name="role"
                            label={t('permission_role_label')}
                            value={role}
                            onChange={(v) => setRole((v as GroupPermissionRole) ?? 'ROLE_GROUP_READ')}
                            data={roleOptions}
                            allowDeselect={false}
                        />
                        <Button type="submit">{t('permission_add_button')}</Button>
                    </Group>
                </Box>

                <Table striped withTableBorder withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>{t('permission_col_user')}</Table.Th>
                            <Table.Th>{t('permission_col_role')}</Table.Th>
                            <Table.Th>{t('permission_col_action')}</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {permissions.map((item) => (
                            <Table.Tr key={item.uid}>
                                <Table.Td>{item.user_name ?? item.user_id ?? item.user_uid ?? '-'}</Table.Td>
                                <Table.Td>
                                    <Select
                                        value={normalizeGroupRole(item.role)}
                                        onChange={(v) => {
                                            const currentRole = normalizeGroupRole(item.role);
                                            const nextRole = (v as GroupPermissionRole) ?? currentRole;
                                            if (nextRole !== currentRole) {
                                                void updateRole(item.uid, nextRole);
                                            }
                                        }}
                                        data={roleOptions}
                                        allowDeselect={false}
                                    />
                                </Table.Td>
                                <Table.Td>
                                    <Button
                                        color="red"
                                        variant="light"
                                        onClick={() => {
                                            void removePermission(item.uid);
                                        }}
                                    >
                                        {t('permission_remove_button')}
                                    </Button>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                        {permissions.length === 0 && (
                            <Table.Tr>
                                <Table.Td colSpan={3}>
                                    <Text c="dimmed">{t('permission_empty')}</Text>
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </Stack>
        </Card>
    );
};
