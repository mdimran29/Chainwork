# ChainWork — Project Architecture

> **ChainWork** is a decentralized freelance marketplace where clients post jobs and freelancers bid on them. Payment is handled through blockchain-based smart contract escrow, ensuring trustless, instant, and transparent settlements.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, TailwindCSS v4 |
| Wallet / Web3 | Reown AppKit (formerly WalletConnect), @reown/appkit-adapter-solana |
| Blockchain (current) | **Solana** (Devnet) |
| Backend API | Node.js, Express.js |
| API Documentation | Swagger / OpenAPI (auto-generated via `swagger.js`) |
| Database | MongoDB Atlas (via Mongoose ODM) |
| Auth | JWT + Wallet Signature Challenge (sign-to-login pattern) |
| Dev Tooling | Nodemon, dotenv, Prettier |

---

## Project Structure

```
chainwork/
├── app/                        # Frontend (React + Vite)
│   ├── public/                 # Static assets (logo, sol.png)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── WalletButton.tsx
│   │   │   ├── ContractFunding.tsx
│   │   │   ├── PrivateRoute.tsx
│   │   │   └── ProfileModal.tsx
│   │   ├── contexts/           # React contexts
│   │   │   ├── AuthProvider.tsx
│   │   │   └── AppKitProvider.tsx
│   │   ├── hooks/              # Custom hooks
│   │   │   └── useWalletAuth.ts
│   │   ├── layout/             # App layout
│   │   │   └── Navbar.tsx
│   │   ├── pages/              # Route-level pages
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── JobList.tsx
│   │   │   ├── JobDetail.tsx
│   │   │   ├── CreateJob.tsx
│   │   │   └── Profile.tsx
│   │   └── utils/
│   │       └── api.ts          # Axios instance with base URL + auth headers
│
└── server/                     # Backend (Node.js + Express)
    ├── controllers/            # Business logic
    │   ├── authController.js
    │   ├── jobController.js
    │   ├── contractController.js
    │   ├── userController.js
    │   └── verifyTxController.js
    ├── models/                 # Mongoose schemas
    │   ├── User.js
    │   ├── Job.js
    │   ├── Contract.js
    │   └── Challenge.js
    ├── routes/                 # Express routers
    │   ├── auth.js
    │   ├── jobs.js
    │   ├── contracts.js
    │   ├── users.js
    │   └── verifyTx.js
    ├── middleware/             # Auth middleware
    ├── utils/                  # Helpers (auth.js JWT verify)
    └── server.js               # App entry point
```

---

## Authentication Flow

```
User → Connect Wallet → Server issues challenge nonce
     → User signs nonce with wallet (no private key shared)
     → Server verifies signature → Issues JWT token
     → JWT stored in localStorage → Used on all protected API calls
```

---

## Completed Features ✅

### Backend
- [x] User registration & login with wallet signature challenge
- [x] JWT-based authentication with protected routes
- [x] Role system: `client` vs `freelancer`
- [x] Job CRUD (create, read, update, delete)
- [x] Proposal system (submit, accept, reject)
- [x] Job status lifecycle: `open → in_progress → completed`
- [x] Contract address linking per job
- [x] On-chain transaction verification endpoint (`/api/verify-tx`)
- [x] Swagger / OpenAPI documentation (27 routes documented)
- [x] MongoDB Atlas connection with Mongoose

### Frontend
- [x] Wallet connection via Reown AppKit (Phantom, Solflare, etc.)
- [x] Auth context + PrivateRoute protection
- [x] Home page with features & how-it-works sections
- [x] Job listing with search + filters
- [x] Job detail with proposal submission
- [x] Job creation form (client only)
- [x] Dashboard (client & freelancer views)
- [x] User profile page
- [x] Contract funding UI component
- [x] Responsive Navbar (desktop + mobile)
- [x] Premium UI redesign (glassmorphism, gradient text, card animations)

---

## Pending / In Progress 🔄

### High Priority
- [ ] **Smart contract escrow** on Solana — fund, release, refund logic on-chain (Anchor program)
- [ ] **Dispute resolution** — client/freelancer can raise a dispute; arbitration mechanism
- [ ] **Transaction verification** — improve `/api/verify-tx` to validate on-chain escrow state
- [ ] **Notifications** — in-app + email alerts for proposal updates, job status changes
- [ ] **File/attachment support** — freelancers attach deliverables, clients review uploads

### Medium Priority
- [ ] **Ratings & reviews** — post-completion rating system (1–5 stars, written review)
- [ ] **Freelancer portfolio** — showcase past work, links, certifications
- [ ] **Job categories & tags** — structured taxonomy for discovery
- [ ] **Saved jobs** — bookmark jobs to apply later
- [ ] **Real-time chat** — in-job messaging between client & freelancer (Socket.io)
- [ ] **Admin dashboard** — moderation, analytics, platform health

### Nice to Have
- [ ] **Search & discovery improvements** — full-text search, skill-based matching
- [ ] **Email verification** — confirm email on registration
- [ ] **Dark mode** — user-selectable theme
- [ ] **Mobile app** — React Native wrapper

---

## Multi-Blockchain Expansion Roadmap 🌐

This is the **highest-impact future feature** — allowing clients and freelancers to transact in the cryptocurrency of their choice across multiple chains.

### Strategy

Each blockchain will have:
1. Its own **escrow smart contract** (logic is the same — deposit, release, refund)
2. A **frontend wallet adapter** (already supported by Reown AppKit for most chains)
3. A **backend verifier** — each chain has its own RPC endpoint to verify TX

### Supported Chains — Planned

| Chain | Type | Token | Priority | Notes |
|---|---|---|---|---|
| **Solana** | L1 | SOL | ✅ Done | Current implementation |
| **Ethereum** | L1 | ETH | 🔜 Next | Widest adoption, highest value |
| **Polygon** | L2 (EVM) | MATIC/POL | 🔜 Next | Low fees, EVM compatible |
| **Arbitrum One** | L2 (EVM) | ETH (bridged) | 📌 Planned | Optimistic rollup, cheap ETH txs |
| **Base** | L2 (EVM) | ETH (bridged) | 📌 Planned | Coinbase's L2, growing fast |
| **Optimism** | L2 (EVM) | ETH (bridged) | 📌 Planned | OP Stack, large ecosystem |
| **Avalanche** | L1 | AVAX | 📌 Planned | Fast finality |
| **BNB Chain** | L1 (EVM) | BNB | 📌 Planned | Large user base |

### Implementation Plan for EVM Chains (Ethereum / Polygon / Arbitrum / Base)

Since Ethereum, Polygon, Arbitrum, Base, and Optimism are all **EVM-compatible**, a single Solidity escrow contract can be deployed on all of them with minimal changes.

#### 1. Solidity Escrow Contract (`ChainWorkEscrow.sol`)

```solidity
// Pseudocode
contract ChainWorkEscrow {
  mapping(bytes32 => Job) public jobs;

  function fundJob(bytes32 jobId) external payable;
  function releasePayment(bytes32 jobId) external; // client only
  function refundClient(bytes32 jobId) external;   // dispute / timeout
  function raiseDispute(bytes32 jobId) external;
}
```

#### 2. Frontend Changes

- Add `EVMAdapter` from Reown AppKit alongside `SolanaAdapter`
- Job creation form: let user pick their preferred chain + token
- Store `chain` and `token` fields on the `Job` model in MongoDB
- Show appropriate wallet connection for the selected chain

#### 3. Backend Changes

- Add `chain` field to `Job` schema (`solana`, `ethereum`, `polygon`, etc.)
- Update `/api/verify-tx` to route to the correct RPC endpoint per chain:
  - Solana: `@solana/web3.js`
  - EVM: `ethers.js` or `viem`
- Add ABIs for ChainWorkEscrow contract (per chain)

#### 4. Database Schema Update

```js
// Job.js — add fields
chain: {
  type: String,
  enum: ['solana', 'ethereum', 'polygon', 'arbitrum', 'base', 'optimism', 'bsc', 'avalanche'],
  default: 'solana',
},
token: {
  type: String,
  default: 'native', // SOL, ETH, MATIC etc
},
contractAddress: String,  // already exists
txHash: String,           // escrow funding tx
```

---

## API Endpoints Summary

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login + JWT |
| GET | `/api/auth/challenge` | Public | Get sign challenge |
| GET | `/api/jobs` | Public | List all jobs |
| GET | `/api/jobs/:id` | Public | Get job details |
| POST | `/api/jobs` | Client | Create job |
| PUT | `/api/jobs/:id` | Client | Update job |
| DELETE | `/api/jobs/:id` | Client | Delete job |
| POST | `/api/jobs/:id/proposals` | Freelancer | Submit proposal |
| PUT | `/api/jobs/:id/proposals/:pid/accept` | Client | Accept proposal |
| PUT | `/api/jobs/:id/proposals/:pid/reject` | Client | Reject proposal |
| PUT | `/api/jobs/:id/complete` | Client | Mark completed |
| GET | `/api/users/:id` | Private | Get user profile |
| PUT | `/api/users/:id` | Private | Update profile |
| POST | `/api/verify-tx` | Private | Verify blockchain tx |

Full Swagger docs available at `http://localhost:5000/api/docs` (development only).

---

## Environment Variables

```env
# server/.env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/<db>
JWT_SECRET=<your_secret>
SOLANA_NETWORK=devnet

# app/.env
VITE_PROJECT_ID=<reown_appkit_project_id>
VITE_API_URL=http://localhost:5000
```

---

*Last updated: March 2026*
