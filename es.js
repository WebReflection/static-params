self.staticParams=function(t){"use strict";const e=new WeakMap,n=(t,...n)=>{const{t:s,v:r}=a(t,n),c=e.get(t)||e.set(t,{}).get(t);return(c[s]||(c[s]=[s])).concat(r.map(t=>n[t]))},a=(t,e)=>{const n=[t[0]],a=[];for(let r=0,c=0,o=0,{length:u}=e;c<u;c++)e[c]instanceof s?n[r]+=e[c].v+t[c+1]:(a[o++]=c,n[++r]=t[c+1]);return{t:n,v:a}};function s(t){this.v=t}return t.asParams=n,t.asStatic=t=>new s(t),t.asTag=t=>function(){return t.apply(this,n.apply(null,arguments))},Object.defineProperty(t,"__esModule",{value:!0}),t}({});
