'use server'

import authConfig from '@root/config/auth/AuthConfig'
import { AuthProvider } from '@crepen/auth'
import { UserApiProvider } from '@waim/api'
import { cookies } from 'next/headers'
import { getLocale, getTranslations } from 'next-intl/server'



export const LoginAction = async (formData: FormData) => {
    const locale = await getLocale();
    const t = await getTranslations();

    try {
        const id = formData.get('username');
        const password = formData.get('password');

        const signInResult = await AuthProvider
            .setConfig(authConfig(locale, t("auth.default_error_message")))
            .signIn(id?.toString() ?? "", password?.toString() ?? "");

        if (signInResult.state !== true) {
            console.error("Login failed:", signInResult);
            return {
                state: signInResult.state,
                message: signInResult.message,
            };
        }

        let targetLocale: 'ko' | 'en' = locale === 'en' ? 'en' : 'ko';

        const session = await AuthProvider
            .setConfig(authConfig(locale, t("auth.default_error_message")))
            .getSession();

        if (session?.token?.accessToken) {
            const userConfigResult = await UserApiProvider.getUserConfig({
                locale,
                token: session.token.accessToken
            });

            const languageValue = (userConfigResult.data ?? [])
                .find((x) => x.key === 'SITE_LANGUAGE')
                ?.value
                ?.toLowerCase();

            if (languageValue === 'en' || languageValue === 'ko') {
                targetLocale = languageValue;
            }
        }

        const cookieStore = await cookies();
        cookieStore.set('NEXT_LOCALE', targetLocale, {
            path: '/',
            sameSite: 'lax'
        });

        return {
            state: signInResult.state,
            message: signInResult.message,
            locale: targetLocale,
            redirectPath: `/${targetLocale}`
        };


    }
    catch (e) {
        console.error(e);
        return {
            state: false,
            message: t("auth.default_error_message"),
        };
    }
}


export const LogoutAction = async () => {
    const locale = await getLocale();
    try {
        await AuthProvider.setConfig(authConfig(locale)).clear();
        return {
            state: true
        }
    }
    catch (e) {
        if (e instanceof Error) {
            return {
                state: false,
                message: e.message ?? "Unknown Error"
            }
        }
        else {
            return {
                state: false,
                message: "Unknown Error"
            }
        }

    }
}