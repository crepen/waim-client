import '../../../../assets/styles/layout/main.layout.scss';
import { PropsWithChildren } from "react";
import { CrpLayout, CrpLayoutContent, CrpLayoutHeader, CrpLayoutNav } from '@/components/layout/common/crp-layout/CrpLayout';
import { Anchor, Box, NavLink, Title } from '@mantine/core';

const MainLayoutRoute = (prop: PropsWithChildren) => {


    return (
        <CrpLayout
            className='main-layout'
        >
            <CrpLayoutHeader
                className='main-layout-header'
            >
                <Anchor href="/">
                    <Title order={4}>WAIM</Title>
                </Anchor>

            </CrpLayoutHeader>
            <CrpLayoutNav
                className='main-layout-nav'
            >
                <Box className='menu-list'>
                    <NavLink label="Home" href="/" />
                    <NavLink label="Project" href="/project" />
                    <NavLink label="Setting" href="/settings" />
                </Box>
                <Box className='action-list'>
                    <NavLink label="Logout" href="/logout" />
                </Box>
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