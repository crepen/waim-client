'use client'

import type { GroupData, ProjectData } from '@waim/api';
import { Badge, Box, Button, Card, Divider, Flex, Group, Input, Select, Space, Stack, Text, ThemeIcon } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { SlBriefcase, SlLayers } from 'react-icons/sl';

type GroupResourceListPanelProps = {
    groupUid: string;
    childGroups: GroupData[];
    projects: ProjectData[];
}

type SortOption = 'group_first' | 'name_asc' | 'name_desc';
type FilterOption = 'all' | 'group' | 'project';

type UnifiedItem = {
    key: string;
    type: 'group' | 'project';
    name: string;
    alias: string;
    href: string;
    meta: string;
}

export const GroupResourceListPanel = ({ groupUid, childGroups, projects }: GroupResourceListPanelProps) => {
    const t = useTranslations('main.group');
    const [keyword, setKeyword] = useState('');
    const [sortOption, setSortOption] = useState<SortOption>('group_first');
    const [filterOption, setFilterOption] = useState<FilterOption>('all');

    const listItems = useMemo(() => {
        const groupItems: UnifiedItem[] = childGroups.map((group) => ({
            key: `group-${group.uid}`,
            type: 'group',
            name: group.group_name ?? '',
            alias: group.group_alias ?? '',
            href: `/group/${group.uid}?group_alias=${encodeURIComponent(group.group_alias ?? '')}`,
            meta: t('meta_child_project', {
                childCount: group.child_group_count ?? 0,
                projectCount: group.linked_project_count ?? 0
            })
        }));

        const projectItems: UnifiedItem[] = projects.map((project) => ({
            key: `project-${project.uid}`,
            type: 'project',
            name: project.project_name ?? '',
            alias: project.project_alias ?? '',
            href: `/project/${project.project_alias}?project_alias=${encodeURIComponent(project.project_alias ?? '')}`,
            meta: t('meta_owner', { owner: project.project_owner_name ?? '-' })
        }));

        const merged = [...groupItems, ...projectItems];
        const term = keyword.trim().toLowerCase();

        const filtered = merged.filter((item) => {
            if (filterOption !== 'all' && item.type !== filterOption) {
                return false;
            }

            if (!term) {
                return true;
            }

            return item.name.toLowerCase().includes(term)
                || item.alias.toLowerCase().includes(term)
                || item.meta.toLowerCase().includes(term);
        });

        return filtered.sort((a, b) => {
            if (sortOption === 'name_asc') {
                return a.name.localeCompare(b.name);
            }

            if (sortOption === 'name_desc') {
                return b.name.localeCompare(a.name);
            }

            if (a.type !== b.type) {
                return a.type === 'group' ? -1 : 1;
            }

            return a.name.localeCompare(b.name);
        });
    }, [childGroups, filterOption, keyword, projects, sortOption]);

    return (
        <Card withBorder>
            <Stack gap="sm">
                <Flex justify="space-between" align="center" wrap="wrap" gap="xs">
                    <Box>
                        <Text fw={700}>{t('resource_title')}</Text>
                        <Text size="sm" c="dimmed">{t('resource_desc')}</Text>
                    </Box>
                    <Group gap="xs">
                        <Button component={'a'} href={`/group/add?parent_group_uid=${groupUid}`} size="xs" variant="light">
                            {t('add_child_group')}
                        </Button>
                        <Button component={'a'} href={`/project/add?group_uid=${groupUid}`} size="xs">
                            {t('add_project')}
                        </Button>
                    </Group>
                </Flex>

                <Group gap="xs" align="end" wrap="wrap">
                    <Input
                        w={280}
                        placeholder={t('search_resource_placeholder')}
                        value={keyword}
                        onChange={(e) => setKeyword(e.currentTarget.value)}
                    />
                    <Select
                        w={180}
                        label={t('filter')}
                        value={filterOption}
                        onChange={(value) => setFilterOption((value as FilterOption) ?? 'all')}
                        data={[
                            { value: 'all', label: t('filter_all') },
                            { value: 'group', label: t('filter_groups') },
                            { value: 'project', label: t('filter_projects') }
                        ]}
                    />
                    <Select
                        w={180}
                        label={t('sort')}
                        value={sortOption}
                        onChange={(value) => setSortOption((value as SortOption) ?? 'group_first')}
                        data={[
                            { value: 'group_first', label: t('sort_group_first') },
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
                {listItems.length === 0 && (
                    <Text c="dimmed" size="sm">{t('no_items')}</Text>
                )}

                {listItems.map((item) => (
                    <Card key={item.key} withBorder px="md" py="sm">
                        <Flex justify="space-between" align="center" wrap="wrap" gap="xs">
                            <Group gap="xs">
                                <ThemeIcon
                                    radius="xl"
                                    size="sm"
                                    color={item.type === 'group' ? 'indigo' : 'teal'}
                                    variant="light"
                                >
                                    {item.type === 'group' ? <SlLayers size={12} /> : <SlBriefcase size={12} />}
                                </ThemeIcon>
                                <Badge
                                    color={item.type === 'group' ? 'indigo' : 'teal'}
                                    variant="light"
                                >
                                    {item.type === 'group' ? t('group_badge') : t('project_badge')}
                                </Badge>
                                <Badge color="gray" variant="light">{item.alias}</Badge>
                                <Text component={'a'} href={item.href} fw={600} style={{ textDecoration: 'underline' }}>
                                    {item.name}
                                </Text>
                            </Group>
                            <Text size="xs" c="dimmed" mt={4}>{item.meta}</Text>
                        </Flex>
                    </Card>
                ))}
            </Stack>
        </Card>
    );
};
