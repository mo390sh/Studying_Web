COURSE.add({
n:2,
title:"Cryptography Made Simple",
blurb:"Randomness, hashes, MACs, RSA, Diffie-Hellman, digital signatures and end-to-end encryption, with the session and scenario questions answered.",
topics:["Randomness and the one-time pad","Hash functions","MACs","Public keys and RSA","Diffie-Hellman","Digital signatures","End-to-end encryption"],
labs:["hash","rsa","dh"],

parts:[
{tag:"1",title:"The big picture",html:`
<p>Cryptography gives you different security properties. Each tool in this module gives a specific one. Learn this table first; the rest of the week fills in the details.</p>
${note("key","Your session slide says it in one line: <strong>Confidentiality = encryption. Integrity and authenticity = MAC and digital signatures.</strong>")}
${tbl(["Tool","Keys used","Gives you","In one line"],[
["Symmetric encryption (AES)","One shared secret key","Confidentiality","Fast scrambling of data; the hard part is sharing the key"],
["Hash (SHA-256)","No key","Integrity check","A fingerprint of data; you must trust where the fingerprint came from"],
["MAC","One shared secret key","Integrity + authenticity","A hash that needs a secret key, so attackers cannot forge it"],
["Asymmetric encryption (RSA)","Public + private key pair","Confidentiality","Anyone can lock with your public key; only your private key unlocks"],
["Diffie-Hellman","Public values + private numbers","Agreeing a shared key","Two people create the same secret key over an open channel"],
["Digital signature","Private key signs, public key verifies","Integrity + authenticity","Proves the document is unchanged and came from the key owner"]
])}
<h3>Plain-English definitions</h3>
<ul>
<li><strong>Confidentiality:</strong> only the right people can read it.</li>
<li><strong>Integrity:</strong> it has not been changed.</li>
<li><strong>Authenticity:</strong> it really came from who it claims to come from.</li>
</ul>
<p>Remember from Week 1: this is the CIA triad. Encryption protects the C; MACs, hashes and signatures protect the I.</p>
`},

{tag:"2",title:"Randomness and the one-time pad",html:`
<p>Good cryptography needs <strong>unpredictable</strong> numbers, for keys, seeds and salts. Predictable keys are easy to guess, however strong the cipher is.</p>

<h3>2.1 True randomness vs pseudo-randomness</h3>
${tbl(["","True random","Pseudo-random (PRNG)"],[
["What it is","No way to predict the next value; every value equally likely, no pattern","An algorithm that produces numbers that look random"],
["Where it comes from","Unpredictable natural things: atmospheric noise, lava lamps, coin flips, lottery draws","A starting value called a seed, then a formula"],
["Repeatable?","No","Yes: same seed gives the same sequence"],
["Speed","Hard to collect in bulk","Fast and efficient"]
])}
<ul>
<li><strong>Seed:</strong> the starting number. In cryptography the seed should itself be truly random, and shared only with people who need to reproduce the sequence.</li>
<li><strong>CSPRNG</strong> (Cryptographically Secure PRNG): a PRNG good enough for cryptography. For this module: its output should be indistinguishable from true randomness.</li>
<li><strong>Period:</strong> a PRNG eventually repeats. The point where it starts repeating is the period. Good ones have a period so long it does not matter in practice.</li>
<li>A PRNG's repeatability is useful: for example, two sides can regenerate the same key stream from the same seed.</li>
</ul>

<h3>2.2 Example: the middle-square method</h3>
<p>The first PRNG, by John von Neumann in 1949. Steps: take the seed, square it, take the middle digits as the next number, repeat. If the square has an odd number of digits, pad with zeros first.</p>
${pre(`
seed 1234 -> 1234^2 = 1522756 -> pad to 01522756 -> middle four digits: 5227
5227 -> 5227^2 = 27321529 -> middle four digits: 3215
3215 -> 3362 -> 3030 -> 1809 -> ...`)}
<p>It looks random, but it is fully determined by the seed. It is not secure; it is a historic teaching example.</p>

<h3>2.3 The one-time pad (OTP)</h3>
<p>Encrypt each character with a truly random key character, using a shift like the Caesar cipher. Your notes use a=1, b=2, … z=26 (if the sum goes above 26, subtract 26).</p>
${pre(`
Key:        l  x  t  y  o      (12, 24, 20, 25, 15)
Plaintext:  h  e  l  l  o      ( 8,  5, 12, 12, 15)
Sum:        20 29 32 37 30
Minus 26:   20  3  6 11  4
Ciphertext: t  c  f  k  d`)}
${note("warn","This working gives <strong>tcfkd</strong>. Your notes write tcfld; the fourth letter looks like a small typo (12 + 25 = 37, minus 26 = 11, which is k). Check the notes or ask in the forum.")}
<h4>The four rules for a real one-time pad</h4>
<ol>
<li>The key is <strong>truly random</strong>.</li>
<li><strong>Only two copies</strong> exist: one to encrypt, one to decrypt.</li>
<li>The key is used <strong>once only</strong> and then destroyed.</li>
<li>The key is <strong>at least as long</strong> as the message.</li>
</ol>
<p><strong>Perfect secrecy:</strong> if used correctly, a one-time pad cannot be broken, however much computing power an attacker has. The ciphertext could decrypt to any message of the same length, so the attacker can only guess.</p>
<p><strong>Why we don't use it everywhere:</strong> getting a long truly random key is hard, and sharing that key safely is just as hard as the original problem. (A tiny example like the one above could simply be guessed, since there are so few possible messages. Perfect secrecy needs real-world length and proper use.)</p>
`},

{tag:"3",title:"Cryptographic hash functions",html:`
<p><strong>One-line idea:</strong> a hash function turns any amount of data into a short fixed-size fingerprint.</p>

<h3>3.1 What it is</h3>
<p>A <strong>cryptographic primitive</strong> is a basic building block that bigger security systems are built from. A hash function is one. It takes data of any length and produces a fixed-length value, called the <strong>hash value</strong> or <strong>digest</strong>.</p>
<p>Examples: <strong>SHA-256</strong> (used in modern practice) and <strong>MD5</strong> (considered insecure today, but still used as a teaching example). The notes give this: the SHA-256 of "this is an arbitrary length string" is:</p>
${pre("018D17D6672278F09D99C87B882A4D0AC00CB7322A471BFAA49C6E32C71937E0")}
<p>Whatever the input size, SHA-256 always gives 256 bits (64 hex characters). You can calculate hashes with any online calculator, or in a Windows terminal with <code>certutil -hashfile file.txt SHA256</code> (on Linux: <code>sha256sum file.txt</code>). The tool below computes it live, so you can confirm the digest above.</p>
${lab("hash")}

<h3>3.2 The properties</h3>
${tbl(["Property","Meaning","Simple way to think of it"],[
["Deterministic","Same input + same hash function always gives the same hash","Same fingerprint every time"],
["Pre-image resistant (one-way)","Given a hash, it is computationally infeasible to find an input that produced it","You can't rebuild the person from the fingerprint"],
["Second pre-image resistant","Given a hash h1 and its message, infeasible to find a different message with the same hash","You have one fingerprint and can't find a second person who matches it"],
["Collision resistant","Infeasible to find any two different messages with the same hash","You can't find any two people with the same fingerprint"]
])}
${note("key","<strong>Second pre-image vs collision</strong> (your notes stress this): in second pre-image you are <em>given</em> a message and must find another that matches it. In a collision you are given nothing; you just need any two messages that match. Collisions are easier to find than second pre-images, so collision resistance is the strong property.")}
<p>Quick matcher (these are your session questions):</p>
${tbl(["Attacker's goal","Property that stops it"],[
["Have a hash, want to recover the document","Pre-image resistance"],
["Have a document + its hash, want a different document with the same hash","Second pre-image resistance"],
["Want to create two different documents with the same hash (e.g. two contracts)","Collision resistance"]
])}

<h3>3.3 What are hashes for?</h3>
<p><strong>Checking a download.</strong> A trusted website gives you a file and its published hash (and the hash function used). You hash the downloaded file yourself. If your value matches, the file is unchanged. If an attacker modified it, the hash would not match, and you would not install it.</p>
<p>Hashes are also used inside digital signatures (Part 7) and in password storage (Week 3).</p>

<h3>3.4 Limitations</h3>
<ul>
<li><strong>Tiny or predictable inputs can't be protected.</strong> If the input is just one bit (or a short, guessable message), an attacker simply tries all the possibilities, hashes each, and finds the match.</li>
<li><strong>You must trust where the hash came from.</strong> If an attacker can change both the file and the hash shown on the page, the check proves nothing. The hash needs to arrive over a secure, trusted channel.</li>
</ul>
<p>That second limitation leads straight to MACs.</p>
`},

{tag:"4",title:"MACs (message authentication codes)",html:`
<p><strong>One-line idea:</strong> a MAC is like a hash that needs a secret key. Only people who know the key can create or check a valid one.</p>

<h3>4.1 The problem</h3>
<p>Alice sends Bob a ciphertext. Encryption hides the content, but an attacker in the middle can still <strong>change</strong> the ciphertext on the way. If Alice also sends hash(ciphertext), the attacker just changes the ciphertext and calculates a new hash for the modified one. A hash has no secret in it, so anyone can compute it. (That's the answer to your session question 4.)</p>

<h3>4.2 The solution</h3>
${pre(`
Alice computes:  tag = MAC(secret key, ciphertext)
Alice sends:     ciphertext + tag
Bob recomputes the tag with the same secret key and compares.`)}
<p>If an attacker changes the ciphertext, they can't produce a matching tag, because they <strong>don't know the secret MAC key</strong>. Bob's check fails and he rejects the message. So a MAC protects against <strong>tampering with encrypted data</strong>. (A widely used MAC type is HMAC, which builds a MAC from a hash function.)</p>
${tbl(["","Hash","MAC","Digital signature"],[
["Needs a key?","No","Yes: a shared secret","Yes: a private/public key pair"],
["Stops tampering by an attacker?","No (attacker recomputes it)","Yes","Yes"],
["Who can create it?","Anyone","Anyone with the shared key (Alice or Bob)","Only the owner of the private key"]
])}
${note("rem","MAC = shared secret key. Digital signature = private key signs, public key verifies. Because both Alice and Bob hold the MAC key, a MAC can't prove which of them made a message; a signature can.")}
`},

{tag:"5",title:"Public key cryptography and RSA",html:`
<p><strong>One-line idea:</strong> instead of one shared key, everyone has a pair of keys: a public one you give to the world and a private one you keep secret.</p>

<h3>5.1 Symmetric vs asymmetric</h3>
${tbl(["","Symmetric (e.g. AES)","Asymmetric (e.g. RSA)"],[
["Keys","One key for both encrypting and decrypting","Different keys: a key pair (public + private)"],
["Speed","Fast","Much slower"],
["Big problem","How do two people share the key safely?","Slower; usually used for small things like keys and signatures"]
])}
<p>Think of the public key as an open padlock you hand out to everyone. Anyone can snap it shut on a message for you, but only you have the key that opens it.</p>

<h3>5.2 Which key do I use? (very important for exams)</h3>
${tbl(["I want to…","Use","Why"],[
["Send Max a message only Max can read","Max's PUBLIC key to encrypt","Only Max's private key can decrypt it"],
["Read a message encrypted for me","My PRIVATE key to decrypt","Only I have it"],
["Sign something to prove it's from me","My PRIVATE key to sign","Only I can make my signature"],
["Check a signature from Alex","Alex's PUBLIC key to verify","Everyone can check, nobody can forge"]
])}
${note("key","<strong>Rule of thumb:</strong> encrypt with the receiver's public key. Sign with your own private key. You always use your own key for signing and the other person's key for encrypting to them.")}

<h3>5.3 RSA key generation (your slide's steps)</h3>
<ol>
<li>Pick two large, distinct random primes, <strong>p</strong> and <strong>q</strong>.</li>
<li>Calculate <strong>n = p × q</strong>.</li>
<li>Calculate <strong>φ(n) = (p − 1)(q − 1)</strong>.</li>
<li>Pick <strong>e</strong>: a number less than φ(n) that is co-prime to φ(n) (shares no common factor except 1).</li>
<li>Calculate <strong>d</strong> so that d × e = 1 (mod φ(n)).</li>
</ol>
<p><strong>Public key = (e, n). Private key = (d, n).</strong> It is computationally infeasible to work out d from e and n alone, because that requires factoring n back into p and q, which is extremely hard when p and q are huge.</p>

<h3>5.4 RSA encryption and decryption</h3>
${pre(`
Encrypt each block B:   C = B^e mod n     (uses the public key)
Decrypt each block C:   B = C^d mod n     (uses the private key)`)}
<p>The message is split into blocks, and each block (as a number) must be smaller than n.</p>

<h3>5.5 Your toy example, step by step</h3>
${pre(`
p = 5, q = 11
n = 5 x 11 = 55
phi(n) = 4 x 10 = 40
choose e = 7        (7 and 40 share no factors)
find d: 7 x d = 1 mod 40  ->  d = 23, because 7 x 23 = 161 = 4 x 40 + 1

Public key = (7, 55)        Private key = (23, 55)

Encrypt B = 2:    2^7 = 128 ; 128 mod 55 = 18     so C = 18
Decrypt C = 18:   18^23 mod 55 = 2                original recovered`)}
<p>What <strong>mod</strong> means: only the remainder after dividing counts. 128 divided by 55 is 2 with remainder 18, so 128 mod 55 = 18.</p>
${note("tip","<strong>Calculating 18<sup>23</sup> mod 55 by hand (optional shortcut):</strong> keep squaring and reduce mod 55 each time: 18<sup>2</sup> = 49, 18<sup>4</sup> = 36, 18<sup>8</sup> = 31, 18<sup>16</sup> = 26 (all mod 55). Since 23 = 16 + 4 + 2 + 1, multiply 26 × 36 × 49 × 18, reducing as you go: 26 × 36 = 936 = 1 (mod 55); 1 × 49 = 49; 49 × 18 = 882 = 2 (mod 55). Answer: 2.")}
${lab("rsa")}

<h3>5.6 Hybrid encryption (why mix both kinds)</h3>
<p>Asymmetric encryption is slow, and symmetric encryption has the key-sharing problem. So real systems use both: use asymmetric crypto (or Diffie-Hellman) to safely share a short symmetric key, then use fast symmetric encryption (like AES) for the actual data. This is how HTTPS works.</p>
<p>Another reason, for a group of n people: with symmetric keys you need a separate secret for every pair of people (n × (n − 1) / 2 keys), while with public keys each person needs only one key pair.</p>
${note("extra","The RSA above is textbook RSA, used for teaching. Real RSA adds padding before encrypting or signing; careless padding is what the Bleichenbacher attack (mentioned in your Week 1 and signature slides) exploits.")}
`},

{tag:"6",title:"Diffie-Hellman key exchange",html:`
<p><strong>One-line idea:</strong> two people who have never met agree on a shared secret key by talking openly, in a way that an eavesdropper cannot work out the key from what they hear.</p>

<h3>6.1 Why we need it</h3>
<p>It solves the <strong>key exchange problem</strong>: how do Alice and Bob get the same symmetric key without already sharing a secret? Variants of DHKE are used in end-to-end encrypted messaging apps like WhatsApp and Signal.</p>

<h3>6.2 The maths you need</h3>
<ul>
<li><strong>Modular arithmetic:</strong> only the remainder after division matters. Examples: 15 mod 12 = 3; 17 mod 5 = 2; 100 mod 7 = 2.</li>
<li><strong>Primitive root:</strong> g is a primitive root modulo p if its powers (g, g<sup>2</sup>, g<sup>3</sup>, …) mod p produce every number from 1 to p − 1. Example, mod 7: powers of 3 are 3, 2, 6, 4, 5, 1 (all six numbers), so 3 is a primitive root of 7. Powers of 2 are 2, 4, 1, 2, 4, 1 (only three numbers), so 2 is not.</li>
</ul>

<h3>6.3 The steps</h3>
${tbl(["","Alice","Public (Eve can see)","Bob"],[
["Agree on","","A prime modulus p and a generator g",""],
["Pick a secret","Chooses private number a","","Chooses private number b"],
["Calculate","A = g<sup>a</sup> mod p","","B = g<sup>b</sup> mod p"],
["Exchange","Sends A","A and B travel in the open","Sends B"],
["Final key","K = B<sup>a</sup> mod p","","K = A<sup>b</sup> mod p"]
])}
<p><strong>Why both get the same key:</strong> Alice's key is (g<sup>b</sup>)<sup>a</sup> = g<sup>ab</sup> and Bob's is (g<sup>a</sup>)<sup>b</sup> = g<sup>ab</sup>. The same number.</p>

<h3>6.4 Worked example (small numbers)</h3>
${pre(`
Public:  p = 23,  g = 5

Alice picks a = 6:    A = 5^6 mod 23  = 8
Bob   picks b = 15:   B = 5^15 mod 23 = 19

Alice computes K = B^a mod p = 19^6 mod 23 = 2
Bob   computes K = A^b mod p = 8^15 mod 23 = 2     <- same key!`)}
<p>Eve knows p = 23, g = 5, A = 8 and B = 19, but not a or b. With huge numbers, working out a from g<sup>a</sup> mod p is practically impossible (the <strong>discrete logarithm problem</strong>). With tiny numbers like these she could just try them all, which is why real values are enormous.</p>
${lab("dh")}
<h4>A colour-mixing picture</h4>
<p>Public: both start with yellow paint. Alice secretly adds red, Bob secretly adds blue; they swap the mixed results in the open. Each then adds their own secret colour to what they received, and both end up with the identical final mix. Eve saw the mixtures but can't un-mix paint to find the secret colours.</p>

<h3>6.5 How it relates to public key encryption (your scenario Q4b)</h3>
<p>Both are built on the same idea of <strong>public values and private numbers</strong>, and both rely on maths that is easy one way and hard to reverse. But they do different jobs: Diffie-Hellman <strong>does not encrypt a message</strong>; it lets two parties <strong>agree a shared secret key</strong>, which is then used for symmetric encryption. Public-key encryption (RSA) encrypts data directly with the receiver's public key.</p>
${note("warn","<strong>The weakness: DH alone is not authenticated.</strong> If Eve can sit in the middle, she can run one DH exchange with Alice and a separate one with Bob, pretending to be each. Alice and Bob each think they have a key with the other, but both are talking to Eve. (This is called a machine-in-the-middle attack.) The fix is to add digital signatures (next part) so each side can prove their public value is really theirs.")}
`},

{tag:"7",title:"Digital signatures",html:`
<p><strong>One-line idea:</strong> a digital signature proves that a document has not been changed and that it really came from the owner of a particular private key.</p>

<h3>7.1 How it works</h3>
<p>From your slides: <strong>the digital signature is the hash of the document, encrypted with the sender's private key.</strong> It is sent along with the original document.</p>
<ol>
<li><strong>Sender (Alice):</strong> hash the document, then encrypt that hash with Alice's <strong>private</strong> key. This is the signature.</li>
<li>Alice sends the document + the signature.</li>
<li><strong>Recipient (Bob):</strong> decrypts the signature using Alice's <strong>public</strong> key, which gives the hash Alice made.</li>
<li>Bob hashes the document he received himself.</li>
<li>If the two hashes <strong>match</strong>, the signature is valid. If not, reject it.</li>
</ol>
${pre(`
Alice:  signature = Encrypt( AlicePrivate , Hash(document) )
        send document + signature

Bob:    h1 = Decrypt( AlicePublic , signature )
        h2 = Hash(document received)
        h1 == h2 ?   YES -> valid     NO -> reject`)}
<p>Why do we sign the hash and not the whole document? The hash is short and fast to process, while public key operations are slow.</p>

<h3>7.2 What happens when an attacker interferes</h3>
<ul>
<li><strong>Eve replaces the document but keeps Alice's signature:</strong> Bob's check <strong>fails</strong>, because the signature matches the hash of Alice's original document, not Eve's replacement.</li>
<li><strong>Eve tries to make her own signature for the new document:</strong> she can't, because she <strong>doesn't have Alice's private key</strong>, and only that key can create Alice's signature.</li>
</ul>

<h3>7.3 What signatures give you</h3>
<p><strong>Integrity</strong> (the document is unchanged) and <strong>authenticity</strong> (it came from the key owner). Because only the owner has the private key, the signer can't easily deny having signed it either.</p>

<h3>7.4 Real-world use: authenticated key exchange</h3>
<p>Back to Diffie-Hellman's weakness. If Alice <strong>signs</strong> her DH public value and Bob already knows Alice's verification (public) key, then Eve can't swap in her own value, because she can't forge Alice's signature. What if Bob doesn't know Alice's public key in advance? That's what <strong>digital certificates</strong> are for, which you'll cover later in the module.</p>

<h3>7.5 Signature standards</h3>
${tbl(["Standard","Status"],[
["RSA with PKCS#1 v1.5 padding","Inadvisable: can be susceptible to a Bleichenbacher attack"],
["RSA-PSS (PKCS#1 v2.1)","Better: encodes the message with PSS first, which adds a random salt and masking"],
["EdDSA (Edwards-curve Digital Signature Algorithm)","Current best. Details are out of scope for this module"]
])}
`},

{tag:"8",title:"End-to-end encryption",html:`
<p>Your article compares two ways for Alice and Bob to message each other through a server. The diagrams below are simple sketches of what it describes, not copies of the article's Figures 1 and 2.</p>

<h3>Approach 1: the server holds the keys</h3>
${pre(`
Alice --[encrypted with Alice's key]--> SERVER --[re-encrypted with Bob's key]--> Bob
                                (decrypts and can READ everything)`)}
<p>The channel is protected from outsiders, but the <strong>server can read all messages</strong>. Problems: people may want privacy even from the service, and if the server is compromised, every conversation is exposed.</p>

<h3>Approach 2: end-to-end encryption</h3>
${pre(`
Alice --[encrypted with a key only Alice and Bob have]--> SERVER --> Bob
                                                     (cannot decrypt)`)}
<p>The server never holds the decryption keys, so it only passes along encrypted data. One way: Alice and Bob agree a symmetric key using Diffie-Hellman, then use it to encrypt messages. Public key cryptography can also be used.</p>
<ul>
<li><strong>Used in:</strong> Signal and WhatsApp, using variants of what you've learned: elliptic-curve and Triple Diffie-Hellman, public key cryptography, and symmetric cryptography together. (Signal publishes its documentation at signal.org/docs if you are curious.)</li>
<li><strong>Controversial:</strong> some governments want access to communications for national security reasons, while privacy advocates argue that weakening E2EE would weaken security for everybody.</li>
</ul>
`},

{tag:"9",title:"Session quiz: answers and reasons",html:`
<p>These are the multiple-choice questions from your Week 2 session slides, by question number and option letter. Try them on the slides first. Where a note is added, it's because two options could seem right, so check against the lecturer's own answers.</p>
${tbl(["Q","Question (short)","Ans.","Why"],[
["1","Image encryption: A shows patterns, B doesn't","D","ECB encrypts identical blocks identically, so patterns (like in an image) show through. CBC chains blocks together so they don't. A = ECB, B = CBC."],
["2","What attack does a MAC help mitigate?","B","A MAC detects tampering with encrypted data. It doesn't stop denial of service, phishing, or by itself machine-in-the-middle."],
["3","Why can't an attacker make a valid MAC for modified ciphertext?","B","They don't know the secret MAC key."],
["4","Why is hash(ciphertext) alone not enough?","C","The attacker can just calculate a new hash for the modified ciphertext. A hash has no secret. (Option A is true in spirit, but C is the direct reason.)"],
["5","Which hash property stops you deriving a PDF from its hash?","A","Pre-image resistance (one-way)."],
["6","Two contracts with the same hash?","C","Collision resistance (any two inputs, none given)."],
["7","Given a document's hash, find another document with the same hash?","B","Second pre-image resistance (one input is given)."],
["8","11100011 split in two and re-ordered: what box?","A","P-box (permutation: it only rearranges bits). An S-box substitutes values using a lookup table."],
["9","Eve replaces Alice's document; what happens when Bob verifies?","B","Verification fails: the signature was made from the hash of Alice's document, not Eve's."],
["10","Why can't Eve generate a valid signature as Alice?","A","She doesn't know Alice's private key."],
["11","Alex sends a message only Max can read: how to encrypt?","D","MaxPub(msg): encrypt with the receiver's public key."],
["12","Only Max can read AND proves Alex sent it","C*","Alex signs with his private key and encrypts with Max's public key. *The textbook form is MaxPub(AlexPriv(msg)): sign, then encrypt. Option B (AlexPriv(MaxPub(msg))) does a similar job in the other order, so check your lecturer's answer. Options A and D don't work: anyone could undo them."]
])}
<p>Also on the slides: the Question 8 box asks about S-box vs P-box (see Week 1, Part G), and the session started with a question about padding (see Week 1, Part F).</p>
`},

{tag:"10",title:"Scenario questions: model answers",html:`
<p>These are written as simple model answers. Your lecturer's solution guide is the official version, and there can be more than one acceptable answer.</p>

<h3>Q1. Alain lost his private key but still has his public key</h3>
<p><strong>(a) Sending encrypted emails: yes.</strong> Encrypting uses the recipient's public key, not his own private key. <strong>Receiving (reading) encrypted emails: no.</strong> Decrypting needs his private key.</p>
<p><strong>(b) Signing: no.</strong> Signing needs his private key. <strong>Verifying other people's signatures: yes.</strong> That uses their public keys.</p>
<p><strong>(c)</strong> He needs a <strong>new key pair</strong>, and to have the new public key published and trusted (and the old one revoked). A lost private key can't be recovered from the public key. He also can't read old emails encrypted to the old key unless he has a backup of it.</p>

<h3>Q2. A group of n people using public key encryption</h3>
<p><strong>(a)</strong> Bob encrypts with <strong>Alice's public key</strong> (so only Alice can read it) and signs with <strong>Bob's own private key</strong> (so Alice can verify it came from Bob using Bob's public key).</p>
<p><strong>(b)</strong> RSA. Each person makes a key pair: pick primes p and q, n = pq, φ = (p − 1)(q − 1), choose e, compute d. Public key (e, n), private key (d, n). To send to someone, encrypt each block with their public key: C = B<sup>e</sup> mod n. They decrypt with their private key: B = C<sup>d</sup> mod n. It's secure because finding d from (e, n) means factoring n, which is infeasible for large primes.</p>
<p><strong>(c)</strong> Hybrid: asymmetric crypto is slow, while symmetric crypto is fast but needs a shared key. Combining them gives speed and safe key sharing. Also, public key crypto needs only n key pairs for the group, rather than a separate secret key for every pair of people.</p>

<h3>Q3</h3>
<p>Your slide says this is a worked example in the solution guide, so it isn't covered here.</p>

<h3>Q4. Miriam wants to share a file only with you</h3>
<p><strong>(a)</strong> A good answer is <strong>asymmetric encryption, e.g. RSA, using your public key</strong>. This works because you two don't already share a secret. She encrypts with your public key; only your private key can decrypt. (In practice, for a big file she'd use the hybrid approach: encrypt the file with a symmetric cipher like AES, and encrypt that AES key with your public key.) A valid alternative is to agree an AES key with Diffie-Hellman and use it. Explain whichever you choose at a high level, as in Part 5 or Part 6.</p>
<p><strong>(b)</strong> See Part 6.5: Diffie-Hellman and public key encryption both use public values and private numbers based on maths that's hard to reverse. But DH only lets two people <strong>agree a shared secret</strong> (which then becomes a symmetric key); it doesn't encrypt the file itself.</p>

<h3>Q5. Design a Feistel algorithm</h3>
<p>This question is open-ended: you invent a design. A good answer states <strong>block size, number of rounds, the key schedule, the round function f, and how decryption works</strong>. Here is a complete tiny example, following the structure on your slide (each round: new L = R, new R = L XOR f(Ki, R)):</p>
${pre(`
Block size:      8 bits, split into L (4 bits) and R (4 bits)
Rounds:          4
Key schedule:    8-bit master key; for each round, rotate the key left
                 by 1 bit and take the left 4 bits as the round key Ki
Round function:  f(Ki, R) = P( S( R XOR Ki ) )
                 S = the 4-bit S-box row from your Week 1 slide:
                     E 4 D 1 2 F B 8 3 A 6 C 5 9 0 7   (hex lookup)
                 P = rotate the 4 bits left by 1 (a tiny P-box)`)}
<p>Worked example: master key = 10110010, plaintext = 01100101. The halves start as L = 0110, R = 0101.</p>
${tbl(["Round","Round key","f(Ki, R)","New L","New R"],[
["1","0110","0010","0101","0100"],
["2","1100","0110","0100","0011"],
["3","1001","1100","0011","1000"],
["4","0010","1100","1000","1111"]
])}
<p><strong>Ciphertext</strong> = L R after round 4 = 10001111.</p>
<p><strong>Decryption:</strong> go through the rounds in <strong>reverse key order</strong>. To undo one round: old R = new L and old L = new R XOR f(Ki, new L). f never needs to be reversed, which is the clever part of a Feistel design. Decrypting 10001111 this way gives back 01100101.</p>
<p>To score well, also say <em>why</em>: the S-box gives <strong>confusion</strong>, the P-box and swapping halves each round give <strong>diffusion</strong>, and more rounds mean more mixing. (This is a teaching toy, far too small to be secure.)</p>
${note("tip","If you can explain Parts 1, 5, 6 and 7 to a friend without notes, you understand the heart of Week 2. RSA and Diffie-Hellman feel scary at first, but with small numbers they're just a few lines of arithmetic. Do the toy examples until they feel boring.")}
`}
],

quiz:[
{q:"Which tool on its own gives you confidentiality?",o:["Encryption","A hash","A MAC","A digital signature"],a:0,why:"Encryption hides the content. Hashes, MACs and signatures are about integrity and authenticity."},
{q:"You run the same pseudo-random generator twice with the same seed. What do you get?",o:["The same sequence both times","Two unrelated sequences","A longer period the second time","True random numbers"],a:0,why:"A PRNG is an algorithm: the seed fully determines the output. That is why seeds must be kept unpredictable."},
{q:"Middle-square method, seed <code>4321</code>. What is the next number?",o:["6710","8671","7104","1867"],a:0,why:"4321² = 18671041, which already has 8 digits. The middle four are 6710."},
{q:"Which of these is NOT one of the four rules of a one-time pad?",o:["The key is derived from a memorable passphrase","The key is truly random","The key is used once and then destroyed","The key is at least as long as the message"],a:0,why:"The key must be truly random. The fourth rule is that only two copies exist."},
{q:"One-time pad with a=1 … z=26. Encrypt <code>dog</code> with the key <code>bcd</code>.",o:["frk","eqj","fqk","grl"],a:0,why:"d(4)+b(2)=6=f. o(15)+c(3)=18=r. g(7)+d(4)=11=k."},
{q:"How long is a SHA-256 digest for a 5 GB file?",o:["256 bits (64 hex characters)","5 GB","It grows with the file size","128 bits"],a:0,why:"A hash function turns any amount of data into a fixed-size value. SHA-256 always gives 256 bits."},
{q:"An attacker has a contract and its hash, and wants a different contract with that same hash. Which property stops this?",o:["Second pre-image resistance","Pre-image resistance","Collision resistance","Determinism"],a:0,why:"One message is given and they must find another that matches it. With nothing given, it would be a collision."},
{q:"An attacker wants to create any two different documents that share a hash. Which property stops this?",o:["Collision resistance","Second pre-image resistance","Pre-image resistance","Confidentiality"],a:0,why:"No input is fixed in advance; any matching pair will do. This is the strong property."},
{q:"Alice sends a ciphertext together with hash(ciphertext). Why does that not stop tampering?",o:["The attacker can change the ciphertext and recompute the hash","Hashes cannot be computed on ciphertext","The hash reveals the plaintext","The hash is longer than the message"],a:0,why:"A hash has no secret in it, so anyone can calculate a fresh one for the modified data."},
{q:"What does a MAC need that a plain hash does not?",o:["A shared secret key","A public and private key pair","An initialisation vector","A longer digest"],a:0,why:"Only someone holding the shared key can create or check a valid tag."},
{q:"Why can't a MAC prove whether Alice or Bob wrote a message?",o:["They both hold the same secret key","MACs are easy to forge","The MAC is not sent with the message","MACs do not depend on the message"],a:0,why:"Either of them could have produced the tag. A digital signature can tell them apart because only one person holds the private key."},
{q:"You want to send Priya a message that only Priya can read. Which key do you encrypt with?",o:["Priya's public key","Priya's private key","Your private key","Your public key"],a:0,why:"Encrypt with the receiver's public key. Only her private key can decrypt it."},
{q:"You want to sign a document so others can check it came from you. Which key do you sign with?",o:["Your private key","Your public key","The reader's public key","The reader's private key"],a:0,why:"Sign with your own private key. Everyone verifies with your public key."},
{q:"RSA with p = 3 and q = 7. What are n and φ(n)?",o:["n = 21, φ(n) = 12","n = 21, φ(n) = 20","n = 10, φ(n) = 12","n = 21, φ(n) = 21"],a:0,why:"n = p × q = 21. φ(n) = (p − 1)(q − 1) = 2 × 6 = 12."},
{q:"RSA with p = 5, q = 11 and e = 3. What is d?",o:["27","13","7","23"],a:0,why:"φ(n) = 40. We need 3 × d = 1 (mod 40): 3 × 27 = 81 = 2 × 40 + 1."},
{q:"RSA public key (e, n) = (7, 55). Encrypt the block B = 3.",o:["42","21","18","37"],a:0,why:"3⁷ = 2187. 55 × 39 = 2145, and 2187 − 2145 = 42."},
{q:"Is 2 a primitive root modulo 7?",o:["No: its powers only give 2, 4 and 1","Yes: its powers give every value from 1 to 6","Yes, because 2 is prime","No, because 2 is smaller than 7"],a:0,why:"A primitive root must reach all of 1 to p − 1. Powers of 3 do (3, 2, 6, 4, 5, 1); powers of 2 repeat after three values."},
{q:"Diffie-Hellman with p = 23, g = 5. Alice picks a = 4. What public value A does she send?",o:["4","20","8","19"],a:0,why:"A = 5⁴ mod 23 = 625 mod 23. 23 × 27 = 621, so the remainder is 4."},
{q:"Diffie-Hellman with p = 7, g = 3, a = 2, b = 4. What is the shared key?",o:["2","4","6","1"],a:0,why:"A = 3² mod 7 = 2 and B = 3⁴ mod 7 = 4. Alice: 4² mod 7 = 2. Bob: 2⁴ mod 7 = 2."},
{q:"What is the weakness of Diffie-Hellman used on its own?",o:["Neither side can check who they are really exchanging with","Eve can calculate the key from A and B","It only works with small primes","It leaks the private numbers a and b"],a:0,why:"DH is not authenticated, so Eve can run separate exchanges with each side. Signing the public values fixes this."},
{q:"According to the slides, a digital signature is…",o:["The hash of the document, encrypted with the sender's private key","The document encrypted with the receiver's public key","A MAC made with a shared key","The sender's public key attached to the document"],a:0,why:"The receiver decrypts it with the sender's public key and compares it with their own hash of the document."},
{q:"Eve swaps Alice's document for her own but keeps Alice's signature. What happens when Bob verifies it?",o:["Verification fails because the hashes do not match","Verification succeeds because the signature is genuine","Bob cannot decrypt the signature","Bob's private key is exposed"],a:0,why:"The signature holds the hash of Alice's original document, which differs from the hash of Eve's replacement."},
{q:"In end-to-end encryption, what can the messaging server do?",o:["Pass along the encrypted messages but not read them","Decrypt, read and re-encrypt each message","Choose the keys for Alice and Bob","Sign messages on Alice's behalf"],a:0,why:"The server never holds the decryption keys. Only the two endpoints can read the messages."},
{q:"Why do real systems use hybrid encryption?",o:["Asymmetric crypto shares a key safely, then fast symmetric crypto encrypts the data","Symmetric crypto is too slow for large files","Asymmetric crypto cannot share keys","It removes the need for any keys"],a:0,why:"Asymmetric is slow but solves key sharing. Symmetric is fast but needs a shared key. HTTPS combines them."},
{q:"A group of 10 people each want a separate symmetric key with every other person. How many keys is that?",o:["45","10","90","20"],a:0,why:"n × (n − 1) / 2 = 10 × 9 / 2 = 45. With public keys, each person would need just one key pair."}
],

practice:[
{q:"Work out: 47 mod 5, 100 mod 7, and 3<sup>4</sup> mod 5.",a:"47 mod 5 = 2 (47 = 9 × 5 + 2). 100 mod 7 = 2 (98 + 2). 3<sup>4</sup> = 81, and 81 mod 5 = 1."},
{q:"Is 3 a primitive root modulo 7? Show the powers.",a:"Yes. Powers of 3 mod 7: 3, 2, 6, 4, 5, 1, which hits all of 1 to 6."},
{q:"One-time pad (a=1 … z=26): encrypt <code>cat</code> with key <code>kdr</code>.",a:"c(3)+k(11)=14=n; a(1)+d(4)=5=e; t(20)+r(18)=38−26=12=l. Ciphertext: nel."},
{q:"Middle-square method: seed 1234. What is the next number? (Pad to 8 digits.)",a:"1234<sup>2</sup> = 1522756, padded 01522756, middle four digits: 5227."},
{q:"RSA: p = 3, q = 11. Find n, φ(n), and d if e = 3. Encrypt B = 4, then decrypt it.",a:"n = 33, φ = 2 × 10 = 20. Need 3d = 1 mod 20: d = 7 (3 × 7 = 21). Encrypt: 4<sup>3</sup> = 64, 64 mod 33 = 31. Decrypt: 31<sup>7</sup> mod 33 = 4."},
{q:"Diffie-Hellman: p = 11, g = 2, Alice's a = 3, Bob's b = 4. Find A, B, and the shared key.",a:"A = 2<sup>3</sup> mod 11 = 8. B = 2<sup>4</sup> mod 11 = 16 mod 11 = 5. Alice: 5<sup>3</sup> mod 11 = 125 mod 11 = 4. Bob: 8<sup>4</sup> mod 11 = 4096 mod 11 = 4. Shared key = 4."},
{q:"Alex wants to (i) encrypt to Max, (ii) sign a document. Which key does each use?",a:"(i) Encrypt with Max's public key. (ii) Sign with Alex's private key."},
{q:"Why is a hash alone not enough to protect a message from an attacker, and what would you add?",a:"Anyone, including an attacker, can recompute a hash after changing the message. Add a secret: use a MAC (shared key) or a digital signature (private key)."},
{q:"Name the three hash properties from your notes besides deterministic, and give a one-line meaning of each.",a:"Pre-image resistant: can't get the input from the hash. Second pre-image resistant: given an input, can't find a different input with the same hash. Collision resistant: can't find any two inputs with the same hash."},
{q:"Why is Diffie-Hellman on its own vulnerable to a machine-in-the-middle attack, and how do digital signatures help?",a:"DH has no way to check who you're talking to, so Eve can run separate exchanges with each side. If each side signs its DH value and the other knows the verification key, Eve can't forge the signature, so she can't substitute her own value."},
{q:"Give two reasons real systems use hybrid encryption.",a:"Asymmetric crypto is slow, symmetric needs a shared key. Hybrid gives speed plus safe key sharing. (Also fewer keys to manage for groups.)"},
{q:"Why is MD5 not used in modern practice, and which hash function is commonly used instead?",a:"MD5 is considered insecure for modern use (it has known weaknesses); SHA-256 is commonly used instead."}
],

glossary:[
["Asymmetric (public key) cryptography","Uses a key pair: public (shared) and private (secret)"],
["Authenticity","It really came from who it claims to"],
["Collision","Two different inputs with the same hash"],
["CSPRNG","A pseudo-random generator that is secure enough for cryptography"],
["Digest (hash value)","The fixed-size output of a hash function"],
["Digital signature","Hash of a document encrypted with the sender's private key; verified with their public key"],
["Diffie-Hellman (DHKE)","Two parties agree a shared secret key over an open channel"],
["E2EE","End-to-end encryption: only the two endpoints can read the messages, not the server"],
["Hybrid encryption","Asymmetric crypto to share a key, then symmetric crypto for the data"],
["MAC","A keyed hash that detects tampering and proves the sender knew the shared key"],
["Modular arithmetic","Arithmetic where only the remainder after division matters"],
["One-time pad","Truly random, as-long-as-the-message, single-use key: perfect secrecy"],
["Primitive root","A number whose powers mod p generate every value from 1 to p − 1"],
["RSA","Public key system using n = pq; encrypt with B^e mod n, decrypt with C^d mod n"],
["SHA-256","Hash function in modern use; always outputs 256 bits"],
["MD5","Older hash function, now considered insecure"],
["Seed","The starting value of a pseudo-random generator; same seed, same sequence"],
["Pre-image resistance","Given a hash, you can't find an input that produced it"],
["Second pre-image resistance","Given a message, you can't find a different one with the same hash"]
],

checklist:[
"Match each tool (encryption, hash, MAC, signature) to the security property it gives",
"Explain true random vs pseudo-random, a seed, a CSPRNG, and the period",
"State the 4 rules of a one-time pad and why it gives perfect secrecy",
"Define pre-image, second pre-image and collision resistance, and tell them apart",
"Explain why a hash alone can't stop an attacker, and how a MAC fixes that",
"Say which key to use to encrypt, decrypt, sign and verify",
"Do RSA key generation, encryption and decryption with small numbers",
"Do a Diffie-Hellman exchange with small numbers, and explain why it's not authenticated",
"Describe how a digital signature is made and checked",
"Explain E2EE vs a server that holds the keys",
"Explain hybrid encryption and why it's used"
]
});
