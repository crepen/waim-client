import { I18nConfig } from "@root/module/i18n/i18n.config";
import type { AuthConfig } from "@crepen/auth";
import { StringUtil } from "@crepen/util";
import { AuthApiProvider } from '@waim/api'

const authConfig = (locale: string, errorMessage?: string | undefined | null): AuthConfig => {

    const defaultErrorMessage = errorMessage ?? "Server connect failed.";
    const currentLocale = locale || I18nConfig.initConfig.defaultLocale || 'ko';
    const normalizeErrorMessage = (message?: string) => {
        if (!StringUtil.hasText(message)) {
            return defaultErrorMessage;
        }

        const normalized = (message ?? '').trim().toLowerCase();
        if (normalized === 'system error.' || normalized === 'server connect failed.') {
            return defaultErrorMessage;
        }

        return message;
    };

    return {
        sessionKey: 'WAIM_ATH',
        defaultErrorMessage: defaultErrorMessage,
        sessionCookieSecure: false,
        authorization: async (id: string, password: string) => {
            try {
                const tokenRes = await AuthApiProvider.signIn(id, password, {
                    locale: currentLocale
                });

                if (tokenRes.state === true) {
                    const userInfoRes = await AuthApiProvider.getUserInfo({
                        locale: currentLocale,
                        token: tokenRes.data?.access?.token
                    });

                    if (userInfoRes.state !== true) {
                        return {
                            state: false,
                            message: normalizeErrorMessage(userInfoRes.message)
                        };
                    }

                    return {
                        state: true,
                        message: tokenRes.message ?? "",
                        token: {
                            accessToken: tokenRes.data?.access?.token,
                            refreshToken: tokenRes.data?.refresh?.token,
                            accessTokenExpire: tokenRes.data?.access?.expired_at,
                            refreshTokenExpire: tokenRes.data?.refresh?.expired_at
                        },
                        user: {
                            id: userInfoRes.data?.id ?? "",
                            name: userInfoRes.data?.name ?? "",
                            email: userInfoRes.data?.email ?? "",
                            roles: userInfoRes.data?.roles ?? []
                        }
                    };
                }

                return {
                    state: false,
                    message: normalizeErrorMessage(tokenRes?.message)
                };
            }
            catch (e) {
                return {
                    state: false,
                    message: defaultErrorMessage
                };
            }
        },
        refresh: async (token: string) => {
            try {
                const res = await fetch(`${process.env.WAIM_API_URL}/api/auth`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept-Language': currentLocale,
                        'Authorization': `Bearer ${token ?? ""}`
                    },
                    body: JSON.stringify({
                        grant_type: "refresh"
                    })
                });

                let resJson: any = undefined;

                try {
                    resJson = await res.json();
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                catch (e) { /* empty */ }

                if (res.ok && resJson) {
                    if (resJson.state !== true || !resJson.result?.access || !resJson.result?.refresh) {
                        return {
                            state: false,
                            message: StringUtil.hasText(resJson?.message) ? resJson.message : defaultErrorMessage
                        };
                    }

                    return {
                        state: true,
                        message: resJson.message ?? "",
                        token: {
                            accessToken: resJson.result.access.token,
                            refreshToken: resJson.result.refresh.token,
                            accessTokenExpire: resJson.result.access.expired_at,
                            refreshTokenExpire: resJson.result.refresh.expired_at
                        },
                        user: {
                            id: "",
                            name: "",
                            email: "",
                            roles: []
                        }
                    };
                }

                return {
                    state: false,
                    message: StringUtil.hasText(resJson?.message)
                        ? resJson.message
                        : `${defaultErrorMessage} (HTTP ${res.status})`
                };
            }
            catch (e) {
                return {
                    state: false,
                    message: defaultErrorMessage
                };
            }
        }
    };
}

export default authConfig;