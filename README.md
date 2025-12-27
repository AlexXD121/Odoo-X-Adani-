# 🏭 MaintFlow
> **The "Alive" CMMS for the Modern Factory.**
> *Submitted for the Next.js Industrial Hackathon.*

![MaintFlow Banner](public/logo.png)

## ⚡ What is MaintFlow?

**MaintFlow** is not just a form-filler—it's an **intelligent ecosystem** that bridges the gap between your machines (Assets), your people (Teams), and your operations (Requests).

Traditional maintenance systems are static "graveyards" of data. MaintFlow is **dynamic**. It understands that when a technician drags a ticket to *"Scrap"* on the Kanban board, the physical machine is decommissioned in the inventory. When a user reports a broken lathe, the system *knows* to alert the **Mechanical Squad** immediately.

---

## 🚀 Key "Alive" Features

### 1. 🧠 Intelligent Routing Engine
Automation is at the core. MaintFlow eliminates manual triage:
*   **Context Awareness**: Select a specific machine (e.g., "CNC X1"), and the system automatically assigns the ticket to the **Default Maintenance Team** (e.g., "Alpha Squad") and notifies the **Primary Technician**.
*   **Priority Logic**: Corrective maintenance is flagged based on asset criticality.

### 2. 🔄 Bi-Directional State Sync
The heart of MaintFlow is the synchronization between **Operations** (Tickets) and **Inventory** (Assets).
*   **Kanban-Driven Asset Management**:
    *   Drag ticket to `In Progress` ➡️ Machine marked `Under Maintenance` 🟠
    *   Drag ticket to `Scrap` ➡️ Machine marked `Decommissioned` ⚫
    *   Drag ticket to `Repaired` ➡️ Machine marked `Operational` 🟢
*   **Zero-Drift**: Your inventory status always reflects reality on the shop floor.

### 3. 🛡️ Role-Based Visibility (RBAC)
Secure by design, tailored for clarity.
*   **Admins**: See the God-View of the entire plant.
*   **Technicians**: See **ONLY** the tickets assigned to their Squad. Beta Squad never sees Alpha Squad's clutter.

### 4. 📅 Preventive vs. Corrective
*   **Corrective**: "It broke now!" -> High priority, Kanban workflow.
*   **Preventive**: "Check oil in 2 weeks" -> Scheduled, Calendar view workflow.

---

## 🛠️ The Tech Stack

Built for performance, scalability, and type-safety.

| Layer | Technology | Why? |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14** (App Router) | Server Actions, React Server Components (RSC) |
| **Database** | **PostgreSQL** | Relational data integrity for Assets <-> Teams |
| **ORM** | **Prisma** | Type-safe database access & migrations |
| **Styling** | **Tailwind CSS** | Design system & responsiveness (Carrot Orange Theme) |
| **UI Library** | **Shadcn/UI** | Accessible, consistent components |
| **Auth** | **Custom JWT + Cookies** | Secure, stateless session management |
| **Deployment** | **Vercel** | Edge-ready deployment |

---

## 🏗️ Installation & Setup

Get MaintFlow running locally in minutes.

### 1. Clone & Install
```bash
git clone https://github.com/your-repo/maintflow.git
cd maintflow
npm install
```

### 2. Configure Environment
Create a `.env` file in the root:
```env
# Your Postgres Connection String
DATABASE_URL="postgres://user:password@host:5432/maintflow"

# Random string for session encryption
SESSION_SECRET="your-super-secret-key"
```

### 3. Setup Database
```bash
# Push schema to DB
npx prisma db push

# Seed test data (Admins, Teams, Machines)
npx prisma db seed
```

### 4. Run It
```bash
npm run dev
```

---

## 🕵️‍♂️ Judge's Walkthrough

Follow this specific path to see the magic happen:

1.  **Login as Admin** (`admin@gearguard.com` / `password123`).
2.  **Create a Request**: Go to **Requests -> New**. Pick a machine. Watch the **Team** field auto-fill.
3.  **The "Alive" Test**:
    *   Go to **Kanban**.
    *   Drag a ticket to the red **Scrap** column.
    *   Navigate to **Equipment**.
    *   **Verify**: That specific machine is now status **Scrapped**.
4.  **The RBAC Test**:
    *   Logout.
    *   Login as **Bob** (`bob@gear.com` / `password123` - Alpha Squad).
    *   Notice you ONLY see Alpha Squad tickets.

---

*Built with ❤️ by Team MaintFlow.*
