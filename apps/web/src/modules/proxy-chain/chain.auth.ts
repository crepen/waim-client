import { StringUtil } from "@crepen/util";
import { CustomProxyChain } from "./chain";
import { NextResponse } from "next/server";
import { AuthProvider } from '@crepen/auth'
import authConfig from "@/config/auth/AuthConfig";
import { I18nConfig } from "../i18n/i18n.config";


export const chainAuth: (middleware: CustomProxyChain) => CustomProxyChain =
  (next) => async (request, event) => {
    
    const { pathname } = request.nextUrl;
    const isServerActionRequest = request.method === 'POST' && request.headers.has('next-action');

    // Next.js Server Action 요청은 HTML redirect 응답을 받으면 클라이언트에서 런타임 오류가 발생할 수 있어 인증 체인 우회.
    if (isServerActionRequest) {
      return next(request, event, async () => { });
    }

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

    const isPublicAuthPage = pathname.includes("/login") || pathname.includes("/signup") || pathname.includes("/forgot-password");

    if (isPublicAuthPage) {
      // 로그인/회원가입 페이지 접속중일 경우

      if (!isAccessTokenExpired && !isRefreshTokenExpired) {
        // Access Token / Refresh Token 모두 유효할 때만 메인으로 이동

        const mainUrl = new URL(`/${initLocale}`, request.url);
        return NextResponse.redirect(mainUrl);
      }
    }
    else {
      // 일반 페이지 접속중일 경우

      if (!tokenExpireDate || isRefreshTokenExpired) {
        // refresh 토큰 만료 또는 세션 없음

        // Session Clear
        await authProvider.clear();
        const loginUrl = new URL(`/${initLocale}/login`, request.url);
        return NextResponse.redirect(loginUrl);
      }

      // 일반 페이지 요청마다 토큰 갱신
      const refreshRes = await authProvider.refresh();

      if (refreshRes.state !== true) {
        // Refresh 실패 시 세션을 비우고 로그인 페이지로 이동
        await authProvider.clear();
        console.error('REFRESH ERROR : ', refreshRes.message);
        const loginUrl = new URL(`/${initLocale}/login`, request.url);
        return NextResponse.redirect(loginUrl);
      }
    }

    // (await cookies()).set('WAIM_LOCALE' , 'en')


    return next(request, event, async () => { });
  };  
