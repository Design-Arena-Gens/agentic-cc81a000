## EduSmart Assistant

EduSmart Assistant is an AI-powered teaching companion that builds curriculum-aligned lesson plans, assessments, student notes, and teacher feedback for Ghanaian JHS/SHS classrooms. Enter key lesson parameters and receive an instantly generated, editable package designed for differentiated instruction.

### Tech Stack

- Next.js App Router (TypeScript, React 18)
- Tailwind CSS with the modern `@tailwindcss/postcss` pipeline
- API route that connects to Google AI Studio (Gemini) with a graceful offline fallback

### Environment

Set one of the following environment variables to enable live AI generation. When no key is present the API will return an instructional fallback template.

```bash
GOOGLE_API_KEY=your_google_ai_studio_key
# or
GEMINI_API_KEY=your_gemini_key
```

### Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the assistant.

### Production Build

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

### Deployment

The project is optimised for Vercel. Provide the same environment variables in your Vercel project settings before deploying to production.
