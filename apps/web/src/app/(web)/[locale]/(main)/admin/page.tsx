import { MainContainer, MainContainerHeader, MainContainerScrollContent } from '@/components/layout/common/page-container/PageContainer';
import { Box, Card, Stack, Text, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';

const AdminPage = async () => {
    const t = await getTranslations('main.admin');

    return (
        <MainContainer>
            <MainContainerHeader>
                <Box>
                    <Title order={4}>{t('title')}</Title>
                    <Text c='dimmed'>{t('description')}</Text>
                </Box>
            </MainContainerHeader>
            <MainContainerScrollContent>
                <Box p='md'>
                    <Card withBorder>
                        <Stack gap='xs'>
                            <Text fw={700}>{t('menu_title')}</Text>
                            <Text size='sm' c='dimmed'>{t('menu_desc')}</Text>
                        </Stack>
                    </Card>
                </Box>
            </MainContainerScrollContent>
        </MainContainer>
    );
};

export default AdminPage;
