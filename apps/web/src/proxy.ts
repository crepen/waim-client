import * as CustomProxy from './modules/proxy-chain/chain.base';
import { chainAuth } from './modules/proxy-chain/chain.auth';
import { chainIntl } from './modules/proxy-chain/chain.Intl';


export default CustomProxy.chain([
    chainAuth,
    chainIntl,
]);

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets|.well-known).*)']
};