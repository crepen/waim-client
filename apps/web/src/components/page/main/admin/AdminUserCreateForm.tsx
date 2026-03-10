'use client'

import { AddAdminUserAction } from '@/libs/actions/AdminUserAction';
import { resolveApiMessage } from '@/libs/service/ApiMessageResolver';
import { Button, Card, Group, Stack, Text, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export const AdminUserCreateForm = () => {
    const t = useTranslations('main.admin');
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const submitForm = async (formData: FormData) => {
        setIsSaving(true);
        const result = await AddAdminUserAction(formData);

        if (!result.state) {
            toast.error(resolveApiMessage(result.message) ?? t('user_add_failed'));
            setIsSaving(false);
            return;
        }

        toast.success(resolveApiMessage(result.message) ?? t('user_add_success'));
        setIsSaving(false);
        router.push('/admin/users');
    };

    return (
        <Card withBorder>
            <form action={submitForm}>
                <Stack gap='sm'>
                    <Text fw={700}>{t('user_add_title')}</Text>

                    <Group grow align='end'>
                        <TextInput name='userId' label={t('user_id')} placeholder={t('user_id_placeholder')} required />
                        <TextInput name='userName' label={t('user_name')} placeholder={t('user_name_placeholder')} required />
                    </Group>

                    <Group grow align='end'>
                        <TextInput name='email' label={t('email')} placeholder={t('email_placeholder')} required />
                        <TextInput name='password' label={t('password')} placeholder={t('password_placeholder')} required type='password' />
                    </Group>

                    <Group justify='flex-end'>
                        <Button type='submit' loading={isSaving}>{t('user_add_button')}</Button>
                    </Group>
                </Stack>
            </form>
        </Card>
    );
};
