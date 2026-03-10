import { CommonApiProp, CommonApiResponse, CommonApiResult, CommonPageableApiResponse, CommonPageableApiResult } from "./types/CommonApiProvider";
import {
    AddGroupOption,
    AddGroupPermissionOption,
    GroupData,
    GroupPermissionListResponse,
    GroupPermissionMetaResponse,
    GroupSearchResponse,
    SearchGroupProp,
    UpdateGroupOption,
    UpdateGroupPermissionOption
} from "./types/GroupApiProvider";

export class GroupApiProvider {
    static searchGroup = async (options?: SearchGroupProp, config?: Partial<CommonApiProp>): Promise<CommonPageableApiResult<GroupData[]>> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/group`);

            if (typeof options?.page === 'number') {
                apiUrl.searchParams.set('page', options.page.toString());
            }

            if (options?.keyword) {
                apiUrl.searchParams.set('keyword', options.keyword);
            }

            if (options?.size) {
                apiUrl.searchParams.set('size', options.size.toString());
            }

            const res = await fetch(apiUrl.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ''}`
                }
            });

            let data: CommonPageableApiResponse<GroupSearchResponse> | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
            }

            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                };
            }

            return {
                state: data.state,
                message: data.message,
                data: data.result,
                pageable: data.pageable
            };
        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'Server connect failed.'
            };
        }
    }

    static addGroup = async (options: AddGroupOption, config?: Partial<CommonApiProp>): Promise<CommonApiResult> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/group`);

            const res = await fetch(apiUrl.toString(), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ''}`
                },
                body: JSON.stringify({
                    group_name: options.groupName,
                    group_alias: options.groupAlias,
                    parent_group_uid: options.parentGroupUid
                })
            });

            let data: CommonApiResponse | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
            }

            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                };
            }

            return {
                state: data.state,
                message: data.message
            };
        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'Server connect failed.'
            };
        }
    }

    static getGroupDetail = async (groupUid: string, config?: Partial<CommonApiProp>): Promise<CommonApiResult<GroupData>> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/group/${groupUid}`);

            const res = await fetch(apiUrl.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ''}`
                }
            });

            let data: CommonApiResponse<GroupData> | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
            }

            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                };
            }

            return {
                state: data.state,
                message: data.message,
                data: data.result
            };
        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'Server connect failed.'
            };
        }
    }

    static updateGroup = async (options: UpdateGroupOption, config?: Partial<CommonApiProp>): Promise<CommonApiResult> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/group/${options.groupUid}`);

            const res = await fetch(apiUrl.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ''}`
                },
                body: JSON.stringify({
                    group_name: options.groupName,
                    group_alias: options.groupAlias,
                    parent_group_uid: options.parentGroupUid
                })
            });

            let data: CommonApiResponse | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
            }

            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                };
            }

            return {
                state: data.state,
                message: data.message
            };
        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'Server connect failed.'
            };
        }
    }

    static removeGroup = async (groupUid: string, config?: Partial<CommonApiProp>): Promise<CommonApiResult> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/group/${groupUid}`);

            const res = await fetch(apiUrl.toString(), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ''}`
                }
            });

            let data: CommonApiResponse | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
            }

            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                };
            }

            return {
                state: data.state,
                message: data.message
            };
        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'Server connect failed.'
            };
        }
    }

    static getGroupPermissions = async (groupUid: string, config?: Partial<CommonApiProp>): Promise<CommonApiResult<GroupPermissionListResponse>> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/group/${groupUid}/permission`);

            const res = await fetch(apiUrl.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ''}`
                }
            });

            let data: CommonApiResponse<GroupPermissionListResponse> | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
            }

            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                };
            }

            return {
                state: data.state,
                message: data.message,
                data: data.result
            };
        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'Server connect failed.'
            };
        }
    }

    static addGroupPermission = async (groupUid: string, options: AddGroupPermissionOption, config?: Partial<CommonApiProp>): Promise<CommonApiResult> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/group/${groupUid}/permission`);

            const res = await fetch(apiUrl.toString(), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ''}`
                },
                body: JSON.stringify({
                    user_id: options.userIdOrEmail,
                    user_email: options.userIdOrEmail,
                    role: options.role
                })
            });

            let data: CommonApiResponse | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
            }

            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                };
            }

            return {
                state: data.state,
                message: data.message
            };
        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'Server connect failed.'
            };
        }
    }

    static updateGroupPermission = async (groupUid: string, options: UpdateGroupPermissionOption, config?: Partial<CommonApiProp>): Promise<CommonApiResult> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/group/${groupUid}/permission/${options.permissionUid}`);

            const res = await fetch(apiUrl.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ''}`
                },
                body: JSON.stringify({
                    role: options.role
                })
            });

            let data: CommonApiResponse | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
            }

            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                };
            }

            return {
                state: data.state,
                message: data.message
            };
        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'Server connect failed.'
            };
        }
    }

    static removeGroupPermission = async (groupUid: string, permissionUid: string, config?: Partial<CommonApiProp>): Promise<CommonApiResult> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/group/${groupUid}/permission/${permissionUid}`);

            const res = await fetch(apiUrl.toString(), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ''}`
                }
            });

            let data: CommonApiResponse | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
            }

            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                };
            }

            return {
                state: data.state,
                message: data.message
            };
        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'Server connect failed.'
            };
        }
    }

    static getGroupPermissionMeta = async (config?: Partial<CommonApiProp>): Promise<CommonApiResult<GroupPermissionMetaResponse>> => {
        try {
            const apiUrl = new URL(`${process.env.WAIM_API_URL}/api/group/permission/meta`);

            const res = await fetch(apiUrl.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': config?.locale ?? 'ko',
                    'Authorization': `Bearer ${config?.token ?? ''}`
                }
            });

            let data: CommonApiResponse<GroupPermissionMetaResponse> | undefined = undefined;

            try {
                data = await res.json();
            }
            catch (e) {
            }

            if (!res.ok || data === undefined) {
                return {
                    state: false,
                    message: data?.message ?? 'Server connect failed.'
                };
            }

            return {
                state: data.state,
                message: data.message,
                data: data.result
            };
        }
        catch (e) {
            console.error(e);
            return {
                state: false,
                message: 'Server connect failed.'
            };
        }
    }
}
