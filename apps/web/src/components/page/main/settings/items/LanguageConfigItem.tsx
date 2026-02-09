'use client'

import { UserConfigAction } from "@/libs/actions/UserConfigAction"
import { Select } from "@mantine/core"

interface LanguageConfigRowItemProp {
    locale?: string
}

export const LanguageConfigItem = (prop: LanguageConfigRowItemProp) => {
    return (
        <Select
            defaultValue={prop.locale ?? 'ko'}
            allowDeselect={false}
            data={[{
                label: '한국어',
                value: 'ko'
            }, {
                label: 'English',
                value: 'en'
            }]}
            onChange={async (value) => {
                if (value) {
                    await UserConfigAction('SITE_LANGUAGE', value);
                }
            }}
        />
    )
}