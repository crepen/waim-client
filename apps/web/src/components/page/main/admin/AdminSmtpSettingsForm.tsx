'use client'

import { TestAdminSmtpSettingsAction, UpdateAdminSmtpSettingsAction, type SmtpSettingsConfig } from '@/libs/actions/AdminSiteSettingsAction';
import { Button, Card, Group, PasswordInput, Stack, Switch, Text, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type AdminSmtpSettingsFormProps = {
    initialValue: SmtpSettingsConfig,
    initialMessage?: string
}

export const AdminSmtpSettingsForm = ({ initialValue, initialMessage }: AdminSmtpSettingsFormProps) => {
    const t = useTranslations('main.admin');
    const router = useRouter();

    const toChecked = (value: string) => value === 'yes';
    const toYnValue = (checked: boolean) => checked ? 'yes' : 'no';
    const switchPointerStyles = {
        root: { cursor: 'pointer' },
        body: { cursor: 'pointer' },
        label: { cursor: 'pointer' },
        track: { cursor: 'pointer' },
        thumb: { cursor: 'pointer' }
    };

    const [isSaving, setIsSaving] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [smtpEnabled, setSmtpEnabled] = useState(initialValue.smtpEnabled);
    const [host, setHost] = useState(initialValue.host);
    const [port, setPort] = useState(initialValue.port);
    const [username, setUsername] = useState(initialValue.username);
    const [password, setPassword] = useState(initialValue.password);
    const [fromEmail, setFromEmail] = useState(initialValue.fromEmail);
    const [fromName, setFromName] = useState(initialValue.fromName);
    const [authEnabled, setAuthEnabled] = useState(initialValue.authEnabled);
    const [startTlsEnabled, setStartTlsEnabled] = useState(initialValue.startTlsEnabled);
    const [sslEnabled, setSslEnabled] = useState(initialValue.sslEnabled);

    const buildFormData = () => {
        const formData = new FormData();
        formData.set('smtpEnabled', smtpEnabled);
        formData.set('host', host);
        formData.set('port', port);
        formData.set('username', username);
        formData.set('password', password);
        formData.set('fromEmail', fromEmail);
        formData.set('fromName', fromName);
        formData.set('authEnabled', authEnabled);
        formData.set('startTlsEnabled', startTlsEnabled);
        formData.set('sslEnabled', sslEnabled);

        return formData;
    };

    const testConnection = async () => {
        setIsTesting(true);
        const result = await TestAdminSmtpSettingsAction(buildFormData());

        if (!result.state) {
            toast.error(result.message ?? t('smtp_settings_test_failed'));
            setIsTesting(false);
            return;
        }

        toast.success(result.message ?? t('smtp_settings_test_success'));
        setIsTesting(false);
    };

    const submitForm = async () => {
        setIsSaving(true);

        const formData = buildFormData();

        const result = await UpdateAdminSmtpSettingsAction(formData);

        if (!result.state) {
            toast.error(result.message ?? t('smtp_settings_save_failed'));
            setIsSaving(false);
            return;
        }

        toast.success(result.message ?? t('smtp_settings_saved'));
        setIsSaving(false);
        router.refresh();
    };

    return (
        <Card withBorder>
            <Stack gap='sm'>
                <Text fw={700}>{t('smtp_settings_title')}</Text>
                <Text size='sm' c='dimmed'>{t('smtp_settings_desc')}</Text>

                <Switch
                    label={t('smtp_enabled_label')}
                    checked={toChecked(smtpEnabled)}
                    onChange={(event) => setSmtpEnabled(toYnValue(event.currentTarget.checked))}
                    styles={switchPointerStyles}
                />

                <TextInput
                    label={t('smtp_host_label')}
                    value={host}
                    onChange={(event) => setHost(event.currentTarget.value)}
                />

                <TextInput
                    type='number'
                    label={t('smtp_port_label')}
                    value={port}
                    onChange={(event) => setPort(event.currentTarget.value)}
                />

                <TextInput
                    label={t('smtp_username_label')}
                    value={username}
                    onChange={(event) => setUsername(event.currentTarget.value)}
                />

                <PasswordInput
                    label={t('smtp_password_label')}
                    value={password}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                />

                <TextInput
                    label={t('smtp_from_email_label')}
                    value={fromEmail}
                    onChange={(event) => setFromEmail(event.currentTarget.value)}
                />

                <TextInput
                    label={t('smtp_from_name_label')}
                    value={fromName}
                    onChange={(event) => setFromName(event.currentTarget.value)}
                />

                <Switch
                    label={t('smtp_auth_enabled_label')}
                    checked={toChecked(authEnabled)}
                    onChange={(event) => setAuthEnabled(toYnValue(event.currentTarget.checked))}
                    styles={switchPointerStyles}
                />

                <Switch
                    label={t('smtp_starttls_enabled_label')}
                    checked={toChecked(startTlsEnabled)}
                    onChange={(event) => setStartTlsEnabled(toYnValue(event.currentTarget.checked))}
                    styles={switchPointerStyles}
                />

                <Switch
                    label={t('smtp_ssl_enabled_label')}
                    checked={toChecked(sslEnabled)}
                    onChange={(event) => setSslEnabled(toYnValue(event.currentTarget.checked))}
                    styles={switchPointerStyles}
                />

                {initialMessage && (
                    <Text size='sm' c='orange'>{initialMessage}</Text>
                )}

                <Group justify='flex-end'>
                    <Button variant='default' onClick={testConnection} loading={isTesting}>
                        {t('smtp_settings_test_button')}
                    </Button>
                    <Button onClick={submitForm} loading={isSaving}>
                        {t('save_button')}
                    </Button>
                </Group>
            </Stack>
        </Card>
    );
};
