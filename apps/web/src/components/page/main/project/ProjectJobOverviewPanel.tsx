'use client'

import { ProjectJobLogTable } from '@/components/page/main/project/ProjectJobLogTable';
import { RemoveProjectJobAction } from '@/libs/actions/ProjectJobAction';
import type { ProjectJobData, ProjectJobLogData } from '@waim/api/types';
import { Badge, Button, Card, Group, ScrollArea, Select, Stack, Table, Text, TextInput } from '@mantine/core';
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
    const jobDetailHref = (jobUid: string) => `/${locale}/project/${encodeURIComponent(projectAlias)}/job/${encodeURIComponent(jobUid)}`;

    const [jobTypeFilter, setJobTypeFilter] = useState<string>('ALL');
    const [jobStatusFilter, setJobStatusFilter] = useState<string>('ALL');
    const [jobKeyword, setJobKeyword] = useState<string>('');

    const filteredJobs = useMemo(
        () => jobs.filter((job) => {
            if (jobTypeFilter !== 'ALL' && job.task_type !== jobTypeFilter) {
                return false;
            }

            if (jobStatusFilter !== 'ALL' && job.task_status !== jobStatusFilter) {
                return false;
            }

            const normalizedKeyword = jobKeyword.trim().toLowerCase();

            if (normalizedKeyword.length > 0) {
                const title = job.attributes?.JOB_TITLE?.toLowerCase() ?? '';
                const matchesUid = job.uid.toLowerCase().includes(normalizedKeyword);
                const matchesTitle = title.includes(normalizedKeyword);

                if (!matchesUid && !matchesTitle) {
                    return false;
                }
            }

            return true;
        }),
        [jobs, jobKeyword, jobTypeFilter, jobStatusFilter]
    );

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
                            value={jobKeyword}
                            onChange={(event) => setJobKeyword(event.currentTarget.value)}
                            placeholder={t('job_filter_uid_placeholder')}
                        />
                    </Group>

                    <ScrollArea>
                        <Table striped withTableBorder withColumnBorders miw={1240} style={{ tableLayout: 'fixed' }}>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th w={56} style={{ whiteSpace: 'nowrap' }}>{t('job_col_no')}</Table.Th>
                                    <Table.Th w='14%' style={{ whiteSpace: 'nowrap' }}>{t('job_col_uid')}</Table.Th>
                                    <Table.Th w='32%' style={{ whiteSpace: 'nowrap' }}>{t('job_col_title')}</Table.Th>
                                    <Table.Th w={96} style={{ whiteSpace: 'nowrap' }}>{t('job_col_type')}</Table.Th>
                                    <Table.Th w={72} style={{ whiteSpace: 'nowrap' }}>{t('job_col_interval')}</Table.Th>
                                    <Table.Th w={92} style={{ whiteSpace: 'nowrap' }}>{t('job_col_status')}</Table.Th>
                                    <Table.Th w={180} style={{ whiteSpace: 'nowrap' }}>{t('job_col_next_run')}</Table.Th>
                                    <Table.Th w={148} style={{ whiteSpace: 'nowrap' }}>{t('job_col_action')}</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {filteredJobs.map((item, index) => (
                                    <Table.Tr key={item.uid}>
                                        <Table.Td style={{ whiteSpace: 'nowrap' }}>{index + 1}</Table.Td>
                                        <Table.Td style={{ whiteSpace: 'nowrap' }}>
                                            <Text
                                                component={Link}
                                                href={jobDetailHref(item.uid)}
                                                size='sm'
                                                fw={500}
                                                title={item.uid}
                                                style={{
                                                    textDecoration: 'underline',
                                                    display: 'block',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {item.uid}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td style={{ whiteSpace: 'nowrap' }}>
                                            <Text
                                                component={Link}
                                                href={jobDetailHref(item.uid)}
                                                size='sm'
                                                fw={500}
                                                title={item.attributes?.JOB_TITLE || '-'}
                                                style={{
                                                    textDecoration: 'underline',
                                                    display: 'block',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {item.attributes?.JOB_TITLE || '-'}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td style={{ whiteSpace: 'nowrap' }}>{item.task_type}</Table.Td>
                                        <Table.Td style={{ whiteSpace: 'nowrap' }}>{item.interval_delay ?? '-'}</Table.Td>
                                        <Table.Td style={{ whiteSpace: 'nowrap' }}>
                                            <Badge color={item.task_status === 'ACTIVE' ? 'teal' : 'gray'} variant='light'>
                                                {item.task_status === 'ACTIVE' ? t('job_status_active') : t('job_status_inactive')}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td style={{ whiteSpace: 'nowrap' }}>{item.next_run_timestamp ? new Date(item.next_run_timestamp).toLocaleString() : '-'}</Table.Td>
                                        <Table.Td style={{ whiteSpace: 'nowrap' }}>
                                            <Group gap='xs' wrap='nowrap'>
                                                <Button size='xs' variant='light' component={Link} href={jobDetailHref(item.uid)}>
                                                    {t('job_detail_button')}
                                                </Button>
                                                <Button size='xs' variant='light' color='red' onClick={() => void remove(item.uid)}>
                                                    {t('permission_remove_button')}
                                                </Button>
                                            </Group>
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
                    </ScrollArea>
                </Stack>
            </Card>

            <Card withBorder>
                <Stack gap='sm'>
                    <Text fw={700}>{t('job_log_title')}</Text>
                    <Text size='sm' c='dimmed'>{t('job_log_desc')}</Text>
                    <ProjectJobLogTable projectUid={projectUid} jobs={jobs} logs={logs} pageSize={10} autoRefreshMs={5000} />
                </Stack>
            </Card>
        </Stack>
    );
};
