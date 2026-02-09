import { UserConfig, UserConfigResponse } from "./types";
import { CommonApiProp, CommonApiResponse, CommonApiResult } from "./types/CommonApiProvider"

export class UserApiProvider {
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
                // throw new Error('Response not found.');
                return {
                    state: false,
                    message: 'Server connect failed.'
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
                // throw new Error('Response not found.');
                return {
                    state: false,
                    message: 'Server connect failed.'
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
}