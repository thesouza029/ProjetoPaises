function wikimediaSvgToPng(url: string): string {
  const withoutQuery = url.replace(/[?#].*$/, '');

  const match = withoutQuery.match(
    /^(https?:\/\/upload\.wikimedia\.org\/wikipedia\/[^/]+\/)(.+)\/([^/]+)\.svg$/i
  );

  if (!match) {
    return withoutQuery;
  }

  const [, base, relativePath, filename] = match;
  const thumbPath = `${base}thumb/${relativePath}/${filename}.svg`;
  return `${thumbPath}/250px-${filename}.svg.png`;
}

export function flagUrlFromIso(iso2?: string): string {
  if (!iso2) return '';
  const code = iso2.trim().toLowerCase();
  if (!/^[a-z]{2}$/.test(code)) return '';
  return `https://flagcdn.com/w320/${code}.png`;
}

export function normalizeFlagUrl(url?: string): string {
  if (!url) return '';

  const trimmed = url.trim();
  if (!trimmed) return '';

  const lower = trimmed.toLowerCase();
  const isImageLike =
    lower.endsWith('.png') ||
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.webp') ||
    lower.includes('.svg');

  if (!isImageLike) return '';

  if (lower.includes('.svg')) {
    return wikimediaSvgToPng(trimmed);
  }

  return trimmed;
}


export function resolveFlagUrl(options: { iso2?: string; flag?: string }): string {
  const fromIso = flagUrlFromIso(options.iso2);
  if (fromIso) return fromIso;
  return normalizeFlagUrl(options.flag);
}

export function flagToPng(url?: string): string {
  return normalizeFlagUrl(url);
}