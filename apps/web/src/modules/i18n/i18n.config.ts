import { createNavigation } from "next-intl/navigation"
import { defineRouting } from "next-intl/routing";

export class I18nConfig {
    static initConfig = {
        locales: ['ko', 'en'],
        defaultLocale: 'ko',
        localeDetection: true
    }

    static routing = defineRouting(this.initConfig);
    static initNavigation = createNavigation(this.routing);


}