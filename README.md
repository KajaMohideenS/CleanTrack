# CleanTrack

**Minimal Digital Garment Tracking & Shop Order Management Prototype**  
*Project Better Tomorrow — Design Thinking Assignment Prototype*

---

## 1. Overview

**CleanTrack** is a clean, focused digital order-management and customer-tracking prototype designed for local dry-cleaning and laundry businesses. It provides an immediate, transparent view of garment status for customers and a lightweight status workflow for local shop operators.

This project was developed as a rapid, high-fidelity prototype to explore digital tracking intervention points prior to undertaking physical field observations and contextual customer interviews.

---

## 2. Problem Context & Working Hypothesis

> ### ⚠️ Academic & Design Thinking Notice: Working Hypothesis
> **This project is based on an unverified working hypothesis, NOT a validated real-world finding.**
> 
> * **Working Hypothesis**: Customers experience uncertainty about garment care progress and return timing after handing clothing to a local dry cleaner, while small shop staff rely on manual paper logbooks and phone calls to handle status inquiries.
> * **Field Visit Status**: Pre-field research. No user interviews, observational surveys, or shop owner statements have yet been collected.
> * **Adaptability Mandate**: Following upcoming field visits, empirical evidence may reveal that the primary friction is completely different (e.g., garment tag identification, scheduling bottlenecks, billing confusion, or lost clothing). CleanTrack’s architecture is deliberately decoupled so it can pivot to match validated user needs.

---

## 3. Proposed Solution

A lightweight, two-sided interface powered by a unified state machine:
1. **Customer Tracking View**: Zero-friction garment status lookup. Customers enter their order receipt code (e.g. `DC1024`) to immediately see garment status, current workshop stage, and completion estimates without creating an account or logging in.
2. **Shop Order Management View**: A clear queue board for shop counters to create orders, record garment instructions, advance processing stages with one click, and trigger real-time updates for customers.

---

## 4. Primary Users

* **Retail Customer**: Seeks quick, trustworthy reassurance on garment location, treatment progress, and exact pickup readiness.
* **Shop Owner / Counter Staff**: Needs an effortless way to track garments through cleaning and inspection stages without administrative overhead or repetitive customer phone calls.

---

## 5. Key Features

* **Real 5-Stage State Machine**: Strictly ordered progression:
  1. `Received` (Checked into counter)
  2. `Cleaning` (Active washing/chemical cleaning)
  3. `Quality Check` (Inspection & finishing press; almost ready)
  4. `Ready for Pickup` (Customer notified; ready at counter)
  5. `Collected` (Handover completed)
* **Single Authoritative State Layer**: Shop updates instantly reflect on customer tracking screens without desynchronization.
* **Intelligent Estimate Logic**:
  * Displays transparent AI-assisted estimates during `Received`, `Cleaning`, and `Quality Check`.
  * **Strict UX Rule**: Once moved to `Ready for Pickup` or `Collected`, estimated times are cleanly removed and replaced with *"Your order is ready for pickup"* and *"Ready since [time]"*.
* **One-Click Quick Advance**: Shop counter staff can step an order through statuses or pick directly from a dropdown.
* **Demo Seeds & Reset Demo**: Pre-loaded with realistic orders (`DC1024`, `DC1025`, `DC1026`) with instant reset controls for rapid live demonstration.

---

## 6. Customer Flow

```text
Enter Order ID (e.g. DC1024)
   │
   ▼
View Garment Details (Blazer, Dry Cleaning)
   │
   ▼
Inspect Visual 5-Stage Progress Timeline
   │
   ▼
Review AI-Assisted Ready-Time Estimate (e.g. Today around 6:30 PM)
   │
   ▼
When Ready: "Your order is ready for pickup" + "Ready since 3:15 PM"
   │
   ▼
Collect Garment: Status marks "Order collected"
```

---

## 7. Shop Flow

```text
Receive Garment at Counter
   │
   ▼
Click "New Order" (Enter customer, garment, service, special notes)
   │
   ▼
AI Estimator calculates target completion based on queue backlog
   │
   ▼
Shop moves order: Received ➔ Cleaning ➔ Quality Check ➔ Ready for Pickup
   │
   ▼
Customer arrives: Shop clicks "Advance to Collected"
```

---

## 8. AI Intervention

### Transparent Prototype Simulation
CleanTrack incorporates **AI-assisted ready-time estimation** as a supporting capability. 

* **Heuristic Engine**: Rather than claiming an unverified deep-learning model, the prototype transparently uses a deterministic heuristic engine (`estimateReadyTime`) that factors in:
  1. Service base cycle duration (Ironing vs. Steam Press vs. Dry Cleaning).
  2. Garment complexity heuristics (delicate silks, tailored suits with linings, standard shirts).
  3. Real-time shop queue workload (number of active incomplete orders ahead in the queue).
* **Clear User Communication**: Copy honestly labels it as *"AI estimated ready time"* and presents a concise reason (e.g., *"Calculated from Dry Cleaning protocol, structured blazer tailoring, and 2 active orders ahead in queue"*).
* **Architectural Seam**: The estimation interface is decoupled inside `src/services/aiEstimator.ts`. It can be swapped for a trained regression model or external API without touching the UI layer.

---

## 9. Technology Stack

* **Frontend Framework**: React 18 with TypeScript
* **Build Tool**: Vite 5
* **Styling**: Tailwind CSS (calm, minimal palette; slate neutrals with subtle sky accents)
* **Icons**: Lucide React
* **Persistence & State**: Centralized React Context (`OrderContext`) + `OrderRepository` with browser `localStorage` and cross-tab storage event synchronization.

---

## 10. Architecture Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                       App Shell & UI                        │
│   ┌───────────────────────────┐ ┌─────────────────────────┐ │
│   │   Customer Tracking View  │ │    Shop Demo View       │ │
│   └─────────────┬─────────────┘ └────────────┬────────────┘ │
└─────────────────┼────────────────────────────┼──────────────┘
                  │                            │
                  ▼                            ▼
┌─────────────────────────────────────────────────────────────┐
│               OrderContext (Authoritative State)             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          OrderRepository (Storage & Broadcast Seam)         │
│          ├── LocalStorage Persistence                       │
│          └── aiEstimator Service (Heuristic Engine)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 11. Project Structure

```text
cleantrack/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   └── order.ts               # Order interfaces, status sequence, labels
│   ├── services/
│   │   ├── aiEstimator.ts          # Transparent heuristic AI estimator
│   │   └── orderRepository.ts      # Storage & seed persistence layer
│   ├── context/
│   │   └── OrderContext.tsx        # Authoritative shared React state
│   └── components/
│       ├── layout/
│       │   ├── Header.tsx          # Brand & Customer/Shop mode switch
│       │   └── HypothesisBanner.tsx# Pre-field research academic notice
│       ├── customer/
│       │   ├── CustomerView.tsx    # Order search & detail layout
│       │   ├── StatusTimeline.tsx  # 5-stage real state machine visualizer
│       │   └── ReadyTimeCard.tsx   # Ready estimate & pickup message
│       └── shop/
│           ├── ShopView.tsx        # Counter management dashboard
│           ├── OrderMetrics.tsx    # Queue counters & status metrics
│           ├── CreateOrderModal.tsx# Practical drop-off order form
│           └── OrderRow.tsx        # Item row with 1-click status stepper
├── README.md
└── .gitignore
```

---

## 12. How to Install and Run Locally

### Prerequisites
* Node.js (v18 or newer recommended)
* npm

### Steps
1. Navigate to the project directory:
   ```bash
   cd cleantrack
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the displayed local URL in your browser (typically `http://localhost:5173`).

### Production Build
To verify production build and type checking:
```bash
npm run build
```

---

## 13. Primary Demonstration Flow (Evaluator Walkthrough)

To demonstrate CleanTrack to an instructor or peer in 2 minutes:

1. **Open Customer View**:
   * Look up order **`DC1024`** (or click the quick demo chip).
   * Notice: Garment is **Blazer**, Service is **Dry Cleaning**, Current status is **Cleaning**.
   * Notice: An AI-assisted estimated ready time is shown (e.g. *Today around 6:30 PM*) with workload explanation.
2. **Switch to Shop Demo View**:
   * Click **Shop Demo** in the top navigation.
   * Locate order **`DC1024`** in the active order list.
   * Click **"Advance to Quality Check"**.
3. **Switch back to Customer View**:
   * Notice: Status immediately reflects **Quality Check**.
   * Notice: A note appears stating the garment is undergoing final inspection and pressing (almost ready).
4. **Advance to Ready for Pickup**:
   * In Shop Demo, advance **`DC1024`** to **Ready for Pickup**.
   * Switch to Customer View:
     * **Estimated Ready Time is completely removed**.
     * Prominent banner displays: *"Your order is ready for pickup."*
     * Displays: *"Ready since Today at [time]"*.
5. **Mark Collected**:
   * In Shop Demo, click **"Advance to Collected"**.
   * Switch to Customer View: Timeline marks complete and displays *"Order collected"*.
6. **Reset State**:
   * Click the **Reset Demo** button in the header or shop view to restore the initial demo state anytime.

---

## 14. Testing & Verification

* **TypeScript Compilation**: Clean build with zero type errors (`tsc && vite build`).
* **State Synchronization**: Tested shared memory context and `localStorage` synchronization across both views.
* **State Machine Rules**: Verified that future steps are never visually completed and that estimated ready time disappears completely at `READY_FOR_PICKUP`.
* **Edge Case Handling**: Verified handling of invalid order IDs (e.g., `DC9999`) showing helpful receipt instruction and quick fallback links.

---

## 15. Working Hypothesis vs. Validated Findings

| Pre-Research Working Hypothesis (Current) | Post-Field Validation (Planned) |
| :--- | :--- |
| Customers experience anxiety due to lack of visibility into dry-cleaning status. | *To be determined after interviewing 5+ customers at local laundry counters.* |
| Shop owners find manual record-keeping inefficient. | *To be determined after observing counter workflows and physical tags.* |
| Estimated ready time is the primary missing information piece. | *Will adjust based on whether customers prioritize timing, garment safety, or cost transparency.* |

---

## 16. Future Scope (Post-Field Adaptation)

Following field research, potential architectural extensions include:
* **Backend & Database**: Migration to Supabase or PostgreSQL + FastAPI.
* **Customer Messaging**: Optional automated WhatsApp/SMS notifications when status reaches `READY_FOR_PICKUP`.
* **Receipt Tag OCR**: Scanning paper counter tickets with mobile camera to automatically import order numbers.
* **Production Workload Analytics**: Identifying bottlenecks at the washing or pressing stations.

---

## 17. Current Limitations

* **Local Prototype**: Uses browser storage and memory state rather than a remote cloud database.
* **Simulated AI**: Ready-time estimates are derived from heuristic queue rules rather than a live machine learning inference API.
* **No Authentication**: Built for rapid prototype evaluation without login friction.


## Phase 2 development update

The current Phase 2 update builds on the original customer-tracking and shop-counter prototype. The following additions are included in this source snapshot:

- **Order search:** find orders by order ID, customer name, contact number, or garment description.
- **Service filtering:** narrow the shop order list by Dry Cleaning, Washing, Ironing, Steam Press, or Other.
- **CSV export:** download the shop's order records for spreadsheet review.
- **Input validation:** require customer name and garment details, trim submitted values, and reject duplicate manually supplied order IDs.
- **Safer persistence:** validate records loaded from LocalStorage, retain valid records if individual entries are malformed, and show a clear save error if browser storage fails.
- **Unique generated IDs:** generated order IDs are checked against existing records before use.

### Current implementation boundaries

CleanTrack remains a frontend prototype. Order data is stored in the browser's LocalStorage and is not shared across different devices or users through a backend service. The ready-time estimator is a transparent heuristic simulation, not a trained machine-learning model or external AI service. These boundaries should be considered during evaluation and demonstration.
