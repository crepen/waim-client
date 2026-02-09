import { CustomProxyChain } from "./chain";
import { NextResponse } from 'next/server'

export const chain = (functions: Array<(middleware: CustomProxyChain) => CustomProxyChain>, index = 0): CustomProxyChain => {
    const current = functions[index];
    if (current) {
        const next = chain(functions, index + 1);
        return current(next);
    }
    return async () => NextResponse.next();
}
