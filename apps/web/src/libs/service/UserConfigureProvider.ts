import { cookies } from "next/headers"
import { UserConfig } from "../../../../../packages/api/src/types"

export class UserConfigureProvider {

    static #COOKIE_KEY_PREFIX='WAIM_CONFIG'

    static setConfigure = async (configList : UserConfig[]) => {
        const cookieStorage = await cookies();
        cookieStorage.set(this.#COOKIE_KEY_PREFIX, JSON.stringify(configList) , {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7
        });
    }
}