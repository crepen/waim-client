'use client'

import { ActionIcon, Badge, Box, Button, Card, Flex, Group, Menu, Text, ThemeIcon } from "@mantine/core"
import Link from "next/link"
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { SlBriefcase } from "react-icons/sl";
import { SlOptions } from "react-icons/sl";
import { ProjectRemoveModal } from "./ProjectRemoveModal";

type ProjectListRawProp = {
    projectAlias: string;
    projectName: string;
    projectOwnerName: string;
    projectUid: string;
    groupUid?: string | null;
    groupName?: string | null;
}

export const ProjectListRaw = (prop: ProjectListRawProp) => {
    const t = useTranslations('main.project');

    const [deleteModalOpened, setDeleteModalOpened] = useState(false);

    return (
        <Card
            withBorder
            mb='sm'
        >
            <Flex justify='space-between' align='center' wrap='wrap' gap='xs'>
                <Group gap='xs'>
                    <ThemeIcon radius='xl' size='sm' color='teal' variant='light'>
                        <SlBriefcase size={12} />
                    </ThemeIcon>
                    <Box>
                        <Group gap='xs'>
                            <Badge color='teal' variant='light'>{t('project_badge')}</Badge>
                            <Badge color='gray' variant='light'>{prop.projectAlias}</Badge>
                            <Text component={Link} href={`/project/${prop.projectAlias}`} fw={600} style={{ textDecoration: 'underline' }}>
                                {prop.projectName}
                            </Text>
                        </Group>
                        <Text size="xs" c="dimmed">{t('owner', { owner: prop.projectOwnerName })}</Text>
                        <Text size="xs" c="dimmed">{t('group', { group: prop.groupName ?? prop.groupUid ?? t('root') })}</Text>
                    </Box>
                </Group>
                <Group gap='xs'>
                    <Button component={Link} href={`/project/${prop.projectAlias}`} size='xs' variant='light'>{t('open')}</Button>
                    <Menu
                        shadow="md"
                        width={180}
                        position="bottom-end"
                        withinPortal
                    >
                        <Menu.Target>
                            <ActionIcon
                                variant="subtle"
                            >
                                <SlOptions />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>

                            <Menu.Label>{t('actions')}</Menu.Label>

                            <Menu.Item
                                leftSection={
                                    <FaTrashAlt
                                        size={14}
                                    />
                                }
                                onClick={() => setDeleteModalOpened(true)}
                                color="red"
                            >
                                {t('delete')}
                            </Menu.Item>
                        </Menu.Dropdown>

                    </Menu>
                </Group>
            </Flex>



            <ProjectRemoveModal
                opened={deleteModalOpened}
                onClose={() => setDeleteModalOpened(false)}
                projectUid={prop.projectUid}
            />
        </Card>
    )
}