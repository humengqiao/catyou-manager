(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0196aff2"],{1199:function(e,t,a){"use strict";a.r(t);var n=a("a5a8"),i=a("3ecb");for(var o in i)"default"!==o&&function(e){a.d(t,e,(function(){return i[e]}))}(o);a("aa8f");var r=a("2877"),l=Object(r["a"])(i["default"],n["a"],n["b"],!1,null,"3a620e50",null);t["default"]=l.exports},"3ecb":function(e,t,a){"use strict";a.r(t);var n=a("6733"),i=a.n(n);for(var o in n)"default"!==o&&function(e){a.d(t,e,(function(){return n[e]}))}(o);t["default"]=i.a},6733:function(e,t,a){var n,i,o;a("a9e3"),function(a,r){i=[t],n=r,o="function"===typeof n?n.apply(t,i):n,void 0===o||(e.exports=o)}("undefined"!==typeof globalThis?globalThis:"undefined"!==typeof self&&self,(function(e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var t={name:"TitleCount",props:{title:{required:!0,type:String,default:""},count:{type:[String,Number],default:0},unit:{type:String,default:"个"}}};e.default=t}))},"6f47":function(e,t,a){"use strict";var n=a("d277"),i=a.n(n);i.a},8325:function(e,t,a){"use strict";a.r(t);var n=a("9d63"),i=a.n(n);for(var o in n)"default"!==o&&function(e){a.d(t,e,(function(){return n[e]}))}(o);t["default"]=i.a},"93b9":function(e,t,a){"use strict";var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"container"},[a("div",{staticClass:"op-container"},[a("el-button",{attrs:{type:"primary",size:"small"},on:{click:function(t){e.addOrEditFbaModal=!0}}},[e._v("新建发货明细")])],1),a("title-section",{attrs:{title:"FBA发货明细列表",count:e.list.length}}),a("div",{staticClass:"table-container"},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.fbaLoading,expression:"fbaLoading"}],staticClass:"table",attrs:{data:e.list,border:"",stripe:"","highlight-current-row":"",height:"100%"}},[a("el-table-column",{attrs:{label:"序号",type:"index",width:"50px"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s((e.pagination.currentPage-1)*e.pagination.pageSize+t.$index+1))]}}])}),a("el-table-column",{attrs:{label:"操作",fixed:"",width:"60px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",{staticStyle:{color:"#579ef8","font-size":"12px","margin-right":"5px",cursor:"pointer"},on:{click:function(a){return e.onHandleClickEdit(t.row)}}},[e._v("编辑")]),a("span",{staticStyle:{color:"#e98f8c","font-size":"12px",cursor:"pointer"},on:{click:function(a){return e.onHandleClickDelete(t.row)}}},[e._v("删除")])]}}])}),a("el-table-column",{attrs:{label:"时间",prop:"time"}}),a("el-table-column",{attrs:{label:"SKU",prop:"sku"}}),a("el-table-column",{attrs:{label:"FNSKU",prop:"fnSku"}}),a("el-table-column",{attrs:{label:"Name",prop:"name"}}),a("el-table-column",{attrs:{label:"数量",prop:"count"}}),a("el-table-column",{attrs:{label:"单个实重",prop:"singleWeight"}}),a("el-table-column",{attrs:{label:"总量KG",prop:"weightKg"}}),a("el-table-column",{attrs:{label:"单个体积",prop:"singleVolume"}}),a("el-table-column",{attrs:{label:"体积重",prop:"volumeWeight"}}),a("el-table-column",{attrs:{label:"单个运费",prop:"singlePostFee"}}),a("el-table-column",{attrs:{label:"总运费",prop:"totalPostFee"}}),a("el-table-column",{attrs:{label:"采购单价",prop:"buySingleFee"}}),a("el-table-column",{attrs:{label:"采购总价",prop:"buyTotalFee"}})],1)],1),e.list.length>0?a("el-pagination",{staticClass:"pagination-container",attrs:{"page-sizes":[10,20,30],"current-page":e.pagination.currentPage,"page-size":e.pagination.pageSize,layout:"sizes, prev, pager, next",total:e.pagination.total},on:{"update:currentPage":function(t){return e.$set(e.pagination,"currentPage",t)},"update:current-page":function(t){return e.$set(e.pagination,"currentPage",t)},"update:pageSize":function(t){return e.$set(e.pagination,"pageSize",t)},"update:page-size":function(t){return e.$set(e.pagination,"pageSize",t)},"size-change":e.fetchFbaList,"current-change":e.fetchFbaList}}):e._e(),a("el-dialog",{staticClass:"add-or-edit-fba-modal",attrs:{visible:e.addOrEditFbaModal,title:e.addOrEditFbaTitle},on:{"update:visible":function(t){e.addOrEditFbaModal=t},close:e.onHandleCloseAddOrEditFbaModal}},[a("el-form",{ref:"addOrEditFbaFormRef",attrs:{model:e.form,"label-width":"90px"}},[a("el-form-item",{attrs:{label:"时间：",prop:"time"}},[a("el-input",{attrs:{placeholder:"请输入时间内容"},model:{value:e.form.time,callback:function(t){e.$set(e.form,"time",t)},expression:"form.time"}})],1),a("el-form-item",{attrs:{label:"SKU：",prop:"sku"}},[a("el-input",{attrs:{placeholder:"请输入sku"},model:{value:e.form.sku,callback:function(t){e.$set(e.form,"sku",t)},expression:"form.sku"}})],1),a("el-form-item",{attrs:{label:"FNSKU：",prop:"fnSku"}},[a("el-input",{attrs:{placeholder:"请输入fnSku"},model:{value:e.form.fnSku,callback:function(t){e.$set(e.form,"fnSku",t)},expression:"form.fnSku"}})],1),a("el-form-item",{attrs:{label:"Name：",prop:"name"}},[a("el-input",{attrs:{placeholder:"请输入名称"},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),a("el-form-item",{attrs:{label:"数量：",prop:"count"}},[a("el-input",{attrs:{placeholder:"请输入数量"},model:{value:e.form.count,callback:function(t){e.$set(e.form,"count",e._n(t))},expression:"form.count"}})],1),a("el-form-item",{attrs:{label:"单个实重：",prop:"singleWeight"}},[a("el-input",{attrs:{placeholder:"请输入单个实重"},model:{value:e.form.singleWeight,callback:function(t){e.$set(e.form,"singleWeight",t)},expression:"form.singleWeight"}})],1),a("el-form-item",{attrs:{label:"实重KG：",prop:"weightKg"}},[a("el-input",{attrs:{placeholder:"请输入实重KG"},model:{value:e.form.weightKg,callback:function(t){e.$set(e.form,"weightKg",t)},expression:"form.weightKg"}})],1),a("el-form-item",{attrs:{label:"单个体积：",prop:"singleVolume"}},[a("el-input",{attrs:{placeholder:"请输入单个体积"},model:{value:e.form.singleVolume,callback:function(t){e.$set(e.form,"singleVolume",t)},expression:"form.singleVolume"}})],1),a("el-form-item",{attrs:{label:"体积重：",prop:"volumeWeight"}},[a("el-input",{attrs:{placeholder:"请输入体积重"},model:{value:e.form.volumeWeight,callback:function(t){e.$set(e.form,"volumeWeight",t)},expression:"form.volumeWeight"}})],1),a("el-form-item",{attrs:{label:"单个运费：",prop:"singlePostFee"}},[a("el-input",{attrs:{placeholder:"请输入单个费用"},model:{value:e.form.singlePostFee,callback:function(t){e.$set(e.form,"singlePostFee",t)},expression:"form.singlePostFee"}})],1),a("el-form-item",{attrs:{label:"总运费：",prop:"totalPostFee"}},[a("el-input",{attrs:{placeholder:"请输入总运费"},model:{value:e.form.totalPostFee,callback:function(t){e.$set(e.form,"totalPostFee",t)},expression:"form.totalPostFee"}})],1),a("el-form-item",{attrs:{label:"采购单价：",prop:"buySingleFee"}},[a("el-input",{attrs:{placeholder:"请输入采购单价"},model:{value:e.form.buySingleFee,callback:function(t){e.$set(e.form,"buySingleFee",t)},expression:"form.buySingleFee"}})],1),a("el-form-item",{attrs:{label:"采购总价：",prop:"buyTotalFee"}},[a("el-input",{attrs:{placeholder:"请输入采购总价"},model:{value:e.form.buyTotalFee,callback:function(t){e.$set(e.form,"buyTotalFee",t)},expression:"form.buyTotalFee"}})],1)],1),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{size:"small"},on:{click:function(t){e.addOrEditFbaModal=!1}}},[e._v("取 消")]),a("el-button",{attrs:{type:"primary",size:"small",loading:e.addOrEditFbaLoading},on:{click:e.onHandleConfirmAddOrEditFbaModal}},[e._v("确 定")])],1)],1),a("el-dialog",{attrs:{visible:e.deleteFbaModal,title:"删除fba发货",width:"30%"},on:{"update:visible":function(t){e.deleteFbaModal=t}}},[a("div",[e._v("确定要删除fba发货吗？")]),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{size:"small"},on:{click:function(t){e.deleteFbaModal=!1}}},[e._v("取 消")]),a("el-button",{attrs:{type:"primary",size:"small",loading:e.deleteFbaLoading},on:{click:e.onHandleConfirmDeleteFba}},[e._v("确 定")])],1)])],1)},i=[];a.d(t,"a",(function(){return n})),a.d(t,"b",(function(){return i}))},"9d63":function(e,t,a){var n,i,o;a("a4d3"),a("4de4"),a("4160"),a("b0c0"),a("e439"),a("dbb4"),a("b64b"),a("159b"),function(r,l){i=[t,a("ade3"),a("2909"),a("96cf"),a("1da1"),a("1199")],n=l,o="function"===typeof n?n.apply(t,i):n,void 0===o||(e.exports=o)}("undefined"!==typeof globalThis?globalThis:"undefined"!==typeof self&&self,(function(e,t,n,i,o,r){"use strict";var l=a("4ea4");function s(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function u(e){for(var a=1;a<arguments.length;a++){var n=null!=arguments[a]?arguments[a]:{};a%2?s(Object(n),!0).forEach((function(a){(0,t.default)(e,a,n[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,t=l(t),n=l(n),o=l(o),r=l(r);var c={name:"FBA-post-detail",components:{TitleSection:r.default},data:function(){return{list:[],fbaLoading:!1,addOrEditFbaModal:!1,deleteFbaModal:!1,opType:"add",form:{time:"",sku:"",fnSku:"",name:"",count:0,singleWeight:"",weightKg:"",singleVolume:"",volumeWeight:"",singlePostFee:"",totalPostFee:"",buySingleFee:"",buyTotalFee:""},pagination:{currentPage:1,pageSize:10,total:0},addOrEditFbaLoading:!1,deleteFbaLoading:!1}},computed:{addOrEditFbaTitle:function(){var e=this.opType;return"add"===e?"新建FBA发货":"edit"===e?"修改FBA发货":""}},mounted:function(){this.fetchFbaList()},methods:{fetchFbaList:function(){var e=(0,o.default)(regeneratorRuntime.mark((function e(){var t,a,i,o;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t=this.pagination,this.fbaLoading=!0,e.prev=2,e.next=5,this.$service.fbaService.getFbaList(t);case 5:a=e.sent,a&&(i=a.list,o=a.pagination,this.list=(0,n.default)(i),this.pagination=u({},o)),e.next=12;break;case 9:e.prev=9,e.t0=e["catch"](2),this.$message.error(e.t0);case 12:return e.prev=12,this.fbaLoading=!1,e.finish(12);case 15:case"end":return e.stop()}}),e,this,[[2,9,12,15]])})));function t(){return e.apply(this,arguments)}return t}(),onHandleCloseAddOrEditFbaModal:function(){this.form={time:"",sku:"",fnSku:"",name:"",count:0,singleWeight:"",weightKg:"",singleVolume:"",volumeWeight:"",singlePostFee:"",totalPostFee:"",buySingleFee:"",buyTotalFee:""}},onHandleConfirmAddOrEditFbaModal:function(){var e=(0,o.default)(regeneratorRuntime.mark((function e(){var t,a,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,this.$refs.addOrEditFbaFormRef.validate();case 3:if(t=e.sent,t){e.next=6;break}return e.abrupt("return");case 6:if(a=this.opType,this.addOrEditFbaLoading=!0,n=this.form,"add"!==a){e.next=12;break}return e.next=12,this.$service.fbaService.addFba(n);case 12:if("edit"!==a){e.next=15;break}return e.next=15,this.$service.fbaService.editFba(n);case 15:this.$message.success("fba发货".concat("add"===a?"新增":"修改","成功")),this.addOrEditFbaModal=!1,this.addOrEditFbaLoading=!1,this.fetchFbaList(),e.next=25;break;case 21:e.prev=21,e.t0=e["catch"](0),console.log(e.t0),this.$message.error(e.t0);case 25:case"end":return e.stop()}}),e,this,[[0,21]])})));function t(){return e.apply(this,arguments)}return t}(),onHandleClickEdit:function(e){this.addOrEditFbaModal=!0,this.opType="edit";var t=e.objectId,a=e.time,n=e.sku,i=e.fnSku,o=e.name,r=e.count,l=e.singleWeight,s=e.weightKg,u=e.singleVolume,c=e.volumeWeight,d=e.singlePostFee,f=e.totalPostFee,p=e.buySingleFee,b=e.buyTotalFee;this.form={objectId:t,time:a,sku:n,fnSku:i,name:o,count:r,singleWeight:l,weightKg:s,singleVolume:u,volumeWeight:c,singlePostFee:d,totalPostFee:f,buySingleFee:p,buyTotalFee:b}},onHandleClickDelete:function(e){this.deleteFbaData=e,this.deleteFbaModal=!0},onHandleConfirmDeleteFba:function(){var e=(0,o.default)(regeneratorRuntime.mark((function e(){var t,a=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(this.deleteFbaLoading=!0,t=this.deleteFbaData.objectId,t){e.next=4;break}return e.abrupt("return");case 4:return e.prev=4,e.next=7,this.$service.fbaService.deleteFba(t);case 7:this.$message.success("删除fba发货成功"),this.deleteFbaModal=!1,this.pagination={pageSize:10,currentPage:1,total:0},this.$nextTick((function(){a.fetchFbaList()})),e.next=16;break;case 13:e.prev=13,e.t0=e["catch"](4),this.$message.error(e.t0);case 16:return e.prev=16,this.deleteFbaLoading=!1,e.finish(16);case 19:case"end":return e.stop()}}),e,this,[[4,13,16,19]])})));function t(){return e.apply(this,arguments)}return t}()}};e.default=c}))},a5a8:function(e,t,a){"use strict";var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"title-container"},[a("h3",{staticClass:"title"},[e._v(e._s(e.title))]),e._t("default",[a("div",{staticClass:"total"},[e._v("共"),a("strong",{staticStyle:{color:"#ff0000"}},[e._v(e._s(e.count))]),e._v(e._s(e.unit))])])],2)},i=[];a.d(t,"a",(function(){return n})),a.d(t,"b",(function(){return i}))},aa8f:function(e,t,a){"use strict";var n=a("cfa7"),i=a.n(n);i.a},c932:function(e,t,a){"use strict";a.r(t);var n=a("93b9"),i=a("8325");for(var o in i)"default"!==o&&function(e){a.d(t,e,(function(){return i[e]}))}(o);a("6f47");var r=a("2877"),l=Object(r["a"])(i["default"],n["a"],n["b"],!1,null,"80eeee5c",null);t["default"]=l.exports},cfa7:function(e,t,a){},d277:function(e,t,a){}}]);
//# sourceMappingURL=chunk-0196aff2.a2b430ff.js.map