import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./src/modules/i18n/request.ts');


const nextConfig: NextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    sassOptions: {
        includePaths: [path.join(__dirname, "src/assets/styles")],
        // prependData: `@import "global/_variables.scss";`,
    },
    transpilePackages: ["next-intl", "@crepen/auth", "@crepen/util"],
    allowedDevOrigins :  ["192.168.47.2:3000", "localhost:3000"]
};

export default withNextIntl(nextConfig);
