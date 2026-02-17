import { RemoveProjectAction } from "@/libs/actions/ProjectAction";
import { Box, Button, Center, Flex, LoadingOverlay, Modal, Space, Typography } from "@mantine/core"
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { CiWarning } from "react-icons/ci";
import { toast } from "sonner";
import { useGlobalLoading } from "../global/GlobalLoadingProvider";

type ProjectRemoveModalProps = {
    opened: boolean;
    onClose: () => void;
    projectUid: string;
}

export const ProjectRemoveModal = (prop: ProjectRemoveModalProps) => {

    const router = useRouter();
    const loadingContext = useGlobalLoading();


    const removeProjectHandle = async (projectUid: string) => {



        loadingContext.setLoadingState(true);
        prop.onClose();




        const removeProjectResult = await RemoveProjectAction(projectUid);

        if (removeProjectResult.state === false) {
            toast.error(removeProjectResult.message);
        }
        else {
            toast.success("Project removed successfully");
            router.refresh();
        }

        loadingContext.setLoadingState(false);

    }



    return (
        <Fragment>
            <Modal
                opened={prop.opened}
                onClose={prop.onClose}
                radius={10}
                withCloseButton={false}
            >
                <Box
                    style={{
                        textAlign: 'center'
                    }}
                >
                    <CiWarning
                        size={60}
                    />
                    <h1>Project Remove Modal</h1>
                    <Typography>
                        Are you sure you want to remove this project?
                    </Typography>
                    <Typography>
                        This action cannot be undone.
                    </Typography>
                </Box>
                <Space h={20} />
                <Flex
                    justify='flex-end'
                    gap={8}
                >
                    <Button
                        color="red"
                        onClick={() => removeProjectHandle(prop.projectUid)}
                    >
                        Remove
                    </Button>
                    <Button
                        variant="outline"
                        onClick={prop.onClose}
                    >
                        Cancel
                    </Button>
                </Flex>
            </Modal>
        </Fragment>

    )
}