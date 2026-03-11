'use server'

import authConfig from '@/config/auth/AuthConfig';
import { resolveApiMessage } from '@/libs/service/ApiMessageResolver';
import { AuthProvider } from '@crepen/auth';
import { UserApiProvider } from '@waim/api';
import { getLocale, getTranslations } from 'next-intl/server';

export const AddAdminUserAction = async (formData: FormData) => {
    const locale = await getLocale();
    const t = await getTranslations('main.admin');

    const userId = (formData.get('userId')?.toString() ?? '').trim();
    const userName = (formData.get('userName')?.toString() ?? '').trim();
    const password = (formData.get('password')?.toString() ?? '').trim();
    const email = (formData.get('email')?.toString() ?? '').trim();

    if (!userId || !userName || !password || !email) {
        return {
            state: false,
            message: t('user_add_validation_required')
        };
    }

    try {
        const authProvider = AuthProvider.setConfig(authConfig(locale));
        const sessionData = await authProvider.getSession();

        const result = await UserApiProvider.addAdminUser(
            {
                userId,
                userName,
                password,
                email
            },
            {
                locale,
                token: sessionData?.token?.accessToken ?? ''
            }
        );

        return {
            state: result.state,
            message: resolveApiMessage(result.message)
        };
    }
    catch (e) {
        return {
            state: false,
            message: t('user_add_failed')
        };
    }
};

export const UpdateAdminUserInfoAction = async (uid: string, formData: FormData) => {
    const locale = await getLocale();
    const t = await getTranslations('main.admin');

    const userName = (formData.get('userName')?.toString() ?? '').trim();
    const email = (formData.get('email')?.toString() ?? '').trim();

    if (!userName || !email) {
        return { state: false, message: t('user_add_validation_required') };
    }

    try {
        const authProvider = AuthProvider.setConfig(authConfig(locale));
        const sessionData = await authProvider.getSession();

        const result = await UserApiProvider.updateAdminUser(
            uid,
            { userName, email },
            { locale, token: sessionData?.token?.accessToken ?? '' }
        );

        return { state: result.state, message: resolveApiMessage(result.message) };
    }
    catch (e) {
        return { state: false, message: t('user_update_failed') };
    }
};

export const UpdateAdminUserPasswordAction = async (uid: string, formData: FormData) => {
    const locale = await getLocale();
    const t = await getTranslations('main.admin');

    const password = (formData.get('password')?.toString() ?? '').trim();
    const confirmPassword = (formData.get('confirmPassword')?.toString() ?? '').trim();

    if (!password) {
        return { state: false, message: t('password_required') };
    }

    if (password !== confirmPassword) {
        return { state: false, message: t('password_mismatch') };
    }

    try {
        const authProvider = AuthProvider.setConfig(authConfig(locale));
        const sessionData = await authProvider.getSession();

        const result = await UserApiProvider.updateAdminUser(
            uid,
            { password },
            { locale, token: sessionData?.token?.accessToken ?? '' }
        );

        return { state: result.state, message: resolveApiMessage(result.message) };
    }
    catch (e) {
        return { state: false, message: t('password_update_failed') };
    }
};

export const UpdateAdminUserRoleAction = async (uid: string, role: string) => {
    const locale = await getLocale();
    const t = await getTranslations('main.admin');

    if (!role) {
        return { state: false, message: t('role_update_failed') };
    }

    try {
        const authProvider = AuthProvider.setConfig(authConfig(locale));
        const sessionData = await authProvider.getSession();

        const result = await UserApiProvider.updateAdminUser(
            uid,
            { role },
            { locale, token: sessionData?.token?.accessToken ?? '' }
        );

        return { state: result.state, message: resolveApiMessage(result.message) };
    }
    catch (e) {
        return { state: false, message: t('role_update_failed') };
    }
};

export const ApproveAdminUserAction = async (uid: string) => {
    const locale = await getLocale();
    const t = await getTranslations('main.admin');

    try {
        const authProvider = AuthProvider.setConfig(authConfig(locale));
        const sessionData = await authProvider.getSession();

        const result = await UserApiProvider.approveAdminUser(
            uid,
            { locale, token: sessionData?.token?.accessToken ?? '' }
        );

        return { state: result.state, message: resolveApiMessage(result.message) ?? (result.state ? t('user_approve_success') : t('user_approve_failed')) };
    }
    catch (e) {
        return { state: false, message: t('user_approve_failed') };
    }
};

export const BlockAdminUserAction = async (uid: string) => {
    const locale = await getLocale();
    const t = await getTranslations('main.admin');

    try {
        const authProvider = AuthProvider.setConfig(authConfig(locale));
        const sessionData = await authProvider.getSession();

        const result = await UserApiProvider.blockAdminUser(
            uid,
            { locale, token: sessionData?.token?.accessToken ?? '' }
        );

        return { state: result.state, message: resolveApiMessage(result.message) ?? (result.state ? t('user_block_success') : t('user_block_failed')) };
    }
    catch (e) {
        return { state: false, message: t('user_block_failed') };
    }
};

export const DeleteAdminUserAction = async (uid: string) => {
    const locale = await getLocale();
    const t = await getTranslations('main.admin');

    try {
        const authProvider = AuthProvider.setConfig(authConfig(locale));
        const sessionData = await authProvider.getSession();

        const result = await UserApiProvider.deleteAdminUser(
            uid,
            { locale, token: sessionData?.token?.accessToken ?? '' }
        );

        return { state: result.state, message: resolveApiMessage(result.message) ?? (result.state ? t('user_delete_success') : t('user_delete_failed')) };
    }
    catch (e) {
        return { state: false, message: t('user_delete_failed') };
    }
};
