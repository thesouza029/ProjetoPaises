const ASCORES = [
  { background: '#dbeafe', text: '#1e3a8a' },
  { background: '#fef3c7', text: '#92400e' },
  { background: '#dcfce7', text: '#166534' },
  { background: '#fee2e2', text: '#991b1b' },
  { background: '#ede9fe', text: '#5b21b6' },
  { background: '#fae8ff', text: '#86198f' },
  { background: '#e0f2fe', text: '#075985' },
  { background: '#fef9c3', text: '#854d0e' },
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}


export function iniciais(name: string): string {
  return name.trim().slice(0, 2).toUpperCase();
}


export function corAvatar(name: string): { background: string; text: string } {
  return ASCORES[hashString(name) % ASCORES.length];
}
