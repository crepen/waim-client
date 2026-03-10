'use server'

import authConfig from '@/config/auth/AuthConfig';
import { MainContainer, MainContainerHeader, MainContainerScrollContent } from '@/components/layout/common/page-container/PageContainer';
import { AuthProvider } from '@crepen/auth';
import { Alert, Badge, Box, Card, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { AuthApiProvider } from '@waim/api';
import { getLocale, getTranslations } from 'next-intl/server';

const ProfilePage = async () => {
    const locale = await getLocale();
    const t = await getTranslations('main.profile');

    const session = await AuthProvider
        .setConfig(authConfig(locale, ''))
        .getSession();

    const userInfoRes = await AuthApiProvider.getUserInfo({
        locale,
        token: session?.token?.accessToken ?? ''
    });

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
                <Box p="md" maw={720}>
                    <Card withBorder>
                        <Stack gap="sm">
                            <Box>
                                <Text size="xs" c="dimmed">{t('user_id')}</Text>
                                <Text fw={600}>{userId}</Text>
                            </Box>
                            <Divider />
                            <Box>
                                <Text size="xs" c="dimmed">{t('name')}</Text>
                                <Text fw={600}>{userName}</Text>
                            </Box>
                            <Divider />
                            <Box>
                                <Text size="xs" c="dimmed">{t('email')}</Text>
                                <Text fw={600}>{userEmail}</Text>
                            </Box>
                            <Divider />
                            <Box>
                                <Text size="xs" c="dimmed" mb="xs">{t('roles')}</Text>
                                <Group gap="xs">
                                    {roles.length > 0
                                        ? roles.map((role) => <Badge key={role}>{role}</Badge>)
                                        : <Badge variant="light">{t('no_role')}</Badge>}
                                </Group>
                            </Box>
                        </Stack>
                    </Card>

                    {userInfoRes.state !== true && (
                        <Alert color="orange" title={t('api_message')} mt="md">
                            {userInfoRes.message ?? t('load_failed')}
                        </Alert>
                    )}
                </Box>
            </MainContainerScrollContent>
        </MainContainer>
    );
};

export default ProfilePage;
