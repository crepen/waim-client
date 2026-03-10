import { I18nConfig } from "@root/module/i18n/i18n.config";
import type { AuthConfig } from "@crepen/auth";
import { StringUtil } from "@crepen/util";
import { AuthApiProvider } from '@waim/api'


interface BaseResponse<T> {
    message?: string,
    state: boolean,
    timestamp: number,
    result?: T
}

interface GetTokenResponse {
    access?: AuthResponseToken,
    refresh?: AuthResponseToken
}

interface AuthResponseToken {
    expired_at?: number,
    token?: string
}

interface GetTokenUserDataResponse {
    unique_id: string,
    id : string,
    name : string,
    email : string,
    roles: string[]
}

const authConfig = (locale: string, errorMessage?: string | undefined | null): AuthConfig => {

    const defaultErrorMessage = errorMessage ?? "Server connect failed.";

    return {
        sessionKey: 'WAIM_ATH',
        defaultErrorMessage: defaultErrorMessage,
        sessionCookieSecure: false,
        authorization: async (id: string, password: string) => {
            try {
                const tokenRes = await AuthApiProvider.signIn(id , password , {
                    locale: locale
                })

                if (tokenRes.state === true) {


                    const userInfoRes = await AuthApiProvider.getUserInfo({
                        locale: locale,
                        token: tokenRes.data?.access?.token
                    });

                    if(userInfoRes.state !== true) {
                        return {
                            state: false,
                            message: StringUtil.hasText(userInfoRes.message) ? userInfoRes.message : defaultErrorMessage
                        }
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
                    }
                }
                else {
                    return {
                        state: false,
                        message: StringUtil.hasText(tokenRes?.message) ? tokenRes?.message : defaultErrorMessage
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