/*fluidJS.js
*
*    Copyright (c) 2017 Yuji SODE <yuji.sode@gmail.com>
*
*    This software is released under the MIT License.
*    See LICENSE or http://opensource.org/licenses/mit-license.php
*/
//============================================================================
//This is Web Worker interface for Cellular Automaton.
/*Fluid simulation interface for "txtCell".
* txtCell (Yuji SODE,2017): the MIT License; https://github.com/YujiSODE/txtCell
*/
//Fluid is simulated with cells of value 0 to 9.
//Additional map can be used as height map.
/*
* <rule of "Fluid simulation">
* C0(t=t0+1) = C0(t=t0)+p*∑(dC+Ex); C0(t = t0+1) ≃ γ0, while p = 1/8=0.125.
* ---
* 1-1) γ0 = C0(t=t0+1) and Ex = 0, when C0(t = t0+1) = [0,9]
* 1-2) γ0 = 0 and Ex = 0, when C0(t = t0+1) < 0
* 1-3) γ0 = 9 and Ex = C0(t=t0+1)-9, when C0(t = t0+1) > 9
* ---
* dH: height difference; dH = Hi-H0.
* 2-1) dCi = (Ci>0)?+1:0; when dH > 0
* 2-2) dCi = (C0>0)?-1:0; when dH < 0
* 2-3) when dH = 0,
*   2-3-1) dCi = +1 when Ci-C0 > 0
*   2-3-2) dCi = -1 when Ci-C0 < 0
*   2-3-3) dCi = 0 when Ci-C0 = 0
*/
var slf=this,
    /*Moore neighborhood: c.c0 to c.c8*/
    c={c0:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,c7:0,c8:0},
    /*1/8 = 0.125*/prob=0.125,
    /*dH: height differrence*/dH=0,
    /*ex: values that exceeds 9*/ex=[];
//=== message event ===
slf.addEventListener('message',function(e){
  //e.data='xxx...x@xxx...x@...'; x is integer between 0 to 9
  //d1 and d2: map1 and map2
  var d1=e.data[0].split(/@/),d2=!e.data[1]?undefined:e.data[1].split(/@/),
      P=[],H=0,W=0,Y=0,X=0,i=0,j=0,s=0;
  W=d1[0].length,H=d1.length;
  if(!(ex[0]!=undefined)){
    while(i<H){
      ex[i]=[],j=0;
      while(j<W){
        ex[i][j]=0;
        j+=1;
      }
      i+=1;
    }
  }
  while(Y<H){
    X=0,P[Y]='';
    while(X<W){
      /*=== Moore neighborhood: c.c0 to c.c8 ===
      * [c1|c2|c3]
      * [c4|c0|c5]
      * [c6|c7|c8]
      */
      c.c0=+d1[Y][X];
      c.c1=(Y!=0&&X!=0)?+d1[Y-1][X-1]:0;
      c.c2=(Y!=0)?+d1[Y-1][X]:0;
      c.c3=(Y!=0&&X!=W-1)?+d1[Y-1][X+1]:0;
      c.c4=(X!=0)?+d1[Y][X-1]:0;
      c.c5=(X!=W-1)?+d1[Y][X+1]:0;
      c.c6=(Y!=H-1&&X!=0)?+d1[Y+1][X-1]:0;
      c.c7=(Y!=H-1)?+d1[Y+1][X]:0;
      c.c8=(Y!=H-1&&X!=W-1)?+d1[Y+1][X+1]:0;
        //=== fluid simulation ===
      //!! :::::deltaH=0:::::
      i=1,s=0,dH=0;
      //sum of c
      if(!d2){
        //================== <without additional map: d2> ==================
        while(i<9){
          s+=prob*((c['c'+i]-c.c0)>0?1:((c['c'+i]-c.c0)<0?-1:0)),i+=1;
                }
        //================== </without additional map: d2> ==================
      }else{
        //================== <with additional map: d2> ==================
        //dH: height differrence
        /*--- dH1 ---*/
        if(Y!=0&&X!=0){
          dH=+d2[Y-1][X-1]-d2[Y][X];
          if(dH>0){/*dH>0*/s+=prob*(+d2[Y-1][X-1]>0?1:0);}else if(dH<0){/*dH<0*/s+=prob*(+d2[Y][X]>0?-1:0);}else{/*dH=0*/s+=prob*((c.c1-c.c0)>0?1:((c.c1-c.c0)<0?-1:0));}
        }else{s+=(-prob);}
        /*--- dH2 ---*/
        if(Y!=0){
          dH=+d2[Y-1][X]-d2[Y][X];
          if(dH>0){/*dH>0*/s+=prob*(+d2[Y-1][X]>0?1:0);}else if(dH<0){/*dH<0*/s+=prob*(+d2[Y][X]>0?-1:0);}else{/*dH=0*/s+=prob*((c.c1-c.c0)>0?1:((c.c1-c.c0)<0?-1:0));}
        }else{s+=(-prob);}
        /*--- dH3 ---*/
        if(Y!=0&&X!=W-1){
          if(dH>0){/*dH>0*/s+=prob*(+d2[Y-1][X+1]>0?1:0);}else if(dH<0){/*dH<0*/s+=prob*(+d2[Y][X]>0?-1:0);}else{/*dH=0*/s+=prob*((c.c1-c.c0)>0?1:((c.c1-c.c0)<0?-1:0));}
        }else{s+=(-prob);}
        /*--- dH4 ---*/
        if(X!=0){
          if(dH>0){/*dH>0*/s+=prob*(+d2[Y][X-1]>0?1:0);}else if(dH<0){/*dH<0*/s+=prob*(+d2[Y][X]>0?-1:0);}else{/*dH=0*/s+=prob*((c.c1-c.c0)>0?1:((c.c1-c.c0)<0?-1:0));}
        }else{s+=(-prob);}
        /*--- dH5 ---*/
        if(X!=W-1){
          if(dH>0){/*dH>0*/s+=prob*(+d2[Y][X+1]>0?1:0);}else if(dH<0){/*dH<0*/s+=prob*(+d2[Y][X]>0?-1:0);}else{/*dH=0*/s+=prob*((c.c1-c.c0)>0?1:((c.c1-c.c0)<0?-1:0));}
        }else{s+=(-prob);}
        /*--- dH6 ---*/
        if(Y!=H-1&&X!=0){
          if(dH>0){/*dH>0*/s+=prob*(+d2[Y+1][X-1]>0?1:0);}else if(dH<0){/*dH<0*/s+=prob*(+d2[Y][X]>0?-1:0);}else{/*dH=0*/s+=prob*((c.c1-c.c0)>0?1:((c.c1-c.c0)<0?-1:0));}
        }else{s+=(-prob);}
        /*--- dH7 ---*/
        if(Y!=H-1){
          if(dH>0){/*dH>0*/s+=prob*(+d2[Y+1][X]>0?1:0);}else if(dH<0){/*dH<0*/s+=prob*(+d2[Y][X]>0?-1:0);}else{/*dH=0*/s+=prob*((c.c1-c.c0)>0?1:((c.c1-c.c0)<0?-1:0));}
        }else{s+=(-prob);}
        /*--- dH8 ---*/
        if(Y!=H-1&&X!=W-1){
          if(dH>0){/*dH>0*/s+=prob*(+d2[Y+1][X+1]>0?1:0);}else if(dH<0){/*dH<0*/s+=prob*(+d2[Y][X]>0?-1:0);}else{/*dH=0*/s+=prob*((c.c1-c.c0)>0?1:((c.c1-c.c0)<0?-1:0));}
        }else{s+=(-prob);}
        //================== </with additional map: d2> ==================
      }
      //sum of ex
      /*ex0*/s+=prob*(+ex[Y][X]);
      /*ex1*/s+=prob*((Y!=0&&X!=0)?+ex[Y-1][X-1]:0);
      /*ex2*/s+=prob*((Y!=0)?+ex[Y-1][X]:0);
      /*ex3*/s+=prob*((Y!=0&&X!=W-1)?+ex[Y-1][X+1]:0);
      /*ex4*/s+=prob*((X!=0)?+ex[Y][X-1]:0);
      /*ex5*/s+=prob*((X!=W-1)?+ex[Y][X+1]:0);
      /*ex6*/s+=prob*((Y!=H-1&&X!=0)?+ex[Y+1][X-1]:0);
      /*ex7*/s+=prob*((Y!=H-1)?+ex[Y+1][X]:0);
      /*ex8*/s+=prob*((Y!=H-1&&X!=W-1)?+d1[Y+1][X+1]:0);
      if((c.c0+s)>9){
        //c.c0(t=t0+1) is more than 9
        P[Y]+=9;
        ex[Y][X]=c.c0+s-9;
      }else{
        //c.c0(t=t0+1) is not more than 9
        P[Y]+=(c.c0+s)<0?0:Math.round(c.c0+s);
        ex[Y][X]=0;
        }
      X+=1;
    }
    Y+=1;
  }
  slf.postMessage(P.join('@'));
  d1=d2=P=H=W=Y=X=i=s=null;
},true);
