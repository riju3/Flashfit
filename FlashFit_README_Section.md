# FlashFit — 15-Min Fashion Delivery App

FlashFit is a fast fashion delivery platform inspired by Blinkit, built with the MERN stack. Users can browse clothing, add items to cart, and get them delivered in 15 minutes. It also features an AI-powered Virtual Try-On so users can see how a dress looks on them before ordering.

---

## Tech Stack

- **Frontend:** React.js, Tailwind CSS, Redux Toolkit
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas / Local)
- **Image Storage:** Cloudinary
- **Authentication:** JWT (Access + Refresh Token)

---

## Getting Started

### Prerequisites
- Node.js (v18 or above)
- MongoDB (local) or MongoDB Atlas account
- Cloudinary account

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/FlashFit.git
cd FlashFit
```

**2. Setup Server**
```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:
```env
MONGODB_URI=mongodb://localhost:27017/flashfit
PORT=8080
FRONTEND_URL=http://localhost:5173

SECRET_KEY_ACCESS_TOKEN=your_access_token_secret
SECRET_KEY_REFRESH_TOKEN=your_refresh_token_secret

RESEND_API=your_resend_api_key

CLODINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLODINARY_API_KEY=your_cloudinary_api_key
CLODINARY_API_SECRET_KEY=your_cloudinary_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_ENPOINT_WEBHOOK_SECRET_KEY=your_stripe_webhook_secret
```

Then start the server:
```bash
npm start
```

**3. Setup Client**
```bash
cd ../client
npm install
```

Create a `.env` file inside the `client/` folder:
```env
VITE_API_URL=http://localhost:8080
```

Then start the client:
```bash
npm run dev
```

**4. Open in browser**
```
http://localhost:5173
```

---

## Setting Up Admin Access

After running the app for the first time, follow these steps to get admin access:

1. Go to `http://localhost:5173/register` and create an account
2. Open **MongoDB Compass** and connect to your local database
3. Go to `Flashfit` database → `users` collection
4. Find your user and click **Edit**
5. Change the `role` field from `"USER"` to `"ADMIN"`
6. Save and log in again

You will now see the **Dashboard** option in the Account menu.

---

## Admin Panel Features

| URL | Feature |
|-----|---------|
| `/dashboard/profile` | Edit your profile |
| `/dashboard/category` | Add / manage categories |
| `/dashboard/subcategory` | Add / manage subcategories |
| `/dashboard/upload-product` | Upload new products |
| `/dashboard/product` | View and edit all products |

---

## Environment Notes

- For **local development**, use `mongodb://localhost:27017/flashfit`
- For **production (Render)**, use your MongoDB Atlas connection string
- Cloudinary is used for all image uploads (products, banners, avatars)
- Stripe keys are required only for payment functionality

---

## Branding

FlashFit uses a custom orange/red color theme:

| Color | Hex |
|-------|-----|
| Primary | `#ff4d00` |
| Primary Light | `#ff6a2f` |
| Dark | `#1a1a2e` |
| Accent | `#e94560` |

