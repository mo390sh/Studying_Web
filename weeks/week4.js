COURSE.add({
n:4,
title:"Network Security",
blurb:"How networks carry data and where they are attacked, then the defences: firewalls, DMZs, VPNs, digital certificates, TLS and Kerberos.",
topics:["Networks and the 7 layers","Sniffing, MITM, spoofing, replay","Port scanning","DoS and DDoS","Firewalls and proxies","DMZ and IDS","VPNs","Certificates and TLS","Kerberos"],
labs:["firewall","handshake","portscan","kerberos"],

parts:[
{tag:"A",title:"Networks background",html:`
<p>A <strong>computer network</strong> is more than one device (node) connected together so they can communicate electronically. A <strong>node</strong> is a point of connection in the network, such as a PC or a smart device. The rest of this week is about how data moves across a network and where it can be attacked.</p>

<h3>A1. Packets</h3>
<p>To transmit data, it is split into chunks called <strong>packets</strong>, which are recombined at the other end. Each packet has three parts:</p>
${tbl(["Part","What it holds"],[
["Header","The IP addresses of the sender and receiver, the total number of packets, and this packet's number"],
["Payload","The actual data, usually 1000–1500 bytes"],
["Footer","A Cyclic Redundancy Check (CRC), used to detect errors"]
])}
<p>Packets are moved around by <strong>hubs</strong>, <strong>switches</strong> and <strong>routers</strong>.</p>

<h3>A2. The 7-layer ISO network model</h3>
<p>Network communication is described as seven stacked layers. The message starts at the top and is handed down, layer by layer, until it is put on the wire.</p>
${tbl(["Layer","What it does"],[
["Application","Prepares the message for sending"],
["Presentation","Translates the message into a language the receiving node can understand, e.g. ASCII"],
["Session","Opens and maintains communication with the receiving node"],
["Transport","Protects the data being sent and creates checksum tests"],
["Network","Selects a route for the message and forms segments into packets"],
["Data Link","Supervises the transmission"],
["Physical","Encodes the packets into the medium that carries them, e.g. analogue signals, and sends them"]
])}
${note("key","Security controls can be applied at <strong>multiple layers</strong>. A firewall works mostly at the network and transport layers; TLS (later this week) sits around the transport layer; encryption of the message itself is higher up.")}

<h3>A3. The Internet Protocol suite (TCP/IP)</h3>
<p>In practice the internet uses a simpler four-layer stack:</p>
${tbl(["Layer","Role","Example"],[
["Application","The application-layer protocol","HTTP"],
["Transport","Uses ports; TCP","Port 80"],
["Network","Routes data using IP addresses","22.231.113.64"],
["Link","Responsible for passing packets",""]
])}
<ul>
<li><strong>IP (Internet Protocol):</strong> the addressing and routing system.</li>
<li><strong>IP address:</strong> identifies a host.</li>
<li><strong>Port:</strong> an internal address (a number) reserved for a specific application on a computer, e.g. HTTP or FTP.</li>
<li><strong>Socket:</strong> an endpoint of communication, defined by an IP address <em>and</em> a port together.</li>
<li><strong>TCP (Transmission Control Protocol):</strong> the reliable, connection-based transport protocol.</li>
</ul>

<h3>A4. Areas of network vulnerability</h3>
<p>Your slides group network attacks into four areas, which are the next four parts:</p>
<ul>
<li><strong>Ports</strong> (Part C)</li>
<li><strong>Router</strong> (Part C)</li>
<li><strong>Servers</strong> (Part D)</li>
<li><strong>Communication channels</strong> (Part B)</li>
</ul>
`},

{tag:"B",title:"Communication vulnerabilities",html:`
<p>These attacks target the <strong>communication channel</strong> itself: the traffic as it crosses the network.</p>

<h3>B1. Packet sniffing</h3>
<p><strong>Packet sniffing</strong> is the process of monitoring communications across a network. The attacker snoops information as it passes through a network they are on.</p>
<ul>
<li>The attacker must be <strong>on the network</strong> to monitor packets.</li>
<li>It generally needs either a <strong>hub</strong>, or for a <strong>switch</strong> to be in <strong>promiscuous mode</strong>.</li>
</ul>
<p>A switch keeps a list relating connections to nodes, so it normally only sends each packet to the right port. An attacker can <strong>overload the switch</strong> to force it into promiscuous mode, where it broadcasts to all ports and can be sniffed. <strong>Wireshark</strong> is the standard tool for capturing and reading packets (you used it earlier in the module).</p>

<h3>B2. Machine in the middle (MITM)</h3>
<p>A <strong>machine-in-the-middle</strong> attack spoofs client to server <em>and</em> server to client, so communications between the two parties can be monitored and potentially <strong>changed</strong>. (This is the same idea as the machine-in-the-middle attack on Diffie-Hellman in Week 2.)</p>

<h3>B3. Spoofing</h3>
${tbl(["Where","Protocol","How it works"],[
["On a LAN","ARP spoofing","ARP (Address Resolution Protocol) maps IP addresses to MAC addresses. The attacker changes the map so a target IP points to the attacker's MAC. Tools such as Ettercap do this."],
["On the internet","DNS spoofing","The Domain Name Server entry for a site is replaced with the attacker's IP, so victims who look up the name are sent to the attacker."]
])}

<h3>B4. Replay attack</h3>
<p>A <strong>replay attack</strong> monitors information travelling from client to server, such as a username and password, and <strong>replays it to the server later</strong> to impersonate the client.</p>
${pre(`
Client --[ Username, Password ]--> Server      (attacker captures it)
Attacker --[ Username, Password ]--> Server     (later: replayed to spoof the client)`)}
${note("link","Replay is exactly what <strong>Kerberos</strong> (Part J) is designed to mitigate, using timestamps and session keys. TLS (Part I) uses a fresh random value each session for the same reason.")}
`},

{tag:"C",title:"Port and router vulnerabilities",html:`
<h3>C1. Port scanning</h3>
<p><strong>Port scanning</strong> is a process that checks a host's ports to see which are <strong>open</strong>, listening to the data arriving at and leaving a port. It is often the first step an attacker takes to find a way in. Common ports:</p>
${tbl(["Port","Service"],[["21","FTP"],["25","SMTP"],["80","HTTP"]])}

<h3>C2. Nmap</h3>
<p><strong>Nmap</strong> is the standard scanning tool. Running <code>nmap localhost</code> lists each port with its state and the service behind it:</p>
${pre(`
C:\\Users\\Rose> nmap localhost -sT
Starting Nmap 7.70 ( https://nmap.org )
Nmap scan report for localhost (127.0.0.1)
Host is up (0.00s latency).
Not shown: 998 filtered ports
PORT     STATE  SERVICE
135/tcp  open   msrpc
445/tcp  open   microsoft-ds

Nmap done: 1 IP address (1 host up) scanned in 51.03 seconds`)}

<h3>C3. Port states</h3>
<p>Nmap reports a port in one of these states:</p>
<ul>
<li><strong>Open</strong> — an application is listening.</li>
<li><strong>Closed</strong> — reachable, but nothing is listening.</li>
<li><strong>Filtered</strong> — a firewall or filter is blocking the probe, so nmap can't tell if it is open.</li>
<li><strong>Unfiltered</strong> — reachable, but nmap can't tell open from closed.</li>
<li><strong>Open|Filtered</strong> and <strong>Closed|Filtered</strong> — nmap can't decide between the two.</li>
</ul>

<h3>C4. Types of scan</h3>
${tbl(["Scan","What it does"],[
["Vanilla","The scanner tries to connect to all I/O ports. A vanilla TCP scan sends TCP SYN messages to many ports, normally in sequence."],
["Strobe","A specialised scan that looks only for specific services."],
["Stealth","Sends fragments of packets that can sometimes slip through firewall filters. The IP header plus the data segments are split into multiple fragments, each sent with its own IP header, so a filter inspecting whole packets may miss them."]
])}

<h3>C5. Router vulnerabilities</h3>
<ul>
<li>Devices physically close to a router can potentially gain access to the network.</li>
<li><strong>Wardriving:</strong> driving around looking for wireless networks to connect to.</li>
</ul>
${lab("portscan")}
`},

{tag:"D",title:"Server vulnerabilities",html:`
<h3>D1. Denial of Service (DoS)</h3>
<p>A <strong>Denial of Service</strong> attack targets servers to overload them in some way so that legitimate service is stopped. It attacks the <strong>availability</strong> of the server (the A in the CIA triad from Week 1).</p>

<h3>D2. Approaches to DoS</h3>
${tbl(["Approach","What happens"],[
["Service request flood","Flood the server with application requests (e.g. thousands of HTTP GET /index.php) until it can't serve legitimate users"],
["Bandwidth flood","Saturate the network link so no real traffic gets through"],
["Ping of Death","Deliberately send an IP packet larger than the 65,536 bytes allowed by the IP protocol. Rare today thanks to OS patches"],
["SYN Flood","Abuse the TCP handshake (below)"]
])}

<h3>D3. SYN flood and the 3-way handshake</h3>
<p>TCP opens a connection with a <strong>3-way handshake</strong>:</p>
${pre(`
SOURCE            DESTINATION
   | ---- SYN ------->  |     synchronise
   | <-- SYN-ACK ------ |     synchronise-acknowledge
   | ---- ACK -------->  |    acknowledge   -> connection open`)}
<p>A <strong>SYN flood</strong> sends many SYN packets but <strong>never sends the final ACK</strong>. Each half-open connection stays open waiting, and enough of them overload the server so it can't accept real connections.</p>
${lab("handshake")}

<h3>D4. Distributed Denial of Service (DDoS)</h3>
<p>A <strong>DDoS</strong> is a DoS from <strong>many</strong> computers at once, using a network of infected machines to overload the server.</p>
${tbl(["Term","Meaning"],[
["Bot","A type of malware that gives the attacker complete control of a computer"],
["Zombie","An internet-connected computer infected with a bot"],
["Botnet","A collection of zombies, used together to do things like DDoS"]
])}
${note("why","A DDoS is hard to block by IP address because the traffic comes from thousands of ordinary, innocent-looking machines all over the world, not one source.")}
`},

{tag:"E",title:"Firewalls",html:`
<p>A <strong>firewall</strong> is any security system protecting the boundary of an internal network. It aims to protect your network and the devices connected to it, and typically uses <strong>packet filters</strong> and/or <strong>proxies</strong>.</p>

<h3>E1. Packet filtering</h3>
<p>A packet filter decides what to do with each packet. Filtering can be based on:</p>
<ul>
<li><strong>Source address</strong> — e.g. drop packets arriving from the internet that claim an internal IP.</li>
<li><strong>Destination address</strong> — e.g. only allow packets to the bastion host.</li>
<li><strong>Protocol</strong> — e.g. Telnet, SSH and their ports.</li>
</ul>
<p>Rules are <strong>custom</strong> and apply inbound or outbound, and the action is one of <strong>Accepted</strong>, <strong>Denied</strong> or <strong>Dropped</strong>. (Denied usually sends a rejection back; dropped silently discards the packet.)</p>

<h3>E2. Policies and rule sets</h3>
<p>You start from a plain-English <strong>policy</strong> ("allow traffic to my web server, but deny all other incoming traffic") and turn it into a <strong>rule set</strong>. Each rule has a name or description, a protocol, a source IP and port, a destination IP and port, and an action (allow or deny). Rules are checked in order, and the <strong>first match wins</strong>.</p>
<h4>Good or bad rules?</h4>
<p>Your slide compares two rules meant to block traffic to a web server at 24.180.49.139:80:</p>
${tbl(["Rule","Protocol","Source","Destination","Action","Good?"],[
["Bad rule","TCP","Any port 80","24.180.49.139 : 80","Deny","✗"],
["Good rule","TCP","Any port Any","24.180.49.139 : 80","Deny","✓"],
["Default","Any","Any","Any","Allow",""]
])}
${note("warn","The <strong>bad rule</strong> only blocks traffic whose <em>source</em> port is 80. But a browser's HTTP request can come from any source port between 1024 and 65535, so almost everything slips past it. The <strong>good rule</strong> matches <em>any</em> source port, so it actually blocks the traffic. Watch for <strong>conflating policies</strong> (rules that overlap or contradict) and the <strong>default rule</strong> at the bottom.")}

<h3>E3. Common default policies</h3>
${tbl(["Policy","Rule","Also called"],[
["Default deny","Deny everything that hasn't been specifically allowed","Whitelisting (safer)"],
["Default allow","Allow everything that hasn't been specifically denied","Blacklisting"]
])}
${lab("firewall")}

<h3>E4. Proxies</h3>
<p>A <strong>proxy server</strong> acts as an intermediary between an internal and an external network. It is the <strong>only entity the external network sees</strong>, and it decides whether each request is passed into the internal network. A separate proxy is usually needed for each service. Proxy firewall operations include:</p>
<ul>
<li><strong>Host IP address hiding</strong> — the outside world never sees internal IPs.</li>
<li><strong>Header destruction</strong> — stripping revealing header information.</li>
<li><strong>Protocol enforcement</strong> — rejecting malformed or disallowed traffic.</li>
</ul>
`},

{tag:"F",title:"DMZ and intrusion detection",html:`
<h3>F1. Demilitarised Zone (DMZ)</h3>
<p>A <strong>DMZ</strong> is a part of a network placed between the protected internal network and the untrusted external network. It gives additional security and helps manage the routes from the private network to the internet and back. Public-facing servers (like a web server) live in the DMZ, so that even if they are compromised, the attacker is not yet inside the internal network.</p>
<h4>Two-firewall architecture</h4>
${pre(`
Internal Network -- [Internal Firewall] -- DMZ -- [Perimeter Firewall] -- External Network (e.g. internet)`)}
<ul>
<li>The <strong>perimeter firewall</strong> allows access from the external network to the DMZ.</li>
<li>The <strong>internal firewall</strong> allows access from the internal network to the DMZ.</li>
</ul>
<p>To reach the internal network from outside, an attacker has to get through <strong>both</strong> firewalls.</p>

<h3>F2. Intrusion Detection Systems (IDS)</h3>
<p>An <strong>IDS</strong> automates the process of monitoring network traffic for potential violations. An <strong>Intrusion Prevention System (IPS)</strong> additionally can <strong>prevent</strong> violations, not just report them. An IDS:</p>
<ul>
<li>records information related to observed events,</li>
<li>notifies security administrators of important events,</li>
<li>produces reports for management.</li>
</ul>
${note("warn","<strong>An IDS is only the first step in defence.</strong> It can't stop administrator misconfiguration, an insider threat, or social engineering. Those need policy, training and access control (Week 3), not just monitoring.")}
`},

{tag:"G",title:"Virtual Private Networks (VPNs)",html:`
<p>A <strong>VPN</strong> extends a private network across a public one, so you can use a remote network as if you were directly on it.</p>

<h3>G1. Uses</h3>
${tbl(["Use","What it gives you"],[
["Remote access","Appear as if you are on the network at a different site, e.g. working from home"],
["Site-to-site","Connect multiple networks, e.g. offices in different locations, so each can reach the others' resources"]
])}

<h3>G2. Types of VPN</h3>
${tbl(["Type","Meaning"],[
["Trusted","Separate circuits maintained by the providers"],
["Secure","Uses protocols to ensure secure communication"],
["Hybrid","A combination of trusted and secure"]
])}

<h3>G3. Secure VPN mechanisms</h3>
<p>A secure VPN relies on three mechanisms:</p>
<ul>
<li><strong>Authentication:</strong> the client requests a connection, the VPN server asks it to identify itself, and authentication takes place. How it is done depends on the protocol.</li>
<li><strong>Tunnelling:</strong> packets carrying internal network addresses are <strong>encapsulated inside</strong> packets using internet addressing, so they can cross the public internet and be unwrapped at the far end.</li>
<li><strong>Encryption:</strong> packets are encrypted with an encryption protocol. There are two modes: <strong>Transport</strong> (encrypt the payload only) and <strong>Tunnel</strong> (encrypt the whole original packet).</li>
</ul>
${note("key","Tunnelling is like putting your addressed envelope inside a second envelope for the public journey. Encryption makes the inner envelope unreadable even if someone opens the outer one.")}
`},

{tag:"H",title:"Digital certificates",html:`
<p>So far we have trusted that a key really belongs to the server we are talking to. But what if the server isn't who it claims to be? If Eve intercepts the initial key exchange, she could replace the server's key with her own. To <strong>authenticate the server to the client</strong>, we use digital certificates.</p>

<h3>H1. What a certificate is</h3>
<p>A <strong>digital certificate</strong> is a collection of data that associates a <strong>public key with a server</strong>. A <strong>certificate authority (CA)</strong> is a trusted third party that verifies a server really belongs to the entity claiming it, and binds that entity's public key to the server. The CA digitally <strong>signs</strong> the public key and the other certificate details with its own signing key, to show it trusts the server's identity. An example CA is Verisign; an example entity is Google.</p>

<h3>H2. Certificate Signing Request (CSR)</h3>
<p>To add a new server, the entity submits a <strong>certificate signing request</strong> to the CA. It is a block of text, often encoded in <strong>ASN.1</strong> (Abstract Syntax Notation), generated on the server where the certificate will be installed. It contains:</p>
<ul>
<li>a <strong>public key</strong>;</li>
<li>a <strong>common name</strong> — the fully qualified domain name of the server;</li>
<li>the <strong>organisation</strong> name and the <strong>unit</strong> responsible (e.g. the IT department);</li>
<li>the city, state/county/region and country, and an email of a person responsible for the server.</li>
</ul>

<h3>H3. Validation</h3>
<p>The CA must check that the server and public key really belong to the entity claiming ownership. One common way is <strong>domain validation</strong>: an email with an authentication token or link is sent to an administrative address for the domain. Using that link proves a level of access to the domain. The CA may also do extra research. Once satisfied, it binds the public key from the CSR to that company in the certificate.</p>

<h3>H4. What's in the certificate, and how a client trusts it</h3>
<p>A digital certificate has a <strong>name</strong>, a <strong>validity time frame</strong>, <strong>who issued it</strong>, the <strong>owner's public key</strong>, and the <strong>CA's digital signature</strong>. The CA is effectively vouching for the company.</p>
<p>But how does a client know the certificate is valid and really from the CA? A number of CA certificates are <strong>pre-installed on the client's operating system</strong> (such as Verisign's). That means the client already has the CA's public key, so it can check the digital signature on any certificate that CA signed.</p>
<ol>
<li>The client downloads the certificate from the web server it wants to talk to.</li>
<li>It verifies the CA's <strong>signature</strong> to check the certificate's integrity and that it came from the CA.</li>
<li>It checks the details, such as that the certificate is <strong>not out of date</strong>.</li>
</ol>
${note("warn","Browsers warn when a certificate may not be trusted, for example a <strong>self-signed</strong> certificate (one signed by the server itself, with no CA vouching for it).")}
`},

{tag:"I",title:"Transport Layer Security (TLS)",html:`
<p><strong>TLS</strong> is the protocol behind the padlock in your browser: it secures the channel between a client and a server, using the digital certificates from Part H. (It is the modern successor to SSL.)</p>

<h3>I1. Trust</h3>
<ul>
<li>The client has to <strong>trust the CA</strong>.</li>
<li>The CA digitally signs the certificate to confirm ownership of a public key.</li>
<li>The client uses its <strong>pre-installed CA certificate</strong> to get the CA's public key.</li>
<li>The client can now <strong>verify the digital signature</strong> on the server's certificate.</li>
</ul>

<h3>I2. Public Key Infrastructure (PKI)</h3>
<p><strong>PKI</strong> is the whole supporting system: the set of hardware, software, people, policies and procedures needed to <strong>create, manage, distribute, use, store and revoke</strong> digital certificates.</p>

<h3>I3. The TLS 1.3 handshake</h3>
${pre(`
CLIENT                                                          SERVER

  --- Client hello [supported ciphers, key share] ----------->
  <-- Server hello [chosen cipher suite, key share]                HANDSHAKE
          + signed certificate ---------------------------------

  --- HTTPS application data request ------------------------->     APPLICATION
  <-- application data (encrypted) ---------------------------      COMMUNICATION`)}
<p>In the handshake the two sides agree a cipher and exchange key material, and the server proves its identity with its <strong>signed certificate</strong>. After that, application data flows <strong>encrypted</strong> — that is what the padlock symbol means.</p>

<h3>I4. (Perfect) Forward Secrecy</h3>
<p>The keys used to encrypt and decrypt are <strong>ephemeral</strong>: they are used only within that one communication session. This means that even if a key is later broken, past and future communications stay confidential.</p>
${note("link","This is why the client and server exchange a fresh <strong>key share</strong> every handshake rather than reusing one long-term key. It builds directly on Diffie-Hellman from Week 2.")}
`},

{tag:"J",title:"Kerberos",html:`
<p><strong>Kerberos</strong> is a mutual authentication protocol for networks. The slides build it up step by step, fixing one problem at a time, so follow the story rather than memorising the final diagram.</p>
<ul>
<li>Provides <strong>mutual authentication</strong> (client and server each prove who they are).</li>
<li>Helps <strong>mitigate replay attacks</strong>.</li>
<li>Helps with <strong>usability</strong> — you authenticate once, not for every service.</li>
<li>Widely used, in particular on Windows.</li>
</ul>

<h3>J1. The starting problem: distributed authentication</h3>
<p>Without Kerberos, the client sends its user ID and password separately to every service (email, printing, files). The problems:</p>
<ul>
<li>Not user friendly — you repeat the same authentication many times.</li>
<li>The password is <strong>sent across the network</strong>, so it could be replayed.</li>
<li>The same password is duplicated across services: multiple points of attack, and updates cause sync issues.</li>
</ul>

<h3>J2. Step 1 — a central Authentication Server (AS)</h3>
<p>Introduce an <strong>Authentication Server</strong> that holds the user passwords and the service server keys. The AS sends a <strong>ticket</strong> to authenticate the client, encrypted with the <strong>service's key</strong> (so only the right service can read it). <br><em>Remaining issue:</em> a replay attack is still possible (you can add the client's IP address inside the encrypted message to help), the user still authenticates frequently, and the password is still sent over the network.</p>

<h3>J3. Step 2 — a Ticket-Granting Server (TGS)</h3>
<p>Add a <strong>Ticket-Granting Server</strong>, and let the AS <strong>derive the client's key from their password</strong> instead of sending the password around.</p>
${pre(`
Client -- User ID, TGS ID ----------------------------> AS
Client <-- ClientKey( TGSkey(ticket) ) ---------------- AS
Client -- TGSkey(ticket), User ID, service server ID -> TGS
Client <-- ServiceServerKey(ticket) ------------------- TGS
Client -- User ID, request, ServiceServerKey(ticket) -> Service Server`)}
<p>Now the client gets a <strong>ticket-granting ticket (TGT)</strong> once, then uses it to collect <strong>service tickets</strong> from the TGS as needed. <em>Remaining issue:</em> still potential for replay, and still no mutual authentication.</p>

<h3>J4. Step 3 — session keys</h3>
<p>Add <strong>session keys</strong>: short-lived keys for each conversation. These give <strong>mutual authentication</strong> (the service proves itself back to the client) and defeat replay, because an old captured message won't match the current session key.</p>

<h3>J5. The tickets</h3>
${tbl(["Ticket","Contains"],[
["Ticket-granting ticket (TGT)","Client ID, TGS ID, client address, timestamp, lifetime, session key"],
["Service ticket","Client ID, client address, service ID, timestamp, lifetime, session key"],
["Authenticator","User ID, user address, timestamp — proves the ticket is being used live, not replayed"]
])}
<p>The <strong>timestamp</strong> and <strong>lifetime</strong> are what stop replay: a captured ticket is only valid for a short window. The AS plus TGS together are called the <strong>Key Distribution Center (KDC)</strong>.</p>
${lab("kerberos")}

<h3>J6. Things to remember</h3>
<ul>
<li>Machines need to be <strong>time synced</strong> (because everything relies on timestamps).</li>
<li>Tickets and keys are <strong>stored on the user's machine</strong>.</li>
<li>The <strong>KDC is a single point of failure</strong> — if it goes down, nobody can authenticate.</li>
</ul>
`}
],

quiz:[
{q:"When data is transmitted across a network, what is it split into?",o:["Packets, which are recombined at the other end","A single continuous stream","Sockets","Frames that are never reassembled"],a:0,why:"Data is split into packets, each sent separately and recombined by the receiver."},
{q:"What does a packet's header contain?",o:["The IP addresses of the sender and receiver","Only the payload data","The Cyclic Redundancy Check","The encryption key"],a:0,why:"The header holds the sender and receiver IPs plus the packet number; the CRC is in the footer and the data is the payload."},
{q:"What is a socket?",o:["An endpoint of communication defined by an IP address and a port","Just a port number","Just an IP address","A physical network cable"],a:0,why:"A socket is the combination of an IP address and a port together."},
{q:"In the 7-layer model, which layer selects a route for the message and forms segments into packets?",o:["Network","Physical","Application","Session"],a:0,why:"The Network layer does routing and packet forming; the Physical layer puts bits on the medium."},
{q:"In the TCP/IP suite, which layer uses ports?",o:["Transport","Network","Link","Application"],a:0,why:"The Transport layer (TCP) uses ports; the Network layer uses IP addresses."},
{q:"Which of these is NOT one of the four areas of network vulnerability in the slides?",o:["Encryption keys","Ports","Routers","Servers"],a:0,why:"The four areas are ports, routers, servers and communication channels."},
{q:"Packet sniffing requires what?",o:["The attacker to be on the network, with a hub or a switch in promiscuous mode","Physical access to the server's hard drive","The victim's password","A digital certificate"],a:0,why:"Sniffing monitors traffic on a network the attacker is already on, needing a hub or a switch forced into promiscuous mode."},
{q:"How can an attacker sniff traffic on a switched network?",o:["Overload the switch to force it into promiscuous mode","Ask the switch politely","Unplug the router","Install a certificate"],a:0,why:"A switch normally sends each packet only to the right port; overloading it into promiscuous mode makes it broadcast to all ports."},
{q:"ARP spoofing works by changing a map so that an IP address points to what?",o:["The attacker's MAC address","A random port","The DNS server","The default gateway's certificate"],a:0,why:"ARP maps IP addresses to MAC addresses; the attacker redirects a target IP to their own MAC. Tools such as Ettercap do this."},
{q:"How is spoofing done on the internet (rather than a LAN)?",o:["Replacing a DNS entry with the attacker's IP","ARP spoofing","Overloading a switch","Sending a SYN flood"],a:0,why:"On the internet the attacker replaces a Domain Name Server entry so the name resolves to their IP; ARP spoofing is the LAN version."},
{q:"What is a machine-in-the-middle attack?",o:["Spoofing client to server and server to client so traffic can be monitored and changed","Overloading a server with requests","Guessing passwords offline","Scanning a host's ports"],a:0,why:"MITM impersonates each side to the other, so the attacker can read and alter the communication."},
{q:"What is a replay attack?",o:["Capturing something like a username and password and resending it to the server later","Encrypting a message twice","Flooding a server with pings","Splitting packets into fragments"],a:0,why:"The attacker records client-to-server data and replays it later to impersonate the client."},
{q:"What does port scanning check?",o:["Which of a host's ports are open","How fast the network is","Whether a certificate is valid","The strength of a password"],a:0,why:"A port scan probes a host's ports to see which are open and listening."},
{q:"What does a vanilla TCP scan do?",o:["Tries to connect to all ports, normally in sequence","Looks only for one specific service","Sends fragmented packets to dodge filters","Floods the server with SYN packets"],a:0,why:"A vanilla scan attempts to connect to all I/O ports; a strobe targets specific services and a stealth scan fragments packets."},
{q:"A scan that looks only for specific services is called a…",o:["Strobe scan","Vanilla scan","Stealth scan","SYN flood"],a:0,why:"A strobe is a specialised scan for specific services."},
{q:"How does a stealth scan try to get past a firewall?",o:["It sends fragments of packets that can slip through filters","It uses a valid certificate","It floods the firewall with traffic","It guesses the admin password"],a:0,why:"Splitting the IP header and data into fragments can get through filters that inspect whole packets."},
{q:"In nmap, which port state means a firewall or filter is blocking the probe so nmap can't tell if the port is open?",o:["Filtered","Closed","Open","Unfiltered"],a:0,why:"Filtered means something is blocking the probe; closed means reachable with nothing listening, open means a service is listening."},
{q:"What is wardriving?",o:["Driving around looking for wireless networks to access","Flooding a router with packets","Scanning every port on a host","Replaying a captured password"],a:0,why:"Wardriving exploits that devices physically close to a router can try to gain access to the wireless network."},
{q:"Which part of the CIA triad does a Denial of Service attack target?",o:["Availability","Confidentiality","Integrity","Authenticity"],a:0,why:"DoS overloads a server so legitimate service stops, attacking availability."},
{q:"How does a SYN flood overload a server?",o:["It sends SYN packets but never sends the final ACK, leaving connections half-open","It sends oversized ping packets","It replays captured tickets","It fragments every packet"],a:0,why:"Each half-open connection ties up resources; enough of them stop the server accepting real connections."},
{q:"What is the correct order of the TCP 3-way handshake?",o:["SYN, SYN-ACK, ACK","ACK, SYN, SYN-ACK","SYN-ACK, SYN, ACK","SYN, ACK, SYN-ACK"],a:0,why:"The source sends SYN, the destination replies SYN-ACK, and the source sends ACK to open the connection."},
{q:"What is the Ping of Death?",o:["Sending an IP packet larger than the 65,536 bytes allowed by the protocol","Pinging a server once per second forever","Sending a ping with no payload","Replaying a ping packet"],a:0,why:"An oversized IP packet could crash unpatched systems; OS patches have made it rare today."},
{q:"What makes an attack a DDoS rather than a DoS?",o:["It comes from many infected computers (a botnet) at once","It targets integrity instead of availability","It uses encryption","It only works on one port"],a:0,why:"A DDoS uses a botnet of many zombies, which also makes it hard to block by source IP."},
{q:"What is a zombie?",o:["An internet-connected computer infected with a bot","The attacker's own computer","A type of firewall","A kind of certificate"],a:0,why:"A bot is the malware, a zombie is a machine infected with it, and a botnet is a collection of zombies."},
{q:"A firewall is best described as…",o:["Any security system protecting the boundary of an internal network","Software that encrypts files","A tool for scanning ports","A certificate authority"],a:0,why:"Firewalls guard the network boundary, typically using packet filters and/or proxies."},
{q:"Packet filtering can be based on all of these EXCEPT…",o:["The contents of an encrypted payload","Source address","Destination address","Protocol"],a:0,why:"A basic packet filter looks at addresses and protocol/ports, not the encrypted payload contents."},
{q:"A 'default deny' (whitelist) firewall policy means…",o:["Deny everything that hasn't been specifically allowed","Allow everything that hasn't been specifically denied","Deny all traffic permanently","Allow all traffic permanently"],a:0,why:"Default deny only permits explicitly allowed traffic, which is the safer policy."},
{q:"On the slide, a rule that denies TCP from 'source port 80' to the web server is a bad rule because…",o:["HTTP requests can come from any source port 1024-65535, so it blocks almost nothing","Port 80 is not used by HTTP","It blocks too much legitimate traffic","Deny rules never work"],a:0,why:"The browser's source port is not 80, so matching on source port 80 misses the traffic; the good rule matches any source port."},
{q:"What is the role of a proxy server in a firewall?",o:["It is an intermediary and the only entity the external network sees","It stores all user passwords","It issues digital certificates","It assigns IP addresses"],a:0,why:"The proxy mediates requests and hides the internal network behind itself."},
{q:"Which is a proxy firewall operation?",o:["Host IP address hiding","Deriving keys from passwords","Issuing tickets","Running a DNS server"],a:0,why:"Proxy operations include host IP hiding, header destruction and protocol enforcement."},
{q:"Where does a DMZ sit?",o:["Between the protected internal network and the untrusted external network","Inside the CPU","Between two applications on one host","Only on the attacker's machine"],a:0,why:"The DMZ is a buffer zone between the internal network and the internet, often holding public-facing servers."},
{q:"In a two-firewall DMZ, what does the perimeter firewall do?",o:["Allows access from the external network to the DMZ","Allows the internal network to reach the internet directly","Encrypts all internal files","Issues certificates"],a:0,why:"The perimeter firewall faces outward (external to DMZ); the internal firewall controls internal-to-DMZ access."},
{q:"What can an Intrusion Detection System NOT stop?",o:["Insider threats, social engineering and admin misconfiguration","Traffic it is configured to watch","Known attack signatures","Port scans it can see"],a:0,why:"An IDS only monitors and reports (an IPS can also prevent); it can't address people-based or configuration problems."},
{q:"What are the three mechanisms of a secure VPN?",o:["Authentication, tunnelling and encryption","Sniffing, spoofing and replay","Hubs, switches and routers","Open, closed and filtered"],a:0,why:"A secure VPN authenticates the user, tunnels the internal packets and encrypts them."},
{q:"What does tunnelling do in a VPN?",o:["Encapsulates internal-address packets inside internet-addressed packets","Encrypts the hard drive","Scans for open ports","Signs certificates"],a:0,why:"Tunnelling wraps the private packet inside a public one so it can cross the internet."},
{q:"What does a digital certificate associate?",o:["A public key with a server","A password with a username","An IP address with a port","Two session keys"],a:0,why:"A certificate binds a public key to a server, vouched for by a CA's signature."},
{q:"What is a certificate authority (CA)?",o:["A trusted third party that verifies ownership and signs the certificate","The server requesting the certificate","The client's browser","A type of firewall"],a:0,why:"The CA verifies the entity owns the server and signs the certificate with its signing key."},
{q:"How does a CA commonly validate a certificate signing request by domain validation?",o:["It emails an admin address for the domain with a token or link to prove control","It phones the attacker","It scans the server's ports","It reads the server's password"],a:0,why:"Using the emailed link proves a level of access to the domain, so the CA trusts the request."},
{q:"How can a client trust a certificate signed by a CA like Verisign?",o:["The CA's certificate is pre-installed in the OS, so the client already has the CA's public key","The client guesses the CA's key","The server sends the CA's private key","Certificates never need checking"],a:0,why:"With the CA's public key pre-installed, the client can verify the CA's signature on any certificate it signed."},
{q:"Why does a browser warn about a self-signed certificate?",o:["No certificate authority has vouched for it","It is always expired","It uses the wrong port","It has no public key"],a:0,why:"A self-signed certificate is signed by the server itself with no trusted CA backing it, so the client can't verify the identity."},
{q:"What is Public Key Infrastructure (PKI)?",o:["The hardware, software, people, policies and procedures to manage certificates","A single encryption algorithm","A type of port scan","The TCP handshake"],a:0,why:"PKI is the whole system for creating, managing, distributing, using, storing and revoking certificates."},
{q:"In the TLS 1.3 handshake, what does the server send back in its 'server hello'?",o:["The chosen cipher suite, a key share and a signed certificate","Only the client's password","The CA's private key","A SYN-ACK"],a:0,why:"The server picks the cipher, shares key material and proves its identity with a signed certificate."},
{q:"What does (perfect) forward secrecy give you?",o:["Breaking one session key does not expose past or future sessions","A faster handshake","A permanent shared key","A free certificate"],a:0,why:"Ephemeral per-session keys mean a broken key only affects that one session."},
{q:"What does Kerberos provide that simple password authentication does not?",o:["Mutual authentication and replay protection","Faster internet","Larger packets","A public key for every user"],a:0,why:"Kerberos authenticates both sides and uses timestamps and session keys to resist replay."},
{q:"In Kerberos, what does the Ticket-Granting Server (TGS) do?",o:["Issues service tickets once the client presents a valid ticket-granting ticket","Stores all user passwords","Encrypts the hard drive","Runs the DNS"],a:0,why:"The AS issues the TGT; the client then uses the TGT at the TGS to get service tickets."},
{q:"Why do session keys and timestamps help Kerberos resist replay attacks?",o:["A captured ticket is only valid for a short window and won't match the current session key","They make packets smaller","They hide the IP address","They remove the need for a KDC"],a:0,why:"Short ticket lifetimes plus per-session keys mean an old captured message is no longer valid."},
{q:"Why must machines using Kerberos be time synced?",o:["The whole protocol relies on timestamps in tickets","So packets arrive in order","To share one password","To avoid port scans"],a:0,why:"Tickets carry timestamps and lifetimes, so clocks must agree or valid tickets get rejected."},
{q:"What is a weakness of the Kerberos KDC?",o:["It is a single point of failure","It sends passwords in plaintext","It can't issue tickets","It has no clock"],a:0,why:"If the KDC (the AS plus TGS) goes down, nobody on the network can authenticate."}
],

practice:[
{q:"<strong>Packets.</strong> Name the three parts of a packet and say what each holds.",a:"Header (sender and receiver IP addresses, packet number), payload (the data, 1000–1500 bytes), footer (a Cyclic Redundancy Check for error detection)."},
{q:"<strong>Layers.</strong> In the 7-layer model, which layer selects a route and forms packets, and which layer actually puts the bits onto the medium?",a:"The Network layer selects the route and forms segments into packets. The Physical layer encodes the packets onto the medium and sends them."},
{q:"<strong>Sniffing.</strong> What two conditions does packet sniffing generally require?",a:"The attacker must be on the network, and there must be either a hub or a switch forced into promiscuous mode."},
{q:"<strong>Spoofing.</strong> Explain ARP spoofing on a LAN and DNS spoofing on the internet.",a:"ARP spoofing changes the IP-to-MAC map so a target IP points to the attacker's MAC (tools like Ettercap). DNS spoofing replaces a Domain Name Server entry so a domain name resolves to the attacker's IP."},
{q:"<strong>Replay.</strong> Describe a replay attack and name one Week 4 defence against it.",a:"The attacker captures client-to-server data such as a username and password and resends it later to impersonate the client. Kerberos (timestamps and session keys) and TLS (a fresh key share each session) defend against it."},
{q:"<strong>Port states.</strong> What do the nmap states Open, Closed and Filtered each mean?",a:"Open: an application is listening. Closed: reachable but nothing is listening. Filtered: a firewall or filter is blocking the probe, so nmap can't tell if it is open."},
{q:"<strong>Scans.</strong> Explain the difference between a vanilla, a strobe and a stealth scan.",a:"Vanilla tries to connect to all ports, normally in sequence. Strobe looks only for specific services. Stealth sends fragmented packets that can slip through firewall filters."},
{q:"<strong>SYN flood.</strong> Write out the TCP 3-way handshake, then explain how a SYN flood abuses it.",a:"Handshake: SYN (source to destination), SYN-ACK (destination to source), ACK (source to destination). A SYN flood sends many SYNs but never the final ACK, leaving connections half-open until the server is overloaded."},
{q:"<strong>DDoS vocabulary.</strong> Define bot, zombie and botnet.",a:"Bot: malware that gives the attacker full control of a computer. Zombie: an internet-connected computer infected with a bot. Botnet: a collection of zombies used together, e.g. for DDoS."},
{q:"<strong>Firewall rule.</strong> A rule denies TCP from source port 80 to a web server on port 80, but traffic still gets through. Why, and what is the fix?",a:"A browser's HTTP request has a source port between 1024 and 65535, not 80, so the rule almost never matches. Fix: deny TCP from any source port to the server on port 80."},
{q:"<strong>Policies.</strong> Describe default-deny (whitelist) and default-allow (blacklist) and say which is safer.",a:"Default deny blocks everything not specifically allowed; default allow permits everything not specifically denied. Default deny (whitelisting) is safer."},
{q:"<strong>Proxy.</strong> What is a proxy server and name its three firewall operations.",a:"A proxy is an intermediary and the only entity the external network sees, deciding which requests enter the internal network. Operations: host IP address hiding, header destruction, protocol enforcement."},
{q:"<strong>DMZ.</strong> In a two-firewall DMZ, what does each firewall allow?",a:"The perimeter firewall allows access from the external network to the DMZ. The internal firewall allows access from the internal network to the DMZ. Reaching the internal network from outside needs to pass both."},
{q:"<strong>IDS.</strong> What does an IDS do, how does an IPS differ, and name two things an IDS can't stop.",a:"An IDS monitors traffic for violations, records events, notifies admins and produces reports. An IPS can additionally prevent violations. It can't stop admin misconfiguration, insider threats or social engineering."},
{q:"<strong>VPN.</strong> Name the three secure VPN mechanisms and explain tunnelling.",a:"Authentication, tunnelling and encryption. Tunnelling encapsulates packets with internal network addresses inside packets using internet addressing, so they can cross the public internet."},
{q:"<strong>Certificates.</strong> What does a digital certificate contain, and how does a client trust one?",a:"A name, a validity period, who issued it, the owner's public key, and the CA's digital signature. The client trusts it because the CA's certificate (and public key) is pre-installed in the OS, so it can verify the CA's signature and check the details, such as the expiry."},
{q:"<strong>CSR.</strong> What is a certificate signing request and name three things it contains.",a:"A block of text (often ASN.1) generated on the server, submitted to a CA. It contains a public key, a common name (the server's fully qualified domain name), the organisation and unit, plus location details and a responsible email."},
{q:"<strong>TLS.</strong> Outline the TLS 1.3 handshake and say what the padlock means.",a:"Client hello (supported ciphers, key share) → server hello (chosen cipher, key share, signed certificate) → encrypted application data. The padlock means the application data is encrypted."},
{q:"<strong>Forward secrecy.</strong> What is (perfect) forward secrecy and why does it matter?",a:"Encryption keys are ephemeral, used only within one session, so even if a key is later broken, past and future communications stay confidential."},
{q:"<strong>Kerberos.</strong> Explain the roles of the AS and the TGS, and why session keys were added.",a:"The AS holds passwords (and derives the client's key) and issues a ticket-granting ticket. The client uses the TGT at the TGS to get service tickets for individual services. Session keys were added to give mutual authentication and defeat replay."},
{q:"<strong>Kerberos pitfalls.</strong> Name three things to remember about Kerberos.",a:"Machines must be time synced (tickets use timestamps); tickets and keys are stored on the user's machine; the KDC is a single point of failure."}
],

glossary:[
["Packet","A chunk of data with a header, payload and footer, recombined at the receiver"],
["CRC","Cyclic Redundancy Check: an error-detecting value in a packet's footer"],
["Node","A point of connection within a network, such as a PC or smart device"],
["7-layer model","Application, Presentation, Session, Transport, Network, Data Link, Physical"],
["Port","An internal address reserved for a specific application, e.g. 80 for HTTP"],
["Socket","An endpoint of communication defined by an IP address and a port"],
["Packet sniffing","Monitoring traffic on a network, needing a hub or a switch in promiscuous mode"],
["Promiscuous mode","A switch state where it broadcasts to all ports, letting an attacker sniff"],
["MITM","Machine in the middle: spoofing both sides to monitor and alter traffic"],
["ARP spoofing","Redirecting a target IP to the attacker's MAC on a LAN"],
["DNS spoofing","Replacing a DNS entry so a name resolves to the attacker's IP"],
["Replay attack","Capturing and later resending data to impersonate a party"],
["Port scanning","Checking which of a host's ports are open, e.g. with nmap"],
["Stealth scan","Using fragmented packets to slip past firewall filters"],
["Wardriving","Searching for wireless networks to access, often from a vehicle"],
["DoS","Denial of Service: overloading a server to stop legitimate service (hits availability)"],
["SYN flood","Sending SYNs without the final ACK to exhaust half-open connections"],
["DDoS","Distributed DoS from a botnet of many infected machines"],
["Botnet","A collection of zombies (bot-infected computers) controlled together"],
["Firewall","A security system protecting an internal network's boundary"],
["Packet filter","A firewall component that allows or denies packets by address, port or protocol"],
["Default deny","Deny everything not specifically allowed (whitelisting); the safer policy"],
["Proxy server","An intermediary that is the only entity the external network sees"],
["DMZ","A buffer network between the internal network and the untrusted internet"],
["IDS","Intrusion Detection System: monitors traffic for violations and alerts admins"],
["IPS","Intrusion Prevention System: an IDS that can also block violations"],
["VPN","Virtual Private Network: secure access to a remote network over a public one"],
["Tunnelling","Encapsulating internal-address packets inside internet-addressed packets"],
["Digital certificate","Data binding a public key to a server, signed by a CA"],
["Certificate authority","A trusted third party that verifies ownership and signs certificates"],
["CSR","Certificate Signing Request: the details and public key sent to a CA"],
["TLS","Transport Layer Security: encrypts the channel using certificates (the padlock)"],
["PKI","Public Key Infrastructure: the system for managing certificates"],
["Forward secrecy","Ephemeral session keys, so breaking one key doesn't expose other sessions"],
["Kerberos","A mutual authentication protocol using tickets, a TGS and session keys"],
["KDC","Key Distribution Center: the AS plus TGS; a single point of failure"]
],

checklist:[
"Describe the parts of a packet and name the 7 network layers",
"Explain ports, sockets and the TCP/IP suite layers",
"Explain packet sniffing, including promiscuous mode on a switch",
"Tell apart MITM, ARP spoofing, DNS spoofing and replay attacks",
"Describe port scanning and the vanilla, strobe and stealth scans",
"Explain the nmap port states, and what wardriving is",
"Explain DoS vs DDoS, the SYN flood and the 3-way handshake, and define bot/zombie/botnet",
"Explain packet filtering, good vs bad rules, default-deny vs default-allow, and proxies",
"Explain a two-firewall DMZ and what an IDS can and can't do",
"Explain the three secure VPN mechanisms, especially tunnelling",
"Explain what a digital certificate and a CSR contain, and how a client trusts a certificate",
"Outline the TLS handshake, PKI and forward secrecy",
"Explain how Kerberos builds up (AS, TGS, session keys) and why it resists replay"
]
});

/* ---------- Hands-on: practice terminal, challenges, real-tool guides, exam scenarios ---------- */
COURSE.hands(4,{
  title:'Week 4 workbench (a pretend network)',
  intro:`<p>This lab is a small pretend office network. You are logged in to the <code>gateway</code> (10.0.0.1) as an admin who may use <code>sudo</code>. You can scan the network with <code>nmap</code>, set firewall rules with <code>iptables</code>, inspect certificates with <code>openssl</code> and try a Kerberos login. Everything is simulated inside this page: nothing here ever touches a real network.</p>`,
  env:{
    hostname:'gateway',
    date:'Sat Mar 15 10:00:00 UTC 2025',
    sudo:true,
    scanFrom:'10.0.0.77',
    self:{ip:'10.0.0.1',name:'gateway.lab.example',ports:{22:['open','ssh','OpenSSH 9.6'],80:['open','http','nginx 1.24.0'],3306:['open','mysql','MySQL 8.0.36'],8080:['open','http-proxy','']}},
    hosts:{
      '10.0.0.10':{ip:'10.0.0.10',name:'web.lab.example',ports:{80:['open','http','nginx 1.24.0'],443:['open','https','nginx 1.24.0']}},
      '10.0.0.20':{ip:'10.0.0.20',name:'db.lab.example',ports:{22:['open','ssh','OpenSSH 7.2p2 Ubuntu 4ubuntu2.10'],3306:['open','mysql','MySQL 5.7.30']}},
      '10.0.0.30':{ip:'10.0.0.30',name:'printer.lab.example',ports:{631:['open','ipp',''],9100:['open','jetdirect','']}},
      '10.0.0.40':{ip:'10.0.0.40',name:'legacy.lab.example',ports:{21:['open','ftp','vsftpd 2.3.4'],23:['open','telnet','Linux telnetd']}},
      '10.0.0.50':{ip:'10.0.0.50',name:'oldpc.lab.example',up:false,ports:{}}
    },
    rules:{policy:'ACCEPT',list:[]},
    kerberos:{realm:'LAB.EXAMPLE',users:{student:'riverside'},services:['HTTP/web.lab.example','host/db.lab.example']},
    certs:{
      '/home/student/certs/shop.pem':{subject:[['CN','shop.example.com'],['O','Shop Ltd']],issuer:[['CN','Example Intermediate CA'],['O','Example Trust']],notBefore:'Jan 10 00:00:00 2025 GMT',notAfter:'Apr 10 00:00:00 2025 GMT',serial:'4F2A91',san:['shop.example.com','www.shop.example.com'],bits:2048},
      '/home/student/certs/mail.pem':{subject:[['CN','mail.example.com'],['O','Shop Ltd']],issuer:[['CN','Example Intermediate CA'],['O','Example Trust']],notBefore:'Jan 28 00:00:00 2024 GMT',notAfter:'Feb  2 23:59:59 2025 GMT',serial:'4B1177',san:['mail.example.com'],bits:2048,expired:true},
      '/home/student/certs/intranet.pem':{subject:[['CN','intranet.lab.example'],['O','Shop Ltd']],issuer:[['CN','intranet.lab.example'],['O','Shop Ltd']],notBefore:'Mar  1 00:00:00 2024 GMT',notAfter:'Mar  1 00:00:00 2034 GMT',serial:'01',san:['intranet.lab.example'],bits:2048,ca:true}
    },
    tls:{
      'pay.example.com':{chain:[{s:'CN = pay.example.com',i:'CN = Example Intermediate CA'},{s:'CN = Example Intermediate CA',i:'CN = Example Root CA'}],verify:'ok',proto:'TLSv1.3',cipher:'TLS_AES_256_GCM_SHA384'},
      'shop.example.com':{chain:[{s:'CN = shop.example.com',i:'CN = Example Intermediate CA'},{s:'CN = Example Intermediate CA',i:'CN = Example Root CA'}],verify:'ok',proto:'TLSv1.3',cipher:'TLS_AES_256_GCM_SHA384'},
      'staging.example.com':{chain:[{s:'CN = staging.example.com',i:'CN = staging.example.com'}],verify:'18 (self-signed certificate)',proto:'TLSv1.2',cipher:'ECDHE-RSA-AES128-GCM-SHA256'}
    },
    fs:{
      '/home/student/README.txt':'Week 4 workbench\n================\nYou are the admin of "gateway" (10.0.0.1). The office LAN is 10.0.0.0/24.\n  nmap     scan hosts:  nmap -sn 10.0.0.0/24   nmap -sV db   nmap -p 23 10.0.0.0/24\n  iptables the firewall of this machine (needs sudo):  sudo iptables -L -n\n  openssl  certificates: files are in ~/certs;  openssl s_client -connect pay.example.com:443\n  kinit    Kerberos login. User: student   Password: riverside   (echo riverside | kinit student)\n  as       lab helper to scan as an outsider:  as 203.0.113.5 nmap gateway\nThe connection table of the web server is in ~/netstat.txt\n',
      '/home/student/certs/shop.pem':'-----BEGIN CERTIFICATE-----\n(pretend certificate for shop.example.com: the details are read with openssl x509)\n-----END CERTIFICATE-----\n',
      '/home/student/certs/mail.pem':'-----BEGIN CERTIFICATE-----\n(pretend certificate for mail.example.com: the details are read with openssl x509)\n-----END CERTIFICATE-----\n',
      '/home/student/certs/intranet.pem':'-----BEGIN CERTIFICATE-----\n(pretend certificate for intranet.lab.example: the details are read with openssl x509)\n-----END CERTIFICATE-----\n',
      '/home/student/netstat.txt':"Proto Recv-Q Send-Q Local Address      Foreign Address        State\ntcp        0      0 10.0.0.10:80       198.51.100.23:55424   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:55168   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:52512   SYN_RECV\ntcp        0      0 10.0.0.10:443      192.0.2.60:48960   ESTABLISHED\ntcp        0      0 10.0.0.10:80       198.51.100.23:49568   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:46688   SYN_RECV\ntcp        0      0 10.0.0.10:443      10.0.0.15:57184   ESTABLISHED\ntcp        0      0 10.0.0.10:80       198.51.100.23:50784   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:42912   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:59552   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:58304   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:49056   SYN_RECV\ntcp        0      0 10.0.0.10:80       192.0.2.60:41792   TIME_WAIT\ntcp        0      0 10.0.0.10:80       192.0.2.44:51840   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:43360   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:49760   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:54912   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:41408   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:54400   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:42112   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:51744   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:46904   SYN_RECV\ntcp        0      0 10.0.0.10:80       10.0.0.15:43392   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:49568   SYN_RECV\ntcp        0      0 10.0.0.10:80       192.0.2.44:47072   SYN_RECV\ntcp        0      0 10.0.0.10:80       203.0.113.77:44480   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:46688   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:41888   SYN_RECV\ntcp        0      0 10.0.0.10:80       10.0.0.15:52480   TIME_WAIT\ntcp        0      0 10.0.0.10:80       198.51.100.23:52928   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:44448   SYN_RECV\ntcp        0      0 10.0.0.10:443      10.0.0.15:46240   ESTABLISHED\ntcp        0      0 10.0.0.10:80       198.51.100.23:45760   SYN_RECV\ntcp        0      0 10.0.0.10:443      10.0.0.31:54656   ESTABLISHED\ntcp        0      0 10.0.0.10:80       198.51.100.23:41376   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:57728   SYN_RECV\ntcp        0      0 10.0.0.10:443      10.0.0.15:54784   ESTABLISHED\ntcp        0      0 10.0.0.10:80       203.0.113.77:56544   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:57472   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:44224   SYN_RECV\ntcp        0      0 10.0.0.10:443      192.0.2.60:43712   ESTABLISHED\ntcp        0      0 10.0.0.10:80       10.0.0.15:58880   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:44128   SYN_RECV\ntcp        0      0 10.0.0.10:443      10.0.0.15:42496   ESTABLISHED\ntcp        0      0 10.0.0.10:443      10.0.0.31:45920   ESTABLISHED\ntcp        0      0 10.0.0.10:80       192.0.2.60:52576   TIME_WAIT\ntcp        0      0 10.0.0.10:80       198.51.100.23:52192   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:51360   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:42528   SYN_RECV\ntcp        0      0 10.0.0.10:80       10.0.0.31:52960   TIME_WAIT\ntcp        0      0 10.0.0.10:80       198.51.100.23:40448   SYN_RECV\ntcp        0      0 10.0.0.10:80       198.51.100.23:59744   SYN_RECV\ntcp        0      0 10.0.0.10:443      10.0.0.31:48896   ESTABLISHED\ntcp        0      0 10.0.0.10:443      10.0.0.15:45920   ESTABLISHED\n"
    }
  },
  try:['cat README.txt','nmap -sn 10.0.0.0/24','nmap -sV db','sudo iptables -L -n','openssl x509 -in certs/shop.pem -noout -subject -issuer -dates','echo riverside | kinit student'],
  tasks:[
    {id:'hosts',title:'How many machines are alive?',level:'Easy',xp:15,
     brief:`<p>Do a <strong>ping sweep</strong> of the office network, <code>10.0.0.0/24</code>, that only finds live hosts and scans no ports. <strong>How many hosts are up?</strong> (The output ends with a summary line.)</p>`,
     hints:[`<code>nmap -sn 10.0.0.0/24</code>, then read the last line: "(N hosts up)".`],
     answer:['5'],
     why:`<p>Five machines answered: the gateway, web, db, printer and legacy. A fixed list of live hosts is the first step of reconnaissance, and for a defender it is also an <strong>asset inventory</strong>. A machine you did not know existed is a finding. The machine <code>oldpc</code> is down, so it is not counted.</p>`},
    {id:'telnet',title:'Find the cleartext service',level:'Easy',xp:20,
     brief:`<p>Telnet sends everything, including passwords, as <strong>plain text</strong>. Scan port 23 across the whole office network. <strong>Which host listens on telnet?</strong> (Give its name or IP address.)</p>`,
     hints:[`<code>nmap -p 23 10.0.0.0/24</code> prints a block for every live host. Look for the one where 23/tcp is <em>open</em> (the others say closed).`,`Shortcut: pipe to grep and keep some lines of context: <code>nmap -p 23 10.0.0.0/24 | grep -B4 "23/tcp *open"</code> (the <code>*</code> allows for the extra spaces in nmap's columns)`],
     answer:['legacy','10.0.0.40','legacy.lab.example'],
     why:`<p>The <code>legacy</code> machine (10.0.0.40) also runs FTP, another cleartext protocol. Anyone able to sniff the LAN could read the logins (remember packet sniffing and promiscuous mode from the notes). The fix is to replace both with <strong>SSH and SFTP</strong>, or if the machine cannot be changed, put it on its own segment behind a firewall.</p>`},
    {id:'version',title:'An outdated service',level:'Medium',xp:25,
     brief:`<p>Version detection (<code>-sV</code>) asks each open port what software answers. The <strong>database server</strong> (<code>db</code>) has SSH open. <strong>Which OpenSSH version is it running?</strong> (Give the version number such as 9.6p1.)</p>`,
     hints:[`<code>nmap -sV -p 22 db</code> and read the VERSION column.`],
     answer:['7.2p2'],re:'7\\.2p2',
     why:`<p>OpenSSH 7.2 is years old and has since had many security fixes. A scan like this gives an attacker a list of known vulnerabilities to try, and gives a defender the same list to <strong>patch</strong>. It also shows why servers should not advertise more detail than they need to.</p>`},
    {id:'fw',title:'Write the gateway firewall',level:'Hard',xp:50,kind:'state',
     expect:{host:'gateway',cases:[
        {from:'10.0.0.77',ports:{22:'open',80:'open',3306:'open',8080:'filtered'}},
        {from:'203.0.113.5',ports:{22:'filtered',80:'open',3306:'filtered',8080:'filtered'}}]},
     brief:`<p>Right now the gateway has <strong>no rules</strong>: all four of its services are reachable by anyone on the internet. Change that so the policy is:</p><ul><li><strong>Web (80)</strong>: open to everyone.</li><li><strong>SSH (22)</strong> and <strong>MySQL (3306)</strong>: only from the office LAN, <code>10.0.0.0/24</code>.</li><li><strong>Everything else</strong>, including the admin panel on <code>8080</code>, must be blocked for everyone.</li></ul><p>Use <code>sudo iptables</code> (check your rules with <code>sudo iptables -L -n --line-numbers</code>). Then test it from an office machine with <code>nmap gateway</code> and from an outsider with <code>as 203.0.113.5 nmap gateway</code>, and press <em>Check my work</em>.</p>`,
     hints:[`Start with <strong>default deny</strong>: <code>sudo iptables -P INPUT DROP</code>. Then allow only what you need.`,`<code>sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT</code> for the web, and the same with <code>--dport 22 -s 10.0.0.0/24</code> and <code>--dport 3306 -s 10.0.0.0/24</code> for the LAN-only services.`],
     why:`<p>This is the good-rule pattern from the notes: <strong>default-deny</strong> and then explicit allows, each as narrow as possible (a service <em>and</em> a source). If you only added the ACCEPT rules but left the policy at ACCEPT, port 8080 would still be reachable. DROP makes a port look <em>filtered</em> (no reply) rather than <em>closed</em> (a refusal), which tells a scanner less. Rules are checked top to bottom and the first match wins, so order matters once you add broad rules.</p>`},
    {id:'expired',title:'Which certificate has expired?',level:'Medium',xp:25,
     brief:`<p>The folder <code>~/certs</code> has three certificates: <code>shop.pem</code>, <code>mail.pem</code> and <code>intranet.pem</code>. Today is 15 March 2025. Look at the validity dates with <code>openssl x509 -in FILE -noout -dates</code>. <strong>Which file holds the expired certificate?</strong></p>`,
     hints:[`<code>openssl x509 -in certs/mail.pem -noout -dates</code> shows <code>notBefore</code> and <code>notAfter</code>. Compare notAfter with today. Or ask the tool: add <code>-checkend 0</code>.`],
     answer:['mail.pem','certs/mail.pem','mail'],
     why:`<p>The mail certificate ended on 2 February 2025. A browser or mail client will show a warning or refuse the connection. Expired certificates are one of the most common real-world outages, and an even worse habit follows: people learn to click through warnings. That makes a real man-in-the-middle attack easy to miss.</p>`},
    {id:'selfsigned',title:'Which certificate is self-signed?',level:'Medium',xp:25,
     brief:`<p>A certificate is <strong>self-signed</strong> when it was issued by itself, so its <em>issuer</em> is the same as its <em>subject</em>. No third-party CA has vouched for it. Look at <code>-subject -issuer</code> for each file. <strong>Which file is self-signed?</strong></p>`,
     hints:[`<code>openssl x509 -in certs/intranet.pem -noout -subject -issuer</code> and compare the two lines. Do the same for the others.`],
     answer:['intranet.pem','certs/intranet.pem','intranet'],
     why:`<p>A browser has no reason to trust the intranet certificate, because it chains to nobody it knows. For an internal site you can distribute your own root certificate to staff devices, but a self-signed certificate on a public site means every visitor gets a warning (or has to blindly trust it, which is exactly what a MITM wants).</p>`},
    {id:'chain',title:'Which site fails verification?',level:'Medium',xp:25,
     brief:`<p>Connect to each of <code>pay.example.com</code>, <code>shop.example.com</code> and <code>staging.example.com</code> with <code>openssl s_client -connect HOST:443</code>. Read the <em>Certificate chain</em> and the <em>Verification</em> line. <strong>Which host fails certificate verification?</strong></p>`,
     hints:[`Try <code>openssl s_client -connect staging.example.com:443</code> and look at "Verification" and the chain: how many certificates, and who signed the first?`],
     answer:['staging.example.com','staging'],
     why:`<p>The staging server sent a single certificate signed by itself (<em>"self signed certificate"</em>), so there is no chain up to a trusted root. The other two show a <strong>chain of trust</strong>: leaf certificate, then the intermediate CA that signed it, up to a root already in your device's trust store. Also note the protocol: staging only offers TLS 1.2, while the others use TLS 1.3.</p>`},
    {id:'krb',title:'Get a Kerberos ticket',level:'Medium',xp:30,
     brief:`<p>Log in to Kerberos as <code>student</code> (password: <code>riverside</code>) using <code>echo riverside | kinit student</code>. Then ask for a ticket to the web service with <code>kvno HTTP/web.lab.example</code> and list your tickets with <code>klist</code>. The first ticket in the list is the one the Authentication Server gave you at login. <strong>What is the name before the "/" in that ticket's service principal?</strong></p>`,
     hints:[`Run the three commands in order, then read the "Service principal" column of <code>klist</code>.`],
     answer:['krbtgt'],
     why:`<p><code>krbtgt/LAB.EXAMPLE</code> is the <strong>ticket-granting ticket (TGT)</strong>: a ticket <em>for the ticket-granting service</em>. You got it once, with your password, and now you present it to the TGS whenever you need a ticket for another service. That is why you do not type your password for each service (single sign-on), and the password itself never travels over the network. The second line in <code>klist</code>, the HTTP service ticket, is what the web server actually accepts.</p>`},
    {id:'synflood',title:'Spot the SYN flood',level:'Hard',xp:40,
     brief:`<p><code>~/netstat.txt</code> is a snapshot of the web server's connection table (columns: protocol, receive queue, send queue, local address, remote address, state). Many connections are stuck in <code>SYN_RECV</code>: the server answered the first handshake step with SYN-ACK but never got the final ACK. <strong>Which remote IP address has the most half-open (SYN_RECV) connections?</strong></p>`,
     hints:[`<code>grep SYN_RECV netstat.txt</code> keeps the half-open lines. The remote address is column 5, like <code>198.51.100.23:51234</code>.`,`<code>grep SYN_RECV netstat.txt | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head</code>`],
     answer:['198.51.100.23'],
     why:`<p>This is the signature of a <strong>SYN flood</strong>: the attacker opens the three-way handshake but never completes it, so the server's backlog fills with half-open entries and real users are refused. In a real attack the source addresses are usually <em>spoofed</em> and spread out, so you could not just block one IP; defences include SYN cookies, rate limits and upstream filtering. Here one address dominates so the pattern is easy to see.</p>`}
  ],
  guides:[
    {id:'wireshark',title:'Watch a TCP handshake and a TLS handshake in Wireshark',time:'20 min',tags:['Windows','Mac','Linux'],
     intro:`<p>Wireshark is the standard packet analyser. Capture only <strong>your own machine's traffic</strong> and only on networks you are allowed to use. Never capture on a shared or public network you do not control. Install it from <a href="https://www.wireshark.org/download.html" target="_blank" rel="noopener">wireshark.org</a>.</p>`,
     steps:[
      {t:'Start a capture',say:`<p>Open Wireshark, double-click your active connection (Wi-Fi or Ethernet) and the live packets appear. Close other busy programs first to keep it readable.</p>`},
      {t:'Make some plain HTTP traffic',say:`<p>In a browser open <code>http://neverssl.com</code>, a site that deliberately uses unencrypted HTTP. Then stop the capture (red square).</p>`},
      {t:'Find the handshake',cmd:`tcp.flags.syn == 1`,say:`<p>Paste that into the filter bar and press Enter. Look for a <strong>SYN</strong> from your machine, a <strong>SYN, ACK</strong> back, and then an <strong>ACK</strong>. That is the three-way handshake from the notes. Clear the filter and find the three packets in order.</p>`},
      {t:'Read the page in plain text',cmd:`http`,say:`<p>Right-click an HTTP packet, choose <em>Follow &rarr; TCP Stream</em>. You can read the request and the web page. Anyone on the path could do the same: this is why cleartext protocols are dangerous.</p>`},
      {t:'Compare with HTTPS',cmd:`tls.handshake`,say:`<p>Browse to any HTTPS site, then use this filter. Find the <strong>Client Hello</strong> and <strong>Server Hello</strong>. Open the Server Hello packet and see the TLS version and the cipher suite that was chosen. Following the TCP stream now shows only unreadable bytes. The server's certificate is visible in the handshake (TLS 1.2) but hidden in TLS 1.3.</p>`,see:`Client Hello, Server Hello, then encrypted "Application Data".`}
     ]},
    {id:'nmap',title:'Scan your own machine with Nmap',time:'15 min',tags:['Windows','Mac','Linux'],
     intro:`<p><strong>Only scan machines you own or have written permission to test.</strong> Scanning other people's systems can be against the law and against university rules. Safe targets: your own computer (<code>localhost</code>), and <code>scanme.nmap.org</code>, a server the Nmap project provides for exactly this practice (be gentle: a few scans only). Install Nmap from <a href="https://nmap.org/download.html" target="_blank" rel="noopener">nmap.org</a>.</p>`,
     steps:[
      {t:'Scan yourself',cmd:`nmap localhost`,see:`a short list of open ports on your own computer, or "All 1000 scanned ports are closed" if nothing is listening.`},
      {t:'Ask what is running',cmd:`nmap -sV localhost`,say:`<p>Compare the VERSION column with what you expected. Is anything listening that you did not know about?</p>`},
      {t:'Scan the practice server',cmd:`nmap -sV scanme.nmap.org`,say:`<p>Expect a few open ports (such as 22 and 80) and the software versions. You have just done the reconnaissance step a defender and an attacker both do.</p>`},
      {t:'Name the port states',say:`<p>Look at the STATE column: <strong>open</strong> (a service is listening), <strong>closed</strong> (reachable, nothing listening) and <strong>filtered</strong> (no reply, usually a firewall dropping the packet). Match each one to what you saw in the practice terminal when you used DROP versus nothing.</p>`},
      {t:'Reflect',say:`<p>Write down what an attacker would learn from your output and what a defender should do about it (close unused services, patch, firewall, hide banners).</p>`}
     ]},
    {id:'certs',title:'Inspect a real certificate chain',time:'15 min',tags:['Mac','Linux','Git Bash','WSL'],
     intro:`<p>Look at the certificates behind the padlock. <code>openssl</code> is included with Git Bash, Mac and Linux. The site <code>badssl.com</code> is a harmless test site that deliberately serves broken certificates.</p>`,
     steps:[
      {t:'See the chain',cmd:`openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null | grep -E "^ *[0-9] s:|^ *i:"`,see:`pairs of <code>s:</code> (subject) and <code>i:</code> (issuer). The issuer of one is the subject of the next: that is the chain of trust.`},
      {t:'Read the dates and the issuer',cmd:`openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null | openssl x509 -noout -subject -issuer -dates`},
      {t:'Break it on purpose',cmd:`curl -sS https://expired.badssl.com/ -o /dev/null\ncurl -sS https://self-signed.badssl.com/ -o /dev/null`,see:`errors such as "certificate has expired" and "self-signed certificate". Compare them with the practice terminal's expired and self-signed challenges.`},
      {t:'Do the same in your browser',say:`<p>Click the padlock on any HTTPS site and open the certificate viewer. Find the issuer, the dates, and the "Certification Path" (the chain). Notice the difference between the leaf, the intermediate and the root.</p>`}
     ]},
    {id:'kerberos',title:'See real Kerberos tickets (if your PC is on a domain)',time:'5 min',tags:['Windows'],
     intro:`<p>Kerberos needs a KDC, which is a lot to set up at home. But if you use a Windows PC that is joined to a university or work <strong>domain</strong> (Active Directory uses Kerberos), you can look at your real tickets in seconds. This only <em>reads</em> your own tickets. If your PC is not on a domain, skip this guide.</p>`,
     steps:[
      {t:'List your tickets',cmd:`klist`,see:`a "Cached Tickets" list. Find the <code>krbtgt/...</code> entry: your TGT. Other entries are service tickets for file servers and so on.`},
      {t:'Compare with the lab',say:`<p>Match what you see (client, server, start time, end time, renew time) with the practice terminal's <code>klist</code>. Note how long the ticket lasts (typically 10 hours): short lifetimes limit the damage if one is stolen.</p>`}
     ]}
  ],
  scenarios:[
    {id:'dmz',title:'Protect the new web shop',
     setup:`<p>A small company is launching an online shop. It has a <strong>web server</strong> (customers connect from the internet), a <strong>database</strong> with customer orders, a <strong>mail server</strong>, and 20 <strong>staff PCs</strong>. At the moment everything sits on one flat network behind a single router. The owner asks you to design the network protection.</p>`,
     tasks:[
      {q:`<p>Draw (describe) a design using two firewalls and a DMZ. Say which machines go where, and why.</p>`,
       model:`<p>Use a <strong>two-firewall DMZ</strong>. The <strong>outer firewall</strong> faces the internet; the <strong>DMZ</strong> sits between it and the <strong>inner firewall</strong>; the <strong>internal network</strong> is behind the inner firewall. The web server and the mail server (the public-facing services) go in the <strong>DMZ</strong>, because they will be attacked and must be reachable. The database and the staff PCs go in the <strong>internal network</strong> where nothing from the internet can connect directly. If the web server is compromised, the attacker is still outside the inner firewall.</p>`,
       points:[`Outer firewall, DMZ, inner firewall, internal network`,`Public-facing servers (web, mail) in the DMZ`,`Database and staff PCs internal, not directly reachable`,`Reason: a compromised DMZ server does not expose the internal network`]},
      {q:`<p>Write the key rules for the outer and inner firewall. Use the idea of default-deny.</p>`,
       model:`<p>Both firewalls start with <strong>default deny</strong>. <em>Outer:</em> allow inbound TCP 443 (and 80 for redirect) to the web server, TCP 25 to the mail server; allow replies to established connections; deny everything else. <em>Inner:</em> allow the web server to reach the database on its one port (e.g. TCP 3306) <strong>only from the web server's address</strong>; allow staff PCs to connect out to the DMZ and the internet through a proxy; deny all other connections from the DMZ to the internal network. Each rule names a specific service and source, as narrow as possible.</p>`,
       points:[`Default deny on both firewalls`,`Outer: only the public service ports to the DMZ servers`,`Inner: DB port only from the web server`,`Rules are specific (port and source), not broad`]},
      {q:`<p>Where would you put an intrusion detection system, and what can't it do for you?</p>`,
       model:`<p>Put a <strong>network IDS</strong> in the DMZ (and possibly on the internal side of the inner firewall) so it sees attacks that get past the outer firewall, plus a host IDS on the web and database servers. An IDS <strong>detects and alerts</strong>; it does not by itself stop an attack (an IPS blocks), it can produce <strong>false positives</strong> that bury real alerts, can miss new or encrypted attacks (a signature-based IDS only knows old patterns), and needs a person to respond.</p>`,
       points:[`IDS placed where attacks that pass the firewall are visible (DMZ/internal)`,`Detects and alerts, does not block (IPS does)`,`Limits: false positives, unknown attacks, encrypted traffic, needs human response`]}
     ]},
    {id:'tlskrb',title:'The warning screen and the single sign-on',
     setup:`<p>A colleague emails you a screenshot of a browser warning on the company's payroll site: <em>"Your connection is not private: the certificate is not trusted."</em> She asks if she can just click "Continue anyway". Later the same day she asks why she only types her password once in the morning, yet can open the intranet, file server and mail without logging in again.</p>`,
     tasks:[
      {q:`<p>Explain what the browser checks in a certificate and give three different reasons this warning could appear. Should she click through?</p>`,
       model:`<p>The browser checks that the certificate is <strong>signed by a CA it trusts</strong> (a valid chain up to a root in its trust store), that the <strong>name matches</strong> the site (CN or SAN), that it is <strong>within its validity dates</strong>, and that it has <strong>not been revoked</strong>. A warning can mean: the certificate has <strong>expired</strong>; it is <strong>self-signed</strong> or from an unknown CA; the name does not match (wrong site); or someone is performing a <strong>man-in-the-middle</strong> attack with a certificate they made. She should <strong>not click through</strong> on a payroll site: she cannot tell the harmless causes from the attack, and entering credentials on a MITM'd connection gives them to the attacker. Report it to IT, who can check the real reason.</p>`,
       points:[`Trusted CA chain, name match, validity dates, revocation`,`Gives three reasons (expired, self-signed/unknown CA, name mismatch, MITM)`,`Advises not to click through on a sensitive site and to report it`]},
      {q:`<p>Briefly describe how TLS protects the payroll login once the certificate is accepted. Why does forward secrecy matter?</p>`,
       model:`<p>In the <strong>TLS handshake</strong> the client and server agree on a protocol version and cipher suite, the server sends its certificate and proves possession of the private key, and they use public-key cryptography (a key exchange) to agree a <strong>shared session key</strong>. From then on the data is encrypted and authenticated with fast symmetric encryption and a MAC, protecting <strong>confidentiality and integrity</strong>. With <strong>forward secrecy</strong>, the session keys come from temporary (ephemeral) key exchanges, so if the server's long-term private key is stolen later, recorded old sessions still cannot be decrypted.</p>`,
       points:[`Certificate shows the server's identity (authentication)`,`Key exchange creates a shared session key`,`Symmetric encryption and MAC protect confidentiality and integrity`,`Forward secrecy: ephemeral keys, old sessions safe if the long-term key leaks`]},
      {q:`<p>Explain why she only types her password once, using Kerberos. Why is the password never sent over the network, and how are replayed tickets resisted?</p>`,
       model:`<p>At login she authenticates to the <strong>Authentication Server</strong> and receives a <strong>ticket-granting ticket (TGT)</strong>, encrypted so only the TGS (and not she) can read it, together with a session key encrypted with a key derived from her password, so only someone who knows the password can use the reply. Her password is never sent. For each service (intranet, file server, mail) her machine shows the TGT to the <strong>TGS</strong> and gets a <strong>service ticket</strong>, so she does not type the password again (single sign-on). Tickets carry a <strong>timestamp and lifetime</strong>, and requests include an <strong>authenticator</strong> encrypted with the session key, so a captured ticket cannot simply be replayed later. The <strong>KDC</strong> is a single point of failure.</p>`,
       points:[`AS issues a TGT; password only used locally to decrypt the reply (never sent)`,`TGS issues service tickets, giving single sign-on`,`Timestamps/authenticators and short lifetimes resist replay`,`Mention the KDC as a single point of failure`]}
     ]}
  ]
});
