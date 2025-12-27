# 🛡️ MaintFlow: The Ultimate Maintenance Tracker

> **Hackathon Submission**: A Next-Gen Industrial Maintenance System (CMMS) built with Next.js 14.



## 🚀 Overview
**MaintFlow** is a "Smart" Maintenance Management System designed to bridge the gap between **Equipment** (Assets), **Teams** (Workforce), and **Requests** (Operations). Unlike basic forms, MaintFlow is "Alive"—it understands your inventory, automates assignments, and updates equipment status based on real-world actions.

---

## 🧠 Core Philosophy
The module is built on three interconnected pillars:
1.  **Equipment First**: Every asset knows its **Department**, **Location**, and default **Maintenance Team**.
2.  **Auto-Routing**: Requests shouldn't be manual. Creating a ticket for a "Drill Press" automatically routes it to the "Mechanics" team.
3.  **Dynamic State**: Moving a ticket to "Scrap" on the Kanban board doesn't just close the ticket—it **decommissions the machine** in the database.

---

## ✨ Key Functional Areas (MVP Features)

### 1. 🏭 Equipment Management (The Central Database)
*   **Smart Tracking**: Track assets by **Department** (Production, Office) or **Employee** (Personal Laptops).
*   **Status Logic**: Real-time status tracking (`Operational` 🟢, `Maintenance` 🟠, `Breakdown` 🔴, `Scrapped` ⚫).
*   **"Maintenance" Smart Button**: One-click access to see every repair history for regular assets.

### 2. 🔧 Intelligent Request Flow
*   **Auto-Fill Intelligence**:
    *   *Select "Industrial Drill Press"* -> System auto-selects **"Alpha Squad"** (Team) and **"Technician Bob"**.
*   **Two Critical Workflows**:
    *   **🚑 Corrective (Breakdown)**: Urgent repairs. Tracks priority (`Low` to `Critical`) and visual "Overdue" alerts.
    *   **📅 Preventive (Routine)**: Scheduled maintenance that appears on a dedicated **Calendar View**.

### 3. 📊 Visual Operations (The Views)
*   **Interactive Kanban Board**: Drag-and-drop workflow.
    *   *New* ➡️ *In Progress* ➡️ *Repaired*
    *   *Side Effect*: Dragging to "In Progress" marks the machine as "Under Maintenance".
*   **Maintenance Calendar**: A clear monthly view of all upcoming preventive checks.
*   **Power Reporting**: Real-time analytics showing:
    *   Requests by Status & Priority.
    *   **Breakdown vs. Preventive** Ratio.
    *   **Team Performance** metrics.

---

## 👨‍⚖️ Judge's Guide: How to Test the MVP

Follow this walkthrough to verify the "Alive" logic of MaintFlow.

### Step 1: Login & Setup
1.  Run the seed script to populate test data:
    ```bash
    npx prisma db push
    npx prisma db seed
    ```
2.  Start the app:
    ```bash
    npm run dev
    ```
3.  Login credentials (Pre-seeded):
    *   **Admin**: `admin@gearguard.com` / `password123`
    *   **Tech**: `bob@gear.com` / `password123`

### Step 2: Test "The Breakdown" (Automation)
1.  Go to **Requests** -> **New Request**.
2.  Select **"CNC Machine X1"** from the Equipment dropdown.
3.  **Observe**: The *Assigned Team* automatically fills with "Alpha Squad".
4.  Set Priority to **Critical** and create the request.
5.  Go to the **Kanban Board**. Find the card and drag it to the **"Scrap"** column.
6.  **Verify**: Go to the **Equipment** page. The "CNC Machine X1" status is now permanently **Scrapped**.

### Step 3: Test "The Preventive Schedule"
1.  Go to the **Calendar** page.
2.  Look for "Office Printer P-500" scheduled for next Friday (Seeded data).
3.  Click the event to see details.

### Step 4: Test "Team Visibility" (RBAC)
1.  Logout and login as **Technician Bob**.
2.  Go to the **Kanban Board**.
3.  **Verify**: You ONLY see tasks assigned to **Alpha Squad**. The "Beta Squad" tasks are hidden.

---

## 🛠️ Technology Stack
*   **Framework**: Next.js 14 (App Router)
*   **Database**: PostgreSQL + Prisma ORM
*   **Styling**: Tailwind CSS + Shadcn UI
*   **Visuals**: Recharts (Analytics), React-Big-Calendar, Lucide Icons
*   **Interactivity**: @dnd-kit (Kanban), React-Hook-Form (Validation)

---

## 📦 Installation
```bash
# 1. Install Dependencies
npm install

# 2. Setup Database (Ensure .env has DATABASE_URL)
npx prisma generate
npx prisma db push

# 3. Seed Data
npx prisma db seed

# 4. Run Development Server
npm run dev
```

Project deployed on Vercel/Netlify (optional links here).
