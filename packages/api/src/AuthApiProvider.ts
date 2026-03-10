import { CommonApiProp, CommonApiResponse, CommonApiResult } from "./types";
import { StringUtil } from "@crepen/util";
import { AuthSignInResponse, GetUserInfoResponse } from "./types/AuthApiProvider";

export class AuthApiProvider {
    static signIn = async (id: string, password: string, config?: Partial<CommonApiProp>): Promise<CommonApiResult<AuthSignInResponse>> => {
        try {

            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/auth`);

            const res = await fetch(apiUrl.toString(), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                },
                body : JSON.stringify({
                    grant_type: "login",
                    id: id,
                    password: password
                })
            });


            let resJson: CommonApiResponse<AuthSignInResponse> | undefined = undefined;

            try {
                resJson = await res.json();
            }
            catch (e) { /** empty */ }

            if (!res.ok || resJson === undefined) {
                return {
                    state: false,
                    message: resJson?.message ?? 'Server connect failed.'
                }
            }   

            return {
                state: resJson.state,
                message: resJson.message,
                data: resJson.result
            }
            

        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'System error.'
            }
        }
    }


    static getUserInfo = async (config?: Partial<CommonApiProp>): Promise<CommonApiResult<GetUserInfoResponse>> => {
         try {

            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/auth`);

            const res = await fetch(apiUrl.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? "NO_TOKEN"}`
                }
            });


            let resJson: CommonApiResponse<GetUserInfoResponse> | undefined = undefined;

            try {
                resJson = await res.json();
            }
            catch (e) { /** empty */ }

            if (!res.ok || resJson === undefined) {
                return {
                    state: false,
                    message: resJson?.message ?? 'Server connect failed.'
                }
            }   

            return {
                state: resJson.state,
                message: resJson.message,
                data: resJson.result
            }
            

        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'System error.'
            }
        }
    }

}