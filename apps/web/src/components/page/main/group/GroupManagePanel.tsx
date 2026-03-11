'use client'

import { Badge, Box, Button, Card, Divider, Flex, Group, Input, Space, Stack, Text, ThemeIcon } from '@mantine/core';
import type { GroupData } from '@waim/api';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { SlLayers } from 'react-icons/sl';

type GroupManagePanelProps = {
    topGroups: GroupData[];
    hasApiError?: boolean;
}

export const GroupManagePanel = ({ topGroups, hasApiError }: GroupManagePanelProps) => {
    const t = useTranslations('main.group');
    const [keyword, setKeyword] = useState('');

    const sortedGroups = useMemo(() => {
        return [...topGroups]
            .filter((group) => {
                if (!keyword.trim()) {
                    return true;
                }

                const term = keyword.trim().toLowerCase();
                return (group.group_name ?? '').toLowerCase().includes(term)
                    || (group.group_alias ?? '').toLowerCase().includes(term);
            })
            .sort((a, b) => (a.group_name ?? '').localeCompare(b.group_name ?? ''));
    }, [keyword, topGroups]);

    return (
        <Stack gap="md">
            <Card withBorder>
                <Flex justify="space-between" align="center" gap="sm" wrap="wrap">
                    <Group gap="xs">
                        <Input
                            w={360}
                            placeholder={t('search_root_placeholder')}
                            value={keyword}
                            onChange={(e) => setKeyword(e.currentTarget.value)}
                        />
                    </Group>

                    <Group>
                        <Button component={Link} href={'/group/add'} variant="light">{t('add_group')}</Button>
                        <Button component={Link} href={'/project'} variant="light">{t('all_projects')}</Button>
                    </Group>
                </Flex>
            </Card>

            <Card withBorder>
                <Text fw={700}>{t('root_group_list')}</Text>
                <Text size="sm" c="dimmed">{t('root_group_desc')}</Text>

                <Space h="md" />
                <Divider />
                <Space h="md" />

                <Stack gap="xs">
                    {hasApiError && (
                        <Text c="dimmed">{t('api_error', { default: 'API 통신 오류가 발생했습니다.' })}</Text>
                    )}

                    {!hasApiError && sortedGroups.map((group) => (
                        <Card key={group.uid} withBorder px="md" py="sm">
                            <Flex justify="space-between" align="center" wrap="wrap" gap="xs">
                                <Group gap="xs">
                                    <ThemeIcon
                                        radius="xl"
                                        size="sm"
                                        color="indigo"
                                        variant="light"
                                    >
                                        <SlLayers size={12} />
                                    </ThemeIcon>
                                    <Badge color="indigo" variant="light">{t('group_badge')}</Badge>
                                    <Badge color="gray" variant="light">{group.group_alias}</Badge>
                                    <Text component={Link} href={`/group/${encodeURIComponent(group.group_alias ?? group.uid)}`} fw={600} style={{ textDecoration: 'underline' }}>
                                        {group.group_name}
                                    </Text>
                                </Group>
                                <Text size="xs" c="dimmed" mt={4}>
                                    {t('meta_child_project', {
                                        childCount: group.child_group_count ?? 0,
                                        projectCount: group.linked_project_count ?? 0
                                    })}
                                </Text>
                            </Flex>
                        </Card>
                    ))}

                    {!hasApiError && sortedGroups.length === 0 && (
                        <Text c="dimmed">{t('no_groups')}</Text>
                    )}
                </Stack>
            </Card>
        </Stack>
    );
};
