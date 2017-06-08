# fluidJS
This is Web Worker interface for Cellular Automaton. Fluid simulation interface for "[txtCell](https://github.com/YujiSODE/txtCell)".  
https://github.com/YujiSODE/fluidJS  
[wiki of "txtCell"](https://github.com/YujiSODE/txtCell/wiki)

>Copyright (c) 2017 Yuji SODE \<yuji.sode@gmail.com\>  
>This software is released under the MIT License.  
>See LICENSE or http://opensource.org/licenses/mit-license.php
______

### Scripts
- `fluidJS.js`: Web Worker interfaces for Fluid simulation with "txtCell".

Fluid is simulated with cells of value 0 to 9.  
Additional map can be used as height map.  
Simulated fluid flows into cells with relatively less value.  
Simulated fluid flows into cells where is relatively low in height.

### Rule of "Fluid simulation"


*C*<sub>0<sub>*t*=*t*0+1</sub></sub>=*C*<sub>0<sub>*t*=*t*0</sub></sub>+*p*\*∑\(*dC*+*Ex*\); *C*<sub>0<sub>*t*=*t*0+1</sub></sub>≃*γ*0, while *p*=1\/8=0.125.  
 - *γ*0=*C*<sub>0<sub>*t*=*t*0+1</sub></sub> and *Ex*=0, when *C*<sub>0<sub>*t*=*t*0+1</sub></sub>=\[0,9\]  
 - *γ*0=0 and *Ex*=0, when *C*<sub>0<sub>*t*=*t*0+1</sub></sub>\<0  
 - *γ*0=9 and *Ex*=*C*<sub>0<sub>*t*=*t*0+1</sub></sub>-9, when *C*<sub>0<sub>*t*=*t*0+1</sub></sub>\>9  
---  
dH: height difference; dH = Hi-H0.  
2-1) dCi = (Ci>0)?+1:0; when dH > 0  
2-2) dCi = (C0>0)?-1:0; when dH < 0  
2-3) when dH = 0,  
  2-3-1) dCi = +1 when Ci-C0 > 0  
  2-3-2) dCi = -1 when Ci-C0 < 0  
  2-3-3) dCi = 0 when Ci-C0 = 0  
