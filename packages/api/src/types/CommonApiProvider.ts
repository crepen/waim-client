export type CommonApiProp = {
    locale: string,
    token: string
}



export type CommonApiResult<T extends object = object> = {
    state: boolean,
    message?: string,
    data?: T
}

export type CommonPageableApiResult<T extends object = object>
    = CommonApiResult<T> & CommonPageable


export type CommonApiResponse<T extends object = object> = {
    state: boolean,
    message?: string,
    timestamp: number,
    code?: string,
    result?: T
}

export type CommonPageableApiResponse<T extends object = object>
    = CommonApiResponse<T> & CommonPageable

export type CommonPageable = {
    pageable?: {
        page: number,
        size: number,
        page_element: number,
        total_page: number,
        total_element: number,
        is_empty: boolean,
        is_first: boolean,
        is_last: boolean
    }
}


// export type CommonApiResponse = CommonApiResponse<Object>;