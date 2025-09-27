const isProd = process.env.NEXT_PUBLIC_NODE_ENV === 'production';

const internalHost = process.env.NEXT_PUBLIC_HOST_PATH || 'localhost';

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Ensure Next.js uses SSG instead of SSR
    // https://nextjs.org/docs/pages/building-your-application/deploying/static-exports
    output: 'export',
    // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
   //  trailingSlash: true,
    // Note: This feature is required to use the Next.js Image component in SSG mode.
    // See https://nextjs.org/docs/messages/export-image-api for different workarounds.
    images: {
        unoptimized: true,
    },
    // Configure assetPrefix or else the server won't properly resolve your assets.
    assetPrefix: isProd ? undefined : `http://${internalHost}:4000`,
};

export default nextConfig;