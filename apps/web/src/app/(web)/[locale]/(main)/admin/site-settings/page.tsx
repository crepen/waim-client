import { MainContainer, MainContainerHeader, MainContainerScrollContent } from '@/components/layout/common/page-container/PageContainer';
import { AdminSmtpSettingsForm } from '@/components/page/main/admin/AdminSmtpSettingsForm';
import { GetAdminSmtpSettingsAction } from '@/libs/actions/AdminSiteSettingsAction';
import { Box, Text, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';

const AdminSiteSettingsPage = async () => {
    const t = await getTranslations('main.admin');
    const smtpSettingsRes = await GetAdminSmtpSettingsAction();

    return (
        <MainContainer>
            <MainContainerHeader>
                <Box>
                    <Title order={4}>{t('site_settings_title')}</Title>
                    <Text c='dimmed'>{t('site_settings_desc')}</Text>
                </Box>
            </MainContainerHeader>
            <MainContainerScrollContent>
                <Box p='md'>
                    <AdminSmtpSettingsForm
                        initialValue={smtpSettingsRes.data}
                        initialMessage={smtpSettingsRes.state ? undefined : (smtpSettingsRes.message ?? t('smtp_settings_load_failed'))}
                    />
                </Box>
            </MainContainerScrollContent>
        </MainContainer>
    );
};

export default AdminSiteSettingsPage;
