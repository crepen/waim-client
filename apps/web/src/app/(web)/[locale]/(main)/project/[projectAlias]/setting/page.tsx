'use server'

import authConfig from '@/config/auth/AuthConfig';
import { MainContainer, MainContainerHeader, MainContainerScrollContent } from '@/components/layout/common/page-container/PageContainer';
import { ProjectPermissionForm } from '@/components/page/main/project/ProjectPermissionForm';
import { AuthProvider } from '@crepen/auth';
import { Alert, Space, Title } from '@mantine/core';
import { ProjectApiProvider } from '@waim/api';
import { getLocale, getTranslations } from 'next-intl/server';

type ProjectSettingPageProps = {
    params: Promise<{ projectAlias: string }>;
}

const ProjectSettingPage = async (props: ProjectSettingPageProps) => {
    const { projectAlias } = await props.params;
    const locale = await getLocale();
    const t = await getTranslations('main.project');

    const session = await AuthProvider
        .setConfig(authConfig(locale, ''))
        .getSession();

    const detailResult = await ProjectApiProvider.getProjectDetail(
        projectAlias,
        {
            locale,
            token: session?.token?.accessToken ?? ''
        }
    );

    const permissionResult = detailResult.data?.uid
        ? await ProjectApiProvider.getProjectPermissions(
            detailResult.data.uid,
            {
                locale,
                token: session?.token?.accessToken ?? ''
            }
        )
        : {
            state: false,
            message: t('permission_load_failed')
        };

    const permissionMetaResult = await ProjectApiProvider.getProjectPermissionMeta(
        {
            locale,
            token: session?.token?.accessToken ?? ''
        }
    );

    return (
        <MainContainer>
            <MainContainerHeader>
                <Title order={5}>{t('setting_title')}</Title>
            </MainContainerHeader>

            <MainContainerScrollContent>
                <Space h={10} />
                {(detailResult.state !== true || permissionResult.state !== true || permissionMetaResult.state !== true) && (
                    <Alert color="orange" title={t('api_list_error')} mb="md">
                        {detailResult.state !== true
                            ? (detailResult.message ?? t('api_list_error'))
                            : permissionResult.state !== true
                                ? (permissionResult.message ?? t('permission_load_failed'))
                                : (permissionMetaResult.message ?? t('permission_load_failed'))}
                    </Alert>
                )}

                {detailResult.data?.uid && (
                    <ProjectPermissionForm
                        projectUid={detailResult.data.uid}
                        permissions={permissionResult.data ?? []}
                        permissionMeta={permissionMetaResult.data ?? []}
                    />
                )}
            </MainContainerScrollContent>
        </MainContainer>
    )
}

export default ProjectSettingPage;