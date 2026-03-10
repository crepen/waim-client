'use server'

import authConfig from "@/config/auth/AuthConfig";
import { AuthProvider } from "@crepen/auth";
import { UserApiProvider } from "@waim/api";
import { cookies } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";

export const UserConfigAction = async (key: string, value: string) => {

    try {
        const locale = await getLocale();

        const authProvider = AuthProvider.setConfig(authConfig(locale));

        const sessionData = await authProvider.getSession();

        const updateConfigRes = await UserApiProvider.updateUserConfig(key, value, {
            locale: locale,
            token: sessionData?.token?.accessToken ?? ""
        })

        if (updateConfigRes.state === true && key === 'SITE_LANGUAGE') {
            const normalized = value?.toLowerCase() === 'en' ? 'en' : 'ko';
            const cookieStore = await cookies();
            cookieStore.set('NEXT_LOCALE', normalized, {
                path: '/',
                sameSite: 'lax'
            });
        }


        return {
            state: updateConfigRes.state,
            message: updateConfigRes.message
        }
    }
    catch (e) {
        const t = await getTranslations();
        return {
            state: false,
            message: t('auth.default_error_message')
        }
    }


}