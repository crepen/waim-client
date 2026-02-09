import { I18nConfig } from "@root/module/i18n/i18n.config";
import type { AuthConfig } from "@crepen/auth";
import { StringUtil } from "@crepen/util";

const authConfig = (locale: string, errorMessage?: string | undefined | null): AuthConfig => {

    const defaultErrorMessage = errorMessage ?? "Server connect failed.";

    return {
        sessionKey: 'WAIM_ATH',
        defaultErrorMessage: defaultErrorMessage,
        sessionCookieSecure: false,
        authorization: async (id: string, password: string) => {
            try {
                const res = await fetch(`${process.env.WAIM_API_URL}/api/auth`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept-Language': locale ?? I18nConfig.initConfig.defaultLocale ?? 'ko',
                    },
                    body: JSON.stringify({
                        grant_type: "login",
                        id: id,
                        password: password
                    })
                })

                let resJson = undefined;

                try {
                    resJson = await res.json();
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                catch (e) { /* empty */ }

                if (res.ok && resJson) {
                    return {
                        state: true,
                        message: resJson.message ?? "",
                        token: {
                            accessToken: resJson.result.access_token.token,
                            refreshToken: resJson.result.refresh_token.token,
                            accessTokenExpire: resJson.result.access_token.expires,
                            refreshTokenExpire: resJson.result.refresh_token.expires
                        },
                        user: {
                            id: resJson.result.user.id,
                            name: resJson.result.user.name,
                            email: resJson.result.user.email,
                            roles: []
                        }
                    }
                }
                else {
                    return {
                        state: false,
                        message: StringUtil.hasText(resJson?.message) ? resJson.message : defaultErrorMessage
                    }
                }
            }
            catch (e) {
                return {
                    state: false,
                    message: defaultErrorMessage
                }
            }

        },
        refresh: async (token: string) => {
            try {
                const res = await fetch(`${process.env.WAIM_API_URL}/api/auth`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept-Language': locale ?? I18nConfig.initConfig.defaultLocale ?? 'ko',
                        'Authorization': `Bearer ${token ?? ""}`
                    },
                    body: JSON.stringify({
                        grant_type: "refresh"
                    })

                });

                let resJson = undefined;

                try {
                    resJson = await res.json();
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                catch (e) { /* empty */ }

                if (res.ok && resJson) {
                    return {
                        state: true,
                        message: resJson.message ?? "",
                        token: {
                            accessToken: resJson.result.access_token.token,
                            refreshToken: resJson.result.refresh_token.token,
                            accessTokenExpire: resJson.result.access_token.expires,
                            refreshTokenExpire: resJson.result.refresh_token.expires
                        },
                        user: {
                            id: resJson.result.user.id,
                            name: resJson.result.user.name,
                            email: resJson.result.user.email,
                            roles: []
                        }
                    }
                }
                else {
                    return {
                        state: false,
                        message: StringUtil.hasText(resJson?.message) ? resJson.message : defaultErrorMessage
                    }
                }
            }
            catch (e) {
                return {
                    state: false,
                    message: defaultErrorMessage
                }
            }
        }
    }
}

export default authConfig;