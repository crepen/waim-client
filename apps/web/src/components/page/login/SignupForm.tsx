'use client'

import { SignupAction } from '@root/libs/actions/AuthAction';
import { Alert, Button, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SubmitEvent, useState } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SignupFormProps = {
    passwordPolicy: {
        requireUppercase: string,
        requireSymbol: string,
        allowedSymbols: string,
        requireNumber: string,
        minLength: string,
        maxLength: string
    }
}

export const SignupForm = ({ passwordPolicy }: SignupFormProps) => {
    const t = useTranslations();
    const params = useParams<{ locale: string }>();

    const [isLoading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const locale = params?.locale ?? 'ko';

    const submitEventHandler = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        const formData = new FormData(e.currentTarget);
        const email = (formData.get('email')?.toString() ?? '').trim();

        if (!EMAIL_REGEX.test(email)) {
            setErrorMessage(t('page.login.signup_email_invalid'));
            setLoading(false);
            return;
        }

        const signupActionResult = await SignupAction(formData);

        if (signupActionResult.state === false) {
            setErrorMessage(signupActionResult.message ?? t('auth.default_error_message'));
            setLoading(false);
            return;
        }

        setSuccessMessage(signupActionResult.message ?? t('page.login.signup_success'));
        setLoading(false);
    };

    return (
        <form onSubmit={submitEventHandler} method='POST' className='signin-form-inner'>
            <Stack gap='md'>
                {errorMessage && (
                    <Alert color='red' variant='light'>
                        {errorMessage}
                    </Alert>
                )}

                {successMessage && (
                    <Alert color='teal' variant='light'>
                        {successMessage}
                    </Alert>
                )}

                <TextInput
                    name='userId'
                    autoComplete='username'
                    label={t('page.login.id_label')}
                    placeholder={t('page.login.id_placeholder')}
                    size='md'
                    disabled={isLoading}
                />

                <TextInput
                    name='userName'
                    autoComplete='name'
                    label={t('page.login.signup_name_label')}
                    placeholder={t('page.login.signup_name_placeholder')}
                    size='md'
                    disabled={isLoading}
                />

                <TextInput
                    name='email'
                    type='email'
                    autoComplete='email'
                    label={t('page.login.signup_email_label')}
                    placeholder={t('page.login.signup_email_placeholder')}
                    size='md'
                    disabled={isLoading}
                />

                <PasswordInput
                    name='password'
                    autoComplete='new-password'
                    label={t('page.login.password_label')}
                    placeholder={t('page.login.password_placeholder')}
                    size='md'
                    disabled={isLoading}
                />

                <PasswordInput
                    name='confirmPassword'
                    autoComplete='new-password'
                    label={t('page.login.signup_password_confirm_label')}
                    placeholder={t('page.login.signup_password_confirm_placeholder')}
                    size='md'
                    disabled={isLoading}
                />

                <Stack gap={2}>
                    <Text size='sm' fw={600}>{t('page.login.signup_password_policy_title')}</Text>
                    <Text size='sm' c='dimmed'>- {t('page.login.signup_password_policy_uppercase', { value: passwordPolicy.requireUppercase === 'yes' ? t('page.login.policy_required') : t('page.login.policy_optional') })}</Text>
                    <Text size='sm' c='dimmed'>- {t('page.login.signup_password_policy_symbol', { value: passwordPolicy.requireSymbol === 'yes' ? t('page.login.policy_required') : t('page.login.policy_optional') })}</Text>
                    <Text size='sm' c='dimmed'>- {t('page.login.signup_password_policy_symbol_list', { value: passwordPolicy.allowedSymbols })}</Text>
                    <Text size='sm' c='dimmed'>- {t('page.login.signup_password_policy_number', { value: passwordPolicy.requireNumber === 'yes' ? t('page.login.policy_required') : t('page.login.policy_optional') })}</Text>
                    <Text size='sm' c='dimmed'>- {t('page.login.signup_password_policy_min_length', { value: passwordPolicy.minLength })}</Text>
                    <Text size='sm' c='dimmed'>- {t('page.login.signup_password_policy_max_length', { value: passwordPolicy.maxLength })}</Text>
                </Stack>

                <Button type='submit' size='md' loading={isLoading} fullWidth mt={4} className='auth-primary-button'>
                    {isLoading ? t('page.login.signup_loading') : t('page.login.signup_submit_bt')}
                </Button>

                <Text c='dimmed' size='sm' ta='center'>
                    {t('page.login.signup_helper')}
                </Text>

                <Text size='sm' ta='center'>
                    <Link href={`/${locale}/login`}>
                        {t('page.login.back_to_login')}
                    </Link>
                </Text>
            </Stack>
        </form>
    );
};
