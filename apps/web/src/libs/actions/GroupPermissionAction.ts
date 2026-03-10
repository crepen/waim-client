'use server'

import authConfig from '@/config/auth/AuthConfig';
import { AuthProvider } from '@crepen/auth';
import { GroupApiProvider } from '@waim/api';
import type { GroupPermissionRole } from '@waim/api/types';
import { getLocale, getTranslations } from 'next-intl/server';

const isValidRole = (role: string): role is GroupPermissionRole => {
    return role === 'ROLE_GROUP_READ'
        || role === 'ROLE_GROUP_MODIFY'
        || role === 'ROLE_GROUP_PROJECT_READ'
        || role === 'ROLE_GROUP_PROJECT_MODIFY'
        || role === 'ROLE_GROUP_USER_READ'
        || role === 'ROLE_GROUP_USER_MODIFY'
        || role === 'GENERAL'
        || role === 'EDITOR'
        || role === 'ADMIN';
};

export const AddGroupPermissionAction = async (formData: FormData) => {
    const locale = await getLocale();
    const t = await getTranslations();

    try {
        const session = await AuthProvider
            .setConfig(authConfig(locale, t('auth.default_error_message')))
            .getSession();

        const groupUid = formData.get('group-uid')?.toString() ?? '';
        const userIdOrEmail = formData.get('user-id-or-email')?.toString().trim() ?? '';
        const role = formData.get('role')?.toString() ?? '';

        if (!groupUid || !userIdOrEmail || !isValidRole(role)) {
            return {
                state: false,
                message: t('main.common.api_error')
            };
        }

        const result = await GroupApiProvider.addGroupPermission(
            groupUid,
            { userIdOrEmail, role },
            {
                locale,
                token: session?.token?.accessToken ?? ''
            }
        );

        return {
            state: result.state,
            message: result.message
        };
    }
    catch (e) {
        return {
            state: false,
            message: t('auth.default_error_message')
        };
    }
};

export const UpdateGroupPermissionAction = async (formData: FormData) => {
    const locale = await getLocale();
    const t = await getTranslations();

    try {
        const session = await AuthProvider
            .setConfig(authConfig(locale, t('auth.default_error_message')))
            .getSession();

        const groupUid = formData.get('group-uid')?.toString() ?? '';
        const permissionUid = formData.get('permission-uid')?.toString() ?? '';
        const role = formData.get('role')?.toString() ?? '';

        if (!groupUid || !permissionUid || !isValidRole(role)) {
            return {
                state: false,
                message: t('main.common.api_error')
            };
        }

        const result = await GroupApiProvider.updateGroupPermission(
            groupUid,
            { permissionUid, role },
            {
                locale,
                token: session?.token?.accessToken ?? ''
            }
        );

        return {
            state: result.state,
            message: result.message
        };
    }
    catch (e) {
        return {
            state: false,
            message: t('auth.default_error_message')
        };
    }
};

export const RemoveGroupPermissionAction = async (groupUid: string, permissionUid: string) => {
    const locale = await getLocale();
    const t = await getTranslations();

    try {
        const session = await AuthProvider
            .setConfig(authConfig(locale, t('auth.default_error_message')))
            .getSession();

        if (!groupUid || !permissionUid) {
            return {
                state: false,
                message: t('main.common.api_error')
            };
        }

        const result = await GroupApiProvider.removeGroupPermission(
            groupUid,
            permissionUid,
            {
                locale,
                token: session?.token?.accessToken ?? ''
            }
        );

        return {
            state: result.state,
            message: result.message
        };
    }
    catch (e) {
        return {
            state: false,
            message: t('auth.default_error_message')
        };
    }
};
