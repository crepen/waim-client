import { MainContainer, MainContainerHeader, MainContainerScrollContent } from '@/components/layout/common/page-container/PageContainer';
import { AdminUserDetailForm } from '@/components/page/main/admin/AdminUserDetailForm';
import authConfig from '@/config/auth/AuthConfig';
import { AuthProvider } from '@crepen/auth';
import { Box, Button, Group, Text, Title } from '@mantine/core';
import { UserApiProvider } from '@waim/api';
import { getLocale, getTranslations } from 'next-intl/server';

type AdminUserDetailPageProps = {
    params: Promise<{ uid: string }>
}

const AdminUserDetailPage = async ({ params }: AdminUserDetailPageProps) => {
    const { uid: userId } = await params;
    const locale = await getLocale();
    const t = await getTranslations('main.admin');

    const session = await AuthProvider
        .setConfig(authConfig(locale, ''))
        .getSession();

    const userRes = await UserApiProvider.getAdminUser(
        userId,
        {
            locale,
            token: session?.token?.accessToken ?? ''
        }
    );

    if (!userRes.state || !userRes.data) {
        return (
            <MainContainer>
                <MainContainerHeader>
                    <Box>
                        <Title order={4}>{t('user_detail_title')}</Title>
                        <Text c='dimmed'>{t('user_detail_desc')}</Text>
                    </Box>
                </MainContainerHeader>
                <MainContainerScrollContent>
                    <Box p='md'>
                        <Text c='red'>{t('user_detail_not_found')}</Text>
                        <Group mt='md'>
                            <Button component='a' href={`/${locale}/admin/users`} variant='light' size='xs'>
                                {t('back_to_list')}
                            </Button>
                        </Group>
                    </Box>
                </MainContainerScrollContent>
            </MainContainer>
        );
    }

    return (
        <MainContainer>
            <MainContainerHeader>
                <Group justify='space-between' w='100%'>
                    <Box>
                        <Title order={4}>{t('user_detail_title')}</Title>
                        <Text c='dimmed'>{t('user_detail_desc')}</Text>
                    </Box>
                    <Button component='a' href={`/${locale}/admin/users`} variant='light' size='xs'>
                        {t('back_to_list')}
                    </Button>
                </Group>
            </MainContainerHeader>
            <MainContainerScrollContent>
                <Box p='md'>
                    <AdminUserDetailForm user={userRes.data} />
                </Box>
            </MainContainerScrollContent>
        </MainContainer>
    );
};

export default AdminUserDetailPage;
