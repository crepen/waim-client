'use client'

import { AddProjectAction } from "@/libs/actions/ProjectAction"
import { DomUtil } from "@crepen/util"
import { useTranslations } from "next-intl"
import { PropsWithChildren, SubmitEvent, useState } from "react"

type AddProjectFormProp = PropsWithChildren & {
    className?: string
}

export const AddProjectForm = (prop: AddProjectFormProp) => {

    const t = useTranslations();

    const [isLoading, setLoading] = useState<boolean>(false);


    const submitEventHandler = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const signInActionResult = await AddProjectAction(formData);

        if (signInActionResult.state === false) {
            alert(signInActionResult.message);
            setLoading(false);
        }
        else {
            setLoading(false);
            window.location.replace('/project');
        }
    }


    return (
        <form
            className={DomUtil.joinClassName(prop.className, "add-project-form")}
            onSubmit={submitEventHandler}
            method="POST"
        >
            {isLoading ? "LOADING" : ""}
            {prop.children}

            <button type="submit">
                SUBMIT
            </button>
            <button
                type="button"
                onClick={() => history.back()}
            >
                CANCEL
            </button>
        </form>
    )
}