'use client'

import { AddProjectJobAction, RemoveProjectJobAction, UpdateProjectJobAction } from '@/libs/actions/ProjectJobAction';
import type { ProjectJobStatus, ProjectJobType } from '@waim/api/types';
import { ActionIcon, Button, Card, Group, Select, Stack, Text, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { toast } from 'sonner';

type HeaderField = {
    key: string;
    value: string;
}

const parseHeaderFields = (rawHeaders?: string): HeaderField[] => {
    if (!rawHeaders) {
        return [{ key: '', value: '' }];
    }

    const parsed = rawHeaders
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => {
            let separatorIndex = line.indexOf(':');

            if (separatorIndex < 0) {
                separatorIndex = line.indexOf('=');
            }

            if (separatorIndex < 0) {
                return { key: line, value: '' };
            }

            return {
                key: line.slice(0, separatorIndex).trim(),
                value: line.slice(separatorIndex + 1).trim()
            };
        });

    return parsed.length > 0 ? parsed : [{ key: '', value: '' }];
};

type ProjectJobManageFormProps = {
    projectUid: string;
    mode?: 'create' | 'edit';
    initialJob?: {
        uid: string;
        taskType: ProjectJobType;
        taskStatus: ProjectJobStatus;
        intervalDelay?: string;
        attributes: Record<string, string>;
    };
}

export const ProjectJobManageForm = ({ projectUid, mode = 'create', initialJob }: ProjectJobManageFormProps) => {
    const t = useTranslations('main.project');
    const params = useParams<{ locale: string; projectAlias: string; jobUid?: string }>();
    const router = useRouter();
    const locale = params?.locale ?? 'ko';
    const projectAlias = params?.projectAlias ?? '';
    const jobDetailHref = initialJob?.uid
        ? `/${locale}/project/${encodeURIComponent(projectAlias)}/job/${encodeURIComponent(initialJob.uid)}`
        : null;
    const jobListHref = `/${locale}/project/${encodeURIComponent(projectAlias)}/job`;
    const isEditMode = mode === 'edit' && !!initialJob?.uid;

    const [taskType, setTaskType] = useState<ProjectJobType>(initialJob?.taskType ?? 'API_CRAWLER');
    const [taskStatus, setTaskStatus] = useState<ProjectJobStatus>(initialJob?.taskStatus ?? 'ACTIVE');
    const [jobTitle, setJobTitle] = useState(initialJob?.attributes?.JOB_TITLE ?? '');
    const [intervalDelay, setIntervalDelay] = useState(initialJob?.intervalDelay ?? '10s');
    const [sourceUrl, setSourceUrl] = useState(initialJob?.attributes?.SOURCE_URL ?? '');
    const [sourceMethod, setSourceMethod] = useState(initialJob?.attributes?.SOURCE_METHOD ?? 'GET');
    const [sourceHeaders, setSourceHeaders] = useState<HeaderField[]>(parseHeaderFields(initialJob?.attributes?.SOURCE_HEADERS));
    const [targetUrl, setTargetUrl] = useState(initialJob?.attributes?.TARGET_URL ?? '');
    const [targetMethod, setTargetMethod] = useState(initialJob?.attributes?.TARGET_METHOD ?? 'POST');
    const [targetHeaders, setTargetHeaders] = useState<HeaderField[]>(parseHeaderFields(initialJob?.attributes?.TARGET_HEADERS));
    const [isSaving, setIsSaving] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const updateHeaderField = (
        type: 'source' | 'target',
        index: number,
        field: keyof HeaderField,
        value: string
    ) => {
        const setter = type === 'source' ? setSourceHeaders : setTargetHeaders;

        setter((prev) => prev.map((item, itemIndex) => (
            itemIndex === index
                ? { ...item, [field]: value }
                : item
        )));
    };

    const addHeaderField = (type: 'source' | 'target') => {
        const setter = type === 'source' ? setSourceHeaders : setTargetHeaders;
        setter((prev) => [...prev, { key: '', value: '' }]);
    };

    const removeHeaderField = (type: 'source' | 'target', index: number) => {
        const setter = type === 'source' ? setSourceHeaders : setTargetHeaders;

        setter((prev) => {
            if (prev.length <= 1) {
                return [{ key: '', value: '' }];
            }

            return prev.filter((_, itemIndex) => itemIndex !== index);
        });
    };

    const resetForm = () => {
        setTaskType(initialJob?.taskType ?? 'API_CRAWLER');
        setTaskStatus(initialJob?.taskStatus ?? 'ACTIVE');
        setJobTitle(initialJob?.attributes?.JOB_TITLE ?? '');
        setIntervalDelay(initialJob?.intervalDelay ?? '10s');
        setSourceUrl(initialJob?.attributes?.SOURCE_URL ?? '');
        setSourceMethod(initialJob?.attributes?.SOURCE_METHOD ?? 'GET');
        setSourceHeaders(parseHeaderFields(initialJob?.attributes?.SOURCE_HEADERS));
        setTargetUrl(initialJob?.attributes?.TARGET_URL ?? '');
        setTargetMethod(initialJob?.attributes?.TARGET_METHOD ?? 'POST');
        setTargetHeaders(parseHeaderFields(initialJob?.attributes?.TARGET_HEADERS));
    };

    const submit = async () => {
        setIsSaving(true);

        const formData = new FormData();
        formData.set('project-uid', projectUid);
        if (initialJob?.uid) {
            formData.set('job-uid', initialJob.uid);
        }
        formData.set('task-type', taskType);
        formData.set('task-status', taskStatus);
        formData.set('job-title', jobTitle);
        formData.set('interval-delay', intervalDelay);
        formData.set('source-url', sourceUrl);
        formData.set('source-method', sourceMethod);
        sourceHeaders.forEach((header) => {
            formData.append('source-header-key', header.key);
            formData.append('source-header-value', header.value);
        });
        formData.set('target-url', targetUrl);
        formData.set('target-method', targetMethod);
        targetHeaders.forEach((header) => {
            formData.append('target-header-key', header.key);
            formData.append('target-header-value', header.value);
        });

        const result = isEditMode
            ? await UpdateProjectJobAction(formData)
            : await AddProjectJobAction(formData);

        if (!result.state) {
            toast.error(result.message ?? (isEditMode ? t('job_update_failed') : t('job_add_failed')));
            setIsSaving(false);
            return;
        }

        toast.success(result.message ?? (isEditMode ? t('job_update_success') : t('job_add_success')));
        setIsSaving(false);

        if (isEditMode) {
            if (jobDetailHref) {
                router.replace(jobDetailHref);
                return;
            }
        } else {
            resetForm();
            router.replace(jobListHref);
            return;
        }

        router.refresh();
    };

    const remove = async () => {
        if (!initialJob?.uid) {
            return;
        }

        const confirmed = window.confirm(t('job_delete_confirm'));

        if (!confirmed) {
            return;
        }

        setIsRemoving(true);
        const result = await RemoveProjectJobAction(projectUid, initialJob.uid);

        if (!result.state) {
            toast.error(result.message ?? t('job_delete_failed'));
            setIsRemoving(false);
            return;
        }

        toast.success(result.message ?? t('job_delete_success'));
        setIsRemoving(false);
        router.push(jobListHref);
        router.refresh();
    };

    return (
        <Card withBorder>
            <Stack gap='sm'>
                <Text fw={700}>{isEditMode ? t('job_edit_title') : t('job_create_title')}</Text>
                <Text size='sm' c='dimmed'>{isEditMode ? t('job_edit_page_desc') : t('job_create_page_desc')}</Text>

                <Group grow>
                    <Select
                        label={t('job_type_label')}
                        value={taskType}
                        onChange={(value) => setTaskType((value as ProjectJobType) ?? 'API_CRAWLER')}
                        data={[
                            { value: 'API_CRAWLER', label: 'INTERFACE' },
                            { value: 'SCHEDULER', label: 'SCHEDULER' },
                            { value: 'API_HOOK', label: 'HOOK (Reserved)' }
                        ]}
                        allowDeselect={false}
                    />
                    <Select
                        label={t('job_status_label')}
                        value={taskStatus}
                        onChange={(value) => setTaskStatus((value as ProjectJobStatus) ?? 'ACTIVE')}
                        data={[
                            { value: 'ACTIVE', label: t('job_status_active') },
                            { value: 'INACTIVE', label: t('job_status_inactive') }
                        ]}
                        allowDeselect={false}
                    />
                    <TextInput
                        label={t('job_interval_label')}
                        value={intervalDelay}
                        onChange={(event) => setIntervalDelay(event.currentTarget.value)}
                        placeholder='10s'
                    />
                </Group>

                <Group grow>
                    <TextInput
                        label={t('job_title_label')}
                        value={jobTitle}
                        onChange={(event) => setJobTitle(event.currentTarget.value)}
                        placeholder={t('job_title_placeholder')}
                        required
                    />
                </Group>

                <Group grow>
                    <TextInput
                        label={t('job_source_url_label')}
                        value={sourceUrl}
                        onChange={(event) => setSourceUrl(event.currentTarget.value)}
                        placeholder='https://api.example.com/source'
                    />
                    <Select
                        label={t('job_source_method_label')}
                        value={sourceMethod}
                        onChange={(value) => setSourceMethod(value ?? 'GET')}
                        data={['GET', 'POST', 'PUT', 'PATCH', 'DELETE']}
                        allowDeselect={false}
                    />
                </Group>

                <Stack gap='xs'>
                    <Text size='sm' fw={500}>{t('job_source_headers_label')}</Text>
                    <Text size='xs' c='dimmed'>{t('job_headers_desc')}</Text>
                    {sourceHeaders.map((header, index) => (
                        <Group key={`source-header-${index}`} align='flex-end' wrap='nowrap'>
                            <TextInput
                                label={t('job_header_key_label')}
                                value={header.key}
                                onChange={(event) => updateHeaderField('source', index, 'key', event.currentTarget.value)}
                                placeholder={t('job_header_key_placeholder')}
                                style={{ flex: 1 }}
                            />
                            <TextInput
                                label={t('job_header_value_label')}
                                value={header.value}
                                onChange={(event) => updateHeaderField('source', index, 'value', event.currentTarget.value)}
                                placeholder={t('job_header_value_placeholder')}
                                style={{ flex: 1 }}
                            />
                            <ActionIcon
                                variant='default'
                                size='lg'
                                aria-label={t('job_header_remove_button')}
                                onClick={() => removeHeaderField('source', index)}
                            >
                                <FaTrashAlt size={14} />
                            </ActionIcon>
                        </Group>
                    ))}
                    <Group justify='flex-start'>
                        <Button variant='light' size='xs' onClick={() => addHeaderField('source')}>
                            {t('job_header_add_button')}
                        </Button>
                    </Group>
                </Stack>

                {taskType === 'API_CRAWLER' && (
                    <>
                        <Group grow>
                            <TextInput
                                label={t('job_target_url_label')}
                                value={targetUrl}
                                onChange={(event) => setTargetUrl(event.currentTarget.value)}
                                placeholder='https://api.example.com/target'
                            />
                            <Select
                                label={t('job_target_method_label')}
                                value={targetMethod}
                                onChange={(value) => setTargetMethod(value ?? 'POST')}
                                data={['GET', 'POST', 'PUT', 'PATCH', 'DELETE']}
                                allowDeselect={false}
                            />
                        </Group>

                        <Stack gap='xs'>
                            <Text size='sm' fw={500}>{t('job_target_headers_label')}</Text>
                            <Text size='xs' c='dimmed'>{t('job_headers_desc')}</Text>
                            {targetHeaders.map((header, index) => (
                                <Group key={`target-header-${index}`} align='flex-end' wrap='nowrap'>
                                    <TextInput
                                        label={t('job_header_key_label')}
                                        value={header.key}
                                        onChange={(event) => updateHeaderField('target', index, 'key', event.currentTarget.value)}
                                        placeholder={t('job_header_key_placeholder')}
                                        style={{ flex: 1 }}
                                    />
                                    <TextInput
                                        label={t('job_header_value_label')}
                                        value={header.value}
                                        onChange={(event) => updateHeaderField('target', index, 'value', event.currentTarget.value)}
                                        placeholder={t('job_header_value_placeholder')}
                                        style={{ flex: 1 }}
                                    />
                                    <ActionIcon
                                        variant='default'
                                        size='lg'
                                        aria-label={t('job_header_remove_button')}
                                        onClick={() => removeHeaderField('target', index)}
                                    >
                                        <FaTrashAlt size={14} />
                                    </ActionIcon>
                                </Group>
                            ))}
                            <Group justify='flex-start'>
                                <Button variant='light' size='xs' onClick={() => addHeaderField('target')}>
                                    {t('job_header_add_button')}
                                </Button>
                            </Group>
                        </Stack>
                    </>
                )}

                <Group justify='flex-end'>
                    {isEditMode && (
                        <Button color='red' variant='light' onClick={() => void remove()} loading={isRemoving}>
                            {t('permission_remove_button')}
                        </Button>
                    )}
                    <Button variant='default' component={Link} href={isEditMode && jobDetailHref ? jobDetailHref : jobListHref}>
                        {t('cancel_button')}
                    </Button>
                    <Button onClick={submit} loading={isSaving}>
                        {isEditMode ? t('job_update_button') : t('job_add_button')}
                    </Button>
                </Group>
            </Stack>
        </Card>
    );
};
