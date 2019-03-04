!function(t,i){if("object"==typeof exports&&"object"==typeof module)module.exports=i(require("babylonjs"));else if("function"==typeof define&&define.amd)define(["babylonjs"],i);else{var h="object"==typeof exports?i(require("babylonjs")):i(t.BABYLON);for(var s in h)("object"==typeof exports?exports:t)[s]=h[s]}}(window,function(t){return function(t){var i={};function h(s){if(i[s])return i[s].exports;var n=i[s]={i:s,l:!1,exports:{}};return t[s].call(n.exports,n,n.exports,h),n.l=!0,n.exports}return h.m=t,h.c=i,h.d=function(t,i,s){h.o(t,i)||Object.defineProperty(t,i,{enumerable:!0,get:s})},h.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"h",{value:!0})},h.t=function(t,i){if(1&i&&(t=h(t)),8&i)return t;if(4&i&&"object"==typeof t&&t&&t.h)return t;var s=Object.create(null);if(h.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&i&&"string"!=typeof t)for(var n in t)h.d(s,n,function(i){return t[i]}.bind(null,n));return s},h.n=function(t){var i=t&&t.h?function(){return t.default}:function(){return t};return h.d(i,"a",i),i},h.o=function(t,i){return Object.prototype.hasOwnProperty.call(t,i)},h.p="",h(h.s=1)}([function(i,h){i.exports=t},function(t,i,h){"use strict";h.r(i),h.d(i,"EditControl",function(){return u});var s,n=h(0);!function(t){t[t.TRANS=0]="TRANS",t[t.ROT=1]="ROT",t[t.SCALE=2]="SCALE"}(s||(s={}));var u=function(){function t(t,i,h,s,u,e){var f=this;this.u=!0,this.v=!1,this.M=!1,this.A=1,this.L=Math.PI/18,this.j=.4,this.C=1,this.O=.02,this.S=.75,this.g=new n.Matrix,this.R=new n.Vector3(0,0,0),this.T=2,this.k=new n.Vector3(0,0,0),this.q=new n.Vector3(0,0,0),this._="",this.N=!1,this.P=null,this.B=null,this.D=null,this.F=!1,this.G=!1,this.H=!1,this.I=!1,this.J=new n.Vector3(0,0,0),this.K=new n.Vector3(0,0,0),this.U=!1,this.V=new n.Vector3(0,0,0),this.W=.25,this.$=new n.Vector3(0,0,0),this.tt=new n.Vector3(0,0,0),this.it=new n.Vector3(0,0,0),this.ht=new n.Vector3(0,0,0),this.st=!1,this.nt=0,this.ut=!1,this.rt=!1,this.et=!1,this.ft=180,this.ot=new n.Vector3(this.A,this.A,this.A),this.lt=new n.Vector3(0,0,0),this.at=new n.Vector3(0,0,0),this.ct=new n.Vector3(0,0,0),this.vt=new n.Matrix,this.Mt=t,this.wt=i,this.Xt=h,null!=s&&(this.C=s),this.st=null!==u&&u,this.Yt(),null!=e&&(this.O=e),this.Zt=t.getScene(),this.bt=new r(t,10),t.computeWorldMatrix(!0),this.dt=this.pt(t),this.yt(t),this.At=new n.Mesh("EditControl",this.Zt),this.At.rotationQuaternion=n.Quaternion.Identity(),this.At.visibility=0,this.At.isPickable=!1,this.Lt(this.Zt),this.jt().parent=this.At,this.xt().parent=this.At,this.zt=function(t){return f.Et(t)},this.Ct=function(t){return f.Ot(t)},this.St=function(t){return f.gt(t)},h.addEventListener("pointerdown",this.zt,!1),h.addEventListener("pointerup",this.Ct,!1),h.addEventListener("pointermove",this.St,!1),this.Rt=function(){return f.Tt()},this.Zt.registerBeforeRender(this.Rt)}return t.prototype.Yt=function(){if(!this.st&&(null==this.Mt.rotationQuaternion||null==this.Mt.rotationQuaternion))throw"Error: Eulerian is set to false but the mesh's rotationQuaternion is not set."},t.prototype.Tt=function(){this.At.position=this.Mt.getAbsolutePivotPoint(),this.kt(),this.qt(),this.u?(this.At.getWorldMatrix().invertToRef(this.g),n.Vector3.TransformCoordinatesToRef(this.wt.position,this.g,this.R),this._t.lookAt(this.R,0,0,0,n.Space.LOCAL)):(this.wt.position.subtractToRef(this.At.position,this.R),this._t.lookAt(this.wt.position,0,0,0,n.Space.WORLD)),this.rt?this.Nt():this.ut?this.Pt(this.Qt,this.Bt,this.Dt):this.et&&this.Pt(this.Ft,this.Gt,this.Ht)},t.prototype.kt=function(){if(this.u)if(null==this.Mt.parent)if(this.st){var t=this.Mt.rotation;n.Quaternion.RotationYawPitchRollToRef(t.y,t.x,t.z,this.At.rotationQuaternion)}else this.At.rotationQuaternion.copyFrom(this.Mt.rotationQuaternion);else{if(this.It(this.Mt))return;this.Mt.getWorldMatrix().getRotationMatrixToRef(this.vt),n.Quaternion.FromRotationMatrixToRef(this.vt,this.At.rotationQuaternion)}},t.prototype.It=function(t){if(null==t.parent)return!1;for(;null!=t.parent;){if(t.parent.scaling.x!=t.parent.scaling.y||t.parent.scaling.y!=t.parent.scaling.z)return!0;t=t.parent}return!1},t.prototype.qt=function(){this.At.position.subtractToRef(this.wt.position,this.k),n.Vector3.FromFloatArrayToRef(this.wt.getWorldMatrix().asArray(),8,this.q);var t=n.Vector3.Dot(this.k,this.q)/this.q.length(),i=Math.abs(t/this.T);n.Vector3.FromFloatsToRef(i,i,i,this.At.scaling)},t.prototype.Nt=function(){var t=Math.atan(this.R.y/this.R.z);this.R.z>=0?this.Jt.rotation.x=-t:this.Jt.rotation.x=-t-Math.PI;var i=Math.atan(this.R.x/this.R.z);this.R.z>=0?this.Kt.rotation.y=i:this.Kt.rotation.y=i+Math.PI;var h=Math.atan(this.R.x/this.R.y);this.R.y>=0?this.Ut.rotation.z=-h:this.Ut.rotation.z=-h-Math.PI},t.prototype.Pt=function(t,i,h){var s=this.R;t.rotation.x=0,t.rotation.y=0,t.rotation.z=0,i.rotation.x=0,i.rotation.y=0,i.rotation.z=0,h.rotation.x=0,h.rotation.y=0,h.rotation.z=0,s.x<=0&&s.y>=0&&s.z>=0?(t.rotation.z=3.14,h.rotation.y=3.14):s.x<=0&&s.y>=0&&s.z<=0?(t.rotation.y=3.14,i.rotation.y=3.14,h.rotation.y=3.14):s.x>=0&&s.y>=0&&s.z<=0?(t.rotation.x=3.14,i.rotation.y=3.14):s.x>=0&&s.y<=0&&s.z>=0?(i.rotation.z=3.14,h.rotation.x=3.14):s.x<=0&&s.y<=0&&s.z>=0?(t.rotation.z=3.14,i.rotation.z=3.14,h.rotation.z=3.14):s.x<=0&&s.y<=0&&s.z<=0?(t.rotation.y=3.14,i.rotation.x=3.14,h.rotation.z=3.14):s.x>=0&&s.y<=0&&s.z<=0&&(t.rotation.x=3.14,i.rotation.x=3.14,h.rotation.x=3.14)},t.prototype.switchTo=function(t,i){t.computeWorldMatrix(!0),this.Mt=t,null!=i&&(this.st=i),this.Yt(),this.yt(t),this.bt=new r(t,10),this.refreshBoundingInfo()},t.prototype.setUndoCount=function(t){this.bt.setCapacity(t)},t.prototype.undo=function(){var t=this.bt.undo();this.Mt.computeWorldMatrix(!0),this.yt(this.Mt),this.Vt(t),this.Wt(t),this.$t(t)},t.prototype.redo=function(){var t=this.bt.redo();this.Mt.computeWorldMatrix(!0),this.yt(this.Mt),this.Vt(t),this.Wt(t),this.$t(t)},t.prototype.detach=function(){this.Xt.removeEventListener("pointerdown",this.zt,!1),this.Xt.removeEventListener("pointerup",this.Ct,!1),this.Xt.removeEventListener("pointermove",this.St,!1),this.Zt.unregisterBeforeRender(this.Rt),this.removeAllActionListeners(),this.ti()},t.prototype.hide=function(){this.N=!0,this.ut?(this._="T",this.disableTranslation()):this.rt?(this._="R",this.disableRotation()):this.et&&(this._="S",this.disableScaling()),this.ii()},t.prototype.ii=function(){this.hi.visibility=0,this.si.visibility=0,this.ni.visibility=0},t.prototype.ui=function(){this.hi.visibility=this.S,this.si.visibility=this.S,this.ni.visibility=this.S},t.prototype.show=function(){this.N=!1,this.ui(),"T"==this._?this.enableTranslation():"R"==this._?this.enableRotation():"S"==this._&&this.enableScaling()},t.prototype.isHidden=function(){return this.N},t.prototype.ti=function(){this.At.dispose(),this.ri(),this.bt=null},t.prototype.addActionListener=function(t){this.P=t},t.prototype.removeActionListener=function(){this.P=null},t.prototype.addActionStartListener=function(t){this.B=t},t.prototype.removeActionStartListener=function(){this.B=null},t.prototype.addActionEndListener=function(t){this.D=t},t.prototype.removeActionEndListener=function(){this.D=null},t.prototype.removeAllActionListeners=function(){this.P=null,this.B=null,this.D=null},t.prototype.Et=function(t){var i=this;if(t.preventDefault(),this.F=!0,0==t.button){var h=this.Zt.pick(this.Zt.pointerX,this.Zt.pointerY,function(t){if(i.ut){if(t==i.ei||t==i.fi||t==i.oi||t==i.Qt||t==i.Bt||t==i.Dt||t==i.li)return!0}else if(i.rt){if(t==i.Jt||t==i.Kt||t==i.Ut||t==i.ai)return!0}else if(i.et&&(t==i.ci||t==i.vi||t==i.Mi||t==i.Ft||t==i.Gt||t==i.Ht||t==i.wi))return!0;return!1},null,this.wt);if(h.hit){this.Xi=h.pickedMesh;var s=this.Xi.getChildren();s.length>0?s[0].visibility=this.S:this.Xi.visibility=this.S;var n=this.Xi.name;"X"==n?this.Yi.visibility=1:"Y"==n?this.Zi.visibility=1:"Z"==n?this.bi.visibility=1:"XZ"==n?(this.Yi.visibility=1,this.bi.visibility=1):"ZY"==n?(this.bi.visibility=1,this.Zi.visibility=1):"YX"==n?(this.Zi.visibility=1,this.Yi.visibility=1):"ALL"==n&&(this.Yi.visibility=1,this.Zi.visibility=1,this.bi.visibility=1),this.di(!0),this.pi=this.yi(this.Xi),null!=this.pi?this.Ai=this.Li():this.Ai=null,window.setTimeout(function(t,h){return i.ji(t,h)},0,this.wt,this.Xt)}}},t.prototype.di=function(t){this.H=t,t?(this.xi(),this.mi==s.ROT&&(this.nt=0),this.Vt(this.mi)):this.$t(this.mi)},t.prototype.isEditing=function(){return this.H},t.prototype.ji=function(t,i){var h=i;t.detachControl(h)},t.prototype.isPointerOver=function(){return this.G},t.prototype.zi=function(){var t=this,i=this.Zt.pick(this.Zt.pointerX,this.Zt.pointerY,function(i){if(t.ut){if(i==t.ei||i==t.fi||i==t.oi||i==t.Qt||i==t.Bt||i==t.Dt||i==t.li)return!0}else if(t.rt){if(i==t.Jt||i==t.Kt||i==t.Ut||i==t.ai)return!0}else if(t.et&&(i==t.ci||i==t.vi||i==t.Mi||i==t.Ft||i==t.Gt||i==t.Ht||i==t.wi))return!0;return!1},null,this.wt);if(i.hit){if(i.pickedMesh!=this.Ei){if(this.G=!0,this.Ci(),this.Ei=i.pickedMesh,this.rt)this.Oi=this.Ei.getChildren()[0].color,this.Ei.getChildren()[0].color=n.Color3.White();else{var h=this.Ei.getChildren();h.length>0?(this.Si=h[0].material,h[0].material=this.gi):(this.Si=this.Ei.material,this.Ei.material=this.gi)}"X"==this.Ei.name?this.hi.color=n.Color3.White():"Y"==this.Ei.name?this.si.color=n.Color3.White():"Z"==this.Ei.name&&(this.ni.color=n.Color3.White())}}else this.G=!1,null!=this.Ei&&(this.Ri(this.Ei),this.Ei=null)},t.prototype.Ci=function(){null!=this.Ei&&(this.Ei.visibility=0,this.Ri(this.Ei))},t.prototype.Ri=function(t){switch(t.name){case"X":this.hi.color=n.Color3.Red();break;case"Y":this.si.color=n.Color3.Green();break;case"Z":this.ni.color=n.Color3.Blue()}if(this.rt)t.getChildren()[0].color=this.Oi;else{var i=t.getChildren();i.length>0?i[0].material=this.Si:t.material=this.Si}},t.prototype.Ot=function(t){this.F=!1,this.H&&(this.wt.attachControl(this.Xt),this.di(!1),this.Ti(),null!=this.Ei&&(this.Ri(this.Ei),this.Ei=null),this.bt.add(this.mi))},t.prototype.xi=function(){this.ut?this.mi=s.TRANS:this.rt?this.mi=s.ROT:this.et&&(this.mi=s.SCALE)},t.prototype.Wt=function(t){null!=this.P&&this.P(t)},t.prototype.Vt=function(t){null!=this.B&&this.B(t)},t.prototype.$t=function(t){null!=this.D&&this.D(t)},t.prototype.gt=function(t){if(this.F){if(this.H&&null!=this.Ai){var i=this.Li();if(null!=i){if(this.rt)this.ki(this.Mt,this.Xi,i,this.Ai);else{var h=i.subtract(this.Ai);if(0==h.x&&0==h.y&&0==h.z)return;this.ut?this.qi(h):this.et&&this.u&&this._i(h)}this.Ai=i,this.Wt(this.mi)}}}else this.zi()},t.prototype.yi=function(t){var i=t.name;if(this.ut||this.et){if("XZ"==i)return this.Ni;if("ZY"==i)return this.Pi;if("YX"==i)return this.Qi;if("ALL"==i)return this._t;this.At.getWorldMatrix().invertToRef(this.g),n.Vector3.TransformCoordinatesToRef(this.wt.position,this.g,this.R);var h=this.R;if("X"===i)return Math.abs(h.y)>Math.abs(h.z)?this.Ni:this.Qi;if("Z"===i)return Math.abs(h.y)>Math.abs(h.x)?this.Ni:this.Pi;if("Y"===i)return Math.abs(h.z)>Math.abs(h.x)?this.Qi:this.Pi}else{if(!this.rt)return null;this.I=!1,this.At.getWorldMatrix().invertToRef(this.g),n.Vector3.TransformCoordinatesToRef(this.wt.position,this.g,this.R);h=this.R;switch(i){case"X":return Math.abs(h.x)<.2?(this.I=!0,this._t):this.Pi;case"Y":return Math.abs(h.y)<.2?(this.I=!0,this._t):this.Ni;case"Z":return Math.abs(h.z)<.2?(this.I=!0,this._t):this.Qi;default:return this._t}}},t.prototype.qi=function(t){null!=this.Mt.parent&&this.It(this.Mt)?this.yt(this.At):this.yt(this.Mt);var i=this.Xi.name;"ALL"==i?this.J=t:(this.J.x=0,this.J.y=0,this.J.z=0,"X"!=i&&"XZ"!=i&&"YX"!=i||(this.u?this.J.x=n.Vector3.Dot(t,this.tt)/this.tt.length():this.J.x=t.x),"Y"!=i&&"ZY"!=i&&"YX"!=i||(this.u?this.J.y=n.Vector3.Dot(t,this.it)/this.it.length():this.J.y=t.y),"Z"!=i&&"XZ"!=i&&"ZY"!=i||(this.u?this.J.z=n.Vector3.Dot(t,this.ht)/this.ht.length():this.J.z=t.z)),this.Bi(this.Mt,this.J,this.u),this.Di&&(this.Mt.position.x=Math.max(this.Mt.position.x,this.Di.x),this.Mt.position.y=Math.max(this.Mt.position.y,this.Di.y),this.Mt.position.z=Math.max(this.Mt.position.z,this.Di.z)),this.Fi&&(this.Mt.position.x=Math.min(this.Mt.position.x,this.Fi.x),this.Mt.position.y=Math.min(this.Mt.position.y,this.Fi.y),this.Mt.position.z=Math.min(this.Mt.position.z,this.Fi.z)),this.Mt.computeWorldMatrix(!0)},t.prototype.Bi=function(t,i,h){if(this.v){var s=!1;if(this.K.addInPlace(i),Math.abs(this.K.x)>this.ot.x&&(this.K.x>0?i.x=this.ot.x:i.x=-this.ot.x,s=!0),Math.abs(this.K.y)>this.ot.y&&(this.K.y>0?i.y=this.ot.y:i.y=-this.ot.y,s=!0),Math.abs(this.K.z)>this.ot.z&&(this.K.z>0?i.z=this.ot.z:i.z=-this.ot.z,s=!0),!s)return;Math.abs(i.x)!==this.ot.x&&(i.x=0),Math.abs(i.y)!==this.ot.y&&(i.y=0),Math.abs(i.z)!==this.ot.z&&(i.z=0),n.Vector3.FromFloatsToRef(0,0,0,this.K),s=!1}h?(this.tt.normalizeToRef(this.lt),this.it.normalizeToRef(this.at),this.ht.normalizeToRef(this.ct),this.Mt.translate(this.lt,i.x,n.Space.WORLD),this.Mt.translate(this.at,i.y,n.Space.WORLD),this.Mt.translate(this.ct,i.z,n.Space.WORLD)):null==this.Mt.parent?this.Mt.position.addInPlace(i):this.Mt.setAbsolutePosition(i.addInPlace(this.Mt.absolutePosition))},t.prototype._i=function(t){this.yt(this.Mt),this.$.x=0,this.$.y=0,this.$.z=0;var i=this.Xi.name;"X"!=i&&"XZ"!=i&&"YX"!=i||(this.$.x=n.Vector3.Dot(t,this.tt)/this.tt.length(),this.Mt.scaling.x<0&&(this.$.x=-this.$.x)),"Y"!=i&&"ZY"!=i&&"YX"!=i||(this.$.y=n.Vector3.Dot(t,this.it)/this.it.length(),this.Mt.scaling.y<0&&(this.$.y=-this.$.y)),"Z"!=i&&"XZ"!=i&&"ZY"!=i||(this.$.z=n.Vector3.Dot(t,this.ht)/this.ht.length(),this.Mt.scaling.z<0&&(this.$.z=-this.$.z));var h=this.dt;if(this.$.x=this.$.x/h.x,this.$.y=this.$.y/h.y,this.$.z=this.$.z/h.z,"ALL"==i){var s=n.Vector3.Dot(t,this.wt.upVector);s/=Math.max(h.x,h.y,h.z),this.$.copyFromFloats(s,s,s)}else{var u=!1;if("XZ"==i?(u=!0,Math.abs(this.$.x)>Math.abs(this.$.z)?this.$.z=this.$.x:this.$.x=this.$.z):"ZY"==i?(u=!0,Math.abs(this.$.z)>Math.abs(this.$.y)?this.$.y=this.$.z:this.$.z=this.$.y):"YX"==i&&(u=!0,Math.abs(this.$.y)>Math.abs(this.$.x)?this.$.x=this.$.y:this.$.y=this.$.x),u){this.At.position.subtractToRef(this.wt.position,this.k);s=n.Vector3.Dot(t,this.k);this.$.x=Math.abs(this.$.x),this.$.y=Math.abs(this.$.y),this.$.z=Math.abs(this.$.z),s>0?(this.Mt.scaling.x>0&&(this.$.x=-this.$.x),this.Mt.scaling.y>0&&(this.$.y=-this.$.y),this.Mt.scaling.z>0&&(this.$.z=-this.$.z)):(this.Mt.scaling.x<0&&(this.$.x=-this.$.x),this.Mt.scaling.y<0&&(this.$.y=-this.$.y),this.Mt.scaling.z<0&&(this.$.z=-this.$.z))}}this.Gi(this.Mt,this.$),this.Hi&&(this.Mt.scaling.x=Math.max(this.Mt.scaling.x,this.Hi.x),this.Mt.scaling.y=Math.max(this.Mt.scaling.y,this.Hi.y),this.Mt.scaling.z=Math.max(this.Mt.scaling.z,this.Hi.z)),this.Ii&&(this.Mt.scaling.x=Math.min(this.Mt.scaling.x,this.Ii.x),this.Mt.scaling.y=Math.min(this.Mt.scaling.y,this.Ii.y),this.Mt.scaling.z=Math.min(this.Mt.scaling.z,this.Ii.z))},t.prototype.Gi=function(t,i){if(this.U){var h=!1;if(this.V.addInPlace(i),Math.abs(this.V.x)>this.W&&(i.x>0?i.x=this.W:i.x=-this.W,h=!0),Math.abs(this.V.y)>this.W&&(i.y>0?i.y=this.W:i.y=-this.W,h=!0),Math.abs(this.V.z)>this.W&&(i.z>0?i.z=this.W:i.z=-this.W,h=!0),!h)return;Math.abs(i.x)!==this.W&&0!==i.x&&(i.x=0),Math.abs(i.y)!==this.W&&0!==i.y&&(i.y=0),Math.abs(i.z)!==this.W&&0!==i.z&&(i.z=0),n.Vector3.FromFloatsToRef(0,0,0,this.V),h=!1}t.scaling.addInPlace(i)},t.prototype.yt=function(t){var i=t.getWorldMatrix();n.Vector3.FromFloatArrayToRef(i.m,0,this.tt),n.Vector3.FromFloatArrayToRef(i.m,4,this.it),n.Vector3.FromFloatArrayToRef(i.m,8,this.ht)},t.prototype.pt=function(t){var i=t.getBoundingInfo().boundingBox,h=i.maximum.subtract(i.minimum);return 0==h.x&&(h.x=1),0==h.y&&(h.y=1),0==h.z&&(h.z=1),h},t.prototype.refreshBoundingInfo=function(){this.dt=this.pt(this.Mt)},t.prototype.ki=function(t,i,h,s){this.u&&null!=this.Mt.parent&&this.It(t)?this.yt(this.At):this.yt(t);var u,r=0;i==this.Jt?u=this.u?this.tt:n.Axis.X:i==this.Kt?u=this.u?this.it:n.Axis.Y:i==this.Ut&&(u=this.u?this.ht:n.Axis.Z),this.At.position.subtractToRef(this.wt.position,this.k),this.I?(r=this.Ji(s,h,this.wt.position,this.k,u),this.Zt.useRightHandedSystem&&(r=-r)):r=this.Ki(s,h,t.getAbsolutePivotPoint(),this.k),this.M&&(this.nt+=r,r=0,Math.abs(this.nt)>=this.L&&(r=this.nt>0?this.L:-this.L,this.nt=0)),0!==r&&(this.k.normalize(),i==this.ai?t.rotate(this.k,-r,n.Space.WORLD):(n.Vector3.Dot(u,this.k)>=0&&(r=-r),t.rotate(u,r,n.Space.WORLD)),this.st&&(t.rotation=t.rotationQuaternion.toEulerAngles(),t.rotationQuaternion=null),this.u&&null!=this.Mt.parent&&this.It(t)&&(i==this.ai?this.At.rotate(this.k,-r,n.Space.WORLD):this.At.rotate(u,r,n.Space.WORLD)))},t.prototype.Li=function(){var t=this,i=this.Zt.pick(this.Zt.pointerX,this.Zt.pointerY,function(i){return i==t.pi},null,this.wt);return i.hit?i.pickedPoint:null},t.prototype.Ti=function(){this.Yi.visibility=0,this.Zi.visibility=0,this.bi.visibility=0},t.prototype.Ui=function(t){this.ut&&(this.Vi.visibility=t,this.Wi.visibility=t,this.$i.visibility=t,this.th.visibility=t,this.ih.visibility=t,this.hh.visibility=t,this.sh.visibility=t),this.rt&&(this.nh.visibility=t,this.uh.visibility=t,this.rh.visibility=t,this.eh.visibility=t),this.et&&(this.fh.visibility=t,this.oh.visibility=t,this.lh.visibility=t,this.ah.visibility=t,this.vh.visibility=t,this.Mh.visibility=t,this.wh.visibility=t)},t.prototype.getRotationQuaternion=function(){return this.At.rotationQuaternion},t.prototype.getPosition=function(){return this.At.position},t.prototype.isTranslationEnabled=function(){return this.ut},t.prototype.enableTranslation=function(){null==this.ei&&(this.Xh(),this.Yh.parent=this.At),this.Ci(),this.ut||(this.Vi.visibility=this.S,this.Wi.visibility=this.S,this.$i.visibility=this.S,this.th.visibility=this.S,this.ih.visibility=this.S,this.hh.visibility=this.S,this.sh.visibility=this.S,this.ut=!0,this.disableRotation(),this.disableScaling())},t.prototype.disableTranslation=function(){this.ut&&(this.Vi.visibility=0,this.Wi.visibility=0,this.$i.visibility=0,this.th.visibility=0,this.ih.visibility=0,this.hh.visibility=0,this.sh.visibility=0,this.ut=!1)},t.prototype.isRotationEnabled=function(){return this.rt},t.prototype.returnEuler=function(t){this.st=t},t.prototype.enableRotation=function(){null==this.Zh&&(this.bh(),this.Zh.parent=this.At),this.Ci(),this.rt||(this.nh.visibility=this.S,this.uh.visibility=this.S,this.rh.visibility=this.S,this.eh.visibility=this.S,this.dh.visibility=this.S,this.rt=!0,this.disableTranslation(),this.disableScaling())},t.prototype.disableRotation=function(){this.rt&&(this.nh.visibility=0,this.uh.visibility=0,this.rh.visibility=0,this.eh.visibility=0,this.dh.visibility=0,this.rt=!1)},t.prototype.isScalingEnabled=function(){return this.et},t.prototype.enableScaling=function(){null==this.ci&&(this.ph(),this.yh.parent=this.At),this.Ci(),this.et||(this.fh.visibility=this.S,this.oh.visibility=this.S,this.lh.visibility=this.S,this.ah.visibility=this.S,this.vh.visibility=this.S,this.Mh.visibility=this.S,this.wh.visibility=this.S,this.et=!0,this.disableTranslation(),this.disableRotation())},t.prototype.disableScaling=function(){this.et&&(this.fh.visibility=0,this.oh.visibility=0,this.lh.visibility=0,this.ah.visibility=0,this.vh.visibility=0,this.Mh.visibility=0,this.wh.visibility=0,this.et=!1)},t.prototype.setScaleBounds=function(t,i){this.Hi=t||null,this.Ii=i||null,null!=this.Hi&&(0==this.Hi.x&&(this.Hi.x=1e-8),0==this.Hi.y&&(this.Hi.y=1e-8),0==this.Hi.z&&(this.Hi.z=1e-8))},t.prototype.removeScaleBounds=function(){this.Hi=null,this.Ii=null},t.prototype.setTransBounds=function(t,i){this.Di=t||null,this.Fi=i||null},t.prototype.removeTransBounds=function(){this.Di=null,this.Fi=null},t.prototype.setRotBounds=function(t,i){this.Ah=t||null,this.Lh=i||null},t.prototype.removeRotBounds=function(){this.Ah=null,this.Lh=null},t.prototype.jt=function(){var t=new n.Mesh("guideCtl",this.Zt);this.Yi=n.Mesh.CreateLines("bxAxis",[new n.Vector3(-100,0,0),new n.Vector3(100,0,0)],this.Zt),this.Zi=n.Mesh.CreateLines("byAxis",[new n.Vector3(0,-100,0),new n.Vector3(0,100,0)],this.Zt),this.bi=n.Mesh.CreateLines("bzAxis",[new n.Vector3(0,0,-100),new n.Vector3(0,0,100)],this.Zt),this.Yi.isPickable=!1,this.Zi.isPickable=!1,this.bi.isPickable=!1,this.Yi.parent=t,this.Zi.parent=t,this.bi.parent=t,this.Yi.color=n.Color3.Red(),this.Zi.color=n.Color3.Green(),this.bi.color=n.Color3.Blue(),this.Ti();var i=this.j*this.C*.75;return this.hi=n.Mesh.CreateLines("xAxis",[new n.Vector3(0,0,0),new n.Vector3(i,0,0)],this.Zt),this.si=n.Mesh.CreateLines("yAxis",[new n.Vector3(0,0,0),new n.Vector3(0,i,0)],this.Zt),this.ni=n.Mesh.CreateLines("zAxis",[new n.Vector3(0,0,0),new n.Vector3(0,0,i)],this.Zt),this.hi.isPickable=!1,this.si.isPickable=!1,this.ni.isPickable=!1,this.hi.parent=t,this.si.parent=t,this.ni.parent=t,this.hi.color=n.Color3.Red(),this.si.color=n.Color3.Green(),this.ni.color=n.Color3.Blue(),this.hi.renderingGroupId=1,this.si.renderingGroupId=1,this.ni.renderingGroupId=1,t},t.prototype.xt=function(){this._t=n.Mesh.CreatePlane("pALL",5,this.Zt),this.Ni=n.Mesh.CreatePlane("pXZ",5,this.Zt),this.Pi=n.Mesh.CreatePlane("pZY",5,this.Zt),this.Qi=n.Mesh.CreatePlane("pYX",5,this.Zt),this._t.isPickable=!1,this.Ni.isPickable=!1,this.Pi.isPickable=!1,this.Qi.isPickable=!1,this._t.visibility=0,this.Ni.visibility=0,this.Pi.visibility=0,this.Qi.visibility=0,this._t.renderingGroupId=1,this.Ni.renderingGroupId=1,this.Pi.renderingGroupId=1,this.Qi.renderingGroupId=1,this._t.lookAt(this.wt.position),this.Ni.rotate(n.Axis.X,1.57),this.Pi.rotate(n.Axis.Y,1.57);var t=new n.Mesh("pickPlanes",this.Zt);return this._t.parent=t,this.Ni.parent=t,this.Pi.parent=t,this.Qi.parent=t,t},t.prototype.Xh=function(){var t=2*this.O*this.C,i=this.j*this.C;this.Yh=new n.Mesh("tarnsCtl",this.Zt),this.ei=this.jh(t/2,i),this.ei.name="X",this.fi=this.ei.clone("Y"),this.oi=this.ei.clone("Z"),this.Qt=n.MeshBuilder.CreatePlane("XZ",{size:2*t},this.Zt),this.Bt=n.MeshBuilder.CreatePlane("ZY",{size:2*t},this.Zt),this.Dt=n.MeshBuilder.CreatePlane("YX",{size:2*t},this.Zt),this.Qt.rotation.x=1.57,this.Bt.rotation.y=-1.57,this.Qt.position.x=t,this.Qt.position.z=t,this.Bt.position.z=t,this.Bt.position.y=t,this.Dt.position.y=t,this.Dt.position.x=t,this.Qt.bakeCurrentTransformIntoVertices(),this.Bt.bakeCurrentTransformIntoVertices(),this.Dt.bakeCurrentTransformIntoVertices(),this.li=n.Mesh.CreateBox("ALL",2*t,this.Zt),this.ei.parent=this.Yh,this.fi.parent=this.Yh,this.oi.parent=this.Yh,this.Qt.parent=this.Yh,this.Bt.parent=this.Yh,this.Dt.parent=this.Yh,this.li.parent=this.Yh,this.ei.rotation.y=1.57,this.fi.rotation.x-=1.57,this.ei.visibility=0,this.fi.visibility=0,this.oi.visibility=0,this.Qt.visibility=0,this.Bt.visibility=0,this.Dt.visibility=0,this.li.visibility=0,this.ei.isPickable=!1,this.fi.isPickable=!1,this.oi.isPickable=!1,this.Qt.isPickable=!1,this.Bt.isPickable=!1,this.Dt.isPickable=!1,this.li.isPickable=!1;var h=i/5,s=t;this.Vi=n.Mesh.CreateCylinder("tEndX",h,0,s,6,1,this.Zt),this.Wi=this.Vi.clone("tEndY"),this.$i=this.Vi.clone("tEndZ"),this.th=this.xh("XZ",1.75*s,this.Zt),this.ih=this.th.clone("ZY"),this.hh=this.th.clone("YX"),this.sh=n.MeshBuilder.CreatePolyhedron("tEndAll",{type:1,size:s/2},this.Zt),this.Vi.rotation.x=1.57,this.Wi.rotation.x=1.57,this.$i.rotation.x=1.57,this.ih.rotation.z=1.57,this.hh.rotation.x=-1.57,this.th.position.x=t,this.th.position.z=t,this.ih.position.z=t,this.ih.position.y=t,this.hh.position.y=t,this.hh.position.x=t,this.Vi.parent=this.ei,this.Wi.parent=this.fi,this.$i.parent=this.oi,this.th.parent=this.Qt,this.ih.parent=this.Bt,this.hh.parent=this.Dt,this.sh.parent=this.li,this.Vi.position.z=i-h/2,this.Wi.position.z=i-h/2,this.$i.position.z=i-h/2,this.Vi.material=this.mh,this.Wi.material=this.zh,this.$i.material=this.Eh,this.th.material=this.zh,this.ih.material=this.mh,this.hh.material=this.Eh,this.sh.material=this.Ch,this.Vi.renderingGroupId=2,this.Wi.renderingGroupId=2,this.$i.renderingGroupId=2,this.th.renderingGroupId=2,this.ih.renderingGroupId=2,this.hh.renderingGroupId=2,this.sh.renderingGroupId=2,this.Vi.isPickable=!1,this.Wi.isPickable=!1,this.$i.isPickable=!1,this.th.isPickable=!1,this.ih.isPickable=!1,this.hh.isPickable=!1,this.sh.isPickable=!1},t.prototype.xh=function(t,i,h){var s=new n.Path2(i/2,-i/2).addLineTo(i/2,i/2).addLineTo(-i/2,i/2).addLineTo(i/2,-i/2);return new n.PolygonMeshBuilder(t,s,h).build()},t.prototype.setRotGuideFull=function(t){this.ft=t?360:180,null!=this.Zh&&(this.Zh.dispose(),this.ai.dispose(),this.Zh=null,this.enableRotation())},t.prototype.bh=function(){var t=this.j*this.C*2;this.Zh=new n.Mesh("rotCtl",this.Zt),this.Jt=this.Oh(t/2,this.ft),this.Jt.name="X",this.Kt=this.Oh(t/2,this.ft),this.Kt.name="Y",this.Ut=this.Oh(t/2,this.ft),this.Ut.name="Z",this.ai=this.Oh(t/1.75,360),this.ai.name="ALL",this.Jt.rotation.z=1.57,this.Ut.rotation.x=-1.57,this.Jt.bakeCurrentTransformIntoVertices(),this.Ut.bakeCurrentTransformIntoVertices(),this.ai.rotation.x=1.57,this.Jt.parent=this.Zh,this.Kt.parent=this.Zh,this.Ut.parent=this.Zh,this.ai.parent=this._t,this.Jt.visibility=0,this.Kt.visibility=0,this.Ut.visibility=0,this.ai.visibility=0,this.Jt.isPickable=!1,this.Kt.isPickable=!1,this.Ut.isPickable=!1,this.ai.isPickable=!1;var i=t;this.nh=this.Sh(i/2,this.ft,!1),this.uh=this.nh.clone(""),this.rh=this.nh.clone(""),this.eh=this.Sh(i/1.75,360,!1),this.dh=this.Sh(i/2,360,!1),this.nh.parent=this.Jt,this.uh.parent=this.Kt,this.rh.parent=this.Ut,this.nh.rotation.z=1.57,this.rh.rotation.x=-1.57,this.eh.parent=this.ai,this.dh.parent=this.ai,this.nh.color=n.Color3.Red(),this.uh.color=n.Color3.Green(),this.rh.color=n.Color3.Blue(),this.eh.color=n.Color3.Yellow(),this.dh.color=n.Color3.Gray(),this.nh.renderingGroupId=2,this.uh.renderingGroupId=2,this.rh.renderingGroupId=2,this.eh.renderingGroupId=2,this.dh.renderingGroupId=2,this.nh.isPickable=!1,this.uh.isPickable=!1,this.rh.isPickable=!1,this.eh.isPickable=!1,this.dh.isPickable=!1},t.prototype.jh=function(t,i){var h=[new n.Vector3(t,t,0),new n.Vector3(-t,t,0),new n.Vector3(-t,-t,0),new n.Vector3(t,-t,0),new n.Vector3(t,t,0)],s=[new n.Vector3(0,0,0),new n.Vector3(0,0,i)];return n.Mesh.ExtrudeShape("",h,s,1,0,2,this.Zt)},t.prototype.Sh=function(t,i,h){null===i&&(i=360);for(var s,u,r=[],e=3.14/180,f=0,o=0;o<=i;o+=5)s=t*Math.cos(o*e),u=90==o?t:270==o?-t:t*Math.sin(o*e),r[f]=new n.Vector3(s,0,u),f++;if(h){t-=.04;for(o=0;o<=i;o+=5)s=t*Math.cos(o*e),u=90==o?t:270==o?-t:t*Math.sin(o*e),r[f]=new n.Vector3(s,0,u),f++}return n.Mesh.CreateLines("",r,this.Zt)},t.prototype.Oh=function(t,i){null===i&&(i=360);for(var h,s,u=[],r=3.14/180,e=0,f=0;f<=i;f+=30)h=t*Math.cos(f*r),s=90==f?t:270==f?-t:t*Math.sin(f*r),u[e]=new n.Vector3(h,0,s),e++;return n.Mesh.CreateTube("",u,this.O*this.C*2,3,null,n.Mesh.NO_CAP,this.Zt)},t.prototype.ph=function(){var t=2*this.O*this.C,i=this.j*this.C;this.yh=new n.Mesh("sCtl",this.Zt),this.ci=this.jh(t/2,i),this.ci.name="X",this.vi=this.ci.clone("Y"),this.Mi=this.ci.clone("Z"),this.Ft=n.MeshBuilder.CreatePlane("XZ",{size:2*t},this.Zt),this.Gt=n.MeshBuilder.CreatePlane("ZY",{size:2*t},this.Zt),this.Ht=n.MeshBuilder.CreatePlane("YX",{size:2*t},this.Zt),this.Ft.rotation.x=1.57,this.Gt.rotation.y=-1.57,this.Ft.position.x=t,this.Ft.position.z=t,this.Gt.position.z=t,this.Gt.position.y=t,this.Ht.position.y=t,this.Ht.position.x=t,this.Ft.bakeCurrentTransformIntoVertices(),this.Gt.bakeCurrentTransformIntoVertices(),this.Ht.bakeCurrentTransformIntoVertices(),this.wi=n.Mesh.CreateBox("ALL",2*t,this.Zt),this.ci.parent=this.yh,this.vi.parent=this.yh,this.Mi.parent=this.yh,this.wi.parent=this.yh,this.Ft.parent=this.yh,this.Gt.parent=this.yh,this.Ht.parent=this.yh,this.ci.rotation.y=1.57,this.vi.rotation.x-=1.57,this.ci.visibility=0,this.vi.visibility=0,this.Mi.visibility=0,this.Ft.visibility=0,this.Gt.visibility=0,this.Ht.visibility=0,this.wi.visibility=0,this.ci.isPickable=!1,this.vi.isPickable=!1,this.Mi.isPickable=!1,this.Ft.isPickable=!1,this.Gt.isPickable=!1,this.Ht.isPickable=!1,this.wi.isPickable=!1;var h=t;this.fh=n.Mesh.CreateBox("",h,this.Zt),this.oh=this.fh.clone(""),this.lh=this.fh.clone(""),this.ah=this.xh("XZ",1.75*h,this.Zt),this.vh=this.ah.clone("ZY"),this.Mh=this.ah.clone("YX"),this.wh=n.MeshBuilder.CreatePolyhedron("sEndAll",{type:1,size:h/2},this.Zt),this.vh.rotation.z=1.57,this.Mh.rotation.x=-1.57,this.ah.position.x=t,this.ah.position.z=t,this.vh.position.z=t,this.vh.position.y=t,this.Mh.position.y=t,this.Mh.position.x=t,this.fh.parent=this.ci,this.oh.parent=this.vi,this.lh.parent=this.Mi,this.ah.parent=this.Ft,this.vh.parent=this.Gt,this.Mh.parent=this.Ht,this.wh.parent=this.wi,this.fh.position.z=i-h/2,this.oh.position.z=i-h/2,this.lh.position.z=i-h/2,this.fh.material=this.mh,this.oh.material=this.zh,this.lh.material=this.Eh,this.ah.material=this.zh,this.vh.material=this.mh,this.Mh.material=this.Eh,this.wh.material=this.Ch,this.fh.renderingGroupId=2,this.oh.renderingGroupId=2,this.lh.renderingGroupId=2,this.ah.renderingGroupId=2,this.vh.renderingGroupId=2,this.Mh.renderingGroupId=2,this.wh.renderingGroupId=2,this.fh.isPickable=!1,this.oh.isPickable=!1,this.lh.isPickable=!1,this.ah.isPickable=!1,this.vh.isPickable=!1,this.Mh.isPickable=!1,this.wh.isPickable=!1},t.prototype.gh=function(t){var i=n.Vector3.Cross(this.tt,this.it);return n.Vector3.Dot(i,this.ht)<0},t.prototype.setVisibility=function(t){this.S=t},t.prototype.setLocal=function(t){this.u!=t&&(this.u=t,t||(this.At.rotationQuaternion=n.Quaternion.Identity()))},t.prototype.isLocal=function(){return this.u},t.prototype.setTransSnap=function(t){this.v=t},t.prototype.setRotSnap=function(t){this.M=t},t.prototype.setScaleSnap=function(t){this.U=t},t.prototype.setTransSnapValue=function(t){this.ot.copyFromFloats(t,t,t),this.A=t},t.prototype.setRotSnapValue=function(t){this.L=t},t.prototype.setScaleSnapValue=function(t){this.W=t},t.prototype.Ji=function(t,i,h,s,u){var r=n.Vector3.Dot(s,u);u.scaleToRef(r,this.lt),h.addToRef(this.lt,this.at);var e=this.at;this.wt.getWorldMatrix().invertToRef(this.vt),n.Vector3.TransformCoordinatesToRef(this.at,this.vt,this.at);var f=0;e.x>=0&&e.y>=0?f=1:e.x<=0&&e.y>=0?f=2:e.x<=0&&e.y<=0?f=3:e.x>=0&&e.y<=0&&(f=4),n.Vector3.TransformCoordinatesToRef(t,this.vt,this.lt),n.Vector3.TransformCoordinatesToRef(i,this.vt,this.at),this.at.subtractInPlace(this.lt);var o=this.at,l=o.length(),a="";o.x>=0&&o.y>=0?a=o.x>=o.y?"r":"u":o.x<=0&&o.y>=0?a=-o.x>=o.y?"l":"u":o.x<=0&&o.y<=0?a=-o.x>=-o.y?"l":"d":o.x>=0&&o.y<=0&&(a=o.x>=-o.y?"r":"d");var c=0;return"d"==a?c=1==f||4==f?1:-1:"u"==a?c=1==f||4==f?-1:1:"r"==a?c=2==f||1==f?1:-1:"l"==a&&(c=2==f||1==f?-1:1),c*l},t.prototype.Ki=function(t,i,h,s){t.subtractToRef(h,this.lt),i.subtractToRef(h,this.at),n.Vector3.CrossToRef(this.lt,this.at,this.ct);var u=Math.asin(this.ct.length()/(this.lt.length()*this.at.length()));return n.Vector3.Dot(this.ct,s)>0&&(u*=-1),u},t.prototype.Lt=function(i){this.mh=t.Rh("redMat",n.Color3.Red(),i),this.zh=t.Rh("greenMat",n.Color3.Green(),i),this.Eh=t.Rh("blueMat",n.Color3.Blue(),i),this.gi=t.Rh("whiteMat",n.Color3.White(),i),this.Ch=t.Rh("whiteMat",n.Color3.Yellow(),i)},t.prototype.ri=function(){this.mh.dispose(),this.zh.dispose(),this.Eh.dispose(),this.gi.dispose(),this.Ch.dispose()},t.Rh=function(t,i,h){var s=new n.StandardMaterial(t,h);return s.emissiveColor=i,s.diffuseColor=n.Color3.Black(),s.specularColor=n.Color3.Black(),s.backFaceCulling=!1,s},t}(),r=function(){function t(t,i){this.lastMax=10,this.acts=new Array,this.last=-1,this.current=-1,this.mesh=t,this.lastMax=i-1,this.add()}return t.prototype.setCapacity=function(t){0!=t?(this.lastMax=t-1,this.last=-1,this.current=-1,this.acts=new Array,this.add()):console.error("capacity should be more than zero")},t.prototype.add=function(t){void 0===t&&(t=null);var i=new e(this.mesh,t);this.current<this.last&&(this.acts.splice(this.current+1),this.last=this.current),this.last==this.lastMax?(this.acts.shift(),this.acts.push(i)):(this.acts.push(i),this.last++,this.current++)},t.prototype.undo=function(){if(this.current>0){var t=this.acts[this.current].getActionType();return this.current--,this.acts[this.current].perform(this.mesh),t}},t.prototype.redo=function(){if(this.current<this.last)return this.current++,this.acts[this.current].perform(this.mesh),this.acts[this.current].getActionType()},t}(),e=function(){function t(t,i){this.Th=t.position.clone(),null==t.rotationQuaternion?(this.kh=null,this.qh=t.rotation.clone()):(this.kh=t.rotationQuaternion.clone(),this.qh=null),this._h=t.scaling.clone(),this.Nh=i}return t.prototype.getActionType=function(){return this.Nh},t.prototype.perform=function(t){t.position.copyFrom(this.Th),null==t.rotationQuaternion?null!=this.qh?t.rotation.copyFrom(this.qh):t.rotation.copyFrom(this.kh.toEulerAngles()):null!=this.kh?t.rotationQuaternion.copyFrom(this.kh):t.rotationQuaternion.copyFrom(n.Quaternion.RotationYawPitchRoll(this.qh.y,this.qh.x,this.qh.z)),t.scaling.copyFrom(this._h)},t}()}])});
//# sourceMappingURL=EditControl.js.map