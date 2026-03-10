'use client'
import { LoginAction } from "@root/libs/actions/AuthAction";
import { Alert, Button, Paper, PasswordInput, Stack, TextInput } from "@mantine/core";
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
            window.location.replace('/');
        }
    }

    return (
        <Paper withBorder radius='lg' p='xl' shadow='sm'>
            <form onSubmit={submitEventHandler} method="POST">
                <Stack gap='md'>
                    {errorMessage && (
                        <Alert
                            color='red'
                            variant='light'
                            title='Sign-in failed'
                        >
                            {errorMessage}
                        </Alert>
                    )}

                    <TextInput
                        name='username'
                        autoFocus
                        autoComplete='username'
                        label='Username'
                        placeholder='Enter your username'
                        size='md'
                        required
                    />

                    <PasswordInput
                        name='password'
                        autoComplete='current-password'
                        label='Password'
                        placeholder='Enter your password'
                        size='md'
                        required
                    />

                    <Button type='submit' loading={isLoading} loaderProps={{ type: 'dots' }} size='md' mt='xs'>
                        {t('page.login.login_submit_bt')}
                    </Button>
                </Stack>
            </form>
        </Paper>

    )
}