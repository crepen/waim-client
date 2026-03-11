'use client'

import { RemoveProjectJobAction } from '@/libs/actions/ProjectJobAction';
import type { ProjectJobData, ProjectJobLogData } from '@waim/api/types';
import { Badge, Button, Card, Group, ScrollArea, Select, Stack, Switch, Table, Text, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

type ProjectJobOverviewPanelProps = {
    projectUid: string;
    jobs: ProjectJobData[];
    logs: ProjectJobLogData[];
}

export const ProjectJobOverviewPanel = ({ projectUid, jobs, logs }: ProjectJobOverviewPanelProps) => {
    const t = useTranslations('main.project');
    const params = useParams<{ locale: string; projectAlias: string }>();
    const router = useRouter();
    const locale = params?.locale ?? 'ko';
    const projectAlias = params?.projectAlias ?? '';

    const [jobTypeFilter, setJobTypeFilter] = useState<string>('ALL');
    const [jobStatusFilter, setJobStatusFilter] = useState<string>('ALL');
    const [jobUidKeyword, setJobUidKeyword] = useState<string>('');
    const [logStatusFilter, setLogStatusFilter] = useState<string>('ALL');
    const [logJobUidFilter, setLogJobUidFilter] = useState<string>('ALL');
    const [logIdentityKeyword, setLogIdentityKeyword] = useState<string>('');
    const [failedFirst, setFailedFirst] = useState<boolean>(false);

    const filteredJobs = useMemo(
        () => jobs.filter((job) => {
            if (jobTypeFilter !== 'ALL' && job.task_type !== jobTypeFilter) {
                return false;
            }

            if (jobStatusFilter !== 'ALL' && job.task_status !== jobStatusFilter) {
                return false;
            }

            if (jobUidKeyword.trim().length > 0 && !job.uid.toLowerCase().includes(jobUidKeyword.trim().toLowerCase())) {
                return false;
            }

            return true;
        }),
        [jobs, jobTypeFilter, jobStatusFilter, jobUidKeyword]
    );

    const filteredLogs = useMemo(() => {
        const priority = (runStatus: string) => {
            if (runStatus === 'FAILED') {
                return 0;
            }

            if (runStatus === 'SKIPPED') {
                return 1;
            }

            return 2;
        };

        const copied = logs
            .filter((log) => {
                if (logStatusFilter !== 'ALL' && log.run_status !== logStatusFilter) {
                    return false;
                }

                if (logJobUidFilter !== 'ALL' && log.task_uid !== logJobUidFilter) {
                    return false;
                }

                if (logIdentityKeyword.trim().length > 0) {
                    const keyword = logIdentityKeyword.trim().toLowerCase();
                    const idxMatch = String(log.idx).includes(keyword);
                    const uidMatch = log.task_uid.toLowerCase().includes(keyword);

                    if (!idxMatch && !uidMatch) {
                        return false;
                    }
                }

                return true;
            })
            .slice();

        copied.sort((a, b) => {
            const timestampA = a.create_timestamp ?? 0;
            const timestampB = b.create_timestamp ?? 0;

            if (!failedFirst) {
                return timestampB - timestampA;
            }

            const priorityA = priority(a.run_status);
            const priorityB = priority(b.run_status);

            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }

            return timestampB - timestampA;
        });

        return copied;
    }, [logs, logStatusFilter, logJobUidFilter, logIdentityKeyword, failedFirst]);

    const remove = async (jobUid: string) => {
        const confirmed = window.confirm(t('job_delete_confirm'));

        if (!confirmed) {
            return;
        }

        const result = await RemoveProjectJobAction(projectUid, jobUid);

        if (!result.state) {
            toast.error(result.message ?? t('job_delete_failed'));
            return;
        }

        toast.success(result.message ?? t('job_delete_success'));
        router.refresh();
    };

    return (
        <Stack gap='md'>
            <Card withBorder>
                <Stack gap='sm'>
                    <Group justify='space-between'>
                        <Text fw={700}>{t('job_list_title')}</Text>
                        <Button component={Link} href={`/${locale}/project/${encodeURIComponent(projectAlias)}/job/add`} size='xs'>
                            {t('job_add_page_button')}
                        </Button>
                    </Group>
                    <Text size='sm' c='dimmed'>{t('job_list_desc')}</Text>

                    <Group grow>
                        <Select
                            label={t('job_filter_type_label')}
                            value={jobTypeFilter}
                            onChange={(value) => setJobTypeFilter(value ?? 'ALL')}
                            data={[
                                { value: 'ALL', label: t('job_filter_all') },
                                { value: 'API_CRAWLER', label: 'INTERFACE' },
                                { value: 'SCHEDULER', label: 'SCHEDULER' },
                                { value: 'API_HOOK', label: 'HOOK' }
                            ]}
                            allowDeselect={false}
                        />
                        <Select
                            label={t('job_filter_status_label')}
                            value={jobStatusFilter}
                            onChange={(value) => setJobStatusFilter(value ?? 'ALL')}
                            data={[
                                { value: 'ALL', label: t('job_filter_all') },
                                { value: 'ACTIVE', label: t('job_status_active') },
                                { value: 'INACTIVE', label: t('job_status_inactive') }
                            ]}
                            allowDeselect={false}
                        />
                        <TextInput
                            label={t('job_filter_uid_label')}
                            value={jobUidKeyword}
                            onChange={(event) => setJobUidKeyword(event.currentTarget.value)}
                            placeholder={t('job_filter_uid_placeholder')}
                        />
                    </Group>

                    <Table striped withTableBorder withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>{t('job_col_no')}</Table.Th>
                                <Table.Th>{t('job_col_uid')}</Table.Th>
                                <Table.Th>{t('job_col_title')}</Table.Th>
                                <Table.Th>{t('job_col_type')}</Table.Th>
                                <Table.Th>{t('job_col_interval')}</Table.Th>
                                <Table.Th>{t('job_col_status')}</Table.Th>
                                <Table.Th>{t('job_col_next_run')}</Table.Th>
                                <Table.Th>{t('job_col_action')}</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {filteredJobs.map((item, index) => (
                                <Table.Tr key={item.uid}>
                                    <Table.Td>{index + 1}</Table.Td>
                                    <Table.Td>{item.uid}</Table.Td>
                                    <Table.Td>{item.attributes?.JOB_TITLE || '-'}</Table.Td>
                                    <Table.Td>{item.task_type}</Table.Td>
                                    <Table.Td>{item.interval_delay ?? '-'}</Table.Td>
                                    <Table.Td>
                                        <Badge color={item.task_status === 'ACTIVE' ? 'teal' : 'gray'} variant='light'>
                                            {item.task_status === 'ACTIVE' ? t('job_status_active') : t('job_status_inactive')}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>{item.next_run_timestamp ? new Date(item.next_run_timestamp).toLocaleString() : '-'}</Table.Td>
                                    <Table.Td>
                                        <Button size='xs' variant='light' color='red' onClick={() => void remove(item.uid)}>
                                            {t('permission_remove_button')}
                                        </Button>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                            {filteredJobs.length === 0 && (
                                <Table.Tr>
                                    <Table.Td colSpan={8}>
                                        <Text c='dimmed' size='sm'>{t('job_empty')}</Text>
                                    </Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table>
                </Stack>
            </Card>

            <Card withBorder>
                <Stack gap='sm'>
                    <Text fw={700}>{t('job_log_title')}</Text>
                    <Text size='sm' c='dimmed'>{t('job_log_desc')}</Text>

                    <Group grow>
                        <Select
                            label={t('job_log_filter_status_label')}
                            value={logStatusFilter}
                            onChange={(value) => setLogStatusFilter(value ?? 'ALL')}
                            data={[
                                { value: 'ALL', label: t('job_filter_all') },
                                { value: 'SUCCESS', label: 'SUCCESS' },
                                { value: 'FAILED', label: 'FAILED' },
                                { value: 'SKIPPED', label: 'SKIPPED' }
                            ]}
                            allowDeselect={false}
                        />
                        <Select
                            label={t('job_log_filter_job_label')}
                            value={logJobUidFilter}
                            onChange={(value) => setLogJobUidFilter(value ?? 'ALL')}
                            data={[
                                { value: 'ALL', label: t('job_filter_all') },
                                ...jobs.map((job) => ({
                                    value: job.uid,
                                    label: `${job.task_type} (${job.uid.slice(0, 8)})`
                                }))
                            ]}
                            allowDeselect={false}
                        />
                        <TextInput
                            label={t('job_log_filter_identity_label')}
                            value={logIdentityKeyword}
                            onChange={(event) => setLogIdentityKeyword(event.currentTarget.value)}
                            placeholder={t('job_log_filter_identity_placeholder')}
                        />
                    </Group>

                    <Switch
                        checked={failedFirst}
                        onChange={(event) => setFailedFirst(event.currentTarget.checked)}
                        label={t('job_log_failed_first_label')}
                    />

                    <ScrollArea>
                        <Table striped withTableBorder withColumnBorders miw={900}>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>{t('job_log_col_no')}</Table.Th>
                                    <Table.Th>{t('job_log_col_job_uid')}</Table.Th>
                                    <Table.Th>{t('job_log_col_time')}</Table.Th>
                                    <Table.Th>{t('job_log_col_type')}</Table.Th>
                                    <Table.Th>{t('job_log_col_status')}</Table.Th>
                                    <Table.Th>{t('job_log_col_response')}</Table.Th>
                                    <Table.Th>{t('job_log_col_duration')}</Table.Th>
                                    <Table.Th>{t('job_log_col_message')}</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {filteredLogs.map((log) => (
                                    <Table.Tr key={log.idx}>
                                        <Table.Td>{log.idx}</Table.Td>
                                        <Table.Td>{log.task_uid}</Table.Td>
                                        <Table.Td>{log.create_timestamp ? new Date(log.create_timestamp).toLocaleString() : '-'}</Table.Td>
                                        <Table.Td>{log.task_type}</Table.Td>
                                        <Table.Td>{log.run_status}</Table.Td>
                                        <Table.Td>{log.response_status ?? '-'}</Table.Td>
                                        <Table.Td>{log.duration_ms ?? '-'}</Table.Td>
                                        <Table.Td>{log.message ?? '-'}</Table.Td>
                                    </Table.Tr>
                                ))}
                                {filteredLogs.length === 0 && (
                                    <Table.Tr>
                                        <Table.Td colSpan={8}>
                                            <Text c='dimmed' size='sm'>{t('job_log_empty')}</Text>
                                        </Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </Stack>
            </Card>
        </Stack>
    );
};
