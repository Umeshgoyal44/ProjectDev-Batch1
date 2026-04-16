import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import initSqlJs from "sql.js";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const app = express();
const API_PORT = Number(process.env.API_PORT ?? 3001);
const dbDir = path.resolve(import.meta.dirname, "data");
const dbPath = path.resolve(dbDir, "carpool.sqlite");

fs.mkdirSync(dbDir, { recursive: true });

app.use(cors());
app.use(express.json());

let db;

function saveDb() {
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

function run(sql, params = []) {
  db.run(sql, params);
}

function all(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function get(sql, params = []) {
  return all(sql, params)[0] ?? null;
}

function initSchema() {
  run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL CHECK (role IN ('driver', 'rider', 'both', 'admin')),
      avatar_url TEXT,
      bio TEXT,
      vehicle_info TEXT,
      is_verified INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  run(`
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  run(`
    CREATE TABLE IF NOT EXISTS rides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      driver_id INTEGER NOT NULL,
      departure_time TEXT NOT NULL,
      total_seats INTEGER NOT NULL,
      available_seats INTEGER NOT NULL,
      price_per_seat REAL NOT NULL,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      preferences TEXT,
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  run(`
    CREATE TABLE IF NOT EXISTS ride_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ride_id INTEGER NOT NULL,
      rider_id INTEGER NOT NULL,
      seats INTEGER NOT NULL,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
      fare_share REAL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
      FOREIGN KEY (rider_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ride_id INTEGER NOT NULL,
      sender_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  run(`
    CREATE TABLE IF NOT EXISTS ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ride_id INTEGER,
      rater_id INTEGER NOT NULL,
      rated_user_id INTEGER NOT NULL,
      score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
      comment TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE SET NULL,
      FOREIGN KEY (rater_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (rated_user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      ride_id INTEGER,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE SET NULL
    )
  `);

  saveDb();
}

function seedData() {
  const usersCount = get("SELECT COUNT(*) AS count FROM users")?.count ?? 0;
  if (usersCount > 0) {
    return;
  }

  const seedUsers = [
    {
      name: "Avery Stone",
      email: "avery@example.com",
      password_hash: bcrypt.hashSync("password123", 10),
      phone: "+1 555 111 0101",
      role: "driver",
      avatar_url: "",
      bio: "Consistent weekday commuter and weekend road tripper.",
      vehicle_info: "2023 Tesla Model 3",
      is_verified: 1,
    },
    {
      name: "Jordan Lee",
      email: "jordan@example.com",
      password_hash: bcrypt.hashSync("password123", 10),
      phone: "+1 555 111 0102",
      role: "both",
      avatar_url: "",
      bio: "Flexible rider who also offers rides downtown.",
      vehicle_info: "2022 Honda Civic",
      is_verified: 1,
    },
    {
      name: "Maya Patel",
      email: "maya@example.com",
      password_hash: bcrypt.hashSync("password123", 10),
      phone: "+1 555 111 0103",
      role: "rider",
      avatar_url: "",
      bio: "Prefers quiet rides and early departures.",
      vehicle_info: null,
      is_verified: 1,
    },
    {
      name: "Platform Admin",
      email: "admin@example.com",
      password_hash: bcrypt.hashSync("admin123", 10),
      phone: "+1 555 111 0199",
      role: "admin",
      avatar_url: "",
      bio: "System administrator.",
      vehicle_info: null,
      is_verified: 1,
    },
  ];

  seedUsers.forEach((u) => {
    run(
      `
        INSERT INTO users (name, email, password_hash, phone, role, avatar_url, bio, vehicle_info, is_verified)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [u.name, u.email, u.password_hash, u.phone, u.role, u.avatar_url, u.bio, u.vehicle_info, u.is_verified],
    );
  });

  const now = Date.now();
  const h = 60 * 60 * 1000;

  run(
    `
      INSERT INTO rides (driver_id, departure_time, total_seats, available_seats, price_per_seat, origin, destination, preferences, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [1, new Date(now + 4 * h).toISOString(), 4, 2, 18, "Downtown", "Airport", "No smoking, light conversation welcome.", "active"],
  );
  const ride1 = get("SELECT last_insert_rowid() AS id").id;

  run(
    `
      INSERT INTO rides (driver_id, departure_time, total_seats, available_seats, price_per_seat, origin, destination, preferences, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [2, new Date(now + 8 * h).toISOString(), 3, 1, 12, "North Station", "Campus", "Music okay, no food in car.", "active"],
  );

  run(
    `
      INSERT INTO rides (driver_id, departure_time, total_seats, available_seats, price_per_seat, origin, destination, preferences, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [1, new Date(now - 24 * h).toISOString(), 4, 0, 15, "Downtown", "Harbor", "Completed sample trip.", "completed"],
  );

  run(
    `
      INSERT INTO ride_requests (ride_id, rider_id, seats, message, status)
      VALUES (?, ?, ?, ?, ?)
    `,
    [ride1, 3, 1, "I can be ready 10 minutes early.", "pending"],
  );

  run(
    `
      INSERT INTO messages (ride_id, sender_id, content, created_at)
      VALUES (?, ?, ?, ?)
    `,
    [ride1, 1, "I’m leaving in 20 minutes.", new Date(now - 30 * 60 * 1000).toISOString()],
  );
  run(
    `
      INSERT INTO messages (ride_id, sender_id, content, created_at)
      VALUES (?, ?, ?, ?)
    `,
    [ride1, 3, "Perfect, I’ll be there on time.", new Date(now - 20 * 60 * 1000).toISOString()],
  );

  run(
    `
      INSERT INTO ratings (ride_id, rater_id, rated_user_id, score, comment, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [null, 3, 1, 5, "Smooth ride and great communication.", new Date(now - 48 * h).toISOString()],
  );
  run(
    `
      INSERT INTO ratings (ride_id, rater_id, rated_user_id, score, comment, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [null, 2, 1, 4, "Reliable and punctual.", new Date(now - 5 * 24 * h).toISOString()],
  );
  run(
    `
      INSERT INTO ratings (ride_id, rater_id, rated_user_id, score, comment, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [null, 1, 2, 5, "Easy to coordinate with.", new Date(now - 24 * h).toISOString()],
  );

  run(
    `
      INSERT INTO notifications (user_id, type, title, body, ride_id, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [1, "new_request", "New ride request", "Maya Patel requested a seat on your Downtown to Airport ride.", ride1, 0, new Date(now - h).toISOString()],
  );

  run(
    `
      INSERT INTO notifications (user_id, type, title, body, ride_id, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [1, "ride_completed", "Ride completed", "Your Harbor ride was completed successfully.", 3, 1, new Date(now - 20 * h).toISOString()],
  );

  saveDb();
}

function makeToken() {
  return crypto.randomBytes(24).toString("hex");
}

function createSession(userId) {
  const token = makeToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  run("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)", [token, userId, expiresAt]);
  saveDb();
  return token;
}

function getAuthToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  const xToken = req.headers["x-auth-token"];
  return typeof xToken === "string" ? xToken : null;
}

function getUserWithComputed(userId) {
  return get(
    `
      SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        u.avatar_url AS avatarUrl,
        u.bio,
        u.vehicle_info AS vehicleInfo,
        u.is_verified AS isVerified,
        (
          SELECT COALESCE(ROUND(AVG(score), 1), NULL)
          FROM ratings
          WHERE rated_user_id = u.id
        ) AS rating,
        (
          SELECT COUNT(*)
          FROM rides rr
          WHERE rr.driver_id = u.id OR rr.id IN (
            SELECT ride_id FROM ride_requests req WHERE req.rider_id = u.id AND req.status = 'accepted'
          )
        ) AS totalRides
      FROM users u
      WHERE u.id = ?
    `,
    [userId],
  );
}

function computeMatchScore(rideId, userId = 0) {
  const seed = Number(rideId) * 31 + Number(userId) * 17;
  return 70 + (Math.abs(seed) % 31);
}

function rideListQuery(whereClause = "", params = []) {
  return all(
    `
      SELECT
        ride.id,
        ride.driver_id AS driverId,
        driver.name AS driverName,
        driver.avatar_url AS driverAvatar,
        driver.vehicle_info AS driverVehicle,
        driver.is_verified AS driverIsVerified,
        (
          SELECT COALESCE(ROUND(AVG(score), 1), NULL)
          FROM ratings
          WHERE rated_user_id = driver.id
        ) AS driverRating,
        ride.departure_time AS departureTime,
        ride.total_seats AS totalSeats,
        ride.available_seats AS availableSeats,
        ride.price_per_seat AS pricePerSeat,
        ride.origin,
        ride.destination,
        ride.preferences,
        ride.status,
        ride.created_at AS createdAt
      FROM rides ride
      JOIN users driver ON driver.id = ride.driver_id
      ${whereClause}
      ORDER BY datetime(ride.departure_time) ASC
    `,
    params,
  );
}

function serializeRide(row, userId = 0, withRequests = false) {
  const ride = {
    id: row.id,
    driverId: row.driverId,
    driverName: row.driverName,
    driverAvatar: row.driverAvatar ?? "",
    driverRating: row.driverRating,
    driverIsVerified: Boolean(row.driverIsVerified),
    driverVehicle: row.driverVehicle,
    departureTime: row.departureTime,
    totalSeats: row.totalSeats,
    availableSeats: row.availableSeats,
    pricePerSeat: row.pricePerSeat,
    origin: row.origin,
    destination: row.destination,
    preferences: row.preferences,
    status: row.status,
    matchScore: computeMatchScore(row.id, userId),
    requests: [],
  };

  if (withRequests) {
    ride.requests = all(
      `
        SELECT
          req.id,
          req.rider_id AS riderId,
          rider.name AS riderName,
          rider.avatar_url AS riderAvatar,
          req.seats,
          req.message,
          req.status,
          req.fare_share AS fareShare
        FROM ride_requests req
        JOIN users rider ON rider.id = req.rider_id
        WHERE req.ride_id = ?
        ORDER BY datetime(req.created_at) ASC
      `,
      [row.id],
    );
  }

  return ride;
}

function authRequired(req, res, next) {
  const token = getAuthToken(req);
  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const session = get(
    `
      SELECT token, user_id AS userId, expires_at AS expiresAt
      FROM sessions
      WHERE token = ?
    `,
    [token],
  );

  if (!session) {
    return res.status(401).json({ message: "Invalid session." });
  }

  if (new Date(session.expiresAt).getTime() < Date.now()) {
    run("DELETE FROM sessions WHERE token = ?", [token]);
    saveDb();
    return res.status(401).json({ message: "Session expired." });
  }

  const user = getUserWithComputed(session.userId);
  if (!user) {
    return res.status(401).json({ message: "User no longer exists." });
  }

  req.auth = { user, token };
  next();
}

app.get("/", (_req, res) => {
  res.json({
    name: "CarPooling API",
    status: "running",
    frontend: "http://localhost:5173",
    health: "/api/health",
    routes: {
      auth: ["/api/auth/login", "/api/auth/register", "/api/auth/me"],
      rides: ["/api/rides", "/api/rides/recent", "/api/rides/:id"],
      users: ["/api/users/:id", "/api/users/:id/ratings"],
      notifications: ["/api/notifications"],
    },
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = get("SELECT * FROM users WHERE email = ?", [String(email).toLowerCase()]);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = createSession(user.id);
  res.json({ token });
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, password, phone, role } = req.body ?? {};
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Name, email, password, and role are required." });
  }

  if (!["driver", "rider", "both"].includes(role)) {
    return res.status(400).json({ message: "Invalid role." });
  }

  const existing = get("SELECT id FROM users WHERE email = ?", [String(email).toLowerCase()]);
  if (existing) {
    return res.status(409).json({ message: "Email is already in use." });
  }

  run(
    `
      INSERT INTO users (name, email, password_hash, phone, role, is_verified)
      VALUES (?, ?, ?, ?, ?, 1)
    `,
    [name, String(email).toLowerCase(), bcrypt.hashSync(password, 10), phone ?? null, role],
  );

  const inserted = get("SELECT last_insert_rowid() AS id");
  const token = createSession(inserted.id);
  saveDb();
  res.status(201).json({ token });
});

app.get("/api/auth/me", authRequired, (req, res) => {
  res.json(req.auth.user);
});

app.get("/api/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ message: "Invalid user id." });
  }

  const user = getUserWithComputed(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  res.json(user);
});

app.get("/api/users/:id/ratings", (req, res) => {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ message: "Invalid user id." });
  }

  const ratings = all(
    `
      SELECT
        rating.id,
        rater.name AS raterName,
        rating.score,
        rating.comment,
        rating.created_at AS createdAt
      FROM ratings rating
      JOIN users rater ON rater.id = rating.rater_id
      WHERE rating.rated_user_id = ?
      ORDER BY datetime(rating.created_at) DESC
    `,
    [userId],
  );

  res.json(ratings);
});

app.get("/api/dashboard/stats", authRequired, (req, res) => {
  const userId = req.auth.user.id;

  const totalRidesAsDriver = get("SELECT COUNT(*) AS count FROM rides WHERE driver_id = ?", [userId]).count;
  const totalRidesAsRider = get("SELECT COUNT(*) AS count FROM ride_requests WHERE rider_id = ? AND status = 'accepted'", [userId]).count;
  const totalEarnings = get(
    `
      SELECT COALESCE(SUM(req.seats * ride.price_per_seat), 0) AS total
      FROM ride_requests req
      JOIN rides ride ON ride.id = req.ride_id
      WHERE ride.driver_id = ? AND req.status = 'accepted'
    `,
    [userId],
  ).total;
  const averageRating = get("SELECT ROUND(AVG(score), 1) AS avg FROM ratings WHERE rated_user_id = ?", [userId]).avg;

  res.json({
    totalRidesAsDriver,
    totalRidesAsRider,
    totalEarnings,
    averageRating,
  });
});

app.get("/api/admin/stats", authRequired, (req, res) => {
  if (req.auth.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required." });
  }

  const ridesThisWeek = get("SELECT COUNT(*) AS count FROM rides WHERE datetime(created_at) >= datetime('now', '-7 days')").count;
  const newUsersThisWeek = get("SELECT COUNT(*) AS count FROM users WHERE datetime(created_at) >= datetime('now', '-7 days')").count;
  const totalRides = get("SELECT COUNT(*) AS count FROM rides").count;
  const totalUsers = get("SELECT COUNT(*) AS count FROM users").count;
  const activeRides = get("SELECT COUNT(*) AS count FROM rides WHERE status = 'active'").count;
  const totalRevenue = get(
    `
      SELECT COALESCE(SUM(req.seats * ride.price_per_seat), 0) AS total
      FROM ride_requests req
      JOIN rides ride ON ride.id = req.ride_id
      WHERE req.status = 'accepted'
    `,
  ).total;

  res.json({
    ridesThisWeek,
    newUsersThisWeek,
    totalRides,
    totalUsers,
    activeRides,
    totalRevenue,
  });
});

app.get("/api/rides/recent", authRequired, (req, res) => {
  const rows = rideListQuery("WHERE ride.status = 'active' AND datetime(ride.departure_time) >= datetime('now')");
  res.json(rows.slice(0, 6).map((row) => serializeRide(row, req.auth.user.id, false)));
});

app.get("/api/rides", authRequired, (req, res) => {
  const clauses = ["ride.status != 'cancelled'"];
  const params = [];

  if (req.query.origin) {
    clauses.push("LOWER(ride.origin) LIKE ?");
    params.push(`%${String(req.query.origin).toLowerCase()}%`);
  }

  if (req.query.destination) {
    clauses.push("LOWER(ride.destination) LIKE ?");
    params.push(`%${String(req.query.destination).toLowerCase()}%`);
  }

  if (req.query.date) {
    clauses.push("date(ride.departure_time) = date(?)");
    params.push(String(req.query.date));
  }

  if (req.query.seats) {
    clauses.push("ride.available_seats >= ?");
    params.push(Number(req.query.seats));
  }

  if (req.query.driverId) {
    clauses.push("ride.driver_id = ?");
    params.push(Number(req.query.driverId));
  }

  const rows = rideListQuery(`WHERE ${clauses.join(" AND ")}`, params);
  res.json(rows.map((row) => serializeRide(row, req.auth.user.id, false)));
});

app.get("/api/rides/:id", authRequired, (req, res) => {
  const rideId = Number(req.params.id);
  if (!Number.isInteger(rideId) || rideId <= 0) {
    return res.status(400).json({ message: "Invalid ride id." });
  }

  const rows = rideListQuery("WHERE ride.id = ?", [rideId]);
  if (!rows[0]) {
    return res.status(404).json({ message: "Ride not found." });
  }

  res.json(serializeRide(rows[0], req.auth.user.id, true));
});

app.post("/api/rides", authRequired, (req, res) => {
  const { origin, destination, departureTime, totalSeats, pricePerSeat, preferences } = req.body ?? {};

  if (!origin || !destination || !departureTime || !totalSeats) {
    return res.status(400).json({ message: "origin, destination, departureTime, and totalSeats are required." });
  }

  run(
    `
      INSERT INTO rides (driver_id, departure_time, total_seats, available_seats, price_per_seat, origin, destination, preferences, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `,
    [
      req.auth.user.id,
      departureTime,
      Number(totalSeats),
      Number(totalSeats),
      Number(pricePerSeat ?? 0),
      origin,
      destination,
      preferences ?? null,
    ],
  );

  const inserted = get("SELECT last_insert_rowid() AS id");
  saveDb();
  res.status(201).json({ id: inserted.id });
});

app.post("/api/rides/:id/requests", authRequired, (req, res) => {
  const rideId = Number(req.params.id);
  const { seats, message } = req.body ?? {};
  const requestedSeats = Number(seats ?? 1);

  if (!Number.isInteger(rideId) || rideId <= 0) {
    return res.status(400).json({ message: "Invalid ride id." });
  }

  const ride = get("SELECT * FROM rides WHERE id = ?", [rideId]);
  if (!ride) {
    return res.status(404).json({ message: "Ride not found." });
  }

  if (ride.driver_id === req.auth.user.id) {
    return res.status(400).json({ message: "You cannot request your own ride." });
  }

  if (requestedSeats <= 0) {
    return res.status(400).json({ message: "Seats must be greater than 0." });
  }

  const existing = get(
    `
      SELECT id FROM ride_requests
      WHERE ride_id = ? AND rider_id = ? AND status IN ('pending', 'accepted')
    `,
    [rideId, req.auth.user.id],
  );

  if (existing) {
    return res.status(409).json({ message: "You already have an active request for this ride." });
  }

  run(
    `
      INSERT INTO ride_requests (ride_id, rider_id, seats, message, status)
      VALUES (?, ?, ?, ?, 'pending')
    `,
    [rideId, req.auth.user.id, requestedSeats, message ?? null],
  );
  const inserted = get("SELECT last_insert_rowid() AS id");

  run(
    `
      INSERT INTO notifications (user_id, type, title, body, ride_id, is_read)
      VALUES (?, 'new_request', 'New ride request', ?, ?, 0)
    `,
    [ride.driver_id, `${req.auth.user.name} requested ${requestedSeats} seat${requestedSeats > 1 ? "s" : ""}.`, rideId],
  );

  saveDb();
  res.status(201).json({ id: inserted.id });
});

app.post("/api/requests/:id/accept", authRequired, (req, res) => {
  const requestId = Number(req.params.id);
  const requestRow = get(
    `
      SELECT req.*, ride.driver_id AS driverId, ride.available_seats AS availableSeats, ride.price_per_seat AS pricePerSeat, ride.id AS rideId
      FROM ride_requests req
      JOIN rides ride ON ride.id = req.ride_id
      WHERE req.id = ?
    `,
    [requestId],
  );

  if (!requestRow) {
    return res.status(404).json({ message: "Request not found." });
  }

  if (requestRow.driverId !== req.auth.user.id) {
    return res.status(403).json({ message: "Only the ride driver can accept requests." });
  }

  if (requestRow.status !== "pending") {
    return res.status(400).json({ message: "Only pending requests can be accepted." });
  }

  if (requestRow.availableSeats < requestRow.seats) {
    return res.status(400).json({ message: "Not enough seats available." });
  }

  run(
    `
      UPDATE ride_requests
      SET status = 'accepted', fare_share = ?
      WHERE id = ?
    `,
    [requestRow.seats * requestRow.pricePerSeat, requestId],
  );

  run("UPDATE rides SET available_seats = available_seats - ? WHERE id = ?", [requestRow.seats, requestRow.rideId]);

  run(
    `
      INSERT INTO notifications (user_id, type, title, body, ride_id, is_read)
      VALUES (?, 'ride_accepted', 'Ride request accepted', 'Your request was accepted by the driver.', ?, 0)
    `,
    [requestRow.rider_id, requestRow.rideId],
  );

  saveDb();
  res.json({ ok: true });
});

app.post("/api/requests/:id/reject", authRequired, (req, res) => {
  const requestId = Number(req.params.id);
  const requestRow = get(
    `
      SELECT req.*, ride.driver_id AS driverId, ride.id AS rideId
      FROM ride_requests req
      JOIN rides ride ON ride.id = req.ride_id
      WHERE req.id = ?
    `,
    [requestId],
  );

  if (!requestRow) {
    return res.status(404).json({ message: "Request not found." });
  }

  if (requestRow.driverId !== req.auth.user.id) {
    return res.status(403).json({ message: "Only the ride driver can reject requests." });
  }

  run("UPDATE ride_requests SET status = 'rejected' WHERE id = ?", [requestId]);

  run(
    `
      INSERT INTO notifications (user_id, type, title, body, ride_id, is_read)
      VALUES (?, 'ride_rejected', 'Ride request rejected', 'Your request was rejected by the driver.', ?, 0)
    `,
    [requestRow.rider_id, requestRow.rideId],
  );

  saveDb();
  res.json({ ok: true });
});

app.post("/api/rides/:id/complete", authRequired, (req, res) => {
  const rideId = Number(req.params.id);
  const ride = get("SELECT * FROM rides WHERE id = ?", [rideId]);

  if (!ride) {
    return res.status(404).json({ message: "Ride not found." });
  }

  if (ride.driver_id !== req.auth.user.id) {
    return res.status(403).json({ message: "Only the ride driver can complete this ride." });
  }

  run("UPDATE rides SET status = 'completed' WHERE id = ?", [rideId]);

  const acceptedRiders = all(
    `
      SELECT rider_id AS riderId
      FROM ride_requests
      WHERE ride_id = ? AND status = 'accepted'
    `,
    [rideId],
  );

  acceptedRiders.forEach((rider) => {
    run(
      `
        INSERT INTO notifications (user_id, type, title, body, ride_id, is_read)
        VALUES (?, 'ride_completed', 'Ride completed', 'Your ride has been marked as completed.', ?, 0)
      `,
      [rider.riderId, rideId],
    );
  });

  saveDb();
  res.json({ ok: true });
});

app.get("/api/rides/:id/messages", authRequired, (req, res) => {
  const rideId = Number(req.params.id);
  if (!Number.isInteger(rideId) || rideId <= 0) {
    return res.status(400).json({ message: "Invalid ride id." });
  }

  const items = all(
    `
      SELECT
        msg.id,
        msg.ride_id AS rideId,
        msg.sender_id AS senderId,
        sender.name AS senderName,
        msg.content,
        msg.created_at AS createdAt
      FROM messages msg
      JOIN users sender ON sender.id = msg.sender_id
      WHERE msg.ride_id = ?
      ORDER BY datetime(msg.created_at) ASC
    `,
    [rideId],
  );

  res.json(items);
});

app.post("/api/messages", authRequired, (req, res) => {
  const { rideId, content } = req.body ?? {};
  if (!rideId || !content) {
    return res.status(400).json({ message: "rideId and content are required." });
  }

  const ride = get("SELECT id FROM rides WHERE id = ?", [Number(rideId)]);
  if (!ride) {
    return res.status(404).json({ message: "Ride not found." });
  }

  run(
    `
      INSERT INTO messages (ride_id, sender_id, content)
      VALUES (?, ?, ?)
    `,
    [Number(rideId), req.auth.user.id, String(content)],
  );

  const inserted = get("SELECT last_insert_rowid() AS id");
  saveDb();
  res.status(201).json({ id: inserted.id });
});

app.post("/api/ratings", authRequired, (req, res) => {
  const { rideId, ratedUserId, score, comment } = req.body ?? {};
  if (!ratedUserId || !score) {
    return res.status(400).json({ message: "ratedUserId and score are required." });
  }

  run(
    `
      INSERT INTO ratings (ride_id, rater_id, rated_user_id, score, comment)
      VALUES (?, ?, ?, ?, ?)
    `,
    [rideId ?? null, req.auth.user.id, Number(ratedUserId), Number(score), comment ?? null],
  );

  const inserted = get("SELECT last_insert_rowid() AS id");
  saveDb();
  res.status(201).json({ id: inserted.id });
});

app.get("/api/notifications", authRequired, (req, res) => {
  const items = all(
    `
      SELECT
        id,
        type,
        title,
        body,
        ride_id AS rideId,
        is_read AS isRead,
        created_at AS createdAt
      FROM notifications
      WHERE user_id = ?
      ORDER BY datetime(created_at) DESC
    `,
    [req.auth.user.id],
  ).map((item) => ({ ...item, isRead: Boolean(item.isRead) }));

  res.json(items);
});

app.post("/api/notifications/:id/read", authRequired, (req, res) => {
  const notificationId = Number(req.params.id);

  run(
    `
      UPDATE notifications
      SET is_read = 1
      WHERE id = ? AND user_id = ?
    `,
    [notificationId, req.auth.user.id],
  );

  const updated = get("SELECT changes() AS changes").changes;
  if (!updated) {
    return res.status(404).json({ message: "Notification not found." });
  }

  saveDb();
  res.json({ ok: true });
});

app.post("/api/notifications/read-all", authRequired, (req, res) => {
  run("UPDATE notifications SET is_read = 1 WHERE user_id = ?", [req.auth.user.id]);
  saveDb();
  res.json({ ok: true });
});

app.use("/api", (req, res) => {
  res.status(404).json({
    message: `API route not found: ${req.method} ${req.originalUrl}`,
    health: "/api/health",
  });
});

async function start() {
  const SQL = await initSqlJs({
    locateFile: (file) => path.resolve(import.meta.dirname, "node_modules", "sql.js", "dist", file),
  });

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(new Uint8Array(fileBuffer));
  } else {
    db = new SQL.Database();
  }

  run("PRAGMA foreign_keys = ON");
  initSchema();
  seedData();

  app.listen(API_PORT, () => {
    console.log(`API server running on http://localhost:${API_PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start API server", error);
  process.exit(1);
});
