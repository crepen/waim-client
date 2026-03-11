'use server'

import authConfig from '@/config/auth/AuthConfig';
import { resolveApiMessage } from '@/libs/service/ApiMessageResolver';
import { AuthProvider } from '@crepen/auth';
import { UserApiProvider } from '@waim/api';
import { getLocale, getTranslations } from 'next-intl/server';

const USER_SIGNUP_REQUIRE_ADMIN_APPROVAL_KEY = 'USER_SIGNUP_REQUIRE_ADMIN_APPROVAL';
const USER_SIGNUP_PASSWORD_REQUIRE_UPPERCASE_KEY = 'USER_SIGNUP_PASSWORD_REQUIRE_UPPERCASE';
const USER_SIGNUP_PASSWORD_REQUIRE_SYMBOL_KEY = 'USER_SIGNUP_PASSWORD_REQUIRE_SYMBOL';
const USER_SIGNUP_PASSWORD_ALLOWED_SYMBOLS_KEY = 'USER_SIGNUP_PASSWORD_ALLOWED_SYMBOLS';
const USER_SIGNUP_PASSWORD_REQUIRE_NUMBER_KEY = 'USER_SIGNUP_PASSWORD_REQUIRE_NUMBER';
const USER_SIGNUP_PASSWORD_MIN_LENGTH_KEY = 'USER_SIGNUP_PASSWORD_MIN_LENGTH';
const USER_SIGNUP_PASSWORD_MAX_LENGTH_KEY = 'USER_SIGNUP_PASSWORD_MAX_LENGTH';
const USER_SIGNUP_ENABLED_KEY = 'USER_SIGNUP_ENABLED';
const SMTP_HOST_KEY = 'SMTP_HOST';
const SMTP_ENABLED_KEY = 'SMTP_ENABLED';
const SMTP_PORT_KEY = 'SMTP_PORT';
const SMTP_USERNAME_KEY = 'SMTP_USERNAME';
const SMTP_PASSWORD_KEY = 'SMTP_PASSWORD';
const SMTP_FROM_EMAIL_KEY = 'SMTP_FROM_EMAIL';
const SMTP_FROM_NAME_KEY = 'SMTP_FROM_NAME';
const SMTP_AUTH_ENABLED_KEY = 'SMTP_AUTH_ENABLED';
const SMTP_STARTTLS_ENABLED_KEY = 'SMTP_STARTTLS_ENABLED';
const SMTP_SSL_ENABLED_KEY = 'SMTP_SSL_ENABLED';

const DEFAULT_SIGNUP_CONFIG = {
    requireAdminApproval: 'yes',
    requireUppercase: 'yes',
    requireSymbol: 'no',
    allowedSymbols: '!@#$%^&*()-_=+[]{};:,.?',
    requireNumber: 'no',
    minLength: '8',
    maxLength: '64',
    signupEnabled: 'yes'
};

const DEFAULT_SMTP_CONFIG = {
    smtpEnabled: 'no',
    host: 'smtp.example.com',
    port: '587',
    username: 'noreply@example.com',
    password: 'change-me',
    fromEmail: 'noreply@example.com',
    fromName: 'WAIM',
    authEnabled: 'yes',
    startTlsEnabled: 'yes',
    sslEnabled: 'no'
};

export type UserSignupPolicyConfig = {
    requireAdminApproval: string,
    requireUppercase: string,
    requireSymbol: string,
    allowedSymbols: string,
    requireNumber: string,
    minLength: string,
    maxLength: string,
    signupEnabled: string
}

export type SmtpSettingsConfig = {
    smtpEnabled: string,
    host: string,
    port: string,
    username: string,
    password: string,
    fromEmail: string,
    fromName: string,
    authEnabled: string,
    startTlsEnabled: string,
    sslEnabled: string
}

type SmtpSettingsPayload = {
    smtpEnabled: string,
    host: string,
    port: string,
    username: string,
    password: string,
    fromEmail: string,
    fromName: string,
    authEnabled: string,
    startTlsEnabled: string,
    sslEnabled: string,
    parsedPort: number
}

const parseSmtpSettingsPayload = (formData: FormData): SmtpSettingsPayload => {
    const smtpEnabled = (formData.get('smtpEnabled')?.toString() ?? '').trim();
    const host = (formData.get('host')?.toString() ?? '').trim();
    const port = (formData.get('port')?.toString() ?? '').trim();
    const username = (formData.get('username')?.toString() ?? '').trim();
    const password = (formData.get('password')?.toString() ?? '').trim();
    const fromEmail = (formData.get('fromEmail')?.toString() ?? '').trim();
    const fromName = (formData.get('fromName')?.toString() ?? '').trim();
    const authEnabled = (formData.get('authEnabled')?.toString() ?? '').trim();
    const startTlsEnabled = (formData.get('startTlsEnabled')?.toString() ?? '').trim();
    const sslEnabled = (formData.get('sslEnabled')?.toString() ?? '').trim();

    return {
        smtpEnabled,
        host,
        port,
        username,
        password,
        fromEmail,
        fromName,
        authEnabled,
        startTlsEnabled,
        sslEnabled,
        parsedPort: Number(port)
    };
};

export const GetAdminUserSignupPolicyAction = async (): Promise<{
    state: boolean,
    message?: string,
    data: UserSignupPolicyConfig
}> => {
    const locale = await getLocale();
    const t = await getTranslations('main.admin');

    try {
        const authProvider = AuthProvider.setConfig(authConfig(locale));
        const sessionData = await authProvider.getSession();

        const res = await UserApiProvider.getGlobalConfig(
            [
                USER_SIGNUP_REQUIRE_ADMIN_APPROVAL_KEY,
                USER_SIGNUP_PASSWORD_REQUIRE_UPPERCASE_KEY,
                USER_SIGNUP_PASSWORD_REQUIRE_SYMBOL_KEY,
                USER_SIGNUP_PASSWORD_ALLOWED_SYMBOLS_KEY,
                USER_SIGNUP_PASSWORD_REQUIRE_NUMBER_KEY,
                USER_SIGNUP_PASSWORD_MIN_LENGTH_KEY,
                USER_SIGNUP_PASSWORD_MAX_LENGTH_KEY,
                USER_SIGNUP_ENABLED_KEY
            ],
            {
                locale,
                token: sessionData?.token?.accessToken ?? ''
            }
        );

        if (!res.state || !res.data) {
            return {
                state: false,
                message: resolveApiMessage(res.message) ?? t('signup_policy_load_failed'),
                data: DEFAULT_SIGNUP_CONFIG
            };
        }

        const configMap = new Map(res.data.map((item) => [item.key, item.value]));

        return {
            state: true,
            message: resolveApiMessage(res.message),
            data: {
                requireAdminApproval: configMap.get(USER_SIGNUP_REQUIRE_ADMIN_APPROVAL_KEY) ?? DEFAULT_SIGNUP_CONFIG.requireAdminApproval,
                requireUppercase: configMap.get(USER_SIGNUP_PASSWORD_REQUIRE_UPPERCASE_KEY) ?? DEFAULT_SIGNUP_CONFIG.requireUppercase,
                requireSymbol: configMap.get(USER_SIGNUP_PASSWORD_REQUIRE_SYMBOL_KEY) ?? DEFAULT_SIGNUP_CONFIG.requireSymbol,
                allowedSymbols: configMap.get(USER_SIGNUP_PASSWORD_ALLOWED_SYMBOLS_KEY) ?? DEFAULT_SIGNUP_CONFIG.allowedSymbols,
                requireNumber: configMap.get(USER_SIGNUP_PASSWORD_REQUIRE_NUMBER_KEY) ?? DEFAULT_SIGNUP_CONFIG.requireNumber,
                minLength: configMap.get(USER_SIGNUP_PASSWORD_MIN_LENGTH_KEY) ?? DEFAULT_SIGNUP_CONFIG.minLength,
                maxLength: configMap.get(USER_SIGNUP_PASSWORD_MAX_LENGTH_KEY) ?? DEFAULT_SIGNUP_CONFIG.maxLength,
                signupEnabled: configMap.get(USER_SIGNUP_ENABLED_KEY) ?? DEFAULT_SIGNUP_CONFIG.signupEnabled
            }
        };
    }
    catch (e) {
        return {
            state: false,
            message: t('signup_policy_load_failed'),
            data: DEFAULT_SIGNUP_CONFIG
        };
    }
};

export const UpdateAdminUserSignupPolicyAction = async (formData: FormData) => {
    const locale = await getLocale();
    const t = await getTranslations('main.admin');

    const requireAdminApproval = (formData.get('requireAdminApproval')?.toString() ?? '').trim();
    const requireUppercase = (formData.get('requireUppercase')?.toString() ?? '').trim();
    const requireSymbol = (formData.get('requireSymbol')?.toString() ?? '').trim();
    const allowedSymbols = (formData.get('allowedSymbols')?.toString() ?? '').trim();
    const requireNumber = (formData.get('requireNumber')?.toString() ?? '').trim();
    const minLength = (formData.get('minLength')?.toString() ?? '').trim();
    const maxLength = (formData.get('maxLength')?.toString() ?? '').trim();
    const signupEnabled = (formData.get('signupEnabled')?.toString() ?? '').trim();

    if (!requireAdminApproval || !requireUppercase || !requireSymbol || !allowedSymbols || !requireNumber || !minLength || !maxLength || !signupEnabled) {
        return {
            state: false,
            message: t('user_add_validation_required')
        };
    }

    const parsedMinLength = Number(minLength);
    const parsedMaxLength = Number(maxLength);

    if (Number.isNaN(parsedMinLength) || Number.isNaN(parsedMaxLength) || parsedMinLength < 1 || parsedMaxLength < parsedMinLength) {
        return {
            state: false,
            message: t('signup_policy_length_invalid')
        };
    }

    try {
        const authProvider = AuthProvider.setConfig(authConfig(locale));
        const sessionData = await authProvider.getSession();

        const commonConfig = {
            locale,
            token: sessionData?.token?.accessToken ?? ''
        };

        const updates = [
            [USER_SIGNUP_REQUIRE_ADMIN_APPROVAL_KEY, requireAdminApproval],
            [USER_SIGNUP_PASSWORD_REQUIRE_UPPERCASE_KEY, requireUppercase],
            [USER_SIGNUP_PASSWORD_REQUIRE_SYMBOL_KEY, requireSymbol],
            [USER_SIGNUP_PASSWORD_ALLOWED_SYMBOLS_KEY, allowedSymbols],
            [USER_SIGNUP_PASSWORD_REQUIRE_NUMBER_KEY, requireNumber],
            [USER_SIGNUP_PASSWORD_MIN_LENGTH_KEY, String(parsedMinLength)],
            [USER_SIGNUP_PASSWORD_MAX_LENGTH_KEY, String(parsedMaxLength)],
            [USER_SIGNUP_ENABLED_KEY, signupEnabled]
        ] as const;

        for (const [key, value] of updates) {
            const updateRes = await UserApiProvider.updateGlobalConfig(key, value, commonConfig);

            if (!updateRes.state) {
                return {
                    state: false,
                    message: resolveApiMessage(updateRes.message) ?? t('signup_policy_save_failed')
                };
            }
        }

        return {
            state: true,
            message: t('signup_policy_saved')
        };
    }
    catch (e) {
        return {
            state: false,
            message: t('signup_policy_save_failed')
        };
    }
};

export const GetPublicSignupPolicyAction = async (): Promise<{
    state: boolean,
    data: UserSignupPolicyConfig
}> => {
    const locale = await getLocale();

    try {
        const res = await UserApiProvider.getGlobalConfig(
            [
                USER_SIGNUP_REQUIRE_ADMIN_APPROVAL_KEY,
                USER_SIGNUP_PASSWORD_REQUIRE_UPPERCASE_KEY,
                USER_SIGNUP_PASSWORD_REQUIRE_SYMBOL_KEY,
                USER_SIGNUP_PASSWORD_ALLOWED_SYMBOLS_KEY,
                USER_SIGNUP_PASSWORD_REQUIRE_NUMBER_KEY,
                USER_SIGNUP_PASSWORD_MIN_LENGTH_KEY,
                USER_SIGNUP_PASSWORD_MAX_LENGTH_KEY,
                USER_SIGNUP_ENABLED_KEY
            ],
            {
                locale
            }
        );

        if (!res.state || !res.data) {
            return {
                state: false,
                data: DEFAULT_SIGNUP_CONFIG
            };
        }

        const configMap = new Map(res.data.map((item) => [item.key, item.value]));

        return {
            state: true,
            data: {
                requireAdminApproval: configMap.get(USER_SIGNUP_REQUIRE_ADMIN_APPROVAL_KEY) ?? DEFAULT_SIGNUP_CONFIG.requireAdminApproval,
                requireUppercase: configMap.get(USER_SIGNUP_PASSWORD_REQUIRE_UPPERCASE_KEY) ?? DEFAULT_SIGNUP_CONFIG.requireUppercase,
                requireSymbol: configMap.get(USER_SIGNUP_PASSWORD_REQUIRE_SYMBOL_KEY) ?? DEFAULT_SIGNUP_CONFIG.requireSymbol,
                allowedSymbols: configMap.get(USER_SIGNUP_PASSWORD_ALLOWED_SYMBOLS_KEY) ?? DEFAULT_SIGNUP_CONFIG.allowedSymbols,
                requireNumber: configMap.get(USER_SIGNUP_PASSWORD_REQUIRE_NUMBER_KEY) ?? DEFAULT_SIGNUP_CONFIG.requireNumber,
                minLength: configMap.get(USER_SIGNUP_PASSWORD_MIN_LENGTH_KEY) ?? DEFAULT_SIGNUP_CONFIG.minLength,
                maxLength: configMap.get(USER_SIGNUP_PASSWORD_MAX_LENGTH_KEY) ?? DEFAULT_SIGNUP_CONFIG.maxLength,
                signupEnabled: configMap.get(USER_SIGNUP_ENABLED_KEY) ?? DEFAULT_SIGNUP_CONFIG.signupEnabled
            }
        };
    }
    catch (e) {
        return {
            state: false,
            data: DEFAULT_SIGNUP_CONFIG
        };
    }
};

export const GetAdminSmtpSettingsAction = async (): Promise<{
    state: boolean,
    message?: string,
    data: SmtpSettingsConfig
}> => {
    const locale = await getLocale();
    const t = await getTranslations('main.admin');

    try {
        const authProvider = AuthProvider.setConfig(authConfig(locale));
        const sessionData = await authProvider.getSession();

        const res = await UserApiProvider.getGlobalConfig(
            [
                SMTP_ENABLED_KEY,
                SMTP_HOST_KEY,
                SMTP_PORT_KEY,
                SMTP_USERNAME_KEY,
                SMTP_PASSWORD_KEY,
                SMTP_FROM_EMAIL_KEY,
                SMTP_FROM_NAME_KEY,
                SMTP_AUTH_ENABLED_KEY,
                SMTP_STARTTLS_ENABLED_KEY,
                SMTP_SSL_ENABLED_KEY
            ],
            {
                locale,
                token: sessionData?.token?.accessToken ?? ''
            }
        );

        if (!res.state || !res.data) {
            return {
                state: false,
                message: resolveApiMessage(res.message) ?? t('smtp_settings_load_failed'),
                data: DEFAULT_SMTP_CONFIG
            };
        }

        const configMap = new Map(res.data.map((item) => [item.key, item.value]));

        return {
            state: true,
            message: resolveApiMessage(res.message),
            data: {
                smtpEnabled: configMap.get(SMTP_ENABLED_KEY) ?? DEFAULT_SMTP_CONFIG.smtpEnabled,
                host: configMap.get(SMTP_HOST_KEY) ?? DEFAULT_SMTP_CONFIG.host,
                port: configMap.get(SMTP_PORT_KEY) ?? DEFAULT_SMTP_CONFIG.port,
                username: configMap.get(SMTP_USERNAME_KEY) ?? DEFAULT_SMTP_CONFIG.username,
                password: configMap.get(SMTP_PASSWORD_KEY) ?? DEFAULT_SMTP_CONFIG.password,
                fromEmail: configMap.get(SMTP_FROM_EMAIL_KEY) ?? DEFAULT_SMTP_CONFIG.fromEmail,
                fromName: configMap.get(SMTP_FROM_NAME_KEY) ?? DEFAULT_SMTP_CONFIG.fromName,
                authEnabled: configMap.get(SMTP_AUTH_ENABLED_KEY) ?? DEFAULT_SMTP_CONFIG.authEnabled,
                startTlsEnabled: configMap.get(SMTP_STARTTLS_ENABLED_KEY) ?? DEFAULT_SMTP_CONFIG.startTlsEnabled,
                sslEnabled: configMap.get(SMTP_SSL_ENABLED_KEY) ?? DEFAULT_SMTP_CONFIG.sslEnabled
            }
        };
    }
    catch (e) {
        return {
            state: false,
            message: t('smtp_settings_load_failed'),
            data: DEFAULT_SMTP_CONFIG
        };
    }
};

export const UpdateAdminSmtpSettingsAction = async (formData: FormData) => {
    const locale = await getLocale();
    const t = await getTranslations('main.admin');

    const payload = parseSmtpSettingsPayload(formData);

    if (!payload.smtpEnabled || !payload.host || !payload.port || !payload.username || !payload.password || !payload.fromEmail || !payload.fromName || !payload.authEnabled || !payload.startTlsEnabled || !payload.sslEnabled) {
        return {
            state: false,
            message: t('smtp_settings_validation_required')
        };
    }

    if (!Number.isInteger(payload.parsedPort) || payload.parsedPort < 1 || payload.parsedPort > 65535) {
        return {
            state: false,
            message: t('smtp_settings_port_invalid')
        };
    }

    try {
        const authProvider = AuthProvider.setConfig(authConfig(locale));
        const sessionData = await authProvider.getSession();

        const commonConfig = {
            locale,
            token: sessionData?.token?.accessToken ?? ''
        };

        const updateRes = await UserApiProvider.updateSmtpGlobalConfig(
            {
                smtpEnabled: payload.smtpEnabled,
                host: payload.host,
                port: String(payload.parsedPort),
                username: payload.username,
                password: payload.password,
                fromEmail: payload.fromEmail,
                fromName: payload.fromName,
                authEnabled: payload.authEnabled,
                startTlsEnabled: payload.startTlsEnabled,
                sslEnabled: payload.sslEnabled
            },
            commonConfig
        );

        if (!updateRes.state) {
            return {
                state: false,
                message: resolveApiMessage(updateRes.message) ?? t('smtp_settings_save_failed')
            };
        }

        return {
            state: true,
            message: t('smtp_settings_saved')
        };
    }
    catch (e) {
        return {
            state: false,
            message: t('smtp_settings_save_failed')
        };
    }
};

export const TestAdminSmtpSettingsAction = async (formData: FormData) => {
    const locale = await getLocale();
    const t = await getTranslations('main.admin');

    const payload = parseSmtpSettingsPayload(formData);

    if (!payload.smtpEnabled || !payload.host || !payload.port || !payload.username || !payload.password || !payload.fromEmail || !payload.fromName || !payload.authEnabled || !payload.startTlsEnabled || !payload.sslEnabled) {
        return {
            state: false,
            message: t('smtp_settings_validation_required')
        };
    }

    if (!Number.isInteger(payload.parsedPort) || payload.parsedPort < 1 || payload.parsedPort > 65535) {
        return {
            state: false,
            message: t('smtp_settings_port_invalid')
        };
    }

    try {
        const authProvider = AuthProvider.setConfig(authConfig(locale));
        const sessionData = await authProvider.getSession();

        const commonConfig = {
            locale,
            token: sessionData?.token?.accessToken ?? ''
        };

        const testRes = await UserApiProvider.testSmtpGlobalConfig(
            {
                smtpEnabled: payload.smtpEnabled,
                host: payload.host,
                port: String(payload.parsedPort),
                username: payload.username,
                password: payload.password,
                fromEmail: payload.fromEmail,
                fromName: payload.fromName,
                authEnabled: payload.authEnabled,
                startTlsEnabled: payload.startTlsEnabled,
                sslEnabled: payload.sslEnabled
            },
            commonConfig
        );

        if (!testRes.state) {
            return {
                state: false,
                message: resolveApiMessage(testRes.message) ?? t('smtp_settings_test_failed')
            };
        }

        return {
            state: true,
            message: t('smtp_settings_test_success')
        };
    }
    catch (e) {
        return {
            state: false,
            message: t('smtp_settings_test_failed')
        };
    }
};
