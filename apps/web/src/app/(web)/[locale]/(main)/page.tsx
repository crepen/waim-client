'use server'

import authConfig from '@/config/auth/AuthConfig';
import { MainContainer, MainContainerHeader, MainContainerScrollContent } from '@/components/layout/common/page-container/PageContainer';
import { AuthProvider } from '@crepen/auth';
import { Alert, Badge, Box, Button, Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { AuthApiProvider, GroupApiProvider, ProjectApiProvider } from '@waim/api';
import { getLocale, getTranslations } from 'next-intl/server';

const MainPage = async () => {
    const locale = await getLocale();
    const t = await getTranslations('main.dashboard');

    const session = await AuthProvider
        .setConfig(authConfig(locale, ''))
        .getSession();

    const userInfoRes = await AuthApiProvider.getUserInfo({
        locale,
        token: session?.token?.accessToken ?? ''
    });

    const groupRes = await GroupApiProvider.searchGroup(
        {
            page: 0,
            size: 1
        },
        {
            locale,
            token: session?.token?.accessToken ?? ''
        }
    );

    const projectRes = await ProjectApiProvider.searchProject(
        {
            page: 0,
            size: 1
        },
        {
            locale,
            token: session?.token?.accessToken ?? ''
        }
    );

    const userId = userInfoRes.data?.id ?? session?.user?.id ?? '-';
    const userName = userInfoRes.data?.name ?? session?.user?.name ?? '-';
    const userEmail = userInfoRes.data?.email ?? session?.user?.email ?? '-';
    const roles = userInfoRes.data?.roles ?? session?.user?.roles ?? [];

    return (
        <MainContainer>
            <MainContainerHeader>
                <Box>
                    <Title order={4}>{t('title')}</Title>
                    <Text c="dimmed">{t('description')}</Text>
                </Box>
            </MainContainerHeader>
            <MainContainerScrollContent>
                <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md" p="md">
                    <Card withBorder>
                        <Text size="xs" c="dimmed">{t('groups')}</Text>
                        <Title order={3}>{groupRes.pageable?.total_element ?? 0}</Title>
                        <Group mt="md">
                            <Button component={'a'} href="/group" variant="light" size="xs">{t('open')}</Button>
                        </Group>
                    </Card>

                    <Card withBorder>
                        <Text size="xs" c="dimmed">{t('projects')}</Text>
                        <Title order={3}>{projectRes.pageable?.total_element ?? 0}</Title>
                        <Group mt="md">
                            <Button component={'a'} href="/project" variant="light" size="xs">{t('open')}</Button>
                            <Button component={'a'} href="/project/add" variant="subtle" size="xs">{t('add')}</Button>
                        </Group>
                    </Card>

                    <Card withBorder>
                        <Text size="xs" c="dimmed" mb="xs">{t('signed_user')}</Text>
                        <Text size="sm">{userName}</Text>
                        <Text size="xs" c="dimmed">{userId}</Text>
                        <Text size="xs" c="dimmed">{userEmail}</Text>
                        <Group mt="sm" gap="xs">
                            {roles.length > 0
                                ? roles.map((role) => <Badge key={role}>{role}</Badge>)
                                : <Badge variant="light">{t('no_role')}</Badge>}
                        </Group>
                    </Card>
                </SimpleGrid>

                <Box px="md" pb="md">
                    <Card withBorder>
                        <Stack gap="xs">
                            <Text fw={700}>{t('workspace_flow')}</Text>
                            <Text size="sm" c="dimmed">{t('flow_1')}</Text>
                            <Text size="sm" c="dimmed">{t('flow_2')}</Text>
                            <Text size="sm" c="dimmed">{t('flow_3')}</Text>
                        </Stack>
                    </Card>
                </Box>

                {userInfoRes.state !== true && (
                    <Box px="md" pb="md">
                        <Alert color="orange" title={t('api_message')}>
                            {userInfoRes.message ?? t('user_info_error')}
                        </Alert>
                    </Box>
                )}
            </MainContainerScrollContent>
        </MainContainer>
    );
}

export default MainPage;