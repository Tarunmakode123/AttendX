# AttendX — Attendance Bunk Detection Tool

![AttendX Theme](https://img.shields.io/badge/Theme-Orange%20%26%20White-f97316)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20TailwindCSS%20%7C%20Supabase-blue)

**AttendX** is a mobile-first web application designed for college faculty and administrators. It captures period-wise lecture attendance and automatically detects cross-period "bunking" patterns (students marked present in one lecture but absent in another on the same day).

---

## ✨ Features

- ⚡ **Sub-60 Second Attendance Marking**: Roster list defaults every student to **Present** (matching register workflow). Tap to toggle **Absent** with live counters (`42 Present / 3 Absent`) and search filter.
- 🚨 **Automated Bunk Flags**: Identifies partial-day bunks using live Postgres queries (`present_periods > 0 AND absent_periods > 0`). Fully absent or fully present students are not flagged.
- 📊 **Daily Attendance Matrix**: Matrix grid view (Students × Periods) with highlighted Yellow/Amber bunk rows.
- 🔒 **Database-Level Lock & Security**: RLS policies enforce period submission locks. Admins can override/edit locked periods with a tamper-proof Postgres `BEFORE UPDATE` audit trigger (`is_edited`, `edited_by`, `edited_at`, `original_status`).
- 📁 **Bulk CSV Roster Import**: Import 50–100 students per section via CSV files using `papaparse`.
- 📈 **Weekly/Monthly Bunk Leaderboard**: Ranked list of students by bunk frequency with period skip pattern insights.

---

## 🛠️ Tech Stack & Branding

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Backend / Database**: Supabase Postgres + Supabase Auth
- **Color Theme**:
  - Primary Background: White / Slate-50
  - Brand Accent: Vivid Orange (`#f97316`)
  - Bunk Alert Color: Visually distinct Amber/Yellow (`#f59e0b` / `bg-amber-100`) and Red (`#ef4444`) for absent marks.

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/Tarunmakode123/AttendX.git
cd AttendX
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Deploy Supabase Schema
Copy the DDL script in `supabase/schema.sql` into your Supabase project's SQL Editor to set up tables, RLS policies, audit triggers, and views.

---

## 📄 License
MIT License
