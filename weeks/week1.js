COURSE.add({
n:1,
title:"Cyber Security and Cryptography Basics",
blurb:"The vocabulary of cyber security, the CIA triad and risk assessment, then ciphers from Caesar to AES and how block cipher modes work.",
topics:["CIA triad","Threats and risk","Caesar and Vigenère","XOR and stream ciphers","Block ciphers","Feistel, Blowfish, AES","ECB vs CBC"],
labs:["risk","caesar","xor"],

parts:[
{tag:"A",title:"What cyber security is",html:`
<p>Cyber security is about protecting systems, networks, and information from people who want to misuse, damage, or steal them, and from accidents that cause similar harm.</p>

<h3>A1. Three terms that sound alike</h3>
${tbl(["Term","Meaning","Example"],[
["Cyber security","Security of any device connected to a network","A smartphone connected to the internet"],
["Information security","Security of any information, digital or physical","A password database and a paper file in a locked cabinet"],
["Computer security","Security of any computing device","A standalone laptop, even offline"]
])}

<h3>A2. The cyber security process: Prevent, Detect, Respond</h3>
<p>Security is not a single lock. It is a cycle of three activities:</p>
<ul>
<li><strong>Prevent:</strong> stop attacks happening (firewalls, strong passwords, patching, training).</li>
<li><strong>Detect:</strong> notice when something is going wrong (logs, monitoring, alerts).</li>
<li><strong>Respond:</strong> deal with it when it happens (contain, fix, recover, learn).</li>
</ul>
<p>No prevention is perfect, which is why detection and response matter just as much.</p>

<h3>A3. Risk management in one sentence</h3>
<p>Identify <strong>assets</strong> (what you want to protect), work out the <strong>risks</strong> to them, then choose <strong>mitigations</strong> (things that reduce the risk). Part B shows how to do this step by step.</p>

<h3>A4. The CIA triad</h3>
<p>This is the most important idea in information security. Everything else hangs off it.</p>
${tbl(["Principle","Plain English","What breaking it looks like"],[
["Confidentiality","Information should only be viewed by authorised users","A data breach; someone reads your private messages"],
["Integrity","Information should not be altered without appropriate authorisation","Someone secretly changes exam marks or a bank balance"],
["Availability","Information should be available to legitimate users in line with the design of the system","Ransomware locks your files; a DDoS attack takes a website down"]
])}
${note("key","<strong>Where cryptography fits:</strong> encryption mainly protects confidentiality. Hashing and digital signatures (Week 2) mainly protect integrity. Backups and redundancy protect availability.")}

<h3>A5. Attackers: different names, same idea</h3>
<p>Your slides list <em>bad actor</em>, <em>threat actor</em>, <em>malicious actor</em>, and <em>attacker</em>. They all mean someone (or something) that carries out an attack. Attacks are either <strong>malicious</strong> (deliberate harm, like a hacker stealing data) or <strong>non-malicious</strong> (accidental, like an employee emailing a file to the wrong person or misconfiguring a server). Both can cause real damage, and good security plans for both.</p>

<h3>A6. Vulnerability, threat, attack</h3>
${tbl(["Term","Definition from the slides","Everyday analogy"],[
["Vulnerability","A limitation which opens a system to potential attack","A window left unlocked"],
["Threat","Something or someone which poses harm to a system","A burglar who might try the window"],
["Attack","An event which aims to exploit a vulnerability","The burglar climbing in through the window"]
])}
<p>The Death Star slide is a famous example: a tiny exhaust port was the vulnerability, the rebels were the threat, and the torpedo run was the attack.</p>

<h3>A7. Attack surface and attack vector</h3>
<ul>
<li><strong>Attack surface:</strong> the collection of all entry points an unauthorised attacker could try to exploit (open ports, web forms, email inboxes, staff, USB ports). A smaller attack surface is safer.</li>
<li><strong>Attack vector:</strong> the specific path an attacker actually used to get in (for example a phishing email, or a stolen password used on SSH).</li>
</ul>
<p>Easy way to remember: the surface is every door and window in the building; the vector is the one the burglar used.</p>

<h3>A8. Laws and regulations (UK)</h3>
${tbl(["Law","What it is about, in short"],[
["Computer Misuse Act 1990","Makes it a crime to access or modify computer systems or data without authorisation, including hacking, spreading malware, and disrupting systems."],
["Serious Crime Act 2015","Among other things, updated the computer misuse offences, including an offence for unauthorised acts that cause serious damage."],
["Data Protection Act 2018","UK law on how organisations must handle personal data (works alongside UK GDPR)."]
])}
${note("why","Scanning, probing, or accessing systems you don't own, without written permission, can be a criminal offence in the UK, even if you mean no harm and even if you don't steal anything. Only practise on your own machines or on legal practice platforms. Check your lecture notes for exactly what the lecturer wants you to know about each law.")}
`},

{tag:"B",title:"The security mindset and risk assessment",html:`
<p>Security professionals think in questions. When something suspicious happens, they ask:</p>
${tbl(["Question","Why it matters"],[
["What happened?","Describe the event factually"],
["When did it happen?","Builds a timeline"],
["Who was involved?","Which accounts, devices, or people"],
["Was the system compromised?","Did the attacker succeed?"],
["What evidence supports that conclusion?","Conclusions need proof (logs, files, traffic), not guesses"],
["What is the impact?","Which assets and what harm"],
["What do we do now?","Decide the response"]
])}

<h3>B1. Balancing</h3>
<p>Security is never free and never perfect. The Balancing slide shows icons that appear to stand for cost (money), time, people and usability, and technical resources or performance. The point: every security control has trade-offs. Super-strict passwords improve security but annoy users; heavy encryption can slow a system; extra monitoring costs money. A good security decision balances protection against these costs, like a sound engineer adjusting sliders on a mixing desk (that's the image on the slide).</p>

<h3>B2. Risk assessment: the six steps</h3>
<p>A risk assessment is a structured way to identify, evaluate, and address vulnerabilities. Frameworks differ, but most share these steps:</p>
${tbl(["Step","Name","What you do"],[
["1","Scope","Draw the boundary: what is and is not included (the tennis-court line on the slide)"],
["2","Identify assets","What are we trying to protect? Anything of value: equipment, systems, services, software, data, money, tangible or intangible"],
["3","Identify threats and vulnerabilities","What could cause harm, and what weaknesses (in people, process, or technology) could be exploited?"],
["4","Assess risk","Rate likelihood and impact"],
["5","Identify mitigations","Technical (cryptography, network security tools) and human (policy, culture, training)"],
["6","Implement and monitor","Put controls in place, check they work, review regularly"]
])}
<p><strong>Assets drive cyber security.</strong> For each asset ask three things: what threats could harm it, what vulnerabilities could be exploited, and what would the impact be?</p>

<h3>B3. Finding evidence: logs</h3>
<p>Step 3 uses data and analysis (for example from logs), technical tests, experience, and other relevant data such as industry reports. Your slides show a log of successful SSH logins:</p>
${pre(`
Jan 1 00:19:30 server sshd[6190]: Accepted password for support
                                  from 192.168.1.14 port 22 ssh2
Jan 1 01:23:49 server sshd[8916]: Accepted password for admin
                                  from 192.168.1.29 port 22 ssh2`)}
<p>Read it as: <strong>when</strong> (Jan 1, 00:19), <strong>which service</strong> (sshd, the SSH server), <strong>what happened</strong> (a password login was accepted), <strong>which account</strong> (support), <strong>from where</strong> (192.168.1.14).</p>
<p>Good analyst questions on a log like this: Are generic accounts like guest, support and admin meant to log in this way? Is it normal for these logins to happen in the early hours? Are passwords alone enough, or should there be multi-factor authentication or key-based login? Questions come before conclusions.</p>

<h3>B4. A finding is not a risk</h3>
<p>This is one of the key slides. "37 failed logins" is a <strong>finding</strong>. The <strong>risk</strong> is the possible consequence for an asset. Work through it in order:</p>
${tbl(["Stage","Example from the slide"],[
["Discovery (finding)","Repeated unusual access attempts were observed"],
["Threat","A bad actor"],
["Vulnerability","Weak authentication controls"],
["Impact","Sensitive information could be exposed"],
["Risk","A bad actor could exploit weak authentication controls to gain access to the system"]
])}
<h4>The risk statement template</h4>
${pre("<threat> exploiting <vulnerability> resulting in <impact>")}
<p>Example from the slides: "Malicious actor exploiting weak password resulting in sensitive information exposed." Memorise this three-part pattern; you will use it again and again.</p>

<h3>B5. Assess the risk: likelihood and impact</h3>
<p>Step 4 rates each risk on two scales and combines them. Likelihood runs from Rare to Certain; impact runs from Insignificant to Critical. Where they meet shows how serious the risk is. Your slide marks this as a toy (simplified) example. The matrix below starts with the password risk placed at Likely and Major. Your lecturer may place it differently, so use this just to understand the method.</p>
${lab("risk")}
<p>Green is low risk, yellow medium, orange high, red the most urgent. High-likelihood and high-impact risks (top right) are dealt with first.</p>

<h3>B6. Mitigate, implement, monitor</h3>
<ul>
<li><strong>Technical mitigations:</strong> cryptography, firewalls, network security tools, multi-factor authentication (MFA).</li>
<li><strong>Human mitigations:</strong> policies, security culture, training.</li>
<li><strong>Monitor effectiveness:</strong> are controls working? (For example, are failed login attempts going down after adding MFA?)</li>
<li><strong>Review:</strong> risks change over time, and controls may need adapting.</li>
</ul>

<h3>B7. It's a cycle (Plan, Do, Check, Act)</h3>
<p>Risk management repeats: identify risks, assess risks, treat risks, implement controls, monitor and review, then start again. It lines up with the Plan-Do-Check-Act cycle on your slide. Security is never finished.</p>
${note("ex","Pick something you own, like your phone. List 3 assets on it (photos, banking app, email), one threat to each, one vulnerability, one impact, then write three risk statements using the template. Rate each one's likelihood and impact.")}
`},

{tag:"C",title:"Cryptography basics",html:`
<p>Cryptography is the science of making information unreadable to everyone except the intended reader. (It has nothing to do with cryptocurrency, apart from being used inside it.)</p>

<h3>C1. The three components</h3>
${tbl(["Component","Meaning","Slide example"],[
["Plaintext","The original, readable message","bowties are cool"],
["Key","The secret that controls the scrambling. The slide uses a symbol for every letter of the alphabet","A = tick, B = bicycle, C = square, …"],
["Ciphertext","The scrambled result","A string of symbols"]
])}
<p>Here the key is a lookup table mapping each letter to a symbol. Anyone without that table sees only meaningless pictures. A <strong>cipher</strong> is the method; the <strong>key</strong> is the secret input to that method.</p>

<h3>C2. Alice, Bob and Eve</h3>
<p>Cryptography uses a standard cast: <strong>Alice</strong> wants to send a message to <strong>Bob</strong> over a channel, and <strong>Eve</strong> (for eavesdropper) is listening in. Alice and Bob want to ensure Eve learns nothing useful from what she intercepts. The aim is that Eve sees ciphertext only, and without the key it is useless to her.</p>
${pre(`
Alice ----[ciphertext]-------------------> Bob
                 |
                Eve (listening)`)}

<h3>C3. The notation</h3>
${pre(`
E_K(P) = C     Encrypt plaintext P using key K to get ciphertext C
D_K(C) = P     Decrypt ciphertext C using key K to get plaintext P`)}
<p>E is encryption, D is decryption, K is the key, P plaintext, C ciphertext. In these examples the same key is used both ways, which is called <strong>symmetric</strong> cryptography. Everything in Week 1 is symmetric. Asymmetric cryptography, with different keys for each direction, is Week 2.</p>
${note("link","When you captured an HTTPS connection in Wireshark and saw unreadable Application Data, that was ciphertext. Your browser and the server had agreed on a key, and a block cipher like AES (Part G) was scrambling the traffic. The theory in this module is what protects almost everything you do online.")}
`},

{tag:"D",title:"Classic ciphers: substitution and permutation",html:`
<p>These old ciphers are no longer secure, but they teach the core ideas used in modern cryptography. There are two basic operations: <strong>substitution</strong> (replace symbols with other symbols) and <strong>permutation</strong> (rearrange the positions of symbols).</p>

<h3>D1. Caesar cipher (substitution)</h3>
<p>Shift every letter forward in the alphabet by the key. With key = 3, A becomes D, B becomes E, and so on, wrapping around at the end (X becomes A, Y becomes B, Z becomes C).</p>
${pre(`
Plain:   A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
Cipher:  D E F G H I J K L M N O P Q R S T U V W X Y Z A B C`)}
<p>Example from your slide (key = 3):</p>
${pre(`
Plaintext:   LIFE FINDS A WAY
Ciphertext:  OLIH ILQGV D ZDB`)}
<p>L to O, I to L, F to I, E to H. To decrypt, shift backwards by 3.</p>
<p><strong>Why it's weak:</strong> there are only 25 possible keys, so an attacker can try them all in seconds (brute force). Letter frequency also gives it away, since E is the most common letter in English.</p>

<h3>D2. Vigenère cipher (substitution with a keyword)</h3>
<p>Instead of one shift for the whole message, use a keyword. Each letter of the keyword gives a different shift, and the keyword repeats. First turn letters into numbers:</p>
${pre(`
A=0  B=1  C=2  D=3  E=4  F=5  G=6  H=7  I=8  J=9  K=10 L=11 M=12
N=13 O=14 P=15 Q=16 R=17 S=18 T=19 U=20 V=21 W=22 X=23 Y=24 Z=25`)}
<p><strong>Method:</strong> add the plaintext letter's number to the keyword letter's number; if the total goes past 25, subtract 26 (wrap around); turn the result back into a letter.</p>
<p>Example from your slide: keyword KEY (repeated: K E Y K E), plaintext HELLO:</p>
${tbl(["","1","2","3","4","5"],[
["Plaintext","H (7)","E (4)","L (11)","L (11)","O (14)"],
["Key letter","K (10)","E (4)","Y (24)","K (10)","E (4)"],
["Sum","17","8","35 − 26 = 9","21","18"],
["Ciphertext","R","I","J","V","S"]
])}
<p>Second slide example: keyword ALICE, plaintext HELLO gives HPTNS. For a longer message the keyword repeats along the plaintext:</p>
${pre(`
Keyword:    A L I C E A L I
Plaintext:  H E L L O B O B
Ciphertext: H P T N S B Z J`)}
<p>The slide also shows the <strong>Vigenère square</strong>: find the plaintext letter along the top row and the key letter down the left column; where they meet is the ciphertext letter. It is the same maths as adding numbers, just done as a table lookup.</p>
<p><strong>Why it's better than Caesar:</strong> the same plaintext letter (like the two Ls in HELLO) can become different ciphertext letters (T and N), which hides letter frequency. It was once called unbreakable, but it can still be broken by finding the keyword length.</p>
${lab("caesar")}

<h3>D3. Permutation (rearranging letters)</h3>
<p>A permutation does not change the letters, only their order. The slide's example writes the letters alternately into two rows, then reads row 1 followed by row 2:</p>
${pre(`
Plaintext:  HELLO WORLD

Row 1:  H   L   O   O   L       (letters 1,3,5,7,9)
Row 2:    E   L   W   R   D     (letters 2,4,6,8,10)

Ciphertext: HLOOL ELWRD   ->   HLOOLELWRD`)}
<p>Notice the ciphertext uses exactly the same letters as the plaintext. Substitution changes <em>what</em> the letters are; permutation changes <em>where</em> they are.</p>
${note("key","Modern ciphers like AES combine both substitution and permutation, repeatedly, over many rounds. You are learning the building blocks.")}
`},

{tag:"E",title:"Stream ciphers and XOR",html:`
<p>A stream cipher encrypts a continuous stream of data, bit by bit (or byte by byte), by combining it with a stream of key bits. The usual operation is <strong>XOR</strong> (written ⊕, a circled plus, on your slide).</p>

<h3>E1. XOR in 10 seconds</h3>
<p>XOR compares two bits: the output is 1 if the bits are <strong>different</strong>, and 0 if they are the <strong>same</strong>.</p>
${tbl(["A","B","A XOR B"],[["0","0","0"],["0","1","1"],["1","0","1"],["1","1","0"]])}

<h3>E2. Slide example</h3>
${pre(`
P:        1101101101
K:        1100010101
          ----------
E_K(P) =  0001111000`)}
<p>Go through it column by column: 1 and 1 are the same so 0; 1 and 1 so 0; 0 and 0 so 0; 1 and 0 differ so 1; and so on.</p>

<h3>E3. Decryption is the same operation</h3>
<p>XOR with the key again and you get the plaintext back, because XOR-ing the same value twice cancels out:</p>
${pre(`
E_K(P) = 0001111000
K      = 1100010101
         ----------
P      = 1101101101     <- original recovered`)}
<p>This is why XOR is so popular in cryptography: one simple, fast operation does both jobs.</p>
${lab("xor")}
${note("warn","<strong>Never reuse a key stream.</strong> If two messages are XOR-encrypted with the same key, an attacker can XOR the two ciphertexts together and the key cancels out, leaking information about both messages. Real stream ciphers generate a long, unpredictable key stream from a short key, and never repeat it.")}
`},

{tag:"F",title:"Block ciphers and padding",html:`
<p>A block cipher splits the data into fixed-size blocks and encrypts each block as a unit (compare that with a stream cipher, which flows continuously).</p>

<h3>F1. Splitting into blocks</h3>
${pre(`
Data:    101101011100101011101010              (24 bits)
Blocks:  1011 0101 1100 1010 1110 1010         (block size = 4 bits)`)}

<h3>F2. A basic block cipher (block size 8 bits)</h3>
<p>From your slide. For each 8-bit block:</p>
<ol>
<li>Split it into two halves (01100010 becomes 0110 and 0010).</li>
<li>Switch the halves (0010 0110).</li>
<li>XOR with the key.</li>
</ol>
<p>Key = 01101101. The plaintext on the slide is 01100010 01111001 01100101 01100010 01101111 01100010, which spells "byebob" in ASCII. First block:</p>
${pre(`
Block:    01100010
Split:    0110 | 0010
Switch:   0010 | 0110   = 00100110
XOR key:  00100110 XOR 01101101 = 01001011     (matches the slide)

Second block 01111001 -> 0111|1001 -> 1001|0111 -> XOR key = 11111010 (matches)`)}
<p>Notice that the first and fourth blocks of "byebob" are both the letter b (01100010), so they encrypt to the identical ciphertext 01001011. That repetition leaks information. This weakness is the exact drawback of ECB that your later slide asks about (see Part G).</p>

<h3>F3. Padding</h3>
<p>Block ciphers need complete blocks. If the message does not fill the last block, it is <strong>padded</strong>. The slide gives the CMS rule (cited there as RFC 8933): add <code>k − (l mod k)</code> bytes, each with the value <code>k − (l mod k)</code>, where k is the block size in bytes and l is the message length in bytes.</p>
<p>Slide example: block size 8, message of 12 bytes (the slide words this as "key of 8 bytes", but k here is really the block size). 12 mod 8 = 4, so we need 8 − 4 = 4 padding bytes, each with the value 4:</p>
${pre("message (12 bytes) + 04 04 04 04   ->   16 bytes = two full 8-byte blocks")}
<p>Using the value of the padding as the byte makes it easy for the receiver to remove it: read the last byte, and it tells you how many to strip. If the message already fills the blocks exactly, a full block of padding is added so the receiver can always tell.</p>
${note("warn","The slide also warns that careless padding can lead to a <strong>Bleichenbacher attack</strong> (an attack that exploits how padding errors are handled). The takeaway: padding details are security-relevant.")}
`},

{tag:"G",title:"Modern block ciphers",html:`
<p>Real-world ciphers (DES, Blowfish, AES) are built from a few simple building blocks, repeated many times. Learn the blocks and the big designs stop being scary.</p>

<h3>G1. Confusion and diffusion</h3>
${tbl(["Property","Meaning from the slides","Plain English"],[
["Confusion","Each bit of the ciphertext depends on multiple parts of the key","Hide the link between key and ciphertext"],
["Diffusion","If one bit of the plaintext changes, multiple bits of the ciphertext should change","Spread each input bit's influence everywhere"]
])}
<p>Good ciphers have both. A one-letter change in your message should scramble the ciphertext beyond recognition.</p>

<h3>G2. S-box (substitution box)</h3>
<p>An S-box substitutes a small group of bits for another using a fixed lookup table. In the slide's example, the input is 6 bits and the output is 4 bits. How to read it:</p>
<ol>
<li>Take the <strong>outer bits</strong> (first and last) to choose the row.</li>
<li>Take the <strong>4 middle bits</strong> to choose the column.</li>
<li>The value where they meet is the output.</li>
</ol>
<p>Slide example: input 101001. Outer bits are 1 and 1, so row 11. Middle bits are 0100, so column 0100 (the 5th entry, counting from 0000). Row 11 begins:</p>
${tbl(["Column","0000","0001","0010","0011","0100","0101"],[["Row 11","0101","1100","1000","0010","<strong>0100</strong>","1001"]])}
<p>Output: 0100, which matches the slide. S-boxes provide <strong>confusion</strong>.</p>

<h3>G3. P-box (permutation box)</h3>
<p>A P-box rearranges bit positions (the permutation idea from Part D). Three types in your slides, shown with six blocks B1 to B6:</p>
${tbl(["Type","What it does","Example"],[
["Straight","Only permutes (same number out as in)","B1 B2 B3 B4 B5 B6 becomes B6 B2 B3 B4 B5 B1"],
["Compression","Permutes and removes some blocks (fewer out than in)","B1 B2 B3 B4 B5 B6 becomes B6 B3 B5 B1"],
["Expansion","Permutes and duplicates some blocks (more out than in)","B1 B2 B3 B4 B5 B6 becomes B6 B2 B3 B3 B4 B5 B1"]
])}
<p>P-boxes provide <strong>diffusion</strong>, spreading bits around.</p>

<h3>G4. Key schedule</h3>
<p>Ciphers run many rounds, and each round uses a different <strong>round key</strong>. The key schedule is the algorithm that takes your one secret key and generates the full set of round keys. Older key schedules were simple (permutations), while modern ones are more complex.</p>
${pre("KEY   ->   [ KEY SCHEDULE ALGORITHM ]   ->   K1, K2, K3, ... (round keys)")}

<h3>G5. Feistel cipher</h3>
<p>A Feistel cipher is a design pattern that many famous ciphers follow. Split the block into a left half (L) and right half (R), then repeat rounds. In each round:</p>
${pre(`
new L = R
new R = L XOR f(Ki, R)`)}
<p>Here f is a round function that mixes R with that round's subkey Ki (from the key schedule). In the slide's diagram, R goes down unchanged while also feeding f; the result is XOR'd into L; then the two halves swap sides. After n rounds, you have the ciphertext block.</p>
<p><strong>Toy example</strong> (not secure; the real f is much more complex). Let f(K, R) = R XOR K, with L = 1010, R = 0110, K1 = 0011:</p>
${pre(`
f(K1,R)  = 0110 XOR 0011 = 0101
L XOR f  = 1010 XOR 0101 = 1111
swap     -> new L = 0110 , new R = 1111`)}
${note("extra","<strong>Why Feistel is clever:</strong> decryption uses the same structure with the round keys in reverse order, so f never needs to be reversible.")}

<h3>G6. Blowfish</h3>
<p>Blowfish is a Feistel cipher with <strong>16 rounds</strong> (Round 1, Round 2 … Round 16 on your slide). Extra steps at the end use two more subkeys, K17 and K18. The round function F works like this:</p>
<ul>
<li>Take the 32-bit right half R and split it into four bytes (octets a, b, c, d).</li>
<li>Pass each byte through its own S-box (S-Box 1 to 4).</li>
<li>Combine the four results using addition modulo 2<sup>32</sup> and XOR, giving a 32-bit output.</li>
</ul>
<p>So Blowfish is built from exactly the pieces you just learned: S-boxes (confusion), a Feistel structure (diffusion across rounds), and a key schedule. Its successor, Twofish, appears in your slide title; both are well known but AES is the standard in practice.</p>

<h3>G7. AES (Advanced Encryption Standard)</h3>
<p>AES is the most widely used symmetric cipher in the world (Wi-Fi security, HTTPS, disk encryption). It is <strong>not</strong> a Feistel cipher. It works on a 128-bit block (16 bytes), arranged as a 4 × 4 grid of bytes, filled column by column:</p>
${tbl(["Col 1","Col 2","Col 3","Col 4"],[
["Byte 1","Byte 5","Byte 9","Byte 13"],
["Byte 2","Byte 6","Byte 10","Byte 14"],
["Byte 3","Byte 7","Byte 11","Byte 15"],
["Byte 4","Byte 8","Byte 12","Byte 16"]
])}
<p>The process on your slide: start with <strong>Add Round Key (K0)</strong>, then repeat a round (10 rounds for a 128-bit key) made of four operations. The final round omits Mix Columns.</p>
${tbl(["Operation","What it does","Provides"],[
["Sub Bytes","Replaces every byte using an S-box lookup","Confusion"],
["Shift Rows","Rotates each row of the grid by a different amount (row 1 by 0, row 2 by 1, and so on)","Diffusion"],
["Mix Columns","Mixes the four bytes within each column together using mathematics","Diffusion"],
["Add Round Key (Ki)","XORs the grid with that round's key from the key schedule","Ties the key in"]
])}
${note("extra","AES also supports 192-bit and 256-bit keys, with 12 and 14 rounds respectively.")}

<h3>G8. Modes of operation: how to encrypt more than one block</h3>
<p>A block cipher only handles one block. A <strong>mode of operation</strong> says how to use it on a long message.</p>
${pre(`
ECB (Electronic Code Book):   C1 = E(P1)          C2 = E(P2)          C3 = E(P3)
CBC (Cipher Block Chaining):  C1 = E(P1 XOR IV)   C2 = E(P2 XOR C1)   C3 = E(P3 XOR C2)`)}
<ul>
<li><strong>ECB:</strong> each block is encrypted separately.</li>
<li><strong>CBC:</strong> each plaintext block is XOR'd with the previous ciphertext block before encryption. The first block uses an <strong>initialisation vector (IV)</strong>, a random starting value (it is not secret, but it should be unpredictable and not reused). CBC also needs padding (Part F).</li>
</ul>
<p>The slide asks: what's the drawback of ECB?</p>
${note("ans","In ECB, identical plaintext blocks always produce identical ciphertext blocks, so patterns in the data show through. You saw this in the byebob example in Part F. An attacker can spot repeated content, or rearrange and replay blocks, without knowing the key. CBC fixes this because each block's encryption depends on the one before it, so the same plaintext block encrypts differently each time.")}
${note("tip","The free tool CyberChef (search for it online) can do Caesar shifts, XOR, and AES, so you can check your hand-worked answers. Do the maths by hand first, then confirm with the tool.")}
`}
],

quiz:[
{q:"An intruder quietly changes several patient records in a hospital database. Which part of the CIA triad is broken?",o:["Integrity","Confidentiality","Availability","Authenticity"],a:0,why:"Integrity means information is not altered without authorisation. Nothing was leaked (confidentiality) or made unreachable (availability)."},
{q:"A DDoS attack keeps an online shop offline for a whole day. Which CIA property has been hit?",o:["Availability","Integrity","Confidentiality","None, because no data was stolen"],a:0,why:"Availability means legitimate users can reach the information or service when they should be able to."},
{q:"Which term means the specific path an attacker actually used to get in?",o:["Attack vector","Attack surface","Vulnerability","Threat"],a:0,why:"The attack surface is every possible entry point. The vector is the one that was used, such as a phishing email."},
{q:"A server is running software with a known, unpatched flaw. In the slide definitions, the flaw is a…",o:["Vulnerability","Threat","Attack","Risk statement"],a:0,why:"A vulnerability is a limitation that opens a system to potential attack. The threat is whoever might exploit it, and the attack is the event of exploiting it."},
{q:"Which UK law makes it a crime to access a computer system without authorisation?",o:["Computer Misuse Act 1990","Data Protection Act 2018","Serious Crime Act 2015","Freedom of Information Act 2000"],a:0,why:"The Computer Misuse Act 1990 covers unauthorised access and modification, including hacking and spreading malware."},
{q:"What is the first step of the six-step risk assessment?",o:["Scope","Identify assets","Assess risk","Identify mitigations"],a:0,why:"You draw the boundary first: what is and is not included. Assets, threats, assessment, mitigations and monitoring follow."},
{q:"\"37 failed logins were recorded against the admin account.\" In risk assessment terms this sentence is a…",o:["Finding","Risk","Mitigation","Vulnerability"],a:0,why:"It is something observed. The risk is the possible consequence for an asset, written as threat, vulnerability and impact."},
{q:"Which sentence follows the risk statement template from the slides?",o:["Malicious actor exploiting weak password resulting in sensitive information exposed","There were repeated login attempts last night","Passwords should be at least 12 characters long","The firewall blocked 400 connections"],a:0,why:"The template is: threat exploiting vulnerability resulting in impact."},
{q:"Which of these is a human mitigation rather than a technical one?",o:["Security awareness training","A firewall","Encryption of the database","Multi-factor authentication"],a:0,why:"Human mitigations are policy, culture and training. The other three are technical controls."},
{q:"Encrypt <code>CAB</code> with a Caesar cipher, key 3.",o:["FDE","ZXY","FDB","DBC"],a:0,why:"Shift each letter forward by 3: C to F, A to D, B to E."},
{q:"Why is the Caesar cipher easy to break?",o:["There are only 25 possible keys to try","The key is as long as the message","It needs a computer to decrypt","It changes the order of the letters"],a:0,why:"With so few keys an attacker can brute force them all in seconds. Letter frequency gives it away too."},
{q:"Encrypt <code>DOG</code> with Vigenère, keyword <code>KEY</code> (A=0 … Z=25).",o:["NSE","NSG","OTF","GRJ"],a:0,why:"D(3)+K(10)=13=N. O(14)+E(4)=18=S. G(6)+Y(24)=30, minus 26 = 4 = E."},
{q:"A cipher keeps every letter of the message but changes their order. What kind of operation is that?",o:["Permutation","Substitution","XOR","Padding"],a:0,why:"Permutation changes where the symbols are. Substitution changes what they are."},
{q:"What is <code>1011 XOR 0110</code>?",o:["1101","0010","1111","1001"],a:0,why:"XOR gives 1 where the bits differ: 1⊕0=1, 0⊕1=1, 1⊕1=0, 1⊕0=1."},
{q:"Why can the same XOR operation both encrypt and decrypt?",o:["XOR-ing with the same key twice cancels out","XOR always outputs the plaintext","The key is added and then subtracted modulo 26","XOR swaps the two halves of a block"],a:0,why:"(P ⊕ K) ⊕ K = P. One fast operation does both jobs."},
{q:"Using the basic block cipher from the slides (split, switch halves, XOR with key <code>01101101</code>), encrypt the block <code>01101111</code>.",o:["10011011","11110110","00000010","10010011"],a:0,why:"Split 0110 | 1111, switch to 1111 0110, then 11110110 XOR 01101101 = 10011011."},
{q:"Block size is 8 bytes and the message is 13 bytes. Using the CMS rule, what padding is added?",o:["3 bytes, each with the value 3","5 bytes, each with the value 5","3 bytes, each with the value 0","No padding is needed"],a:0,why:"13 mod 8 = 5, so 8 − 5 = 3 padding bytes, and each byte holds the value 3."},
{q:"In a modern block cipher, S-boxes mainly provide ___ and P-boxes mainly provide ___.",o:["confusion; diffusion","diffusion; confusion","padding; chaining","round keys; subkeys"],a:0,why:"S-boxes substitute (confusion: hide the key-ciphertext link). P-boxes rearrange (diffusion: spread changes around)."},
{q:"One Feistel round with f(K, R) = R XOR K. Start: L = 0101, R = 0011, K = 1001. What are the halves afterwards?",o:["L = 0011, R = 1111","L = 1111, R = 0011","L = 0011, R = 1010","L = 0101, R = 1010"],a:0,why:"f = 0011 XOR 1001 = 1010. New R = L XOR f = 0101 XOR 1010 = 1111. New L = old R = 0011."},
{q:"A P-box takes B1 B2 B3 B4 B5 B6 and outputs B6 B3 B5 B1. Which type is it?",o:["Compression","Straight","Expansion","Substitution"],a:0,why:"It permutes and drops some blocks, so fewer come out than went in."},
{q:"Which statement about AES is correct?",o:["It works on a 128-bit block arranged as a 4 × 4 grid of bytes","It is a Feistel cipher with 16 rounds","It encrypts one bit at a time with XOR","It uses a public and a private key"],a:0,why:"AES is not a Feistel cipher. It is a symmetric block cipher on a 4 × 4 byte grid; Blowfish is the 16-round Feistel cipher."},
{q:"Which AES operation is left out of the final round?",o:["Mix Columns","Sub Bytes","Shift Rows","Add Round Key"],a:0,why:"The last round runs Sub Bytes, Shift Rows and Add Round Key only."},
{q:"What is the drawback of ECB mode?",o:["Identical plaintext blocks give identical ciphertext blocks","It needs an initialisation vector","It cannot be decrypted","It only works with stream ciphers"],a:0,why:"Patterns in the data show through, as with the repeated b in the byebob example. CBC chains blocks to hide this."},
{q:"In CBC mode, what is the first plaintext block XOR'd with before encryption?",o:["The initialisation vector (IV)","The key","The second plaintext block","Nothing"],a:0,why:"Later blocks use the previous ciphertext block. The first has none, so it uses a random IV."}
],

practice:[
{q:"<strong>Caesar (encrypt).</strong> Encrypt HELLO with key 3.",a:"KHOOR (H to K, E to H, L to O, L to O, O to R)."},
{q:"<strong>Caesar (decrypt).</strong> Decrypt WKDQN BRX, which was encrypted with key 3.",a:"THANK YOU (shift each letter back by 3)."},
{q:"<strong>Vigenère.</strong> Encrypt CAT with keyword KEY. (Use A=0 … Z=25.)",a:"MER. C(2)+K(10)=12=M; A(0)+E(4)=4=E; T(19)+Y(24)=43, minus 26 = 17 = R."},
{q:"<strong>Permutation.</strong> Using the slide's two-row method, encrypt CYBERSECURITY.",a:"Letters in order: C Y B E R S E C U R I T Y. Odd positions (1, 3, 5, …): C B R E U I Y. Even positions: Y E S C R T. Ciphertext: CBREUIYYESCRT."},
{q:"<strong>XOR.</strong> Encrypt P = 10110011 with K = 01101001. Then decrypt your answer to show you get P back.",a:"10110011 XOR 01101001 = 11011010. Then 11011010 XOR 01101001 = 10110011, the original."},
{q:"<strong>Basic block cipher.</strong> Using key 01101101 and the split, switch, XOR method, encrypt the block 01100101 (the letter e).",a:"Split: 0110 | 0101. Switch: 0101 0110. XOR with 01101101 = 00111011."},
{q:"<strong>Padding.</strong> Block size 16 bytes, message 20 bytes. How many padding bytes, and what value? What if the message were exactly 16 bytes?",a:"20 mod 16 = 4, so 16 − 4 = 12 padding bytes, each with value 12. If exactly 16 bytes: 16 mod 16 = 0, so 16 − 0 = 16 bytes of padding, each with value 16 (a whole extra block)."},
{q:"<strong>S-box.</strong> Using the S-box row from the slides (row 00 is 1110 0100 1101 0001 0010 1111 1011 1000 0011 1010 0110 1100 0101 1001 0000 0111), find the output for input 011110.",a:"Outer bits are 0 and 0, so row 00. Middle bits 1111 is column 15, the last entry in the row: 0111."},
{q:"<strong>P-boxes.</strong> What is the difference between a straight, compression, and expansion P-box?",a:"Straight: only rearranges (same size). Compression: rearranges and drops some bits or blocks (output is smaller). Expansion: rearranges and duplicates some (output is larger)."},
{q:"<strong>Feistel.</strong> With f(K, R) = R XOR K, L = 1100, R = 1010, K1 = 0110, calculate the halves after one round.",a:"f = 1010 XOR 0110 = 1100. New R = L XOR f = 1100 XOR 1100 = 0000. New L = old R = 1010. So the halves are L = 1010, R = 0000."},
{q:"<strong>Modes.</strong> What is the drawback of ECB, and how does CBC fix it?",a:"ECB encrypts every block separately, so identical plaintext blocks give identical ciphertext blocks, leaking patterns. CBC XORs each plaintext block with the previous ciphertext block (and an IV for the first), so identical blocks encrypt differently."},
{q:"<strong>CIA.</strong> Which CIA property is broken by: (a) ransomware encrypting your files, (b) someone secretly changing exam marks, (c) a leaked customer database?",a:"(a) Availability. (b) Integrity. (c) Confidentiality."},
{q:"<strong>Vocabulary.</strong> A website has an unpatched plugin. A criminal group scans for it and uses it to get in. Identify the vulnerability, the threat, and the attack. Is this a finding or a risk?",a:"Vulnerability: the unpatched plugin. Threat: the criminal group. Attack: the actual exploitation of the plugin. The weakness plus the possibility of harm is a risk; the event itself, once observed, is a finding."},
{q:"<strong>Risk statement.</strong> A log shows 37 failed logins to an admin account from one IP. Write the finding, then a risk statement in the form: threat exploiting vulnerability resulting in impact.",a:"Finding: 37 failed logins to the admin account from one IP. Risk statement example: \"A malicious actor exploiting weak authentication on the admin account, resulting in unauthorised access and exposure of sensitive information.\""},
{q:"<strong>Surface vs vector.</strong> Explain the difference between an attack surface and an attack vector, with an example.",a:"The attack surface is all the possible entry points (open ports, web forms, staff email, and so on). The attack vector is the specific path actually used (for example, a phishing email that led to a stolen password)."}
],

glossary:[
["Asset","Anything of value you want to protect"],
["Attack surface","All the possible entry points an attacker could try"],
["Attack vector","The specific path an attacker actually used"],
["Block cipher","Encrypts fixed-size blocks of data"],
["Caesar cipher","Shift every letter by the same amount"],
["CIA triad","Confidentiality, Integrity, Availability"],
["Ciphertext","The scrambled message"],
["Plaintext","The original readable message"],
["Confusion","Hide the relationship between key and ciphertext"],
["Diffusion","Spread each plaintext change widely across the ciphertext"],
["ECB","Block-by-block mode; identical blocks leak patterns"],
["CBC","Chained mode: each block is XOR'd with the previous ciphertext block, starting from an IV"],
["Feistel cipher","Design that splits into L and R halves, with rounds of L XOR f(K, R) and a swap"],
["IV","Initialisation vector: random starting value for CBC"],
["Key schedule","Algorithm that produces round keys from the main key"],
["Padding","Extra bytes added to fill the last block"],
["P-box","Rearranges bit positions"],
["S-box","Substitutes bits using a lookup table"],
["Risk","Possible consequence to an asset from a threat exploiting a vulnerability"],
["Stream cipher","Encrypts data as a continuous stream, often with XOR"],
["Threat","Something or someone that could harm a system"],
["Vulnerability","A weakness that opens a system to attack"],
["Attack","An event that aims to exploit a vulnerability"],
["Vigenère cipher","Substitution using a repeating keyword"],
["XOR","Output 1 if the two bits differ, 0 if they are the same"]
],

checklist:[
"Define CIA and give an example of breaking each part",
"Explain vulnerability vs threat vs attack, and attack surface vs vector",
"Name the six risk assessment steps and write a risk statement",
"Explain why a finding is not a risk",
"Encrypt and decrypt with Caesar and Vigenère by hand",
"Do a permutation (two-row) cipher",
"XOR two bit strings and explain why XOR decrypts itself",
"Run the basic block cipher (split, switch, XOR) and apply padding rules",
"Read an S-box, and describe straight, compression and expansion P-boxes",
"Describe one Feistel round and the key ideas in Blowfish and AES",
"Explain ECB vs CBC and the weakness of ECB"
]
});
