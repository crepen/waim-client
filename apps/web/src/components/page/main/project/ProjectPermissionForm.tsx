'use client'

import { AddProjectPermissionAction, RemoveProjectPermissionAction } from '@/libs/actions/ProjectPermissionAction';
import type { ProjectPermissionData } from '@waim/api/types';
import type { ProjectPermissionMetaData, ProjectPermissionRole } from '@waim/api/types';
import { Badge, Box, Button, Card, Group, Select, Stack, Table, Text, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type ProjectPermissionFormProps = {
    projectUid: string;
    permissions: ProjectPermissionData[];
    permissionMeta: ProjectPermissionMetaData[];
};

const normalizeProjectRole = (role?: string): ProjectPermissionRole => {
    if (role === 'ROLE_PROJECT_READ' || role === 'GENERAL') {
        return 'ROLE_PROJECT_READ';
    }
    if (role === 'ROLE_PROJECT_MODIFY' || role === 'EDITOR') {
        return 'ROLE_PROJECT_MODIFY';
    }
    if (role === 'ROLE_PROJECT_USER_READ') {
        return 'ROLE_PROJECT_USER_READ';
    }
    if (role === 'ROLE_PROJECT_USER_MODIFY' || role === 'OWNER') {
        return 'ROLE_PROJECT_USER_MODIFY';
    }
    return 'ROLE_PROJECT_USER_MODIFY';
};

export const ProjectPermissionForm = ({ projectUid, permissions, permissionMeta }: ProjectPermissionFormProps) => {
    const t = useTranslations('main.project');
    const router = useRouter();
    const [userIdOrEmail, setUserIdOrEmail] = useState('');
    const [role, setRole] = useState<ProjectPermissionRole>('ROLE_PROJECT_READ');

    const roleOptions = permissionMeta.map((x) => ({
        value: x.role,
        label: `${x.display_name} - ${x.description}`
    }));

    const submitAdd = async (formData: FormData) => {
        const result = await AddProjectPermissionAction(formData);
        if (!result.state) {
            toast.error(result.message ?? t('permission_add_failed'));
            return;
        }

        toast.success(result.message ?? t('permission_added'));
        setUserIdOrEmail('');
        setRole('ROLE_PROJECT_READ');
        router.refresh();
    };

    const removePermission = async (permissionUid: string) => {
        const result = await RemoveProjectPermissionAction(projectUid, permissionUid);

        if (!result.state) {
            toast.error(result.message ?? t('permission_remove_failed'));
            return;
        }

        toast.success(result.message ?? t('permission_removed'));
        router.refresh();
    };

    const expandedPermissions = permissions.flatMap((item) => {
        const itemRole = (item.role ?? '') as string;
        const normalizedUserRole = normalizeProjectRole(itemRole);

        if (itemRole === 'OWNER') {
            return [
                'ROLE_PROJECT_READ',
                'ROLE_PROJECT_MODIFY',
                'ROLE_PROJECT_USER_READ',
                'ROLE_PROJECT_USER_MODIFY'
            ].map((role) => ({
                key: `${item.uid}-${role}`,
                uid: item.uid,
                userLabel: item.user_name ?? item.user_id ?? item.user_uid ?? '-',
                role: role as ProjectPermissionRole
            }));
        }

        if (itemRole === 'EDITOR') {
            return [
                'ROLE_PROJECT_READ',
                'ROLE_PROJECT_MODIFY'
            ].map((role) => ({
                key: `${item.uid}-${role}`,
                uid: item.uid,
                userLabel: item.user_name ?? item.user_id ?? item.user_uid ?? '-',
                role: role as ProjectPermissionRole
            }));
        }

        if (itemRole === 'GENERAL') {
            return [{
                key: `${item.uid}-ROLE_PROJECT_READ`,
                uid: item.uid,
                userLabel: item.user_name ?? item.user_id ?? item.user_uid ?? '-',
                role: 'ROLE_PROJECT_READ' as ProjectPermissionRole
            }];
        }

        return [{
            key: `${item.uid}-${normalizedUserRole}`,
            uid: item.uid,
            userLabel: item.user_name ?? item.user_id ?? item.user_uid ?? '-',
            role: normalizedUserRole
        }];
    });

    const roleLabelMap = new Map(roleOptions.map((x) => [x.value, x.label]));

    return (
        <Card withBorder>
            <Stack gap="md">
                <Text fw={700}>{t('permission_title')}</Text>
                <Text size="sm" c="dimmed">{t('permission_desc')}</Text>

                <Box component="form" action={submitAdd}>
                    <Group align="end" grow>
                        <input type="hidden" name="project-uid" value={projectUid} />
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
                            onChange={(v) => setRole((v as ProjectPermissionRole) ?? 'ROLE_PROJECT_READ')}
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
                        {expandedPermissions.map((item) => (
                            <Table.Tr key={item.key}>
                                <Table.Td>{item.userLabel}</Table.Td>
                                <Table.Td>
                                    {roleLabelMap.get(item.role) ?? item.role}
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
                        {expandedPermissions.length === 0 && (
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
