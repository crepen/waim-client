'use client'

import { AddProjectJobAction } from '@/libs/actions/ProjectJobAction';
import type { ProjectJobStatus, ProjectJobType } from '@waim/api/types';
import { Button, Card, Group, Select, Stack, Text, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type ProjectJobManageFormProps = {
    projectUid: string;
}

export const ProjectJobManageForm = ({ projectUid }: ProjectJobManageFormProps) => {
    const t = useTranslations('main.project');
    const router = useRouter();

    const [taskType, setTaskType] = useState<ProjectJobType>('API_CRAWLER');
    const [taskStatus, setTaskStatus] = useState<ProjectJobStatus>('ACTIVE');
    const [jobTitle, setJobTitle] = useState('');
    const [intervalDelay, setIntervalDelay] = useState('10s');
    const [sourceUrl, setSourceUrl] = useState('');
    const [sourceMethod, setSourceMethod] = useState('GET');
    const [targetUrl, setTargetUrl] = useState('');
    const [targetMethod, setTargetMethod] = useState('POST');
    const [isSaving, setIsSaving] = useState(false);

    const resetForm = () => {
        setTaskType('API_CRAWLER');
        setTaskStatus('ACTIVE');
        setJobTitle('');
        setIntervalDelay('10s');
        setSourceUrl('');
        setSourceMethod('GET');
        setTargetUrl('');
        setTargetMethod('POST');
    };

    const submit = async () => {
        setIsSaving(true);

        const formData = new FormData();
        formData.set('project-uid', projectUid);
        formData.set('task-type', taskType);
        formData.set('task-status', taskStatus);
        formData.set('job-title', jobTitle);
        formData.set('interval-delay', intervalDelay);
        formData.set('source-url', sourceUrl);
        formData.set('source-method', sourceMethod);
        formData.set('target-url', targetUrl);
        formData.set('target-method', targetMethod);

        const result = await AddProjectJobAction(formData);

        if (!result.state) {
            toast.error(result.message ?? t('job_add_failed'));
            setIsSaving(false);
            return;
        }

        toast.success(result.message ?? t('job_add_success'));
        setIsSaving(false);
        resetForm();
        router.push('..');
        router.refresh();
    };

    return (
        <Card withBorder>
            <Stack gap='sm'>
                <Text fw={700}>{t('job_create_title')}</Text>
                <Text size='sm' c='dimmed'>{t('job_create_page_desc')}</Text>

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

                {taskType === 'API_CRAWLER' && (
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
                )}

                <Group justify='flex-end'>
                    <Button variant='default' onClick={resetForm}>
                        {t('cancel_button')}
                    </Button>
                    <Button onClick={submit} loading={isSaving}>
                        {t('job_add_button')}
                    </Button>
                </Group>
            </Stack>
        </Card>
    );
};
