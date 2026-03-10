'use client'
import { LoginAction } from "@root/libs/actions/AuthAction";
import { Alert, Button, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { useTranslations } from "next-intl";
import { SubmitEvent, useState } from "react";

export const LoginForm = () => {
    const t = useTranslations();

    const [isLoading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');


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

                <Button type="submit" size="md" loading={isLoading} fullWidth mt={4}>
                    {isLoading ? t('page.login.loading') : t('page.login.login_submit_bt')}
                </Button>

                <Text c="dimmed" size="sm" ta="center">
                    {t('page.login.login_helper')}
                </Text>
            </Stack>
        </form>

    )
}