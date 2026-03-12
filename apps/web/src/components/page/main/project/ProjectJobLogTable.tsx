'use client'

import { SearchProjectJobLogsAction } from '@/libs/actions/ProjectJobAction';
import type { ProjectJobData, ProjectJobLogData } from '@waim/api/types';
import { Group, Pagination, ScrollArea, Select, Stack, Switch, Table, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

type ProjectJobLogTableProps = {
    projectUid?: string;
    jobs: ProjectJobData[];
    logs: ProjectJobLogData[];
    initialJobUid?: string;
    hideJobFilter?: boolean;
    pageSize?: number;
    autoRefreshMs?: number;
}

const MAX_JOB_LOG_FETCH_SIZE = 1000;

export const ProjectJobLogTable = ({
    projectUid,
    jobs,
    logs,
    initialJobUid,
    hideJobFilter = false,
    pageSize = 100,
    autoRefreshMs
}: ProjectJobLogTableProps) => {
    const t = useTranslations('main.project');
    const [currentLogs, setCurrentLogs] = useState<ProjectJobLogData[]>(logs);
    const [logStatusFilter, setLogStatusFilter] = useState<string>('ALL');
    const [logJobUidFilter, setLogJobUidFilter] = useState<string>(initialJobUid ?? 'ALL');
    const [failedFirst, setFailedFirst] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [autoRefreshPaused, setAutoRefreshPaused] = useState<boolean>(false);

    useEffect(() => {
        setCurrentLogs(logs);
    }, [logs]);

    useEffect(() => {
        if (!autoRefreshMs || !projectUid || autoRefreshPaused) {
            return;
        }

        let cancelled = false;

        const refreshLogs = async () => {
            const result = await SearchProjectJobLogsAction(projectUid, {
                page: 0,
                size: MAX_JOB_LOG_FETCH_SIZE,
                jobUid: hideJobFilter ? initialJobUid : undefined
            });

            if (!cancelled && result.state) {
                setCurrentLogs(result.data);
            }
        };

        const interval = window.setInterval(() => {
            void refreshLogs();
        }, autoRefreshMs);

        return () => {
            cancelled = true;
            window.clearInterval(interval);
        };
    }, [autoRefreshMs, autoRefreshPaused, hideJobFilter, initialJobUid, projectUid]);

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

        const copied = currentLogs
            .filter((log) => {
                if (logStatusFilter !== 'ALL' && log.run_status !== logStatusFilter) {
                    return false;
                }

                if (hideJobFilter && initialJobUid && log.task_uid !== initialJobUid) {
                    return false;
                }

                if (!hideJobFilter && logJobUidFilter !== 'ALL' && log.task_uid !== logJobUidFilter) {
                    return false;
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
    }, [currentLogs, failedFirst, hideJobFilter, initialJobUid, logJobUidFilter, logStatusFilter]);

    useEffect(() => {
        setPage(1);
    }, [filteredLogs.length]);

    const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
    const pagedLogs = filteredLogs.slice((page - 1) * pageSize, page * pageSize);

    return (
        <Stack gap='sm'>
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
                {!hideJobFilter && (
                    <Select
                        label={t('job_log_filter_job_label')}
                        value={logJobUidFilter}
                        onChange={(value) => setLogJobUidFilter(value ?? 'ALL')}
                        data={[
                            { value: 'ALL', label: t('job_filter_all') },
                            ...jobs.map((job) => ({
                                value: job.uid,
                                label: job.attributes?.JOB_TITLE
                                    ? `${job.attributes.JOB_TITLE}(${job.uid})`
                                    : job.uid
                            }))
                        ]}
                        allowDeselect={false}
                    />
                )}
            </Group>

            <Group gap='lg'>
                <Switch
                    checked={failedFirst}
                    onChange={(event) => setFailedFirst(event.currentTarget.checked)}
                    label={t('job_log_failed_first_label')}
                />
                {autoRefreshMs && (
                    <Switch
                        checked={autoRefreshPaused}
                        onChange={(event) => setAutoRefreshPaused(event.currentTarget.checked)}
                        label={t('job_log_auto_refresh_pause_label')}
                    />
                )}
            </Group>

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
                        {pagedLogs.map((log) => (
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

            {filteredLogs.length > 0 && (
                <Pagination
                    total={totalPages}
                    value={page}
                    onChange={setPage}
                    withEdges
                />
            )}
        </Stack>
    );
};