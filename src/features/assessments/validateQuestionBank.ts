import { lessons } from "@/features/learning/curriculum";

const difficulties = new Set(["Beginner", "Intermediate", "Advanced"]);

export interface QuestionBankValidation {
  valid: boolean;
  errors: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateQuestionBank(bank: unknown): QuestionBankValidation {
  const errors: string[] = [];
  if (!Array.isArray(bank)) {
    return { valid: false, errors: ["Question bank must be an array."] };
  }
  if (bank.length === 0) {
    errors.push("Question bank must contain at least one question.");
  }

  const knownLessons = new Set(lessons.map((lesson) => lesson.slug));
  const questionIds = new Set<string>();

  bank.forEach((value, index) => {
    const location = `Question ${index + 1}`;
    if (!isRecord(value)) {
      errors.push(`${location} must be an object.`);
      return;
    }

    const id = value.id;
    if (!hasText(id)) {
      errors.push(`${location} must have a non-empty ID.`);
    } else if (questionIds.has(id)) {
      errors.push(`${location} has duplicate ID "${id}".`);
    } else {
      questionIds.add(id);
    }

    if (!hasText(value.topicSlug) || !knownLessons.has(value.topicSlug)) {
      errors.push(`${location} has an invalid topic reference.`);
    }
    if (
      !hasText(value.difficulty) ||
      !difficulties.has(value.difficulty)
    ) {
      errors.push(`${location} has an invalid difficulty.`);
    }
    if (!hasText(value.prompt)) {
      errors.push(`${location} must have question text.`);
    }
    if (!hasText(value.explanation)) {
      errors.push(`${location} must have an explanation.`);
    }
    if (!hasText(value.learningObjective)) {
      errors.push(`${location} must have a learning objective.`);
    }
    if (!hasText(value.lessonSlug) || !knownLessons.has(value.lessonSlug)) {
      errors.push(`${location} has an invalid lesson reference.`);
    } else if (
      hasText(value.topicSlug) &&
      value.lessonSlug !== value.topicSlug
    ) {
      errors.push(`${location} topic and lesson references do not match.`);
    }
    if (
      value.scenarioContext !== undefined &&
      !hasText(value.scenarioContext)
    ) {
      errors.push(`${location} has an invalid scenario context.`);
    }

    if (!Array.isArray(value.options) || value.options.length !== 4) {
      errors.push(`${location} must have exactly four answer options.`);
      return;
    }

    const optionIds = new Set<string>();
    for (const option of value.options) {
      if (!isRecord(option) || !hasText(option.id) || !hasText(option.text)) {
        errors.push(`${location} has an invalid answer option.`);
        continue;
      }
      if (optionIds.has(option.id)) {
        errors.push(`${location} has duplicate option ID "${option.id}".`);
      }
      optionIds.add(option.id);
    }

    if (
      !hasText(value.correctOptionId) ||
      !optionIds.has(value.correctOptionId)
    ) {
      errors.push(`${location} refers to a missing correct answer.`);
    }
  });

  return { valid: errors.length === 0, errors };
}
