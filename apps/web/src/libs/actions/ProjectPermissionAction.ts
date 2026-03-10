'use server'

import authConfig from '@/config/auth/AuthConfig';
import { AuthProvider } from '@crepen/auth';
import { ProjectApiProvider } from '@waim/api';
import type { ProjectPermissionRole } from '@waim/api/types';
import { getLocale, getTranslations } from 'next-intl/server';

const isValidRole = (role: string): role is ProjectPermissionRole => {
    return role === 'ROLE_PROJECT_READ'
        || role === 'ROLE_PROJECT_MODIFY'
        || role === 'ROLE_PROJECT_USER_READ'
        || role === 'ROLE_PROJECT_USER_MODIFY'
        || role === 'GENERAL'
        || role === 'EDITOR'
        || role === 'OWNER';
};

export const AddProjectPermissionAction = async (formData: FormData) => {
    const locale = await getLocale();
    const t = await getTranslations();

    try {
        const session = await AuthProvider
            .setConfig(authConfig(locale, t('auth.default_error_message')))
            .getSession();

        const projectUid = formData.get('project-uid')?.toString() ?? '';
        const userIdOrEmail = formData.get('user-id-or-email')?.toString().trim() ?? '';
        const role = formData.get('role')?.toString() ?? '';

        if (!projectUid || !userIdOrEmail || !isValidRole(role)) {
            return {
                state: false,
                message: t('main.common.api_error')
            };
        }

        const result = await ProjectApiProvider.addProjectPermission(
            projectUid,
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

export const UpdateProjectPermissionAction = async (formData: FormData) => {
    const locale = await getLocale();
    const t = await getTranslations();

    try {
        const session = await AuthProvider
            .setConfig(authConfig(locale, t('auth.default_error_message')))
            .getSession();

        const projectUid = formData.get('project-uid')?.toString() ?? '';
        const permissionUid = formData.get('permission-uid')?.toString() ?? '';
        const role = formData.get('role')?.toString() ?? '';

        if (!projectUid || !permissionUid || !isValidRole(role)) {
            return {
                state: false,
                message: t('main.common.api_error')
            };
        }

        const result = await ProjectApiProvider.updateProjectPermission(
            projectUid,
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

export const RemoveProjectPermissionAction = async (projectUid: string, permissionUid: string) => {
    const locale = await getLocale();
    const t = await getTranslations();

    try {
        const session = await AuthProvider
            .setConfig(authConfig(locale, t('auth.default_error_message')))
            .getSession();

        if (!projectUid || !permissionUid) {
            return {
                state: false,
                message: t('main.common.api_error')
            };
        }

        const result = await ProjectApiProvider.removeProjectPermission(
            projectUid,
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
