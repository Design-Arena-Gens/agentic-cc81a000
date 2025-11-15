import { NextResponse } from "next/server";
import { z } from "zod";
import { LessonPackage } from "@/types/lesson";

const requestSchema = z.object({
  subject: z.string().min(1),
  topic: z.string().min(1),
  gradeLevel: z.string().min(1),
  learningObjectives: z.string().min(1),
  duration: z.string().optional(),
  assessmentType: z.string().optional(),
  tone: z.string().optional(),
  focusSkills: z.string().optional(),
  includeAids: z.boolean().optional().default(true),
});

function upgradeObjectives(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function buildPrompt(input: z.infer<typeof requestSchema>): string {
  const objectives = upgradeObjectives(input.learningObjectives);
  const tone = input.tone ?? "supportive and practical";
  const duration = input.duration || "45 minutes";
  const focusSkills = input.focusSkills
    ? `Focus skills/competencies: ${input.focusSkills}.`
    : "";
  const assessmentType = input.assessmentType
    ? `Assessment preference: ${input.assessmentType}.`
    : "";

  return `You are EduSmart Assistant, an instructional design expert specialised in Ghanaian Junior and Senior High School curriculum standards.

Produce a JSON object that strictly matches this TypeScript type:
${JSON.stringify(
  {
    lessonPlan: {
      title: "string",
      gradeLevel: "string",
      subject: "string",
      topic: "string",
      duration: "string",
      overview: ["string"],
      learningObjectives: ["string"],
      standards: ["string"],
      segments: [
        {
          label: "string",
          purpose: "string",
          steps: ["string"],
          timing: "string",
        },
      ],
      differentiation: [
        { audience: "string", adaptations: ["string"] },
      ],
      materials: ["string"],
      homework: "string",
      assessment: "string",
    },
    quiz: {
      title: "string",
      format: "string",
      questions: [
        {
          question: "string",
          options: ["string"],
          answer: "string",
          explanation: "string",
        },
      ],
    },
    studentNotes: {
      summary: "string",
      vocabulary: [{ term: "string", definition: "string" }],
      studyTips: ["string"],
      realWorldConnections: ["string"],
    },
    feedbackReport: {
      teacherSummary: "string",
      strengths: ["string"],
      nextSteps: ["string"],
      parentNote: "string",
    },
    teachingAids: [
      { title: "string", prompt: "string", usage: "string" },
    ],
    metadata: { generatedAt: "string", model: "string", tone: "string" },
  },
  null,
  2,
)}

Context:
- Subject: ${input.subject}
- Topic: ${input.topic}
- Grade level: ${input.gradeLevel}
- Duration: ${duration}
- Tone: ${tone}
${focusSkills}
${assessmentType}
- Ghana SHS & JHS curriculum alignment is mandatory.
- Learning objectives: ${objectives
    .map((objective, index) => `${index + 1}. ${objective}`)
    .join(" ")}

Rules:
- Ensure language and content difficulty align with ${input.gradeLevel}.
- Lesson segments must cover introduction, main instruction, guided practice, independent practice, differentiation, assessment, and reflection.
- Quiz must contain 5 varied question types where possible, with clearly marked answers and explanations.
- Provide at least two differentiation strategies covering struggling learners and advanced learners.
- Provide at least three tailored study tips in student notes.
- All lists must contain at least 3 bullet items unless information is inherently short.
- Do not include Markdown code fences or commentary, only pure JSON.`;
}

function buildFallback(input: z.infer<typeof requestSchema>): LessonPackage {
  const objectives = upgradeObjectives(input.learningObjectives);
  const now = new Date().toISOString();

  return {
    lessonPlan: {
      title: `${input.topic} Lesson Blueprint`,
      gradeLevel: input.gradeLevel,
      subject: input.subject,
      topic: input.topic,
      duration: input.duration || "45 minutes",
      overview: [
        `Introduce ${input.topic} with a quick diagnostic to activate prior knowledge.`,
        `Model core concepts with concrete examples and guided questioning.`,
        `Support learners to practise skills independently and reflect on success criteria.`,
      ],
      learningObjectives: objectives,
      standards: [
        "Aligns with Ghana National Pre-Tertiary Curriculum competency strands.",
        "Addresses knowledge, skills, and values dimensions for the stated grade band.",
      ],
      segments: [
        {
          label: "Starter",
          purpose: "Activate prior knowledge and set the lesson intention.",
          steps: [
            "Share the lesson objective and success criteria using learner-friendly language.",
            "Use a think-pair-share to surface what learners already know about the topic.",
            "Collect quick responses with mini whiteboards or oral checks.",
          ],
          timing: "8 mins",
        },
        {
          label: "Explicit Instruction",
          purpose: "Introduce key concepts with modelling and questioning.",
          steps: [
            "Present a brief story or real-world scenario relevant to the Ghanaian context.",
            "Model how to approach the core task while verbalising key thinking steps.",
            "Check understanding with targeted questions aligned to Bloom’s levels.",
          ],
          timing: "12 mins",
        },
        {
          label: "Guided Practice",
          purpose: "Support learners to apply the concept collaboratively.",
          steps: [
            "Provide structured practice items in mixed-ability groups.",
            "Circulate to scaffold learners who require additional support.",
            "Invite groups to share solutions and justify their thinking.",
          ],
          timing: "10 mins",
        },
        {
          label: "Independent Practice",
          purpose: "Consolidate learning and gather assessment evidence.",
          steps: [
            "Learners complete 3–4 independent tasks that grow in complexity.",
            "Encourage use of success criteria as a checklist for quality work.",
            "Collect exit tickets to monitor individual mastery.",
          ],
          timing: "10 mins",
        },
        {
          label: "Reflection & Closure",
          purpose: "Reinforce key takeaways and preview the next lesson.",
          steps: [
            "Learners self-assess their progress using traffic-light cards.",
            "Discuss how the skill links to real-life applications within Ghana.",
            "Set a brief reflective question for home learning.",
          ],
          timing: "5 mins",
        },
      ],
      differentiation: [
        {
          audience: "Learners needing additional support",
          adaptations: [
            "Provide vocabulary cards with visuals and simplified explanations.",
            "Offer guided sentence starters and thinking routines.",
            "Pair with supportive peers during collaborative tasks.",
          ],
        },
        {
          audience: "High-attaining learners",
          adaptations: [
            "Include extension challenges that require deeper reasoning.",
            "Invite them to facilitate peer feedback sessions.",
            "Assign leadership roles during group tasks to stretch communication skills.",
          ],
        },
      ],
      materials: [
        "Curriculum-aligned handouts or digital slides.",
        "Manipulatives or visual aids relevant to the topic.",
        "Exit tickets or reflection sheets for assessment.",
      ],
      homework:
        "Assign a short consolidation task that reinforces the lesson’s success criteria and connects to the next topic.",
      assessment:
        "Use the exit tickets, guided questioning, and independent work samples to evaluate mastery against the learning objectives.",
    },
    quiz: {
      title: `${input.topic} Mastery Check`,
      format: "Combination of multiple choice, short response, and application questions.",
      questions: [
        {
          question: `What is one essential concept about ${input.topic} that learners should remember?`,
          options: [
            "A misconception related to the concept",
            "A partially correct idea",
            "The accurate definition or explanation",
            "An unrelated fact",
          ],
          answer: "The accurate definition or explanation",
          explanation:
            "Learners must identify the precise concept to demonstrate mastery.",
        },
        {
          question: `Explain how ${input.topic} appears in daily life within the Ghanaian context.`,
          options: [],
          answer:
            "Accept answers that reference authentic cultural, economic, or environmental connections.",
          explanation:
            "This open response checks the learner’s ability to transfer classroom ideas to real situations.",
        },
        {
          question: `Apply ${input.topic} to solve a short scenario-based problem.`,
          options: [],
          answer: "Solution should include key steps used during guided practice.",
          explanation:
            "Encourage learners to show their working and reference success criteria.",
        },
        {
          question: "List two strategies you can use to self-monitor during practice.",
          options: [],
          answer:
            "Learners should reference success criteria, peer feedback, or teacher prompts.",
          explanation:
            "Supports metacognition and aligns with competency-based assessment.",
        },
        {
          question:
            "Describe one way you can extend your understanding of this topic beyond the classroom.",
          options: [],
          answer:
            "Answers may include community projects, digital research, or cross-curricular applications.",
          explanation:
            "Checks learner agency and ability to connect learning to future goals.",
        },
      ],
    },
    studentNotes: {
      summary: `This lesson helps you understand ${input.topic} in the context of ${input.subject}. Expect to practise and apply skills through collaborative and independent activities.`,
      vocabulary: [
        {
          term: "Key Term 1",
          definition: "Provide the most essential definition linked to the topic.",
        },
        {
          term: "Key Term 2",
          definition: "Explain how this concept helps you solve real problems.",
        },
        {
          term: "Key Term 3",
          definition: "Clarify how the idea connects to prior knowledge.",
        },
      ],
      studyTips: [
        "Review the learning objectives and success criteria after class.",
        "Practise explaining the concept to a peer or family member using local examples.",
        "Create quick sketches, diagrams, or mnemonics to remember key ideas.",
      ],
      realWorldConnections: [
        "Identify where the concept appears in your community or local industry.",
        "Discuss with family how this knowledge supports national development goals.",
        "Observe media or news stories that highlight the importance of this topic.",
      ],
    },
    feedbackReport: {
      teacherSummary:
        "Learners engaged well with the lesson sequence and demonstrated growing confidence with guided practice tasks.",
      strengths: [
        "Active participation during think-pair-share routines.",
        "Collaborative problem solving with respectful dialogue.",
        "Improved accuracy in independent tasks compared to the diagnostic starter.",
      ],
      nextSteps: [
        "Revisit key vocabulary to deepen academic language use.",
        "Provide additional modelling for learners who require more scaffolding.",
        "Plan a follow-up project that applies the concept to community contexts.",
      ],
      parentNote:
        "Your child explored ${input.topic}. Encourage them to explain what they learned using examples from home or the community.",
    },
    teachingAids: input.includeAids
      ? [
          {
            title: `${input.topic} Concept Poster`,
            prompt: `Create a vibrant classroom poster illustrating the core idea of ${input.topic} for ${input.gradeLevel} students in Ghana. Include culturally relevant symbols and succinct explanations.`,
            usage:
              "Use during explicit instruction and display in the classroom for ongoing reference.",
          },
          {
            title: "Real-World Scenario Illustration",
            prompt: `Generate a comic-style illustration showing a Ghanaian student applying ${input.topic} in a practical setting.`,
            usage:
              "Incorporate into guided practice to spark discussion about real-life applications.",
          },
        ]
      : undefined,
    metadata: {
      generatedAt: now,
      model: "fallback-template-v1",
      tone: input.tone ?? "supportive and practical",
    },
  };
}

async function callGemini(
  payload: z.infer<typeof requestSchema>
): Promise<LessonPackage | null> {
  const apiKey =
    process.env.GOOGLE_API_KEY ??
    process.env.GEMINI_API_KEY ??
    process.env.GEMINI_PRO_API_KEY ??
    process.env.GOOGLE_AI_STUDIO_KEY;

  if (!apiKey) {
    return null;
  }

  const prompt = buildPrompt(payload);

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=" +
      apiKey,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          maxOutputTokens: 2048,
        },
      }),
    }
  );

  if (!response.ok) {
    console.error("Gemini API error", await response.text());
    return null;
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  const raw =
    data.candidates?.[0]?.content?.parts?.find((part) => !!part.text)?.text ??
    "";

  if (!raw) {
    return null;
  }

  try {
    const trimmed = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(trimmed) as LessonPackage;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = requestSchema.parse(json);

    const aiResult = await callGemini(parsed);
    const payload = aiResult ?? buildFallback(parsed);

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Generation error", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request payload", details: error.issues },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: "Unable to generate lesson package at this time." },
      { status: 500 }
    );
  }
}
