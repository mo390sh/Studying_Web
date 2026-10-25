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
