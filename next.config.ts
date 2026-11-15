import type { NextConfig } from "next";
const config: NextConfig = {
  turbopack: { root: process.cwd() },
  async headers() {
    return [{source:'/:path*',headers:[
      {key:'X-Content-Type-Options',value:'nosniff'},
      {key:'X-Frame-Options',value:'DENY'},
      {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
      {key:'Strict-Transport-Security',value:'max-age=31536000'},
      {key:'Content-Security-Policy',value:"frame-ancestors 'none'; object-src 'none'; base-uri 'self'"},
    ]}];
  },
};
export default config;
