'use server'

import authConfig from '@root/config/auth/AuthConfig'
import { AuthProvider } from '@crepen/auth'
import { getLocale, getTranslations } from 'next-intl/server'
import { UserConfigAction } from './UserConfigAction'
import { UserApiProvider } from '@waim/api'
import { UserConfigureProvider } from '../service/UserConfigureProvider'



export const LoginAction = async (formData: FormData) => {
    const locale = await getLocale();
    const t = await getTranslations();

    try {
        const id = formData.get('username');
        const password = formData.get('password');

        const signInResult = await AuthProvider
            .setConfig(authConfig(locale, t("auth.default_error_message")))
            .signIn(id?.toString() ?? "", password?.toString() ?? "");



        if (signInResult.state === true) {
            const userConfigRes = await UserApiProvider.getUserConfig({
                locale: locale,
                token: signInResult.session?.token?.accessToken ?? ""
            })

            UserConfigureProvider.setConfigure(userConfigRes.data ?? []);
        }

        return {
            state: signInResult.state,
            message: signInResult.message,
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