'use client'

import {
    ApproveAdminUserAction,
    BlockAdminUserAction,
    DeleteAdminUserAction,
    UpdateAdminUserInfoAction,
    UpdateAdminUserPasswordAction,
    UpdateAdminUserRoleAction
} from '@/libs/actions/AdminUserAction';
import {
    Badge,
    Box,
    Button,
    Card,
    Divider,
    Group,
    NativeSelect,
    PasswordInput,
    Stack,
    Text,
    TextInput
} from '@mantine/core';
import type { AdminUserData } from '@waim/api/types';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

type AdminUserDetailFormProps = {
    user: AdminUserData;
}

export const AdminUserDetailForm = ({ user }: AdminUserDetailFormProps) => {
    const t = useTranslations('main.admin');
    const router = useRouter();
    const params = useParams<{ locale: string }>();
    const locale = params?.locale ?? 'ko';

    // Info edit state
    const [editingInfo, setEditingInfo] = useState(false);
    const [infoName, setInfoName] = useState(user.userName);
    const [infoEmail, setInfoEmail] = useState(user.email);
    const [infoMessage, setInfoMessage] = useState('');
    const [infoSuccess, setInfoSuccess] = useState<boolean | null>(null);
    const [infoLoading, setInfoLoading] = useState(false);

    // Password state
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pwMessage, setPwMessage] = useState('');
    const [pwSuccess, setPwSuccess] = useState<boolean | null>(null);
    const [pwLoading, setPwLoading] = useState(false);

    // Role state
    const [role, setRole] = useState(user.role);
    const [roleMessage, setRoleMessage] = useState('');
    const [roleSuccess, setRoleSuccess] = useState<boolean | null>(null);
    const [roleLoading, setRoleLoading] = useState(false);

    // Account action state
    const [actionMessage, setActionMessage] = useState('');
    const [actionSuccess, setActionSuccess] = useState<boolean | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const handleInfoSave = async () => {
        setInfoLoading(true);
        setInfoMessage('');
        setInfoSuccess(null);

        const formData = new FormData();
        formData.set('userName', infoName);
        formData.set('email', infoEmail);

        const result = await UpdateAdminUserInfoAction(user.uid, formData);
        setInfoMessage(result.message ?? '');
        setInfoSuccess(result.state === true);
        setInfoLoading(false);

        if (result.state) {
            setEditingInfo(false);
            router.refresh();
        }
    };

    const handleInfoCancel = () => {
        setInfoName(user.userName);
        setInfoEmail(user.email);
        setInfoMessage('');
        setInfoSuccess(null);
        setEditingInfo(false);
    };

    const handlePasswordSave = async () => {
        setPwLoading(true);
        setPwMessage('');
        setPwSuccess(null);

        const formData = new FormData();
        formData.set('password', newPassword);
        formData.set('confirmPassword', confirmPassword);

        const result = await UpdateAdminUserPasswordAction(user.uid, formData);
        setPwMessage(result.message ?? '');
        setPwSuccess(result.state === true);
        setPwLoading(false);

        if (result.state) {
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    const handleRoleSave = async () => {
        setRoleLoading(true);
        setRoleMessage('');
        setRoleSuccess(null);

        const result = await UpdateAdminUserRoleAction(user.uid, role);
        setRoleMessage(result.message ?? '');
        setRoleSuccess(result.state === true);
        setRoleLoading(false);

        if (result.state) {
            router.refresh();
        }
    };

    const runAccountAction = async (action: 'approve' | 'block' | 'delete') => {
        const confirmed = window.confirm(
            action === 'approve'
                ? t('user_action_confirm_approve')
                : action === 'block'
                    ? t('user_action_confirm_block')
                    : t('user_action_confirm_delete')
        );

        if (!confirmed) {
            return;
        }

        setActionLoading(true);
        setActionMessage('');
        setActionSuccess(null);

        const result = action === 'approve'
            ? await ApproveAdminUserAction(user.uid)
            : action === 'block'
                ? await BlockAdminUserAction(user.uid)
                : await DeleteAdminUserAction(user.uid);

        setActionMessage(result.message ?? '');
        setActionSuccess(result.state === true);
        setActionLoading(false);

        if (result.state) {
            router.push(`/${locale}/admin/users`);
            router.refresh();
        }
    };

    const getStatusColor = (s: string) => {
        if (s === 'ACTIVE') return 'teal';
        if (s === 'INACTIVE') return 'gray';
        if (s === 'BLOCK') return 'red';
        return 'gray';
    };

    const getStatusLabel = (s: string) => {
        if (s === 'ACTIVE') return t('status_active');
        if (s === 'INACTIVE') return t('status_inactive');
        if (s === 'BLOCK') return t('status_block');
        return s;
    };

    return (
        <Stack gap='md'>
            {/* Basic Info Section */}
            <Card withBorder>
                <Group justify='space-between' mb='xs'>
                    <Box>
                        <Text fw={700}>{t('user_info_section')}</Text>
                        <Text size='sm' c='dimmed'>{t('user_info_section_desc')}</Text>
                    </Box>
                    {!editingInfo && (
                        <Button size='xs' variant='light' onClick={() => setEditingInfo(true)}>
                            {t('edit_button')}
                        </Button>
                    )}
                </Group>

                <Divider mb='md' />

                <Stack gap='sm'>
                    <TextInput
                        label={t('user_id')}
                        value={user.userId}
                        readOnly
                        disabled
                    />
                    <TextInput
                        label={t('user_name')}
                        value={infoName}
                        onChange={(e) => setInfoName(e.currentTarget.value)}
                        readOnly={!editingInfo}
                        placeholder={t('user_name_placeholder')}
                    />
                    <TextInput
                        label={t('email')}
                        value={infoEmail}
                        onChange={(e) => setInfoEmail(e.currentTarget.value)}
                        readOnly={!editingInfo}
                        placeholder={t('email_placeholder')}
                    />
                    {!editingInfo && (
                        <Box>
                            <Text size='sm' fw={500} mb={4}>{t('status')}</Text>
                            <Badge variant='light' color={getStatusColor(user.status)}>
                                {getStatusLabel(user.status)}
                            </Badge>
                        </Box>
                    )}
                </Stack>

                {editingInfo && (
                    <Group mt='md'>
                        <Button size='xs' onClick={handleInfoSave} loading={infoLoading}>
                            {t('save_button')}
                        </Button>
                        <Button size='xs' variant='default' onClick={handleInfoCancel}>
                            {t('cancel_button')}
                        </Button>
                    </Group>
                )}

                {infoMessage && (
                    <Text size='sm' c={infoSuccess ? 'teal' : 'red'} mt='sm'>
                        {infoMessage}
                    </Text>
                )}
            </Card>

            {/* Password Section */}
            <Card withBorder>
                <Box mb='xs'>
                    <Text fw={700}>{t('user_password_section')}</Text>
                    <Text size='sm' c='dimmed'>{t('user_password_section_desc')}</Text>
                </Box>

                <Divider mb='md' />

                <Stack gap='sm'>
                    <PasswordInput
                        label={t('new_password')}
                        placeholder={t('new_password_placeholder')}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.currentTarget.value)}
                    />
                    <PasswordInput
                        label={t('confirm_password')}
                        placeholder={t('confirm_password_placeholder')}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                    />
                </Stack>

                <Group mt='md'>
                    <Button size='xs' onClick={handlePasswordSave} loading={pwLoading}>
                        {t('save_button')}
                    </Button>
                </Group>

                {pwMessage && (
                    <Text size='sm' c={pwSuccess ? 'teal' : 'red'} mt='sm'>
                        {pwMessage}
                    </Text>
                )}
            </Card>

            {/* Role Section */}
            <Card withBorder>
                <Box mb='xs'>
                    <Text fw={700}>{t('user_role_section')}</Text>
                    <Text size='sm' c='dimmed'>{t('user_role_section_desc')}</Text>
                </Box>

                <Divider mb='md' />

                <NativeSelect
                    label={t('role')}
                    value={role}
                    onChange={(e) => setRole(e.currentTarget.value)}
                    data={[
                        { value: 'GENERAL', label: 'GENERAL' },
                        { value: 'ADMIN', label: 'ADMIN' }
                    ]}
                />

                <Group mt='md'>
                    <Button size='xs' onClick={handleRoleSave} loading={roleLoading}>
                        {t('save_button')}
                    </Button>
                </Group>

                {roleMessage && (
                    <Text size='sm' c={roleSuccess ? 'teal' : 'red'} mt='sm'>
                        {roleMessage}
                    </Text>
                )}
            </Card>

            {/* Account Action Section */}
            <Card withBorder>
                <Box mb='xs'>
                    <Text fw={700}>{t('user_account_action_section')}</Text>
                    <Text size='sm' c='dimmed'>{t('user_account_action_section_desc')}</Text>
                </Box>

                <Divider mb='md' />

                <Group mt='md'>
                    {user.status === 'INACTIVE' && (
                        <Button size='xs' color='teal' onClick={() => runAccountAction('approve')} loading={actionLoading}>
                            {t('user_approve_button')}
                        </Button>
                    )}
                    {user.status !== 'BLOCK' && (
                        <Button size='xs' color='orange' onClick={() => runAccountAction('block')} loading={actionLoading}>
                            {t('user_block_button')}
                        </Button>
                    )}
                    <Button size='xs' color='red' onClick={() => runAccountAction('delete')} loading={actionLoading}>
                        {t('user_delete_button')}
                    </Button>
                </Group>

                {actionMessage && (
                    <Text size='sm' c={actionSuccess ? 'teal' : 'red'} mt='sm'>
                        {actionMessage}
                    </Text>
                )}
            </Card>
        </Stack>
    );
};
