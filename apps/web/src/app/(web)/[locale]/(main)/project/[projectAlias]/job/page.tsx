'use server'

import authConfig from '@/config/auth/AuthConfig';
import { MainContainer, MainContainerHeader, MainContainerScrollContent } from '@/components/layout/common/page-container/PageContainer';
import { ProjectJobOverviewPanel } from '@/components/page/main/project/ProjectJobOverviewPanel';
import { AuthProvider } from '@crepen/auth';
import { Alert, Space, Title } from '@mantine/core';
import { ProjectApiProvider } from '@waim/api';
import { getLocale, getTranslations } from 'next-intl/server';

type ProjectJobPageProps = {
    params: Promise<{ projectAlias: string }>;
}

const ProjectJobPage = async ({ params }: ProjectJobPageProps) => {
    const { projectAlias } = await params;

    const locale = await getLocale();
    const t = await getTranslations('main.project');

    const session = await AuthProvider
        .setConfig(authConfig(locale, ''))
        .getSession();

    const authConfigValue = {
        locale,
        token: session?.token?.accessToken ?? ''
    };

    const detailResult = await ProjectApiProvider.getProjectDetail(projectAlias, authConfigValue);

    const jobsResult = detailResult.data?.uid
        ? await ProjectApiProvider.searchProjectJobs(detailResult.data.uid, { page: 0, size: 50 }, authConfigValue)
        : { state: false, message: t('job_load_failed') };

    const logsResult = detailResult.data?.uid
        ? await ProjectApiProvider.searchProjectJobLogs(detailResult.data.uid, { page: 0, size: 100 }, authConfigValue)
        : { state: false, message: t('job_log_load_failed') };

    return (
        <MainContainer>
            <MainContainerHeader>
                <Title order={5}>{t('job_page_title')}</Title>
            </MainContainerHeader>

            <MainContainerScrollContent>
                <Space h={10} />
                {(detailResult.state !== true || jobsResult.state !== true || logsResult.state !== true) && (
                    <Alert color='orange' title={t('api_list_error')} mb='md'>
                        {detailResult.state !== true
                            ? (detailResult.message ?? t('api_list_error'))
                            : jobsResult.state !== true
                                ? (jobsResult.message ?? t('job_load_failed'))
                                : (logsResult.message ?? t('job_log_load_failed'))}
                    </Alert>
                )}

                {detailResult.data?.uid && (
                    <ProjectJobOverviewPanel
                        projectUid={detailResult.data.uid}
                        jobs={jobsResult.data ?? []}
                        logs={logsResult.data ?? []}
                    />
                )}
            </MainContainerScrollContent>
        </MainContainer>
    );
};

export default ProjectJobPage;
