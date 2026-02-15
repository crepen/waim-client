import { CommonApiProp, CommonApiResponse, CommonApiResult, CommonPageableApiResponse, CommonPageableApiResult } from "./types/CommonApiProvider"
import { AddProjectOption, ProjectData, ProjectSearchResponse, SearchProjectProp } from "./types/ProjectApiProvider"

export class ProjectApiProvider {
    static searchProject = async (options? : SearchProjectProp ,  config?: Partial<CommonApiProp>): Promise<CommonPageableApiResult<ProjectData[]>> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/project`);

            if(options?.page){
                apiUrl.searchParams.set('page' , options.page.toString());
            }

            if(options?.keyword){
                apiUrl.searchParams.set('keyword' , options.keyword);
            }

            if(options?.size){
                apiUrl.searchParams.set('size' , (options.size ?? 10).toString());
            }

            

            const res = await fetch(apiUrl.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                }
            })

            let data: CommonPageableApiResponse<ProjectSearchResponse> | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
                /** empty */
            }

            if (!res.ok || data === undefined) {
                // throw new Error('Response not found.');
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                }
            }

            return {
                state: data.state,
                message: data.message,
                data: data.result,
                pageable : data.pageable
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



    static getProjectDetail = async (userId : string, projectAlias : string ,  config?: Partial<CommonApiProp>): Promise<CommonApiResult<ProjectData>> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/project/${userId}/${projectAlias}`);

            const res = await fetch(apiUrl.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                }
            })

            let data: CommonPageableApiResponse<ProjectData> | undefined = undefined;

            

            try {
                data = await res.json();
            }
            catch (e) {
                /** empty */
            }

            if (!res.ok || data === undefined) {
                // throw new Error('Response not found.');
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

    static addProject = async (options? : AddProjectOption ,  config?: Partial<CommonApiProp>): Promise<CommonApiResult> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/project`);

            const res = await fetch(apiUrl.toString(), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                },
                body : JSON.stringify({
                    project_name : options?.projectName,
                    project_alias : options?.projectAlias
                })
            })

            let data: CommonPageableApiResponse | undefined = undefined;

            

            try {
                data = await res.json();
            }
            catch (e) {
                /** empty */
            }

            if (!res.ok || data === undefined) {
                // throw new Error('Response not found.');
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                }
            }

            return {
                state: data.state,
                message: data.message,
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