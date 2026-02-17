'use server'

import authConfig from "@/config/auth/AuthConfig";
import { AuthProvider } from "@crepen/auth";
import { StringUtil } from "@crepen/util";
import { ProjectApiProvider } from "@waim/api";
import { getLocale, getTranslations } from "next-intl/server";


export const AddProjectAction = async (formData: FormData) => {
    const locale = await getLocale();
    const t = await getTranslations();

    try {
        const projectName = formData.get('project-name');
        const projectAlias = formData.get('project-alias');

        const session = await AuthProvider
            .setConfig(authConfig(locale, t("auth.default_error_message")))
            .getSession();


        const resData = await ProjectApiProvider.addProject(
            {
                projectAlias: projectAlias?.toString() ?? "",
                projectName: projectName?.toString() ?? ""
            },
            {
                locale: locale,
                token: session?.token?.accessToken ?? ""
            }
        )

        return {
            state: resData.state,
            message: resData.message,
            data: resData.data
        };
    }
    catch (e) {
        console.error(e);
        return {
            state: false,
            message: t("auth.default_error_message"),
        };
    }
}



export const RemoveProjectAction = async (projectUid: string) => {
    const locale = await getLocale();
    const t = await getTranslations();

    try {

        const session = await AuthProvider
            .setConfig(authConfig(locale, t("auth.default_error_message")))
            .getSession();

        if(!StringUtil.hasText(projectUid)){
            return {
                state : false,
                message : "Project UID is required."
            }
        }

        const resData = await ProjectApiProvider.removeProject(
            projectUid,
            {
                locale: locale,
                token: session?.token?.accessToken ?? ""
            }
        )

        return {
            state: resData.state,
            message: resData.message,
            data: resData.data
        };
    }
    catch (e) {
        console.error(e);
        return {
            state: false,
            message: t("auth.default_error_message"),
        };
    }
}