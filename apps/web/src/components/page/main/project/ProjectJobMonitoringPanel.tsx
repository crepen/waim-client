'use client'

import type { ProjectJobData, ProjectJobLogData } from '@waim/api/types';
import { Alert, Badge, Card, Group, Progress, Stack, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';

type ProjectJobMonitoringPanelProps = {
    jobs: ProjectJobData[];
    logs: ProjectJobLogData[];
}

const safeRatio = (value: number, total: number) => {
    if (total <= 0) {
        return 0;
    }

    return Math.round((value / total) * 100);
};

export const ProjectJobMonitoringPanel = ({ jobs, logs }: ProjectJobMonitoringPanelProps) => {
    const t = useTranslations('main.project');

    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((job) => job.task_status === 'ACTIVE').length;
    const inactiveJobs = totalJobs - activeJobs;

    const totalLogs = logs.length;
    const successLogs = logs.filter((log) => log.run_status === 'SUCCESS').length;
    const failedLogs = logs.filter((log) => log.run_status === 'FAILED').length;
    const skippedLogs = logs.filter((log) => log.run_status === 'SKIPPED').length;

    const successRatio = safeRatio(successLogs, totalLogs);
    const failedRatio = safeRatio(failedLogs, totalLogs);
    const skippedRatio = Math.max(0, 100 - successRatio - failedRatio);

    const hasFailureAlert = failedLogs > 0;
    const hasInactiveAlert = inactiveJobs > 0;

    return (
        <Stack gap='md'>
            <Card withBorder>
                <Stack gap='xs'>
                    <Text fw={700}>{t('job_monitoring_title')}</Text>
                    <Text size='sm' c='dimmed'>{t('job_monitoring_desc')}</Text>

                    <Group>
                        <Badge color='blue' variant='light'>{t('job_monitoring_total_jobs', { count: totalJobs })}</Badge>
                        <Badge color='teal' variant='light'>{t('job_monitoring_active_jobs', { count: activeJobs })}</Badge>
                        <Badge color='gray' variant='light'>{t('job_monitoring_inactive_jobs', { count: inactiveJobs })}</Badge>
                    </Group>
                </Stack>
            </Card>

            <Card withBorder>
                <Stack gap='xs'>
                    <Text fw={700}>{t('job_monitoring_chart_title')}</Text>
                    <Text size='sm' c='dimmed'>{t('job_monitoring_chart_desc')}</Text>

                    <Stack gap='xs'>
                        <Text size='sm'>{t('job_monitoring_success', { count: successLogs })} ({successRatio}%)</Text>
                        <Progress size='lg' value={successRatio} color='teal' />

                        <Text size='sm'>{t('job_monitoring_failed', { count: failedLogs })} ({failedRatio}%)</Text>
                        <Progress size='lg' value={failedRatio} color='red' />

                        <Text size='sm'>{t('job_monitoring_skipped', { count: skippedLogs })} ({skippedRatio}%)</Text>
                        <Progress size='lg' value={skippedRatio} color='gray' />
                    </Stack>

                    <Group>
                        <Badge color='teal' variant='light'>{t('job_monitoring_success', { count: successLogs })}</Badge>
                        <Badge color='red' variant='light'>{t('job_monitoring_failed', { count: failedLogs })}</Badge>
                        <Badge color='gray' variant='light'>{t('job_monitoring_skipped', { count: skippedLogs })}</Badge>
                    </Group>
                </Stack>
            </Card>

            {hasFailureAlert && (
                <Alert color='red' title={t('job_monitoring_alert_failed_title')}>
                    {t('job_monitoring_alert_failed_desc', { count: failedLogs })}
                </Alert>
            )}

            {hasInactiveAlert && (
                <Alert color='yellow' title={t('job_monitoring_alert_inactive_title')}>
                    {t('job_monitoring_alert_inactive_desc', { count: inactiveJobs })}
                </Alert>
            )}
        </Stack>
    );
};
