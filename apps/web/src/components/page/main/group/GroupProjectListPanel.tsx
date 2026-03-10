'use client'

import type { ProjectData } from '@waim/api';
import { Badge, Box, Button, Card, Divider, Flex, Group, Input, Select, Space, Stack, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

type GroupProjectListPanelProps = {
    projects: ProjectData[];
    groupUid: string;
}

type SortOption = 'name_asc' | 'name_desc' | 'updated_desc' | 'updated_asc';

export const GroupProjectListPanel = ({ projects, groupUid }: GroupProjectListPanelProps) => {
    const t = useTranslations('main.group');
    const [keyword, setKeyword] = useState('');
    const [sortOption, setSortOption] = useState<SortOption>('updated_desc');

    const filteredProjects = useMemo(() => {
        const term = keyword.trim().toLowerCase();

        const searched = projects.filter((project) => {
            if (!term) {
                return true;
            }

            return (project.project_name ?? '').toLowerCase().includes(term)
                || (project.project_alias ?? '').toLowerCase().includes(term)
                || (project.project_owner_name ?? '').toLowerCase().includes(term);
        });

        return [...searched].sort((a, b) => {
            if (sortOption === 'name_asc') {
                return (a.project_name ?? '').localeCompare(b.project_name ?? '');
            }

            if (sortOption === 'name_desc') {
                return (b.project_name ?? '').localeCompare(a.project_name ?? '');
            }

            if (sortOption === 'updated_asc') {
                return (a.update_timestamp ?? 0) - (b.update_timestamp ?? 0);
            }

            return (b.update_timestamp ?? 0) - (a.update_timestamp ?? 0);
        });
    }, [keyword, projects, sortOption]);

    return (
        <Card withBorder>
            <Stack gap="sm">
                <Flex justify="space-between" align="center" wrap="wrap" gap="xs">
                    <Box>
                        <Text fw={700}>{t('linked_projects_title')}</Text>
                        <Text size="sm" c="dimmed">{t('linked_projects_desc')}</Text>
                    </Box>
                    <Button component={'a'} href={`/project/add?group_uid=${groupUid}`} size="xs">
                        {t('add_project')}
                    </Button>
                </Flex>

                <Group gap="xs" align="end" wrap="wrap">
                    <Input
                        w={320}
                        placeholder={t('search_project_placeholder')}
                        value={keyword}
                        onChange={(e) => setKeyword(e.currentTarget.value)}
                    />
                    <Select
                        w={220}
                        label={t('sort')}
                        value={sortOption}
                        onChange={(value) => setSortOption((value as SortOption) ?? 'updated_desc')}
                        data={[
                            { value: 'updated_desc', label: t('sort_updated_desc') },
                            { value: 'updated_asc', label: t('sort_updated_asc') },
                            { value: 'name_asc', label: t('sort_name_asc') },
                            { value: 'name_desc', label: t('sort_name_desc') }
                        ]}
                    />
                </Group>
            </Stack>

            <Space h={10} />
            <Divider />
            <Space h={10} />

            <Stack gap="xs">
                {filteredProjects.length === 0 && (
                    <Text c="dimmed" size="sm">{t('no_projects_search')}</Text>
                )}

                {filteredProjects.map((project) => (
                    <Card key={project.uid} withBorder>
                        <Flex justify="space-between" align="center" wrap="wrap" gap="xs">
                            <Box>
                                <Group gap="xs">
                                    <Badge color="gray">{project.project_alias}</Badge>
                                    <Text fw={600}>{project.project_name}</Text>
                                </Group>
                                <Text size="xs" c="dimmed">{t('meta_owner', { owner: project.project_owner_name ?? '-' })}</Text>
                            </Box>
                            <Button component={'a'} href={`/project/${project.project_alias}`} size="xs" variant="light">
                                {t('open')}
                            </Button>
                        </Flex>
                    </Card>
                ))}
            </Stack>
        </Card>
    );
};
