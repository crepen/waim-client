'use server'

import authConfig from '@/config/auth/AuthConfig';
import { AuthProvider } from '@crepen/auth';
import { ProjectApiProvider } from '@waim/api';
import type { ProjectJobStatus, ProjectJobType } from '@waim/api/types';
import { getLocale, getTranslations } from 'next-intl/server';

const normalizeTaskType = (value: string): ProjectJobType => {
    const normalized = value.trim().toUpperCase();

    if (normalized === 'SCHEDULER' || normalized === 'API_HOOK' || normalized === 'API_CRAWLER') {
        return normalized;
    }

    return 'API_CRAWLER';
};

const normalizeTaskStatus = (value: string): ProjectJobStatus => {
    const normalized = value.trim().toUpperCase();
    return normalized === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';
};

const buildAttributesFromFields = (formData: FormData) => {
    const jobTitle = (formData.get('job-title')?.toString() ?? '').trim();
    const sourceUrl = (formData.get('source-url')?.toString() ?? '').trim();
    const sourceMethod = (formData.get('source-method')?.toString() ?? 'GET').trim().toUpperCase();
    const targetUrl = (formData.get('target-url')?.toString() ?? '').trim();
    const targetMethod = (formData.get('target-method')?.toString() ?? 'POST').trim().toUpperCase();

    const attributes: Record<string, string> = {};

    if (jobTitle) {
        attributes.JOB_TITLE = jobTitle;
    }

    if (sourceUrl) {
        attributes.SOURCE_URL = sourceUrl;
    }

    if (sourceMethod) {
        attributes.SOURCE_METHOD = sourceMethod;
    }

    if (targetUrl) {
        attributes.TARGET_URL = targetUrl;
    }

    if (targetMethod) {
        attributes.TARGET_METHOD = targetMethod;
    }

    return {
        jobTitle,
        sourceUrl,
        targetUrl,
        attributes
    };
};

export const AddProjectJobAction = async (formData: FormData) => {
    const locale = await getLocale();
    const t = await getTranslations('main.project');

    try {
        const projectUid = formData.get('project-uid')?.toString() ?? '';
        const taskType = normalizeTaskType(formData.get('task-type')?.toString() ?? 'API_CRAWLER');
        const taskStatus = normalizeTaskStatus(formData.get('task-status')?.toString() ?? 'ACTIVE');
        const intervalDelay = (formData.get('interval-delay')?.toString() ?? '').trim();
        const { jobTitle, sourceUrl, targetUrl, attributes } = buildAttributesFromFields(formData);

        if (!projectUid || !intervalDelay || !jobTitle) {
            return { state: false, message: t('job_validation_required') };
        }

        if (!sourceUrl) {
            return { state: false, message: t('job_source_url_required') };
        }

        if (taskType === 'API_CRAWLER' && !targetUrl) {
            return { state: false, message: t('job_target_url_required') };
        }

        const session = await AuthProvider
            .setConfig(authConfig(locale, t('api_list_error')))
            .getSession();

        const res = await ProjectApiProvider.addProjectJob(
            projectUid,
            {
                taskType,
                intervalDelay,
                taskStatus,
                attributes
            },
            {
                locale,
                token: session?.token?.accessToken ?? ''
            }
        );

        return {
            state: res.state,
            message: res.message ?? (res.state ? t('job_add_success') : t('job_add_failed')),
            data: res.data
        };
    }
    catch (e) {
        return { state: false, message: t('job_add_failed') };
    }
};

export const UpdateProjectJobAction = async (formData: FormData) => {
    const locale = await getLocale();
    const t = await getTranslations('main.project');

    try {
        const projectUid = formData.get('project-uid')?.toString() ?? '';
        const jobUid = formData.get('job-uid')?.toString() ?? '';
        const taskType = normalizeTaskType(formData.get('task-type')?.toString() ?? 'API_CRAWLER');
        const taskStatus = normalizeTaskStatus(formData.get('task-status')?.toString() ?? 'ACTIVE');
        const intervalDelay = (formData.get('interval-delay')?.toString() ?? '').trim();
        const { jobTitle, sourceUrl, targetUrl, attributes } = buildAttributesFromFields(formData);

        if (!projectUid || !jobUid || !intervalDelay || !jobTitle) {
            return { state: false, message: t('job_validation_required') };
        }

        if (!sourceUrl) {
            return { state: false, message: t('job_source_url_required') };
        }

        if (taskType === 'API_CRAWLER' && !targetUrl) {
            return { state: false, message: t('job_target_url_required') };
        }

        const session = await AuthProvider
            .setConfig(authConfig(locale, t('api_list_error')))
            .getSession();

        const res = await ProjectApiProvider.updateProjectJob(
            projectUid,
            jobUid,
            {
                taskType,
                intervalDelay,
                taskStatus,
                attributes
            },
            {
                locale,
                token: session?.token?.accessToken ?? ''
            }
        );

        return {
            state: res.state,
            message: res.message ?? (res.state ? t('job_update_success') : t('job_update_failed')),
            data: res.data
        };
    }
    catch (e) {
        return { state: false, message: t('job_update_failed') };
    }
};

export const RemoveProjectJobAction = async (projectUid: string, jobUid: string) => {
    const locale = await getLocale();
    const t = await getTranslations('main.project');

    try {
        if (!projectUid || !jobUid) {
            return { state: false, message: t('job_validation_required') };
        }

        const session = await AuthProvider
            .setConfig(authConfig(locale, t('api_list_error')))
            .getSession();

        const res = await ProjectApiProvider.removeProjectJob(
            projectUid,
            jobUid,
            {
                locale,
                token: session?.token?.accessToken ?? ''
            }
        );

        return {
            state: res.state,
            message: res.message ?? (res.state ? t('job_delete_success') : t('job_delete_failed'))
        };
    }
    catch (e) {
        return { state: false, message: t('job_delete_failed') };
    }
};
