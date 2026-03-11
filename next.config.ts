// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Opción simple:
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
