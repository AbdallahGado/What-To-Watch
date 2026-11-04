export function getSiteUrl(): URL {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const deploymentHost =
    process.env.VERCEL_ENV === 'production'
      ? 'what-towatch.vercel.app'
      : process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  const fallbackUrl = deploymentHost
    ? `https://${deploymentHost}`
    : 'http://localhost:3000';

  try {
    const url = new URL(configuredUrl || fallbackUrl);
    if (
      (url.protocol !== 'https:' && url.protocol !== 'http:') ||
      url.username ||
      url.password ||
      (process.env.VERCEL === '1' && url.protocol !== 'https:')
    ) {
      throw new Error('Site URL must use HTTP or HTTPS.');
    }
    return new URL(url.origin);
  } catch (error) {
    if (!configuredUrl) throw error;
    console.error('Invalid NEXT_PUBLIC_SITE_URL; using deployment host fallback.', error);
    return new URL(fallbackUrl);
  }
}
