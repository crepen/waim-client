'use client'

import { Box, Card, Center, Group, Text, Title } from "@mantine/core"
import { UpdateGitLabIntegrationButton, UpdateGitLabIntegrationDrawer } from "./UpdateGitLabIntegration"
import { VscDebugDisconnect } from "react-icons/vsc"
import { useDisclosure } from "@mantine/hooks"
import { useTranslations } from "next-intl"

export const GitLabConnCard = () => {
    const t = useTranslations('main.project');

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
                    {t('source_repository')}
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
                        {t('disconnect')}
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