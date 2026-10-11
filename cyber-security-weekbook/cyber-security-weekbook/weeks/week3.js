COURSE.add({
n:3,
title:"Authentication, Access Control and Steganography",
blurb:"Who gets in, what they are allowed to do once inside, and how to hide the fact that a message exists at all.",
topics:["Authentication factors and MFA","Password entropy, salting, attacks","Reading auth logs","Passkeys","Biometrics","Unix permissions","Steganography and LSB"],
labs:["entropy","chmod","lsb"],

parts:[
{tag:"1",title:"Identification, authentication, authorisation",html:`
<p>When you access a system, three separate things happen. People mix them up constantly, so learn the difference first.</p>
${tbl(["Step","Question it answers","Example (Fred logging in)"],[
["Identification","Who do you claim to be?","Fred types his username: \"I am Fred!\""],
["Authentication","Can you prove it?","Fred enters his password or scans his fingerprint"],
["Authorisation","What are you allowed to do?","The system lets Fred read a file, but not delete it (the red no-entry sign on your slide)"]
])}
${note("key","<strong>The order matters:</strong> identify, then authenticate, then authorise. Authentication is about <em>who you are</em>; authorisation is about <em>what you can do</em>. (Authentication and authorisation are two of the three As in AAA; the third is accounting.)")}

<h3>1.1 Authentication: proving who you are</h3>
<p>Your slide defines authentication as proving you are who you claim to be by using a <strong>distinguishing characteristic</strong>. There are three categories (factors):</p>
${tbl(["Factor","Meaning","Examples"],[
["Knowledge","Something you know","Password, PIN, answer to a security question"],
["Token","Something you have","Security key fob, bank OTP device, phone"],
["Biometrics","Something you are","Fingerprint, face, iris, how you type"]
])}

<h3>1.2 Two-factor and multi-factor authentication (2FA / MFA)</h3>
<p>MFA means combining factors from <strong>at least two different categories</strong>. Your slide shows the three possible pairs:</p>
<ul>
<li>Knowledge + token (password + a code from your OTP device)</li>
<li>Token + biometric (security key + fingerprint)</li>
<li>Knowledge + biometric (password + fingerprint)</li>
</ul>
${note("warn","<strong>Common mistake:</strong> two things from the same category are not MFA. A password plus a PIN is two knowledge factors, so it is still single-factor. Likewise fingerprint plus face is two biometrics.")}

<h3>1.3 The password problem</h3>
<p>Passwords are the most common factor, but people use them badly. Your slide lists the typical mistakes:</p>
<ul>
<li>Re-used a password on several sites</li>
<li>Used an easily guessed password</li>
<li>Shared a password with someone</li>
<li>Modified a password for re-use (for example Summer1, Summer2)</li>
<li>Written a password down</li>
</ul>
<p>That's why the rest of this week looks at: making passwords stronger (Part 2), reading signs of attack (Part 3), removing passwords entirely (Part 4), and using biometrics instead (Part 5).</p>
`},

{tag:"2",title:"Password security",html:`
<p>Your article looks at passwords in three stages: how they are <strong>generated</strong>, how they are <strong>stored</strong>, and how they are <strong>attacked</strong>. (It covers text-based passwords only.)</p>

<h3>2.1 Generating passwords: entropy</h3>
<p>A tension: too simple = easy to remember but easy to attack; too random = hard to attack but hard to remember. Password strength meters try to measure this using <strong>entropy</strong>, which here means a measure of how unpredictable something is, in bits. More random means higher entropy, which takes more computing power to crack.</p>
<h4>The formula</h4>
<p>If a password has length <strong>l</strong> characters, each chosen at random from an alphabet of <strong>n</strong> characters:</p>
${pre(`
number of possible passwords = n^l
entropy (bits)               = log2( n^l ) = l x log2(n)`)}
<p>Each extra bit doubles the number of guesses an attacker needs. So 57 bits means about 2<sup>57</sup>, which is roughly 1.4 × 10<sup>17</sup> possible passwords.</p>
${tbl(["Password type","Alphabet size n","Length l","Entropy (bits)"],[
["4-digit PIN","10","4","13.3"],
["6-digit PIN","10","6","19.9"],
["Random lowercase letters","26","8","37.6"],
["Random lowercase letters","26","12","56.4"],
["Random from all 94 typeable characters","94","8","52.4"],
["password123 (lowercase + digits = 36)","36","11","56.9"]
])}
<p>Look at the last row: the formula gives about 57 bits for password123, matching your article. And look at rows 4 and 5: 12 random lowercase letters (56 bits) beats 8 random characters from all 94 (52 bits). <strong>Length matters a lot.</strong></p>
${lab("entropy")}
<h4>The big limitation</h4>
<p>The formula assumes the password was chosen <strong>randomly</strong> from the <strong>password space</strong> (the set of all possible passwords). Humans aren't random. password123 scores 57 bits, but it's one of the first things an attacker tries. People constantly choose "password" and "123456". So the entropy calculation can overstate how safe a password is.</p>
<h4>Shannon's alternative</h4>
<p>Claude Shannon (who invented entropy for compressing information) tested how well people could guess the next letter in English text. Finding: the first letter is hard to guess, and later letters get easier. For passwords, the estimate becomes:</p>
${tbl(["Character position","Entropy it adds"],[
["1st character","4.7 bits"],
["Characters 2 to 8","2.3 bits each"],
["Character 9 onwards","1.5 bits each"]
])}
<p>Example for password123 (11 characters): 4.7 + (7 × 2.3) + (3 × 1.5) = 4.7 + 16.1 + 4.5 = <strong>25.3 bits</strong>, much lower than the 57 from the formula, and arguably closer to reality. Your article says both methods are flawed but are the best we have, and the first (formula) one is what most strength meters on websites use.</p>
<h4>Modern advice: length and three random words</h4>
<p>Guidance is changing to recognise human behaviour. Forcing frequent password changes and complicated rules (upper + lower + number + symbol) burdens users and leads to bad habits. The UK National Cyber Security Centre (NCSC) recommends <strong>three random words</strong>: more memorable, and it emphasises length over complexity.</p>
<h4>One-time passwords (OTP)</h4>
<p>A one-time password is a random password valid for a single session only, usually with a time limit. Bank OTP devices are an example. (Don't confuse it with the one-time <em>pad</em> from Week 2, which is a cipher.)</p>

<h3>2.2 Storing passwords</h3>
<p>A service must store something to check your password later. It must <strong>never store it in plaintext</strong>, or anyone who steals the database can read every password instantly.</p>
<h4>Hashing</h4>
<p>Store a <strong>hash</strong> of the password instead (Week 2: a one-way fingerprint). The real password is never stored, and the hash can't easily be reversed. Password hashes are special: they are <strong>deliberately slow</strong> to compute. Example: <strong>bcrypt</strong>, which is based on the Blowfish cipher from Week 1. Slowness hardly affects one honest login but makes an attacker's billions of guesses very expensive.</p>
<h4>Salting</h4>
<p>A <strong>salt</strong> is a long, random string (made with a CSPRNG, from Week 2) added to the password before hashing (prepended or appended). Each user gets their own salt, stored next to their hash in the database.</p>
<p>Here is a real demonstration. Two users, Alice and Bob, both choose password123 (hashes shortened for display):</p>
${pre(`
No salt:               SHA256(password123)      = ef92b778bafe771e89245b89...
                       (same for EVERYONE who uses this password)

Alice, salt a3f9c2d1:  SHA256(salt+password123) = da056fc071d40aa22d098bfc...
Bob,   salt 7be04a55:  SHA256(salt+password123) = 47cf27e41128dc335f2f3219...`)}
<ul>
<li><strong>Same password, different hashes.</strong> An attacker who cracks one can't tell who else shares that password, and must attack each user separately.</li>
<li><strong>Salt is not secret.</strong> It's stored with the hash. Its job is to randomise, not to hide.</li>
<li><strong>Use a different salt for every password.</strong> The same salt on two identical passwords would give the same hash again.</li>
<li><strong>Make it long.</strong> An 8-bit salt has only 256 possibilities, far too small. A good rule from your article: the same length as the hash output, for example 256 bits for SHA-256. (The 8-hex-character salts above are just for readability.)</li>
</ul>
<h4>Checking a password when someone logs in</h4>
<ol>
<li>Take the password they typed and combine it with that user's stored salt, then hash it.</li>
<li>Compare the result with the stored hash.</li>
<li>If they match, the user is authenticated.</li>
</ol>
<h4>Three strikes and you're out</h4>
<p>Many systems lock an account after 3 or 5 failed attempts, to stop attackers from trying endless guesses. Downside: real users forget passwords, and resetting is a hassle. (And as you'll see, attackers have ways around it.)</p>

<h3>2.3 Attacking passwords</h3>
<p>These are the attacks in your article. Learn what makes each one different.</p>
${tbl(["Attack","What the attacker does","Notes and defences"],[
["Brute force","Tries every possible password from the password space","Can be online (typing guesses into the live system) or offline (cracking a stolen database of hashes). Slow. Defences: long passwords, slow hashing, lockouts"],
["Password guessing","Uses knowledge of the target (birthdays, pets) or default logins (admin / password123)","Don't use personal info; change default credentials immediately"],
["Dictionary attack","Tries a pre-made list of likely passwords (common ones, leaked ones, dictionary words, pop-culture, other languages)","Much faster than brute force because it tries probable passwords first. Salts help for stolen hashes"],
["Pre-computed hash tables","Hashes a dictionary in advance into a lookup table, then matches stolen hashes against it","Works only if there's no salt (or a poor one). Salting defeats it. (Rainbow tables are a fancier version, out of scope)"],
["Password spraying","Tries a few common passwords against MANY accounts","Stays under lockout limits and is less obvious. The reverse of brute force"],
["Account enumeration","Works out which accounts exist (not a password attack itself)","Caused by messages like \"Username does not exist\" vs \"Incorrect password\". Fix: one generic message like \"Invalid username or password\". Reset pages can leak this too"],
["Credential stuffing","Uses real username/password pairs from a previous breach on other sites","Works because people reuse passwords. Can be automated. Defences: unique passwords, MFA"]
])}
${note("key","<strong>Easy way to tell them apart:</strong> brute force = one account, every password. Spraying = many accounts, a few passwords. Credential stuffing = known real pairs from elsewhere. Dictionary = a list of likely passwords.")}
<h4>Cracking software</h4>
<p>Tools exist for cracking passwords (your article names John the Ripper). Only ever use such tools on your own passwords or in a lab you have permission to use. Using them on someone else's is illegal (Computer Misuse Act, Week 1).</p>
`},

{tag:"3",title:"Reading authentication logs",html:`
<p><strong>One-line idea:</strong> attacks leave patterns in the logs, but a pattern is a clue, not proof.</p>

<h3>3.1 Syslog format</h3>
<p>Linux authentication logs usually follow this layout:</p>
${pre(`
<TIMESTAMP> <HOSTNAME> <PROCESS>[<PID>]: <MESSAGE>

Mar 04 02:20:13 web01 sshd[2451]: Failed password for invalid user oracle
                                  from 203.0.113.42 port 43110 ssh2`)}
${tbl(["Part","Example","Meaning"],[
["Timestamp","Mar 04 02:20:13","When it was recorded (year/timezone may be missing)"],
["Hostname","web01","Which machine logged it"],
["Process[PID]","sshd[2451]","The program (sshd = SSH server) and its process ID number"],
["Message","Failed password for invalid user oracle from 203.0.113.42 port 43110 ssh2","What happened: result, account, source IP, the source port, protocol"]
])}
${note("warn","<strong>A log pattern is a clue, not proof.</strong> Before deciding it's an attack, check the source, timing, number of events, and what's normal for that system.")}

<h3>3.2 Four attack patterns</h3>
<h4>1. Account enumeration</h4>
<p>The attacker is looking for which accounts exist: many <strong>invalid user</strong> lines from one IP, with many different usernames in quick succession.</p>
${pre(`
Mar 04 02:20:13 web01 sshd[2451]: Failed password for invalid user oracle from 203.0.113.42 ...
Mar 04 02:20:14 web01 sshd[2452]: Failed password for invalid user postgres from 203.0.113.42 ...
Mar 04 02:20:15 web01 sshd[2453]: Failed password for admin from 203.0.113.42 ...`)}
<p>Could also be: a misconfigured script, an old app using removed accounts, or someone typing the wrong username. The evidence is stronger when many different names are tried fast. (Notice admin has no "invalid user", so that account exists, which is exactly what the attacker learns.)</p>
<h4>2. Password spraying</h4>
<p>A few passwords against many accounts: one IP, different <strong>valid</strong> usernames, roughly one failure each, spaced out.</p>
${pre(`
Mar 05 09:00:01 web01 sshd[3001]: Failed password for jsmith from 203.0.113.42 ...
Mar 05 09:00:03 web01 sshd[3002]: Failed password for adurand from 203.0.113.42 ...
Mar 05 09:00:05 web01 sshd[3003]: Failed password for rkhan from 203.0.113.42 ...`)}
<p>Caution: logs don't show the password tried, so you can't be sure it's the same password each time.</p>
<h4>3. Brute force</h4>
<p>Every password on one account: lots of failures for the <strong>same account</strong> from the same IP, possibly ending in an Accepted line.</p>
${pre(`
Mar 06 01:11:20 web01 sshd[4001]: Failed password for admin from 198.51.100.7 ...
Mar 06 01:11:21 web01 sshd[4002]: Failed password for admin from 198.51.100.7 ...
... lots more failures ...
Mar 06 01:19:54 web01 sshd[4777]: Accepted password for admin from 198.51.100.7 ...`)}
<p>Caution: an accepted login after failures deserves investigation, but it doesn't prove who logged in. It could be someone who forgot their password.</p>
<h4>4. Credential stuffing</h4>
<p>Real pairs from another breach: several <strong>Accepted</strong> logins for different users from one IP, with few or no failures before them.</p>
${pre(`
Mar 07 22:03:10 web01 sshd[5001]: Accepted password for jsmith from 203.0.113.99 ...
Mar 07 22:04:55 web01 sshd[5002]: Accepted password for adurand from 203.0.113.99 ...
Mar 07 22:07:31 web01 sshd[5003]: Accepted password for rkhan from 203.0.113.99 ...`)}
<p>This one is hard to spot because the attacker already had the right passwords.</p>

<h3>3.3 A fifth pattern, privilege escalation: sudo and su</h3>
<p><strong>Privilege escalation</strong> is gaining higher privileges, such as root (the system administrator account).</p>
${pre(`
Mar 08 14:20:11 web01 sudo: jsmith : TTY=pts/0 ; PWD=/home/jsmith ; USER=root ; COMMAND=/bin/bash
Mar 08 14:20:11 web01 su[6012]: (to root) jsmith on pts/0`)}
${tbl(["Piece","Meaning"],[
["sudo (superuser do)","Lets an authorised user run a command with another account's permissions, usually root"],
["su","Switches to another user account"],
["bash","A command-line shell. Running /bin/bash as root gives a root shell where every later command runs as root"],
["TTY=pts/0","The terminal session the command came from"],
["PWD=/home/jsmith","The working directory when it was run"],
["COMMAND=/bin/bash","What was run (here, a shell, not just one command like sudo apt update)"],
["su[6012]","6012 is a process ID, not a user ID"],
["(to root) jsmith","jsmith switched to the root account"]
])}
${note("warn","<strong>Using sudo is normal for administrators.</strong> Seeing it in a log doesn't mean an attack. The same timestamp on both lines doesn't prove one caused the other. To judge it, ask: Is jsmith authorised to use sudo? Did authentication succeed? What did the account do next? Are the user, command and timing what you'd expect?")}
`},

{tag:"4",title:"Passwordless authentication: passkeys",html:`
<p><strong>One-line idea:</strong> replace the password with a public/private key pair, so there's no secret to type, steal or phish. (This is Week 2's public key cryptography and digital signatures, put to work.)</p>

<h3>4.1 How a passkey works</h3>
<ol>
<li><strong>Setup:</strong> when you create a passkey for a website or app, a key pair is generated. The <strong>public key</strong> goes to the service (the verifier). The <strong>private key</strong> (the passkey itself) stays on your device, in a credential manager, a kind of vault isolated from the main processor.</li>
<li><strong>Logging in:</strong> instead of a password, you unlock your trusted device the way you normally do (commonly a fingerprint).</li>
<li>The service sends a <strong>challenge</strong>: a random cryptographic string.</li>
<li>Your device <strong>signs</strong> the challenge with the private key and sends the signature back.</li>
<li>The service checks the signature with your public key. If it verifies, you're in.</li>
</ol>
${pre(`
Service  ----- random challenge ----->   Your device
                                         (you unlock it: fingerprint)
                                         signs challenge with PRIVATE key
Service  <---- signed challenge ------
checks signature with your PUBLIC key  ->  login accepted`)}

<h3>4.2 Why it's more secure</h3>
<ul>
<li><strong>Phishing-resistant:</strong> your device only offers a passkey for the genuine service it was created for, so a fake website gets nothing.</li>
<li><strong>Nothing to steal in transit or reuse:</strong> the private key never leaves your device, and each challenge is different, so passkeys can't be intercepted, reused or stolen like passwords.</li>
<li>Keys can be synced between your devices (for example through Google or Apple accounts).</li>
</ul>
${note("link","This is exactly a <strong>digital signature</strong> from Week 2. The private key signs (the challenge), the public key verifies. The random challenge stops an attacker replaying an old response.")}
`},

{tag:"5",title:"Biometrics",html:`
<p><strong>One-line idea:</strong> use a measurable trait of your body or behaviour as the authentication factor (something you are).</p>

<h3>5.1 The basics</h3>
<ul>
<li>A <strong>biometric</strong> is a trait distinctive enough to be measured, quantified and stored so it can be used for access control.</li>
<li><strong>Physical (physiological)</strong> traits: face, iris, retina, fingerprint. <strong>Behavioural</strong> traits: how you type, how you walk.</li>
<li><strong>Enrolment:</strong> your trait is captured and a <strong>template</strong> (a set of extracted features, not the raw picture) is stored.</li>
<li><strong>Verification mode:</strong> you claim an identity and the system checks if your trait matches that one template (are you who you say? one-to-one). <strong>Identification mode:</strong> the system compares you against many templates to work out who you are (who is this? one-to-many).</li>
</ul>

<h3>5.2 Accuracy: four rates</h3>
<p>No biometric system is perfect: it compares a new sample to a stored template and gives a match score. A <strong>threshold</strong> decides accept or reject. Four outcomes:</p>
${tbl(["Outcome","Meaning","Counted as"],[
["True positive (TP)","A genuine user is accepted","Good"],
["False negative (FN)","A genuine user is rejected","Bad: annoying (false reject)"],
["False positive (FP)","An impostor is accepted","Bad: dangerous (false accept)"],
["True negative (TN)","An impostor is rejected","Good"]
])}
${tbl(["Rate","Slide definition","Formula"],[
["True Accept Rate (TAR)","Proportion of genuine users correctly authenticated","TP / (TP + FN)"],
["True Reject Rate (TRR)","Proportion of unauthorised users correctly rejected","TN / (TN + FP)"],
["False Accept Rate (FAR)","Likelihood of falsely accepting an impostor","FP / (FP + TN)"],
["False Reject Rate (FRR)","Likelihood of falsely rejecting a genuine user","FN / (TP + FN)"]
])}
<p><strong>Worked example:</strong> 100 genuine attempts: 94 accepted, 6 rejected. 200 impostor attempts: 4 accepted, 196 rejected. TAR = 94/100 = 94%; FRR = 6/100 = 6%; FAR = 4/200 = 2%; TRR = 196/200 = 98%. Notice TAR + FRR = 100% and FAR + TRR = 100%.</p>

<h3>5.3 The threshold trade-off and the ROC curve</h3>
<p>The threshold (0 to 1 on your slide) is a dial:</p>
<ul>
<li><strong>Strict threshold (high):</strong> impostors rarely get in (FAR low), but genuine users get rejected more (FRR high). More secure, more annoying.</li>
<li><strong>Lenient threshold (low):</strong> genuine users get in easily (FRR low), but impostors slip in too (FAR high). More convenient, less secure.</li>
</ul>
<p>The <strong>ROC (Receiver Operating Characteristic) curve</strong> plots TAR (up) against FAR (across) as the threshold changes. Each point on the curve is one threshold setting. A better system's curve bulges toward the <strong>top-left</strong> (high TAR with low FAR). The straight diagonal line is no better than random guessing. In your slide's picture, the blue curve is the best system and the purple one the worst of the three.</p>
${note("tip","<strong>Choosing a setting:</strong> a high-security door might accept more false rejects to keep FAR tiny; a phone unlock might accept a slightly higher FAR to avoid annoying you. Your slides note balancing error rates against cost and other factors.")}

<h3>5.4 The biometric types in your slides</h3>
${tbl(["Type","How it works","Key points from your slides"],[
["Face","Maps facial geometry and extracts features. One algorithm: eigenfaces (Turk and Pentland, 1991)","NIST regularly tests vendors. In the real world it can be patchy and unreliable; use in law enforcement is particularly worrying (there are news incidents, including a 2021 failure)"],
["Iris","Infrared camera photographs the iris; the pattern is analysed into coordinates that are stored; verification repeats this and compares","Iris patterns differ greatly between people. Highly accurate: claimed 1 in 1 to 2 million false positives"],
["Retina","Special low-light camera scans the network of blood vessels at the back of the eye to build the template","More invasive than iris scanning, needs specialist equipment, can change over time with disease, high accuracy"],
["Fingerprint","Ridges (lines) and valleys form arches, loops and whorls. During enrolment many rotations/images are taken; unique features (e.g. a ridge splitting in two) are stored","Affected by wet fingers, age, and can be fooled (spoofed)"],
["Keystroke dynamics (behavioural)","Measures typing rhythm: dwell time (how long a key is held down) and flight time (the gap between keys)","Behavioural, so can vary with mood, keyboard, injury"],
["Gait analysis (behavioural)","Identifies you from how you walk","Behavioural"]
])}

<h3>5.5 Acceptability and other concerns (from your slides)</h3>
<ul>
<li><strong>Privacy:</strong> you're handing over data about your body. (Extra thought: unlike a password, you can't change your fingerprint if a template is stolen.)</li>
<li><strong>Failure to capture:</strong> the sensor can fail at enrolment or at login (wet fingers, bad lighting).</li>
<li><strong>Error rates vs cost:</strong> FAR and FRR should both be low, but this can be hard to balance with cost and other factors.</li>
<li><strong>AI can incorporate bias</strong> (next section).</li>
<li><strong>Spoofing:</strong> fake fingers, photos or masks used to fool a sensor.</li>
</ul>

<h3>5.6 Bias in biometrics (the Gender Shades reading)</h3>
<p>Your reading asks you to <strong>consider the different elements which can contribute to bias in biometric systems</strong>. The paper by Joy Buolamwini and Dr Timnit Gebru examined commercial facial analysis systems and found they performed unevenly across groups, with the highest error rates for darker-skinned women, which led companies to change their algorithms.</p>
${note("warn","This summary was written without the paper to hand, so it could be wrong in places. Read the paper yourself (about 50 minutes), note the details, and check this description against it.")}
<p>Questions to guide your reading, based on how bias generally enters machine learning systems:</p>
<ul>
<li><strong>Training data:</strong> who is in the data? If some groups are under-represented, the system learns them less well.</li>
<li><strong>Test/benchmark data:</strong> if the data used to measure accuracy is also unbalanced, the problem stays hidden behind a good overall score.</li>
<li><strong>Overall accuracy hides group differences:</strong> a system can be 90% accurate overall but much worse for particular groups. Measuring error rates per group (and for combinations, such as gender and skin tone together) reveals this.</li>
<li><strong>Labels and categories:</strong> how were people labelled, and are the categories used even appropriate?</li>
<li><strong>Imaging conditions:</strong> cameras and lighting may work better for some skin tones than others.</li>
<li><strong>Use and consequences:</strong> in policing or hiring, higher error rates for some groups cause real harm (link to the "facial recognition: the reality" slide).</li>
</ul>
`},

{tag:"6",title:"Authorisation and access control",html:`
<p><strong>One-line idea:</strong> once you're authenticated, access control decides what you're allowed to do.</p>

<h3>6.1 The Lampson access control model</h3>
<p>Your slide shows the classic model with three parts:</p>
<ul>
<li><strong>Subject:</strong> the active thing making a request (a user, or a program running for them).</li>
<li><strong>Object:</strong> the resource being accessed (a file, a database, a device).</li>
<li><strong>Reference monitor:</strong> the gatekeeper. Every access request passes through it, and it checks the rules before allowing or denying access to the object.</li>
</ul>
${pre(`
Subject  --[access request]-->  REFERENCE MONITOR  --[if allowed]-->  Object
(Fred)                          (checks the rules)                    (a file)`)}
<p>The key idea: access is never direct. The reference monitor mediates <strong>every</strong> request.</p>

<h3>6.2 Unix access control</h3>
<p>Unix/Linux gives every file permissions for three classes of user, and each class has three possible permissions:</p>
${tbl(["Class","Who"],[
["Owner","The user who owns the file"],
["Group","Members of the file's group"],
["World (Other)","Everyone else"]
])}
${tbl(["Permission","Letter","On a file","Number"],[
["Read","r","View the contents","4"],
["Write","w","Change the contents","2"],
["Execute","x","Run it as a program","1"],
["No permission","-","Not allowed","0"]
])}
<p>Reading your slide's example <code>rwxrw-r--</code>. Split it into three groups of three:</p>
${tbl(["","Owner","Group","World"],[
["Letters","rwx","rw-","r--"],
["Can do","Read, write, execute","Read, write (no execute)","Read only"],
["Number","4+2+1 = 7","4+2+0 = 6","4+0+0 = 4"]
])}
<p>So <code>rwxrw-r--</code> is the same as <strong>764</strong>. You'd set it with <code>chmod 764 filename</code>.</p>
${lab("chmod")}
${note("why","Files that are too open (for example world-writable) are a classic weakness. Keeping permissions as tight as possible is the <strong>principle of least privilege</strong>: give each user only the access they need. (Extra: least privilege isn't named on your slides, but it's the idea behind them. If your course also covers terms like ACLs, RBAC, DAC or MAC, they're different ways of writing and managing these rules.)")}
`},

{tag:"7",title:"Steganography",html:`
<p><strong>One-line idea:</strong> cryptography hides what a message <em>says</em>; steganography hides the fact that a message <em>exists at all</em>.</p>

<h3>7.1 Hiding in plain sight</h3>
<p>Your slides open with a busy Where's Waldo beach scene, then a grey version with just one coloured patch. The point: something can be right in front of you and not be noticed, if it's hidden among lots of ordinary material. Other pictures (a Spartan statue, lemons) hint at classic historical tricks, such as secret messages hidden under wax on a writing tablet and invisible ink made from lemon juice (which appears when heated).</p>

<h3>7.2 Acrostics</h3>
<p>An acrostic hides a message in the first letters of each line. Your slide's example is from Lewis Carroll's <em>Through the Looking-Glass</em>: the first letters of the lines of its closing poem, read down the left edge, spell out the name of the real Alice, Alice Pleasance Liddell:</p>
${pre(`
A boat, beneath a sunny sky
Lingering onward dreamily
In an evening of July -
Children three that nestle near,
Eager eye and willing ear,          ->   A L I C E`)}

<h3>7.3 The steganography process</h3>
${tbl(["Term","Meaning","On your slide"],[
["Payload","The secret you want to hide","TOP SECRET note"],
["Cover object","The innocent-looking carrier that hides it","An ordinary photo of flowers"],
["Stego-object","The cover after the payload has been hidden in it","A photo that looks identical to the original"]
])}
${pre(`
Payload  +  Cover object     --[hiding algorithm]-->   Stego-object
(secret)    (innocent file)                            (looks just like the cover)`)}
<p><strong>Potential cover objects</strong> (from your slide): images, video, text/documents, audio. Anything with enough redundant data that small changes won't be noticed.</p>

<h3>7.4 Steganography vs cryptography</h3>
${tbl(["","Cryptography","Steganography"],[
["Hides","The meaning of the message","The existence of the message"],
["What an observer sees","Obvious gibberish (like the block of letters on your slide) which signals that there's a secret here","An ordinary-looking file (like the grass photo on your slide) with nothing to suggest a secret"],
["If discovered","Still unreadable without the key","The secret may be readable if it isn't also encrypted"]
])}
${note("key","<strong>Best of both:</strong> encrypt the payload first, then hide it. An observer doesn't know a message exists, and if they find it, they still can't read it. (Extra: a related idea, digital watermarking, hides information such as ownership inside media; it is not on your slides.)")}
`},

{tag:"8",title:"The LSB (least significant bit) algorithm",html:`
<p><strong>One-line idea:</strong> hide your secret bits in the last bit of each colour value of an image, where changes are too tiny for the eye to see.</p>

<h3>8.1 How images store colour (24-bit RGB)</h3>
<p>Each pixel has three values: Red, Green, Blue. Each is one byte (8 bits), from 0 to 255. Your slide's example pixel:</p>
${pre(`
10101101   10110100   01011011
Red value  Green val. Blue val.      (that's 173, 180, 91)`)}

<h3>8.2 Most and least significant bits</h3>
<p>In an 8-bit number, the leftmost bit is the <strong>Most Significant Bit (MSB)</strong>, worth 128. The rightmost is the <strong>Least Significant Bit (LSB)</strong>, worth just 1. Compare the three examples on your slides:</p>
${tbl(["Binary","Decimal","What changed","Colour (R, 0, 0)"],[
["10100101","165","Original","rgb(165, 0, 0)"],
["10100100","164","LSB flipped (change of 1)","rgb(164, 0, 0): looks identical"],
["00100101","37","MSB flipped (change of 128)","rgb(37, 0, 0): clearly darker"]
])}
${note("key","That's the whole trick: changing the LSB changes the colour by at most 1 out of 255, which no human can see. Changing the MSB would be obvious. So we hide data in the LSBs.")}

<h3>8.3 The algorithm</h3>
<ol>
<li>Take your payload as a stream of bits.</li>
<li>Take the cover image's colour bytes, one at a time.</li>
<li>For each cover byte, <strong>replace its last bit</strong> with the next payload bit.</li>
<li>Save the result. This is the stego-image.</li>
</ol>
<p>Your slide's first step: cover byte 10100100, first payload bit 1 (payload starts 10101101…). Result: 10100101.</p>
<p>The tool below is the full worked example: hiding one payload byte (10101101) in 8 cover bytes. Only some bytes change (when the payload bit already equals the cover's last bit, nothing changes), and no value changes by more than 1. To extract, read the last bit of each stego byte in the same order and group them into 8s.</p>
${lab("lsb")}

<h3>8.4 How much can you hide?</h3>
<p>Using one LSB per colour byte, each pixel (3 bytes) holds 3 bits. <strong>Capacity = pixels × 3 bits.</strong> Example: a 1000 × 1000 image has 1,000,000 pixels, so 3,000,000 bits = 375,000 bytes, around 366 KB of hidden data.</p>

<h3>8.5 Randomness and choosing where to hide</h3>
<p>Your deck also covers randomness (as in Week 2): true random, pseudo-random (statistically random but repeatable from a seed), and CSPRNGs (for example SecureRandom in Java). In steganography the likely use is to pick <strong>which bytes to hide in</strong>, instead of simply going in order: sender and receiver use the same seed to regenerate the same sequence of positions, so the receiver knows where to look, but the hidden bits are scattered and harder to detect. (Check your lab instructions for exactly how to seed and use it.)</p>

<h3>8.6 Bit manipulation (from your slide, in Java)</h3>
${tbl(["Code","What it does"],[
["<code>int lsb = byt &amp; 0x1;</code>","Get the LSB: bitwise AND with 1"],
["<code>byt &amp;= ~0x1;</code>","Set the LSB to 0: AND with the complement of 1"],
["<code>byt |= 0x1;</code>","Set the LSB to 1: OR with 1"],
["<code>byt &lt;&lt; shiftVal;</code>","Shift bits left by shiftVal"],
["<code>byt &gt;&gt; shiftVal;</code>","Shift bits right by shiftVal"],
["<code>^</code>","Exclusive OR (XOR)"]
])}
<p>Putting them together:</p>
${pre(`
// hide one payload bit in a cover byte
int stegoByte = (coverByte & ~0x1) | payloadBit;      // clear LSB, then OR in the bit

// read the hidden bit back
int hidden = stegoByte & 0x1;

// get bit i of a payload byte (i = 0 is the leftmost bit)
int payloadBit = (payloadByte >> (7 - i)) & 0x1;`)}
${note("warn","<strong>Java gotcha:</strong> Java's <code>byte</code> type is signed (−128 to 127), so values above 127 appear negative. When reading pixel bytes as numbers 0 to 255, use <code>(b &amp; 0xFF)</code>.")}

<h3>8.7 Limitations (extra, worth knowing)</h3>
<ul>
<li><strong>Lossy compression</strong> (such as saving as JPEG) can change pixel values and destroy the hidden bits, so LSB methods normally use lossless formats like PNG or BMP.</li>
<li>Hiding too much data creates statistical patterns in the LSBs that analysis tools can detect.</li>
<li>Hidden data is lost if the image is resized or edited.</li>
</ul>
`},

{tag:"9",title:"How Weeks 1 to 3 connect",html:`
${tbl(["Week","Big idea","Where it returns in Week 3"],[
["1","CIA triad, ciphers, hashing basics, risk","Authentication protects confidentiality and integrity; risk statements apply to password attacks"],
["2","Randomness, hashes, public keys, signatures","Salts use CSPRNGs; password storage uses hashes; passkeys use signatures; LSB uses randomness"],
["3","Who gets in, what they can do, and hiding data","Authentication, access control, steganography"]
])}
${note("tip","The calculations are where marks are won. Redo the entropy, FAR/FRR and LSB examples until they're automatic, and be able to explain each in one sentence.")}
`}
],

quiz:[
{q:"Fred types his username into a login page. Which step is that?",o:["Identification","Authentication","Authorisation","Accounting"],a:0,why:"Identification is the claim (\"I am Fred\"). Authentication is proving it; authorisation is what he may then do."},
{q:"A site asks for a password and then a PIN. How many authentication factors is that?",o:["One: both are things you know","Two: it is two separate secrets","Three: username, password and PIN","None: PINs are not a factor"],a:0,why:"MFA needs factors from different categories. A password and a PIN are both knowledge."},
{q:"Which factor category is a bank's OTP device?",o:["Token (something you have)","Knowledge (something you know)","Biometric (something you are)","Behavioural"],a:0,why:"It is a physical thing you possess. The code it shows only proves you have the device."},
{q:"Which pair is real multi-factor authentication?",o:["Security key + fingerprint","Fingerprint + face scan","Password + security question","PIN + password"],a:0,why:"Token plus biometric comes from two different categories. The other pairs double up on one category."},
{q:"What is the entropy of a 4-digit PIN chosen at random? (log₂ 10 ≈ 3.32)",o:["13.3 bits","40 bits","4 bits","10 bits"],a:0,why:"l × log₂(n) = 4 × 3.32 = 13.3 bits."},
{q:"Which random password has the higher entropy?",o:["12 lowercase letters (about 56 bits)","8 characters from all 94 typeable characters (about 52 bits)","They are equal","It cannot be calculated"],a:0,why:"12 × log₂(26) = 56.4 bits beats 8 × log₂(94) = 52.4 bits. Length matters a lot."},
{q:"Use Shannon's estimate for an 8-character password chosen by a person.",o:["20.8 bits","37.6 bits","18.4 bits","25.3 bits"],a:0,why:"4.7 for the first character plus 7 × 2.3 for characters 2 to 8: 4.7 + 16.1 = 20.8 bits."},
{q:"The formula gives password123 about 57 bits. Why is it still a terrible password?",o:["The formula assumes random choice, and attackers try common passwords first","57 bits is always too low","It contains no symbols","It is longer than 8 characters"],a:0,why:"Humans are not random. Entropy from the formula overstates the strength of predictable passwords."},
{q:"What does the UK's NCSC recommend for memorable, strong passwords?",o:["Three random words","Changing the password every 30 days","At least one symbol, one digit and one capital","Writing it down in a notebook"],a:0,why:"The advice favours length over complexity and recognises how people really behave."},
{q:"Which statement about salts is correct?",o:["Each password gets its own random salt, stored next to the hash","The salt must be kept secret from attackers","One salt should be shared by all users","A salt of 8 bits is long enough"],a:0,why:"A salt randomises; it is not secret. It must be unique per password and long, for example 256 bits for SHA-256."},
{q:"Why are password hashes like bcrypt deliberately slow?",o:["It makes an attacker's billions of guesses very expensive","It makes the hash output longer","It lets the server reverse the hash later","It removes the need for a salt"],a:0,why:"One honest login barely notices the delay, but mass guessing becomes costly."},
{q:"An attacker tries Winter2026! against 500 different accounts, then waits. Which attack is this?",o:["Password spraying","Brute force","Credential stuffing","Account enumeration"],a:0,why:"A few common passwords against many accounts, staying under lockout limits. It is the reverse of brute force."},
{q:"An attacker uses username and password pairs leaked from another website. Which attack is this?",o:["Credential stuffing","Dictionary attack","Password spraying","Pre-computed hash table"],a:0,why:"It works because people reuse passwords. Unique passwords and MFA defend against it."},
{q:"Which attack does salting defeat most directly?",o:["Pre-computed hash tables","Password spraying","Account enumeration","Shoulder surfing"],a:0,why:"A table of hashes worked out in advance is useless when every password is hashed with its own salt."},
{q:"A login page says \"Username does not exist\" for unknown names and \"Incorrect password\" for real ones. What does this enable?",o:["Account enumeration","Credential stuffing","Privilege escalation","A collision attack"],a:0,why:"The two messages reveal which accounts exist. Use one generic message such as \"Invalid username or password\"."},
{q:"In the log line <code>web01 sshd[2451]: Failed password for invalid user oracle</code>, what is 2451?",o:["The process ID of sshd","The user ID of oracle","The source port","The number of failed attempts"],a:0,why:"The syslog layout is PROCESS[PID]. The source port appears later in the message, after the IP address."},
{q:"A log shows Accepted logins for jsmith, adurand and rkhan from one IP within minutes, with no failures first. Which pattern fits best?",o:["Credential stuffing","Brute force","Account enumeration","Password spraying"],a:0,why:"The attacker already had working pairs, so there are few or no failures. It is still a clue, not proof."},
{q:"A log shows <code>sudo: kim … USER=root ; COMMAND=/bin/bash</code>. What can you conclude?",o:["kim started a root shell, which may be perfectly normal admin work","The server has definitely been attacked","kim's password was brute forced","kim's account does not exist"],a:0,why:"Using sudo is routine for administrators. Check whether kim is authorised and what happened next."},
{q:"During a passkey login, what does your device do with the service's challenge?",o:["Signs it with the private key","Encrypts it with the service's password","Sends the private key back with it","Hashes it with a salt"],a:0,why:"The service verifies the signature with your public key. The private key never leaves the device."},
{q:"Why can't a phishing website collect your passkey?",o:["The device only offers the passkey to the genuine service it was created for","Passkeys are too long to type","The passkey changes every 30 seconds","Phishing sites cannot use HTTPS"],a:0,why:"There is no secret to type, and each challenge is different, so nothing reusable can be captured."},
{q:"A fingerprint reader accepts 76 of 80 genuine attempts. What is its False Reject Rate?",o:["5%","95%","4%","76%"],a:0,why:"FRR = FN / (TP + FN) = 4 / 80 = 5%. The TAR is the other 95%."},
{q:"Out of 500 impostor attempts, a face scanner accepts 10. What is its False Accept Rate?",o:["2%","98%","10%","0.2%"],a:0,why:"FAR = FP / (FP + TN) = 10 / 500 = 2%. The TRR is 98%."},
{q:"You make a biometric matching threshold stricter. What happens?",o:["FAR goes down and FRR goes up","FAR goes up and FRR goes down","Both go down","Both go up"],a:0,why:"Fewer impostors get in, but more genuine users are rejected. More secure, more annoying."},
{q:"An airport camera compares a face against every template in a database to work out who the person is. Which mode is this?",o:["Identification (one-to-many)","Verification (one-to-one)","Enrolment","Authorisation"],a:0,why:"Verification checks one claimed identity against one template. Identification searches many."},
{q:"In keystroke dynamics, what is dwell time?",o:["How long a key is held down","The gap between releasing one key and pressing the next","The time taken to enrol","The time before the account locks"],a:0,why:"Dwell time is the hold. Flight time is the gap between keys."},
{q:"Write <code>rwxr-xr--</code> as a number.",o:["754","764","751","745"],a:0,why:"Owner rwx = 4+2+1 = 7. Group r-x = 4+0+1 = 5. World r-- = 4."},
{q:"What does <code>chmod 640 report.txt</code> allow?",o:["Owner reads and writes, group reads, everyone else gets nothing","Owner reads, group writes, everyone else executes","Everyone can read and write","Owner has full access, group and world can read"],a:0,why:"6 = rw-, 4 = r--, 0 = ---."},
{q:"In the Lampson model, what does the reference monitor do?",o:["Checks every access request against the rules before allowing it","Stores the user's password hash","Encrypts the object","Logs the user out after a time limit"],a:0,why:"Access is never direct: the subject's request to the object always goes through the reference monitor."},
{q:"What does steganography hide that cryptography does not?",o:["The existence of the message","The meaning of the message","The length of the key","The identity of the receiver"],a:0,why:"Ciphertext is obvious gibberish that signals a secret. A stego-object looks like an ordinary file."},
{q:"LSB hiding: the cover byte is <code>11001000</code> and the payload bit is 1. What is the stego byte?",o:["11001001","01001000","11001000","11001010"],a:0,why:"Only the last bit is replaced with the payload bit, so the value changes by at most 1."},
{q:"How many bytes can you hide in a 400 × 300 image (24-bit RGB, one LSB per colour byte)?",o:["45,000 bytes","360,000 bytes","120,000 bytes","15,000 bytes"],a:0,why:"120,000 pixels × 3 bits = 360,000 bits, and 360,000 / 8 = 45,000 bytes."},
{q:"Which Java expression reads the LSB of <code>byt</code>?",o:["<code>byt &amp; 0x1</code>","<code>byt | 0x1</code>","<code>byt &lt;&lt; 1</code>","<code>byt &amp; ~0x1</code>"],a:0,why:"AND with 1 keeps only the last bit. OR with 1 sets it; AND with ~1 clears it."},
{q:"Why do LSB methods normally use PNG or BMP rather than JPEG?",o:["Lossy compression changes pixel values and destroys the hidden bits","JPEG files cannot store colour","PNG files are always smaller","JPEG pixels have no least significant bit"],a:0,why:"The hidden data lives in exact pixel values, so the format must be lossless."}
],

practice:[
{q:"Classify each as knowledge, token or biometric: (a) PIN, (b) bank OTP device, (c) iris scan, (d) answer to a security question, (e) smartphone key. Which of these pairs is real MFA: PIN + password? password + OTP device? fingerprint + face scan?",a:"(a) knowledge, (b) token, (c) biometric, (d) knowledge, (e) token. PIN + password: not MFA (both knowledge). Password + OTP device: MFA. Fingerprint + face: not MFA (both biometric)."},
{q:"Fred types his username, enters his password, then the system lets him open a file but not delete it. Name each of the three steps.",a:"Identification (username), authentication (password), authorisation (what he's allowed to do with the file)."},
{q:"Calculate the entropy of: (a) a 6-digit PIN, (b) 10 random lowercase letters.",a:"(a) 6 × log<sub>2</sub>(10) = 19.9 bits. (b) 10 × log<sub>2</sub>(26) = 47.0 bits."},
{q:"password123 scores about 57 bits using the formula, yet it's a terrible password. Why?",a:"The formula assumes the password was chosen randomly. People pick predictable passwords, and attackers try common ones first, so real strength is far lower than 57 bits."},
{q:"Use Shannon's method to estimate the entropy of a 10-character password.",a:"4.7 + (7 × 2.3) + (2 × 1.5) = 4.7 + 16.1 + 3.0 = 23.8 bits."},
{q:"Why are passwords stored with a salt? Does the salt need to be secret? Why must it be long?",a:"A salt (random, per-user, added before hashing) makes identical passwords produce different hashes and defeats pre-computed tables, forcing the attacker to crack each password separately. It does not need to be secret (it's stored with the hash). It must be long (e.g. 256 bits) so an attacker can't try every possible salt; an 8-bit salt has only 256 values."},
{q:"Why use a deliberately slow hash like bcrypt for passwords, when a fast hash like SHA-256 is fine for checking file downloads?",a:"A slow hash adds little cost to one honest login but makes an attacker's billions of guesses hugely expensive. A file check hashes once, so speed is good and there's no mass guessing."},
{q:"Name the attack: (a) one account, every possible password; (b) a few common passwords across hundreds of accounts; (c) username/password pairs from a previous breach; (d) hashing a word list in advance into a lookup table.",a:"(a) Brute force. (b) Password spraying. (c) Credential stuffing. (d) Pre-computed hash table (a dictionary attack done in advance); salting defeats it."},
{q:"A login page says \"Username does not exist\" for unknown names and \"Incorrect password\" for real ones. What's the problem and the fix?",a:"It leaks which usernames exist (account enumeration). Fix: show the same generic message, such as \"Invalid username or password\", whichever part was wrong (and do the same on reset/registration pages)."},
{q:"Describe the steps of passkey authentication. Why can't a phishing website steal a passkey?",a:"Setup: a key pair is created; public key to the service, private key stays on the device. Login: unlock the device (e.g. fingerprint); the service sends a random challenge; the device signs it with the private key; the service verifies with the public key. A phishing site can't steal it because the private key never leaves the device and the device only offers the passkey to the genuine service it was created for."},
{q:"A biometric system gets 90 of 100 genuine attempts accepted; and of 400 impostor attempts, 8 are accepted. Find TAR, FRR, FAR and TRR.",a:"TAR = 90/100 = 90%. FRR = 10/100 = 10%. FAR = 8/400 = 2%. TRR = 392/400 = 98%."},
{q:"What happens to FAR and FRR if you make the matching threshold stricter? What does a ROC curve show, and what does a better system's curve look like?",a:"A stricter threshold lowers FAR (fewer impostors accepted) but raises FRR (more genuine users rejected). The ROC curve plots TAR against FAR across threshold settings; a better system's curve bulges toward the top-left, well above the diagonal random-guessing line."},
{q:"Explain verification vs identification in biometrics, and dwell time vs flight time.",a:"Verification: one-to-one check of a claimed identity. Identification: one-to-many search to work out who someone is. Dwell time: how long a key is held down. Flight time: the gap between keys."},
{q:"Read this log excerpt and say what pattern it fits and what you'd check next:"+pre(`
Mar 09 03:10:01 web01 sshd[7001]: Failed password for invalid user test from 203.0.113.50
Mar 09 03:10:02 web01 sshd[7002]: Failed password for invalid user guest from 203.0.113.50
Mar 09 03:10:03 web01 sshd[7003]: Failed password for invalid user ubuntu from 203.0.113.50
Mar 09 03:10:04 web01 sshd[7004]: Failed password for admin from 203.0.113.50`),a:"Account enumeration: many different usernames in quick succession from one IP, with \"invalid user\" meaning those accounts don't exist (while admin, with no \"invalid user\", apparently does). It's a clue, not proof. Check the source IP, whether it continues, whether there are later successful logins, and whether it matches normal activity."},
{q:"In the log line <code>sudo: kim : TTY=pts/1 ; PWD=/home/kim ; USER=root ; COMMAND=/bin/bash</code>, what happened, and does it prove an attack?",a:"User kim used sudo to start a Bash shell as root, so later commands in that shell run with root privileges. It does not prove an attack: admins do this routinely. Check whether kim is authorised, whether authentication succeeded, what commands came next, and whether the timing is expected."},
{q:"Read <code>rwxr-x---</code> and <code>644</code>: who can do what, and what is the other form of each?",a:"rwxr-x---: owner read/write/execute, group read/execute, world nothing = 750. 644: owner 6 = rw-, group 4 = r--, world 4 = r--, so rw-r--r--."},
{q:"In the Lampson model, name the three components and say what the reference monitor does.",a:"Subject (the user or program requesting), object (the resource), reference monitor (the gatekeeper that checks every access request against the rules before allowing or denying it)."},
{q:"How does steganography differ from cryptography? Give a term for each of: the secret, the carrier, and the result.",a:"Cryptography hides the meaning of a message; steganography hides its existence. Payload = the secret, cover object = the carrier, stego-object = the result."},
{q:"Why is changing the LSB of a pixel value invisible but changing the MSB obvious? Use 165, 164, and 37.",a:"165 = 10100101 and 164 = 10100100 differ by 1 (a flipped LSB), an imperceptible colour change. 37 = 00100101 differs from 165 by 128 (a flipped MSB), a visibly darker colour."},
{q:"Hide payload bits 1, 1, 0, 0 in cover bytes 11010110, 10101010, 01110001, 00001111 using LSB.",a:"Stego bytes: 11010111, 10101011, 01110000, 00001110 (each last bit replaced by 1, 1, 0, 0)."},
{q:"How many bytes can be hidden in a 200 × 100 image using one LSB per colour channel (24-bit RGB)?",a:"200 × 100 = 20,000 pixels × 3 bits = 60,000 bits = 7,500 bytes."}
],

glossary:[
["Authentication","Proving who you are"],
["Authorisation","Deciding what you may do"],
["Account enumeration","Discovering which accounts exist, often via different error messages"],
["bcrypt","A deliberately slow password hash based on Blowfish"],
["Biometric template","Stored features extracted from a biometric trait"],
["Brute force","Trying every possible password on one account"],
["Dictionary attack","Trying a pre-made list of likely passwords"],
["Password spraying","Trying a few common passwords across many accounts"],
["Credential stuffing","Using real leaked username and password pairs on other sites"],
["Cover object","The innocent-looking carrier that hides the secret"],
["Stego-object","The carrier after the secret has been hidden in it"],
["Payload","The secret being hidden"],
["Entropy","A measure of unpredictability, in bits; l × log2(n) for random passwords"],
["FAR","False Accept Rate: how often an impostor is accepted"],
["FRR","False Reject Rate: how often a genuine user is rejected"],
["LSB","Least significant bit: the rightmost bit, worth 1"],
["MSB","Most significant bit: the leftmost bit, worth 128 in a byte"],
["MFA","Two or more factors from different categories"],
["Passkey","Private key on your device, public key on the service; login by signing a challenge"],
["Privilege escalation","Gaining higher privileges, such as root"],
["Reference monitor","Mediates every access request in the Lampson model"],
["Salt","Random per-password value added before hashing; stored openly"],
["Steganography","Hiding the existence of a message"],
["Unix permissions","r, w, x for owner, group and world; for example rwxrw-r-- = 764"]
],

checklist:[
"Explain identification vs authentication vs authorisation, with an example",
"Name the three factors and say what makes something real MFA",
"Calculate password entropy with the formula and with Shannon's method, and explain the limitation",
"Explain hashing, salting, slow hashes, and the login check process",
"Tell apart brute force, dictionary, spraying, credential stuffing, and account enumeration",
"Read a syslog line and recognise the five log patterns (and say why each is only a clue)",
"Explain how passkeys work and why they resist phishing",
"Calculate TAR, FRR, FAR, TRR; explain the threshold trade-off and the ROC curve",
"Describe face, iris, retina, fingerprint and behavioural biometrics, plus bias and other concerns",
"Explain the Lampson model and read Unix permissions (letters and numbers)",
"Explain steganography vs cryptography and the payload / cover / stego-object terms",
"Hide and extract bits using the LSB algorithm, and explain why LSB changes are invisible"
]
});
