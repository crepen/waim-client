'use server'

import authConfig from '@/config/auth/AuthConfig';
import { resolveApiMessage } from '@/libs/service/ApiMessageResolver';
import { AuthProvider } from '@crepen/auth';
import { UserApiProvider } from '@waim/api';
import { getLocale, getTranslations } from 'next-intl/server';

const getSessionToken = async (locale: string) => {
    const authProvider = AuthProvider.setConfig(authConfig(locale));
    const sessionData = await authProvider.getSession();
    return sessionData?.token?.accessToken ?? '';
};

export const UpdateProfileNameAction = async (name: string) => {
    const locale = await getLocale();
    const t = await getTranslations('main.profile');

    const normalizedName = name?.trim();

    if (!normalizedName) {
        return {
            state: false,
            message: t('name_required')
        };
    }

    try {
        const token = await getSessionToken(locale);

        const result = await UserApiProvider.updateUser(
            {
                name: normalizedName
            },
            {
                locale,
                token
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
            message: t('name_save_failed')
        };
    }
};

export const UpdateProfilePasswordAction = async (password: string) => {
    const locale = await getLocale();
    const t = await getTranslations('main.profile');

    const normalizedPassword = password?.trim();

    if (!normalizedPassword) {
        return {
            state: false,
            message: t('password_required')
        };
    }

    try {
        const token = await getSessionToken(locale);

        const result = await UserApiProvider.updateUser(
            {
                password: normalizedPassword
            },
            {
                locale,
                token
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
            message: t('password_save_failed')
        };
    }
};
