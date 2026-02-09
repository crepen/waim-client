import { getRequestConfig } from "next-intl/server";
import { I18nConfig } from "./i18n.config";

export default getRequestConfig(async ({ requestLocale }) => {
        let locale = await requestLocale;
        if (!locale || !I18nConfig.routing.locales.includes(locale as ('ko' | 'en'))) {
            locale = I18nConfig.routing.defaultLocale;
        }

        return {
            locale,
            messages: (await import(`./messages/${locale}.json`)).default,
            getMessageFallback({ namespace, key }) {
                return [namespace, key].filter((part) => part != null).join('.');
            }
        };
    }); 