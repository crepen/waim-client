import { StringUtil } from "@crepen/util";
import { CustomProxyChain } from "./chain";
import { NextResponse } from "next/server";
import { AuthProvider } from '@crepen/auth'
import authConfig from "@/config/auth/AuthConfig";
import * as DateFns from 'date-fns'
import { I18nConfig } from "../i18n/i18n.config";
import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";


export const chainAuth: (middleware: CustomProxyChain) => CustomProxyChain =
  (next) => async (request, event) => {
    
    const { pathname } = request.nextUrl;

    // 1. URL Pathname에서 직접 locale 추출 (예: /en/login -> en)
    const segments = pathname.split('/');
    // I18nConfig에 정의된 locales 중 하나인지 확인
    const localeFromPath = I18nConfig.routing.locales.find(l => l === segments[1]);
    
    // 2. 쿠키나 기본값 확인
    const locale = localeFromPath || 
                   request.cookies.get('NEXT_LOCALE')?.value || 
                   I18nConfig.routing.defaultLocale;


    const initLocale = StringUtil.hasText(locale) ? locale : I18nConfig.initConfig.defaultLocale;

    const authConfigure = authConfig(locale);
    const authProvider = new AuthProvider(authConfigure);


    const tokenExpireDate = await authProvider.getSessionExpireDate();

    const isAccessTokenExpired = await authProvider.isAccessTokenExpired();
    const isRefreshTokenExpired = await authProvider.isRefreshTokenExpired();

    const isLoginPage = pathname.includes("/login");

    if (isLoginPage) {
      // Login page 접속중일 경우

      if (!(isAccessTokenExpired && isRefreshTokenExpired)) {
        // Access Token / Refresh Token 모두 유효

        const mainUrl = new URL(`/${initLocale}`, request.url);
        return NextResponse.redirect(mainUrl);
      }
    }
    else {
      // 일반 페이지 접속중일 경우

      if (!tokenExpireDate || (isAccessTokenExpired && isRefreshTokenExpired)) {
        // Access Token / Refresh Token 모두 만료

        // Session Clear
        await authProvider.clear();
        const loginUrl = new URL(`/${initLocale}/login`, request.url);
        return NextResponse.redirect(loginUrl);
      }

      const checkDate = DateFns.addMinutes(tokenExpireDate, -20);

      // Access Token 만료 20분 전일 경우 Token Refresh
      if (isAccessTokenExpired || checkDate < new Date()) {
        // Token Refresh

        const refreshRes = await authProvider.refresh();

        if (refreshRes.state !== true) {
          // Refresh 실패 시

          // Session Clear
          await authProvider.clear();
          console.error('REFRESH ERROR : ', refreshRes.message);
        }
      }
    }

    (await cookies()).set('WAIM_LOCALE' , 'en')


    return next(request, event, async () => { });
  };  
