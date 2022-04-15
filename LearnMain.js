// ==UserScript==
// @name         AB.X学堂助手
// @version      1.1
// @description  优化清华大学网络学堂体验的油猴脚本,目前可以一键查看DDL
// @author       Aliebc Xiang
// @match        https://learn.tsinghua.edu.cn/*
// @icon         https://pic2.zhimg.com/80/v2-a2a649a9378b92ca4ace53dc947b85c8_1440w.png
// @grant        none
// ==/UserScript==


//1.1版本更新:支持多语言/截止日期高亮
(function() {
    window.hwdata=(id)=>{
        return "[{\"name\":\"sEcho\",\"value\":1},{\"name\":\"iColumns\",\"value\":8},{\"name\":\"sColumns\",\"value\":\",,,,,,,\"},{\"name\":\"iDisplayStart\",\"value\":0},{\"name\":\"iDisplayLength\",\"value\":\"30\"},{\"name\":\"mDataProp_0\",\"value\":\"wz\"},{\"name\":\"bSortable_0\",\"value\":false},{\"name\":\"mDataProp_1\",\"value\":\"bt\"},{\"name\":\"bSortable_1\",\"value\":true},{\"name\":\"mDataProp_2\",\"value\":\"mxdxmc\"},{\"name\":\"bSortable_2\",\"value\":true},{\"name\":\"mDataProp_3\",\"value\":\"zywcfs\"},{\"name\":\"bSortable_3\",\"value\":true},{\"name\":\"mDataProp_4\",\"value\":\"kssj\"},{\"name\":\"bSortable_4\",\"value\":true},{\"name\":\"mDataProp_5\",\"value\":\"jzsj\"},{\"name\":\"bSortable_5\",\"value\":true},{\"name\":\"mDataProp_6\",\"value\":\"jzsj\"},{\"name\":\"bSortable_6\",\"value\":true},{\"name\":\"mDataProp_7\",\"value\":\"function\"},{\"name\":\"bSortable_7\",\"value\":false},{\"name\":\"iSortCol_0\",\"value\":5},{\"name\":\"sSortDir_0\",\"value\":\"desc\"},{\"name\":\"iSortCol_1\",\"value\":6},{\"name\":\"sSortDir_1\",\"value\":\"desc\"},{\"name\":\"iSortingCols\",\"value\":2},{\"name\":\"wlkcid\",\"value\":\""+id+"\"}]";
    }
    window.xtzs_lang={
        "en":{
            "ABXHELPER":"AB.X Web Learning Helper",
            "ABXSUMMARY":"AB.X Web Learning Helper<br><br>Version: 1.1a<br><br>By <a href='mailto:aliebcx@outlook.com'>Aliebc Xiang</a><br><br>Open Source License: MIT",
            "ALL_HOMEWORK":"All Assignments",
            "ABXW_ID":"ID",
            "ABXW_COURSENAME":"Course",
            "ABXW_HOMEWORKTITLE":"Title",
            "ABXW_DEADLINE":"Deadline",
            "ABXW_SUBMIT":"Submit link",
            "ABXW_SUBMITH":"Submit",
            "ABXW_SEEDDL":"Current Assignments"
        },
        "zh":{
            "ABXHELPER":"AB.X学堂助手",
            "ABXSUMMARY":"AB.X 学堂助手(THU)<br><br>版本: 1.1a<br><br>作者: <a href='mailto:aliebcx@outlook.com'>Aliebc Xiang</a><br><br>欢迎反馈或提供新功能建议,作者联系方式:aliebcx@outlook.com<br><br>开源协议:MIT",
            "ALL_HOMEWORK":"所有作业",
            "ABXW_ID":"序号",
            "ABXW_COURSENAME":"课程名",
            "ABXW_HOMEWORKTITLE":"作业标题",
            "ABXW_DEADLINE":"截止时间",
            "ABXW_SUBMIT":"快速提交",
            "ABXW_SUBMITH":"提交作业",
            "ABXW_SEEDDL":"当前作业"
        }
    }
    if(window.location.href=="https://learn.tsinghua.edu.cn/f/wlxt/index/course/student/"){
        window.$("div[class^=content]").append(`<li style="cursor:pointer;" role="presentation">
        <a class="#ddl" role="tab" id="profile4-tab" data-toggle="tab" aria-controls="profile" onclick="getddl();ddllist();">${window.xtzs_lang[locale]['ABXW_SEEDDL']}</a></li>`);
        window.$("div[class^=content]").append(`<li style="cursor:pointer;float:right" role="!presentation">
        <a class="#" role="tab" id="profile5-tab" data-toggle="tab" aria-controls="profile" onclick="zhushou();">
        ${window.xtzs_lang[locale]['ABXHELPER']}</a></li>`);
        window.$("li[role='presentation']").unbind();
        window.$("#myTabContent").append(`<div role="tabpanel" class="tab-pane fade" id="ddl" aria-labelledby="profile2-tab"><div class="boxdetail  open clearfix">
        <div class='title'>${window.xtzs_lang[locale]['ALL_HOMEWORK']}</div><hr><table id="ddltable" style="width: 100%;" class="dataTable no-footer" role="grid" aria-describedby="ddltable_info"><thead>
        <tr role="row"><th style='width:50px'>${window.xtzs_lang[locale]['ABXW_ID']}</th><th>${window.xtzs_lang[locale]['ABXW_COURSENAME']}</th>
        <th>${window.xtzs_lang[locale]['ABXW_HOMEWORKTITLE']}</th><th>${window.xtzs_lang[locale]['ABXW_DEADLINE']}</th>
        <th>${window.xtzs_lang[locale]['ABXW_SUBMIT']}</th></tr></thead>
        <tbody id='ddlbody'></tbody></table></div></div>`);
        window.$("li[role='presentation']").click(function(event){
         var dom = window.$(this).find("a").attr("class");
         if (window.$(".calendar").hasClass('top')) {
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
        window.getid=()=>{
            window.courseid={};
            window.jQuery("a.title").each(function(){window.courseid[window.$(this).html()]=(window.$(this).attr("href").replace(/^.*?wlkcid=/,""))});
            return window.courseid;
        };
        window.gethw=(id,callback=()=>{void(0)})=>{
            window.url="https://learn.tsinghua.edu.cn/b/wlxt/kczy/zy/student/zyListWj?_csrf="+window.csrf_token;
            window.$.post(window.url,{aoData:window.hwdata(id)},callback);
        }
        window.ddl={};
        window.getid();
        window.ddls=(id)=>{
            window.url="https://learn.tsinghua.edu.cn/b/wlxt/kczy/zy/student/zyListWj?_csrf="+window.csrf_token;
            window.$.post(window.url,{aoData:window.hwdata(id)},function(e){window.ddl[id]=e['object']['aaData'];window.ddllist();window.ddltable();})
        }
        window.getddl=()=>{
            window.getid();
            for(window.i in window.courseid){
                window.ddls(window.courseid[window.i]);
            }
        }
        window.ddllist=function(){
            window.ddllista=new Array()
            for(window.i in window.ddl){
                for(window.j in window.ddl[window.i]){
                    if(typeof(window.ddl[window.i][window.j])=="object" && Date.parse(new Date)<window.ddl[window.i][window.j]['jzsj']){
                        if(window.ddl[window.i][window.j]['jzsj']-Date.parse(new Date)<24*3600*1000){
                            window.ddl[window.i][window.j]['jzsjStr']=`<span class='abxw-jzsj' style='color:red'>${window.ddl[window.i][window.j]['jzsjStr']}</span>`;
                        }else if(window.ddl[window.i][window.j]['jzsj']-Date.parse(new Date)<24*3600*1000*2){
                            window.ddl[window.i][window.j]['jzsjStr']=`<span style='color:yellow'>${window.ddl[window.i][window.j]['jzsjStr']}</span>`;
                        }else{
                            window.ddl[window.i][window.j]['jzsjStr']=`<span style='color:green'>${window.ddl[window.i][window.j]['jzsjStr']}</span>`;
                        }
                        window.ddllista.push(window.ddl[window.i][window.j])
                    }
                }
            }
            window.ddllista=window.ddllista.sort(window.sorttime);
            return window.ddllista;
        }
        window.ddltable=function(){
            window.$("#ddlbody").html("");
            for(window.ddltablei =0;window.ddltablei<window.ddllista.length;window.ddltablei++){
                window.$("#ddlbody").append(`<tr role='row'><td>${window.ddltablei+1}</td><td>
                <a href="https://learn.tsinghua.edu.cn/f/wlxt/index/course/student/course?wlkcid=${window.ddllista[window.ddltablei]['wlkcid']}" target='_blank'>
                ${window.getcoursename(window.ddllista[window.ddltablei]['wlkcid'])}</a></td><td>
                <a class="ddllink" thref='https://learn.tsinghua.edu.cn/f/wlxt/kczy/zy/student/viewZy?wlkcid=${window.ddllista[window.ddltablei]['wlkcid']}&sfgq=0&zyid=${window.ddllista[window.ddltablei]['zyid']}&xszyid=${window.ddllista[window.ddltablei]['xszyid']}' target='_blank'>${window.ddllista[window.ddltablei]['bt']}</a></td>
                <td>${window.ddllista[window.ddltablei]['jzsjStr']}</td><td><a href='https://learn.tsinghua.edu.cn/f/wlxt/kczy/zy/student/tijiao?wlkcid=${window.ddllista[window.ddltablei]['wlkcid']}&sfgq=0&zyid=${window.ddllista[window.ddltablei]['zyid']}&xszyid=${window.ddllista[window.ddltablei]['xszyid']}' target='_blank'>
                ${window.xtzs_lang[locale]['ABXW_SUBMITH']}</a></td></tr>`);
            }
            window.$("a.ddllink").unbind();
            window.$("a.ddllink").click(function(e){$.get($(e.target).attr("thref"),function(m){
                m=m.substr(m.search("<!--作业说明-->"),m.search("<!--答案说明-->")-m.search("<!--作业说明-->"));
                zeroModal.show({title:$(e.target).html(),ok:true,content:m,height:"70%",width:"50%"})
            })
            });
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
    window.zhushou=function(){window.zeroModal.show({title:window.xtzs_lang[locale]['ABXHELPER'],ok:true,cancelTitle: "取消",content:window.xtzs_lang[locale]['ABXSUMMARY']});};

    // Your code here...
})();