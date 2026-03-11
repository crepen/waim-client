'use client'
import { LoginAction } from "@root/libs/actions/AuthAction";
import { Alert, Button, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { useTranslations } from "next-intl";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SubmitEvent, useState } from "react";

type LoginFormProps = {
    showSignupLink?: boolean
}

export const LoginForm = ({ showSignupLink = true }: LoginFormProps) => {
    const t = useTranslations();
    const params = useParams<{ locale: string }>();

    const [isLoading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const locale = params?.locale ?? 'ko';


    const submitEventHandler = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        const formData = new FormData(e.currentTarget);
        const signInActionResult = await LoginAction(formData);

        if (signInActionResult.state === false) {
            setErrorMessage(signInActionResult.message ?? t('auth.default_error_message'));
            setLoading(false);
        }
        else {
            setLoading(false);
            window.location.replace(signInActionResult.redirectPath ?? '/');
        }
    }

    return (
        <form onSubmit={submitEventHandler} method="POST" className="signin-form-inner">
            <Stack gap="md">
                {errorMessage && (
                    <Alert color="red" variant="light">
                        {errorMessage}
                    </Alert>
                )}

                <TextInput
                    name="username"
                    autoFocus
                    autoComplete="username"
                    label={t('page.login.id_label')}
                    placeholder={t('page.login.id_placeholder')}
                    size="md"
                    disabled={isLoading}
                />

                <PasswordInput
                    name="password"
                    autoComplete="current-password"
                    label={t('page.login.password_label')}
                    placeholder={t('page.login.password_placeholder')}
                    size="md"
                    disabled={isLoading}
                />

                <Button type="submit" size="md" loading={isLoading} fullWidth mt={4} className='auth-primary-button'>
                    {isLoading ? t('page.login.loading') : t('page.login.login_submit_bt')}
                </Button>

                <Text c="dimmed" size="sm" ta="center">
                    {t('page.login.login_helper')}
                </Text>

                <div className='auth-link-actions'>
                    <Link className='auth-link-button forgot' href={`/${locale}/forgot-password`}>
                        {t('page.login.forgot_password_label')}
                    </Link>

                    {showSignupLink && (
                        <Link className='auth-link-button signup' href={`/${locale}/signup`}>
                            {t('page.login.move_to_signup')}
                        </Link>
                    )}
                </div>
            </Stack>
        </form>

    )
}