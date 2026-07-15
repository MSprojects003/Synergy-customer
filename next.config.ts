import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vxykiwifugieiwgqnlih.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },]


    }
}

export default nextConfig
