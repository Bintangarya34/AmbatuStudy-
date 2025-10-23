import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import "dotenv/config";
import pkg from "pg";

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

  // POST /user
  .post("/user", async ({ body }) => {
    const { name } = body as { name: string };

    if (!name || name.length < 2 || name.length > 50) {
      return { status: "error", message: "Invalid name" };
    }

    const result = await pool.query(
      'INSERT INTO "User" (name, "loginTime") VALUES ($1, $2) RETURNING *',
      [name, new Date()]
    );

    return { status: "success", user: result.rows[0] };
  })

  // GET /users
  .get("/users", async () => {
    const result = await pool.query('SELECT * FROM "User"');
    return { status: "success", users: result.rows };
  })

  .listen(3000);

console.log(`Server is running at http://${app.server?.hostname}:${app.server?.port}`);