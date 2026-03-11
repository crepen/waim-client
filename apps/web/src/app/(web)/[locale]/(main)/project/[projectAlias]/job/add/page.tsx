'use server'

import authConfig from '@/config/auth/AuthConfig';
import { MainContainer, MainContainerHeader, MainContainerScrollContent } from '@/components/layout/common/page-container/PageContainer';
import { ProjectJobManageForm } from '@/components/page/main/project/ProjectJobManageForm';
import { AuthProvider } from '@crepen/auth';
import { Alert, Space, Title } from '@mantine/core';
import { ProjectApiProvider } from '@waim/api';
import { getLocale, getTranslations } from 'next-intl/server';

type ProjectJobAddPageProps = {
    params: Promise<{ projectAlias: string }>;
}

const ProjectJobAddPage = async ({ params }: ProjectJobAddPageProps) => {
    const { projectAlias } = await params;
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

    return (
        <MainContainer>
            <MainContainerHeader>
                <Title order={5}>{t('job_create_title')}</Title>
            </MainContainerHeader>

            <MainContainerScrollContent>
                <Space h={10} />
                {detailResult.state !== true && (
                    <Alert color='orange' title={t('api_list_error')} mb='md'>
                        {detailResult.message ?? t('api_list_error')}
                    </Alert>
                )}

                {detailResult.data?.uid && (
                    <ProjectJobManageForm projectUid={detailResult.data.uid} />
                )}
            </MainContainerScrollContent>
        </MainContainer>
    );
};

export default ProjectJobAddPage;
