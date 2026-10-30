 import React, { useState, useMemo, useRef, useEffect } from "react";
import { useInterview } from "../hooks/useInterview";

const EMBEDDED_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg-base: #06080F;
  --bg-surface: #0B111E;
  --bg-surface-elevated: #111A2E;
  --bg-card: #0E1626;
  --bg-subtle: #080D18;
  --border-subtle: #19243B;
  --border-focus: #2E4166;
  --border-active: rgba(244,63,94,.45);
  --rose: #F43F5E;
  --rose-glow: rgba(244,63,94,.15);
  --emerald: #10B981;
  --emerald-glow: rgba(16,185,129,.15);
  --amber: #F59E0B;
  --amber-glow: rgba(245,158,11,.15);
  --sky: #38BDF8;
  --sky-glow: rgba(56,189,248,.12);
  --text-main: #F8FAFC;
  --text-muted: #94A3B8;
  --text-dim: #556987;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-full: 9999px;
}

body {
  background: var(--bg-base);
  color: var(--text-main);
  font-family: 'Plus Jakarta Sans', sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

button, input, [role="button"], [role="checkbox"] {
  font: inherit;
  cursor: pointer;
  pointer-events: auto;
}

button { border: none; outline: none; user-select: none; }
button:focus-visible, input:focus-visible, [role="button"]:focus-visible, [role="checkbox"]:focus-visible {
  outline: 2px solid var(--rose);
  outline-offset: 3px;
}

.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-base);
}

.navbar {
  min-height: 64px;
  background: rgba(11,17,30,.95);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 32px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.brand-section { display: flex; align-items: center; gap: 14px; }

.brand-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: linear-gradient(135deg,#E11D48,#F43F5E);
  display: grid; place-items: center; color: white;
  font-size: 16px; font-weight: 800;
  box-shadow: 0 0 20px rgba(244,63,94,.35);
  flex-shrink: 0;
}

.brand-title { font-size: 15px; font-weight: 800; display: flex; align-items: center; gap: 8px; }

.badge-tag {
  font: 10px/1 'JetBrains Mono',monospace;
  background: var(--rose-glow); color: var(--rose);
  border: 1px solid rgba(244,63,94,.3);
  padding: 4px 8px; border-radius: var(--radius-full); font-weight: 700;
}

.nav-target-pill {
  display: flex; align-items: center; gap: 10px;
  background: var(--bg-subtle); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full); padding: 6px 16px;
  font-size: 12px; max-width: 480px; min-width: 0;
}

.nav-target-pill span {
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #CBD5E1;
}

.btn-secondary {
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-subtle);
  color: var(--text-muted); padding: 8px 16px;
  border-radius: var(--radius-sm); font-size: 12px; font-weight: 700;
  display: inline-flex; align-items: center; justify-content: center;
  gap: 6px; transition: all .2s ease;
}

.btn-secondary:hover:not(:disabled) {
  color: #fff; border-color: var(--border-focus);
  background: #18243E; transform: translateY(-1px);
}

.btn-secondary:disabled { opacity: .45; cursor: not-allowed; }

.main-container {
  max-width: 1440px; width: 100%; margin: 0 auto;
  padding: 28px 32px 50px; display: flex;
  flex-direction: column; gap: 24px;
}

.stats-strip { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 16px; }

.stat-card {
  background: var(--bg-surface); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md); padding: 16px 20px;
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; position: relative; overflow: hidden; min-width: 0;
}

.stat-card::after { content: ""; position: absolute; top: 0; left: 0; width: 3px; height: 100%; }
.stat-card.rose::after { background: var(--rose); }
.stat-card.emerald::after { background: var(--emerald); }
.stat-card.sky::after { background: var(--sky); }
.stat-card.amber::after { background: var(--amber); }
.stat-info { min-width: 0; }
.stat-info .stat-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--text-dim); margin-bottom: 4px; }
.stat-info .stat-value { font-size: 22px; font-weight: 800; color: #fff; overflow-wrap: anywhere; }
.stat-info .stat-desc { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.stat-icon { width: 44px; height: 44px; border-radius: var(--radius-md); display: grid; place-items: center; font-size: 18px; flex-shrink: 0; }
.stat-card.rose .stat-icon { background: var(--rose-glow); color: var(--rose); }
.stat-card.emerald .stat-icon { background: var(--emerald-glow); color: var(--emerald); }
.stat-card.sky .stat-icon { background: var(--sky-glow); color: var(--sky); }
.stat-card.amber .stat-icon { background: var(--amber-glow); color: var(--amber); }

.navigation-bar {
  background: var(--bg-surface); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md); padding: 6px;
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; flex-wrap: wrap; position: relative; z-index: 20;
}

.nav-tabs { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }

.tab-btn {
  padding: 9px 18px; border-radius: var(--radius-sm);
  font-size: 13px; font-weight: 700; color: var(--text-muted);
  background: transparent; display: inline-flex; align-items: center;
  gap: 8px; transition: all .2s ease;
}

.tab-btn:hover { color: #fff; background: rgba(255,255,255,.05); }
.tab-btn.active { background: var(--bg-surface-elevated); color: #fff; border: 1px solid var(--border-focus); }
.tab-badge { font: 10px/1 'JetBrains Mono',monospace; padding: 3px 6px; border-radius: 4px; background: var(--bg-subtle); color: var(--text-dim); }
.tab-btn.active .tab-badge { background: var(--rose-glow); color: var(--rose); }

.search-input-wrap { position: relative; width: 260px; }
.search-box {
  width: 100%; background: var(--bg-subtle); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm); padding: 9px 14px 9px 34px;
  font-size: 12px; color: #fff; outline: none;
}
.search-box:focus { border-color: var(--rose); }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 12px; color: var(--text-dim); pointer-events: none; }

.content-grid { display: grid; grid-template-columns: minmax(0,1fr) 340px; gap: 24px; align-items: start; }
.workspace-column { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.workspace-actions-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 4px; }
.workspace-heading { font-size: 18px; font-weight: 800; color: #fff; }
.batch-controls { display: flex; gap: 8px; flex-wrap: wrap; }

.qa-card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); overflow: hidden; transition: all .2s ease; margin-bottom: 12px; }
.qa-card:hover { border-color: var(--border-focus); background: var(--bg-card); }
.qa-card.open { border-color: var(--border-active); background: var(--bg-card); }
.qa-header { padding: 18px 22px; display: flex; align-items: center; justify-content: space-between; gap: 16px; cursor: pointer; user-select: none; width: 100%; text-align: left; background: transparent; color: inherit; }
.qa-title-left { display: flex; align-items: flex-start; gap: 14px; flex: 1; min-width: 0; }
.qa-pill-number { padding: 4px 8px; border-radius: var(--radius-sm); background: var(--rose-glow); border: 1px solid rgba(244,63,94,.3); color: var(--rose); font: 11px/1 'JetBrains Mono',monospace; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
.qa-pill-number.behavioral { background: var(--amber-glow); border-color: rgba(245,158,11,.3); color: var(--amber); }
.qa-question-text { font-size: 14px; font-weight: 700; color: #F1F5F9; line-height: 1.5; overflow-wrap: anywhere; }
.qa-chevron { color: var(--text-dim); font-size: 11px; transition: transform .2s ease; }
.qa-card.open .qa-chevron { transform: rotate(180deg); color: var(--rose); }
.qa-body { padding: 0 22px 22px; display: flex; flex-direction: column; gap: 14px; }
.sub-box { background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 16px; min-width: 0; }
.sub-box-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 10px; }
.sub-box-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
.sub-box-title.intention { color: var(--rose); }
.sub-box-title.answer { color: var(--emerald); }
.sub-box-content { font-size: 13px; color: #CBD5E1; line-height: 1.8; white-space: pre-wrap; overflow-wrap: anywhere; }

.roadmap-banner { background: linear-gradient(135deg,#111A2E,#090E1A); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
.progress-track { width: 160px; height: 8px; background: #18243C; border-radius: var(--radius-full); overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg,#10B981,#34D399); transition: width .3s ease; }
.day-card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px; margin-bottom: 14px; }
.day-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding-bottom: 14px; margin-bottom: 14px; border-bottom: 1px solid var(--border-subtle); }
.day-tag { background: var(--rose-glow); color: var(--rose); border: 1px solid rgba(244,63,94,.3); font: 11px/1 'JetBrains Mono',monospace; font-weight: 800; padding: 5px 9px; border-radius: 6px; white-space: nowrap; }
.task-list { display: flex; flex-direction: column; gap: 8px; }
.task-row { display: flex; align-items: flex-start; gap: 12px; background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 12px 14px; cursor: pointer; user-select: none; }
.task-row:hover { background: #0E1628; border-color: var(--border-focus); }
.task-row.done { background: rgba(16,185,129,.04); border-color: rgba(16,185,129,.3); }
.task-check { width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid var(--text-dim); display: grid; place-items: center; margin-top: 2px; flex-shrink: 0; font-size: 10px; color: transparent; }
.task-row.done .task-check { background: var(--emerald); border-color: var(--emerald); color: #fff; }
.task-label { font-size: 13px; color: #E2E8F0; line-height: 1.6; overflow-wrap: anywhere; }
.task-row.done .task-label { text-decoration: line-through; color: var(--text-dim); }

.profile-card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 24px; margin-bottom: 16px; min-width: 0; }
.profile-card-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 14px; }
.profile-grid-2 { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 16px; margin-bottom: 0; }
.skill-tag { font: 11px/1.4 'JetBrains Mono',monospace; background: var(--bg-surface-elevated); color: #CBD5E1; padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-subtle); overflow-wrap: anywhere; }

.intelligence-rail { display: flex; flex-direction: column; gap: 20px; min-width: 0; }
.rail-box { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 22px; min-width: 0; }
.rail-title { font-size: 11px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.gauge-wrap { display: flex; flex-direction: column; align-items: center; text-align: center; }
.gauge-svg { transform: rotate(-90deg); width: 130px; height: 130px; }
.gauge-track { fill: none; stroke: #141E34; stroke-width: 9; }
.gauge-fill { fill: none; stroke: var(--emerald); stroke-width: 9; stroke-linecap: round; transition: stroke-dashoffset .6s ease; }
.gap-pill { background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-left: 3px solid var(--amber); border-radius: var(--radius-sm); padding: 12px 14px; display: flex; flex-direction: column; gap: 5px; margin-bottom: 10px; overflow-wrap: anywhere; }
.gap-pill.high { border-left-color: var(--rose); }
.gap-pill.medium { border-left-color: var(--amber); }
.gap-pill.low { border-left-color: var(--emerald); }

.empty-state { padding: 48px 24px; text-align: center; background: var(--bg-surface); border: 1px dashed var(--border-subtle); border-radius: var(--radius-md); }
.empty-state p { color: var(--text-muted); font-size: 13px; line-height: 1.8; }

@media (max-width: 1100px) {
  .stats-strip { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .content-grid { grid-template-columns: 1fr; }
  .intelligence-rail { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); align-items: start; }
}

@media (max-width: 680px) {
  .navbar { padding: 12px 16px; flex-wrap: wrap; }
  .nav-target-pill { display: none; }
  .main-container { padding: 20px 16px; }
  .stats-strip { grid-template-columns: 1fr; }
  .navigation-bar { flex-direction: column; align-items: stretch; }
  .nav-tabs { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); }
  .tab-btn { padding: 9px 10px; justify-content: center; }
  .search-input-wrap { width: 100%; }
  .profile-grid-2 { grid-template-columns: 1fr; }
  .intelligence-rail { grid-template-columns: 1fr; }
  .qa-header { padding: 16px; }
  .qa-body { padding: 0 16px 16px; }
  .profile-card { padding: 18px; }
  .roadmap-banner { padding: 18px; }
  .progress-track { width: 110px; }
  .brand-title { flex-wrap: wrap; }
}

@media print {
  body, .app-wrapper { background: white !important; color: black !important; }
  .navbar { position: static; background: white; color: black; }
  .navigation-bar, .batch-controls, .search-input-wrap, .btn-secondary { display: none !important; }
  .main-container { max-width: none; padding: 12px; }
  .content-grid { grid-template-columns: 1fr; }
  .stat-card, .qa-card, .profile-card, .rail-box, .day-card { break-inside: avoid; background: white !important; color: black !important; }
  .qa-card:not(.open) .qa-body { display: flex !important; }
}
`;

const asArray = (value) => (Array.isArray(value) ? value : []);

const firstValue = (...values) => {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }
  return "";
};

const firstArray = (...values) => {
  for (const value of values) {
    if (Array.isArray(value)) return value;
  }
  return [];
};

const asText = (value, fallback = "") => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim();
  }
  return fallback;
};

function cleanResumeValue(value) {
  return String(value || "")
    .replace(/^[\s•●▪*-]+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getResumeText(report) {
  const resume = firstValue(
    report?.resume,
    report?.resumeText,
    report?.candidate?.resume,
    report?.candidateProfile?.resume,
    report?.profile?.resume,
    report?.parsedResume?.text
  );

  if (typeof resume === "string") return resume;

  if (resume && typeof resume === "object") {
    return [
      resume.summary,
      resume.education,
      resume.skills,
      resume.experience,
      resume.projects,
      resume.certifications,
    ]
      .flat(Infinity)
      .filter(Boolean)
      .map((item) =>
        typeof item === "string" ? item : JSON.stringify(item)
      )
      .join("\n");
  }

  return "";
}

function extractSection(resumeText, headings) {
  if (!resumeText) return "";

  const escapedHeadings = headings.map((heading) =>
    heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );

  const headingPattern = escapedHeadings.join("|");

  const nextSectionPattern =
    "EDUCATION|EDUCATIONAL QUALIFICATIONS|ACADEMIC QUALIFICATIONS|" +
    "ACADEMIC BACKGROUND|SKILLS|TECHNICAL SKILLS|TECHNICAL STACK|" +
    "TECHNOLOGIES|CORE COMPETENCIES|KEY SKILLS|PROJECTS|" +
    "PERSONAL PROJECTS|ACADEMIC PROJECTS|PROJECT EXPERIENCE|" +
    "WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EXPERIENCE|" +
    "CERTIFICATIONS|ACHIEVEMENTS|CONTACT|LANGUAGES|INTERESTS";

  const regex = new RegExp(
    `(?:^|\\n)\\s*(?:${headingPattern})\\s*:?\\s*\\n([\\s\\S]*?)(?=\\n\\s*(?:${nextSectionPattern})\\s*:?\\s*(?:\\n|$)|$)`,
    "i"
  );

  return resumeText.match(regex)?.[1]?.trim() || "";
}

function normalizeQuestion(item, index, prefix) {
  if (typeof item === "string") {
    return {
      id: `${prefix}${index + 1}`,
      number: String(index + 1).padStart(2, "0"),
      question: item,
      intention: "",
      answer: "",
    };
  }

  if (!item || typeof item !== "object") return null;

  const question = firstValue(
    item.question,
    item.questionText,
    item.title,
    item.prompt
  );

  return {
    ...item,
    id: asText(firstValue(item.id, item._id), `${prefix}${index + 1}`),
    number: asText(item.number, String(index + 1).padStart(2, "0")),
    question: asText(question, "Question text not provided"),
    intention: asText(
      firstValue(
        item.intention,
        item.evaluationGoal,
        item.purpose,
        item.evaluationCriteria,
        item.objective
      )
    ),
    answer: asText(
      firstValue(
        item.answer,
        item.modelAnswer,
        item.sampleAnswer,
        item.recommendedAnswer,
        item.starStrategy,
        item.suggestedAnswer,
        item.expectedAnswer
      )
    ),
  };
}

function getQuestionList(report, keys, prefix) {
  const source = firstArray(...keys.map((key) => report?.[key]));

  return source
    .map((item, index) => normalizeQuestion(item, index, prefix))
    .filter(Boolean);
}

function normalizeSeverity(value) {
  const severity = String(value || "").toLowerCase();

  if (["high", "critical", "major"].includes(severity)) return "high";
  if (["low", "minor", "good"].includes(severity)) return "low";

  return "medium";
}

function getSkillGaps(report) {
  const source = firstArray(
    report?.skillGaps,
    report?.skillsGaps,
    report?.gapAnalysis,
    report?.gaps
  );

  return source
    .filter(Boolean)
    .map((gap, index) => {
      if (typeof gap === "string") {
        return {
          name: gap,
          severity: "medium",
          level: "Review",
          tech: "",
        };
      }

      const severity = normalizeSeverity(
        firstValue(gap?.severity, gap?.priority, gap?.level)
      );

      const skills = Array.isArray(gap?.skills)
        ? gap.skills.join(", ")
        : asText(gap?.skills);

      return {
        name: asText(
          firstValue(gap?.name, gap?.skill, skills, gap?.category),
          `Skill ${index + 1}`
        ),
        severity,
        level: asText(
          firstValue(gap?.severity, gap?.priority, gap?.level, severity)
        ),
        tech: asText(
          firstValue(
            gap?.description,
            gap?.recommendation,
            gap?.suggestion,
            gap?.details
          )
        ),
      };
    });
}

function getPreparationPlan(report) {
  const source = firstArray(
    report?.preparationPlan,
    report?.roadmap,
    report?.studyPlan,
    report?.sevenDayPlan
  );

  return source
    .map((day, index) => {
      if (!day || typeof day !== "object") return null;

      const rawTasks = firstArray(
        day.tasks,
        day.activities,
        day.topics
      );

      return {
        day: Number(firstValue(day.day, day.dayNumber)) || index + 1,
        focus: asText(
          firstValue(day.focus, day.title, day.topic),
          `Day ${index + 1}`
        ),
        tasks: rawTasks
          .map((task) =>
            typeof task === "string"
              ? task
              : asText(
                  firstValue(task?.task, task?.title, task?.description)
                )
          )
          .filter(Boolean),
      };
    })
    .filter(Boolean);
}

function extractResumeSkills(resumeText) {
  const section = extractSection(resumeText, [
    "Technical Skills",
    "Skills",
    "Technical Stack",
    "Technologies",
    "Core Competencies",
    "Key Skills",
  ]);

  if (!section) return [];

  return [
    ...new Set(
      section
        .split(/[,;|\n•●▪]+/)
        .map(cleanResumeValue)
        .filter((skill) => skill && skill.length < 100)
    ),
  ];
}

function normalizeSkills(report, candidate, resumeText) {
  const raw = firstValue(
    candidate?.skills,
    candidate?.technicalSkills,
    report?.skills,
    report?.technicalSkills,
    report?.resumeSkills,
    report?.parsedResume?.skills
  );

  let skills = [];

  if (Array.isArray(raw)) {
    skills = raw
      .map((item) =>
        typeof item === "string"
          ? cleanResumeValue(item)
          : cleanResumeValue(
              firstValue(item?.name, item?.skill, item?.title)
            )
      )
      .filter(Boolean);
  } else if (typeof raw === "string") {
    skills = raw
      .split(/[,;|\n]+/)
      .map(cleanResumeValue)
      .filter(Boolean);
  }

  if (!skills.length) {
    skills = extractResumeSkills(resumeText);
  }

  return [...new Set(skills)];
}

function extractResumeProjects(resumeText) {
  const section = extractSection(resumeText, [
    "Projects",
    "Personal Projects",
    "Academic Projects",
    "Project Experience",
    "Key Projects",
  ]);

  if (!section) return [];

  const lines = section
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const projects = [];
  let currentProject = null;

  const saveCurrentProject = () => {
    if (
      currentProject &&
      (currentProject.title || currentProject.description)
    ) {
      projects.push({
        ...currentProject,
        title:
          currentProject.title || `Project ${projects.length + 1}`,
      });
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/^[•●▪*-]\s*/, "").trim();
    if (!line) continue;

    const techMatch = line.match(
      /^(?:technologies|tech stack|tools used|technology)\s*:\s*(.+)$/i
    );

    if (techMatch && currentProject) {
      currentProject.tech = techMatch[1].trim();
      continue;
    }

    const titleAndDescription = line.match(
      /^(.{2,90}?)\s*[|–—]\s*(.{10,})$/
    );

    const isLikelyTitle =
      !/^(description|technologies|tech stack|tools used)\s*:/i.test(line) &&
      line.length < 100 &&
      !/[.!?]$/.test(line);

    if (titleAndDescription) {
      saveCurrentProject();

      currentProject = {
        id: `resume-project-${projects.length}`,
        title: titleAndDescription[1].trim(),
        description: titleAndDescription[2].trim(),
        tech: "",
      };

      continue;
    }

    if (isLikelyTitle) {
      saveCurrentProject();

      currentProject = {
        id: `resume-project-${projects.length}`,
        title: line,
        description: "",
        tech: "",
      };

      continue;
    }

    if (!currentProject) {
      currentProject = {
        id: `resume-project-${projects.length}`,
        title: "",
        description: line,
        tech: "",
      };
    } else {
      currentProject.description = [
        currentProject.description,
        line,
      ]
        .filter(Boolean)
        .join(" ");
    }
  }

  saveCurrentProject();

  return projects;
}

function normalizeProjects(report, candidate, resumeText) {
  const raw = firstArray(
    candidate?.projects,
    report?.projects,
    report?.featuredProjects,
    report?.resumeProjects,
    report?.parsedResume?.projects
  );

  if (raw.length) {
    return raw
      .map((project, index) => {
        if (typeof project === "string") {
          return {
            id: `project-${index}`,
            title: project,
            description: "",
            tech: "",
          };
        }

        const technologies = firstValue(
          project?.technologies,
          project?.techStack,
          project?.tech,
          project?.stack
        );

        return {
          id: asText(
            firstValue(project?.id, project?._id),
            `project-${index}`
          ),
          title: asText(
            firstValue(
              project?.title,
              project?.name,
              project?.projectName
            )
          ),
          description: asText(
            firstValue(
              project?.description,
              project?.summary,
              project?.details
            )
          ),
          tech: Array.isArray(technologies)
            ? technologies.join(" · ")
            : asText(technologies),
        };
      })
      .filter((project) => project.title || project.description);
  }

  return extractResumeProjects(resumeText);
}

function extractResumeEducation(resumeText) {
  const educationSection = extractSection(resumeText, [
    "Education",
    "Educational Qualifications",
    "Academic Qualifications",
    "Academic Background",
  ]);

  const text = educationSection || resumeText;
  const lines = text
    .split(/\n/)
    .map(cleanResumeValue)
    .filter(Boolean);

  const degreeLine =
    lines.find((line) =>
      /\b(B\.?\s?Tech|B\.?\s?E\.?|B\.?\s?Sc|M\.?\s?Tech|M\.?\s?Sc|Bachelor|Master|Diploma|Higher Secondary|Class\s*XII|Class\s*X)\b/i.test(
        line
      )
    ) || "";

  const collegeLine =
    lines.find((line) =>
      /\b(university|institute|college|vidyapith|school)\b/i.test(line)
    ) || "";

  const cgpaMatch = text.match(
    /\b(?:CGPA|GPA)\s*[:\-]?\s*(\d+(?:\.\d+)?(?:\s*\/\s*\d+(?:\.\d+)?)?)/i
  );

  const percentageMatch = text.match(
    /\b(\d{1,3}(?:\.\d+)?)\s*%/
  );

  const graduationMatch = text.match(
    /\b(?:graduation(?: year)?|passing year|expected graduation)\s*[:\-]?\s*(20\d{2})\b/i
  );

  return {
    degree: degreeLine,
    college: collegeLine,
    cgpa: cgpaMatch?.[1] || percentageMatch?.[0] || "",
    gradYear: graduationMatch?.[1] || "",
  };
}

export default function Interview() {
  const { report } = useInterview();

  const [activeTab, setActiveTab] = useState("technical");
  const [openAccordion, setOpenAccordion] = useState({});
  const [completedTasks, setCompletedTasks] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [copyStatus, setCopyStatus] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const [notice, setNotice] = useState("");

  const speechRef = useRef(null);
  const noticeTimerRef = useRef(null);
  const copyTimerRef = useRef(null);

  const DATA = useMemo(() => {
    // Supports direct reports and common API response wrappers.
    const currentReport =
      report?.report ??
      report?.data?.report ??
      report?.data ??
      report ??
      {};

    const candidate =
      currentReport.candidate ||
      currentReport.candidateProfile ||
      currentReport.profile ||
      currentReport.parsedResume ||
      {};

    const resumeText = getResumeText(currentReport);
    const resumeEducation = extractResumeEducation(resumeText);

    const rawScoreValue = firstValue(
      currentReport.matchScore,
      currentReport.matchPercentage,
      currentReport.atsScore,
      currentReport.score
    );

    const parsedScore =
      rawScoreValue !== "" ? Number(rawScoreValue) : NaN;

    const matchScore = Number.isFinite(parsedScore)
      ? Math.max(0, Math.min(100, parsedScore))
      : null;

    const technicalQuestions = getQuestionList(
      currentReport,
      [
        "technicalQuestions",
        "technical",
        "technicalQA",
        "technicalQuestionAnswers",
      ],
      "Q"
    );

    const behavioralQuestions = getQuestionList(
      currentReport,
      [
        "behavioralQuestions",
        "behavioral",
        "behavioralQA",
        "hrQuestions",
      ],
      "B"
    );

    const preparationPlan = getPreparationPlan(currentReport);
    const skillGaps = getSkillGaps(currentReport);

    const candidateName = firstValue(
      candidate.name,
      candidate.fullName,
      currentReport.candidateName,
      currentReport.name
    );

    const emailMatch = resumeText.match(
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i
    );

    const phoneMatch = resumeText.match(
      /(?:\+?\d{1,3}[-.\s]?)?(?:\d[-.\s]?){9,12}\d/
    );

    const jobTitle = asText(
      firstValue(
        currentReport.jobTitle,
        currentReport.targetRole,
        currentReport.position,
        candidate.targetRole
      )
    );

    const jobDescription = asText(
      firstValue(
        currentReport.jobDescription,
        currentReport.jobTitle,
        currentReport.targetRole,
        currentReport.position
      )
    );

    return {
      hasReport: Boolean(
        currentReport &&
        typeof currentReport === "object" &&
        Object.keys(currentReport).length
      ),

      reportId: asText(
        firstValue(currentReport._id, currentReport.id)
      ),

      jobDescription,
      jobTitle,
      technicalQuestions,
      behavioralQuestions,
      preparationPlan,
      skillGaps,
      matchScore,

      matchVerdict:
        matchScore === null
          ? "Score not available"
          : matchScore >= 80
          ? "Strong Candidate Match"
          : matchScore >= 60
          ? "Viable Potential"
          : "Skill Alignment Needed",

      candidate: {
        name: asText(candidateName),

        degree: asText(
          firstValue(
            candidate.degree,
            candidate.education,
            currentReport.degree,
            resumeEducation.degree
          )
        ),

        college: asText(
          firstValue(
            candidate.college,
            candidate.institution,
            candidate.university,
            currentReport.college,
            resumeEducation.college
          )
        ),

        cgpa: asText(
          firstValue(
            candidate.cgpa,
            candidate.CGPA,
            candidate.gpa,
            currentReport.cgpa,
            currentReport.GPA,
            resumeEducation.cgpa
          )
        ),

        gradYear: asText(
          firstValue(
            candidate.gradYear,
            candidate.graduationYear,
            candidate.year,
            currentReport.graduationYear,
            currentReport.gradYear,
            resumeEducation.gradYear
          )
        ),

        selfDescription: asText(
          firstValue(
            currentReport.candidateSummary,
            currentReport.selfDescription,
            candidate.selfDescription,
            candidate.summary,
            candidate.profileSummary
          )
        ),

        email: asText(
          firstValue(
            candidate.email,
            currentReport.email,
            emailMatch?.[0]
          )
        ),

        phone: asText(
          firstValue(
            candidate.phone,
            candidate.mobile,
            candidate.phoneNumber,
            currentReport.phone,
            phoneMatch?.[0]
          )
        ),

        location: asText(
          firstValue(
            candidate.location,
            candidate.address,
            currentReport.location
          )
        ),

        skills: normalizeSkills(
          currentReport,
          candidate,
          resumeText
        ),

        projects: normalizeProjects(
          currentReport,
          candidate,
          resumeText
        ),
      },
    };
  }, [report]);

  useEffect(() => {
    return () => {
      if (
        typeof window !== "undefined" &&
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
      }

      if (noticeTimerRef.current) {
        window.clearTimeout(noticeTimerRef.current);
      }

      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const showNotice = (message) => {
    setNotice(message);

    if (noticeTimerRef.current) {
      window.clearTimeout(noticeTimerRef.current);
    }

    noticeTimerRef.current = window.setTimeout(
      () => setNotice(""),
      2400
    );
  };

  const toggleAccordion = (id) => {
    setOpenAccordion((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  const setAllAccordions = (expand) => {
    const list =
      activeTab === "technical"
        ? DATA.technicalQuestions
        : DATA.behavioralQuestions;

    setOpenAccordion((previous) => {
      const next = { ...previous };

      list.forEach((question) => {
        next[question.id] = expand;
      });

      return next;
    });
  };

  const handleCopy = async (event, text, id) => {
    event.stopPropagation();

    if (!text) {
      showNotice("No answer text available.");
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);
        textarea.select();

        const copied = document.execCommand("copy");
        textarea.remove();

        if (!copied) throw new Error("Copy command failed");
      }

      setCopyStatus(id);
      showNotice("Answer copied to clipboard.");

      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }

      copyTimerRef.current = window.setTimeout(
        () => setCopyStatus(null),
        1800
      );
    } catch {
      showNotice("Unable to copy. Please copy the text manually.");
    }
  };

  const handleSpeak = (event, text, id) => {
    event.stopPropagation();

    if (!("speechSynthesis" in window)) {
      showNotice("Text-to-speech is not supported in this browser.");
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      speechRef.current = null;
      setSpeakingId(null);
      return;
    }

    if (!text) {
      showNotice("No answer text available.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;

    utterance.onend = () => {
      speechRef.current = null;
      setSpeakingId(null);
    };

    utterance.onerror = () => {
      speechRef.current = null;
      setSpeakingId(null);
    };

    speechRef.current = utterance;
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const taskKeyFor = (day, index) =>
    `${DATA.reportId || "current-report"}_d${day}_t${index}`;

  const toggleTask = (taskKey) => {
    setCompletedTasks((previous) => ({
      ...previous,
      [taskKey]: !previous[taskKey],
    }));
  };

  const totalTasks = useMemo(
    () =>
      DATA.preparationPlan.reduce(
        (sum, day) => sum + day.tasks.length,
        0
      ),
    [DATA.preparationPlan]
  );

  const completedCount = useMemo(
    () =>
      DATA.preparationPlan.reduce(
        (sum, day) =>
          sum +
          day.tasks.filter((_, index) =>
            Boolean(completedTasks[taskKeyFor(day.day, index)])
          ).length,
        0
      ),
    [DATA.preparationPlan, completedTasks, DATA.reportId]
  );

  const progressPercent =
    totalTasks > 0
      ? Math.round((completedCount / totalTasks) * 100)
      : 0;

  const filterQuestions = (questions) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return questions;

    return questions.filter((item) =>
      [item.question, item.answer, item.intention].some((value) =>
        String(value || "").toLowerCase().includes(query)
      )
    );
  };

  const filteredTechnical = useMemo(
    () => filterQuestions(DATA.technicalQuestions),
    [DATA.technicalQuestions, searchQuery]
  );

  const filteredBehavioral = useMemo(
    () => filterQuestions(DATA.behavioralQuestions),
    [DATA.behavioralQuestions, searchQuery]
  );

  const renderQuestionList = (questions, type) => {
    if (!questions.length) {
      return (
        <div className="empty-state">
          <p>
            {searchQuery
              ? "No questions match your search."
              : type === "technical"
              ? "No technical questions were provided in this report."
              : "No behavioral questions were provided in this report."}
          </p>
        </div>
      );
    }

    return questions.map((item) => {
      const isOpen = Boolean(openAccordion[item.id]);
      const isSpeaking = speakingId === item.id;
      const isCopied = copyStatus === item.id;
      const isBehavioral = type === "behavioral";

      return (
        <article
          key={`${type}-${item.id}`}
          className={`qa-card ${isOpen ? "open" : ""}`}
        >
          <button
            type="button"
            className="qa-header"
            aria-expanded={isOpen}
            onClick={() => toggleAccordion(item.id)}
          >
            <span className="qa-title-left">
              <span
                className={`qa-pill-number ${
                  isBehavioral ? "behavioral" : ""
                }`}
              >
                {item.number}
              </span>

              <span className="qa-question-text">
                {item.question}
              </span>
            </span>

            <span className="qa-chevron">▼</span>
          </button>

          {isOpen && (
            <div className="qa-body">
              <div className="sub-box">
                <div className="sub-box-head">
                  <span
                    className="sub-box-title intention"
                    style={
                      isBehavioral
                        ? { color: "var(--amber)" }
                        : undefined
                    }
                  >
                    {isBehavioral
                      ? "🎯 Interpersonal Competency Goal"
                      : "🎯 Evaluation Objective"}
                  </span>
                </div>

                <div className="sub-box-content">
                  {item.intention ||
                    "Evaluation objective was not provided in the report."}
                </div>
              </div>

              <div className="sub-box">
                <div className="sub-box-head">
                  <span className="sub-box-title answer">
                    {isBehavioral
                      ? "💡 STAR Strategy Answer"
                      : "💡 Recommended Model Answer"}
                  </span>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      disabled={!item.answer}
                      onClick={(event) =>
                        handleSpeak(
                          event,
                          `${item.question}. ${item.answer}`,
                          item.id
                        )
                      }
                    >
                      {isSpeaking ? "⏹ Stop" : "🔊 Listen"}
                    </button>

                    <button
                      type="button"
                      className="btn-secondary"
                      disabled={!item.answer}
                      onClick={(event) =>
                        handleCopy(event, item.answer, item.id)
                      }
                    >
                      {isCopied ? "✓ Copied" : "📋 Copy"}
                    </button>
                  </div>
                </div>

                <div className="sub-box-content">
                  {item.answer ||
                    "A model answer was not provided in the report."}
                </div>
              </div>
            </div>
          )}
        </article>
      );
    });
  };

  return (
    <div className="app-wrapper">
      <style>{EMBEDDED_STYLES}</style>

      {/* TOP HEADER */}
      <header className="navbar">
        <div className="brand-section">
          <div className="brand-icon">✦</div>

          <div className="brand-title">
            <span>InterviewPilot</span>
            <span className="badge-tag">ENGINEERING</span>
          </div>
        </div>

        <div className="nav-target-pill">
          <span style={{ color: "var(--emerald)" }}>●</span>

          <strong style={{ color: "#fff", fontSize: 11 }}>
            Target Role:
          </strong>

          <span>
            {DATA.jobDescription || "Position not specified"}
          </span>
        </div>

        <button
          type="button"
          className="btn-secondary"
          onClick={() => window.print()}
        >
          <span>Export Report</span>
          <span>↗</span>
        </button>
      </header>

      {/* DASHBOARD */}
      <main className="main-container">
        {/* KPI OVERVIEW */}
        <section className="stats-strip">
          <div className="stat-card emerald">
            <div className="stat-info">
              <div className="stat-label">Resume Match</div>

              <div className="stat-value">
                {DATA.matchScore !== null
                  ? `${DATA.matchScore}%`
                  : "—"}
              </div>

              <div className="stat-desc">
                {DATA.matchVerdict}
              </div>
            </div>

            <div className="stat-icon">🎯</div>
          </div>

          <div className="stat-card rose">
            <div className="stat-info">
              <div className="stat-label">Technical QA</div>
              <div className="stat-value">
                {DATA.technicalQuestions.length}
              </div>
              <div className="stat-desc">Questions Available</div>
            </div>

            <div className="stat-icon">💻</div>
          </div>

          <div className="stat-card amber">
            <div className="stat-info">
              <div className="stat-label">Behavioral QA</div>
              <div className="stat-value">
                {DATA.behavioralQuestions.length}
              </div>
              <div className="stat-desc">Behavioral Questions</div>
            </div>

            <div className="stat-icon">💬</div>
          </div>

          <div className="stat-card sky">
            <div className="stat-info">
              <div className="stat-label">Roadmap Progress</div>
              <div className="stat-value">{progressPercent}%</div>
              <div className="stat-desc">
                {completedCount} of {totalTasks} Tasks
              </div>
            </div>

            <div className="stat-icon">🧭</div>
          </div>
        </section>

        {/* NAVIGATION */}
        <nav className="navigation-bar">
          <div className="nav-tabs">
            <button
              type="button"
              onClick={() => {
                setActiveTab("technical");
                setSearchQuery("");
              }}
              className={`tab-btn ${
                activeTab === "technical" ? "active" : ""
              }`}
            >
              <span>Technical QA</span>
              <span className="tab-badge">
                {DATA.technicalQuestions.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("behavioral");
                setSearchQuery("");
              }}
              className={`tab-btn ${
                activeTab === "behavioral" ? "active" : ""
              }`}
            >
              <span>Behavioral QA</span>
              <span className="tab-badge">
                {DATA.behavioralQuestions.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("roadmap");
                setSearchQuery("");
              }}
              className={`tab-btn ${
                activeTab === "roadmap" ? "active" : ""
              }`}
            >
              <span>Preparation Sprint</span>
              <span className="tab-badge">
                {DATA.preparationPlan.length}d
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("profile");
                setSearchQuery("");
              }}
              className={`tab-btn ${
                activeTab === "profile" ? "active" : ""
              }`}
            >
              <span>Candidate Profile</span>
              <span className="tab-badge">Profile</span>
            </button>
          </div>

          {(activeTab === "technical" ||
            activeTab === "behavioral") && (
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>

              <input
                type="search"
                className="search-box"
                placeholder="Search questions or answers..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
              />
            </div>
          )}
        </nav>

        {/* MAIN CONTENT GRID */}
        <div className="content-grid">
          <div className="workspace-column">
            {(activeTab === "technical" ||
              activeTab === "behavioral") && (
              <div className="workspace-actions-row">
                <h2 className="workspace-heading">
                  {activeTab === "technical"
                    ? "Technical Competencies"
                    : "Behavioral Scenarios"}
                </h2>

                <div className="batch-controls">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setAllAccordions(true)}
                  >
                    Expand All
                  </button>

                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setAllAccordions(false)}
                  >
                    Collapse All
                  </button>
                </div>
              </div>
            )}

            {/* TECHNICAL QUESTIONS */}
            {activeTab === "technical" &&
              renderQuestionList(filteredTechnical, "technical")}

            {/* BEHAVIORAL QUESTIONS */}
            {activeTab === "behavioral" &&
              renderQuestionList(filteredBehavioral, "behavioral")}

            {/* ROADMAP */}
            {activeTab === "roadmap" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <div className="roadmap-banner">
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800 }}>
                      Preparation Sprint
                    </h3>

                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                        marginTop: 4,
                      }}
                    >
                      Track the preparation tasks provided in your report.
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <span
                      style={{
                        font: "13px 'JetBrains Mono', monospace",
                        fontWeight: 800,
                        color: "var(--emerald)",
                      }}
                    >
                      {progressPercent}%
                    </span>
                  </div>
                </div>

                {!DATA.preparationPlan.length ? (
                  <div className="empty-state">
                    <p>
                      No preparation schedule was provided in this report.
                    </p>
                  </div>
                ) : (
                  DATA.preparationPlan.map((dayPlan, dayIndex) => {
                    const dayCompleted = dayPlan.tasks.filter(
                      (_, index) =>
                        Boolean(
                          completedTasks[
                            taskKeyFor(dayPlan.day, index)
                          ]
                        )
                    ).length;

                    return (
                      <div
                        key={`${dayPlan.day}-${dayIndex}`}
                        className="day-card"
                      >
                        <div className="day-header">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              flexWrap: "wrap",
                            }}
                          >
                            <span className="day-tag">
                              Day {dayPlan.day}
                            </span>

                            <strong
                              style={{
                                fontSize: 14,
                                color: "#fff",
                              }}
                            >
                              {dayPlan.focus}
                            </strong>
                          </div>

                          <span
                            style={{
                              fontSize: 11,
                              color: "var(--text-dim)",
                              fontFamily: "JetBrains Mono, monospace",
                            }}
                          >
                            {dayCompleted}/{dayPlan.tasks.length} Completed
                          </span>
                        </div>

                        {!dayPlan.tasks.length ? (
                          <p
                            style={{
                              color: "var(--text-muted)",
                              fontSize: 12,
                            }}
                          >
                            No tasks were listed for this day.
                          </p>
                        ) : (
                          <div className="task-list">
                            {dayPlan.tasks.map((task, index) => {
                              const taskKey = taskKeyFor(
                                dayPlan.day,
                                index
                              );

                              const isDone = Boolean(
                                completedTasks[taskKey]
                              );

                              return (
                                <div
                                  key={taskKey}
                                  className={`task-row ${
                                    isDone ? "done" : ""
                                  }`}
                                  role="checkbox"
                                  aria-checked={isDone}
                                  tabIndex={0}
                                  onClick={() => toggleTask(taskKey)}
                                  onKeyDown={(event) => {
                                    if (
                                      event.key === "Enter" ||
                                      event.key === " "
                                    ) {
                                      event.preventDefault();
                                      toggleTask(taskKey);
                                    }
                                  }}
                                >
                                  <div className="task-check">✓</div>
                                  <span className="task-label">
                                    {task}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* CANDIDATE PROFILE */}
            {activeTab === "profile" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <div className="profile-card">
                  <div
                    className="profile-card-title"
                    style={{ color: "var(--rose)" }}
                  >
                    Candidate Summary
                  </div>

                  <p
                    style={{
                      fontSize: 13,
                      color: "#CBD5E1",
                      lineHeight: 1.8,
                    }}
                  >
                    {DATA.candidate.selfDescription ||
                      "No candidate summary was provided in the report."}
                  </p>
                </div>

                <div className="profile-grid-2">
                  {/* EDUCATION */}
                  <div className="profile-card">
                    <div
                      className="profile-card-title"
                      style={{ color: "var(--sky)" }}
                    >
                      Education & Academics
                    </div>

                    {!DATA.candidate.degree &&
                    !DATA.candidate.college &&
                    !DATA.candidate.cgpa &&
                    !DATA.candidate.gradYear ? (
                      <p
                        style={{
                          color: "var(--text-muted)",
                          fontSize: 12,
                        }}
                      >
                        Education details were not found in the uploaded
                        resume.
                      </p>
                    ) : (
                      <>
                        {DATA.candidate.degree && (
                          <div
                            style={{
                              fontWeight: 700,
                              color: "#fff",
                              fontSize: 14,
                              lineHeight: 1.7,
                            }}
                          >
                            {DATA.candidate.degree}
                          </div>
                        )}

                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--text-muted)",
                            marginTop: 8,
                            lineHeight: 1.8,
                          }}
                        >
                          {DATA.candidate.college && (
                            <div>{DATA.candidate.college}</div>
                          )}

                          {DATA.candidate.cgpa && (
                            <div>
                              CGPA / Percentage: {DATA.candidate.cgpa}
                            </div>
                          )}

                          {DATA.candidate.gradYear && (
                            <div>
                              Graduation Year: {DATA.candidate.gradYear}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* CONTACT */}
                  <div className="profile-card">
                    <div
                      className="profile-card-title"
                      style={{ color: "var(--emerald)" }}
                    >
                      Contact Channels
                    </div>

                    {!DATA.candidate.email &&
                    !DATA.candidate.phone &&
                    !DATA.candidate.location ? (
                      <p
                        style={{
                          color: "var(--text-muted)",
                          fontSize: 12,
                        }}
                      >
                        Contact information was not found in the uploaded
                        resume.
                      </p>
                    ) : (
                      <div
                        style={{
                          fontSize: 13,
                          color: "#fff",
                          fontWeight: 600,
                          lineHeight: 1.9,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {DATA.candidate.email && (
                          <div>{DATA.candidate.email}</div>
                        )}

                        {DATA.candidate.phone && (
                          <div>{DATA.candidate.phone}</div>
                        )}

                        {DATA.candidate.location && (
                          <div
                            style={{
                              fontSize: 12,
                              color: "var(--text-muted)",
                            }}
                          >
                            {DATA.candidate.location}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* SKILLS */}
                <div className="profile-card">
                  <div
                    className="profile-card-title"
                    style={{ color: "var(--rose)" }}
                  >
                    Technical Skills
                  </div>

                  {DATA.candidate.skills.length ? (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      {DATA.candidate.skills.map((skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="skill-tag"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p
                      style={{
                        color: "var(--text-muted)",
                        fontSize: 12,
                      }}
                    >
                      No skills section was found in the uploaded resume.
                    </p>
                  )}
                </div>

                {/* PROJECTS */}
                <div className="profile-card">
                  <div
                    className="profile-card-title"
                    style={{ color: "var(--amber)" }}
                  >
                    Portfolio Implementations
                  </div>

                  {DATA.candidate.projects.length ? (
                    DATA.candidate.projects.map((project, index) => (
                      <div
                        key={`${project.id}-${index}`}
                        style={{
                          background: "var(--bg-subtle)",
                          padding: 16,
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-subtle)",
                          marginBottom: 10,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 12,
                            flexWrap: "wrap",
                            marginBottom: 6,
                          }}
                        >
                          <strong
                            style={{ fontSize: 14, color: "#fff" }}
                          >
                            {project.title}
                          </strong>

                          {project.tech && (
                            <span
                              style={{
                                fontSize: 10,
                                color: "var(--sky)",
                                fontFamily: "JetBrains Mono, monospace",
                                overflowWrap: "anywhere",
                              }}
                            >
                              {project.tech}
                            </span>
                          )}
                        </div>

                        {project.description && (
                          <p
                            style={{
                              fontSize: 12,
                              color: "var(--text-muted)",
                              lineHeight: 1.7,
                            }}
                          >
                            {project.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p
                      style={{
                        color: "var(--text-muted)",
                        fontSize: 12,
                      }}
                    >
                      No projects section was found in the uploaded resume.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT INTELLIGENCE RAIL */}
          <aside className="intelligence-rail">
            {/* ATS SCORE */}
            <div className="rail-box">
              <div className="rail-title">
                <span>ATS Resume Match</span>
                <span style={{ color: "var(--emerald)" }}>
                  {DATA.matchScore === null ? "N/A" : "READY"}
                </span>
              </div>

              <div className="gauge-wrap">
                <div
                  style={{
                    position: "relative",
                    width: 130,
                    height: 130,
                    margin: "0 auto 12px",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <svg className="gauge-svg" viewBox="0 0 100 100">
                    <circle
                      className="gauge-track"
                      cx="50"
                      cy="50"
                      r="44"
                    />

                    <circle
                      className="gauge-fill"
                      cx="50"
                      cy="50"
                      r="44"
                      strokeDasharray={2 * Math.PI * 44}
                      strokeDashoffset={
                        2 *
                        Math.PI *
                        44 *
                        (1 - (DATA.matchScore ?? 0) / 100)
                      }
                    />
                  </svg>

                  <div
                    style={{
                      position: "absolute",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 32,
                        fontWeight: 800,
                        color: "#fff",
                        lineHeight: 1,
                      }}
                    >
                      {DATA.matchScore ?? "—"}
                    </div>

                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--emerald)",
                        fontWeight: 700,
                        marginTop: 4,
                      }}
                    >
                      {DATA.matchScore === null ? "NO SCORE" : "PERCENT"}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--emerald)",
                  }}
                >
                  {DATA.matchVerdict}
                </div>
              </div>
            </div>

            {/* SKILL GAPS */}
            <div className="rail-box">
              <div className="rail-title">
                <span>Identified Skill Gaps</span>
                <span>{DATA.skillGaps.length}</span>
              </div>

              {!DATA.skillGaps.length ? (
                <p
                  style={{
                    color: "var(--text-dim)",
                    fontSize: 12,
                    lineHeight: 1.8,
                  }}
                >
                  No skill gap data was provided in this report.
                </p>
              ) : (
                DATA.skillGaps.map((gap, index) => (
                  <div
                    key={`${gap.name}-${index}`}
                    className={`gap-pill ${gap.severity}`}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#fff",
                        }}
                      >
                        {gap.name}
                      </span>

                      <span
                        style={{
                          font: "9px 'JetBrains Mono', monospace",
                          textTransform: "uppercase",
                          color: "var(--text-dim)",
                        }}
                      >
                        {gap.level}
                      </span>
                    </div>

                    {gap.tech && (
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--text-muted)",
                          lineHeight: 1.5,
                        }}
                      >
                        {gap.tech}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* TARGET ROLE */}
            <div className="rail-box">
              <div className="rail-title">Position Context</div>

              <strong
                style={{
                  fontSize: 13,
                  color: "#fff",
                  display: "block",
                  marginBottom: 6,
                  overflowWrap: "anywhere",
                }}
              >
                {DATA.jobTitle || "Target role not specified"}
              </strong>

              {DATA.jobDescription &&
                DATA.jobDescription !== DATA.jobTitle && (
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      lineHeight: 1.7,
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                      marginBottom: 10,
                    }}
                  >
                    {DATA.jobDescription}
                  </p>
                )}

              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                }}
              >
                This section displays the target position supplied with the
                interview report.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* TOAST NOTICE */}
      {notice && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(17,26,46,.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid var(--border-focus)",
            borderRadius: "var(--radius-sm)",
            padding: "10px 20px",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            boxShadow: "0 10px 30px rgba(0,0,0,.5)",
            zIndex: 9999,
            maxWidth: "90vw",
            textAlign: "center",
          }}
        >
          {notice}
        </div>
      )}
    </div>
  );
}