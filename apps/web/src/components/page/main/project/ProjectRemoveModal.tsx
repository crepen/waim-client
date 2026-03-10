import { RemoveProjectAction } from "@/libs/actions/ProjectAction";
import { Box, Button, Flex, Modal, Space, Text } from "@mantine/core"
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { CiWarning } from "react-icons/ci";
import { toast } from "sonner";
import { useGlobalLoading } from "../global/GlobalLoadingProvider";

type ProjectRemoveModalProps = {
    opened: boolean;
    onClose: () => void;
    projectUid: string;
}

export const ProjectRemoveModal = (prop: ProjectRemoveModalProps) => {
    const t = useTranslations('main.project');

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
            toast.success(t('remove_success'));
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
                    <h1>{t('remove_modal_title')}</h1>
                    <Text>{t('remove_modal_desc_1')}</Text>
                    <Text>{t('remove_modal_desc_2')}</Text>
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
                        {t('remove_confirm')}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={prop.onClose}
                    >
                        {t('cancel')}
                    </Button>
                </Flex>
            </Modal>
        </Fragment>

    )
}