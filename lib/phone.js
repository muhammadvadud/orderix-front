// Telefon raqami yordamchilari. Backend raqamni '+' siz saqlaydi (masalan 998940105669).

// Faqat raqamlarni qoldiradi, eng ko'pi 12 ta (998 + 9 raqam).
function digitsOf(value) {
  return (value || '').replace(/\D/g, '').slice(0, 12);
}

// O'zbekiston formati: 998 va 9 ta raqam.
export function isValidPhone(value) {
  return /^998\d{9}$/.test(digitsOf(value));
}

// Ko'rsatish uchun chiroyli format: 998940105669 -> +998 94 010 56 69
export function formatPhone(value) {
  const d = digitsOf(value);
  if (!d) return '';
  const rest = d.startsWith('998') ? d.slice(3) : d;
  const head = d.startsWith('998') ? '+998' : '+';
  const parts = [
    rest.slice(0, 2),
    rest.slice(2, 5),
    rest.slice(5, 7),
    rest.slice(7, 9),
  ].filter(Boolean);
  return parts.length ? `${head} ${parts.join(' ')}` : head;
}

// Inputga yozilayotgan paytda formatlash — ortiqcha raqam yozib bo'lmaydi (max 12).
export function formatPhoneInput(value) {
  const d = digitsOf(value);
  if (!d) return '+998 ';
  return formatPhone(d);
}
