'use server'

import authConfig from '@/config/auth/AuthConfig';
import { AuthProvider } from '@crepen/auth';
import { GroupApiProvider } from '@waim/api';
import { getLocale, getTranslations } from 'next-intl/server';

export const AddGroupAction = async (formData: FormData) => {
    const locale = await getLocale();
    const t = await getTranslations();

    try {
        const session = await AuthProvider
            .setConfig(authConfig(locale, t('auth.default_error_message')))
            .getSession();

        const groupAlias = formData.get('group-alias')?.toString() ?? '';
        const parentGroupUid = formData.get('parent-group-uid')?.toString() ?? '';

        const result = await GroupApiProvider.addGroup(
            {
                groupName: formData.get('group-name')?.toString() ?? '',
                groupAlias,
                parentGroupUid
            },
            {
                locale,
                token: session?.token?.accessToken ?? ''
            }
        );

        let createdGroupUid: string | undefined = undefined;

        if (result.state && groupAlias) {
            const searchResult = await GroupApiProvider.searchGroup(
                {
                    page: 0,
                    size: 100,
                    keyword: groupAlias
                },
                {
                    locale,
                    token: session?.token?.accessToken ?? ''
                }
            );

            const matched = (searchResult.data ?? []).find((group) => {
                const parentUid = group.parent_group_uid ?? '';
                return group.group_alias === groupAlias && parentUid === parentGroupUid;
            });

            createdGroupUid = matched?.uid;
        }

        return {
            state: result.state,
            message: result.message,
            data: {
                groupUid: createdGroupUid
            }
        };
    }
    catch (e) {
        return {
            state: false,
            message: t('auth.default_error_message')
        };
    }
}

export const UpdateGroupAction = async (formData: FormData) => {
    const locale = await getLocale();
    const t = await getTranslations();

    try {
        const session = await AuthProvider
            .setConfig(authConfig(locale, t('auth.default_error_message')))
            .getSession();

        const result = await GroupApiProvider.updateGroup(
            {
                groupUid: formData.get('group-uid')?.toString() ?? '',
                groupName: formData.get('group-name')?.toString() ?? '',
                groupAlias: formData.get('group-alias')?.toString() ?? '',
                parentGroupUid: formData.get('parent-group-uid')?.toString() ?? ''
            },
            {
                locale,
                token: session?.token?.accessToken ?? ''
            }
        );

        return {
            state: result.state,
            message: result.message
        };
    }
    catch (e) {
        return {
            state: false,
            message: t('auth.default_error_message')
        };
    }
}

export const RemoveGroupAction = async (groupUid: string) => {
    const locale = await getLocale();
    const t = await getTranslations();

    try {
        const session = await AuthProvider
            .setConfig(authConfig(locale, t('auth.default_error_message')))
            .getSession();

        const result = await GroupApiProvider.removeGroup(
            groupUid,
            {
                locale,
                token: session?.token?.accessToken ?? ''
            }
        );

        return {
            state: result.state,
            message: result.message
        };
    }
    catch (e) {
        return {
            state: false,
            message: t('auth.default_error_message')
        };
    }
}
