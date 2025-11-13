import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import "dotenv/config";
import pkg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pkg;

const pool = new Pool({
  user: "ambatulayapp",
  host: "localhost",
  database: "ambatustudy",
  password: "09876",
  port: 5432,
});

const app = new Elysia()
  .use(staticPlugin({ assets: "public", prefix: "/" }))

  // REGISTER
  .post("/register", async ({ body }) => {
    const { username, pass } = body as { username: string; pass: string };

    if (!username || !pass || username.length < 2 || pass.length < 4) {
      return { status: "error", message: "Invalid username or password" };
    }

    // Check if username already exists
    const existing = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existing.rows.length > 0) {
      return { status: "error", message: "Username already exists" };
    }

    // Hash the password
    const hashed = await bcrypt.hash(pass, 10);

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (username, pass) VALUES ($1, $2) RETURNING id, username, created_at',
      [username, hashed]
    );

    return { status: "success", user: result.rows[0] };
  })

  // LOGIN
  .post("/login", async ({ body }) => {
    const { username, pass } = body as { username: string; pass: string };

    if (!username || !pass) {
      return { status: "error", message: "Missing username or password" };
    }

    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length === 0) {
      return { status: "error", message: "User not found" };
    }

    const valid = await bcrypt.compare(pass, user.rows[0].pass);
    if (!valid) {
      return { status: "error", message: "Invalid password" };
    }

    return {
      status: "success",
      user: { id: user.rows[0].id, username: user.rows[0].username },
    };
  })

  // TEST: GET ALL USERS (debug only)
  .get("/users", async () => {
    const result = await pool.query('SELECT id, username, created_at FROM users');
    return { status: "success", users: result.rows };
  })

  .listen(3000);

console.log(`✅ Server running at http://${app.server?.hostname}:${app.server?.port}`);

/*
kalau mau run::
bun add pg

database: postgresql
user: ambatulayapp
pass: 09876
database: ambatustudy
 */