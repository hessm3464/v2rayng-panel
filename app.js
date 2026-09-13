const $=x=>document.getElementById(x);let current="";
function go(id){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));$(id).classList.add("active");if(id==="saved")render()}
$("theme").onclick=()=>document.body.classList.toggle("light");
function enc(x){return encodeURIComponent(x)}
function build(){let o={name:$("name").value.trim(),protocol:$("protocol").value,host:$("host").value.trim(),port:$("port").value,id:$("id").value.trim(),sni:$("sni").value.trim(),network:$("network").value,security:$("security").value,path:$("path").value||"/",service:$("service").value};
if(!o.host||!o.id)return alert("آدرس سرور و UUID/Password را وارد کن.");
if(o.protocol==="VMess"){let v={v:"2",ps:o.name||"VMess",add:o.host,port:String(o.port),id:o.id,aid:"0",scy:"auto",net:o.network,type:"none",host:o.sni,path:o.path,tls:o.security==="tls"?"tls":""};current="vmess://"+btoa(unescape(encodeURIComponent(JSON.stringify(v))))}
else if(o.protocol==="VLESS"){let q=new URLSearchParams({type:o.network,security:o.security});if(o.security==="tls")q.set("sni",o.sni||o.host);if(o.network==="ws"){q.set("path",o.path);q.set("host",o.sni||o.host)}if(o.network==="grpc")q.set("serviceName",o.service||"grpc");current=`vless://${enc(o.id)}@${o.host}:${o.port}?${q}#${enc(o.name||"VLESS")}`}
else{let q=new URLSearchParams({security:o.security});if(o.security==="tls")q.set("sni",o.sni||o.host);current=`trojan://${enc(o.id)}@${o.host}:${o.port}?${q}#${enc(o.name||"Trojan")}`}
$("out").value=current;return current}
$("make").onclick=build;
$("copy").onclick=async()=>{if(!current)build();if(current){await navigator.clipboard.writeText(current);alert("لینک کپی شد.")}};
$("save").onclick=()=>{let l=current||build();if(!l)return;let a=JSON.parse(localStorage.vng||"[]");a.push({name:$("name").value||"بدون نام",protocol:$("protocol").value,host:$("host").value,port:$("port").value,link:l});localStorage.vng=JSON.stringify(a);render();alert("ذخیره شد.")};
$("clear").onclick=()=>{["name","host","id","sni","service"].forEach(x=>$(x).value="");$("out").value="";current=""};
function render(){let a=JSON.parse(localStorage.vng||"[]");$("count").textContent=a.length;$("list").innerHTML=a.length?a.map((x,i)=>`<div class="item"><div><b>${safe(x.name)}</b><div class="muted">${safe(x.protocol)} • ${safe(x.host)}:${safe(x.port)}</div></div><div><button onclick="cp(${i})">کپی</button><button class="danger" onclick="rm(${i})">حذف</button></div></div>`).join(""):"<p class='muted'>کانفیگی ذخیره نشده است.</p>"}
function safe(x){return String(x).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
window.cp=async i=>{let a=JSON.parse(localStorage.vng||"[]");await navigator.clipboard.writeText(a[i].link);alert("کپی شد.")};
window.rm=i=>{let a=JSON.parse(localStorage.vng||"[]");a.splice(i,1);localStorage.vng=JSON.stringify(a);render()};render();