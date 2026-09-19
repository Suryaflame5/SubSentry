# SubSentry

> **See what repeats. Understand why. Decide for yourself.**

SubSentry is a financial pattern intelligence application built to uncover recurring spending hidden within transaction histories. Rather than relying on black-box claims or generic dashboard decoration, SubSentry provides **transparent, explainable mathematical evidence** and leaves the final decision in the user's hands.

---

## Key Features

- **Explainable Recurrence Engine**: Transparent 4-factor scoring model that evaluates transaction histories based on:
  - **Frequency Consistency** (30% weight)
  - **Interval Consistency** (30% weight)
  - **Amount Stability** (25% weight)
  - **Merchant Normalization** (15% weight)
- **Evidence Drawer**: Interactive recurrence timeline showing consecutive payments, exact transaction dates, interval deltas, and normalized entity mappings.
- **Client-Side Privacy First**: Operates directly on statement CSV data in the browser. Zero financial credentials or server-side data storage required.
- **Intelligent CSV Ingestion**: Automatic delimiter detection (comma, semicolon, tab), flexible header matching (`Date`, `Description`, `Amount`), and real-time validation.
- **Review Candidates Queue**: Identifies potentially forgotten subscriptions or irregular recurring charges with explicit human-in-the-loop decision controls (`Keep` / `Dismiss`).
- **Financial Intelligence Reports**: Browser-printable statement audit reports with executive summaries, merchant manifests, and methodology documentation.

---

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Architecture**: Context API + LocalStorage persistence

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/dekubakuko2007-arch/SubSentry.git
cd SubSentry

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will be available at `http://localhost:3000/`.

### Production Build

```bash
npm run build
npm run preview
```

---

## License

MIT
