import { MainContainer, MainContainerHeader, MainContainerScrollContent } from '@/components/layout/common/page-container/PageContainer';
import { Box, Card, Text, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';

const AdminProjectsPage = async () => {
    const t = await getTranslations('main.admin');

    return (
        <MainContainer>
            <MainContainerHeader>
                <Box>
                    <Title order={4}>{t('projects_title')}</Title>
                    <Text c='dimmed'>{t('projects_desc')}</Text>
                </Box>
            </MainContainerHeader>
            <MainContainerScrollContent>
                <Box p='md'>
                    <Card withBorder>
                        <Text size='sm' c='dimmed'>{t('in_progress')}</Text>
                    </Card>
                </Box>
            </MainContainerScrollContent>
        </MainContainer>
    );
};

export default AdminProjectsPage;
