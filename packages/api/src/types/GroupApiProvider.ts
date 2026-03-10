export type GroupData = {
    uid: string;
    group_name: string;
    group_alias: string;
    parent_group_uid?: string | null;
    child_group_count?: number;
    linked_project_count?: number;
}

export type GroupSearchResponse = GroupData[];

export type SearchGroupProp = {
    page?: number;
    keyword?: string;
    size?: number;
}

export type AddGroupOption = {
    groupName: string;
    groupAlias: string;
    parentGroupUid: string;
}

export type UpdateGroupOption = {
    groupUid: string;
    groupName: string;
    groupAlias: string;
    parentGroupUid: string;
}

export type GroupPermissionRole =
    | 'ROLE_GROUP_READ'
    | 'ROLE_GROUP_MODIFY'
    | 'ROLE_GROUP_PROJECT_READ'
    | 'ROLE_GROUP_PROJECT_MODIFY'
    | 'ROLE_GROUP_USER_READ'
    | 'ROLE_GROUP_USER_MODIFY';

export type GroupPermissionData = {
    uid: string;
    group_uid: string;
    user_uid?: string;
    user_id?: string;
    user_name?: string;
    role: GroupPermissionRole;
    create_timestamp?: number;
    update_timestamp?: number;
}

export type GroupPermissionListResponse = GroupPermissionData[];

export type GroupPermissionMetaData = {
    role: GroupPermissionRole;
    display_name: string;
    description: string;
}

export type GroupPermissionMetaResponse = GroupPermissionMetaData[];

export type AddGroupPermissionOption = {
    userIdOrEmail: string;
    role: GroupPermissionRole;
}

export type UpdateGroupPermissionOption = {
    permissionUid: string;
    role: GroupPermissionRole;
}
