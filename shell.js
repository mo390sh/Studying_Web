/* Practice shell: a small, DOM-free Unix-like shell that runs in the browser.
   Everything is simulated (virtual files, a pretend network, a pretend firewall). Nothing leaves the page.
   Used by the Hands-on tab. Each week describes its own lab environment in weeks/weekN.js (COURSE.hands). */
(function(root){
'use strict';
var TE=new TextEncoder(),TD=new TextDecoder();
function bytesOf(s){return TE.encode(String(s))}
function hex(u){var s='';for(var i=0;i<u.length;i++)s+=(u[i]<16?'0':'')+u[i].toString(16);return s}
function cat(a,b){var r=new Uint8Array(a.length+b.length);r.set(a);r.set(b,a.length);return r}
function rotl(x,n){return((x<<n)|(x>>>(32-n)))>>>0}

/* ---------- hashes (own implementations, checked against Node's crypto in the tests) ---------- */
var SHA_K=[],SHA_H=[];
(function(){
  function isP(n){for(var i=2;i*i<=n;i++)if(n%i===0)return false;return n>1}
  function fr(x){return Math.floor((x-Math.floor(x))*4294967296)}
  var c=2;while(SHA_K.length<64){if(isP(c)){if(SHA_H.length<8)SHA_H.push(fr(Math.sqrt(c)));SHA_K.push(fr(Math.cbrt(c)))}c++}
})();
function sha256b(src){
  var l=src.length,n=((l+9+63)>>6)<<6,m=new Uint8Array(n);m.set(src);m[l]=0x80;
  var dv=new DataView(m.buffer);dv.setUint32(n-8,Math.floor(l/0x20000000));dv.setUint32(n-4,(l<<3)>>>0);
  var H=SHA_H.slice(),W=new Uint32Array(64);
  function rr(x,s){return(x>>>s)|(x<<(32-s))}
  for(var o=0;o<n;o+=64){
    var t;for(t=0;t<16;t++)W[t]=dv.getUint32(o+t*4);
    for(t=16;t<64;t++){var x=W[t-15],y=W[t-2];W[t]=(W[t-16]+(rr(x,7)^rr(x,18)^(x>>>3))+W[t-7]+(rr(y,17)^rr(y,19)^(y>>>10)))>>>0}
    var a=H[0],b=H[1],c=H[2],d=H[3],e=H[4],f=H[5],g=H[6],h=H[7];
    for(t=0;t<64;t++){
      var t1=(h+(rr(e,6)^rr(e,11)^rr(e,25))+((e&f)^(~e&g))+SHA_K[t]+W[t])>>>0;
      var t2=((rr(a,2)^rr(a,13)^rr(a,22))+((a&b)^(a&c)^(b&c)))>>>0;
      h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;
    }
    H[0]=(H[0]+a)>>>0;H[1]=(H[1]+b)>>>0;H[2]=(H[2]+c)>>>0;H[3]=(H[3]+d)>>>0;H[4]=(H[4]+e)>>>0;H[5]=(H[5]+f)>>>0;H[6]=(H[6]+g)>>>0;H[7]=(H[7]+h)>>>0;
  }
  var out=new Uint8Array(32),ov=new DataView(out.buffer);H.forEach(function(v,i){ov.setUint32(i*4,v)});return out;
}
function sha1b(src){
  var l=src.length,n=((l+9+63)>>6)<<6,m=new Uint8Array(n);m.set(src);m[l]=0x80;
  var dv=new DataView(m.buffer);dv.setUint32(n-8,Math.floor(l/0x20000000));dv.setUint32(n-4,(l<<3)>>>0);
  var h0=0x67452301,h1=0xEFCDAB89,h2=0x98BADCFE,h3=0x10325476,h4=0xC3D2E1F0,w=new Uint32Array(80);
  for(var o=0;o<n;o+=64){
    var t;for(t=0;t<16;t++)w[t]=dv.getUint32(o+t*4);
    for(t=16;t<80;t++)w[t]=rotl(w[t-3]^w[t-8]^w[t-14]^w[t-16],1);
    var a=h0,b=h1,c=h2,d=h3,e=h4;
    for(t=0;t<80;t++){
      var f,k;
      if(t<20){f=(b&c)|(~b&d);k=0x5A827999}else if(t<40){f=b^c^d;k=0x6ED9EBA1}else if(t<60){f=(b&c)|(b&d)|(c&d);k=0x8F1BBCDC}else{f=b^c^d;k=0xCA62C1D6}
      var tmp=(rotl(a,5)+(f>>>0)+e+k+w[t])>>>0;e=d;d=c;c=rotl(b,30);b=a;a=tmp;
    }
    h0=(h0+a)>>>0;h1=(h1+b)>>>0;h2=(h2+c)>>>0;h3=(h3+d)>>>0;h4=(h4+e)>>>0;
  }
  var out=new Uint8Array(20),ov=new DataView(out.buffer);[h0,h1,h2,h3,h4].forEach(function(v,i){ov.setUint32(i*4,v)});return out;
}
function md5b(src){
  var S=[7,12,17,22,5,9,14,20,4,11,16,23,6,10,15,21],K=[];
  for(var i=0;i<64;i++)K[i]=Math.floor(Math.abs(Math.sin(i+1))*4294967296)>>>0;
  var l=src.length,n=((l+9+63)>>6)<<6,m=new Uint8Array(n);m.set(src);m[l]=0x80;
  var dv=new DataView(m.buffer);dv.setUint32(n-8,(l<<3)>>>0,true);dv.setUint32(n-4,Math.floor(l/0x20000000),true);
  var a0=0x67452301,b0=0xefcdab89,c0=0x98badcfe,d0=0x10325476;
  for(var o=0;o<n;o+=64){
    var M=[];for(i=0;i<16;i++)M[i]=dv.getUint32(o+i*4,true);
    var A=a0,B=b0,C=c0,D=d0;
    for(i=0;i<64;i++){
      var F,g;
      if(i<16){F=(B&C)|(~B&D);g=i}else if(i<32){F=(D&B)|(~D&C);g=(5*i+1)%16}else if(i<48){F=B^C^D;g=(3*i+5)%16}else{F=C^(B|~D);g=(7*i)%16}
      F=(F+A+K[i]+M[g])>>>0;A=D;D=C;C=B;B=(B+rotl(F,S[(i>>4)*4+(i%4)]))>>>0;
    }
    a0=(a0+A)>>>0;b0=(b0+B)>>>0;c0=(c0+C)>>>0;d0=(d0+D)>>>0;
  }
  var out=new Uint8Array(16),ov=new DataView(out.buffer);[a0,b0,c0,d0].forEach(function(v,i){ov.setUint32(i*4,v,true)});return out;
}
function hmac(hf,key,msg){
  var B=64,k=key.length>B?hf(key):key,kp=new Uint8Array(B);kp.set(k);
  var ip=new Uint8Array(B),op=new Uint8Array(B);for(var i=0;i<B;i++){ip[i]=kp[i]^0x36;op[i]=kp[i]^0x5c}
  return hf(cat(op,hf(cat(ip,msg))));
}
var HASHES={md5:md5b,sha1:sha1b,sha256:sha256b};

/* ---------- base64 ---------- */
var B64='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function b64enc(u){
  var s='';for(var i=0;i<u.length;i+=3){
    var a=u[i],b=u[i+1],c=u[i+2],n=(a<<16)|((b||0)<<8)|(c||0);
    s+=B64[n>>18&63]+B64[n>>12&63]+(i+1<u.length?B64[n>>6&63]:'=')+(i+2<u.length?B64[n&63]:'=');
  }return s;
}
function b64dec(s){
  s=s.replace(/[\s=]/g,'');if(/[^A-Za-z0-9+\/]/.test(s))return null;
  var out=[],acc=0,bits=0;
  for(var i=0;i<s.length;i++){acc=(acc<<6)|B64.indexOf(s[i]);bits+=6;if(bits>=8){bits-=8;out.push((acc>>bits)&255)}}
  return new Uint8Array(out);
}

/* ---------- integer arithmetic for $(( )) and bc (BigInt) ---------- */
function evalArith(src,mode,vars,ibase){
  mode=mode||'sh';vars=vars||{};ibase=ibase||10;
  var toks=[],re=/\s*(\*\*|<<|>>|<=|>=|==|!=|&&|\|\||[0-9A-Za-z_]+|[-+*\/%^&|~!()<>])/y,pos=0,m;
  src=String(src);
  while(pos<src.length){
    re.lastIndex=pos;m=re.exec(src);
    if(!m){if(/^\s*$/.test(src.slice(pos)))break;throw new Error('syntax error')}
    toks.push(m[1]);pos=re.lastIndex;
  }
  var p=0;
  var LV=mode==='bc'?[['||'],['&&'],['==','!=','<','<=','>','>='],['+','-'],['*','/','%']]
    :[['||'],['&&'],['|'],['^'],['&'],['==','!='],['<','<=','>','>='],['<<','>>'],['+','-'],['*','/','%']];
  function num(t){
    if(mode==='sh'){
      if(/^0[xX][0-9a-fA-F]+$/.test(t))return BigInt(t);
      if(/^\d+$/.test(t))return BigInt(t);
      var v=vars[t];return v===undefined||v===''?0n:BigInt(String(v).trim()||0);
    }
    if(/^[0-9A-F]+$/.test(t)){
      var r=0n,B=BigInt(ibase);
      for(var i=0;i<t.length;i++){var dgt=parseInt(t[i],16);if(dgt>=ibase)dgt=ibase-1;r=r*B+BigInt(dgt)}
      return r;
    }
    var vv=vars[t];return vv===undefined?0n:BigInt(vv);
  }
  function pow(a,b){if(b<0n)throw new Error('negative exponent');var r=1n;while(b>0n){if(b&1n)r*=a;a*=a;b>>=1n}return r}
  function prim(){
    var t=toks[p++];
    if(t===undefined)throw new Error('syntax error');
    if(t==='('){var v=expr(0);if(toks[p++]!==')')throw new Error('syntax error');return v}
    if(t==='-')return -powr();
    if(t==='+')return powr();
    if(t==='!')return powr()===0n?1n:0n;
    if(t==='~'&&mode==='sh')return ~powr();
    if(/^[0-9A-Za-z_]+$/.test(t))return num(t);
    throw new Error('syntax error');
  }
  function powr(){
    var a=prim(),op=toks[p];
    if((mode==='sh'&&op==='**')||(mode==='bc'&&op==='^')){p++;return pow(a,powr())}
    return a;
  }
  function expr(l){
    if(l>=LV.length)return powr();
    var a=expr(l+1);
    while(p<toks.length&&LV[l].indexOf(toks[p])>=0){
      var op=toks[p++],b=expr(l+1);
      switch(op){
        case '||':a=(a!==0n||b!==0n)?1n:0n;break;case '&&':a=(a!==0n&&b!==0n)?1n:0n;break;
        case '|':a=a|b;break;case '^':a=a^b;break;case '&':a=a&b;break;
        case '==':a=a===b?1n:0n;break;case '!=':a=a!==b?1n:0n;break;
        case '<':a=a<b?1n:0n;break;case '<=':a=a<=b?1n:0n;break;case '>':a=a>b?1n:0n;break;case '>=':a=a>=b?1n:0n;break;
        case '<<':a=a<<b;break;case '>>':a=a>>b;break;
        case '+':a=a+b;break;case '-':a=a-b;break;case '*':a=a*b;break;
        case '/':if(b===0n)throw new Error('division by 0');a=a/b;break;
        case '%':if(b===0n)throw new Error('division by 0');a=a%b;break;
      }
    }
    return a;
  }
  if(!toks.length)throw new Error('empty expression');
  var res=expr(0);
  if(p<toks.length)throw new Error('syntax error');
  return mode==='sh'?BigInt.asIntN(64,res):res;
}

/* ---------- small helpers ---------- */
function lines(s){if(s==null||s==='')return[];var a=String(s).split('\n');if(a[a.length-1]==='')a.pop();return a}
function joinLines(a){return a.length?a.join('\n')+'\n':''}
function pad(s,n,left){s=String(s);while(s.length<n)s=left?' '+s:s+' ';return s}
function ip2n(ip){var p=String(ip).split('.');if(p.length!==4)return null;var n=0;for(var i=0;i<4;i++){var v=+p[i];if(!(v>=0&&v<=255)||p[i]==='')return null;n=n*256+v}return n}
function n2ip(n){return[n/16777216|0,(n>>16)&255,(n>>8)&255,n&255].join('.')}
function inCidr(ip,cidr){
  if(!cidr||cidr==='0.0.0.0/0'||cidr==='anywhere')return true;
  var a=cidr.split('/'),base=ip2n(a[0]),x=ip2n(ip);if(base==null||x==null)return false;
  var bits=a.length>1?+a[1]:32;if(bits===0)return true;
  var mask=bits>=32?0xFFFFFFFF:(0xFFFFFFFF<<(32-bits))>>>0;
  return((base&mask)>>>0)===((x&mask)>>>0);
}
var PORT_NAMES={21:'ftp',22:'ssh',23:'telnet',25:'smtp',53:'domain',80:'http',110:'pop3',143:'imap',443:'https',445:'microsoft-ds',3306:'mysql',3389:'ms-wbt-server',5432:'postgresql',8080:'http-proxy',9100:'jetdirect'};
var CLASSES={'[:upper:]':'A-Z','[:lower:]':'a-z','[:digit:]':'0-9','[:alpha:]':'A-Za-z','[:alnum:]':'A-Za-z0-9','[:space:]':' \\t\\n','[:punct:]':'!-\\/:-@\\[-`{-~'};

/* ---------- the shell ---------- */
function create(env){
  env=env||{};
  var HOME=env.home||'/home/student',USER=env.user||'student',HOST=env.hostname||'lab';
  var st;

  function resetState(){
    st={fs:Object.create(null),cwd:env.cwd||HOME,vars:Object.assign({},env.vars||{}),hist:[],status:0,root:false,
        rules:{policy:'ACCEPT',list:[]},krb:{tgt:null,tickets:[],principal:null},src:null,disp:[],used:[]};
    var spec=env.fs||{};
    st.fs['/']={t:'d',m:'755',o:'root',g:'root',time:env.time||'Mar 14 09:30'};
    Object.keys(spec).forEach(function(k){
      var v=spec[k],isDir=/\/$/.test(k)&&k.length>1,path=normalise(k.replace(/\/$/,'')||'/');
      var node=(typeof v==='string')?{c:v}:Object.assign({},v);
      var home=path.indexOf(HOME)===0;
      node.t=isDir?'d':'f';node.c=node.c||'';
      node.m=node.m||(isDir?'755':'644');node.o=node.o||(home?USER:'root');node.g=node.g||(home?'staff':'root');node.time=node.time||env.time||'Mar 14 09:30';
      mkparents(path,home);
      st.fs[path]=node;
    });
    mkparents(HOME+'/x',true);
    if(env.rules){st.rules=JSON.parse(JSON.stringify(env.rules))}
  }
  function mkparents(path,home){
    var parts=path.split('/').filter(Boolean),cur='';
    for(var i=0;i<parts.length-1;i++){
      cur+='/'+parts[i];
      if(!st.fs[cur]){var h=cur.indexOf(HOME)===0;st.fs[cur]={t:'d',m:'755',o:h?USER:'root',g:h?'staff':'root',time:env.time||'Mar 14 09:30',c:''}}
    }
  }
  function normalise(p,base){
    base=base||st&&st.cwd||'/';
    if(p===''||p==null)return base;
    if(p==='~'||p.indexOf('~/')===0)p=HOME+p.slice(1);
    if(p[0]!=='/')p=base+'/'+p;
    var out=[];p.split('/').forEach(function(s){if(!s||s==='.')return;if(s==='..')out.pop();else out.push(s)});
    return '/'+out.join('/');
  }
  function node(p){return st.fs[p]||null}
  function children(dir){
    var pre=dir==='/'?'/':dir+'/',out=[];
    Object.keys(st.fs).forEach(function(k){if(k!==dir&&k.indexOf(pre)===0&&k.slice(pre.length).indexOf('/')<0)out.push(k.slice(pre.length))});
    return out.sort(cmpName);
  }
  function cmpName(a,b){var x=a.toLowerCase().replace(/^\./,''),y=b.toLowerCase().replace(/^\./,'');return x<y?-1:x>y?1:(a<b?-1:a>b?1:0)}
  function groupsOf(u){return u==='root'?['root']:[u,'staff']}
  function can(n,op){
    if(st.root)return op==='x'?(parseInt(n.m,8)&0o111)>0||n.t==='d':true;
    var m=parseInt(n.m,8),sh=(n.o===USER)?6:(groupsOf(USER).indexOf(n.g)>=0?3:0);
    var bit={r:4,w:2,x:1}[op];return((m>>sh)&bit)>0;
  }
  function modeStr(n){
    var m=parseInt(n.m,8),s=n.t==='d'?'d':'-';
    for(var sh=6;sh>=0;sh-=3){s+=(m>>sh&4?'r':'-')+(m>>sh&2?'w':'-')+(m>>sh&1?'x':'-')}
    return s;
  }
  function size(n){return n.t==='d'?4096:bytesOf(n.c).length}
  function R(o,e,c){return{o:o||'',e:e||'',c:c==null?(e?1:0):c}}
  function readNode(p,cmd){
    var path=normalise(p),n=node(path);
    if(!n)return{err:cmd+': '+p+': No such file or directory'};
    if(n.t==='d')return{err:cmd+': '+p+': Is a directory'};
    if(!can(n,'r'))return{err:cmd+': '+p+': Permission denied'};
    return{n:n,path:path};
  }
  function writeFile(p,content,append){
    var path=normalise(p),n=node(path),par=node(normalise(path.replace(/\/[^\/]*$/,'')||'/'));
    if(path==='/dev/null')return null;
    if(!par||par.t!=='d')return 'No such file or directory';
    if(n){if(n.t==='d')return 'Is a directory';if(!can(n,'w'))return 'Permission denied';n.c=append?n.c+content:content;return null}
    if(!can(par,'w'))return 'Permission denied';
    st.fs[path]={t:'f',c:content,m:'644',o:USER,g:'staff',time:env.date_short||'Mar 15 10:00'};
    return null;
  }
  function inputOf(args,inp,cmd){ // concatenated text of files or stdin; returns {text, err}
    if(!args.length)return{text:inp==null?'':inp,err:''};
    var text='',err='';
    args.forEach(function(a){
      if(a==='-'){text+=inp||'';return}
      var r=readNode(a,cmd);if(r.err){err+=r.err+'\n';return}text+=r.n.c;
    });
    return{text:text,err:err};
  }
  function flagParse(args,withArg){
    var f={},rest=[],i=0;withArg=withArg||'';
    for(;i<args.length;i++){
      var a=args[i];
      if(a==='--'){rest=rest.concat(args.slice(i+1));break}
      if(a.length>1&&a[0]==='-'&&!/^-\d+$/.test(a)&&a[1]!=='-'){
        for(var j=1;j<a.length;j++){
          var ch=a[j];
          if(withArg.indexOf(ch)>=0){var v=a.slice(j+1);if(!v){v=args[++i]}f[ch]=v;break}
          f[ch]=true;
        }
      }else if(a.slice(0,2)==='--'){f[a.slice(2)]=true}
      else rest.push(a);
    }
    return{f:f,rest:rest};
  }
  function bre(p){ // basic regular expression -> JS source
    var out='',i=0;
    p=p.replace(/\[:(upper|lower|digit|alpha|alnum|space|punct):\]/g,function(m){return CLASSES[m]});
    while(i<p.length){
      var c=p[i];
      if(c==='\\'&&i+1<p.length){var d=p[i+1];if('|+?(){}'.indexOf(d)>=0)out+=d;else if(d==='<'||d==='>')out+='\\b';else out+='\\'+d;i+=2;continue}
      if('|+?(){}'.indexOf(c)>=0){out+='\\'+c;i++;continue}
      out+=c;i++;
    }
    return out;
  }
  function eregex(p){return p.replace(/\[:(upper|lower|digit|alpha|alnum|space|punct):\]/g,function(m){return CLASSES[m]}).replace(/\\<|\\>/g,'\\b')}
  function mkRe(pat,f){
    var src=f.F?pat.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'):(f.E||f.P?eregex(pat):bre(pat));
    if(f.w)src='\\b(?:'+src+')\\b';
    try{return new RegExp(src,f.i?'i':'')}catch(e){return null}
  }
  function expandRange(set){
    set=set.replace(/\[:(upper|lower|digit|alpha|alnum|space):\]/g,function(m){return{'[:upper:]':'A-Z','[:lower:]':'a-z','[:digit:]':'0-9','[:alpha:]':'A-Za-z','[:alnum:]':'A-Za-z0-9','[:space:]':' \t\n'}[m]});
    set=set.replace(/\\n/g,'\n').replace(/\\t/g,'\t').replace(/\\\\/g,'\\');
    var out=[];
    for(var i=0;i<set.length;i++){
      if(set[i+1]==='-'&&i+2<set.length){var a=set.charCodeAt(i),b=set.charCodeAt(i+2);for(var c=a;c<=b;c++)out.push(String.fromCharCode(c));i+=2}
      else out.push(set[i]);
    }
    return out;
  }
  function escapes(s,x){ // backslash escapes for echo -e / printf
    return s.replace(/\\(x[0-9a-fA-F]{1,2}|[0-7]{1,3}|[ntr\\e0abfv"])/g,function(m,g){
      if(g[0]==='x')return String.fromCharCode(parseInt(g.slice(1),16));
      if(/^[0-7]/.test(g))return String.fromCharCode(parseInt(g,8));
      return{n:'\n',t:'\t',r:'\r','\\':'\\',e:'\x1b',a:'\x07',b:'\b',f:'\f',v:'\v','"':'"'}[g]||m;
    });
  }

  /* ----- commands ----- */
  var C={},HELP={};
  function def(name,usage,fn){C[name]=fn;HELP[name]=usage}

  def('help','help [command]  list commands, or show how to use one',function(a){
    if(a[0]){var h=HELP[a[0]];return h?R(h+'\n'):R('','help: no help for '+a[0],1)}
    var names=Object.keys(HELP).sort(),o='Practice shell. Commands you can use (type help NAME for usage):\n\n',row='';
    names.forEach(function(n){if(row.length+n.length+2>76){o+=row+'\n';row=''}row+=n+'  '});
    o+=row+'\n\nPipes (|), redirects (> >>), $(...), $((...)), variables, for loops and the up-arrow history all work.\n';
    return R(o);
  });
  def('pwd','pwd  print the current directory',function(){return R(st.cwd+'\n')});
  def('whoami','whoami  print your user name',function(){return R((st.root?'root':USER)+'\n')});
  def('id','id  print user and group ids',function(){return R(st.root?'uid=0(root) gid=0(root) groups=0(root)\n':'uid=1000('+USER+') gid=1000('+USER+') groups=1000('+USER+'),50(staff)\n')});
  def('hostname','hostname  print the machine name',function(){return R(HOST+'\n')});
  def('uname','uname [-a]  system information',function(a){return R(a[0]==='-a'?'Linux '+HOST+' 5.15.0-lab #1 SMP x86_64 GNU/Linux\n':'Linux\n')});
  def('date','date  the lab clock (it never moves, so every run is repeatable)',function(){return R((env.date||'Sat Mar 15 10:00:00 UTC 2025')+'\n')});
  def('clear','clear  clear the screen',function(){return R('','',0)});
  def('true','true  do nothing, successfully',function(){return R()});
  def('false','false  do nothing, unsuccessfully',function(){return R('','',1)});
  def('history','history  list the commands you typed',function(){return R(st.hist.map(function(h,i){return pad(i+1,5,true)+'  '+h}).join('\n')+(st.hist.length?'\n':''))});
  def('cd','cd [dir]  change directory',function(a){
    var p=normalise(a[0]||'~'),n=node(p);
    if(!n)return R('','bash: cd: '+(a[0]||'')+': No such file or directory',1);
    if(n.t!=='d')return R('','bash: cd: '+a[0]+': Not a directory',1);
    if(!can(n,'x'))return R('','bash: cd: '+a[0]+': Permission denied',1);
    st.cwd=p;return R();
  });
  def('ls','ls [-l] [-a] [path...]  list files; -l shows permissions, owner and size',function(a){
    var P=flagParse(a),f=P.f,targets=P.rest.length?P.rest:['.'],out='',err='';
    function entry(n,name){
      if(!f.l)return name;
      return[modeStr(n),n.t==='d'?'2':'1',n.o,n.g,String(size(n)),n.time,name];
    }
    function fmt(rows){
      if(!f.l)return rows.length?rows.join('  ')+'\n':'';
      var w=[0,1,2,3,4].map(function(i){return Math.max.apply(null,rows.map(function(r){return r[i].length}))});
      return rows.map(function(r){return r[0]+' '+pad(r[1],w[1],true)+' '+pad(r[2],w[2])+' '+pad(r[3],w[3])+' '+pad(r[4],w[4],true)+' '+r[5]+' '+r[6]}).join('\n')+'\n';
    }
    targets.forEach(function(t,ti){
      var path=normalise(t),n=node(path);
      if(!n){err+='ls: cannot access \''+t+'\': No such file or directory\n';return}
      if(n.t!=='d'||f.d){out+=fmt([entry(n,t)]);return}
      if(!can(n,'r')){err+='ls: cannot open directory \''+t+'\': Permission denied\n';return}
      if(targets.length>1)out+=(ti?'\n':'')+t+':\n';
      var names=children(path).filter(function(x){return f.a||x[0]!=='.'});
      var rows=names.map(function(nm){return entry(node((path==='/'?'':path)+'/'+nm),nm)});
      if(f.a&&f.l){rows.unshift(entry(node(path),'.'),entry(node(normalise('..',path))||n,'..'))}
      else if(f.a){rows.unshift('.','..')}
      if(f.l){var blocks=0;names.forEach(function(nm){blocks+=Math.ceil(size(node((path==='/'?'':path)+'/'+nm))/4096)*4});out+='total '+blocks+'\n'}
      out+=fmt(rows);
    });
    return R(out,err.replace(/\n$/,''),err?2:0);
  });
  def('cat','cat [-n] [file...]  show files (or what is piped in)',function(a,inp){
    var P=flagParse(a),r=inputOf(P.rest,inp,'cat'),o=r.text;
    if(P.f.n){var i=0;o=lines(o).map(function(l){return pad(++i,6,true)+'\t'+l}).join('\n')+'\n'}
    return R(o,r.err.replace(/\n$/,''));
  });
  def('head','head [-n N] [file]  first N lines (default 10)',function(a,inp){
    var P=flagParse(a,'n'),n=10,rest=P.rest;
    if(P.f.n!==undefined&&P.f.n!==true)n=parseInt(P.f.n,10);
    else rest=rest.filter(function(x){if(/^-\d+$/.test(x)){n=-parseInt(x,10);return false}return true});
    var r=inputOf(rest,inp,'head');return R(joinLines(lines(r.text).slice(0,n)),r.err.replace(/\n$/,''));
  });
  def('tail','tail [-n N | -n +N] [file]  last N lines (default 10), or everything from line N with +N',function(a,inp){
    var P=flagParse(a,'n'),n=10,from=null,rest=P.rest;
    if(P.f.n!==undefined&&P.f.n!==true){if(/^\+\d+$/.test(P.f.n))from=parseInt(P.f.n,10);else n=parseInt(P.f.n,10)}
    else rest=rest.filter(function(x){if(/^-\d+$/.test(x)){n=-parseInt(x,10);return false}return true});
    var r=inputOf(rest,inp,'tail'),L=lines(r.text);
    return R(joinLines(from!==null?L.slice(Math.max(0,from-1)):L.slice(Math.max(0,L.length-n))),r.err.replace(/\n$/,''));
  });
  def('wc','wc [-l] [-w] [-c] [file]  count lines, words, bytes',function(a,inp){
    var P=flagParse(a),r=inputOf(P.rest,inp,'wc'),t=r.text,f=P.f;
    var l=(t.match(/\n/g)||[]).length,w=(t.trim()?t.trim().split(/\s+/).length:0),c=bytesOf(t).length,parts=[];
    if(f.l)parts.push(l);if(f.w)parts.push(w);if(f.c||f.m)parts.push(c);
    if(!parts.length)parts=[l,w,c];
    var o=parts.length===1?String(parts[0]):parts.map(function(x){return pad(x,7,true)}).join(' ').replace(/^ /,'');
    if(P.rest.length===1)o+=' '+P.rest[0];
    return R(o+'\n',r.err.replace(/\n$/,''));
  });
  def('echo','echo [-n] [-e] text  print text',function(a){
    var nl=true,esc=false;
    while(a.length&&/^-[neE]+$/.test(a[0])){if(a[0].indexOf('n')>=0)nl=false;if(a[0].indexOf('e')>=0)esc=true;a=a.slice(1)}
    var s=a.join(' ');if(esc)s=escapes(s);return R(s+(nl?'\n':''));
  });
  def('printf','printf FORMAT [args...]  formatted output (%s %d %x %X %o %c, \\n, \\xHH)',function(a){
    if(!a.length)return R('','printf: usage: printf format [arguments]',2);
    var fmt=a[0],args=a.slice(1),out='',ai=0,used;
    function num(x){
      if(x==null)return 0n;x=String(x);
      if(x[0]==="'"||x[0]==='"')return BigInt(x.charCodeAt(1)||0);
      var neg=x[0]==='-',y=neg?x.slice(1):x;
      try{var v=BigInt(y);return neg?-v:v}catch(e){return 0n}
    }
    do{
      used=false;
      out+=escapes(fmt).replace(/%([-0 ]*)(\d*)([sdixXocu%])/g,function(m,fl,w,t){
        if(t==='%')return '%';
        used=true;var v=args[ai++],s;
        if(t==='s')s=v==null?'':v;
        else if(t==='c')s=v==null?'':String(v)[0];
        else{var n=num(v);
          if(t==='d'||t==='i')s=n.toString();
          else if(t==='u')s=BigInt.asUintN(64,n).toString();
          else if(t==='x')s=BigInt.asUintN(64,n).toString(16);
          else if(t==='X')s=BigInt.asUintN(64,n).toString(16).toUpperCase();
          else s=BigInt.asUintN(64,n).toString(8);}
        var W=+w||0;
        if(s.length<W){if(fl.indexOf('-')>=0)s=pad(s,W);else if(fl.indexOf('0')>=0&&t!=='s')s=s.padStart(W,'0');else s=pad(s,W,true)}
        return s;
      });
    }while(used&&ai<args.length);
    return R(out);
  });
  def('seq','seq [first] last  print numbers',function(a){
    var f=1,l;if(a.length===1)l=+a[0];else{f=+a[0];l=+a[1]}
    if(!(l>=f)&&!(a.length===1&&l<1))return R();
    var o=[];for(var i=f;i<=l&&o.length<10000;i++)o.push(i);return R(joinLines(o));
  });
  def('grep','grep [-i -v -c -n -o -l -r -w -E -F -A/-B/-C N] pattern [file...]  search for lines that match',function(a,inp){
    var P=flagParse(a,'eABC'),f=P.f,rest=P.rest,pat;
    var cA=f.C!==undefined?parseInt(f.C,10)||0:parseInt(f.A,10)||0,cB=f.C!==undefined?parseInt(f.C,10)||0:parseInt(f.B,10)||0,ctx=(cA>0||cB>0)&&!f.c&&!f.l&&!f.q&&!f.o;
    if(f.e!==undefined&&f.e!==true)pat=f.e;else pat=rest.shift();
    if(pat==null)return R('','Usage: grep [OPTION]... PATTERNS [FILE]...',2);
    var re=mkRe(pat,f);if(!re)return R('','grep: Invalid regular expression',2);
    var files=rest,multi=files.length>1||f.r,out='',err='',any=false;
    function scan(name,text){
      var n=0,i=0,res='',L=lines(text),hits=[];
      L.forEach(function(l){
        i++;var hit=re.test(l);if(f.v)hit=!hit;if(!hit)return;n++;any=true;hits.push(i);
        if(f.c||f.l||f.q||ctx)return;
        var pre=(multi?name+':':'')+(f.n?i+':':'');
        if(f.o&&!f.v){var g=new RegExp(re.source,re.flags+'g'),mm;while((mm=g.exec(l))){if(mm[0]==='')g.lastIndex++;else res+=pre+mm[0]+'\n'}}
        else res+=pre+l+'\n';
      });
      if(ctx&&hits.length){
        var show={};hits.forEach(function(h){for(var k=Math.max(1,h-cB);k<=Math.min(L.length,h+cA);k++)show[k]=(k===h||show[k]===':')?':':'-'});
        var hs={};hits.forEach(function(h){hs[h]=1});
        var last=0;
        for(var k=1;k<=L.length;k++){if(!show[k])continue;
          if(last&&k>last+1)res+='--\n';
          var sep=hs[k]?':':'-';res+=(multi?name+sep:'')+(f.n?k+sep:'')+L[k-1]+'\n';last=k}
      }
      if(f.c)out+=(multi?name+':':'')+n+'\n';
      else if(f.l){if(n)out+=name+'\n'}
      else out+=res;
    }
    if(!files.length){if(f.r)files=['.'];else{scan('(standard input)',inp==null?'':inp);return R(f.q?'':out,'',any?0:1)}}
    function walk(p,disp){
      var path=normalise(p),n=node(path);
      if(!n){err+='grep: '+p+': No such file or directory\n';return}
      if(n.t==='d'){if(!f.r){err+='grep: '+p+': Is a directory\n';return}children(path).forEach(function(c){walk(path+'/'+c,(disp==='.'?'':disp+'/')+c)});return}
      if(!can(n,'r')){err+='grep: '+p+': Permission denied\n';return}
      scan(disp,n.c);
    }
    files.forEach(function(p){walk(p,p)});
    return R(f.q?'':out,err.replace(/\n$/,''),any?0:(err?2:1));
  });
  def('sort','sort [-r -n -u] [-t SEP -k N] [file]  sort lines',function(a,inp){
    var P=flagParse(a,'tk'),f=P.f,r=inputOf(P.rest,inp,'sort'),L=lines(r.text);
    var kn=f.k&&f.k!==true?parseInt(f.k,10):0,sep=f.t&&f.t!==true?f.t:null;
    function key(l){if(!kn)return l;var p=sep?l.split(sep):l.trim().split(/\s+/);return p[kn-1]||''}
    L.sort(function(x,y){
      var A=key(x),B=key(y),c;
      if(f.n){c=(parseFloat(A)||0)-(parseFloat(B)||0)}else c=A<B?-1:A>B?1:0;
      if(c===0)c=x<y?-1:x>y?1:0;
      return f.r?-c:c;
    });
    if(f.u){L=L.filter(function(x,i){return i===0||key(x)!==key(L[i-1])})}
    return R(joinLines(L),r.err.replace(/\n$/,''));
  });
  def('uniq','uniq [-c] [-d] [-u] [file]  collapse repeated neighbouring lines (sort first)',function(a,inp){
    var P=flagParse(a),f=P.f,r=inputOf(P.rest,inp,'uniq'),L=lines(r.text),g=[];
    L.forEach(function(l){if(g.length&&g[g.length-1][0]===l)g[g.length-1][1]++;else g.push([l,1])});
    if(f.d)g=g.filter(function(x){return x[1]>1});
    if(f.u)g=g.filter(function(x){return x[1]===1});
    return R(g.map(function(x){return f.c?pad(x[1],7,true)+' '+x[0]:x[0]}).join('\n')+(g.length?'\n':''),r.err.replace(/\n$/,''));
  });
  def('cut','cut -d SEP -f N[,M] | -c N[-M]  take columns',function(a,inp){
    var P=flagParse(a,'dfc'),f=P.f,r=inputOf(P.rest,inp,'cut');
    function ranges(spec){return String(spec).split(',').map(function(s){var m=/^(\d*)-(\d*)$/.exec(s);if(m)return[+m[1]||1,+m[2]||1e9];return[+s,+s]})}
    var out;
    if(f.c!==undefined&&f.c!==true){var rg=ranges(f.c);out=lines(r.text).map(function(l){var s='';for(var i=0;i<l.length;i++)if(rg.some(function(x){return i+1>=x[0]&&i+1<=x[1]}))s+=l[i];return s})}
    else if(f.f!==undefined&&f.f!==true){
      var d=f.d&&f.d!==true?f.d:'\t',rg2=ranges(f.f);
      out=lines(r.text).map(function(l){if(l.indexOf(d)<0)return l;return l.split(d).filter(function(_,i){return rg2.some(function(x){return i+1>=x[0]&&i+1<=x[1]})}).join(d)});
    }else return R('','cut: you must specify a list of bytes, characters, or fields',1);
    return R(joinLines(out),r.err.replace(/\n$/,''));
  });
  def('tr','tr [-d] [-s] SET1 [SET2]  translate or delete characters (reads from a pipe)',function(a,inp){
    var P=flagParse(a),f=P.f,s1=expandRange(P.rest[0]||''),s2=expandRange(P.rest[1]||''),t=inp==null?'':inp,o='',last='';
    if(!P.rest.length)return R('','tr: missing operand',1);
    for(var i=0;i<t.length;i++){
      var ch=t[i],k=s1.indexOf(ch),outc=ch;
      if(f.d){if(k>=0)continue}
      else if(k>=0&&s2.length)outc=s2[Math.min(k,s2.length-1)];
      if(f.s&&k>=0&&outc===last)continue;
      o+=outc;last=outc;
    }
    return R(o);
  });
  def('rev','rev  reverse each line (reads from a pipe or a file)',function(a,inp){var r=inputOf(a,inp,'rev');return R(joinLines(lines(r.text).map(function(l){return l.split('').reverse().join('')})),r.err.replace(/\n$/,''))});
  def('fold','fold -w N [file]  wrap lines at N characters',function(a,inp){
    var P=flagParse(a,'w'),w=P.f.w&&P.f.w!==true?parseInt(P.f.w,10):80,r=inputOf(P.rest,inp,'fold'),o=[];
    lines(r.text).forEach(function(l){if(!l)o.push('');for(var i=0;i<l.length;i+=w)o.push(l.slice(i,i+w))});
    return R(joinLines(o),r.err.replace(/\n$/,''));
  });
  def('paste','paste -s -d SEP  join all lines into one',function(a,inp){
    var P=flagParse(a,'d'),d=P.f.d&&P.f.d!==true?P.f.d:'\t',r=inputOf(P.rest,inp,'paste');
    return R(lines(r.text).join(d)+'\n',r.err.replace(/\n$/,''));
  });
  def('sed','sed \'s/old/new/[g]\' [file]  find and replace',function(a,inp){
    var P=flagParse(a),rest=P.rest,script=rest.shift();
    if(!script||script[0]!=='s')return R('','sed: this practice shell only supports s/old/new/ commands',1);
    var d=script[1],parts=[],cur='';
    for(var i=2;i<script.length;i++){
      if(script[i]==='\\'&&script[i+1]===d){cur+=d;i++}
      else if(script[i]===d){parts.push(cur);cur=''}
      else cur+=script[i];
    }
    parts.push(cur);
    if(parts.length<2)return R('','sed: -e expression #1: unterminated `s\' command',1);
    var re;try{re=new RegExp(P.f.E?eregex(parts[0]):bre(parts[0]),(parts[2]||'').indexOf('g')>=0?'g':'')}catch(e){return R('','sed: invalid regular expression',1)}
    var rep=parts[1].replace(/\\(\d)/g,'$$$1').replace(/&/g,'$$&');
    var r=inputOf(rest,inp,'sed');
    return R(joinLines(lines(r.text).map(function(l){return l.replace(re,rep)})),r.err.replace(/\n$/,''));
  });
  def('awk','awk [-F SEP] \'[/re/] {print $1, $2}\' [file]  pick columns (print only)',function(a,inp){
    var P=flagParse(a,'F'),rest=P.rest,prog=rest.shift(),sep=P.f.F&&P.f.F!==true?P.f.F:null;
    if(!prog)return R('','awk: no program given',2);
    var m=/^\s*(?:\/((?:[^\/\\]|\\.)*)\/|(\$\d+|NR)\s*(==|!=|>=|<=|>|<|~)\s*("[^"]*"|\/[^\/]*\/|[\w.-]+))?\s*(?:\{\s*print\b([^}]*)\}\s*)?$/.exec(prog);
    if(!m)return R('','awk: this practice shell only supports patterns like  /re/ {print $1, $3}  or  $3 > 5 {print $1}',2);
    var pre=m[1]!=null?new RegExp(m[1]):null,cf=m[2],cop=m[3],cv=m[4],items=m[5]!=null?m[5]:'';
    var r=inputOf(rest,inp,'awk'),out='',nr=0;
    lines(r.text).forEach(function(l){
      nr++;var F=sep?l.split(sep):l.trim().split(/\s+/);F.unshift(l);
      function fld(n){return n==='NF'?F.length-1:(F[+n]!==undefined?F[+n]:'')}
      if(pre&&!pre.test(l))return;
      if(cf){
        var lhs=cf==='NR'?nr:fld(cf.slice(1)),rhs=cv;
        if(cop==='~'){var rr=new RegExp(cv.replace(/^\/|\/$/g,''));if(!rr.test(String(lhs)))return}
        else{rhs=/^"/.test(cv)?cv.slice(1,-1):cv;var num=!isNaN(+lhs)&&!isNaN(+rhs)&&lhs!==''&&rhs!=='';
          var x=num?+lhs:String(lhs),y=num?+rhs:String(rhs),ok={'==':x===y,'!=':x!==y,'>':x>y,'<':x<y,'>=':x>=y,'<=':x<=y}[cop];if(!ok)return}
      }
      if(m[5]==null){out+=l+'\n';return}
      var specs=items.trim()?items.split(','):['$0'],vals=specs.map(function(s){
        s=s.trim();
        if(/^"[^"]*"$/.test(s))return s.slice(1,-1);
        var expr=s.replace(/\$(NF|\d+)/g,function(_,n){var v=fld(n);return /^-?\d+$/.test(String(v).trim())?String(v).trim():'0'});
        if(/^\$(NF|\d+)$/.test(s))return String(fld(s.slice(1)));
        if(s==='NR')return String(nr);
        if(s==='NF')return String(F.length-1);
        try{return evalArith(expr,'bc').toString()}catch(e){return s}
      });
      out+=vals.join(' ')+'\n';
    });
    return R(out,r.err.replace(/\n$/,''));
  });
  def('base64','base64 [-d] [file]  encode (or decode with -d) base64',function(a,inp){
    var P=flagParse(a),r=inputOf(P.rest,inp,'base64');
    if(P.f.d){var u=b64dec(r.text);if(!u)return R('','base64: invalid input',1);return R(TD.decode(u))}
    var e=b64enc(bytesOf(r.text)),o='';for(var i=0;i<e.length;i+=76)o+=e.slice(i,i+76)+'\n';
    return R(o,r.err.replace(/\n$/,''));
  });
  def('xxd','xxd [-p] [-r -p] [file]  hex dump (-p plain, -r -p back to text)',function(a,inp){
    var P=flagParse(a),f=P.f,r=inputOf(P.rest,inp,'xxd');
    if(f.r){var h=r.text.replace(/\s+/g,'');if(/[^0-9a-fA-F]/.test(h)||h.length%2)return R('','xxd: invalid hex',1);
      var u=new Uint8Array(h.length/2);for(var i=0;i<u.length;i++)u[i]=parseInt(h.substr(i*2,2),16);return R(TD.decode(u))}
    var b=bytesOf(r.text),o='';
    if(f.p){var h2=hex(b);for(var j=0;j<h2.length;j+=60)o+=h2.slice(j,j+60)+'\n';return R(o)}
    for(var k=0;k<b.length;k+=16){
      var ch=b.slice(k,k+16),hx='';for(var q=0;q<16;q+=2)hx+=(q<ch.length?hex(ch.slice(q,q+2)):'').padEnd(4)+' ';
      o+=pad(k.toString(16),8,true).replace(/ /g,'0')+': '+hx+' '+Array.from(ch,function(c){return c>=32&&c<127?String.fromCharCode(c):'.'}).join('')+'\n';
    }
    return R(o);
  });
  Object.keys(HASHES).forEach(function(alg){
    var name=alg+'sum';
    def(name,name+' [-c checkfile] [file...]  print (or check with -c) '+alg.toUpperCase()+' fingerprints',function(a,inp){
      var P=flagParse(a),f=P.f,hf=HASHES[alg];
      if(f.c){
        var r=inputOf(P.rest,inp,name),o='',bad=0,err=r.err.replace(/\n$/,'');
        lines(r.text).forEach(function(l){
          var m=/^([0-9a-fA-F]+)\s+\*?(.+)$/.exec(l);if(!m)return;
          var fr=readNode(m[2],name);
          if(fr.err){o+=m[2]+': FAILED open or read\n';bad++;return}
          if(hex(hf(bytesOf(fr.n.c)))===m[1].toLowerCase())o+=m[2]+': OK\n';else{o+=m[2]+': FAILED\n';bad++}
        });
        if(bad)err+=(err?'\n':'')+name+': WARNING: '+bad+' computed checksum'+(bad>1?'s':'')+' did NOT match';
        return R(o,err,bad?1:0);
      }
      if(!P.rest.length)return R(hex(hf(bytesOf(inp==null?'':inp)))+'  -\n');
      var o2='',e2='';
      P.rest.forEach(function(p){var rr=readNode(p,name);if(rr.err){e2+=rr.err+'\n';return}o2+=hex(hf(bytesOf(rr.n.c)))+'  '+p+'\n'});
      return R(o2,e2.replace(/\n$/,''));
    });
  });
  def('bc','bc  calculator: echo "2^10 % 7" | bc    (obase=2 and ibase=2 work)',function(a,inp){
    var vars={},ib=10,ob=10,out='',err='';
    lines(inp==null?'':inp).forEach(function(line){
      line.split(';').forEach(function(stmt){
        stmt=stmt.trim();if(!stmt||stmt==='quit')return;
        var m=/^([a-z_][a-z_0-9]*)\s*=\s*(.+)$/.exec(stmt);
        try{
          if(m&&!/^=/.test(m[2])){
            var v=evalArith(m[2],'bc',vars,ib);
            if(m[1]==='ibase')ib=Number(v);else if(m[1]==='obase')ob=Number(v);else if(m[1]!=='scale')vars[m[1]]=v;
          }else{
            var res=evalArith(stmt,'bc',vars,ib),s=res<0n?'-'+(-res).toString(ob).toUpperCase():res.toString(ob).toUpperCase();
            if(ob>16){s=res.toString()}
            for(var i=0;i<s.length;i+=69)out+=s.slice(i,i+69)+(i+69<s.length?'\\':'')+'\n';
          }
        }catch(e){err+='(standard_in) 1: '+e.message+'\n'}
      });
    });
    return R(out,err.replace(/\n$/,''));
  });
  def('mkdir','mkdir [-p] dir  make a directory',function(a){
    var P=flagParse(a),err='';
    P.rest.forEach(function(d){
      var p=normalise(d);if(node(p)){if(!P.f.p)err+='mkdir: cannot create directory \''+d+'\': File exists\n';return}
      var par=node(normalise(p.replace(/\/[^\/]*$/,'')||'/'));
      if(!par&&P.f.p){mkparents(p+'/x',p.indexOf(HOME)===0)}
      else if(!par){err+='mkdir: cannot create directory \''+d+'\': No such file or directory\n';return}
      else if(!can(par,'w')){err+='mkdir: cannot create directory \''+d+'\': Permission denied\n';return}
      st.fs[p]={t:'d',m:'755',o:USER,g:'staff',time:'Mar 15 10:00',c:''};
    });
    return R('',err.replace(/\n$/,''));
  });
  def('touch','touch file  create an empty file',function(a){
    var err='';a.forEach(function(f){var p=normalise(f);if(!node(p)){var e=writeFile(f,'',false);if(e)err+='touch: cannot touch \''+f+'\': '+e+'\n'}});
    return R('',err.replace(/\n$/,''));
  });
  def('rm','rm [-r] [-f] file  delete files',function(a){
    var P=flagParse(a),err='';
    P.rest.forEach(function(f){
      var p=normalise(f),n=node(p);
      if(!n){if(!P.f.f)err+='rm: cannot remove \''+f+'\': No such file or directory\n';return}
      if(n.t==='d'&&!P.f.r){err+='rm: cannot remove \''+f+'\': Is a directory\n';return}
      var par=node(normalise(p.replace(/\/[^\/]*$/,'')||'/'));
      if(par&&!can(par,'w')){err+='rm: cannot remove \''+f+'\': Permission denied\n';return}
      Object.keys(st.fs).forEach(function(k){if(k===p||k.indexOf(p+'/')===0)delete st.fs[k]});
    });
    return R('',err.replace(/\n$/,''));
  });
  def('cp','cp src dst  copy a file',function(a){
    if(a.length<2)return R('','cp: missing destination file operand',1);
    var r=readNode(a[0],'cp');if(r.err)return R('',r.err,1);
    var dst=node(normalise(a[1])),to=dst&&dst.t==='d'?a[1]+'/'+a[0].split('/').pop():a[1],e=writeFile(to,r.n.c,false);
    if(e)return R('','cp: cannot create regular file \''+a[1]+'\': '+e,1);
    var nn=node(normalise(to));nn.m=r.n.m;return R();
  });
  def('mv','mv src dst  move or rename a file',function(a){
    if(a.length<2)return R('','mv: missing destination file operand',1);
    var sp=normalise(a[0]),n=node(sp);if(!n)return R('','mv: cannot stat \''+a[0]+'\': No such file or directory',1);
    var dst=node(normalise(a[1])),to=normalise(dst&&dst.t==='d'?a[1]+'/'+a[0].split('/').pop():a[1]);
    st.fs[to]=n;delete st.fs[sp];return R();
  });
  def('chmod','chmod MODE file  change permissions: chmod 640 f, chmod u+x f, chmod go-rwx f',function(a){
    var P=flagParse(a),rest=P.rest;
    if(rest.length<2)return R('','chmod: missing operand',1);
    var mode=rest.shift(),err='';
    rest.forEach(function(f){
      var p=normalise(f),n=node(p);
      if(!n){err+='chmod: cannot access \''+f+'\': No such file or directory\n';return}
      if(n.o!==USER&&!st.root){err+='chmod: changing permissions of \''+f+'\': Operation not permitted\n';return}
      var cur=parseInt(n.m,8),nv=cur;
      if(/^[0-7]{1,4}$/.test(mode))nv=parseInt(mode,8)&0o777;
      else{
        var ok=true;
        mode.split(',').forEach(function(cl){
          var m=/^([ugoa]*)([-+=])([rwxX]*)$/.exec(cl);if(!m){ok=false;return}
          var who=m[1]||'a',bits=0;
          if(m[3].indexOf('r')>=0)bits|=4;if(m[3].indexOf('w')>=0)bits|=2;if(m[3].indexOf('x')>=0||(m[3].indexOf('X')>=0&&(n.t==='d'||(cur&0o111))))bits|=1;
          var mask=0;
          if(who.indexOf('a')>=0)who='ugo';
          if(who.indexOf('u')>=0)mask|=bits<<6;if(who.indexOf('g')>=0)mask|=bits<<3;if(who.indexOf('o')>=0)mask|=bits;
          if(m[2]==='+')nv|=mask;else if(m[2]==='-')nv&=~mask;
          else{var clear=0;if(who.indexOf('u')>=0)clear|=7<<6;if(who.indexOf('g')>=0)clear|=7<<3;if(who.indexOf('o')>=0)clear|=7;nv=(nv&~clear)|mask}
        });
        if(!ok){err+='chmod: invalid mode: \''+mode+'\'\n';return}
      }
      n.m=(nv&0o777).toString(8).padStart(3,'0');
    });
    return R('',err.replace(/\n$/,''));
  });
  def('stat','stat [-c FORMAT] file  details of a file (%a mode, %A letters, %U owner, %G group, %s size, %n name)',function(a){
    var P=flagParse(a,'c'),o='',e='';
    P.rest.forEach(function(f){
      var p=normalise(f),n=node(p);if(!n){e+='stat: cannot statx \''+f+'\': No such file or directory\n';return}
      if(P.f.c&&P.f.c!==true){o+=P.f.c.replace(/%([aAUGsn])/g,function(_,c){return{a:n.m,A:modeStr(n),U:n.o,G:n.g,s:String(size(n)),n:f}[c]})+'\n';return}
      o+='  File: '+f+'\n  Size: '+size(n)+'\t\tBlocks: 8\t   IO Block: 4096\t'+(n.t==='d'?'directory':'regular file')+'\nAccess: (0'+n.m+'/'+modeStr(n)+')  Uid: ( 1000/ '+n.o+')   Gid: ( 1000/ '+n.g+')\nModify: 2025-'+n.time+'\n';
    });
    return R(o,e.replace(/\n$/,''));
  });
  def('file','file path  guess what kind of file it is',function(a){
    var o='',e='';
    a.forEach(function(f){
      var r=readNode(f,'file');
      if(r.err){var n=node(normalise(f));if(n&&n.t==='d'){o+=f+': directory\n';return}e+=f+': cannot open (No such file or directory)\n';return}
      var c=r.n.c;
      var t=/^MZ/.test(c)?'PE32 executable (GUI) Intel 80386, for MS Windows':/^\x7fELF/.test(c)?'ELF 64-bit LSB executable, x86-64':/^#!/.test(c)?'a script, ASCII text executable':/-----BEGIN CERTIFICATE-----/.test(c)?'PEM certificate':/^%PDF/.test(c)?'PDF document':c===''?'empty':'ASCII text';
      o+=f+': '+t+'\n';
    });
    return R(o,e.replace(/\n$/,''));
  });
  def('cmp','cmp file1 file2  say whether two files are identical',function(a){
    if(a.length<2)return R('','cmp: missing operand',2);
    var x=readNode(a[0],'cmp'),y=readNode(a[1],'cmp');
    if(x.err||y.err)return R('',(x.err||y.err),2);
    if(x.n.c===y.n.c)return R();
    var i=0;while(i<x.n.c.length&&x.n.c[i]===y.n.c[i])i++;
    return R(a[0]+' '+a[1]+' differ: byte '+(i+1)+', line '+((x.n.c.slice(0,i).match(/\n/g)||[]).length+1)+'\n','',1);
  });
  def('man','man ascii  show the ASCII table (hex). Other manual pages are not included',function(a){
    if(a[0]!=='ascii')return R('','No manual entry for '+(a[0]||'')+' (this practice shell only has "man ascii"; try help '+(a[0]||'')+')',16);
    var o='ASCII(7)  hexadecimal table: find the column digit, then the row digit\n\n     2  3  4  5  6  7\n   -------------------\n';
    for(var r=0;r<16;r++){
      o+=' '+r.toString(16).toUpperCase()+': ';
      for(var c=2;c<8;c++){var code=c*16+r,ch=code===32?'SP':code===127?'DEL':String.fromCharCode(code);o+=pad(ch,3)}
      o=o.replace(/ +$/,'')+'\n';
    }
    o+='\nExample: A is column 4, row 1, so it is 0x41. a is 0x61. The digit 0 is 0x30.\n';
    return R(o);
  });
  def('export','export NAME=value  set a variable',function(a){a.forEach(function(x){var m=/^([A-Za-z_]\w*)=([\s\S]*)$/.exec(x);if(m)st.vars[m[1]]=m[2]});return R()});
  def('sudo','sudo command  run a command as root (only where the lab allows it)',function(a,inp){
    if(!env.sudo)return R('',USER+' is not in the sudoers file.  This incident will be reported.',1);
    if(!a.length)return R('','usage: sudo command',1);
    var was=st.root;st.root=true;
    try{var r=runCommand(a[0],a.slice(1),inp)}finally{st.root=was}
    return r;
  });
  def('as','as SOURCE-IP command  lab helper: run the command as if it came from that address (try: as 203.0.113.5 nmap gateway)',function(a,inp){
    if(a.length<2||ip2n(a[0])==null)return R('','usage: as 203.0.113.5 nmap gateway',1);
    var was=st.src;st.src=a[0];
    try{var r=runCommand(a[1],a.slice(2),inp)}finally{st.src=was}
    return r;
  });

  /* ----- pretend network: ping, nmap ----- */
  function allHosts(){
    var h=Object.assign({},env.hosts||{});
    if(env.self)h[env.self.ip]=Object.assign({self:true},env.self);
    return h;
  }
  function findHost(t){
    t=String(t).replace(/^https?:\/\//,'').replace(/\/.*$/,'');
    var hs=allHosts();
    if(t==='localhost'||t==='127.0.0.1'){return env.self?Object.assign({self:true,loop:true},env.self):null}
    if(hs[t])return hs[t];
    var k=Object.keys(hs).filter(function(ip){var h=hs[ip];return h.name===t||(h.name&&h.name.split('.')[0]===t)||(h.alias&&h.alias.indexOf(t)>=0)});
    return k.length?hs[k[0]]:null;
  }
  function portStateFor(h,port,proto){
    var ports=h.ports||h.services||{},spec=ports[port];
    var listening=!!spec&&(spec[0]==='open'||h.self);
    if(h.self&&!h.loop){
      var verdict=evalRules(port,st.src||env.scanFrom||'10.0.0.77');
      if(verdict==='ACCEPT')return listening?'open':'closed';
      if(verdict==='REJECT')return 'closed';
      return 'filtered';
    }
    if(h.self&&h.loop)return listening?'open':'closed';
    return spec?spec[0]:(h.other||'closed');
  }
  function evalRules(port,src){
    var rl=st.rules.list;
    for(var i=0;i<rl.length;i++){
      var r=rl[i];
      if(r.proto&&r.proto!=='all'&&r.proto!=='tcp')continue;
      if(r.state)continue;
      if(r.iface==='lo')continue;
      if(r.dport&&!(port>=r.dport[0]&&port<=r.dport[1]))continue;
      if(r.src&&!inCidr(src,r.src))continue;
      return r.target;
    }
    return st.rules.policy==='ACCEPT'?'ACCEPT':'DROP';
  }
  function svcName(h,port){var s=(h.ports||h.services||{})[port];return s&&s[1]?s[1]:(PORT_NAMES[port]||'unknown')}
  function svcVer(h,port){var s=(h.ports||h.services||{})[port];return s&&s[2]?s[2]:''}
  def('ping','ping [-c N] host  is the host alive?',function(a){
    var P=flagParse(a,'c'),host=P.rest[0];if(!host)return R('','usage: ping [-c count] host',2);
    var h=findHost(host);if(!h&&ip2n(host)==null)return R('','ping: '+host+': Name or service not known',2);
    var ip=h?(h.ip||host):host,cnt=P.f.c&&P.f.c!==true?Math.min(+P.f.c||4,8):3;
    var up=h&&(h.up!==false)&&!(h.self&&!h.loop&&evalRules(0,st.src||'10.0.0.77')!=='ACCEPT'&&false);
    var o='PING '+host+' ('+ip+') 56(84) bytes of data.\n';
    if(!up)return R(o+'\n--- '+host+' ping statistics ---\n'+cnt+' packets transmitted, 0 received, 100% packet loss, time '+(cnt*1000)+'ms\n','',1);
    for(var i=0;i<cnt;i++)o+='64 bytes from '+ip+': icmp_seq='+(i+1)+' ttl=64 time='+(0.3+i*0.07).toFixed(2)+' ms\n';
    return R(o+'\n--- '+host+' ping statistics ---\n'+cnt+' packets transmitted, '+cnt+' received, 0% packet loss\n');
  });
  def('nmap','nmap [-sn] [-sV] [-p 22,80] [-Pn] target  scan hosts in the pretend network (names, addresses, or 10.0.0.0/24)',function(a){
    var f={},targets=[],portArg=null;
    for(var i=0;i<a.length;i++){
      var x=a[i];
      if(x==='-p')portArg=a[++i];
      else if(/^-p.+/.test(x))portArg=x.slice(2);
      else if(x==='-sn'||x==='-sP')f.sn=true;
      else if(x==='-sV')f.sV=true;
      else if(x==='-Pn'||x==='-sS'||x==='-sT'||x==='-v'||x==='-A'||x==='-n'||x==='-F'||/^-T\d$/.test(x)){}
      else if(x[0]==='-')return R('','nmap: unrecognized option \''+x+'\'\nSee the output of nmap -h for a summary of options.',1);
      else targets.push(x);
    }
    if(!targets.length)return R('','Nmap 7.94 ( https://nmap.org )\nUsage: nmap [Scan Type(s)] [Options] {target specification}',1);
    if(!env.hosts&&!env.self)return R('','nmap: there is no pretend network in this week\'s lab. Try Week 4.',1);
    var hs=allHosts(),o='Starting Nmap 7.94 ( https://nmap.org ) at 2025-03-15 10:00 UTC\n',up=0,total=0,list=[];
    targets.forEach(function(t){
      var cm=/^(\d+\.\d+\.\d+)\.0\/24$/.exec(t);
      if(cm){total+=256;for(var k=1;k<255;k++){var ip=cm[1]+'.'+k;if(hs[ip])list.push({ip:ip,h:hs[ip]})}}
      else{
        total++;var h=findHost(t);
        if(h)list.push({ip:h.ip||t,h:h});
        else if(ip2n(t)==null){o+='Failed to resolve "'+t+'".\n';total--}
        else list.push({ip:t,h:null,single:true});
      }
    });
    var spec=null;
    if(portArg){
      spec=[];
      String(portArg).split(',').forEach(function(x){
        var m=/^(\d*)-(\d*)$/.exec(x);
        if(m){for(var k=+m[1]||1;k<=(+m[2]||65535)&&spec.length<66000;k++)spec.push(k)}
        else if(/^\d+$/.test(x))spec.push(+x);
      });
    }
    list.forEach(function(x){
      var h=x.h;
      if(!h||h.up===false){if(targets.length===1&&!/\/24$/.test(targets[0]))o+='Note: Host seems down. If it is really up, but blocking our ping probes, try -Pn\n';return}
      up++;
      o+='Nmap scan report for '+(h.name?h.name+' ('+x.ip+')':x.ip)+'\nHost is up (0.0010s latency).\n';
      if(f.sn)return;
      var known=Object.keys(h.ports||h.services||{}).map(Number).sort(function(p,q){return p-q});
      var rows=[],show;
      if(spec){
        spec.forEach(function(p){rows.push([p,portStateFor(h,p)])});
        var counts={};rows.forEach(function(r){counts[r[1]]=(counts[r[1]]||0)+1});
        var dom=Object.keys(counts).sort(function(p,q){return counts[q]-counts[p]})[0];
        show=rows;
        if(rows.length>25&&dom&&counts[dom]>25){
          show=rows.filter(function(r){return r[1]!==dom});
          o+='Not shown: '+counts[dom]+' '+dom+' tcp ports ('+(dom==='closed'?'conn-refused':'no-response')+')\n';
        }
      }else{
        known.forEach(function(p){rows.push([p,portStateFor(h,p)])});
        var other=portStateFor(h,54321),hidden=(1000-known.length)+rows.filter(function(r){return r[1]===other}).length;
        show=rows.filter(function(r){return r[1]!==other});
        if(hidden>0)o+='Not shown: '+hidden+' '+other+' tcp ports ('+(other==='closed'?'conn-refused':'no-response')+')\n';
      }
      if(!show.length){o+=spec?'All scanned ports are closed\n':'';return}
      o+=pad('PORT',9)+pad('STATE',9)+'SERVICE'+(f.sV?'  VERSION':'')+'\n';
      show.forEach(function(r){
        var line=pad(r[0]+'/tcp',9)+pad(r[1],9)+svcName(h,r[0]);
        if(f.sV&&r[1]==='open')line=pad(line,9+9+9)+(svcVer(h,r[0])||'');
        o+=line.replace(/ +$/,'')+'\n';
      });
    });
    o+='\nNmap done: '+total+' IP address'+(total===1?'':'es')+' ('+up+' host'+(up===1?'':'s')+' up) scanned in '+(0.04+up*0.03).toFixed(2)+' seconds\n';
    return R(o);
  });

  /* ----- pretend firewall: iptables ----- */
  function ruleText(r,i,f){
    var tgt=r.target,prot=r.proto||'all',src=r.src||(f.n?'0.0.0.0/0':'anywhere'),dst=f.n?'0.0.0.0/0':'anywhere',extra='';
    if(r.state)extra+='state '+r.state+' ';
    if(r.dport){var pn=r.dport[0]===r.dport[1]?(f.n?String(r.dport[0]):(PORT_NAMES[r.dport[0]]||String(r.dport[0]))):r.dport[0]+':'+r.dport[1];extra+=(prot==='udp'?'udp':'tcp')+' dpt:'+pn}
    return(f.l?pad(i+1,4)+' ':'')+pad(tgt,10)+' '+pad(prot,4)+' --  '+pad(src,20)+' '+pad(dst,20)+' '+extra.trim();
  }
  def('iptables','iptables -L [-n] [--line-numbers] | -A INPUT -p tcp --dport 22 -s 10.0.0.0/24 -j ACCEPT | -P INPUT DROP | -F | -D INPUT n  the pretend firewall',function(a){
    if(!env.rules&&!env.self)return R('','iptables: there is no firewall in this week\'s lab. Try Week 4.',1);
    if(!st.root)return R('','iptables v1.8.7 (nf_tables): Could not fetch rule set generation id: Permission denied (you must be root)',4);
    var i=0,act=null,chain='INPUT',n=null,f={},rule={target:null,proto:null,src:null,dport:null,state:null,iface:null};
    while(i<a.length){
      var x=a[i];
      if(x==='-L'||x==='--list'){act='L';if(a[i+1]&&a[i+1][0]!=='-'){chain=a[++i]}}
      else if(x==='-n'||x==='--numeric')f.n=true;
      else if(x==='-v'||x==='--verbose'){}
      else if(x==='--line-numbers')f.l=true;
      else if(x==='-nL'||x==='-Ln'){act='L';f.n=true}
      else if(x==='-A'||x==='--append'){act='A';chain=a[++i]}
      else if(x==='-I'||x==='--insert'){act='I';chain=a[++i];if(/^\d+$/.test(a[i+1]||''))n=+a[++i]}
      else if(x==='-D'||x==='--delete'){act='D';chain=a[++i];if(/^\d+$/.test(a[i+1]||''))n=+a[++i]}
      else if(x==='-P'||x==='--policy'){act='P';chain=a[++i];n=a[++i]}
      else if(x==='-F'||x==='--flush'){act='F';if(a[i+1]&&a[i+1][0]!=='-')chain=a[++i]}
      else if(x==='-p'||x==='--protocol')rule.proto=a[++i];
      else if(x==='-s'||x==='--source')rule.src=a[++i];
      else if(x==='--dport'||x==='--destination-port'){var pv=String(a[++i]),pm=/^(\d+)(?::(\d+))?$/.exec(pv);if(!pm)return R('','iptables v1.8.7: invalid port/service `'+pv+'\' specified',2);rule.dport=[+pm[1],+(pm[2]||pm[1])]}
      else if(x==='-i')rule.iface=a[++i];
      else if(x==='-m'){i++}
      else if(x==='--state'||x==='--ctstate'){rule.state=a[++i]}
      else if(x==='-j'||x==='--jump')rule.target=a[++i];
      else return R('','iptables v1.8.7: unknown option "'+x+'"\nTry `iptables -h\' or \'iptables --help\' for more information.',2);
      i++;
    }
    if(chain!=='INPUT'&&act!=='L')return R('','This practice firewall only has the INPUT chain (traffic coming in to this machine).',1);
    if(act==='L'){
      var o='Chain INPUT (policy '+st.rules.policy+')\n'+(f.l?'num  ':'')+'target     prot opt source               destination\n';
      st.rules.list.forEach(function(r,k){o+=ruleText(r,k,f)+'\n'});
      if(!chain||chain==='INPUT')o+='\nChain FORWARD (policy ACCEPT)\ntarget     prot opt source               destination\n\nChain OUTPUT (policy ACCEPT)\ntarget     prot opt source               destination\n';
      return R(o);
    }
    if(act==='F'){st.rules.list=[];return R()}
    if(act==='P'){if(n!=='ACCEPT'&&n!=='DROP')return R('','iptables: Bad policy name. Run \'dmesg\' for more information.',1);st.rules.policy=n;return R()}
    if(act==='D'){if(n==null||n<1||n>st.rules.list.length)return R('','iptables: Index of deletion too big.',1);st.rules.list.splice(n-1,1);return R()}
    if(act==='A'||act==='I'){
      if(!rule.target)return R('','iptables v1.8.7: no target given (use -j ACCEPT, -j DROP or -j REJECT)',2);
      if(['ACCEPT','DROP','REJECT'].indexOf(rule.target)<0)return R('','iptables v1.8.7: Couldn\'t load target `'+rule.target+'\'',2);
      if(rule.dport&&rule.proto!=='tcp'&&rule.proto!=='udp')return R('','iptables v1.8.7: unknown option "--dport"\nYou need -p tcp (or -p udp) before --dport.',2);
      if(rule.src&&ip2n(rule.src.split('/')[0])==null)return R('','iptables v1.8.7: host/network `'+rule.src+'\' not found',2);
      if(act==='A')st.rules.list.push(rule);else st.rules.list.splice((n||1)-1,0,rule);
      return R();
    }
    return R('','iptables v1.8.7: no command specified\nTry `iptables -h\' or \'iptables --help\' for more information.',2);
  });

  /* ----- certificates and TLS: openssl ----- */
  function dn(list){return(list||[]).map(function(p){return p[0]+' = '+p[1]}).join(', ')}
  function optsOf(args,withArg){ // flags are whole words like -in, -noout, -hex
    var f={},rest=[];
    for(var i=0;i<args.length;i++){var x=args[i];
      if(x[0]==='-'&&x.length>1&&!/^-\d+$/.test(x)){var nm=x.slice(1);if(withArg.indexOf(nm)>=0)f[nm]=args[++i];else f[nm]=true}
      else rest.push(x)}
    return{f:f,rest:rest};
  }
  def('openssl','openssl version | rand -hex N | dgst -sha256 [-hmac KEY] file | x509 -in file -noout -subject -issuer -dates -text | s_client -connect host:443',function(a,inp){
    var sub=a[0],rest=a.slice(1);
    if(!sub)return R('','openssl: try  version, rand, dgst, x509 or s_client',1);
    if(sub==='version')return R('OpenSSL 3.0.2 15 Mar 2022 (Library: OpenSSL 3.0.2 15 Mar 2022)\n');
    if(sub==='rand'){
      var P=optsOf(rest,[]),nn=parseInt(P.rest[0],10);if(!(nn>0&&nn<=1024))return R('','Usage: openssl rand [-hex|-base64] num',1);
      var u=new Uint8Array(nn);
      if(root.crypto&&root.crypto.getRandomValues)root.crypto.getRandomValues(u);else for(var i=0;i<nn;i++)u[i]=Math.floor(Math.random()*256);
      return R((P.f.hex?hex(u):P.f.base64?b64enc(u):TD.decode(u))+'\n');
    }
    if(sub==='dgst'){
      var alg='sha256',key=null,files=[];
      for(var j=0;j<rest.length;j++){var x=rest[j];
        if(/^-(sha256|sha1|md5)$/.test(x))alg=x.slice(1);else if(x==='-hmac')key=rest[++j];else if(x[0]!=='-')files.push(x);
        else if(x==='-r'||x==='-hex'){}else return R('','dgst: Unknown option or message digest: '+x.replace(/^-/,''),1)}
      var label={sha256:'SHA2-256',sha1:'SHA1',md5:'MD5'}[alg],o='',e='';
      if(!files.length)files=[null];
      files.forEach(function(fn){
        var text;
        if(fn===null)text=inp==null?'':inp;else{var r=readNode(fn,'openssl');if(r.err){e+='Could not open file or uri for loading: '+fn+'\n';return}text=r.n.c}
        var h=key!==null?hex(hmac(HASHES[alg],bytesOf(key),bytesOf(text))):hex(HASHES[alg](bytesOf(text)));
        o+=(key!==null?'HMAC-':'')+label+'('+(fn===null?'stdin':fn)+')= '+h+'\n';
      });
      return R(o,e.replace(/\n$/,''));
    }
    if(sub==='x509'){
      var P2=optsOf(rest,['in']),fn=P2.f.in;
      if(!fn||fn===true)return R('','x509: no input file given (-in file)',1);
      var rr=readNode(fn,'openssl');if(rr.err)return R('','Could not open file or uri for loading: '+fn,1);
      var cert=(env.certs||{})[normalise(fn)];
      if(!cert)return R('','Could not read certificate from '+fn+'\nUnable to load certificate',1);
      var f2=P2.f,o2='';
      if(f2.subject)o2+='subject='+dn(cert.subject)+'\n';
      if(f2.issuer)o2+='issuer='+dn(cert.issuer)+'\n';
      if(f2.dates)o2+='notBefore='+cert.notBefore+'\nnotAfter='+cert.notAfter+'\n';
      if(f2.enddate)o2+='notAfter='+cert.notAfter+'\n';
      if(f2.text){
        o2+='Certificate:\n    Data:\n        Version: 3 (0x2)\n        Serial Number: '+(cert.serial||'01')+'\n        Signature Algorithm: '+(cert.sig||'sha256WithRSAEncryption')+'\n        Issuer: '+dn(cert.issuer)+
          '\n        Validity\n            Not Before: '+cert.notBefore+'\n            Not After : '+cert.notAfter+'\n        Subject: '+dn(cert.subject)+
          '\n        Subject Public Key Info:\n            Public Key Algorithm: rsaEncryption\n                Public-Key: ('+(cert.bits||2048)+' bit)\n        X509v3 extensions:\n'+
          (cert.san?'            X509v3 Subject Alternative Name:\n                '+cert.san.map(function(s){return 'DNS:'+s}).join(', ')+'\n':'')+
          '            X509v3 Basic Constraints: critical\n                CA:'+(cert.ca?'TRUE':'FALSE')+'\n';
      }
      if(f2.checkend){var yes=!!cert.expired;o2+=yes?'Certificate will expire\n':'Certificate will not expire\n';return R(o2,'',yes?1:0)}
      if(!f2.noout)o2+=rr.n.c;
      return R(o2);
    }
    if(sub==='s_client'){
      var P3=optsOf(rest,['connect']),tgt=P3.f.connect;if(!tgt||tgt===true)return R('','s_client: use -connect host:443',1);
      var host=String(tgt).split(':')[0],tls=(env.tls||{})[host];
      if(!tls)return R('','getaddrinfo: Name or service not known\nconnect:errno=0',1);
      var o3='CONNECTED(00000003)\n---\nCertificate chain\n';
      tls.chain.forEach(function(c,k){o3+=' '+k+' s:'+c.s+'\n   i:'+c.i+'\n'});
      o3+='---\nVerification: '+(tls.verify==='ok'?'OK':'ERROR')+'\n'+(tls.verify==='ok'?'':'Verify return code: '+tls.verify+'\n')+'New, '+tls.proto+', Cipher is '+tls.cipher+'\n';
      return R(o3);
    }
    return R('','openssl: "'+sub+'" is not part of this practice shell (try version, rand, dgst, x509, s_client)',1);
  });

  /* ----- Kerberos tickets ----- */
  var K=function(){return env.kerberos||{realm:'LAB.EXAMPLE',users:{},services:[]}};
  function stamp(off){return '03/15/25 10:'+String(off).padStart(2,'0')+':00'}
  def('kinit','echo PASSWORD | kinit user  log in to Kerberos and get a ticket-granting ticket (TGT)',function(a,inp){
    var k=K(),user=(a[0]||'').split('@')[0];
    if(!user)return R('','Usage: kinit principal',1);
    if(!(user in k.users))return R('','kinit: Client \''+user+'@'+k.realm+'\' not found in Kerberos database while getting initial credentials',1);
    if(inp==null)return R('Password for '+user+'@'+k.realm+': ','kinit: Password read interrupted while getting initial credentials (hint: pipe the password in with  echo PASSWORD | kinit '+user+')',1);
    if(inp.trim()!==k.users[user])return R('','kinit: Preauthentication failed while getting initial credentials',1);
    st.krb={principal:user+'@'+k.realm,tgt:{svc:'krbtgt/'+k.realm+'@'+k.realm,start:0},tickets:[]};
    return R();
  });
  def('klist','klist  list your Kerberos tickets',function(){
    if(!st.krb.tgt)return R('','klist: No credentials cache found (filename: /tmp/krb5cc_1000)',1);
    var o='Ticket cache: FILE:/tmp/krb5cc_1000\nDefault principal: '+st.krb.principal+'\n\nValid starting     Expires            Service principal\n';
    var all=[st.krb.tgt].concat(st.krb.tickets);
    all.forEach(function(t,i){o+=stamp(i)+'  03/15/25 20:00:00  '+t.svc+'\n'});
    return R(o);
  });
  def('kvno','kvno service/host  ask the ticket-granting service for a ticket to a service (needs a TGT first)',function(a){
    var k=K();
    if(!st.krb.tgt)return R('','kvno: No credentials cache found while getting client principal name',1);
    var out='',err='';
    a.forEach(function(s){
      var full=s.indexOf('@')>=0?s:s+'@'+k.realm;
      if((k.services||[]).indexOf(s.split('@')[0])<0){err+='kvno: Server '+full+' not found in Kerberos database while getting credentials\n';return}
      if(!st.krb.tickets.some(function(t){return t.svc===full}))st.krb.tickets.push({svc:full});
      out+=full+': kvno = 2\n';
    });
    return R(out,err.replace(/\n$/,''));
  });
  def('kdestroy','kdestroy  throw away your tickets',function(){st.krb={tgt:null,tickets:[],principal:null};return R()});

  /* ----- run machinery ----- */
  function runCommand(name,args,inp){
    if(C[name]){if(st.used.indexOf(name)<0)st.used.push(name);return C[name](args,inp)}
    return R('','bash: '+name+': command not found',127);
  }
  function runScript(path,name){
    var n=node(normalise(path));
    if(!n)return R('','bash: '+name+': No such file or directory',127);
    if(n.t==='d')return R('','bash: '+name+': Is a directory',126);
    if(!can(n,'x'))return R('','bash: '+name+': Permission denied',126);
    var out=(env.exec||{})[normalise(path)];
    return R(out==null?'':out);
  }

  /* tokenizer */
  function tokenize(src){
    var T=[],i=0,n=src.length;
    function readDollar(q){
      if(src[i+1]==='('&&src[i+2]==='('){
        var depth=0;
        for(var j=i+3;j<n;j++){
          if(src[j]==='(')depth++;
          else if(src[j]===')'){if(depth===0&&src[j+1]===')'){var e=src.slice(i+3,j);i=j+2;return{t:'ar',v:e,q:q}}depth--}
        }
        throw new Error('syntax error: unterminated $(( ))');
      }
      if(src[i+1]==='('){
        var d=1,k=i+2;
        while(k<n&&d>0){if(src[k]==='(')d++;else if(src[k]===')')d--;k++}
        if(d>0)throw new Error('syntax error: unterminated $( )');
        var cmd=src.slice(i+2,k-1);i=k;return{t:'cmd',v:cmd,q:q};
      }
      if(src[i+1]==='{'){var c=src.indexOf('}',i);if(c<0)throw new Error('syntax error: unterminated ${');var nm=src.slice(i+2,c);i=c+1;return{t:'var',v:nm,q:q}}
      var m=/^(?:[A-Za-z_]\w*|[?0-9$!#])/.exec(src.slice(i+1));
      if(m){i+=1+m[0].length;return{t:'var',v:m[0],q:q}}
      i++;return{t:'lit',v:'$',q:q};
    }
    while(i<n){
      var c=src[i];
      if(c===' '||c==='\t'||c==='\r'){i++;continue}
      if(c==='\n'){T.push({k:'op',v:';'});i++;continue}
      if(c==='#'){while(i<n&&src[i]!=='\n')i++;continue}
      if(c==='|'){if(src[i+1]==='|'){T.push({k:'op',v:'||'});i+=2}else{T.push({k:'op',v:'|'});i++}continue}
      if(c==='&'){if(src[i+1]==='&'){T.push({k:'op',v:'&&'});i+=2}else{T.push({k:'op',v:';'});i++}continue}
      if(c===';'){T.push({k:'op',v:';'});i++;continue}
      if(c==='>'){if(src[i+1]==='>'){T.push({k:'op',v:'>>'});i+=2}else{T.push({k:'op',v:'>'});i++}continue}
      if(c==='<'){T.push({k:'op',v:'<'});i++;continue}
      if(c==='2'&&src[i+1]==='>'){
        if(src.slice(i,i+4)==='2>&1'){T.push({k:'op',v:'2>&1'});i+=4}
        else if(src[i+2]==='>'){T.push({k:'op',v:'2>>'});i+=3}
        else{T.push({k:'op',v:'2>'});i+=2}
        continue;
      }
      var segs=[],glob=false,quoted=false;
      function lit(v,q){var l=segs[segs.length-1];if(l&&l.t==='lit'&&l.q===q)l.v+=v;else segs.push({t:'lit',v:v,q:q})}
      while(i<n&&!/[\s|&;<>]/.test(src[i])){
        var ch=src[i];
        if(ch==="'"){var j=src.indexOf("'",i+1);if(j<0)throw new Error('syntax error: unterminated quote');lit(src.slice(i+1,j),'s');quoted=true;i=j+1}
        else if(ch==='"'){
          i++;quoted=true;var any=false;
          while(i<n&&src[i]!=='"'){
            if(src[i]==='\\'&&/["\\$`]/.test(src[i+1]||'')){lit(src[i+1],'d');i+=2}
            else if(src[i]==='$'){segs.push(readDollar('d'))}
            else{lit(src[i],'d');i++}
            any=true;
          }
          if(i>=n)throw new Error('syntax error: unterminated quote');
          i++;if(!any)lit('','d');
        }
        else if(ch==='\\'){if(i+1<n&&src[i+1]!=='\n')lit(src[i+1],'s');i+=2;quoted=true}
        else if(ch==='$'){segs.push(readDollar('u'))}
        else if(ch==='`'){var e2=src.indexOf('`',i+1);if(e2<0)throw new Error('syntax error: unterminated `');segs.push({t:'cmd',v:src.slice(i+1,e2),q:'u'});i=e2+1}
        else{if(ch==='*'||ch==='?'||ch==='[')glob=true;lit(ch,'u');i++}
      }
      T.push({k:'w',segs:segs,glob:glob,quoted:quoted});
    }
    return T;
  }
  function isKw(t,k){return t&&t.k==='w'&&t.segs.length===1&&t.segs[0].t==='lit'&&t.segs[0].q==='u'&&t.segs[0].v===k}
  function parseTokens(T){
    var p=0;
    function seq(stop){
      var items=[];
      while(p<T.length){
        while(T[p]&&T[p].k==='op'&&T[p].v===';')p++;
        if(p>=T.length)break;
        if(stop&&isKw(T[p],stop))break;
        var pl=pipeline(),op=';',t=T[p];
        if(t&&t.k==='op'&&(t.v===';'||t.v==='&&'||t.v==='||')){op=t.v;p++}
        items.push({pl:pl,op:op});
      }
      return items;
    }
    function pipeline(){
      var cmds=[command()];
      while(T[p]&&T[p].k==='op'&&T[p].v==='|'){p++;cmds.push(command())}
      return cmds;
    }
    function command(){
      if(isKw(T[p],'for')){
        p++;var nm=T[p++];
        if(!nm||nm.k!=='w')throw new Error('syntax error near `for\'');
        if(!isKw(T[p],'in'))throw new Error('syntax error: expected `in\' after for NAME');
        p++;var words=[];
        while(T[p]&&T[p].k==='w'&&!isKw(T[p],'do'))words.push(T[p++]);
        while(T[p]&&T[p].k==='op'&&T[p].v===';')p++;
        if(!isKw(T[p],'do'))throw new Error('syntax error: expected `do\'');
        p++;var body=seq('done');
        if(!isKw(T[p],'done'))throw new Error('syntax error: expected `done\'');
        p++;
        return{t:'for',name:nm.segs.map(function(s){return s.v}).join(''),words:words,body:body,redirs:[]};
      }
      var words=[],redirs=[];
      while(p<T.length){
        var t=T[p];
        if(t.k==='op'){
          if(t.v==='|'||t.v===';'||t.v==='&&'||t.v==='||')break;
          if(t.v==='2>&1'){redirs.push({op:t.v});p++;continue}
          var tgt=T[p+1];if(!tgt||tgt.k!=='w')throw new Error('syntax error near unexpected token `'+t.v+'\'');
          redirs.push({op:t.v,target:tgt});p+=2;continue;
        }
        if(isKw(t,'done')&&words.length===0)break;
        words.push(t);p++;
      }
      return{t:'cmd',words:words,redirs:redirs};
    }
    var items=seq(null);
    if(p<T.length)throw new Error('syntax error near unexpected token `'+(T[p].v||'word')+'\'');
    return items;
  }

  /* expansion */
  function varValue(nm){
    if(nm==='?')return String(st.status);
    if(nm==='HOME')return HOME;if(nm==='USER')return st.root?'root':USER;if(nm==='PWD')return st.cwd;if(nm==='HOSTNAME')return HOST;
    if(nm==='RANDOM')return String(Math.floor(Math.random()*32768));
    if(nm==='$')return '4242';
    return st.vars[nm]!==undefined?String(st.vars[nm]):'';
  }
  function subst(src){ // run a command substitution, return stdout without trailing newlines
    var out='';
    runSeq(parseTokens(tokenize(src)),function(s){out+=s});
    return out.replace(/\n+$/,'');
  }
  function arith(src){
    src=src.replace(/\$\{?([A-Za-z_]\w*)\}?/g,function(_,nm){return varValue(nm)||'0'});
    src=src.replace(/\$\(([^()]*)\)/g,function(_,c){return subst(c)||'0'});
    return evalArith(src,'sh',st.vars).toString();
  }
  function expandWord(w){
    var fields=[''];
    w.segs.forEach(function(sg,idx){
      var text,split=false;
      if(sg.t==='lit'){text=sg.v;if(sg.q==='u'&&idx===0&&text[0]==='~'&&(text.length===1||text[1]==='/'))text=HOME+text.slice(1)}
      else{text=sg.t==='var'?varValue(sg.v):sg.t==='cmd'?subst(sg.v):arith(sg.v);split=sg.q==='u'}
      if(!split){fields[fields.length-1]+=text;return}
      text.split(/[ \t\n]+/).forEach(function(pt,pi){if(pi>0)fields.push('');fields[fields.length-1]+=pt});
    });
    if(!w.quoted)fields=fields.filter(function(f){return f!==''});
    if(w.glob){
      var res=[];
      fields.forEach(function(f){var m=globExpand(f);if(m.length)res=res.concat(m);else res.push(f)});
      fields=res;
    }
    return fields;
  }
  function globExpand(pat){
    if(!/[*?\[]/.test(pat))return[pat];
    var abs=pat[0]==='/',segs=pat.split('/').filter(function(x,i){return x!==''||i===0&&false}),base=abs?'/':st.cwd;
    var cur=[{p:base,d:abs?'/':''}];
    segs.forEach(function(sg,si){
      var next=[];
      cur.forEach(function(c){
        if(!/[*?\[]/.test(sg)){var np=(c.p==='/'?'':c.p)+'/'+sg;if(node(np))next.push({p:np,d:c.d+(c.d&&c.d!=='/'?'/':'')+sg});return}
        var re=new RegExp('^'+sg.replace(/[.+^${}()|\\]/g,'\\$&').replace(/\*/g,'[^/]*').replace(/\?/g,'[^/]')+'$');
        var dn=node(c.p);if(!dn||dn.t!=='d')return;
        children(c.p).forEach(function(nm){if(nm[0]==='.'&&sg[0]!=='.')return;if(re.test(nm))next.push({p:(c.p==='/'?'':c.p)+'/'+nm,d:c.d+(c.d&&c.d!=='/'?'/':'')+nm})});
      });
      cur=next;
    });
    return cur.map(function(c){return c.d}).sort();
  }

  /* execution */
  function errOut(msg){if(!msg)return;st.disp.push(msg.replace(/\n?$/,'\n'))}
  function execCmd(cmd,stdin,isLast,sink){
    var redirIn=null,outTarget=null,errMode=null;
    cmd.redirs.forEach(function(r){
      if(r.op==='2>&1'){errMode={merge:true};return}
      var tgt=expandWord(r.target)[0];
      if(r.op==='<')redirIn=tgt;
      else if(r.op==='>'||r.op==='>>')outTarget={path:tgt,append:r.op==='>>'};
      else errMode={path:tgt,append:r.op==='2>>'};
    });
    var inp=stdin,eDisp='';
    if(redirIn!==null){var rr=readNode(redirIn,'bash');if(rr.err){errOut(rr.err);return{o:'',c:1}}inp=rr.n.c}
    var res;
    if(cmd.t==='for'){
      var vals=[];cmd.words.forEach(function(w){vals=vals.concat(expandWord(w))});
      var buf='';
      for(var i=0;i<vals.length&&i<10000;i++){st.vars[cmd.name]=vals[i];runSeq(cmd.body,function(s){buf+=s},inp)}
      res={o:buf,e:'',c:0};
    }else{
      var argv=[];cmd.words.forEach(function(w){argv=argv.concat(expandWord(w))});
      if(!argv.length){
        // plain assignments: NAME=value
        cmd.words.forEach(function(w){
          var first=w.segs[0];
          if(first&&first.t==='lit'&&/^[A-Za-z_]\w*=/.test(first.v)){
            var nm=first.v.slice(0,first.v.indexOf('=')),rest=first.v.slice(nm.length+1);
            var tmp={segs:[{t:'lit',v:rest,q:first.q}].concat(w.segs.slice(1)),quoted:true};
            st.vars[nm]=expandWord(tmp).join(' ');
          }
        });
        return{o:'',c:0};
      }
      // assignment words before a command are ignored; VAR=value alone handled above
      if(/^[A-Za-z_]\w*=/.test(argv[0])&&argv.length===1){var q=argv[0].indexOf('=');st.vars[argv[0].slice(0,q)]=argv[0].slice(q+1);return{o:'',c:0}}
      var name=argv[0],args=argv.slice(1);
      if(name.indexOf('/')>=0&&(name[0]==='.'||name[0]==='/')&&!C[name])res=runScript(name,name);
      else res=runCommand(name,args,inp);
    }
    if(res.e){
      if(errMode&&errMode.merge)res.o+=res.e.replace(/\n?$/,'\n');
      else if(errMode&&errMode.path){if(errMode.path!=='/dev/null'){var we=writeFile(errMode.path,res.e.replace(/\n?$/,'\n'),errMode.append);if(we)errOut('bash: '+errMode.path+': '+we)}}
      else eDisp=res.e;
    }
    var o=res.o;
    if(outTarget){var w=writeFile(outTarget.path,o,outTarget.append);if(w)errOut('bash: '+outTarget.path+': '+w);o=''}
    st.status=res.c;
    return{o:o,c:res.c,eDisp:eDisp};
  }
  function runSeq(items,sink,stdin){
    var lastStatus=0,prevOp=';';
    for(var k=0;k<items.length;k++){
      var it=items[k];
      if((prevOp==='&&'&&lastStatus!==0)||(prevOp==='||'&&lastStatus===0)){prevOp=it.op;continue}
      var pl=it.pl,data=(k===0&&stdin!==undefined)?stdin:null,r;
      for(var j=0;j<pl.length;j++){
        r=execCmd(pl[j],data,j===pl.length-1,sink);
        data=r.o;
        if(j<pl.length-1)errOut(r.eDisp);
      }
      if(data)sink(data);
      if(r)errOut(r.eDisp);
      lastStatus=r?r.c:0;st.status=lastStatus;
      prevOp=it.op;
    }
    return lastStatus;
  }

  var api={
    run:function(line){
      st.disp=[];st.used=[];
      var text=String(line);
      if(text.trim()==='')return{text:'',clear:false,used:[]};
      st.hist.push(text);
      var clear=/^\s*clear\s*$/.test(text);
      try{
        var items=parseTokens(tokenize(text));
        runSeq(items,function(s){st.disp.push(s)});
      }catch(e){st.disp.push('bash: '+e.message+'\n');st.status=2}
      var out=st.disp.join('');st.disp=[];
      if(out.length>60000)out=out.slice(0,60000)+'\n[output cut off]\n';
      return{text:out,clear:clear,used:st.used.slice()};
    },
    prompt:function(){
      var d=st.cwd===HOME?'~':st.cwd.indexOf(HOME+'/')===0?'~'+st.cwd.slice(HOME.length):st.cwd;
      return(st.root?'root':USER)+'@'+HOST+':'+d+(st.root?'# ':'$ ');
    },
    complete:function(line){
      var m=/(^|[\s|;&<>])([^\s|;&<>]*)$/.exec(line),word=m?m[2]:'',head=line.slice(0,line.length-word.length);
      var first=!/\S/.test(head.replace(/[|;&]\s*$/,''))||/[|;&]\s*$/.test(head);
      var opts=[];
      if(first&&word.indexOf('/')<0){opts=Object.keys(C).filter(function(c){return c.indexOf(word)===0})}
      else{
        var dirPart=word.indexOf('/')>=0?word.slice(0,word.lastIndexOf('/')+1):'',leaf=word.slice(dirPart.length);
        var dir=normalise(dirPart||'.');var dn=node(dir);
        if(dn&&dn.t==='d')opts=children(dir).filter(function(x){return x.indexOf(leaf)===0&&(leaf||x[0]!=='.')}).map(function(x){var nn=node((dir==='/'?'':dir)+'/'+x);return dirPart+x+(nn&&nn.t==='d'?'/':'')});
      }
      return{head:head,word:word,opts:opts.sort()};
    },
    history:function(){return st.hist.slice()},
    reset:resetState,
    state:function(){return st},
    portState:function(hostName,port,src){
      var h=findHost(hostName);if(!h)return 'unknown host';
      var was=st.src;st.src=src||null;
      try{return portStateFor(h,port)}finally{st.src=was}
    },
    readFile:function(p){var n=node(normalise(p));return n&&n.t==='f'?n.c:null},
    mode:function(p){var n=node(normalise(p));return n?n.m:null},
    exists:function(p){return!!node(normalise(p))}
  };
  resetState();
  return api;
}

root.Shell={create:create,sha256:function(s){return hex(sha256b(bytesOf(s)))},md5:function(s){return hex(md5b(bytesOf(s)))},sha1:function(s){return hex(sha1b(bytesOf(s)))},
  hmac256:function(k,m){return hex(hmac(sha256b,bytesOf(k),bytesOf(m)))},evalArith:evalArith,b64:function(s){return b64enc(bytesOf(s))}};
})(typeof window!=='undefined'?window:globalThis);
