export type UserConfigResponse = UserConfig[]

export type UserConfig = {
    key : string, 
    value : string
}

export type AdminUserData = {
    uid: string,
    userId: string,
    userName: string,
    email: string,
    role: string,
    status: string
}

export type SearchAdminUserProp = {
    page?: number,
    size?: number,
    keyword?: string,
    status?: string
}

export type AddAdminUserProp = {
    userId: string,
    userName: string,
    password: string,
    email: string
}

export type UpdateAdminUserProp = {
    userName?: string,
    email?: string,
    status?: string,
    password?: string,
    role?: string
}