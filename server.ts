import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// Custom in-memory database matching BACKEND_API.md contracts
interface User {
  id: number;
  telegram_id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  wallet_address: string | null;
  created_at: string;
  updated_at: string;
}

interface Event {
  id: number;
  organizer_id: number;
  title: string;
  description: string | null;
  status: "DRAFT" | "PENDING_PAYMENT" | "ACTIVE" | "FINISHED";
  top_n_winners: number;
  total_prize_pool: string;
  start_date: string;
  end_date: string;
  tx_hash: string | null;
  created_at: string;
  updated_at: string;
}

interface Task {
  id: number;
  event_id: number;
  title: string;
  description: string | null;
  xp_reward: number;
  verification_type: "manual" | "channel_subscription";
  required_channel: string | null;
  created_at: string;
}

interface Participant {
  id: number;
  user_id: number;
  event_id: number;
  total_xp: number;
  joined_at: string;
}

interface LeaderboardEntry {
  rank: number;
  user_id: number;
  username: string | null;
  total_xp: number;
  wallet_address: string | null;
}

// Global In-Memory Store
let users: User[] = [
  {
    id: 82910,
    telegram_id: "82910",
    username: "alex_thompson",
    first_name: "Alex",
    last_name: "Thompson",
    wallet_address: "EQAb7382_xxxx_F93",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

let events: Event[] = [
  {
    id: 1,
    organizer_id: 999, // other user
    title: "Summer TON Sprint",
    description: "Complete simple social tasks to share the pool!",
    status: "ACTIVE",
    top_n_winners: 10,
    total_prize_pool: "250.0",
    start_date: "2026-06-15T00:00:00.000Z",
    end_date: "2426-06-25T00:00:00.000Z", // safe far-future
    tx_hash: "0x391e92d9f...",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    organizer_id: 111,
    title: "Mega Airdrop Quest",
    description: "Invite & Stake reward pools",
    status: "ACTIVE",
    top_n_winners: 10,
    total_prize_pool: "150.0",
    start_date: "2026-06-15T00:00:00.000Z",
    end_date: "2426-07-15T00:00:00.000Z",
    tx_hash: "0x82db2...",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    organizer_id: 82910, // You are the organiser
    title: "Web3 Masters",
    description: "Developer exclusive premium race",
    status: "ACTIVE",
    top_n_winners: 50,
    total_prize_pool: "500.0",
    start_date: "2026-06-15T00:00:00.000Z",
    end_date: "2426-08-01T00:00:00.000Z",
    tx_hash: "0x12a939f...",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    organizer_id: 444,
    title: "May Rewards",
    description: "Legacy spring concluded",
    status: "FINISHED",
    top_n_winners: 10,
    total_prize_pool: "100.0",
    start_date: "2026-05-01T00:00:00.000Z",
    end_date: "2026-05-30T23:59:59.000Z",
    tx_hash: "0x9d90...",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

let tasks: Task[] = [
  {
    id: 1,
    event_id: 1,
    title: "Join @prizerace channel",
    description: "Official real-time contest updates and payouts announcements",
    xp_reward: 50,
    verification_type: "channel_subscription",
    required_channel: "@prizerace",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    event_id: 1,
    title: "Post on X",
    description: "Share your referral link on custom social networks",
    xp_reward: 100,
    verification_type: "manual",
    required_channel: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    event_id: 1,
    title: "Follow CEO",
    description: "Stay connected with PrizeRace executive builders",
    xp_reward: 80,
    verification_type: "manual",
    required_channel: null,
    created_at: new Date().toISOString(),
  }
];

let participants: Participant[] = [
  { id: 1, user_id: 82910, event_id: 1, total_xp: 320, joined_at: new Date().toISOString() }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API router v1 endpoints
  // MIDDLEWARE to mock-authenticate user
  app.use((req, res, next) => {
    // BACKEND_API.md: resolve User from telegram header State
    // Dev fallback registers first mock user (Alex)
    const initDataHeader = req.header("X-Telegram-Init-Data");
    next();
  });

  // Auth: Register/Upsert
  app.post("/api/v1/auth/register", (req, res) => {
    const { telegram_id, username, first_name, last_name } = req.body;
    let user = users.find((u) => u.telegram_id === telegram_id);
    if (!user) {
      user = {
        id: Math.floor(Math.random() * 90000) + 10000,
        telegram_id,
        username: username || `user_${telegram_id}`,
        first_name: first_name || "Alex",
        last_name: last_name || "Thompson",
        wallet_address: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      users.push(user);
    }
    res.json(user);
  });

  // Auth: Me
  app.get("/api/v1/auth/me", (req, res) => {
    const defaultUser = users[0] || {
      id: 82910,
      telegram_id: "82910",
      username: "alex_thompson",
      first_name: "Alex",
      last_name: "Thompson",
      wallet_address: null,
    };
    res.json(defaultUser);
  });

  // Auth: PUT Me
  app.put("/api/v1/auth/me", (req, res) => {
    const defaultUser = users[0];
    if (defaultUser) {
      if (req.body.username) defaultUser.username = req.body.username;
      defaultUser.updated_at = new Date().toISOString();
    }
    res.json(defaultUser);
  });

  // Events: list
  app.get("/api/v1/events/", (req, res) => {
    const { status } = req.query;
    if (status) {
      return res.json(events.filter((e) => e.status === status));
    }
    res.json(events);
  });

  // Events: get by id
  app.get("/api/v1/events/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const event = events.find((e) => e.id === id);
    if (!event) return res.status(404).json({ detail: "Sprint not found" });
    res.json(event);
  });

  // Events: create
  app.post("/api/v1/events/", (req, res) => {
    const { title, description, top_n_winners, total_prize_pool, start_date, end_date } = req.body;
    
    // Default organizer context -> 82910 (Alex)
    const newEvent: Event = {
      id: events.length + 1,
      organizer_id: 82910,
      title,
      description,
      status: "DRAFT",
      top_n_winners: parseInt(top_n_winners) || 10,
      total_prize_pool: total_prize_pool || "250.0",
      start_date: start_date || new Date().toISOString(),
      end_date: end_date || new Date().toISOString(),
      tx_hash: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    events.push(newEvent);
    res.status(201).json(newEvent);
  });

  // Events: Update
  app.put("/api/v1/events/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const event = events.find((e) => e.id === id);
    if (!event) return res.status(404).json({ detail: "Sprint not found" });
    if (event.status !== "DRAFT") return res.status(400).json({ detail: "Can only update in DRAFT stage" });

    Object.assign(event, req.body);
    event.updated_at = new Date().toISOString();
    res.json(event);
  });

  // Events: Lock draft to pending payment
  app.post("/api/v1/events/:id/lock", (req, res) => {
    const id = parseInt(req.params.id);
    const event = events.find((e) => e.id === id);
    if (!event) return res.status(404).json({ detail: "Sprint not found" });
    if (event.status !== "DRAFT") return res.status(400).json({ detail: "Sprint is already locked" });

    event.status = "PENDING_PAYMENT";
    event.updated_at = new Date().toISOString();
    res.json(event);
  });

  // Events: Join active sprint
  app.post("/api/v1/events/:id/join", (req, res) => {
    const id = parseInt(req.params.id);
    const event = events.find((e) => e.id === id);
    if (!event) return res.status(404).json({ detail: "Sprint not found" });
    if (event.status !== "ACTIVE") return res.status(400).json({ detail: "Event is not active" });
    if (event.organizer_id === 82910) return res.status(403).json({ detail: "Organiser cannot participate in their own event" });

    const exists = participants.find((p) => p.user_id === 82910 && p.event_id === id);
    if (exists) return res.status(409).json({ detail: "Already joined this event" });

    const newPart: Participant = {
      id: participants.length + 1,
      user_id: 82910,
      event_id: id,
      total_xp: 0,
      joined_at: new Date().toISOString(),
    };
    participants.push(newPart);
    res.status(201).json(newPart);
  });

  // Events: Real-time leaderboard
  app.get("/api/v1/events/:id/leaderboard", (req, res) => {
    const board: LeaderboardEntry[] = [
      { rank: 1, user_id: 111, username: "ton_whale", total_xp: 5420, wallet_address: "EQAb...x9F2" },
      { rank: 2, user_id: 222, username: "crypto_king", total_xp: 4800, wallet_address: "EQZl...m0P4" },
      { rank: 3, user_id: 333, username: "degen_1", total_xp: 4200, wallet_address: "UQDx...k1L8" },
      { rank: 4, user_id: 82910, username: "Alex", total_xp: 320, wallet_address: "EQAb...F93" }
    ];
    res.json(board);
  });

  // Events: Finish
  app.post("/api/v1/events/:id/finish", (req, res) => {
    const id = parseInt(req.params.id);
    const event = events.find((e) => e.id === id);
    if (!event) return res.status(404).json({ detail: "Sprint not found" });

    event.status = "FINISHED";
    event.updated_at = new Date().toISOString();
    res.json(event);
  });

  // Events: Winners list
  app.get("/api/v1/events/:id/winners", (req, res) => {
    const winners = [
      { rank: 1, user_id: 111, username: "ton_whale", total_xp: 5420, wallet_address: "EQAb...x9F2" },
      { rank: 2, user_id: 222, username: "crypto_king", total_xp: 4800, wallet_address: "EQZl...m0P4" },
      { rank: 3, user_id: 333, username: "degen_1", total_xp: 4200, wallet_address: "UQDx...k1L8" }
    ];
    res.json(winners);
  });

  // Tasks: Create
  app.post("/api/v1/tasks/event/:event_id", (req, res) => {
    const eventId = parseInt(req.params.event_id);
    const { title, description, xp_reward, verification_type, required_channel } = req.body;
    
    const newTask: Task = {
      id: tasks.length + 1,
      event_id: eventId,
      title,
      description,
      xp_reward: parseInt(xp_reward) || 50,
      verification_type,
      required_channel: required_channel || null,
      created_at: new Date().toISOString(),
    };
    
    tasks.push(newTask);
    res.status(201).json(newTask);
  });

  // Tasks: get all tasks for event
  app.get("/api/v1/tasks/event/:event_id", (req, res) => {
    const eventId = parseInt(req.params.event_id);
    res.json(tasks.filter((t) => t.event_id === eventId));
  });

  // Tasks: Verify task execution and reward XP
  app.post("/api/v1/tasks/:id/verify", (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return res.status(404).json({ detail: "Task not found" });

    // Simulate verified completion check
    res.status(201).json({
      id: Math.floor(Math.random() * 900) + 100,
      user_id: 82910,
      task_id: taskId,
      completed_at: new Date().toISOString(),
      verified: true,
    });
  });

  // Wallet: Connect & sign
  app.post("/api/v1/wallet/connect", (req, res) => {
    const { wallet_address } = req.body;
    const defaultUser = users[0];
    if (defaultUser) {
      defaultUser.wallet_address = wallet_address || null;
      defaultUser.updated_at = new Date().toISOString();
    }
    res.json(defaultUser);
  });

  // Wallet: Deposit pool to trigger PENDING_PAYMENT -> ACTIVE
  app.post("/api/v1/wallet/deposit", (req, res) => {
    const { event_id, tx_hash } = req.body;
    const event = events.find((e) => e.id === event_id);
    if (!event) return res.status(404).json({ detail: "Event not found" });

    event.status = "ACTIVE";
    event.tx_hash = tx_hash;
    event.updated_at = new Date().toISOString();

    res.json({
      status: "verified",
      event_id: event.id,
      event_status: event.status,
      tx_hash,
    });
  });

  // Wallet: Balance inquiry
  app.get("/api/v1/wallet/balance", (req, res) => {
    const defaultUser = users[0];
    if (!defaultUser?.wallet_address) {
      return res.status(400).json({ detail: "Wallet not connected" });
    }
    res.json({
      wallet_address: defaultUser.wallet_address,
      balance_ton: "42.50",
      currency: "TON",
    });
  });

  // Vite middleware setups based on the specification instructions
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[PrizeRace Core] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
