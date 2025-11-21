/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },

  env: {
    NEXT_PUBLIC_API_URL: "https://api.webz.io/newsApiLite",
  },

  // Disable all source-maps (fix Turbopack Windows bug)
  productionBrowserSourceMaps: false,
  generateEtags: false,

  compiler: {
    removeConsole: false,
  },

  experimental: {
    serverSourceMaps: false,
    clientSourceMaps: false,
    optimizePackageImports: [],
  },

  turbopack: {
    resolveExtensions: [".js", ".jsx", ".ts", ".tsx"],
  },
};

module.exports = nextConfig;
