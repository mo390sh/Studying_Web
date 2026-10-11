Cyber Security Weekbook
=======================

Open index.html in a browser. No install or server needed.

Files
  index.html           Page layout, styles, the 3D disk, quiz engine and labs
  weeks/week1.js       Week 1 content: notes, quiz, practice, glossary, checklist
  weeks/week2.js       Week 2 content
  weeks/week3.js       Week 3 content
  vendor/three.min.js  three.js r128 (the 3D library), so the disk works offline

Adding a week
  1. Copy weeks/week3.js to weeks/week4.js and change n to 4.
  2. Replace the title, blurb, topics, parts, quiz, practice, glossary and checklist.
     In each quiz question the first option is the correct one (a:0); the page
     shuffles the options when it shows them.
  3. In index.html, add this line under the other week files:
       <script src="weeks/week4.js"></script>
  The new ring, tabs, mixed quiz and glossary pick it up automatically.
  "labs" lists interactive tools by id; those are written in index.html (search for LABS.).

Fonts load from Google Fonts when online and fall back to system fonts offline.
Progress (quiz scores, ticks) is saved in the browser you open it in.
