export type AuthSignInResponse = {
    access?: AuthResponseToken;
    refresh?: AuthResponseToken;
}

type AuthResponseToken = {
    expired_at?: number;
    token?: string;
}


export type GetUserInfoResponse = {
    unique_id: string;
    id : string;
    name : string;
    email : string;
    roles: string[];
}