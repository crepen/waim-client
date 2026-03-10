import '../../../../assets/styles/layout/main.layout.scss';
import authConfig from '@/config/auth/AuthConfig';
import { AuthProvider } from '@crepen/auth';
import { AuthApiProvider } from '@waim/api';
import { ProfileMenuButton } from '@/components/layout/common/crp-layout/ProfileMenuButton';
import { getLocale, getTranslations } from 'next-intl/server';
import { PropsWithChildren } from "react";
import { CrpLayout, CrpLayoutContent, CrpLayoutHeader, CrpLayoutNav } from '@/components/layout/common/crp-layout/CrpLayout';
import { Anchor, Badge, Box, Group, NavLink, Stack, Text, Title } from '@mantine/core';

const MainLayoutRoute = async (prop: PropsWithChildren) => {
    const locale = await getLocale();
    const t = await getTranslations('main.layout');

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
    const localeBasePath = `/${locale}`;


    return (
        <CrpLayout
            className='main-layout'
        >
            <CrpLayoutHeader
                className='main-layout-header'
            >
                <Group justify='space-between' wrap='nowrap'>
                    <Group gap='sm'>
                        <Anchor href={localeBasePath} c='inherit' underline='never'>
                            <Title order={4}>WAIM</Title>
                        </Anchor>
                        <Badge variant='light' color='teal'>
                            WORKSPACE
                        </Badge>
                    </Group>

                    <Group gap='md'>
                        <Text size='sm' c='dimmed'>
                            Web Access Information Management
                        </Text>

                        <ProfileMenuButton
                            profileName={profileName}
                            isAdmin={isAdmin}
                        />
                    </Group>
                </Group>
            </CrpLayoutHeader>
            <CrpLayoutNav
                className='main-layout-nav'
            >
                <Stack className='menu-list' gap='xs'>
                    <Text className='menu-title'>{t('management')}</Text>
                    <NavLink label={t('control_center')} href={localeBasePath} />
                    <NavLink label={t('groups')} href={`${localeBasePath}/group`} />
                    <NavLink label={t('projects')} href={`${localeBasePath}/project`} />
                </Stack>
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