import { PropsWithChildren } from 'react';

const AppRootLayout = ({ children }: PropsWithChildren) => {
    return (
        <html suppressHydrationWarning>
            <body>
                {children}
            </body>
        </html>
    );
};

export default AppRootLayout;