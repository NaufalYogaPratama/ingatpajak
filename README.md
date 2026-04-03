# IngatPajak

<p align="center">
  <strong>Vehicle Tax Management & Reminder System</strong><br>
  <em>Never miss your vehicle tax deadline again</em>
</p>

<p align="center">
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-features">Features</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-database-schema">Database</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

## Overview

**IngatPajak** is a modern web application designed to help Indonesian vehicle owners manage their **Motor Vehicle Tax (PKB - Pajak Kendaraan Bermotor)** obligations. The platform provides:

- 📅 Interactive tax calendar with due date tracking
- 🔔 Automated notifications (Email & WhatsApp)
- 📊 Complete tax payment history
- 📁 Digital document archive (STNK/BPKB)

Built with a **zero-cost infrastructure** philosophy using Vercel's ecosystem.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) |
| **ORM** | [Prisma](https://prisma.io/) |
| **Notifications** | [Resend](https://resend.com/) (Email) |
| **Deployment** | [Vercel](https://vercel.com/) |
| **Cron Jobs** | Vercel Cron |

---

## Features

### Authentication
- Login with NIK (16 digits) or NPWP (15 digits)
- OTP-based verification
- Phone and email registration

### Dashboard
- Dynamic greeting based on time of day
- Alert banner for upcoming tax deadlines
- Mini tax calendar widget
- News & updates card

### Interactive Tax Calendar
- Monthly grid view with color-coded indicators
- Click date to see vehicle details
- Toggle notifications (WhatsApp/Email) per vehicle
- Direct link to e-Samsat for payment

### Vehicle History & Documents
- Annual PKB status cards (Active/Expired)
- Tax payment history table
- Digital document archive (PDF downloads)

### Automated Notifications
Cron jobs send reminders at:
- **H-30**: First reminder
- **H-7**: Week before deadline
- **H-1**: Final reminder

---

## Database Schema

```prisma
model User {
  id           String    @id @default(uuid())
  nik_npwp     String    @unique
  name         String?
  phone        String?
  email        String?
  otp          String?
  otpExpiresAt DateTime?
  createdAt    DateTime  @default(now())
  vehicles     Vehicle[]
}

model Vehicle {
  id              String       @id @default(uuid())
  userId          String
  plateNumber     String       @unique
  type            String       // "Mobil", "Motor"
  brandModel      String
  manufactureYear Int
  taxDueDate      DateTime
  estimatedCost   Float
  isWaActive      Boolean      @default(true)
  isEmailActive   Boolean      @default(true)
  createdAt       DateTime     @default(now())
  user            User         @relation(fields: [userId], references: [id])
  taxHistories    TaxHistory[]
}

model TaxHistory {
  id        String   @id @default(uuid())
  vehicleId String
  taxYear   Int
  amount    Float
  status    String   // "LUNAS", "BELUM_BAYAR"
  proofUrl  String?
  createdAt DateTime @default(now())
  vehicle   Vehicle  @relation(fields: [vehicleId], references: [id])
}
```

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Resend API key (for email notifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ingatpajak
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   # Database
   DATABASE_URL="postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"
   DIRECT_URL="postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="https://[ref].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="[anon-key]"
   
   # Resend (Email)
   RESEND_API_KEY="re_[key]"
   
   # NextAuth (if using)
   NEXTAUTH_SECRET="[random-secret]"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed mock data** (for development)
   ```bash
   npx prisma db seed
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com/dashboard)
3. Add environment variables in Project Settings
4. Deploy!

### Cron Jobs Setup

Configure in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/check-tax-deadlines",
      "schedule": "0 9 * * *"
    }
  ]
}
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma db push` | Push schema to database |
| `npx prisma db seed` | Seed database with mock data |
| `npx prisma studio` | Open Prisma Studio |

---

## Project Structure

```
.
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed script
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (auth)/        # Auth routes
│   │   ├── (dashboard)/   # Dashboard routes
│   │   └── api/           # API routes & Server Actions
│   ├── components/
│   │   ├── ui/            # shadcn/ui components
│   │   └── ...            # Custom components
│   ├── lib/
│   │   ├── db.ts          # Database utilities
│   │   └── utils.ts       # Helper functions
│   ├── data/
│   │   └── mock.ts        # Mock data (MVP phase)
│   └── types/             # TypeScript types
├── .env                   # Environment variables
├── next.config.ts         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vercel.json            # Vercel configuration
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

<p align="center">
  Made with for Indonesian vehicle owners
</p>

