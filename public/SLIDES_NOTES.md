Ambatustudy — Slide Notes and Export

File: public/presentation.html

How to use
1. Open the file in a browser: double-click `public/presentation.html` or serve with the dev server and open `http://localhost:3000/presentation.html`.
2. Navigate slides with Right / Left arrow keys, or click the small controls shown on the slide.
3. Press "Show Notes" to toggle speaker notes (or press `N`).
4. Print or Export to PDF: in browser use Print → Save as PDF. Use A4 or Letter and set margins to none for best result.

Slide-by-slide speaker notes

1) Title
- Introduce Ambatustudy, goal: lightweight math learning platform.
- Mention author: Bintangarya34.

2) Fitur Utama
- Latihan (quiz): interaktif, simple progress.
- Video tutorial & notes.
- Chatbot "Mas Amba" simulates ChatGPT.
- Dark mode & search.

3) Arsitektur & File Penting
- Front-end only, vanilla JS.
- Key files: `public/script.js`, `public/index.html`, `public/courses.html`, `public/Notes.html`, `public/Videos.html`.

4) Implementasi Chat — "Mas Amba"
- Modal chat UI, simulated responses client-side.
- Explain security: real OpenAI API calls must be done server-side.

5) Login Sederhana
- Name-only login that stores name in `localStorage` under `ambatuStudyUser`.
- Quick personalization, no passwords.

6) Perubahan & Perbaikan
- Consolidated JS into single `public/script.js` to reduce duplication.
- Fixed missing chat modal on some pages.
- Notes about debugging: script was corrupted during edits and recreated.

7) Demo
- Steps to demo: open `/courses.html`, click chat, login with name, try quiz.

8) Risiko & Next Steps
- Move ChatGPT integration to backend, add authentication for user data, add tests & CI.

9) Penutup
- Invite questions and feedback.

Suggested git commit message

"feat: add presentation slides and speaker notes for project report"

Optional: Convert to PPTX
- Use LibreOffice or Google Slides: open the exported PDF and import to Slides, or recreate slides in Google Slides quickly using the content above.
