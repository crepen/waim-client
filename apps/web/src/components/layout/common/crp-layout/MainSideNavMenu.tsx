'use client'

import { Box, NavLink, Text } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

type MainSideNavMenuProps = {
    isAdmin: boolean;
};

export const MainSideNavMenu = ({ isAdmin }: MainSideNavMenuProps) => {
    const t = useTranslations('main.layout');
    const pathname = usePathname();

    const isAdminPage = /\/(ko|en)\/admin(\/|$)/.test(pathname);

    if (isAdminPage && isAdmin) {
        return (
            <Box className='menu-list'>
                <Text className='menu-title'>{t('admin_management')}</Text>
                <NavLink label={t('admin_user_management')} href='/admin/users' />
                <NavLink label={t('admin_project_management')} href='/admin/projects' />
                <NavLink label={t('admin_group_management')} href='/admin/groups' />
                <NavLink label={t('admin_site_setting_management')} href='/admin/site-settings' />
            </Box>
        );
    }

    return (
        <Box className='menu-list'>
            <Text className='menu-title'>{t('management')}</Text>
            <NavLink label={t('control_center')} href='/' />
            <NavLink label={t('groups')} href='/group' />
            <NavLink label={t('projects')} href='/project' />
            {isAdmin && <NavLink label={t('admin_page')} href='/admin' />}
        </Box>
    );
};
