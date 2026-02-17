'use client'

import { Box, Card, Center, Group, Text, Title } from "@mantine/core"
import { UpdateGitLabIntegrationButton, UpdateGitLabIntegrationDrawer } from "./UpdateGitLabIntegration"
import { VscDebugDisconnect } from "react-icons/vsc"
import { useState } from "react"
import { useDisclosure } from "@mantine/hooks"

export const GitLabConnCard = () => {

    const [opened, { open, close }] = useDisclosure(false);


    return (
        <Card
            withBorder
            shadow="md"
        >
            <Group
                align="center"
                justify="space-between"
            >
                <Title order={5}>
                    Source Repository
                </Title>
                <UpdateGitLabIntegrationButton
                    onClick={open}
                />
            </Group>
            <Center
                mt={10}
                p={30}
            >
                <Box
                    style={{
                        textAlign: 'center'
                    }}
                >
                    <VscDebugDisconnect
                        size={40}
                    />
                    <Text>
                        DISCONNECT
                    </Text>
                </Box>
            </Center>


            <UpdateGitLabIntegrationDrawer
                opened={opened}
                onClose={close}
            />
        </Card>
    )
}