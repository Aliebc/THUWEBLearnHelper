// ==UserScript==
// @name         网络学堂助手
// @namespace    https://www.abxmc.live/
// @version      1.0
// @description  优化清华大学网络学堂体验的油猴脚本,目前可以一键查看DDL
// @author       Aliebc Xiang
// @match        https://learn.tsinghua.edu.cn/*
// @icon         http://127.0.0.1/favicon.ico
// @grant        none
// ==/UserScript==


(function() {
    'use strict';
    window.hwdata=function(id){
        return "[{\"name\":\"sEcho\",\"value\":1},{\"name\":\"iColumns\",\"value\":8},{\"name\":\"sColumns\",\"value\":\",,,,,,,\"},{\"name\":\"iDisplayStart\",\"value\":0},{\"name\":\"iDisplayLength\",\"value\":\"30\"},{\"name\":\"mDataProp_0\",\"value\":\"wz\"},{\"name\":\"bSortable_0\",\"value\":false},{\"name\":\"mDataProp_1\",\"value\":\"bt\"},{\"name\":\"bSortable_1\",\"value\":true},{\"name\":\"mDataProp_2\",\"value\":\"mxdxmc\"},{\"name\":\"bSortable_2\",\"value\":true},{\"name\":\"mDataProp_3\",\"value\":\"zywcfs\"},{\"name\":\"bSortable_3\",\"value\":true},{\"name\":\"mDataProp_4\",\"value\":\"kssj\"},{\"name\":\"bSortable_4\",\"value\":true},{\"name\":\"mDataProp_5\",\"value\":\"jzsj\"},{\"name\":\"bSortable_5\",\"value\":true},{\"name\":\"mDataProp_6\",\"value\":\"jzsj\"},{\"name\":\"bSortable_6\",\"value\":true},{\"name\":\"mDataProp_7\",\"value\":\"function\"},{\"name\":\"bSortable_7\",\"value\":false},{\"name\":\"iSortCol_0\",\"value\":5},{\"name\":\"sSortDir_0\",\"value\":\"desc\"},{\"name\":\"iSortCol_1\",\"value\":6},{\"name\":\"sSortDir_1\",\"value\":\"desc\"},{\"name\":\"iSortingCols\",\"value\":2},{\"name\":\"wlkcid\",\"value\":\""+id+"\"}]";
    }
    if(window.location.href=="https://learn.tsinghua.edu.cn/f/wlxt/index/course/student/"){
        window.$("div[class^=content]").append(`<li style="cursor:pointer;" role="presentation"><a class="#ddl" role="tab" id="profile4-tab" data-toggle="tab" aria-controls="profile" onclick="getddl();ddllist();">查看DDL</a></li>`);
        window.$("div[class^=content]").append(`<li style="cursor:pointer;float:right" role="!presentation"><a class="#" role="tab" id="profile5-tab" data-toggle="tab" aria-controls="profile" onclick="zhushou();">THUWEBLearnHelper</a></li>`);
        window.$("li[role='presentation']").unbind();
        window.$("#myTabContent").append(`<div role="tabpanel" class="tab-pane fade" id="ddl" aria-labelledby="profile2-tab"><div class="boxdetail  open clearfix"><div class='title'>所有作业合计</div><hr><table id="ddltable" style="width: 100%;" class="dataTable no-footer" role="grid" aria-describedby="ddltable_info"><thead><tr role="row"><th style='width:50px'>序号</th><th>课程名</th><th>作业标题</th><th>截止时间</th><th>快速提交</th></tr></thead><tbody id='ddlbody'></tbody></table></div></div>`);
        window.$("li[role='presentation']").click(function(event){
         var dom = window.$(this).find("a").attr("class");
         if (window.$(".calendar").hasClass('top')) { //1,2,3
             if (dom.match(/[1,2,3]+/g) == null) {
                 window.$(".calendar").removeClass('top');

             }
         } else {
             if (dom.match(/[1,2,3]+/g) != null) {
                 window.$(".calendar").addClass('top');

             }
         }
        window.$(this).addClass('active').siblings('').removeClass('active');
        window.$("#myTabContent >div").removeClass('in');
        window.$(dom).addClass('in');
        });
        window.getid=function(){
            window.courseid={};
            window.jQuery("a.title").each(function(){window.courseid[window.$(this).html()]=(window.$(this).attr("href").replace(/^.*?wlkcid=/,""))});
            return window.courseid;
        };

        window.gethw=function(id,callback=function(){void(0)}){
            window.url="https://learn.tsinghua.edu.cn/b/wlxt/kczy/zy/student/zyListWj?_csrf="+window.csrf_token;
            window.$.post(window.url,{aoData:window.hwdata(id)},callback);
        }
        window.ddl={};
        window.getid();
        window.ddls=function(id){
            window.url="https://learn.tsinghua.edu.cn/b/wlxt/kczy/zy/student/zyListWj?_csrf="+window.csrf_token;
            window.$.post(window.url,{aoData:window.hwdata(id)},function(e){window.ddl[id]=e['object']['aaData'];window.ddllist();window.ddltable();})
        }
        window.getddl=function(){
            window.getid();
            for(window.i in window.courseid){
                window.ddls(window.courseid[window.i]);
            }
        }
        window.ddllist=function(){
            window.ddllista=new Array()
            for(window.i in window.ddl){
                for(window.j in window.ddl[window.i]){
                    typeof(window.ddl[window.i][window.j])=="object" && Date.parse(new Date)<window.ddl[window.i][window.j]['jzsj']? window.ddllista.push(window.ddl[window.i][window.j]) : void(0);
                }
            }
            window.ddllista=window.ddllista.sort(window.sorttime);
            return window.ddllista;
        }
        window.ddltable=function(){
            window.$("#ddlbody").html("");
            for(window.ddltablei =0;window.ddltablei<window.ddllista.length;window.ddltablei++){

                window.$("#ddlbody").append(`<tr role='row'><td>${window.ddltablei+1}</td><td><a href="https://learn.tsinghua.edu.cn/f/wlxt/index/course/student/course?wlkcid=${window.ddllista[window.ddltablei]['wlkcid']}" target='_blank'>${window.getcoursename(window.ddllista[window.ddltablei]['wlkcid'])}</a></td><td><a class="ddllink" thref='https://learn.tsinghua.edu.cn/f/wlxt/kczy/zy/student/viewZy?wlkcid=${window.ddllista[window.ddltablei]['wlkcid']}&sfgq=0&zyid=${window.ddllista[window.ddltablei]['zyid']}&xszyid=${window.ddllista[window.ddltablei]['xszyid']}' target='_blank'>${window.ddllista[window.ddltablei]['bt']}</a></td><td>${window.ddllista[window.ddltablei]['jzsjStr']}</td><td><a href='https://learn.tsinghua.edu.cn/f/wlxt/kczy/zy/student/tijiao?wlkcid=${window.ddllista[window.ddltablei]['wlkcid']}&sfgq=0&zyid=${window.ddllista[window.ddltablei]['zyid']}&xszyid=${window.ddllista[window.ddltablei]['xszyid']}' target='_blank'>提交作业</a></td></tr>`);
            }
            window.$("a.ddllink").unbind();
            window.$("a.ddllink").click(function(e){$.get($(e.target).attr("thref"),function(m){m=m.substr(m.search("<!--作业说明-->"),m.search("<!--答案说明-->")-m.search("<!--作业说明-->"));zeroModal.show({title:$(e.target).html(),ok:true,content:m,height:"70%",width:"50%"})})});
        }
        window.getcoursename=function(id){
            window.cons="";
            for(window.i in window.courseid){
                window.courseid[window.i]==id? window.cons=window.i : void(0);
            }
            return window.cons.replace(/\(.*\)/,"");
        }
        window.sorttime=function(cou1,cou2){
            return cou1['jzsj']-cou2['jzsj'];
        }
    }
    window.zhushou=function(){window.zeroModal.show({title:"学堂助手",ok:true,cancelTitle: "取消",content:"学堂助手<br><br>版本:1.0 alpha<br><br>By Aliebc Xiang"});};
})();
