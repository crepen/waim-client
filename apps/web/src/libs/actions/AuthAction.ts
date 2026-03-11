'use server'

import authConfig from '@root/config/auth/AuthConfig'
import { AuthProvider } from '@crepen/auth'
import { AuthApiProvider, UserApiProvider } from '@waim/api'
import { cookies } from 'next/headers'
import { getLocale, getTranslations } from 'next-intl/server'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export const LoginAction = async (formData: FormData) => {
    const locale = await getLocale();
    const t = await getTranslations();

    try {
        const id = formData.get('username');
        const password = formData.get('password');

        const signInResult = await AuthProvider
            .setConfig(authConfig(locale, t("auth.default_error_message")))
            .signIn(id?.toString() ?? "", password?.toString() ?? "");

        if (signInResult.state !== true) {
            console.error("Login failed:", signInResult);
            return {
                state: signInResult.state,
                message: signInResult.message,
            };
        }

        let targetLocale: 'ko' | 'en' = locale === 'en' ? 'en' : 'ko';

        const session = await AuthProvider
            .setConfig(authConfig(locale, t("auth.default_error_message")))
            .getSession();

        if (session?.token?.accessToken) {
            const userConfigResult = await UserApiProvider.getUserConfig({
                locale,
                token: session.token.accessToken
            });

            const languageValue = (userConfigResult.data ?? [])
                .find((x) => x.key === 'SITE_LANGUAGE')
                ?.value
                ?.toLowerCase();

            if (languageValue === 'en' || languageValue === 'ko') {
                targetLocale = languageValue;
            }
        }

        const cookieStore = await cookies();
        cookieStore.set('NEXT_LOCALE', targetLocale, {
            path: '/',
            sameSite: 'lax'
        });

        return {
            state: signInResult.state,
            message: signInResult.message,
            locale: targetLocale,
            redirectPath: `/${targetLocale}`
        };


    }
    catch (e) {
        console.error(e);
        return {
            state: false,
            message: t("auth.default_error_message"),
        };
    }
}


export const LogoutAction = async () => {
    const locale = await getLocale();
    try {
        await AuthProvider.setConfig(authConfig(locale)).clear();
        return {
            state: true
        }
    }
    catch (e) {
        if (e instanceof Error) {
            return {
                state: false,
                message: e.message ?? "Unknown Error"
            }
        }
        else {
            return {
                state: false,
                message: "Unknown Error"
            }
        }

    }
}

export const SignupAction = async (formData: FormData) => {
    const locale = await getLocale();
    const t = await getTranslations();

    const userId = (formData.get('userId')?.toString() ?? '').trim();
    const userName = (formData.get('userName')?.toString() ?? '').trim();
    const email = (formData.get('email')?.toString() ?? '').trim();
    const password = (formData.get('password')?.toString() ?? '').trim();
    const confirmPassword = (formData.get('confirmPassword')?.toString() ?? '').trim();

    if (!userId || !userName || !email || !password || !confirmPassword) {
        return {
            state: false,
            message: t('page.login.signup_validation_required')
        };
    }

    if (!EMAIL_REGEX.test(email)) {
        return {
            state: false,
            message: t('page.login.signup_email_invalid')
        };
    }

    if (password !== confirmPassword) {
        return {
            state: false,
            message: t('page.login.signup_password_mismatch')
        };
    }

    try {
        const signupRes = await UserApiProvider.signup(
            {
                userId,
                userName,
                email,
                password
            },
            {
                locale
            }
        );

        return {
            state: signupRes.state,
            message: signupRes.message ?? (signupRes.state ? t('page.login.signup_success') : t('page.login.signup_failed'))
        };
    }
    catch (e) {
        return {
            state: false,
            message: t('auth.default_error_message')
        };
    }
}

export const ForgotPasswordAction = async (formData: FormData) => {
    const locale = await getLocale();
    const t = await getTranslations();

    const email = (formData.get('email')?.toString() ?? '').trim();

    if (!email) {
        return {
            state: false,
            message: t('page.login.forgot_password_validation_required')
        };
    }

    if (!EMAIL_REGEX.test(email)) {
        return {
            state: false,
            message: t('page.login.signup_email_invalid')
        };
    }

    try {
        const resetRes = await AuthApiProvider.forgotPassword(email, { locale });

        return {
            state: resetRes.state,
            message: resetRes.message ?? (resetRes.state ? t('page.login.forgot_password_success') : t('page.login.forgot_password_failed'))
        };
    }
    catch (e) {
        return {
            state: false,
            message: t('auth.default_error_message')
        };
    }
}