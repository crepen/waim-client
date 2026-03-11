import { AddAdminUserProp, AddGeneralUserProp, AdminUserData, GlobalConfig, SearchAdminUserProp, SmtpGlobalConfigPayload, UpdateAdminUserProp, UserConfig, UserConfigResponse } from "./types";
import { CommonApiProp, CommonApiResponse, CommonApiResult, CommonPageableApiResponse, CommonPageableApiResult } from "./types/CommonApiProvider"

export class UserApiProvider {
    static signup = async (options: AddGeneralUserProp, config?: Partial<CommonApiProp>): Promise<CommonApiResult> => {
        try {
            const res = await fetch(`${process.env.WAIM_API_URL}/api/user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                },
                body: JSON.stringify({
                    user_id: options.userId,
                    user_name: options.userName,
                    user_password: options.password,
                    user_email: options.email
                })
            });

            let data: CommonApiResponse | undefined = undefined;

            try {
                data = await res.json();
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            catch (e) {
                /* empty */
            }

            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                }
            }

            return {
                state: data.state,
                message: data.message
            }
        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'Server connect failed.'
            }
        }
    }

    static searchAdminUsers = async (options?: SearchAdminUserProp, config?: Partial<CommonApiProp>): Promise<CommonPageableApiResult<AdminUserData[]>> => {

        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/admin/user`);

            if (typeof options?.page === 'number') {
                apiUrl.searchParams.set('page', options.page.toString());
            }

            if (typeof options?.size === 'number') {
                apiUrl.searchParams.set('size', options.size.toString());
            }

            if (options?.keyword) {
                apiUrl.searchParams.set('keyword', options.keyword);
            }

            if (options?.status) {
                apiUrl.searchParams.set('status', options.status);
            }

            const res = await fetch(apiUrl.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                }
            })

            let data: CommonPageableApiResponse<AdminUserData[]> | undefined = undefined;

            try {
                data = await res.json();
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            catch (e) {
                /* empty */
            }

            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                }
            }

            return {
                state: data.state,
                message: data.message,
                data: data.result,
                pageable: data.pageable
            }
        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'Server connect failed.'
            }
        }
    }

    static addAdminUser = async (options: AddAdminUserProp, config?: Partial<CommonApiProp>): Promise<CommonApiResult> => {
        try {
            const res = await fetch(`${process.env.WAIM_API_URL}/api/admin/user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                },
                body: JSON.stringify({
                    user_id: options.userId,
                    user_name: options.userName,
                    user_password: options.password,
                    user_email: options.email
                })
            });

            let data: CommonApiResponse | undefined = undefined;

            try {
                data = await res.json();
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            catch (e) {
                /* empty */
            }

            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                }
            }

            return {
                state: data.state,
                message: data.message
            }
        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'Server connect failed.'
            }
        }
    }

    static getAdminUser = async (uid: string, config?: Partial<CommonApiProp>): Promise<CommonApiResult<AdminUserData>> => {
        try {
            const res = await fetch(`${process.env.WAIM_API_URL}/api/admin/user/${encodeURIComponent(uid)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                }
            });

            let data: CommonApiResponse<AdminUserData> | undefined = undefined;

            try {
                data = await res.json();
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            catch (e) {
                /* empty */
            }

            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                }
            }

            return {
                state: data.state,
                message: data.message,
                data: data.result
            }
        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'Server connect failed.'
            }
        }
    }

    static updateAdminUser = async (uid: string, options: UpdateAdminUserProp, config?: Partial<CommonApiProp>): Promise<CommonApiResult> => {
        try {
            const res = await fetch(`${process.env.WAIM_API_URL}/api/admin/user/${encodeURIComponent(uid)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                },
                body: JSON.stringify({
                    user_name: options.userName,
                    user_email: options.email,
                    user_password: options.password,
                    user_role: options.role
                })
            });

            let data: CommonApiResponse | undefined = undefined;

            try {
                data = await res.json();
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            catch (e) {
                /* empty */
            }

            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                }
            }

            return {
                state: data.state,
                message: data.message
            }
        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'Server connect failed.'
            }
        }
    }

    static approveAdminUser = async (uid: string, config?: Partial<CommonApiProp>): Promise<CommonApiResult> => {
        try {
            const res = await fetch(`${process.env.WAIM_API_URL}/api/admin/user/${encodeURIComponent(uid)}/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                }
            });

            let data: CommonApiResponse | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
                /* empty */
            }

            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                }
            }

            return {
                state: data.state,
                message: data.message
            }
        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'Server connect failed.'
            }
        }
    }

    static blockAdminUser = async (uid: string, config?: Partial<CommonApiProp>): Promise<CommonApiResult> => {
        try {
            const res = await fetch(`${process.env.WAIM_API_URL}/api/admin/user/${encodeURIComponent(uid)}/block`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                }
            });

            let data: CommonApiResponse | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
                /* empty */
            }

            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                }
            }

            return {
                state: data.state,
                message: data.message
            }
        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'Server connect failed.'
            }
        }
    }

    static deleteAdminUser = async (uid: string, config?: Partial<CommonApiProp>): Promise<CommonApiResult> => {
        try {
            const res = await fetch(`${process.env.WAIM_API_URL}/api/admin/user/${encodeURIComponent(uid)}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                }
            });

            let data: CommonApiResponse | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
                /* empty */
            }

            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                }
            }

            return {
                state: data.state,
                message: data.message
            }
        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'Server connect failed.'
            }
        }
    }

    static getUserConfig = async (config?: Partial<CommonApiProp>): Promise<CommonApiResult<UserConfig[]>> => {

        try {
            const res = await fetch(`${process.env.WAIM_API_URL}/api/user/config`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                }
            })


            let data: CommonApiResponse<UserConfigResponse> | undefined = undefined;

            try {
                data = await res.json();
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            catch (e) {
                /* empty */
            }


            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                }
            }

            return {
                state: data.state,
                message: data.message,
                data: data.result
            }
        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'Server connect failed.'
            }
        }
    }


    static updateUserConfig = async (key: string , value: string, config? : Partial<CommonApiProp>) : Promise<CommonApiResult> => {
        try{
            const res = await fetch(`${process.env.WAIM_API_URL}/api/user/config`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                },
                body: JSON.stringify({
                    key : key,
                    value : value
                })
            })


            let data: CommonApiResponse<UserConfigResponse> | undefined = undefined;

            try {
                data = await res.json();
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            catch (e) {
                /* empty */
            }


            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                }
            }

            return {
                state: data.state,
                message: data.message
            }
        }
        catch(e){
            console.error(e);
            return {
                state : false,
                message : 'Server connect failed.'
            }
        }
    }

    static getGlobalConfig = async (keys: string[], config?: Partial<CommonApiProp>): Promise<CommonApiResult<GlobalConfig[]>> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/config/global`);

            keys.forEach((key) => {
                apiUrl.searchParams.append('keys', key);
            });

            const res = await fetch(apiUrl.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                }
            });

            let data: CommonApiResponse<GlobalConfig[]> | undefined = undefined;

            try {
                data = await res.json();
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            catch (e) {
                /* empty */
            }

            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                }
            }

            return {
                state: data.state,
                message: data.message,
                data: data.result
            }
        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'Server connect failed.'
            }
        }
    }

    static updateGlobalConfig = async (key: string, value: string, config?: Partial<CommonApiProp>): Promise<CommonApiResult> => {
        try {
            const res = await fetch(`${process.env.WAIM_API_URL}/api/config/global`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                },
                body: JSON.stringify({
                    key,
                    value
                })
            });

            let data: CommonApiResponse | undefined = undefined;

            try {
                data = await res.json();
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            catch (e) {
                /* empty */
            }

            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                }
            }

            return {
                state: data.state,
                message: data.message
            }
        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'Server connect failed.'
            }
        }
    }

    static updateSmtpGlobalConfig = async (options: SmtpGlobalConfigPayload, config?: Partial<CommonApiProp>): Promise<CommonApiResult> => {
        try {
            const res = await fetch(`${process.env.WAIM_API_URL}/api/config/global/smtp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                },
                body: JSON.stringify({
                    smtpEnabled: options.smtpEnabled,
                    host: options.host,
                    port: options.port,
                    username: options.username,
                    password: options.password,
                    fromEmail: options.fromEmail,
                    fromName: options.fromName,
                    authEnabled: options.authEnabled,
                    startTlsEnabled: options.startTlsEnabled,
                    sslEnabled: options.sslEnabled
                })
            });

            let data: CommonApiResponse | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
                /* empty */
            }

            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                }
            }

            return {
                state: data.state,
                message: data.message
            }
        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'Server connect failed.'
            }
        }
    }

    static testSmtpGlobalConfig = async (options: SmtpGlobalConfigPayload, config?: Partial<CommonApiProp>): Promise<CommonApiResult> => {
        try {
            const res = await fetch(`${process.env.WAIM_API_URL}/api/config/global/smtp/test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                },
                body: JSON.stringify({
                    smtpEnabled: options.smtpEnabled,
                    host: options.host,
                    port: options.port,
                    username: options.username,
                    password: options.password,
                    fromEmail: options.fromEmail,
                    fromName: options.fromName,
                    authEnabled: options.authEnabled,
                    startTlsEnabled: options.startTlsEnabled,
                    sslEnabled: options.sslEnabled
                })
            });

            let data: CommonApiResponse | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
                /* empty */
            }

            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                }
            }

            return {
                state: data.state,
                message: data.message
            }
        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'Server connect failed.'
            }
        }
    }

    static updateUser = async (
        options: {
            name?: string,
            password?: string,
            email?: string,
            role?: string,
            status?: string,
            config?: Record<string, string>
        },
        config?: Partial<CommonApiProp>
    ): Promise<CommonApiResult> => {
        try {
            const res = await fetch(`${process.env.WAIM_API_URL}/api/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                },
                body: JSON.stringify({
                    name: options?.name,
                    password: options?.password,
                    email: options?.email,
                    role: options?.role,
                    status: options?.status,
                    config: options?.config
                })
            })

            let data: CommonApiResponse | undefined = undefined;

            try {
                data = await res.json();
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            catch (e) {
                /* empty */
            }

            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                }
            }

            return {
                state: data.state,
                message: data.message
            }
        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'Server connect failed.'
            }
        }
    }
}