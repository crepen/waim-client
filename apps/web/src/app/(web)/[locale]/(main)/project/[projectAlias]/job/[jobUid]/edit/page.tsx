'use server'

import authConfig from '@/config/auth/AuthConfig';
import { MainContainer, MainContainerHeader, MainContainerScrollContent } from '@/components/layout/common/page-container/PageContainer';
import { ProjectJobManageForm } from '@/components/page/main/project/ProjectJobManageForm';
import { AuthProvider } from '@crepen/auth';
import { Alert, Button, Group, Space, Stack, Text, Title } from '@mantine/core';
import { ProjectApiProvider } from '@waim/api';
import { getLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

type ProjectJobEditPageProps = {
    params: Promise<{ projectAlias: string; jobUid: string }>;
}

const ProjectJobEditPage = async ({ params }: ProjectJobEditPageProps) => {
    const { projectAlias, jobUid } = await params;
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
        ? await ProjectApiProvider.searchProjectJobs(detailResult.data.uid, { page: 0, size: 200 }, authConfigValue)
        : { state: false, message: t('job_load_failed') };

    const job = (jobsResult.data ?? []).find((item) => item.uid === jobUid);
    const jobDetailHref = `/${locale}/project/${encodeURIComponent(projectAlias)}/job/${encodeURIComponent(jobUid)}`;
    const jobListHref = `/${locale}/project/${encodeURIComponent(projectAlias)}/job`;

    if (detailResult.data?.uid && jobsResult.state === true && !job) {
        notFound();
    }

    return (
        <MainContainer>
            <MainContainerHeader>
                <Group justify='space-between' w='100%'>
                    <Stack gap={4}>
                        <Title order={5}>{t('job_edit_title')}</Title>
                        <Text size='sm' c='dimmed'>{t('job_edit_page_desc')}</Text>
                    </Stack>
                    <Group gap='xs'>
                        <Button component='a' href={jobListHref} variant='default' size='xs'>
                            {t('back_to_list')}
                        </Button>
                        <Button component='a' href={jobDetailHref} variant='light' size='xs'>
                            {t('job_detail_button')}
                        </Button>
                    </Group>
                </Group>
            </MainContainerHeader>

            <MainContainerScrollContent>
                <Space h={10} />
                {(detailResult.state !== true || jobsResult.state !== true) && (
                    <Alert color='orange' title={t('api_list_error')} mb='md'>
                        {detailResult.state !== true
                            ? (detailResult.message ?? t('api_list_error'))
                            : (jobsResult.message ?? t('job_load_failed'))}
                    </Alert>
                )}

                {detailResult.data?.uid && job && (
                    <ProjectJobManageForm
                        projectUid={detailResult.data.uid}
                        mode='edit'
                        initialJob={{
                            uid: job.uid,
                            taskType: job.task_type,
                            taskStatus: job.task_status,
                            intervalDelay: job.interval_delay,
                            attributes: job.attributes ?? {}
                        }}
                    />
                )}
            </MainContainerScrollContent>
        </MainContainer>
    );
};

export default ProjectJobEditPage;