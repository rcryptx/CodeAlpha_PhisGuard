# Assessments

The assessment feature uses a local, typed question bank based on the 12
Learning Centre lessons. It contains two original questions per lesson and
supports a full assessment or a lesson-specific assessment.

## Scoring

`scoring.ts` derives outcomes from each selected option ID and the question
bank. Unknown question IDs are ignored; missing or invalid option IDs are
unanswered. Unanswered questions are never correct. The percentage is
`round(correct / total * 100)`; an empty assessment has no percentage and does
not pass. The shared passing threshold is 70%. Results also contain topic and
difficulty counts, plus per-question review details.

Answers stay in component state. Each submitted attempt is stored only for the
current page session; retrying starts a new answer map and does not mutate prior
result snapshots. No answers are sent to a service or persisted across reloads.

## Question data

Add questions in `questions.ts` with a stable unique ID, lesson slug, difficulty,
four distinct options, a correct option ID, explanation, and learning objective.
`validateQuestionBank` checks references and content shape at runtime; its
validation runs before the assessment interface is rendered. Update the focused
question-bank and scoring tests when extending the bank. Question content is
rendered as React text, not HTML.
