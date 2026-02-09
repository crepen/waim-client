'use server'

import authConfig from "@/config/auth/AuthConfig";
import { AuthProvider } from "@crepen/auth";
import { UserApiProvider } from "@waim/api";
import { getLocale } from "next-intl/server";

export const UserConfigAction = async (key: string, value: string) => {

    try {
        const locale = await getLocale();

        const authProvider = AuthProvider.setConfig(authConfig(locale));

        const sessionData = await authProvider.getSession();

        const updateConfigRes = await UserApiProvider.updateUserConfig(key, value, {
            locale: locale,
            token: sessionData?.token?.accessToken ?? ""
        })


        return {
            state: updateConfigRes.state,
            message: updateConfigRes.message
        }
    }
    catch (e) {
        return {
            state: false,
            message: 'Server connect failed.'
        }
    }


}