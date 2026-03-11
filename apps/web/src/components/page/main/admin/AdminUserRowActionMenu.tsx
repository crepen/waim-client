'use client'

import {
    ApproveAdminUserAction,
    BlockAdminUserAction,
    DeleteAdminUserAction
} from '@/libs/actions/AdminUserAction';
import { ActionIcon, Menu } from '@mantine/core';
import type { AdminUserData } from '@waim/api/types';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SlOptionsVertical } from 'react-icons/sl';
import { toast } from 'sonner';

type AdminUserRowActionMenuProps = {
    user: AdminUserData;
}

export const AdminUserRowActionMenu = ({ user }: AdminUserRowActionMenuProps) => {
    const t = useTranslations('main.admin');
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const runAction = async (action: 'approve' | 'block' | 'delete') => {
        setLoading(true);

        const result = action === 'approve'
            ? await ApproveAdminUserAction(user.uid)
            : action === 'block'
                ? await BlockAdminUserAction(user.uid)
                : await DeleteAdminUserAction(user.uid);

        if (!result.state) {
            toast.error(result.message ?? t('user_action_failed'));
            setLoading(false);
            return;
        }

        toast.success(result.message ?? t('user_action_success'));
        setLoading(false);
        router.refresh();
    };

    const requestAction = async (action: 'approve' | 'block' | 'delete') => {
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

        await runAction(action);
    };

    return (
        <Menu shadow='md' width={180} position='bottom-end' withArrow>
            <Menu.Target>
                <ActionIcon
                    variant='default'
                    loading={loading}
                    aria-label={t('user_action_menu_aria_label')}
                    onClick={(event) => event.stopPropagation()}
                >
                    <SlOptionsVertical size={14} />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown onClick={(event) => event.stopPropagation()}>
                {user.status === 'INACTIVE' && (
                    <Menu.Item color='teal' onClick={() => requestAction('approve')}>
                        {t('user_approve_button')}
                    </Menu.Item>
                )}
                {user.status !== 'BLOCK' && (
                    <Menu.Item color='orange' onClick={() => requestAction('block')}>
                        {t('user_block_button')}
                    </Menu.Item>
                )}
                <Menu.Item color='red' onClick={() => requestAction('delete')}>
                    {t('user_delete_button')}
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};
