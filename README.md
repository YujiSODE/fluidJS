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

Moore neighborhood: *c*<sub>0</sub> to *c*<sub>8</sub>  
`[c1|c2|c3]`  
`[c4|c0|c5]`  
`[c6|c7|c8]`

*C*<sub>0<sub>*t* = *t*0+1</sub></sub> = *C*<sub>0<sub>*t* = *t*0</sub></sub>+*p*\*∑\(*dC*+*Ex*\);  
*C*<sub>0<sub>*t* = *t*0+1</sub></sub> ≃ *γ*0, while *p* = 1\/8 = 0.125.  
 - *γ*0 = *C*<sub>0<sub>*t* = *t*0+1</sub></sub> and *Ex* = 0, when *C*<sub>0<sub>*t* = *t*0+1</sub></sub> = \[0,9\]  
 - *γ*0 = 0 and *Ex* = 0, when *C*<sub>0<sub>*t* = *t*0+1</sub></sub>\ < 0  
 - *γ*0 = 9 and *Ex* = *C*<sub>0<sub>*t* = *t*0+1</sub></sub>-9, when *C*<sub>0<sub>*t* = *t*0+1</sub></sub>\>9
 
*dH*: height difference; *dH* = *H<sub>i</sub>* - *H*<sub>0</sub>.  
 - *dC<sub>i</sub>* = *C<sub>i</sub>* \> 0\?+1:0; when *dH* \> 0  
 - *dC<sub>i</sub>* = *C*<sub>0</sub> \> 0\?-1:0; when *dH* \< 0  
 - when *dH* = 0,
   - *dC<sub>i</sub>* = +1 when *C<sub>i</sub>* - *C*<sub>0</sub> \> 0  
   - *dC<sub>i</sub>* = -1 when *C<sub>i</sub>* - *C*<sub>0</sub> \< 0  
   - *dC<sub>i</sub>* = 0 when *C<sub>i</sub>* - *C*<sub>0</sub> = 0

