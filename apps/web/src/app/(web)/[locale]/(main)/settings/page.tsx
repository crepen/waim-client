import { SettingRowItem } from '@/components/page/main/settings/SettingRowItem';
import '../../../../../assets/styles/pages/settings.page.scss';

import { SubPageTemplate } from "@/components/page/main/global/SubPageTemplate";
import { Select } from "@mantine/core";
import { UserApiProvider } from "@waim/api";
import { getLocale } from "next-intl/server";
import { PropsWithChildren } from "react";
import { LanguageConfigItem } from '@/components/page/main/settings/items/LanguageConfigItem';

interface SettingPageProp extends PropsWithChildren {
    params: Promise<{ locale: string }>
}

const SettingPage = async (prop: SettingPageProp) => {

    const { locale } = await prop.params;

    const localed = await getLocale();


    // UserApiProvider.getUserConfig({
    //     locale : await getLocale()
    // })

    return (
        <SubPageTemplate
            pageTitle="Settings"
            className='user-setting-page'
        >
            <div>
                <SettingRowItem
                    title='Language'
                >
                    <LanguageConfigItem 
                        locale={locale ?? ''}
                    />
                </SettingRowItem>


            </div>
        </SubPageTemplate>
    )

}


export default SettingPage;