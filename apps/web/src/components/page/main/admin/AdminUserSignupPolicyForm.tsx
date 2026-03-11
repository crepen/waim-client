'use client'

import { UpdateAdminUserSignupPolicyAction, type UserSignupPolicyConfig } from '@/libs/actions/AdminSiteSettingsAction';
import { Button, Card, Stack, Switch, Text, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type AdminUserSignupPolicyFormProps = {
    initialValue: UserSignupPolicyConfig,
    initialMessage?: string
}

export const AdminUserSignupPolicyForm = ({ initialValue, initialMessage }: AdminUserSignupPolicyFormProps) => {
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
    const [requireAdminApproval, setRequireAdminApproval] = useState(initialValue.requireAdminApproval);
    const [requireUppercase, setRequireUppercase] = useState(initialValue.requireUppercase);
    const [requireSymbol, setRequireSymbol] = useState(initialValue.requireSymbol);
    const [allowedSymbols, setAllowedSymbols] = useState(initialValue.allowedSymbols);
    const [requireNumber, setRequireNumber] = useState(initialValue.requireNumber);
    const [minLength, setMinLength] = useState(initialValue.minLength);
    const [maxLength, setMaxLength] = useState(initialValue.maxLength);
    const [signupEnabled, setSignupEnabled] = useState(initialValue.signupEnabled);

    const submitForm = async () => {
        setIsSaving(true);

        const formData = new FormData();
        formData.set('requireAdminApproval', requireAdminApproval);
        formData.set('requireUppercase', requireUppercase);
        formData.set('requireSymbol', requireSymbol);
        formData.set('allowedSymbols', allowedSymbols);
        formData.set('requireNumber', requireNumber);
        formData.set('minLength', minLength);
        formData.set('maxLength', maxLength);
        formData.set('signupEnabled', signupEnabled);

        const result = await UpdateAdminUserSignupPolicyAction(formData);

        if (!result.state) {
            toast.error(result.message ?? t('signup_policy_save_failed'));
            setIsSaving(false);
            return;
        }

        toast.success(result.message ?? t('signup_policy_saved'));
        setIsSaving(false);
        router.refresh();
    };

    return (
        <Card withBorder>
            <Stack gap='sm'>
                <Text fw={700}>{t('signup_policy_title')}</Text>
                <Text size='sm' c='dimmed'>{t('signup_policy_desc')}</Text>

                <Switch
                    label={t('signup_enabled_label')}
                    checked={toChecked(signupEnabled)}
                    onChange={(event) => setSignupEnabled(toYnValue(event.currentTarget.checked))}
                    styles={switchPointerStyles}
                />

                <Switch
                    label={t('signup_admin_approval_label')}
                    checked={toChecked(requireAdminApproval)}
                    onChange={(event) => setRequireAdminApproval(toYnValue(event.currentTarget.checked))}
                    styles={switchPointerStyles}
                />

                <Switch
                    label={t('signup_password_require_uppercase_label')}
                    checked={toChecked(requireUppercase)}
                    onChange={(event) => setRequireUppercase(toYnValue(event.currentTarget.checked))}
                    styles={switchPointerStyles}
                />

                <Switch
                    label={t('signup_password_require_symbol_label')}
                    checked={toChecked(requireSymbol)}
                    onChange={(event) => setRequireSymbol(toYnValue(event.currentTarget.checked))}
                    styles={switchPointerStyles}
                />

                <TextInput
                    label={t('signup_password_allowed_symbols_label')}
                    value={allowedSymbols}
                    onChange={(event) => setAllowedSymbols(event.currentTarget.value)}
                />

                <Switch
                    label={t('signup_password_require_number_label')}
                    checked={toChecked(requireNumber)}
                    onChange={(event) => setRequireNumber(toYnValue(event.currentTarget.checked))}
                    styles={switchPointerStyles}
                />

                <TextInput
                    type='number'
                    label={t('signup_password_min_length_label')}
                    value={minLength}
                    onChange={(event) => setMinLength(event.currentTarget.value)}
                />

                <TextInput
                    type='number'
                    label={t('signup_password_max_length_label')}
                    value={maxLength}
                    onChange={(event) => setMaxLength(event.currentTarget.value)}
                />
                <Text size='xs' c='dimmed'>{t('signup_password_requirement_help')}</Text>

                {initialMessage && (
                    <Text size='sm' c='orange'>{initialMessage}</Text>
                )}

                <Button onClick={submitForm} loading={isSaving}>
                    {t('save_button')}
                </Button>
            </Stack>
        </Card>
    );
};
