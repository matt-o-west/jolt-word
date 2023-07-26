/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  tailwind: true,
  ignoredRouteFiles: ['**/.*'],
  // When running locally in development mode, we use the built-in remix
  // server. This does not understand the vercel lambda module format,
  // so we default back to the standard build output.
  server: process.env.NODE_ENV === 'development' ? undefined : './server.js',
  future: {
    unstable_tailwind: true,
    v2_errorBoundary: true,
  },

  appDirectory: 'app',
  browserBuildDirectory: 'public/build',
  publicPath: '/build/',
  serverDependenciesToBundle: [/^marked.*/],
  serverBuildTarget: 'vercel',
  devServerPort: 8002,
}
