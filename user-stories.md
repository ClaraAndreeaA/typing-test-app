# Typing Test — User Stories, Acceptance Criteria, and Tasks

Project goal: Provide a tool for users to measure and improve their typing speed.

Technologies: HTML, CSS, JavaScript (vanilla). Use localStorage for persistence. Progressive enhancement & responsive design for desktop/tablet/mobile. Accessible ARIA-friendly UI.

Priority tags:
- must-have: core functionality required for MVP
- should-have: important improvements
- could-have: nice-to-have additions

---

## 1) Start Test Quickly (must-have)
As a new or returning user, I want to start a typing test with one click so that I can begin measuring my typing speed immediately.

Acceptance criteria:
- Given I am on the homepage, when I click "Start Test", then the test area loads and the input is focused and timer (if selected) starts.
- Given test options are visible, when I choose a mode and click Start, then the selected options are applied.
- The test must block accidental navigation (warn on close if a test is running).

Tasks:
- UI: Add Start button and simple options panel (timed/words, difficulty).
- JS: Implement startTest() to prepare text, focus input, and start timer.
- JS: Implement beforeunload warning while test is active.
- QA: Verify starting works on mobile and desktop and focus behavior.

... (remaining stories as in the scaffold from the earlier conversation)
