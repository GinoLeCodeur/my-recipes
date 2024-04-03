/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    images: {
        remotePatterns: [{ hostname: '*.public.blob.vercel-storage.com' }],
    },
};

export default nextConfig;
