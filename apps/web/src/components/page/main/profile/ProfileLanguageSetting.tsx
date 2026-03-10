'use client'

import { UserConfigAction } from '@/libs/actions/UserConfigAction';
import { resolveApiMessage } from '@/libs/service/ApiMessageResolver';
import { Button, Card, Group, Select, Stack, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type ProfileLanguageSettingProps = {
    initialLanguage: 'ko' | 'en';
};

export const ProfileLanguageSetting = ({ initialLanguage }: ProfileLanguageSettingProps) => {
    const t = useTranslations('main.profile');
    const router = useRouter();
    const pathname = usePathname();
    const [language, setLanguage] = useState<'ko' | 'en'>(initialLanguage);
    const [isSaving, setIsSaving] = useState(false);

    const saveLanguage = async () => {
        setIsSaving(true);

        const result = await UserConfigAction('SITE_LANGUAGE', language);

        if (!result.state) {
            toast.error(resolveApiMessage(result.message) ?? t('language_save_failed'));
            setIsSaving(false);
            return;
        }

        toast.success(resolveApiMessage(result.message) ?? t('language_saved'));
        setIsSaving(false);

        const nextPath = pathname.replace(/^\/(ko|en)(?=\/|$)/, `/${language}`);

        if (nextPath !== pathname) {
            router.replace(nextPath);
            return;
        }

        router.refresh();
    };

    return (
        <Card withBorder mt='md'>
            <Stack gap='sm'>
                <Text fw={700}>{t('language_title')}</Text>
                <Text size='sm' c='dimmed'>{t('language_desc')}</Text>

                <Group align='end' wrap='wrap'>
                    <Select
                        w={220}
                        allowDeselect={false}
                        label={t('language_label')}
                        value={language}
                        onChange={(value) => setLanguage((value as 'ko' | 'en') ?? 'ko')}
                        data={[
                            { value: 'ko', label: t('language_option_ko') },
                            { value: 'en', label: t('language_option_en') }
                        ]}
                    />

                    <Button onClick={saveLanguage} loading={isSaving}>
                        {t('language_save')}
                    </Button>
                </Group>
            </Stack>
        </Card>
    );
};
