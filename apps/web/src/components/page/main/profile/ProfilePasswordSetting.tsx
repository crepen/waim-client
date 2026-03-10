'use client'

import { UpdateProfilePasswordAction } from '@/libs/actions/UserProfileAction';
import { resolveApiMessage } from '@/libs/service/ApiMessageResolver';
import { Button, Card, Group, PasswordInput, Stack, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

export const ProfilePasswordSetting = () => {
    const t = useTranslations('main.profile');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const savePassword = async () => {
        if (!password.trim()) {
            toast.error(t('password_required'));
            return;
        }

        if (password !== passwordConfirm) {
            toast.error(t('password_mismatch'));
            return;
        }

        setIsSaving(true);
        const result = await UpdateProfilePasswordAction(password);

        if (!result.state) {
            toast.error(resolveApiMessage(result.message) ?? t('password_save_failed'));
            setIsSaving(false);
            return;
        }

        toast.success(resolveApiMessage(result.message) ?? t('password_saved'));
        setPassword('');
        setPasswordConfirm('');
        setIsSaving(false);
    };

    return (
        <Card withBorder mt='md'>
            <Stack gap='sm'>
                <Text fw={700}>{t('password_title')}</Text>
                <Text size='sm' c='dimmed'>{t('password_desc')}</Text>

                <Group align='end' wrap='wrap'>
                    <PasswordInput
                        w={260}
                        label={t('password_label')}
                        placeholder={t('password_placeholder')}
                        value={password}
                        onChange={(event) => setPassword(event.currentTarget.value)}
                    />

                    <PasswordInput
                        w={260}
                        label={t('password_confirm_label')}
                        placeholder={t('password_confirm_placeholder')}
                        value={passwordConfirm}
                        onChange={(event) => setPasswordConfirm(event.currentTarget.value)}
                    />

                    <Button onClick={savePassword} loading={isSaving}>
                        {t('password_save')}
                    </Button>
                </Group>
            </Stack>
        </Card>
    );
};
