Cyber Security Weekbook
=======================

Open index.html in a browser. No install or server needed.
To put it online with Vercel: upload this folder to a GitHub repository and import it
in Vercel (framework preset "Other", no build command), or run "npx vercel --prod" here.

Files
  index.html           Layout, styles, the 3D vault, game layer (XP, streaks, missions, badges),
                       quiz engine (practice, speed round, fix my mistakes), flashcards and labs
  weeks/week1.js       Week 1 content: notes, quiz, practice, glossary, checklist
  weeks/week2.js       Week 2 content
  weeks/week3.js       Week 3 content
  vendor/three.min.js  three.js r128 (the 3D library), so the vault works offline

Adding a week
  1. Copy weeks/week3.js to weeks/week4.js and change n to 4.
  2. Replace the title, blurb, topics, parts, quiz, practice, glossary and checklist.
     In each quiz question the first option is the correct one (a:0); the page
     shuffles the options when it shows them.
  3. In index.html, add this line under the other week files:
       <script src="weeks/week4.js"></script>
  The new ring, missions, quiz arena, badges and glossary pick it up automatically.
  "labs" lists interactive tools by id; those are written in index.html (search for LABS.).

Progress (XP, streaks, badges, scores) is saved in the browser it is opened in.
Each friend gets their own progress. The backup code on the Profile page moves it between devices.
Fonts load from Google Fonts when online and fall back to system fonts offline.
