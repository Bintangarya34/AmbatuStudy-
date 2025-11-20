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
    // GET QUIZ WITH QUESTIONS & OPTIONS
  .get("/quiz/:id", async ({ params }) => {
    const quizId = params.id;

    const quiz = await pool.query("SELECT * FROM quiz WHERE id=$1", [quizId]);
    if (quiz.rows.length === 0) {
      return { status: "error", message: "Quiz not found" };
    }

    const questions = await pool.query(`
      SELECT q.id AS question_id,
             q.question,
             q.score_value,
             json_agg(
                json_build_object(
                    'id', ao.id,
                    'text', ao.text,
                    'is_correct', ao.is_correct
                )
             ) AS options
      FROM questions q
      JOIN answer_option ao ON ao.question_id = q.id
      WHERE q.quiz_id = $1
      GROUP BY q.id
    `, [quizId]);

    return {
      status: "success",
      quiz: quiz.rows[0],
      questions: questions.rows
    };
  })
  
    .post("/quiz/:id/submit", async ({ params, body }) => {
    const quizId = params.id;
    const { user_id, answers } = body as {
      user_id: number;
      answers: { question_id: number; answer_id: number }[];
    };

    if (!user_id || !answers || answers.length === 0) {
      return { status: "error", message: "Invalid submission format" };
    }

    const dup = await pool.query(
      "SELECT 1 FROM quiz_results WHERE user_id=$1 AND quiz_id=$2",
      [user_id, quizId]
    );

    if (dup.rows.length > 0) {
      return { status: "error", message: "Quiz already submitted" };
    }

    let correct = 0;

    for (const a of answers) {
      const check = await pool.query(
        "SELECT is_correct FROM answer_option WHERE id=$1",
        [a.answer_id]
      );
      if (check.rows[0]?.is_correct) correct++;
    }

    const total = answers.length;

    await pool.query(
      `INSERT INTO quiz_results (user_id, quiz_id, score, total_questions, correct_answers)
       VALUES ($1, $2, $3, $4, $5)`,
      [user_id, quizId, correct, total, correct]
    );

    return {
      status: "success",
      total_questions: total,
      correct_answers: correct,
      score: correct,
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