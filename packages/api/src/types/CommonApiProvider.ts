export type CommonApiProp = {
    locale : string,
    token : string
}



export type CommonApiResult<T extends object = object> = {
    state : boolean,
    message? : string,
    data? : T
}


export type CommonApiResponse<T extends object = object> = {
    state : boolean,
    message?:  string,
    timestamp : number,
    code? : string,
    result? : T
}


// export type CommonApiResponse = CommonApiResponse<Object>;