import{r as f,j as e}from"./index-CqAF1kLa.js";const m=({label:a,value:s,onChange:o,min:t,max:i,step:d=.01,formatValue:n,className:u=""})=>{const r=f.useId(),l=n?n(s):s.toFixed(2),c=b=>{o(parseFloat(b.target.value))};return e.jsxs("div",{className:`flex flex-col gap-2 ${u}`,children:[e.jsxs("div",{className:"flex items-center justify-between text-sm",children:[e.jsx("label",{htmlFor:r,className:"text-slate-300 font-medium",children:a}),e.jsx("span",{className:"text-brand-500 font-mono font-medium","aria-live":"polite",children:l})]}),e.jsx("input",{id:r,type:"range",min:t,max:i,step:d,value:s,onChange:c,"aria-label":a,"aria-valuemin":t,"aria-valuemax":i,"aria-valuenow":s,"aria-valuetext":l,className:`w-full h-2 bg-surface-3 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-brand-500 [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:shadow-md
          focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2
          focus-visible:ring-offset-surface-1`}),e.jsxs("div",{className:"flex justify-between text-xs text-slate-500",children:[e.jsx("span",{children:t}),e.jsx("span",{children:i})]})]})};export{m as S};
