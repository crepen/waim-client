'use client'

import { ForgotPasswordAction } from '@root/libs/actions/AuthAction';
import { Alert, Button, Stack, Text, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export const ForgotPasswordForm = () => {
    const t = useTranslations();
    const params = useParams<{ locale: string }>();
    const locale = params?.locale ?? 'ko';

    const [isLoading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const submitEventHandler = async () => {
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        const formData = new FormData();
        formData.set('email', email);

        const result = await ForgotPasswordAction(formData);

        if (!result.state) {
            setErrorMessage(result.message ?? t('page.login.forgot_password_failed'));
            setLoading(false);
            return;
        }

        setSuccessMessage(result.message ?? t('page.login.forgot_password_success'));
        setLoading(false);
    };

    return (
        <Stack gap='md' className='signin-form-inner'>
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
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                label={t('page.login.forgot_password_label')}
                placeholder={t('page.login.forgot_password_placeholder')}
                size='md'
                disabled={isLoading}
            />

            <Button type='button' size='md' loading={isLoading} onClick={submitEventHandler} className='auth-primary-button'>
                {isLoading ? t('page.login.forgot_password_loading') : t('page.login.forgot_password_submit_bt')}
            </Button>

            <Text c='dimmed' size='sm' ta='center'>
                {t('page.login.forgot_password_helper')}
            </Text>

            <Text size='sm' ta='center'>
                <Link href={`/${locale}/login`}>
                    {t('page.login.back_to_login')}
                </Link>
            </Text>
        </Stack>
    );
};
