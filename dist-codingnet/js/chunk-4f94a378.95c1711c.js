(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4f94a378"],{"44c2":function(t,e,n){var r,s,i;(function(n,a){s=[e],r=a,i="function"===typeof r?r.apply(e,s):r,void 0===i||(t.exports=i)})("undefined"!==typeof globalThis?globalThis:"undefined"!==typeof self&&self,(function(t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var e={name:"FlyStart"};t.default=e}))},"6e52":function(t,e,n){"use strict";n.r(e);var r=n("ba0f"),s=n("aa2b");for(var i in s)"default"!==i&&function(t){n.d(e,t,(function(){return s[t]}))}(i);n("ae11");var a=n("2877"),o=Object(a["a"])(s["default"],r["a"],r["b"],!1,null,"5b00e79c",null);e["default"]=o.exports},"6f28":function(t,e,n){"use strict";var r=n("e118"),s=n.n(r);s.a},"7a3c":function(t,e,n){t.exports=n.p+"img/bg1.5c736701.jpeg"},"7d95":function(t,e,n){t.exports=n.p+"img/bg2.1128ebf0.jpeg"},"998c":function(t,e,n){"use strict";n.r(e);var r=n("c63d"),s=n.n(r);for(var i in r)"default"!==i&&function(t){n.d(e,t,(function(){return r[t]}))}(i);e["default"]=s.a},"9d64":function(t,e,n){t.exports=n.p+"img/logo.9d63a4cd.png"},"9ed6":function(t,e,n){"use strict";n.r(e);var r=n("b1ee"),s=n("998c");for(var i in s)"default"!==i&&function(t){n.d(e,t,(function(){return s[t]}))}(i);n("6f28");var a=n("2877"),o=Object(a["a"])(s["default"],r["a"],r["b"],!1,null,"fd1ecc98",null);e["default"]=o.exports},aa2b:function(t,e,n){"use strict";n.r(e);var r=n("44c2"),s=n.n(r);for(var i in r)"default"!==i&&function(t){n.d(e,t,(function(){return r[t]}))}(i);e["default"]=s.a},ae11:function(t,e,n){"use strict";var r=n("f761"),s=n.n(r);s.a},b1ee:function(t,e,n){"use strict";var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container"},[n("transition-group",{attrs:{tag:"ul",name:"fade"}},t._l(t.bgImgList,(function(e,r){return n("li",{directives:[{name:"show",rawName:"v-show",value:r===t.bgIndex-1,expression:"index === (bgIndex - 1)"}],key:e,staticClass:"bg-img",style:{backgroundImage:"url("+e+")"}})})),0),t.effectComponent?n(t.effectComponent,{tag:"component"}):t._e(),t._m(0),n("div",{staticClass:"login-container"},[n("el-form",{ref:"loginFormRef",attrs:{model:t.form,rules:t.rules,"label-width":"100px"}},[n("el-form-item",{staticClass:"input-item-container",attrs:{label:"用户名：",prop:"username"}},[n("div",{staticClass:"username-input-container"},[n("el-input",{class:["input","login-input-hover-"+t.bgIndex,{shaking:t.isUsernameError}],attrs:{placeholder:"请输入用户名"},nativeOn:{animationend:function(e){t.isUsernameError=!1}},model:{value:t.form.username,callback:function(e){t.$set(t.form,"username",e)},expression:"form.username"}})],1)]),n("el-form-item",{staticClass:"input-item-container password",attrs:{label:"密码：",prop:"password"}},[n("div",{staticClass:"password-input-container"},[n("el-input",{class:["input","login-input-hover-"+t.bgIndex,{shaking:t.isPasswordError}],attrs:{type:t.ifViewPassword?"text":"password",placeholder:"请输入密码"},nativeOn:{animationend:function(e){t.isPasswordError=!1},keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.onHandleClickLogin(e)}},model:{value:t.form.password,callback:function(e){t.$set(t.form,"password",e)},expression:"form.password"}}),n("i",{class:["el-icon-view eye-btn",{hide:t.ifViewPassword}],on:{click:function(e){t.ifViewPassword=!t.ifViewPassword}}})],1)]),n("div",{staticClass:"operator-btn-box"},[n("span",{staticClass:"reset-password-btn",on:{click:function(e){t.isShowResetPasswordModal=!t.isShowResetPasswordModal}}},[t._v("忘记密码？")])]),n("div",{staticClass:"login-btn-container"},[n("div",{class:["login-btn",{loading:t.loginLoading}],style:t.loginBtnStyle,on:{click:t.onHandleClickLogin}},[n("span",{staticClass:"login-text"},[t._v("登 录")]),n("i",{directives:[{name:"show",rawName:"v-show",value:t.loginLoading,expression:"loginLoading"}],staticClass:"el-icon-loading icon-loading"})])])],1)],1),n("el-dialog",{staticClass:"reset-password-modal",attrs:{title:"重置密码",width:"35%",visible:t.isShowResetPasswordModal},on:{"update:visible":function(e){t.isShowResetPasswordModal=e},close:function(e){return t.$refs.resetPasswordFormRef.resetFields()}}},[n("el-alert",{attrs:{title:"输入电子邮箱地址收到邮件后去邮件里的链接网站完成重置操作",type:"warning"}}),n("el-form",{ref:"resetPasswordFormRef",attrs:{model:t.resetPasswordModel,rules:t.resetPasswordFormRules}},[n("el-form-item",{staticClass:"form-item-box",attrs:{prop:"email",label:"电子邮箱: ",required:""}},[n("el-input",{attrs:{placeholder:"请输入"},model:{value:t.resetPasswordModel.email,callback:function(e){t.$set(t.resetPasswordModel,"email",e)},expression:"resetPasswordModel.email"}})],1)],1),n("div",{staticClass:"btn-box"},[n("el-button",{attrs:{type:"danger"},on:{click:function(e){t.isShowResetPasswordModal=!1}}},[t._v("取消")]),n("el-button",{attrs:{type:"primary"},on:{click:t.onHandleClickSubmitResetPasswordForm}},[t._v("确定")])],1)],1)],1)},s=[function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"title-wrapper-box"},[r("div",{staticClass:"title-box"},[r("h2",{staticClass:"system-name"},[t._v("Cat You Manager")]),r("img",{staticClass:"cat-img",attrs:{src:n("9d64")}})])])}];n.d(e,"a",(function(){return r})),n.d(e,"b",(function(){return s}))},ba0f:function(t,e,n){"use strict";var r=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},s=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"fly-start-container"},[n("div",{staticClass:"inner-container"},[n("div",{staticClass:"main-con"},[n("div",{staticClass:"shooting_star"}),n("div",{staticClass:"shooting_star"})]),n("div",{staticClass:"main-con",staticStyle:{"margin-top":"60px"}},[n("div",{staticClass:"shooting_star"}),n("div",{staticClass:"shooting_star"})]),n("div",{staticClass:"main-con",staticStyle:{"margin-top":"120px"}},[n("div",{staticClass:"shooting_star"}),n("div",{staticClass:"shooting_star"})])])])}];n.d(e,"a",(function(){return r})),n.d(e,"b",(function(){return s}))},c63d:function(t,e,n){var r,s,i;n("a4d3"),n("99af"),n("4de4"),n("4160"),n("c975"),n("a15b"),n("d81d"),n("4e82"),n("e439"),n("dbb4"),n("b64b"),n("ac1f"),n("5319"),n("159b"),function(a,o){s=[e,n("96cf"),n("1da1"),n("ade3"),n("5880"),n("6e52")],r=o,i="function"===typeof r?r.apply(e,s):r,void 0===i||(t.exports=i)}("undefined"!==typeof globalThis?globalThis:"undefined"!==typeof self&&self,(function(t,e,r,s,i,a){"use strict";var o=n("4ea4");function c(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function l(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?c(Object(n),!0).forEach((function(e){(0,s.default)(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,r=o(r),s=o(s),a=o(a);var u={name:"Login",components:{flyStart:a.default},data:function(){return{loginLoading:!1,isUsernameError:!1,isPasswordError:!1,ifViewPassword:!1,bgIndex:this.$utils.commonUtils.tweenRandom(1,2),bgEffect:{1:"flyStart"},form:{username:"",password:""},rules:{username:[{required:!0,trigger:"blur"}],password:[{required:!0,trigger:"blur"}]},isShowResetPasswordModal:!1,resetPasswordModel:{email:""},resetPasswordFormRules:{email:[{required:!0,message:"请输入电子邮箱",trigger:"blur"},{validator:function(t,e,n){return e?/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(e)?n():n(new Error("电子邮箱格式不正确")):n(new Error("电子邮箱不能为空"))},trigger:"blur"}]},bgImgList:[n("7a3c"),n("7d95")]}},computed:{effectComponent:function(){var t=this.bgIndex;return this.$themes.loginTheme.loginBgEffectComponent[t]},loginBtnStyle:function(){var t=this.bgIndex,e=this.$themes.loginTheme.loginBtnLinearGradient,n=["left","right"][this.$utils.commonUtils.tweenRandom(0,1)],r=this.$utils.commonUtils.tweenRandom(0,100),s=this.$utils.commonUtils.tweenRandom(0,100),i=[r,s].sort((function(t,e){return t-e}));return r=i[0]+"%",s=i[1]+"%",this.registerLoginBtnCssHoudiniProperty(),{backgroundImage:e(n,r,s)[t]}}},mounted:function(){var t=this;this.timer=setInterval((function(){t.bgIndex=t.$utils.commonUtils.tweenRandom(1,2)}),8e3)},destroyed:function(){this.timer&&clearInterval(this.timer)},methods:l({registerLoginBtnCssHoudiniProperty:function(){var t=this.$themes.loginTheme.loginBtnLinearGradientCssHoudiniPropertyList,e=document.querySelector("#login-btn-houdini"),n=this.bgIndex;e||(e=document.createElement("style"),e.id="login-btn-houdini",document.head.appendChild(e));var r=t.filter((function(t){var e=t.key;return e==="loginBtn-".concat(n,"-start")||e==="loginBtn-".concat(n,"-end")})).map((function(t){var e=t.key.indexOf("start")>-1?"start":"end";return"\n\t\t\t\t\t\t@property --loginBtn-".concat(e," {\n\t\t\t\t\t\t\tsyntax: '").concat(t.syntax,"';\n\t\t\t\t\t\t\tinherits: ").concat(t.inherits,";\n\t\t\t\t\t\t\tinitial-value: ").concat(t["initial-value"],";\n\t\t\t\t\t\t}\n\t\t\t\t\t")})).join("").replace(/\t/g,"");e.innerHTML=r},onHandleClickLogin:function(){var t=(0,r.default)(regeneratorRuntime.mark((function t(){var e,n,r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e=this.form,e.username&&e.password||(e.username||(this.isUsernameError=!0),e.password||(this.isPasswordError=!0)),t.prev=2,t.next=5,this.$refs.loginFormRef.validate();case 5:if(n=t.sent,n){t.next=8;break}return t.abrupt("return");case 8:if(!this.loginLoading){t.next=10;break}return t.abrupt("return");case 10:return this.loginLoading=!0,t.next=13,this.login(e);case 13:if(r=t.sent,!r||!this.$service.userService.checkServerUserData(r)){t.next=20;break}return t.next=17,this.fetchUserPermissionList();case 17:return t.abrupt("return",this.$router.push("/"));case 20:this.$message.error("登录信息不合法");case 21:t.next=29;break;case 23:if(t.prev=23,t.t0=t["catch"](2),this.loginLoading=!1,!this.isUsernameError&&!this.isPasswordError&&t.t0){t.next=28;break}return t.abrupt("return");case 28:this.$message.error(t.t0);case 29:case"end":return t.stop()}}),t,this,[[2,23]])})));function e(){return t.apply(this,arguments)}return e}(),onHandleClickSubmitResetPasswordForm:function(){var t=this;this.$refs.resetPasswordFormRef.validate(function(){var e=(0,r.default)(regeneratorRuntime.mark((function e(n){var r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(n){e.next=2;break}return e.abrupt("return");case 2:return e.prev=2,r=t.resetPasswordModel.email,e.next=6,t.$service.userService.resetPasswordByEmail(r);case 6:t.$message.success("邮件发送成功"),t.isShowResetPasswordModal=!1,e.next=13;break;case 10:e.prev=10,e.t0=e["catch"](2),t.$message.error(e.t0);case 13:case"end":return e.stop()}}),e,null,[[2,10]])})));return function(t){return e.apply(this,arguments)}}())}},(0,i.mapActions)(["login","fetchUserPermissionList"]))};t.default=u}))},c975:function(t,e,n){"use strict";var r=n("23e7"),s=n("4d64").indexOf,i=n("a640"),a=n("ae40"),o=[].indexOf,c=!!o&&1/[1].indexOf(1,-0)<0,l=i("indexOf"),u=a("indexOf",{ACCESSORS:!0,1:0});r({target:"Array",proto:!0,forced:c||!l||!u},{indexOf:function(t){return c?o.apply(this,arguments)||0:s(this,t,arguments.length>1?arguments[1]:void 0)}})},e118:function(t,e,n){},f761:function(t,e,n){}}]);
//# sourceMappingURL=chunk-4f94a378.95c1711c.js.map