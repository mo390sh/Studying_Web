Cyber Security Weekbook
=======================

Open index.html in a browser. No install or server needed.
To put it online with Vercel: upload this folder to a GitHub repository and import it
in Vercel (framework preset "Other", no build command), or run "npx vercel --prod" here.

Files
  index.html           Layout, styles, the 3D vault, game layer (XP, streaks, missions, badges),
                       quiz engine (practice, speed round, fix my mistakes), flashcards, labs,
                       and the Hands-on tab (practice terminal, challenges, real-tool guides,
                       exam scenarios)
  shell.js             The practice terminal engine: a small, simulated Unix-like shell
                       (ls, cat, grep, awk, sort, sha256sum, openssl, nmap, iptables, kinit ...).
                       Everything it does is pretend and stays in the page.
  weeks/week1.js       Week 1 content: notes, quiz, practice, glossary, checklist, hands-on lab
  weeks/week2.js       Week 2 content
  weeks/week3.js       Week 3 content
  weeks/week4.js       Week 4 content (Network Security)
  weeks/week5.js       Week 5 content (Malware and Web Application Security)
  vendor/three.min.js  three.js r128 (the 3D library), so the vault works offline

The Hands-on tab (one per week)
  Practice terminal   A simulated shell with a pretend lab for the week (files, logs, a pretend
                      network and firewall, certificates, a Kerberos login). Each challenge asks
                      for an answer or checks the state of the lab ("Check my work").
  Real tools          Step-by-step guides for doing the same things on your own machine
                      (Wireshark, Nmap on your own computer, openssl, steghide, zxcvbn, Docker
                      with OWASP Juice Shop bound to localhost ...). Only ever use them on
                      your own computer or with permission.
  Exam scenarios      Written questions: answer first, open the model answer, then tick the key
                      points you covered.

Adding a week
  1. Copy weeks/week5.js to weeks/week6.js and change n to 6.
  2. Replace the title, blurb, topics, parts, quiz, practice, glossary and checklist.
     In each quiz question the first option is the correct one (a:0); the page
     shuffles the options when it shows them.
  3. In index.html, add this line under the other week files:
       <script src="weeks/week6.js"></script>
  The new ring, missions, quiz arena, badges and glossary pick it up automatically.
  "labs" lists interactive tools by id; those are written in index.html (search for LABS.).

Adding a Hands-on lab to a week (end of the week file)
  COURSE.hands(6,{
    title, intro,                          // heading and a short introduction (HTML)
    env:{ hostname, date, fs:{...}, ... }, // the pretend machine. fs maps a path to the file's text,
                                           // or {c:'text', m:'644'} to set permissions. A path that
                                           // ends in / is a folder. Files under /home/student belong
                                           // to the student, everything else to root.
                                           // Optional: exec (what a script prints when run),
                                           // sudo:true, self/hosts/rules (network and firewall),
                                           // certs/tls (openssl), kerberos (kinit).
    try:['ls -l', ...],                    // example commands shown as clickable chips
    tasks:[{id,title,level:'Easy|Medium|Hard',xp,brief,hints:[...],answer:[...],why}],
                                           // add set:true if the order of words in the answer does
                                           // not matter, or re:'regex' to accept a pattern
                                           // use kind:'state' + expect:{files:[{path,mode}]} or
                                           // expect:{host,cases:[{from,ports:{22:'open'}}]} to check the lab
    guides:[{id,title,time,tags,intro,steps:[{t,say,cmd,see}]}],
    scenarios:[{id,title,setup,tasks:[{q,model,points:[...]}]}]
  });
  Keep the answers out of the visible text: the page only reveals "why" after a correct answer.

Progress (XP, streaks, badges, scores) is saved in the browser it is opened in.
Each friend gets their own progress. The backup code on the Profile page moves it between devices.
Fonts load from Google Fonts when online and fall back to system fonts offline.
