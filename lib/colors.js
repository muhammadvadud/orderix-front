// Xodim avatarlari uchun ko'zga yoqadigan och ranglar palitrasi.
// Random RGB emas — qo'lda tanlangan 50 ta yumshoq pastel rang.
export const AVATAR_COLORS = [
  '#FFD8A8', '#FFC9C9', '#FFD6E7', '#EEBEFA', '#D0BFFF',
  '#BAC8FF', '#A5D8FF', '#99E9F2', '#96F2D7', '#B2F2BB',
  '#D8F5A2', '#FFEC99', '#FFE066', '#FCC2D7', '#E599F7',
  '#B197FC', '#91A7FF', '#74C0FC', '#66D9E8', '#63E6BE',
  '#8CE99A', '#C0EB75', '#FFD43B', '#FAB005', '#FF8787',
  '#F783AC', '#DA77F2', '#9775FA', '#748FFC', '#4DABF7',
  '#3BC9DB', '#38D9A9', '#69DB7C', '#A9E34B', '#FFA94D',
  '#FF6B6B', '#F06595', '#CC5DE8', '#845EF7', '#5C7CFA',
  '#339AF0', '#22B8CF', '#20C997', '#51CF66', '#94D82D',
  '#FFC078', '#FFA8A8', '#FCDDEC', '#C3FAE8', '#D3F9D8',
];

// Berilgan urug'dan (masalan telefon yoki ism) barqaror rang tanlaydi —
// bir xil xodim doim bir xil rangni oladi, lekin xodimlar orasida xilma-xil.
export function pickAvatarColor(seed = '') {
  const str = String(seed);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  if (!str) hash = Math.floor(Math.random() * AVATAR_COLORS.length);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

// Fon yorqinligiga qarab o'qiladigan matn rangini qaytaradi:
// och fonlarda to'q, to'q fonlarda oq.
export function textColorFor(bg = '#000') {
  const hex = String(bg).replace('#', '');
  if (hex.length < 6) return '#fff';
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  // Sezilgan yorqinlik (perceived luminance)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? '#1f2937' : '#fff';
}
