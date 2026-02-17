'use client'

import 'dayjs/locale/ko';
import { AddProjectAction } from "@/libs/actions/ProjectAction"
import { DomUtil } from "@crepen/util"
import { Box, Button, Card, CloseButton, FocusTrap, Grid, Group, Input, ScrollArea, SimpleGrid, Text, TextInput, Title, Typography } from "@mantine/core"
import { useLocale, useTranslations } from "next-intl"
import { Fragment, PropsWithChildren, SubmitEvent, useEffect, useRef, useState, useTransition } from "react"
import { useGlobalLoading } from "../global/GlobalLoadingProvider"
import { useRouter } from "next/navigation"
import { DatePickerInput } from '@mantine/dates'
import { FaRegCalendarMinus } from "react-icons/fa"
import { MdOutlineCalendarMonth } from "react-icons/md"

type AddProjectFormProp = PropsWithChildren & {
    className?: string
}

export const AddProjectForm = (prop: AddProjectFormProp) => {

    const t = useTranslations();

    const [isLoading, setLoading] = useState<boolean>(false);
    const loadingContext = useGlobalLoading();

    const projectNameRef = useRef<HTMLInputElement>(null);

    const router = useRouter();

    const [isPending, startTransition] = useTransition();


    const submitEventHandler = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        loadingContext.setLoadingState(true);

        const formData = new FormData(e.currentTarget);
        const signInActionResult = await AddProjectAction(formData);

        if (signInActionResult.state === false) {
            alert(signInActionResult.message);
            loadingContext.setLoadingState(false);
        }
        else {
            loadingContext.setLoadingState(false);
            startTransition(() => {
                router.push('/project');
            });

        }
    }

    useEffect(() => {
        loadingContext.setLoadingState(isPending);
        return () => {
            loadingContext.setLoadingState(false);
        }
    }, [isPending])


    return (
        <FocusTrap active={true}>
            <form
                className={DomUtil.joinClassName(prop.className, "")}
                onSubmit={submitEventHandler}
                method="POST"
            >
                <TextInput
                    placeholder="Clearable input"
                    rightSectionPointerEvents="all"
                    mb="sm"
                    ref={projectNameRef}
                    label="Project Name"
                    name="project-name"
                    maw={500}
                    rightSection={
                        <CloseButton
                            aria-label="Clear input"
                            onClick={(e) => {
                                // Clear input value

                                if (projectNameRef.current) {
                                    projectNameRef.current.value = "";
                                }
                            }}
                        />
                    }
                />

                <TextInput
                    placeholder="Clearable input"
                    rightSectionPointerEvents="all"
                    mb="sm"
                    ref={projectNameRef}
                    label="Project Alias"
                    name="project-alias"
                    maw={500}
                    rightSection={
                        <CloseButton
                            aria-label="Clear input"
                            onClick={(e) => {
                                // Clear input value

                                if (projectNameRef.current) {
                                    projectNameRef.current.value = "";
                                }
                            }}
                        />
                    }
                />



                <ProjectDateInputBox />



                <Group
                    mt={30}
                >
                    <Button type="submit">
                        SUBMIT
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => history.back()}
                    >
                        CANCEL
                    </Button>
                </Group>


            </form>
        </FocusTrap>

    )
}




const ProjectDateInputBox = () => {

    const locale = useLocale();

    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);


    return (
        <Fragment>
            <Title
                order={3}
            >
                Project Date
            </Title>

            <DatePickerInput
                leftSection={<MdOutlineCalendarMonth size={14} />}
                label="Project Start Date"
                maw={500}
                mt={10}
                valueFormat="YYYY-MM-DD"
                firstDayOfWeek={0}
                locale={locale ?? 'en'}
                value={startDate}
                onChange={(date) => setStartDate(date)}
                rightSection={
                    startDate && <CloseButton
                        aria-label="Clear input"
                        onClick={(e) => {
                            setStartDate(null);
                        }}
                    />
                }
                rightSectionPointerEvents='all'
            />




            <DatePickerInput
                leftSection={<MdOutlineCalendarMonth size={14} />}
                label="Project End Date"
                maw={500}
                mt={10}
                valueFormat="YYYY-MM-DD"
                firstDayOfWeek={0}
                locale={locale ?? 'en'}
                value={endDate}
                onChange={(date) => setEndDate(date)}
                rightSection={
                    endDate && <CloseButton
                        aria-label="Clear input"
                        onClick={(e) => {
                            setEndDate(null);
                        }}
                    />
                }
                rightSectionPointerEvents='all'
            />
        </Fragment>
    )
}