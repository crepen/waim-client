import { CommonApiProp, CommonApiResponse, CommonApiResult, CommonPageableApiResponse, CommonPageableApiResult } from "./types/CommonApiProvider"
import {
    AddProjectOption,
    AddProjectPermissionOption,
    ProjectData,
    ProjectJobData,
    ProjectJobLogData,
    ProjectPermissionListResponse,
    ProjectPermissionMetaResponse,
    ProjectSearchResponse,
    SearchProjectJobLogProp,
    SearchProjectJobProp,
    SearchProjectProp,
    UpsertProjectJobOption,
    UpdateProjectPermissionOption
} from "./types/ProjectApiProvider"

export class ProjectApiProvider {
    static searchProject = async (options? : SearchProjectProp ,  config?: Partial<CommonApiProp>): Promise<CommonPageableApiResult<ProjectData[]>> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/project`);

            if(typeof options?.page === 'number'){
                apiUrl.searchParams.set('page' , options.page.toString());
            }

            if(options?.keyword){
                apiUrl.searchParams.set('keyword' , options.keyword);
            }

            if(options?.groupUid){
                apiUrl.searchParams.set('group_uid', options.groupUid);
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



    static getProjectDetail = async (projectAlias : string ,  config?: Partial<CommonApiProp>): Promise<CommonApiResult<ProjectData>> => {
        try {
            const searchUrl = new URL(`${process.env.WAIM_API_URL}/api/project`);
            searchUrl.searchParams.set('page', '0');
            searchUrl.searchParams.set('size', '100');
            searchUrl.searchParams.set('keyword', projectAlias);

            const searchRes = await fetch(searchUrl.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                }
            });

            let searchData: CommonPageableApiResponse<ProjectSearchResponse> | undefined = undefined;

            try {
                searchData = await searchRes.json();
            }
            catch (e) {
                /** empty */
            }

            if (!searchRes.ok || searchData === undefined || searchData.state !== true) {
                return {
                    state: false,
                    message: searchData?.message ?? 'Server connect failed.'
                }
            }

            const matchProject = (searchData.result ?? []).find((x) => x.project_alias === projectAlias);

            if (!matchProject?.uid) {
                return {
                    state: false,
                    message: 'Project not found.'
                };
            }

            const detailUrl = new URL(`${process.env.WAIM_API_URL}/api/project/${matchProject.uid}`);

            const detailRes = await fetch(detailUrl.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                }
            });

            let detailData: CommonApiResponse<ProjectData> | undefined = undefined;

            try {
                detailData = await detailRes.json();
            }
            catch (e) {
                /** empty */
            }

            if (!detailRes.ok || detailData === undefined) {
                return {
                    state: false,
                    message: detailData?.message ?? 'Server connect failed.'
                }
            }

            return {
                state: detailData.state,
                message: detailData.message,
                data: detailData.result
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
                    project_alias : options?.projectAlias,
                    group_uid : options?.groupUid
                })
            })

            let data: CommonApiResponse | undefined = undefined;

            

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


    static removeProject = async (projectUid : string ,  config?: Partial<CommonApiProp>): Promise<CommonApiResult> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/project/${projectUid}`);

            const res = await fetch(apiUrl.toString(), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                }
            })

            let data: CommonApiResponse | undefined = undefined;

            

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

    static getProjectPermissions = async (projectUid: string, config?: Partial<CommonApiProp>): Promise<CommonApiResult<ProjectPermissionListResponse>> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/project/${projectUid}/permission`);

            const res = await fetch(apiUrl.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                }
            })

            let data: CommonApiResponse<ProjectPermissionListResponse> | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
                /** empty */
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

    static addProjectPermission = async (projectUid: string, options: AddProjectPermissionOption, config?: Partial<CommonApiProp>): Promise<CommonApiResult> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/project/${projectUid}/permission`);

            const res = await fetch(apiUrl.toString(), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                },
                body: JSON.stringify({
                    user_id: options.userIdOrEmail,
                    user_email: options.userIdOrEmail,
                    role: options.role
                })
            })

            let data: CommonApiResponse | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
                /** empty */
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

    static updateProjectPermission = async (projectUid: string, options: UpdateProjectPermissionOption, config?: Partial<CommonApiProp>): Promise<CommonApiResult> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/project/${projectUid}/permission/${options.permissionUid}`);

            const res = await fetch(apiUrl.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                },
                body: JSON.stringify({
                    role: options.role
                })
            })

            let data: CommonApiResponse | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
                /** empty */
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

    static removeProjectPermission = async (projectUid: string, permissionUid: string, config?: Partial<CommonApiProp>): Promise<CommonApiResult> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/project/${projectUid}/permission/${permissionUid}`);

            const res = await fetch(apiUrl.toString(), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                }
            })

            let data: CommonApiResponse | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
                /** empty */
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

    static getProjectPermissionMeta = async (config?: Partial<CommonApiProp>): Promise<CommonApiResult<ProjectPermissionMetaResponse>> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/project/permission/meta`);

            const res = await fetch(apiUrl.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                }
            })

            let data: CommonApiResponse<ProjectPermissionMetaResponse> | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
                /** empty */
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

    static searchProjectJobs = async (projectUid: string, options?: SearchProjectJobProp, config?: Partial<CommonApiProp>): Promise<CommonPageableApiResult<ProjectJobData[]>> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/project/${encodeURIComponent(projectUid)}/job`);

            if (typeof options?.page === 'number') {
                apiUrl.searchParams.set('page', options.page.toString());
            }

            if (typeof options?.size === 'number') {
                apiUrl.searchParams.set('size', options.size.toString());
            }

            const res = await fetch(apiUrl.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                }
            });

            let data: CommonPageableApiResponse<ProjectJobData[]> | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
                /** empty */
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

    static addProjectJob = async (projectUid: string, options: UpsertProjectJobOption, config?: Partial<CommonApiProp>): Promise<CommonApiResult<ProjectJobData>> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/project/${encodeURIComponent(projectUid)}/job`);

            const res = await fetch(apiUrl.toString(), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                },
                body: JSON.stringify({
                    task_type: options.taskType,
                    interval_delay: options.intervalDelay,
                    task_status: options.taskStatus,
                    attributes: options.attributes
                })
            });

            let data: CommonApiResponse<ProjectJobData> | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
                /** empty */
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

    static updateProjectJob = async (projectUid: string, jobUid: string, options: UpsertProjectJobOption, config?: Partial<CommonApiProp>): Promise<CommonApiResult<ProjectJobData>> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/project/${encodeURIComponent(projectUid)}/job/${encodeURIComponent(jobUid)}`);

            const res = await fetch(apiUrl.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                },
                body: JSON.stringify({
                    task_type: options.taskType,
                    interval_delay: options.intervalDelay,
                    task_status: options.taskStatus,
                    attributes: options.attributes
                })
            });

            let data: CommonApiResponse<ProjectJobData> | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
                /** empty */
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

    static removeProjectJob = async (projectUid: string, jobUid: string, config?: Partial<CommonApiProp>): Promise<CommonApiResult> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/project/${encodeURIComponent(projectUid)}/job/${encodeURIComponent(jobUid)}`);

            const res = await fetch(apiUrl.toString(), {
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
                /** empty */
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

    static searchProjectJobLogs = async (projectUid: string, options?: SearchProjectJobLogProp, config?: Partial<CommonApiProp>): Promise<CommonPageableApiResult<ProjectJobLogData[]>> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/project/${encodeURIComponent(projectUid)}/job/log`);

            if (typeof options?.page === 'number') {
                apiUrl.searchParams.set('page', options.page.toString());
            }

            if (typeof options?.size === 'number') {
                apiUrl.searchParams.set('size', options.size.toString());
            }

            if (options?.jobUid) {
                apiUrl.searchParams.set('job_uid', options.jobUid);
            }

            const res = await fetch(apiUrl.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ""}`
                }
            });

            let data: CommonPageableApiResponse<ProjectJobLogData[]> | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
                /** empty */
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
}