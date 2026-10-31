<div align="center">

# OrderiX · Frontend

**Restoran boshqaruvi uchun qulay ish maydoni**

Menejer paneli · Ofitsiant interfeysi · Jonli buyurtmalar

![Next.js](https://img.shields.io/badge/Next.js-14-111827?style=flat-square&logo=nextdotjs) ![React](https://img.shields.io/badge/React-18-149ECA?style=flat-square&logo=react&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-ESModules-F7DF1E?style=flat-square&logo=javascript&logoColor=111827) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)

[Backend](https://github.com/muhammadvadud/orderix) · [O‘rnatish](#ornatish) · [Docker](#docker-orqali-ishga-tushirish) · [Tuzilma](#papka-tuzilmasi)

</div>

## Loyiha haqida

OrderiX Frontend — restoran menejerlari va ofitsiantlari uchun Next.js App Router asosida yaratilgan veb interfeys. Unda buyurtmalar, menyu, zallar va stollar, xodimlar hamda hisobotlar bir joyda boshqariladi. Ma’lumotlar [OrderiX API](https://github.com/muhammadvadud/orderix) orqali olinadi, buyurtma va stol o‘zgarishlari WebSocket orqali yangilanadi.

## Imkoniyatlar

- **Menejer paneli:** dashboard, buyurtmalar, menyu, joylashuvlar, xodimlar va sozlamalar.
- **Ofitsiant interfeysi:** stollar bilan ishlash, buyurtma yaratish va holatlarni kuzatish.
- **Kirish:** telefon va parol yoki OTP, JWT sessiyasi va rolga asoslangan yo‘naltirish.
- **Hisobotlar:** Recharts grafiklari, sana oralig‘i bo‘yicha ko‘rsatkichlar va XLSX eksport.
- **Real vaqt:** buyurtma va joylashuvlar o‘zgarganda ma’lumotlarni yangilash, uzilganda WebSocket’ga qayta ulanish.
- **Interfeys:** Tailwind CSS va Lucide ikonkalari bilan yaratilgan komponentlar.

## Talablar

- Node.js 20 LTS va npm — repository Docker konfiguratsiyasiga mos.
- Ishlayotgan [OrderiX backend](https://github.com/muhammadvadud/orderix).
- Docker orqali ishga tushirish uchun Docker Compose v2.

## O‘rnatish

```bash
git clone https://github.com/muhammadvadud/orderix-front.git
cd orderix-front
cp .env.example .env
npm ci
npm run dev
```

Brauzerda `http://localhost:3000` manzilini oching. Kirish uchun backend’da yaratilgan hisobdan foydalaning.

## Muhit sozlamalari

| O‘zgaruvchi | Standart namuna | Vazifasi |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8080/api/v1` | Brauzer ulanadigan backend API manzili |
| `COMPOSE_PROFILES` | `dev` | Docker rejimi: `dev` yoki `prod` |
| `WEB_PORT` | `3000` | Docker orqali ochiladigan host porti |

`NEXT_PUBLIC_API_BASE_URL` brauzerdan ochiladigan manzil bo‘lishi kerak. Backend’da `CORS_ALLOWED_ORIGINS` frontend origin’iga mos sozlanadi. WebSocket manzili API manzilidan avtomatik hosil qilinadi: masalan, `http://localhost:8080/api/v1` → `ws://localhost:8080/ws/realtime/`.

## Docker orqali ishga tushirish

Development uchun `.env` ichida `COMPOSE_PROFILES=dev` qoldiring:

```bash
docker compose up -d --build
docker compose logs -f web-dev
```

Kod o‘zgarganda hot reload ishlaydi. Production build uchun `.env` ichida `COMPOSE_PROFILES=prod` o‘rnating:

```bash
docker compose --profile dev down
docker compose up -d --build
```

`NEXT_PUBLIC_*` qiymatlari production build vaqtida brauzer kodiga joylanadi. API manzilini o‘zgartirsangiz, image’ni qayta build qiling.

## Asosiy sahifalar

| Yo‘l | Vazifasi |
| --- | --- |
| `/` | Menejer sahifasiga yo‘naltirish |
| `/login` | Parol yoki OTP bilan kirish |
| `/manager` | Menejer ish maydoni |
| `/waiter` | Ofitsiant ish maydoni |

## Papka tuzilmasi

```text
app/                  # App Router sahifalari, layout va global stillar
components/screens/   # Dashboard, menyu, buyurtmalar va hisobotlar
components/waiter/    # Ofitsiant ekranlari
components/login/     # Kirish interfeyslari
lib/api.js            # HTTP so‘rovlari va sessiya
lib/services.js       # Domen bo‘yicha API chaqiruvlari
lib/adapters.js       # Backend ma’lumotlarini UI shakliga o‘girish
lib/realtime.js       # WebSocket ulanishi
lib/export.js         # XLSX eksport
public/               # Statik fayllar
middleware.js         # Sahifalarga kirishni yo‘naltirish
```

## Build

```bash
npm run build
npm start
```

Development serverini boshqa portda ochish uchun `npm run dev -- --port 3001` ishlating. `WEB_PORT` Docker Compose uchun qo‘llanadi.

## Bog‘liq loyiha

[OrderiX Backend](https://github.com/muhammadvadud/orderix) — Django REST Framework, PostgreSQL, Redis va Django Channels asosidagi API.
