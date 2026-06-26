# VIGOR Client

VIGOR is a modern full-stack Fitness & Gym Management Platform that helps users discover fitness classes, book sessions, interact with trainers, and engage in a community-driven fitness ecosystem.

This repository contains the **frontend (client-side)** application built with Next.js.

---

## Live Demo: https://vigor-client.vercel.app/


---

## Features
<img width="1860" height="904" alt="image" src="https://github.com/user-attachments/assets/777c375b-4d0d-4ea4-bb2d-25330847a1e9" />
<img width="1870" height="905" alt="image" src="https://github.com/user-attachments/assets/6cd88dfb-6a86-475d-9b1a-3e3cd4002da3" />
<img width="1909" height="895" alt="image" src="https://github.com/user-attachments/assets/69b9b2cf-1f8f-4dae-8d29-14fd8f2886ee" />
<img width="1895" height="909" alt="image" src="https://github.com/user-attachments/assets/2a6eab27-c5b4-4c6e-8d28-9911c0f6dfc4" />




### Public Features

* Modern responsive landing page
* Browse all approved fitness classes
* Search classes by name
* Filter classes by category
* View class details
* Community forum
* Login / Register authentication

### User Features

* Book fitness classes
* Stripe payment integration
* Save favorite classes
* Apply as trainer
* Manage booked classes
* Dashboard overview

### Trainer Features

* Add fitness classes
* Manage own classes
* View enrolled students
* Create forum posts
* Manage forum posts

### Admin Features

* Manage users
* Block / Unblock users
* Promote users to admin
* Approve / Reject trainer applications
* Approve / Reject classes
* Manage trainers
* Moderate forum posts
* View transactions

---

## Tech Stack

### Frontend

* Next.js
* JavaScript
* Tailwind CSS
* HeroUI
* Framer Motion
* Gravity UI Icons

### Authentication

* Better Auth
* JWT

### Payment

* Stripe

### Database

* MongoDB (via backend API)

---

## Project Structure

```bash
vigor-client/
│
├── app/
├── components/
├── hooks/
├── services/
├── utils/
├── public/
├── styles/
└── package.json
```

---

## Installation

Clone repository:

```bash
git clone YOUR_CLIENT_REPO_URL
```

Go to project folder:

```bash
cd vigor-client
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

---

## Environment Variables

Create `.env.local`

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_IMGBB_KEY=
NEXT_PUBLIC_STRIPE_PK=
NEXT_PUBLIC_APP_URL=
```

---

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

---

## Key Functionalities

### Search Functionality

Uses MongoDB `$regex` for searching classes by class name.

### Filter Functionality

Uses MongoDB `$in` to filter by category.

### Role-Based Dashboard

* User Dashboard
* Trainer Dashboard
* Admin Dashboard

### Soft Block System

Blocked users can:

* Login
* Browse classes
* Read forum posts

Blocked users cannot:

* Book classes
* Apply as trainer
* Comment
* Like/dislike posts

---

## UI Highlights

* Premium SaaS UI
* Responsive design
* Modern dashboard
* Smooth animations
* Glassmorphism cards
* Loading skeletons

---

## Future Improvements

* Notifications
* Email verification
* Analytics dashboard improvements
* Real-time chat
* Mobile app

---

## Author

**Rafiul Bari Turjo**

