'use client'

import { ActionIcon, Badge, Box, Card, Grid, Group, Menu, Paper, Space, Text, Typography } from "@mantine/core"
import Link from "next/link"
import { useState } from "react";
import { FaTrash, FaTrashAlt } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";
import { TbTrash } from "react-icons/tb";
import { ProjectRemoveModal } from "./ProjectRemoveModal";

type ProjectListRawProp = {
    projectAlias: string;
    projectName: string;
    projectOwnerName: string;
    projectUid: string;
}

export const ProjectListRaw = (prop: ProjectListRawProp) => {

    const [deleteModalOpened, setDeleteModalOpened] = useState(false);

    return (
        <Card
            padding="sm"
            pl='lg'
            pr='lg'
            radius="md"
            shadow="sm"
            withBorder
            className="project-item"
            mb='sm'
        >
            <Grid
                align="center"
            >
                <Grid.Col span={4}>
                    <Box>
                        <Badge color="blue">{prop.projectAlias}</Badge>
                        <Space h={5} />
                        <Typography>
                            <Link href={`/project/${prop.projectAlias}`}>
                                {prop.projectName}
                            </Link>
                        </Typography>
                    </Box>
                </Grid.Col>
                <Grid.Col span={7}>
                    <Text size="sm">{prop.projectOwnerName}</Text>
                </Grid.Col>
                <Grid.Col span={1} style={{ textAlign: 'end' }}>
                    <Menu
                        shadow="md"
                        width={200}
                        position="bottom-end"
                        // transitionProps={{ transition: 'pop' }}
                        withinPortal
                    >
                        <Menu.Target>
                            <ActionIcon
                                variant="white"
                            >
                                <SlOptions />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>

                            <Menu.Label>
                                Project Actions
                            </Menu.Label>

                            <Menu.Item
                                leftSection={
                                    <FaTrashAlt
                                        size={14}
                                    />
                                }
                                onClick={() => setDeleteModalOpened(true)}
                                color="red"
                            >
                                Delete
                            </Menu.Item>
                        </Menu.Dropdown>

                    </Menu>
                </Grid.Col>
            </Grid>



            <ProjectRemoveModal
                opened={deleteModalOpened}
                onClose={() => setDeleteModalOpened(false)}
                projectUid={prop.projectUid}
            />
        </Card>
    )
}