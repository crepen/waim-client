export type ProjectSearchResponse = ProjectData[];

export type ProjectData = {
    uid: string;
    project_name: string;
    project_alias: string;
    create_timestamp: number;
    update_timestamp: number;
    project_owner_name: string;
    project_owner_uid: string;
}


export type SearchProjectProp  = {
    page? : number,
    keyword? : string,
    size? : number
}


export type AddProjectOption = {
    projectName : string;
    projectAlias : string;
}