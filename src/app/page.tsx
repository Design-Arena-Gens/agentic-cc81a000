"use client";

import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CheckCircle,
  ClipboardList,
  Loader2,
  Sparkles,
  Wand2,
} from "lucide-react";
import { LessonPackage } from "@/types/lesson";

const lessonSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  topic: z.string().min(1, "Topic is required"),
  gradeLevel: z.string().min(1, "Grade level is required"),
  duration: z.string().optional(),
  tone: z.string().optional(),
  focusSkills: z.string().optional(),
  assessmentType: z.string().optional(),
  learningObjectives: z
    .string()
    .min(1, "Provide at least one learning objective"),
  includeAids: z.boolean(),
});

type LessonFormValues = z.infer<typeof lessonSchema>;

const gradeLevels = [
  "JHS 1",
  "JHS 2",
  "JHS 3",
  "SHS 1",
  "SHS 2",
  "SHS 3",
];

const subjects = [
  "Mathematics",
  "Integrated Science",
  "English Language",
  "Social Studies",
  "ICT",
  "Agricultural Science",
  "Business Studies",
  "Creative Arts",
];

const tones = [
  "supportive and practical",
  "energetic and motivational",
  "calm and reflective",
  "rigorous and academic",
];

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
      {children}
    </span>
  );
}

function SectionCard({
  title,
  icon,
  description,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-lg ring-1 ring-white/5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-200">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
          {description ? (
            <p className="text-sm text-slate-400">{description}</p>
          ) : null}
        </div>
      </div>
      <div className="space-y-3 text-sm leading-relaxed text-slate-200">
        {children}
      </div>
    </div>
  );
}

function InfoList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex gap-2">
          <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function copyText(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    void navigator.clipboard.writeText(text);
  }
}

export default function Home() {
  const [lessonPackage, setLessonPackage] = useState<LessonPackage | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      subject: "Integrated Science",
      topic: "",
      gradeLevel: "JHS 1",
      duration: "60 minutes",
      tone: "supportive and practical",
      focusSkills: "",
      assessmentType: "Formative quiz and exit tickets",
      learningObjectives:
        "Describe the key concept and why it matters.\nApply the concept to a Ghanaian real-world scenario.\nDemonstrate mastery through a short assessment.",
      includeAids: true,
    },
  });

  const onSubmit = (values: LessonFormValues) => {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.error ?? "Failed to generate resources.");
        }

        const data = (await response.json()) as LessonPackage;
        setLessonPackage(data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unexpected error. Please try again."
        );
      }
    });
  };

  const stats = useMemo(
    () => [
      { label: "Lesson templates saved", value: "12k+" },
      { label: "Average prep time saved", value: "54%" },
      { label: "Schools using EduSmart", value: "180+" },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950" />
      <div className="relative">
        <header className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-12 pt-16 lg:flex-row lg:items-center">
          <div className="flex-1">
            <Badge>
              <Sparkles className="h-3.5 w-3.5" />
              Ghana Curriculum Aligned
            </Badge>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-100 sm:text-5xl">
              EduSmart Assistant
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-300">
              Instantly generate curriculum-aligned lesson plans, quizzes, and
              reports tailored to Ghanaian JHS and SHS classrooms. Enter your
              topic and objectives, and receive an editable lesson package in
              seconds.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-6 text-slate-300 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center shadow-md"
                >
                  <p className="text-2xl font-semibold text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 max-w-md flex-1">
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl ring-1 ring-white/5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-200">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Lesson Package Builder
                  </h2>
                  <p className="text-sm text-slate-400">
                    Provide lesson details and let EduSmart craft the rest.
                  </p>
                </div>
              </div>

              <form
                className="mt-6 space-y-5"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Subject
                  </label>
                  <select
                    className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-500/30"
                    {...form.register("subject")}
                  >
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.subject ? (
                    <p className="mt-1 text-xs text-rose-300">
                      {form.formState.errors.subject.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Topic focus
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Photosynthesis and energy transfer"
                    className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-500/30"
                    {...form.register("topic")}
                  />
                  {form.formState.errors.topic ? (
                    <p className="mt-1 text-xs text-rose-300">
                      {form.formState.errors.topic.message}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Grade level
                    </label>
                    <select
                      className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-500/30"
                      {...form.register("gradeLevel")}
                    >
                      {gradeLevels.map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                    {form.formState.errors.gradeLevel ? (
                      <p className="mt-1 text-xs text-rose-300">
                        {form.formState.errors.gradeLevel.message}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Lesson duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 60 minutes"
                      className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-500/30"
                      {...form.register("duration")}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Tone
                    </label>
                    <select
                      className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-500/30"
                      {...form.register("tone")}
                    >
                      {tones.map((tone) => (
                        <option key={tone} value={tone}>
                          {tone}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Assessment preference
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Short quiz + rubric"
                      className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-500/30"
                      {...form.register("assessmentType")}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Focus skills / competencies
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Critical thinking, collaboration, scientific inquiry"
                    className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-500/30"
                    {...form.register("focusSkills")}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Learning objectives
                  </label>
                  <textarea
                    rows={4}
                    placeholder="List each learning objective on a new line"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-500/30"
                    {...form.register("learningObjectives")}
                  />
                  {form.formState.errors.learningObjectives ? (
                    <p className="mt-1 text-xs text-rose-300">
                      {form.formState.errors.learningObjectives.message}
                    </p>
                  ) : null}
                </div>

                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-200">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded-md border border-white/20 bg-slate-950/80 text-emerald-500 focus:ring-emerald-500/40"
                    {...form.register("includeAids")}
                  />
                  Include AI teaching aid prompts
                </label>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 disabled:opacity-70"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating resources…
                    </>
                  ) : (
                    <>
                      Generate lesson package
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {errorMessage ? (
                  <p className="text-center text-sm text-rose-300">
                    {errorMessage}
                  </p>
                ) : null}
              </form>
            </div>
          </div>
        </header>

        <main className="mx-auto grid max-w-6xl gap-8 px-6 pb-20 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <SectionCard
              title="Curriculum-aligned lesson plan"
              icon={<BookOpen className="h-5 w-5" />}
              description="Ready-to-teach routines, differentiation pathways, and structured timings."
            >
              {lessonPackage ? (
                <>
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/5 px-4 py-3 text-sm">
                    <div>
                      <p className="font-semibold text-white">
                        {lessonPackage.lessonPlan.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {lessonPackage.lessonPlan.subject} ·{" "}
                        {lessonPackage.lessonPlan.gradeLevel} ·{" "}
                        {lessonPackage.lessonPlan.duration}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="rounded-full border border-white/20 px-3 py-1 text-xs text-slate-200 transition hover:border-emerald-400 hover:text-emerald-200"
                      onClick={() =>
                        copyText(JSON.stringify(lessonPackage.lessonPlan, null, 2))
                      }
                    >
                      Copy JSON
                    </button>
                  </div>

                  <InfoList items={lessonPackage.lessonPlan.overview} />
                  <div className="grid gap-3 rounded-2xl bg-slate-950/40 p-4">
                    <h4 className="text-sm font-semibold text-white">
                      Lesson sequence
                    </h4>
                    <div className="space-y-3">
                      {lessonPackage.lessonPlan.segments.map((segment) => (
                        <div
                          key={segment.label}
                          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                            <span className="font-semibold text-white">
                              {segment.label}
                            </span>
                            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                              {segment.timing}
                            </span>
                          </div>
                          <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">
                            {segment.purpose}
                          </p>
                          <ul className="mt-2 space-y-1.5 text-sm text-slate-200">
                            {segment.steps.map((step, index) => (
                              <li key={index} className="flex gap-2">
                                <span className="text-emerald-300">•</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-4 rounded-2xl bg-white/5 p-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        Differentiation
                      </h4>
                      <div className="mt-2 space-y-2">
                        {lessonPackage.lessonPlan.differentiation.map((group) => (
                          <div
                            key={group.audience}
                            className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm"
                          >
                            <p className="font-semibold text-slate-100">
                              {group.audience}
                            </p>
                            <ul className="mt-1 space-y-1 text-slate-200">
                              {group.adaptations.map((item, index) => (
                                <li key={index} className="flex gap-2">
                                  <span className="text-emerald-300">–</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          Materials
                        </h4>
                        <InfoList items={lessonPackage.lessonPlan.materials} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          Homework
                        </h4>
                        <p className="text-sm text-slate-200">
                          {lessonPackage.lessonPlan.homework}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          Assessment
                        </h4>
                        <p className="text-sm text-slate-200">
                          {lessonPackage.lessonPlan.assessment}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-400">
                  Submit lesson details to unlock a complete lesson routine,
                  aligned standards, and differentiated support in seconds.
                </p>
              )}
            </SectionCard>

            <SectionCard
              title="Auto-generated quiz"
              icon={<ClipboardList className="h-5 w-5" />}
              description="Assessment ready questions with answers and explanations."
            >
              {lessonPackage ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3 text-sm">
                    <div>
                      <p className="font-semibold text-white">
                        {lessonPackage.quiz.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {lessonPackage.quiz.format}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="rounded-full border border-white/20 px-3 py-1 text-xs text-slate-200 transition hover:border-emerald-400 hover:text-emerald-200"
                      onClick={() =>
                        copyText(JSON.stringify(lessonPackage.quiz, null, 2))
                      }
                    >
                      Copy JSON
                    </button>
                  </div>
                  <div className="space-y-3">
                    {lessonPackage.quiz.questions.map((question, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm"
                      >
                        <p className="font-medium text-white">
                          Q{idx + 1}. {question.question}
                        </p>
                        {question.options.length > 0 ? (
                          <ul className="mt-2 space-y-1 text-slate-200">
                            {question.options.map((option, index) => (
                              <li key={index} className="flex gap-2">
                                <span className="text-emerald-300">
                                  {String.fromCharCode(65 + index)}.
                                </span>
                                <span>{option}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        <p className="mt-2 text-xs text-emerald-300">
                          Answer: {question.answer}
                        </p>
                        <p className="text-xs text-slate-400">
                          {question.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  A five-question mastery check tailored to your objectives will
                  appear here after generation.
                </p>
              )}
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard
              title="Student notes & feedback"
              icon={<Sparkles className="h-5 w-5" />}
              description="Personalised study guidance and ready-to-share feedback summaries."
            >
              {lessonPackage ? (
                <div className="space-y-4 text-sm">
                  <div className="rounded-2xl bg-white/5 p-4 text-slate-200">
                    <p className="text-sm font-semibold text-white">
                      Student summary
                    </p>
                    <p className="mt-2 text-sm">
                      {lessonPackage.studentNotes.summary}
                    </p>
                    <button
                      type="button"
                      className="mt-3 rounded-full border border-white/20 px-3 py-1 text-xs text-slate-200 transition hover:border-emerald-400 hover:text-emerald-200"
                      onClick={() =>
                        copyText(JSON.stringify(lessonPackage.studentNotes, null, 2))
                      }
                    >
                      Copy notes JSON
                    </button>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <p className="text-sm font-semibold text-white">
                      Key vocabulary
                    </p>
                    <ul className="mt-2 space-y-2">
                      {lessonPackage.studentNotes.vocabulary.map((item) => (
                        <li key={item.term}>
                          <p className="font-medium text-slate-100">
                            {item.term}
                          </p>
                          <p className="text-xs text-slate-400">
                            {item.definition}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-sm font-semibold text-white">
                        Study tips
                      </p>
                      <InfoList items={lessonPackage.studentNotes.studyTips} />
                    </div>
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-sm font-semibold text-white">
                        Real world links
                      </p>
                      <InfoList
                        items={lessonPackage.studentNotes.realWorldConnections}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-sm font-semibold text-white">
                      Teacher feedback report
                    </p>
                    <p className="mt-2 text-sm text-slate-200">
                      {lessonPackage.feedbackReport.teacherSummary}
                    </p>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Strengths
                        </p>
                        <InfoList items={lessonPackage.feedbackReport.strengths} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Next steps
                        </p>
                        <InfoList items={lessonPackage.feedbackReport.nextSteps} />
                      </div>
                    </div>
                    <p className="mt-3 rounded-xl bg-emerald-500/10 px-4 py-3 text-xs text-emerald-100">
                      Parent note: {lessonPackage.feedbackReport.parentNote}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  Generate a lesson package to access student-facing notes,
                  vocabulary, and auto-generated feedback for your reports.
                </p>
              )}
            </SectionCard>

            <SectionCard
              title="Teaching aids"
              icon={<Wand2 className="h-5 w-5" />}
              description="Instant prompts for visuals, manipulatives, and classroom aids."
            >
              {lessonPackage?.teachingAids?.length ? (
                <div className="space-y-3">
                  {lessonPackage.teachingAids.map((aid) => (
                    <div
                      key={aid.title}
                      className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-white">{aid.title}</p>
                        <button
                          type="button"
                          className="rounded-full border border-white/20 px-3 py-1 text-xs text-slate-200 transition hover:border-emerald-400 hover:text-emerald-200"
                          onClick={() => copyText(aid.prompt)}
                        >
                          Copy prompt
                        </button>
                      </div>
                      <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">
                        How to use
                      </p>
                      <p className="text-sm text-slate-200">{aid.usage}</p>
                      <p className="mt-3 rounded-xl bg-white/5 p-3 text-xs text-slate-300">
                        {aid.prompt}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  Enable AI teaching aid prompts to receive ready-to-use image
                  ideas for posters, anchor charts, and lesson hooks.
                </p>
              )}
            </SectionCard>

            {lessonPackage ? (
              <div className="rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-5 text-sm text-emerald-100">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-emerald-200">
                      Generation summary
                    </p>
                    <p className="font-semibold text-emerald-100">
                      {new Date(lessonPackage.metadata.generatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <p>Model: {lessonPackage.metadata.model}</p>
                    <p>Tone: {lessonPackage.metadata.tone}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
