import authConfig from '@/config/auth/AuthConfig';
import { AuthProvider } from '@crepen/auth';
import { AuthApiProvider } from '@waim/api';
import { getLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import type { PropsWithChildren } from 'react';

const AdminLayout = async ({ children }: PropsWithChildren) => {
    const locale = await getLocale();

    const session = await AuthProvider
        .setConfig(authConfig(locale, ''))
        .getSession();

    const userInfoRes = await AuthApiProvider.getUserInfo({
        locale,
        token: session?.token?.accessToken ?? ''
    });

    const roles = userInfoRes.data?.roles ?? session?.user?.roles ?? [];
    const isAdmin = roles.some((role) => role.toLowerCase().includes('admin'));

    if (!isAdmin) {
        redirect('/');
    }

    return children;
};

export default AdminLayout;
