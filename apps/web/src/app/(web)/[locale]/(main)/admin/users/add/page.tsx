import { MainContainer, MainContainerHeader, MainContainerScrollContent } from '@/components/layout/common/page-container/PageContainer';
import { AdminUserCreateForm } from '@/components/page/main/admin/AdminUserCreateForm';
import { Box, Stack, Text, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';

const AdminUserAddPage = async () => {
    const t = await getTranslations('main.admin');

    return (
        <MainContainer>
            <MainContainerHeader>
                <Box>
                    <Title order={4}>{t('user_add_page_title')}</Title>
                    <Text c='dimmed'>{t('user_add_page_desc')}</Text>
                </Box>
            </MainContainerHeader>
            <MainContainerScrollContent>
                <Box p='md'>
                    <Stack gap='md'>
                        <AdminUserCreateForm />
                    </Stack>
                </Box>
            </MainContainerScrollContent>
        </MainContainer>
    );
};

export default AdminUserAddPage;
