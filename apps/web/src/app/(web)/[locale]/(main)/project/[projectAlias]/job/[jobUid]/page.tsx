'use server'

import authConfig from '@/config/auth/AuthConfig';
import { MainContainer, MainContainerHeader, MainContainerScrollContent } from '@/components/layout/common/page-container/PageContainer';
import { ProjectJobLogTable } from '@/components/page/main/project/ProjectJobLogTable';
import { AuthProvider } from '@crepen/auth';
import { Alert, Badge, Button, Card, Group, SimpleGrid, Space, Stack, Text, Title } from '@mantine/core';
import { ProjectApiProvider } from '@waim/api';
import { getLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

type ProjectJobDetailPageProps = {
    params: Promise<{ projectAlias: string; jobUid: string }>;
}

const ProjectJobDetailPage = async ({ params }: ProjectJobDetailPageProps) => {
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
    const logsResult = detailResult.data?.uid
        ? await ProjectApiProvider.searchProjectJobLogs(detailResult.data.uid, { page: 0, size: 1000, jobUid }, authConfigValue)
        : { state: false, message: t('job_log_load_failed') };

    const job = (jobsResult.data ?? []).find((item) => item.uid === jobUid);
    const jobListHref = `/${locale}/project/${encodeURIComponent(projectAlias)}/job`;
    const jobEditHref = `/${locale}/project/${encodeURIComponent(projectAlias)}/job/${encodeURIComponent(jobUid)}/edit`;

    if (detailResult.data?.uid && jobsResult.state === true && !job) {
        notFound();
    }

    return (
        <MainContainer>
            <MainContainerHeader>
                <Group justify='space-between' w='100%'>
                    <Stack gap={4}>
                        <Title order={5}>{job?.attributes?.JOB_TITLE ?? t('job_detail_title')}</Title>
                        <Text size='sm' c='dimmed'>{t('job_detail_page_desc')}</Text>
                    </Stack>
                    <Group gap='xs'>
                        <Button component='a' href={jobListHref} variant='default' size='xs'>
                            {t('back_to_list')}
                        </Button>
                        <Button component='a' href={jobEditHref} size='xs'>
                            {t('job_edit_button')}
                        </Button>
                    </Group>
                </Group>
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

                {detailResult.data?.uid && job && (
                    <Stack gap='md'>
                        <Card withBorder>
                            <Stack gap='sm'>
                                <Text fw={700}>{t('job_detail_meta_title')}</Text>
                                <Group justify='space-between'>
                                    <Text size='sm' c='dimmed'>{job.uid}</Text>
                                    <Badge color={job.task_status === 'ACTIVE' ? 'teal' : 'gray'} variant='light'>
                                        {job.task_status === 'ACTIVE' ? t('job_status_active') : t('job_status_inactive')}
                                    </Badge>
                                </Group>
                                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing='md'>
                                    <Stack gap={2}>
                                        <Text size='xs' c='dimmed'>{t('job_col_title')}</Text>
                                        <Text>{job.attributes?.JOB_TITLE || '-'}</Text>
                                    </Stack>
                                    <Stack gap={2}>
                                        <Text size='xs' c='dimmed'>{t('job_col_type')}</Text>
                                        <Text>{job.task_type}</Text>
                                    </Stack>
                                    <Stack gap={2}>
                                        <Text size='xs' c='dimmed'>{t('job_col_interval')}</Text>
                                        <Text>{job.interval_delay ?? '-'}</Text>
                                    </Stack>
                                    <Stack gap={2}>
                                        <Text size='xs' c='dimmed'>{t('job_col_uid')}</Text>
                                        <Text>{job.uid}</Text>
                                    </Stack>
                                    <Stack gap={2}>
                                        <Text size='xs' c='dimmed'>{t('job_col_status')}</Text>
                                        <Text>{job.task_status === 'ACTIVE' ? t('job_status_active') : t('job_status_inactive')}</Text>
                                    </Stack>
                                    <Stack gap={2}>
                                        <Text size='xs' c='dimmed'>{t('job_col_next_run')}</Text>
                                        <Text>{job.next_run_timestamp ? new Date(job.next_run_timestamp).toLocaleString() : '-'}</Text>
                                    </Stack>
                                    <Stack gap={2}>
                                        <Text size='xs' c='dimmed'>{t('job_source_method_label')}</Text>
                                        <Text>{job.attributes?.SOURCE_METHOD || '-'}</Text>
                                    </Stack>
                                    <Stack gap={2}>
                                        <Text size='xs' c='dimmed'>{t('job_source_url_label')}</Text>
                                        <Text>{job.attributes?.SOURCE_URL || '-'}</Text>
                                    </Stack>
                                    <Stack gap={2}>
                                        <Text size='xs' c='dimmed'>{t('job_source_headers_label')}</Text>
                                        <Text style={{ whiteSpace: 'pre-wrap' }}>{job.attributes?.SOURCE_HEADERS || '-'}</Text>
                                    </Stack>
                                    <Stack gap={2}>
                                        <Text size='xs' c='dimmed'>{t('job_target_method_label')}</Text>
                                        <Text>{job.attributes?.TARGET_METHOD || '-'}</Text>
                                    </Stack>
                                    <Stack gap={2}>
                                        <Text size='xs' c='dimmed'>{t('job_target_url_label')}</Text>
                                        <Text>{job.attributes?.TARGET_URL || '-'}</Text>
                                    </Stack>
                                    <Stack gap={2}>
                                        <Text size='xs' c='dimmed'>{t('job_target_headers_label')}</Text>
                                        <Text style={{ whiteSpace: 'pre-wrap' }}>{job.attributes?.TARGET_HEADERS || '-'}</Text>
                                    </Stack>
                                </SimpleGrid>
                            </Stack>
                        </Card>

                        <Card withBorder>
                            <Stack gap='sm'>
                                <Text fw={700}>{t('job_detail_logs_title')}</Text>
                                <Text size='sm' c='dimmed'>{t('job_detail_logs_desc')}</Text>
                                <ProjectJobLogTable
                                    projectUid={detailResult.data.uid}
                                    jobs={[job]}
                                    logs={logsResult.data ?? []}
                                    initialJobUid={job.uid}
                                    hideJobFilter
                                    pageSize={10}
                                    autoRefreshMs={5000}
                                />
                            </Stack>
                        </Card>
                    </Stack>
                )}
            </MainContainerScrollContent>
        </MainContainer>
    );
};

export default ProjectJobDetailPage;