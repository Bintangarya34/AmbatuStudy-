import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import "dotenv/config";
import pkg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ambatustudy",
  password: "12345",
  port: 5432,
});

const app = new Elysia()
  .use(staticPlugin({ assets: "public", prefix: "/" }))

  // ==============================
  // REGISTER
  // ==============================
  .post("/register", async ({ body }) => {
    const { username, pass } = body as { username: string; pass: string };

    if (!username || !pass) return { status: "error", message: "Invalid input" };

    const existing = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
    if (existing.rows.length > 0) return { status: "error", message: "Username already exists" };

    const hashed = await bcrypt.hash(pass, 10);
    const result = await pool.query(
      "INSERT INTO users (username, pass) VALUES ($1, $2) RETURNING id, username, created_at",
      [username, hashed]
    );

    return { status: "success", user: result.rows[0] };
  })

  // ==============================
  // LOGIN
  // ==============================
  .post("/login", async ({ body }) => {
    const { username, pass } = body as { username: string; pass: string };
    const user = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
    if (user.rows.length === 0) return { status: "error", message: "User not found" };

    const valid = await bcrypt.compare(pass, user.rows[0].pass);
    if (!valid) return { status: "error", message: "Invalid password" };

    return { status: "success", user: { id: user.rows[0].id, username: user.rows[0].username } };
  });

// ==============================
// GET ALL QUIZZES
// ==============================
app.get("/quizzes", async () => {
  try {
    const result = await pool.query("SELECT id, title FROM quiz ORDER BY id ASC");
    return { status: "success", quizzes: result.rows };
  } catch (err) {
    console.error(err);
    return { status: "error", message: "Gagal mengambil daftar quiz" };
  }
});

// ==============================
// GET QUIZ BY ID
// ==============================
app.get("/quiz/:id", async ({ params }) => {
  const quizId = Number(params.id);
  if (isNaN(quizId)) return { status: "error", message: "Quiz ID must be a number" };

  const quiz = await pool.query("SELECT * FROM quiz WHERE id=$1", [quizId]);
  if (quiz.rows.length === 0) return { status: "error", message: "Quiz not found" };

  const questions = await pool.query(
    `
      SELECT q.id AS question_id,
             q.question,
             q.score_value,
             json_agg(
                json_build_object(
                    'id', ao.id,
                    'text', ao.text,
                    'is_correct', ao.is_correct
                )
             ) AS options,
             MAX(CASE WHEN ao.is_correct THEN ao.id ELSE NULL END) AS correct_answer_id
      FROM questions q
      JOIN answer_option ao ON ao.question_id = q.id
      WHERE q.quiz_id=$1
      GROUP BY q.id
    `,
    [quizId]
  );

  return {
    status: "success",
    quiz: quiz.rows[0],
    questions: questions.rows,
  };
});

// ==============================
// SUBMIT QUIZ
// ==============================
app.post("/quiz/:id/submit", async ({ params, body }) => {
  const quizId = Number(params.id);
  const { user_id, answers } = body as { user_id: number; answers: { question_id: number; answer_id: number }[] };

  if (isNaN(quizId) || !user_id || !Array.isArray(answers)) {
    return { status: "error", message: "Invalid request" };
  }

  try {
    let correctCount = 0;

    // Periksa jawaban benar
    for (const ans of answers) {
      const res = await pool.query(
        "SELECT is_correct FROM answer_option WHERE id=$1",
        [ans.answer_id]
      );
      if (res.rows[0]?.is_correct) correctCount++;
    }

    const totalQuestions = answers.length;
    const score = correctCount; // Bisa dikalikan score_value jika mau

    // Simpan ke quiz_result
    await pool.query(
      `INSERT INTO quiz_results (user_id, quiz_id, score, total_questions, correct_answers, completed_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [user_id, quizId, score, totalQuestions, correctCount]
    );

    return { status: "success", score, totalQuestions, correctCount };
  } catch (err) {
    console.error("Submit quiz error:", err);
    return { status: "error", message: "Gagal submit quiz" };
  }
});

// ==============================
app.listen(3000);
console.log("Server running on http://localhost:3000");