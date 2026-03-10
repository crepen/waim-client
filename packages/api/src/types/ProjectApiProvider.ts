export type ProjectSearchResponse = ProjectData[];

export type ProjectData = {
    uid: string;
    project_name: string;
    project_alias: string;
    group_uid?: string | null;
    create_timestamp: number;
    update_timestamp: number;
    project_owner_name: string;
    project_owner_uid: string;
}


export type SearchProjectProp  = {
    page? : number,
    groupUid?: string,
    keyword? : string,
    size? : number
}


export type AddProjectOption = {
    projectName : string;
    projectAlias : string;
    groupUid?: string;
}

export type ProjectPermissionRole =
    | 'ROLE_PROJECT_READ'
    | 'ROLE_PROJECT_MODIFY'
    | 'ROLE_PROJECT_USER_READ'
    | 'ROLE_PROJECT_USER_MODIFY';

export type ProjectPermissionData = {
    uid: string;
    project_uid: string;
    user_uid?: string;
    user_id?: string;
    user_name?: string;
    role: ProjectPermissionRole;
    create_timestamp?: number;
    update_timestamp?: number;
}

export type ProjectPermissionListResponse = ProjectPermissionData[];

export type ProjectPermissionMetaData = {
    role: ProjectPermissionRole;
    display_name: string;
    description: string;
}

export type ProjectPermissionMetaResponse = ProjectPermissionMetaData[];

export type AddProjectPermissionOption = {
    userIdOrEmail: string;
    role: ProjectPermissionRole;
}

export type UpdateProjectPermissionOption = {
    permissionUid: string;
    role: ProjectPermissionRole;
}