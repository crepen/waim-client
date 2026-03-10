import '../../../assets/styles/global/reset.css'
import '../../../assets/styles/global/global.scss'
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css'
import 'pretendard/dist/web/static/pretendard.css';
import type { Metadata } from "next";
import { PropsWithChildren } from "react";
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { I18nConfig } from '@root/module/i18n/i18n.config';
import { ColorSchemeScript, createTheme, MantineProvider } from '@mantine/core';
import { Toaster } from 'sonner';
import { GlobalLoadingProvider } from '@/components/page/main/global/GlobalLoadingProvider';
import { GlobalHeightProvider } from '@/components/global/provider/HeightProvider';


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

  const materialTheme = createTheme({
    scale: 1.6,
    primaryColor: 'blue',
    defaultRadius: 'md',
    fontFamily: 'Pretendard, Roboto, "Noto Sans KR", sans-serif',
    headings: {
      fontFamily: 'Pretendard, Roboto, "Noto Sans KR", sans-serif',
      fontWeight: '600'
    },
    shadows: {
      xs: '0 1px 3px rgba(0, 0, 0, 0.16)',
      sm: '0 2px 6px rgba(0, 0, 0, 0.16)',
      md: '0 4px 12px rgba(0, 0, 0, 0.18)',
      lg: '0 8px 20px rgba(0, 0, 0, 0.18)',
      xl: '0 12px 28px rgba(0, 0, 0, 0.22)'
    },
    components: {
      Button: {
        defaultProps: {
          radius: 'md'
        }
      },
      Card: {
        defaultProps: {
          radius: 'md',
          shadow: 'xs'
        }
      },
      NavLink: {
        defaultProps: {
          variant: 'light',
          radius: 'md'
        }
      }
    }
  });

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
            theme={materialTheme}
            defaultColorScheme='light'
          >
            {/* <GlobalHeightProvider
              customPropertyName='crp-window-height'
            > */}
              <GlobalLoadingProvider>
                <Toaster />

                <div id='root'>
                  {prop.children}
                </div>
              </GlobalLoadingProvider>
            {/* </GlobalHeightProvider> */}
          </MantineProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export default RootLayout;
