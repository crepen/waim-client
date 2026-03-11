import { MainContainer, MainContainerHeader, MainContainerScrollContent } from '@/components/layout/common/page-container/PageContainer';
import { AdminUserSignupPolicyForm } from '@/components/page/main/admin/AdminUserSignupPolicyForm';
import { GetAdminUserSignupPolicyAction } from '@/libs/actions/AdminSiteSettingsAction';
import { Box, Text, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';

const AdminUserSettingsPage = async () => {
    const t = await getTranslations('main.admin');
    const signupPolicyRes = await GetAdminUserSignupPolicyAction();

    return (
        <MainContainer>
            <MainContainerHeader>
                <Box>
                    <Title order={4}>{t('user_settings_title')}</Title>
                    <Text c='dimmed'>{t('user_settings_desc')}</Text>
                </Box>
            </MainContainerHeader>
            <MainContainerScrollContent>
                <Box p='md'>
                    <AdminUserSignupPolicyForm
                        initialValue={signupPolicyRes.data}
                        initialMessage={signupPolicyRes.state ? undefined : (signupPolicyRes.message ?? t('signup_policy_load_failed'))}
                    />
                </Box>
            </MainContainerScrollContent>
        </MainContainer>
    );
};

export default AdminUserSettingsPage;
