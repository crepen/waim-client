'use client'

import { AddProjectAction } from '@/libs/actions/ProjectAction';
import type { GroupData } from '@waim/api';
import { Box, Button, Card, Divider, Group, Input, Modal, Stack, Text, TextInput } from '@mantine/core';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useGlobalLoading } from '../global/GlobalLoadingProvider';

type AddProjectFormProp = {
    groups?: GroupData[];
    initialGroupUid?: string;
}

export const AddProjectForm = ({ groups, initialGroupUid }: AddProjectFormProp) => {
    const t = useTranslations('main.project');
    const locale = useLocale();
    const loadingContext = useGlobalLoading();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectAlias, setProjectAlias] = useState('');
    const [selectedGroupUid, setSelectedGroupUid] = useState<string | null>(initialGroupUid ?? null);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [pickerSearch, setPickerSearch] = useState('');

    const selectedGroupName = useMemo(
        () => selectedGroupUid ? (groups?.find((x) => x.uid === selectedGroupUid)?.group_name ?? selectedGroupUid) : t('none'),
        [groups, selectedGroupUid]
    );

    const candidates = useMemo(() => {
        const term = pickerSearch.trim().toLowerCase();
        return (groups ?? [])
            .filter((x) => !term || (x.group_name ?? '').toLowerCase().includes(term) || (x.group_alias ?? '').toLowerCase().includes(term))
            .sort((a, b) => (a.group_name ?? '').localeCompare(b.group_name ?? ''));
    }, [groups, pickerSearch]);

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!selectedGroupUid) {
            toast.error(t('group_required'));
            return;
        }

        setIsSubmitting(true);
        loadingContext.setLoadingState(true);

        const formData = new FormData(e.currentTarget);

        const result = await AddProjectAction(formData);

        if (!result.state) {
            toast.error(result.message ?? t('add_failed'));
            setIsSubmitting(false);
            loadingContext.setLoadingState(false);
            return;
        }

        toast.success(result.message ?? t('added'));
        const createdProjectAlias = formData.get('project-alias')?.toString() ?? projectAlias;
        window.location.assign(`/${locale}/project/${createdProjectAlias}`);
    };

    return (
        <Card withBorder>
            <Box component="form" onSubmit={submit}>
                <input type="hidden" name="group-uid" value={selectedGroupUid ?? ''} />
                <Stack>
                    <TextInput
                        name="project-name"
                        label={t('form_project_name')}
                        value={projectName}
                        onChange={(e) => setProjectName(e.currentTarget.value)}
                        required
                    />
                    <TextInput
                        name="project-alias"
                        label={t('form_project_alias')}
                        value={projectAlias}
                        onChange={(e) => setProjectAlias(e.currentTarget.value)}
                        required
                    />
                    <TextInput
                        label={t('form_group')}
                        value={selectedGroupName}
                        readOnly
                        rightSection={<Button type="button" size="xs" variant="light" onClick={() => setPickerOpen(true)}>{t('select')}</Button>}
                        rightSectionWidth={72}
                    />
                    <Group justify="flex-end">
                        <Button type="submit" disabled={isSubmitting}>{t('create_project')}</Button>
                    </Group>
                </Stack>
            </Box>

            <Modal opened={pickerOpen} onClose={() => setPickerOpen(false)} title={t('modal_select_group')} size="lg">
                <Stack>
                    <Input
                        placeholder={t('modal_search_group')}
                        value={pickerSearch}
                        onChange={(e) => setPickerSearch(e.currentTarget.value)}
                    />
                    <Divider />
                    <Stack gap="xs" mah={360} style={{ overflowY: 'auto' }}>
                        {candidates.map((item) => (
                            <Card withBorder key={item.uid}>
                                <Group justify="space-between">
                                    <Box>
                                        <Text fw={600}>{item.group_name}</Text>
                                        <Text size="xs" c="dimmed">{item.group_alias}</Text>
                                    </Box>
                                    <Button
                                        type="button"
                                        size="xs"
                                        onClick={() => {
                                            setSelectedGroupUid(item.uid);
                                            setPickerOpen(false);
                                        }}
                                    >
                                        {t('select')}
                                    </Button>
                                </Group>
                            </Card>
                        ))}
                        {candidates.length === 0 && <Text c="dimmed">{t('modal_no_groups')}</Text>}
                    </Stack>
                </Stack>
            </Modal>
        </Card>
    );
};
