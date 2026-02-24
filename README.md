# Japan Surplus Store — Inventory Management Web App

A production-ready inventory and storefront web app for a small Japan Surplus Store. Built with **Next.js (App Router)**, **TypeScript**, **MongoDB (Mongoose)**, and **TailwindCSS**. Mobile-first, with cart (localStorage), Messenger-based checkout, and a protected admin panel for CRUD on items.

---

## Features

- **Homepage** — about, contact, and Facebook link
- **Items page** — Grid of items from MongoDB; card click opens modal with full details; Add to Cart
- **Cart** — Stored in localStorage; navbar cart icon opens modal with list, quantity, remove, total, and Checkout
- **Checkout** — Builds order summary and redirects to Facebook Messenger (`m.me/<PAGE>?text=...`) for payment by conversation
- **Admin** — Login (JWT); add/edit/delete items; upload images to Cloudflare R2 or paste image URL; delete confirmation dialog
- **UI** — Loading skeletons, toasts (react-hot-toast), smooth transitions, responsive layout

---

## Prerequisites

- **Node.js** 18+
- **MongoDB** (local or Atlas)
- **npm** (or yarn/pnpm)

---

## Setup

### 1. Install dependencies

```bash
cd japan-surplus-store
npm install
```

### 2. Environment variables

Copy the example env and set your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string (e.g. `mongodb://localhost:27017` or full URI with database) |
| `MONGODB_DB_NAME` | Database name where collections (`users`, `items`) live (e.g. `japan-surplus-store`). Optional if the database is already in the URI. |
| `JWT_SECRET` | Secret for admin JWT (use a long random string in production) |
| `ADMIN_USERNAME` | Username for the first admin (used only when running `npm run seed`) |
| `ADMIN_PASSWORD` | Password for the first admin (used only when running `npm run seed`; stored hashed in DB) |
| `NEXT_PUBLIC_FACEBOOK_PAGE_USERNAME` | Facebook Page username for Messenger checkout (e.g. from `facebook.com/YourPage` → `YourPage`) |
| **R2 (Cloudflare)** | For admin image uploads (optional; you can still paste image URLs): |
| `R2_ACCOUNT_ID` | Your Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | R2 API token access key (Dashboard → R2 → Manage R2 API Tokens) |
| `R2_SECRET_ACCESS_KEY` | R2 API token secret key |
| `R2_BUCKET_NAME` | R2 bucket name (e.g. `japan-surplus-images`) |
| `R2_PUBLIC_URL` | Public URL for the bucket — use R2’s public bucket URL (e.g. `https://pub-xxxx.r2.dev`) or a custom domain. No trailing slash. |

Admin credentials are stored in the **User** collection (hashed password). To create the first admin, run once:

```bash
npm run seed
```

### 3. MongoDB

- **Local:** Start MongoDB. Set `MONGODB_URI=mongodb://localhost:27017` and `MONGODB_DB_NAME=japan-surplus-store` (or put the database in the URI: `mongodb://localhost:27017/japan-surplus-store`).
- **Atlas:** Create a cluster, get connection string, and set `MONGODB_URI` (and optionally `MONGODB_DB_NAME`) in `.env.local`.

No need to create collections manually; Mongoose will create them when you add the first item or run `npm run seed`.

### 4. Cloudflare R2 (optional, for image uploads)

1. In [Cloudflare Dashboard](https://dash.cloudflare.com) go to **R2** and create a bucket (e.g. `japan-surplus-images`).
2. Create an **R2 API token** (Manage R2 API Tokens) with Object Read & Write permission.
3. To allow public access so item images load on the site, either:
   - Enable **Public access** for the bucket and copy the public URL (e.g. `https://pub-xxxx.r2.dev`), or  
   - Attach a **custom domain** to the bucket and use that as `R2_PUBLIC_URL`.
4. Set the R2 env vars in `.env.local`. Admin “Add/Edit item” will then show **Upload image**; files are stored in R2 and the returned URL is saved as the item’s image. You can still paste an image URL if you prefer.

### 5. Run the project

**Development:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Production build:**

```bash
npm run build
npm start
```

---

## Project structure (high level)

```
japan-surplus-store/
├── src/
│   ├── app/                    # App Router
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/      # POST admin login
│   │   │   │   └── me/         # GET verify JWT
│   │   │   └── items/
│   │   │       ├── route.ts    # GET all, POST (admin)
│   │   │       └── [id]/      # GET one, PUT, DELETE (admin)
│   │   ├── admin/              # Admin dashboard & login
│   │   ├── checkout/           # Messenger checkout
│   │   ├── items/              # Public items grid
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Home
│   │   └── globals.css
│   ├── components/             # Navbar, CartModal, ItemModal, etc.
│   ├── contexts/               # Auth, Cart
│   ├── lib/                    # db connection, auth (JWT)
│   ├── models/                 # Mongoose Item model
│   └── types/
├── .env.example
├── .env.local                  # Your secrets (not committed)
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## Quick test flow

1. **Home** — Click “View Items”.
2. **Items** — (If empty, log in as admin and add an item with name, price, description, image URL.) Click a card to open modal; use “Add to Cart”.
3. **Cart** — Click cart icon in navbar; change quantity or remove; click “Checkout”.
4. **Checkout** — Review order and click “Continue to Messenger” (requires `NEXT_PUBLIC_FACEBOOK_PAGE_USERNAME`).
5. **Admin** — Go to `/admin`; if not logged in, you’ll be sent to `/admin/login`. After login you can add/edit/delete items; delete uses a confirmation dialog.

---

## Tech stack

- **Next.js 14** (App Router), **TypeScript**, **TailwindCSS**
- **MongoDB** + **Mongoose**
- **JWT** for admin auth (stored in localStorage)
- **react-hot-toast** for notifications
- **next/image** for images (remote URLs allowed in `next.config.js`)

---

## License

MIT.
