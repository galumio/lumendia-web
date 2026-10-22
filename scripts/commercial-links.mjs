// Exact destinations authorized for these two samples, never a host-wide exception.
export const samplePurchases = Object.freeze({
  'ia-cotidiana-para-adultos-mayores': 'https://payhip.com/b/CHPS9',
  'everyday-ai-for-seniors': 'https://payhip.com/b/Y9fCO',
});

export function commercialLinkAllowed(href, file) {
  if (/[\u0000-\u0020]/.test(href) || /&(?:#\w+|[a-z]+);/i.test(href.replaceAll('&amp;', '&'))) return false;
  if (/^\s*(?:javascript|data|vbscript):/i.test(href)) return false;
  // Include malformed/lookalike URLs and encoded names in the restriction.
  let decoded;
  try { decoded = decodeURIComponent(href); } catch { return false; }
  if (!/payhip|etsy/i.test(decoded)) return true;
  const path = file.replaceAll('\\', '/');
  return Object.entries(samplePurchases).some(([slug, url]) =>
    href === url && path.includes(`/libros/${slug}/`));
}
