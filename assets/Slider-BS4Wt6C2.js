import{r as g,j as e}from"./index-DFdBOsRC.js";const f=({label:i,value:s,onChange:x,min:a,max:n,step:p=.01,formatValue:o,hint:t,explanation:l,className:b=""})=>{const r=g.useId(),d=o?o(s):s.toFixed(2),c=(s-a)/(n-a)*100,u=h=>{x(parseFloat(h.target.value))};return e.jsxs("div",{className:`flex flex-col gap-2 ${b}`,children:[e.jsx("style",{children:`
        #${CSS.escape(r)}::-webkit-slider-thumb {
          background: linear-gradient(135deg, #a78bfa, #7c3aed);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.2), 0 2px 4px rgba(0,0,0,0.4);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
          transition: box-shadow 150ms ease;
        }
        #${CSS.escape(r)}::-webkit-slider-thumb:hover {
          box-shadow: 0 0 0 5px rgba(124,58,237,0.25), 0 2px 6px rgba(0,0,0,0.5);
        }
        #${CSS.escape(r)}::-moz-range-thumb {
          background: linear-gradient(135deg, #a78bfa, #7c3aed);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.2), 0 2px 4px rgba(0,0,0,0.4);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
        }
      `}),e.jsxs("div",{className:"flex items-center justify-between text-sm",children:[e.jsx("label",{htmlFor:r,className:"text-ink-1 font-medium",children:i}),e.jsx("span",{className:"text-cyan-400 font-mono font-medium tabular-nums","aria-live":"polite",children:d})]}),e.jsx("input",{id:r,type:"range",min:a,max:n,step:p,value:s,onChange:u,"aria-label":i,"aria-valuemin":a,"aria-valuemax":n,"aria-valuenow":s,"aria-valuetext":d,className:`w-full h-2 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:cursor-pointer
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-violet-500
          focus-visible:ring-offset-2
          focus-visible:ring-offset-surface-1`,style:{background:`linear-gradient(to right, #7c3aed ${c}%, #1a2235 ${c}%)`}}),e.jsx("div",{className:"flex justify-between text-xs text-ink-3",children:t?e.jsxs(e.Fragment,{children:[e.jsxs("span",{children:["← ",t.left]}),e.jsxs("span",{children:[t.right," →"]})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{children:a}),e.jsx("span",{children:n})]})}),l&&e.jsx("p",{className:"text-ink-2 text-xs italic mt-1",children:l})]})};export{f as S};
