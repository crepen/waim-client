import createMiddleware from 'next-intl/middleware';
import { CustomProxyChain } from "./chain";
import { I18nConfig } from '../i18n/i18n.config';



export const chainIntl: (middleware: CustomProxyChain) => CustomProxyChain =
  (next) => async (request, event) => {
    // intl 미들웨어 실행
    const response = createMiddleware(I18nConfig.routing)(request);
    
    // intl에서 리다이렉트나 응답이 발생하면 그대로 반환, 아니면 다음 체인으로
    if (response) {
      if(request.cookies.get('WAIM_LOCALE')){
        response.cookies.set('NEXT_LOCALE' , request.cookies.get('WAIM_LOCALE')?.value ?? I18nConfig.routing.defaultLocale)
        response.cookies.delete('WAIM_LOCALE');
      }
      return response;
    }
    return next(request, event, async () => { });
  };
