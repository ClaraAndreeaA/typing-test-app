# Typing Test App — Starter Scaffold

Project goal
------------
To provide a simple, intuitive, and accessible tool for users to measure and improve their typing speed.

User needs
----------
- Measure and improve typing speed with reliable metrics (WPM and accuracy).
- Clear instructions so first-time users know how to take the test.
- Quick, one-click test start with minimal friction.
- Difficulty and mode selection so tests are relevant to a user's ability.
- Cross-device compatibility (desktop, tablet, mobile).
- Real-time feedback and an option to retry and review mistakes.
- Save and view best results or history (localStorage).
- Accessibility for keyboard and screen-reader users.

Technologies
------------
- HTML, CSS, JavaScript (vanilla)
- localStorage for client-side persistence
- Progressive enhancement and responsive design

Getting started (developer)
---------------------------
1. Open `index.html` in a browser (or serve via a simple static server).
2. The scaffold includes:
   - `index.html` — layout and UI
   - `styles.css` — responsive, accessible styles
   - `app.js` — minimal test behavior (start, highlight, WPM/accuracy calculation)
3. Run the app, try the Start Test button and type into the input. The scaffold auto-starts on first input as well.

Next steps (MVP → enhancements)
-------------------------------
- Persist results to localStorage and add a History page.
- Improve passage pool and difficulty mapping.
- Add full timed and word-count modes with proper stop conditions.
- Add a Review mode to see mistakes in context.
- Add automated unit tests for calculation functions.
- Add CI (GitHub Actions) and project board integration.

Contributing
------------
If you want me to push these files to a GitHub repository and open issues/PRs, provide the repo owner/name and confirm access. I will create:
- A branch (default: `feature/start-test-scaffold`)
- One issue per user story with acceptance criteria and tasks (or one issue per task if you prefer)
- A Pull Request for the scaffold branch (optional)

License
-------
Add your preferred license and code of conduct as required.
