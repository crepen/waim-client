import '../../../../assets/styles/layout/main.layout.scss';
import authConfig from '@/config/auth/AuthConfig';
import { AuthProvider } from '@crepen/auth';
import { AuthApiProvider } from '@waim/api';
import { ProfileMenuButton } from '@/components/layout/common/crp-layout/ProfileMenuButton';
import { MainSideNavMenu } from '@/components/layout/common/crp-layout/MainSideNavMenu';
import { getLocale, getTranslations } from 'next-intl/server';
import { PropsWithChildren } from "react";
import { CrpLayout, CrpLayoutContent, CrpLayoutHeader, CrpLayoutNav } from '@/components/layout/common/crp-layout/CrpLayout';
import { Anchor, Group, Title } from '@mantine/core';

const MainLayoutRoute = async (prop: PropsWithChildren) => {
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
    const profileName = userInfoRes.data?.name ?? session?.user?.name ?? 'User';


    return (
        <CrpLayout
            className='main-layout'
        >
            <CrpLayoutHeader
                className='main-layout-header'
            >
                <Group justify='space-between'>
                    <Anchor href="/">
                        <Title order={4}>WAIM</Title>
                    </Anchor>

                    <ProfileMenuButton
                        profileName={profileName}
                        isAdmin={isAdmin}
                    />
                </Group>

            </CrpLayoutHeader>
            <CrpLayoutNav
                className='main-layout-nav'
            >
                <MainSideNavMenu isAdmin={isAdmin} />
            </CrpLayoutNav>
            <CrpLayoutContent
                className='main-layout-content'
            >
                {prop.children}
            </CrpLayoutContent>
        </CrpLayout>
    )


}


export default MainLayoutRoute;