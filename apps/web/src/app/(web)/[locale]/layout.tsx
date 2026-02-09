import '../../../assets/styles/global/reset.css'
import '../../../assets/styles/global/global.scss'
import '@mantine/core/styles.css'; 
import type { Metadata } from "next";
import { PropsWithChildren } from "react";
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { I18nConfig } from '@root/module/i18n/i18n.config';
import { ColorSchemeScript, createTheme, MantineProvider } from '@mantine/core';


export const metadata: Metadata = {
  title: {
    default: "WAIM",
    template: "%s | WAIM",
  },
  description: "Web Access Information Management System",
};

interface RootLayoutProp extends PropsWithChildren {
  params: Promise<{ locale: string }>
}

const RootLayout = async (prop: Readonly<RootLayoutProp>) => {

  const { locale } = await prop.params;
  const messages = await getMessages();

  if (!I18nConfig.routing.locales.includes(locale as 'en' | 'ko')) {
    notFound();
  }


  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <ColorSchemeScript 
          defaultColorScheme='light'
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <MantineProvider 
            theme={createTheme({scale : 1.6})}
            defaultColorScheme='light'
          >
            <div id='root'>
              {prop.children}
            </div>
          </MantineProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export default RootLayout;
