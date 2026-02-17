import { ActionIcon, Button, Divider, Drawer, Group, Modal, PasswordInput, TextInput, Title } from "@mantine/core";
import { IoSettingsOutline } from "react-icons/io5";

type UpdateGitLabIntegrationModalProps = {
    opened: boolean;
    onClose: () => void;
}

export const UpdateGitLabIntegrationDrawer = (prop: UpdateGitLabIntegrationModalProps) => {

    const submitEventHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const formData = new FormData(e.currentTarget);
        const repoUrl = formData.get("gitlab-repo-url");
        const accessToken = formData.get("gitlab-access-token");

        console.log("Repository URL:", repoUrl);
        console.log("Access Token:", accessToken);
    }


    return (
        <Drawer
            opened={prop.opened}
            onClose={prop.onClose}
            withCloseButton={false}
            position="right"
            overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        >
            <form onSubmit={submitEventHandler}>
                <Title order={3}>
                    Update GitLab Integration Settings
                </Title>

                <Divider my={10} />

                <TextInput
                    label="Repository URL"
                    mb={10}
                    data-autofocus
                    radius={10}
                    name="gitlab-repo-url"
                />

                <PasswordInput
                    label="Access Token"
                    mb={10}
                    radius={10}
                    name="gitlab-access-token"
                />

                <Group
                    justify="flex-end"
                    mt={20}
                >
                    <Button
                        type="submit"
                    >
                        Save
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={prop.onClose}
                    >
                        Cancel
                    </Button>
                </Group>
            </form>
        </Drawer>
    )
}

type UpdateGitLabIntegrationButtonProps = {
    onClick: () => void;
}

export const UpdateGitLabIntegrationButton = (prop: UpdateGitLabIntegrationButtonProps) => {
    return (
        <ActionIcon
            variant="white"
            color="gray"
            p={0}
            m={0}
            onClick={prop.onClick}
        >
            <IoSettingsOutline />
        </ActionIcon>
    )
}