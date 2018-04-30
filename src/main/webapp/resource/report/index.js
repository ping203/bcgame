$(document).ready(function(){
    var childStatus =0;
    $('#historyAndNow').change(function(){
        var p=$(this).children('option:selected').val();//这就是selected的值
        if(p==1){
            $('#conditionDate').show();
            $('#remarks').html("※历史统计※ 会统计您历史的盈亏总和");
        }else{
            $('#remarks').html("※今天统计※ 会统计您今日的盈亏总和");
            $('#conditionStartTime').val("");
            $('#conditionEndTime').val("");
            $('#conditionDate').hide();
        }
    });

    $('#teamHistoryAndNow').change(function(){
        var p=$(this).children('option:selected').val();//这就是selected的值
        if(p==1){
            $('#teamRemarks').html("※历史总计※ 会统计您与下级查询时间内的盈亏总和 ");
            $('#teamConditionDate').show();
            $('#teamConditionStartTime').val(webProfitBiginTime);
            $('#teamConditionEndTime').val(webProfitEndTime);
        }else if(p==2){
            $('#teamRemarks').html("※历史详情※ 会统计您查询时间内的团队盈亏总和，以及下一级的团队盈亏总和");
            $('#teamConditionStartTime').val(webProfitBiginTime);
            $('#teamConditionEndTime').val(webProfitEndTime);
            $('#teamConditionDate').show();
        }else{
            $('#teamRemarks').html("※今天统计※ 会统计您与下级今日的盈亏总和 ");
            $('#teamConditionStartTime').val("");
            $('#teamConditionEndTime').val("");
            $('#teamConditionDate').hide();
        }
    });

    $('#teamInHistoryAndNow').change(function(){
        var p=$(this).children('option:selected').val();//这就是selected的值
        if(p==1){
            $('#teamInRemarks').html("※历史总计※ 会统计您与下级查询时间内的彩中彩盈亏总和 ");
            $('#teamInConditionDate').show();
            $('#teamInConditionStartTime').val(webProfitBiginTime);
            $('#teamInConditionEndTime').val(webProfitEndTime);
        }else if(p==2){
            $('#teamInRemarks').html("※历史详情※ 会统计您查询时间内的团队盈亏总和，以及下一级的彩中彩团队盈亏总和");
            $('#teamInConditionStartTime').val(webProfitBiginTime);
            $('#teamInConditionEndTime').val(webProfitEndTime);
            $('#teamInConditionDate').show();
        }else{
            $('#teamInRemarks').html("※今天统计※ 会统计您与下级今日的彩中彩盈亏总和 ");
            $('#teamInConditionStartTime').val("");
            $('#teamInConditionEndTime').val("");
            $('#teamInConditionDate').hide();
        }
    });



    //个人盈亏报表查询
    $("#search").click(function(){
        var args = $('#userReportSearchArgs').serialize();
        ajaxExt({
            url:'/report/list',
            method:"get",
            data: args,
            callback:function(data) {

                hs.pagination.refleshPages(data.total, "userReportSearchArgs");

                $("#userReportdListTable tr:gt(0)").each(function(){
                    $(this).remove();
                });

                var rows = data.rows;
                if(rows.length>0){
                    $("#nullMsg").css("display","none");
                }else{
                    $("#nullMsg").css("display","block");
                }

                var actualSaleAmountNum=0;
                var winAmountNum=0;
                var countNum=0;
                for(var i = 0;i < rows.length;i++){
                    var tr = $("<tr class=\"listDetail\"></tr>");
                    /*$(tr).append("<td>"+rows[i].id+"</td>");*/
                    $(tr).append("<td>"+rows[i].account+"</td>");
                    $(tr).append("<td>"+rows[i].createDate+"</td>");
                    if(rows[i].betAmount==null){
                        $(tr).append("<td>"+"0"+"</td>");
                    }else{
                        $(tr).append("<td>"+rows[i].betAmount+"</td>");
                    }
                    if(rows[i].rebateAmount==null){
                        $(tr).append("<td>"+"0"+"</td>");
                    }else{
                        $(tr).append("<td>"+rows[i].rebateAmount+"</td>");
                    }
                    if(rows[i].actualSaleAmount==null){
                        $(tr).append("<td>"+"0"+"</td>");
                    }else{
                        $(tr).append("<td>"+rows[i].actualSaleAmount+"</td>");
                        actualSaleAmountNum+=rows[i].actualSaleAmount;
                    }
                    if(rows[i].winAmount==null){
                        $(tr).append("<td>"+"0"+"</td>");
                    }else{
                        $(tr).append("<td>"+rows[i].winAmount+"</td>");
                        winAmountNum+=rows[i].winAmount;
                    }
                    if(rows[i].activityAndSend==null){
                        $(tr).append("<td>"+"0"+"</td>");
                    }else{
                        $(tr).append("<td>"+rows[i].activityAndSend+"</td>");
                    }
                    if(rows[i].rechargeAmount==null){
                        $(tr).append("<td>"+"0"+"</td>");
                    }else{
                        $(tr).append("<td>"+rows[i].rechargeAmount+"</td>");
                    }
                    if(rows[i].drawingAmount==null){
                        $(tr).append("<td>"+"0"+"</td>");
                    }else{
                        $(tr).append("<td>"+rows[i].drawingAmount+"</td>");
                    }
                    if(rows[i].count==null){
                        $(tr).append("<td>"+"0"+"</td>");
                    }else{
                        $(tr).append("<td>"+rows[i].count+"</td>");
                        countNum+=rows[i].count;
                    }

                    $('#userReportHeader').append(tr);
                }
                var tr1 = $("<tr class=\"listDetail\"></tr>");
                $(tr1).append("<td  colspan='4'></td>");

                if(actualSaleAmountNum==null){
                    $(tr1).append("<td class='fontColorTheme'>"+"0"+"</td>");
                }else{
                    $(tr1).append("<td class='fontColorTheme'>"+actualSaleAmountNum.toFixed(4)+"</td>");
                }
                if(winAmountNum==null){
                    $(tr1).append("<td class='fontColorTheme'>"+"0"+"</td>");
                }else{
                    $(tr1).append("<td class='fontColorTheme'>"+winAmountNum.toFixed(4)+"</td>");
                }
                $(tr1).append("<td colspan='3'></td>");
                if(countNum==null){
                    $(tr1).append("<td class='fontColorTheme'>"+"0"+"</td>");
                }else{
                    $(tr1).append("<td class='fontColorTheme'>"+countNum.toFixed(4)+"</td>");
                }
                $('#userReportHeader').append(tr1);


            }
        })
    });


    //团队充值明细报表查询
    $("#rechargeSearch").click(function(){
        var args = $('#rechargeSearchArgs').serialize();
        ajaxExt({
            url:'/report/rechargeList',
            method:"get",
            data: args,
            callback:function(data) {

                hs.pagination.refleshPages(data.total, "rechargeSearchArgs");

                $("#rechargeListTable tr:gt(0)").each(function(){
                    $(this).remove();
                });

                var rows = data.rows;
                if(rows.length>0){
                    $("#rechargeNullMsg").css("display","none");
                }else{
                    $("#rechargeNullMsg").css("display","block");
                }
                for(var i = 0;i < rows.length;i++){
                    var tr = $("<tr class=\"listDetail\"></tr>");
                    $(tr).append("<td>"+rows[i].account+"</td>");
                    $(tr).append("<td>"+rows[i].id+"</td>");
                    $(tr).append("<td>"+rows[i].createTime+"</td>");
                    $(tr).append("<td>"+rows[i].amount+"</td>");
                    $(tr).append("<td>"+rows[i].realAmount+"</td>");
                    $(tr).append("<td>"+rows[i].bankName+"</td>");
                    var statusName ='';
                    if(rows[i].status==0){
                        statusName ="未处理";
                    }else if(rows[i].status==1){
                        statusName ="失败";
                    }else if(rows[i].status==2){
                        statusName ="成功";
                    }else if(rows[i].status==3){
                        statusName ="已过期";
                    }else if(rows[i].status==4){
                        statusName ="已撤销";
                    }else if(rows[i].status==5){
                        statusName ="正在处理";
                    }else if(rows[i].status==6){
                        statusName ="审核中";
                    }
                    $(tr).append("<td>"+statusName+"</td>");
                    $('#rechargeHeader').append(tr);
                }
            }
        })
    });

    //团队提现明细报表查询
    $("#depositSearch").click(function(){
        var args = $('#depositSearchArgs').serialize();
        ajaxExt({
            url:'/report/depositList',
            method:"get",
            data: args,
            callback:function(data) {

                hs.pagination.refleshPages(data.total, "depositSearchArgs");

                $("#depositListTable tr:gt(0)").each(function(){
                    $(this).remove();
                });

                var rows = data.rows;
                if(rows.length>0){
                    $("#depositNullMsg").css("display","none");
                }else{
                    $("#depositNullMsg").css("display","block");
                }
                for(var i = 0;i < rows.length;i++){
                    var tr = $("<tr class=\"listDetail\"></tr>");
                    $(tr).append("<td>"+rows[i].account+"</td>");
                    $(tr).append("<td>"+rows[i].id+"</td>");
                    $(tr).append("<td>"+rows[i].createTime+"</td>");
                    $(tr).append("<td>"+rows[i].amount+"</td>");
                    $(tr).append("<td>"+rows[i].amount+"</td>");
                    var statusName ='';
                    if(rows[i].status==0){
                        statusName ="未处理";
                    }else if(rows[i].status==1){
                        statusName ="失败";
                    }else if(rows[i].status==2){
                        statusName ="完成";
                    }else if(rows[i].status==3){
                        statusName ="已过期";
                    }else if(rows[i].status==4){
                        statusName ="已撤销";
                    }else if(rows[i].status==5){
                        statusName ="正在处理";
                    }else if(rows[i].status==6){
                        statusName ="审核中";
                    }else if(rows[i].status==7){
                        statusName ="审核通过";
                    }else if(rows[i].status==8){
                        statusName ="审核失败";
                    }
                    else if(rows[i].status==99){
                        statusName ="提款挂起";
                    }
                    $(tr).append("<td>"+statusName+"</td>");
                    $(tr).append("<td>"+rows[i].remark+"</td>");
                    $('#depositHeader').append(tr);
                }
            }
        })
    });

    //团队盈亏报表查询
    $("#teamReportSearch").click(function(){
        var args = $('#teamReportSearchArgs').serialize();
        ajaxExt({
            url:'teamList',
            type:"get",
            data: args,
            callback:function(map) {
                var teamHistoryAndNow = $('#teamHistoryAndNow').val();
                $("#allTeamReportListTable tr:gt(0),#allPersonalReportListTable tr:gt(0),#teamReportListTable tr:gt(0),#dayReportListTable tr:gt(0)").each(function(){
                    $(this).remove();
                });
                var userTree = map['userTree'];
                $('#testing').html('');
                jQuery.each(userTree, function(i,item){
                    var ajaxArgs = "&account="+item;
                    ajaxExt({
                        loading:'',
                        url:'/report/ajaxGetUser',
                        method:"get",
                        data: ajaxArgs,
                        async: false,
                        callback: function(success) {
                            var curAccount =success['account'];
                            var curUser =success['user'];
                            if(curAccount==curUser.account){
                                $('#testing').append("<span>当前用户位置：</span><a href='javascript:;' class='fontColorTheme' onclick=\"nextAccount('"+curUser.account+"')\">" + curUser.account + "</a>");
                            }else{
                                $('#testing').append("<span>&gt;</span><a href='javascript:;' class='fontColorTheme' onclick=\"nextAccount('"+curUser.account+"')\">" + curUser.account + "</a>");
                            }
                        }
                    });
                });
                //团队整体汇总结果
                var teamReport =map['teamReport'];
                if(teamReport){
                    var teamTr = $("<tr class=\"listDetail\"></tr>");
                    $(teamTr).append("<td>"+teamReport.actualSaleAmount+"</td>");
                    $(teamTr).append("<td>"+teamReport.rebateAmount+"</td>");
                    $(teamTr).append("<td>"+teamReport.winAmount+"</td>");
                    $(teamTr).append("<td>"+teamReport.activityAndSend+"</td>");
                    $(teamTr).append("<td>"+teamReport.wages+"</td>");
                    $(teamTr).append("<td>"+teamReport.count+"</td>");
                    $(teamTr).append("<td>"+teamReport.rechargeAmount+"</td>");
                    $(teamTr).append("<td>"+teamReport.drawingAmount+"</td>");
                    $('#allTeamReportHeader').append(teamTr);
                }

                //个人汇总结果
                var userReport =map['userReport'];
                if(userReport){
                    var userTr = $("<tr class=\"listDetail\"></tr>");
                    $(userTr).append("<td>"+userReport.actualSaleAmount+"</td>");
                    $(userTr).append("<td>"+userReport.rebateAmount+"</td>");
                    $(userTr).append("<td>"+userReport.winAmount+"</td>");
                    $(userTr).append("<td>"+userReport.activityAndSend+"</td>");
                    $(userTr).append("<td>"+userReport.wages+"</td>");
                    $(userTr).append("<td>"+userReport.count+"</td>");
                    $(userTr).append("<td>"+userReport.rechargeAmount+"</td>");
                    $(userTr).append("<td>"+userReport.drawingAmount+"</td>");
                    $('#allPersonalReportHeader').append(userTr);
                }

                //直接下级分列结果&每日盈亏记录,teamHistoryAndNow=1为每日盈亏,2为团队盈亏
                var pageName = '';
                var nullMsg = '';
                var reportHeader = '';
                var data =map['list'];
                var rows = data.rows;
                if(teamHistoryAndNow==1){
                    pageName = 'dayReportSearchArgs';
                    nullMsg = $('#dayNullMsg');
                    reportHeader = $('#dayReportHeader');
                }else{
                    pageName = 'teamReportSearchArgs';
                    nullMsg = $('#teamNullMsg');
                    reportHeader = $('#teamReportHeader');
                }
                hs.pagination.refleshPages(data.total, pageName);
                if(rows.length > 0){
                    nullMsg.hide();
                    for(var i in rows){
                        var tr = $("<tr class=\"listDetail\"></tr>");
                        $(tr).append("<td><a href='javascript:;' class='fontColorTheme' onclick=\"nextAccount('"+rows[i].account+"')\">" + rows[i].account + "</a></td>");
                        if(teamHistoryAndNow==1){
                            $(tr).append("<td>"+rows[i].createDate+"</td>");
                        }
                        $(tr).append("<td>"+rows[i].actualSaleAmount+"</td>");
                        $(tr).append("<td>"+rows[i].rebateAmount+"</td>");
                        $(tr).append("<td>"+rows[i].winAmount+"</td>");
                        $(tr).append("<td>"+rows[i].activityAndSend+"</td>");
                        $(tr).append("<td>"+rows[i].wages+"</td>");
                        $(tr).append("<td>"+rows[i].count+"</td>");
                        $(tr).append("<td>"+rows[i].rechargeAmount+"</td>");
                        $(tr).append("<td>"+rows[i].drawingAmount+"</td>");
                        reportHeader.append(tr);
                    }
                }else{
                    nullMsg.show();
                }

            }
        });
    });


    //彩中彩团队盈亏报表查询
    $("#teamInReportSearch").click(function(){
        var args = $('#teamInReportSearchArgs').serialize();
        ajaxExt({
            url:'teamInList',
            method:"get",
            data: args,
            callback:function(data) {
                hs.pagination.refleshPages(data.total, "teamInReportSearchArgs");

                $("#teamInReportListTable tr:gt(0)").each(function(){
                    $(this).remove();
                });
                var rows = data.rows;
                if(rows.length>0){
                    $("#teamInNullMsg").css("display","none");
                }else{
                    $("#teamInNullMsg").css("display","block");
                }
                var betAmountNum=0;
                var winAmountNum=0;
                var countNum=0;
                var createDate=0;
                for(var i = 0;i < rows.length;i++){
                    var tr = $("<tr class=\"listDetail\"></tr>");
                    /*$(tr).append("<td>"+rows[i].id+"</td>");*/
                    if(rows[i].createDate==null&&i==0){
                        $(tr).append("<td style='font-weight:bold'>"+rows[i].account+"</td>");
                    }else{
                        $(tr).append("<td>"+rows[i].account+"</td>");
                    }
                    if(rows[i].createDate==null&&i==0){
                        if(rows[i].createDate==null){
                            $(tr).append("<td style='font-weight:bold'>"+"----"+"</td>");
                            createDate =rows[i].createDate;
                        }else{
                            $(tr).append("<td style='font-weight:bold'>"+rows[i].createDate+"</td>");
                            createDate =rows[i].createDate;
                        }
                    }else{
                        if(rows[i].createDate==null){
                            $(tr).append("<td>"+"----"+"</td>");
                            createDate =rows[i].createDate;
                        }else{
                            $(tr).append("<td>"+rows[i].createDate+"</td>");
                            createDate =rows[i].createDate;
                        }
                    }
                    if(rows[i].createDate==null&&i==0){
                        if(rows[i].betAmount==null){
                            $(tr).append("<td style='font-weight:bold'>"+"0"+"</td>");
                        }else{
                            $(tr).append("<td style='font-weight:bold'>"+rows[i].betAmount+"</td>");
                            betAmountNum+=rows[i].betAmount;
                        }
                    }else{
                        if(rows[i].betAmount==null){
                            $(tr).append("<td>"+"0"+"</td>");
                        }else{
                            $(tr).append("<td>"+rows[i].betAmount+"</td>");
                        }
                    }

                    if(rows[i].createDate==null&&i==0){
                        if(rows[i].winAmount==null){
                            $(tr).append("<td style='font-weight:bold'>"+"0"+"</td>");
                        }else{
                            $(tr).append("<td style='font-weight:bold'>"+rows[i].winAmount+"</td>");
                            winAmountNum+=rows[i].winAmount;
                        }
                    }else{
                        if(rows[i].winAmount==null){
                            $(tr).append("<td>"+"0"+"</td>");
                        }else{
                            $(tr).append("<td>"+rows[i].winAmount+"</td>");
                            winAmountNum+=rows[i].winAmount;
                        }
                    }

                    if(rows[i].createDate==null&&i==0){
                        if(rows[i].totalAmount==null){
                            $(tr).append("<td style='font-weight:bold'>"+"0"+"</td>");
                        }else{
                            $(tr).append("<td style='font-weight:bold'>"+rows[i].totalAmount+"</td>");
                            countNum+=rows[i].totalAmount;
                        }
                    }else{
                        if(rows[i].totalAmount==null){
                            $(tr).append("<td>"+"0"+"</td>");
                        }else{
                            $(tr).append("<td>"+rows[i].totalAmount+"</td>");
                            countNum+=rows[i].totalAmount;
                        }
                    }

                    $('#teamInReportHeader').append(tr);
                }
                var tr1 = $("<tr class=\"listDetail\"></tr>");
                $(tr1).append("<td  colspan='2'></td>");

                if(betAmountNum==null){
                    $(tr1).append("<td class='fontColorTheme'>"+"0"+"</td>");
                }else{
                    $(tr1).append("<td class='fontColorTheme'>"+betAmountNum.toFixed(4)+"</td>");
                }
                if(winAmountNum==null){
                    $(tr1).append("<td class='fontColorTheme'>"+"0"+"</td>");
                }else{
                    $(tr1).append("<td class='fontColorTheme'>"+winAmountNum.toFixed(4)+"</td>");
                }
                if(countNum==null){
                    $(tr1).append("<td class='fontColorTheme'>"+"0"+"</td>");
                }else{
                    $(tr1).append("<td class='fontColorTheme'>"+countNum.toFixed(4)+"</td>");
                }
                var time1 = new Date().Format("yyyy-MM-dd");
                if(createDate!=null&&createDate!=time1){
                    $('#teamInReportHeader').append(tr1);
                }
            }
        });

    });
    //团队投注明细
    $("#searchBetList").click(function(){
        var args = $('#betSearchArgs').serialize();
        ajaxExt({
            url:'/game/teamList',
            method:"get",
            data: args,
            callback:function(data) {

                hs.pagination.refleshPages(data.total, "betSearchArgs");

                $("#betRecordListTable tr:gt(0)").each(function(){
                    $(this).remove();
                });

                var rows = data.rows;
                if(rows.length>0){
                    $("#betNullMsg").css("display","none");
                }else{
                    $("#betNullMsg").css("display","block");
                }
                var amount=0;
                var win=0;
                for(var i = 0;i < rows.length;i++){
                    var tr = $("<tr class=\"listDetail\"></tr>");
                    var detailBtn = "";
                    $(tr).append("<td><span class='gameLottListUser overflowEllipsis' title='" + rows[i].account + "'>"+rows[i].account+"</span></td>");
                    $(tr).append("<td>"+rows[i].lotteryName+"</td>");
                    $(tr).append("<td>"+rows[i].playName+"</td>");
                    $(tr).append("<td>"+rows[i].seasonId+"</td>");
                    var content = rows[i].content;
                    if( content.length > 24 ){//超过24个字节则显示详情
                        var n = 0;
                        if(content.indexOf(".")>0) {
                            n = 1;
                            content = content.replace(/\./g,"");
                        }
                        detailBtn = "<a href='javascript:;' class='fontColorTheme showBetDetails' data-id='"+rows[i].id+"' data-n='"+n+"')\">详情</a>";
                    }
                    $(tr).append("<td class='gameLottNumCont'><span class='gameLottListCont overflowEllipsis'>"+content+"</span>" + detailBtn +"</td>");
                    $(tr).append("<td>"+rows[i].createTime+"</td>");
                    $(tr).append("<td>"+rows[i].amount+"</td>");
                    amount+=rows[i].amount;
                    if(rows[i].win!=null){
                        $(tr).append("<td class='fontColorTheme'>"+rows[i].win+"</td>");
                        win+=rows[i].win;
                    }else{
                        $(tr).append("<td>"+"0"+"</td>");
                    }
                    if(rows[i].isTrace){
                        $(tr).append("<td>是</td>");
                    }else{
                        $(tr).append("<td>否</td>");
                    }
                    switch(rows[i].status){
                        case 0:  $(tr).append("<td>未开奖</td>");break;
                        case 1: $(tr).append("<td>已中奖</td>");break;
                        case 2: $(tr).append("<td>未中奖</td>");break;
                        case 3:  $(tr).append("<td>未开始</td>");break;
                        case 4: $(tr).append("<td>个人撤单</td>");break;
                        case 5: $(tr).append("<td>系统撤单</td>");break;
                        case 6:  $(tr).append("<td>未开奖</td>");break;
                        case 7:  $(tr).append("<td>恶意注单</td>");break;
                        case 8:  $(tr).append("<td>暂停</td>");break;
                        case 9:  $(tr).append("<td>追中撤单</td>");break;
                    }
                    $(tr).append("<td id=\"tdStatus_131\"><a href='javascript:void(0);' class='fontColorTheme' onclick=\"showGeneralDetailArea('"+rows[i].id+"',0,1)\">查看</a></td>");
                    $('#betRecordHeader').append(tr);
                }
                var tr1 = $("<tr class=\"listDetail\"></tr>");
                $(tr1).append("<td  class='fontColorTheme' colspan='6' id=\"tdStatus_131\">汇总小结</td>");

                if(amount==null){
                    $(tr1).append("<td class='fontColorTheme'>"+"0"+"</td>");
                }else{
                    $(tr1).append("<td class='fontColorTheme'>"+amount.toFixed(4)+"</td>");
                }
                if(win==null){
                    $(tr1).append("<td class='fontColorTheme'>"+"0"+"</td>");
                }else{
                    $(tr1).append("<td class='fontColorTheme'>"+win.toFixed(4)+"</td>");
                }
                $(tr1).append("<td colspan='3'></td>");

                $('#betRecordHeader').append(tr1);
            }
        })
    });
    //团队帐变明细
    $("#searchSettlementList").click(function(){
        var args = $('#settlementSearchArgs').serialize();
        ajaxExt({
            url:'/report/settlementList',
            method:"get",
            data: args,
            callback:function(data) {

                hs.pagination.refleshPages(data.total, "settlementSearchArgs");

                var rows = data.rows;

                var amount=0;
                var trs = '';
                for(var i = 0;i < rows.length;i++){
                    var d = rows[i];
                    trs += '<tr class="listDetail">';
                    trs += "<td>"+(i+1)+"</td>";
                    trs += "<td>"+d.account+"</td>";
                    trs += "<td>"+d.lotteryName+"</td>";
                    trs += "<td>"+d.seasonId+"</td>";
                    trs += "<td>"+d.playName+"</td>";
                    if (d.amount>=0) {
                        trs += "<td class='fontColorGreen'>收入</td>";
                    } else {
                        trs += "<td class='fontColorTheme'>支出</td>";
                    }
                    trs += "<td>" + d.createTime + "</td>";
                    if(d.amount>=0){
                        trs += "<td class='fontColorGreen'>"+d.amount+"</td>";
                    }else{
                        trs += "<td class='fontColorTheme'>"+ d.amount+"</td>";
                    }
                    amount = amount.add(d.amount);
                    var unitName;
                    if(d.unit==2){
                        unitName="元";
                    }else if(d.unit==0.2){
                        unitName="角";
                    }else{
                        unitName="分";
                    }
                    trs += "<td>"+unitName+"</td>";
                    trs += "<td>"+d.balance+"</td>";
                    trs += "<td>"+d.changeType+"</td>";
                    trs += '</tr>';
                }
                if(rows.length>0){
                    trs += '<tr class="listDetail">';
                    trs += '<td  class="fontColorTheme" colspan="7" id="tdStatus_131">汇总小结</td>';
                    trs += '<td class="fontColorTheme">'+amount.toFixed(4)+'</td>';
                    trs += '<td colspan="3"></td>';
                    $("#settlementNullMsg").css("display","none");
                } else {
                    $("#settlementNullMsg").css("display","block");
                }
                $('#settlementRecordHeader').html(trs);
            }
        });
    });

    $(document).on("click","a.showBetDetails",function(){
        var content = $(this).prev().text();
        var id = $(this).attr("data-id");
        var n = $(this).attr("data-n");

        $("#contentDetails").html(content);
        $("#contentDetailsPlan").attr("data-id",id);
        $("#contentDetailsPlan").attr("data-n",n);
        layer.open({
            type: 1,
            skin: 'generalLayer',
            shift: 5,
            area:['420px','250px'],
            title:'详情',
            content:$('#contentDetailsArea'),
            success:function(){
                $('.closeBtn').on('click',function(){
                    layer.closeAll();
                });
            }
        });
    });

    //详情内容滚动
    $("#delContentPlan,#contentDetailsPlan").scroll(function(){
        var plan = $(this);
        var div = plan.find("div:first");
        var mainHeight = plan.height();
        var scroTop = plan.scrollTop();
        var height = div.height();

        if (mainHeight + scroTop ==height)     //当文档的高度小于或者等于总的高度的时候，开始动态加载数据
        {
            var n =  parseInt( plan.attr("data-n") );
            if(isNaN(n) || n<1){
                //不需要加载数据
                return;
            }
            var id = plan.attr("data-id");
            var args = {id:id,n:n};
            ajaxExt({
                loading:'',
                url:'/game/contentDetails',
                method:"get",
                dataType:'json',
                data: args,
                callback:function(content) {
                    //TODO
                    if(content.indexOf(".")>0){
                        content = content.replace(/\./g,"");
                        n++;
                    } else {
                        n=0;
                    }
                    $("#delContentPlan").attr("data-n",n);
                    $("#contentDetailsPlan").attr("data-n",n);
                    $("a.showBetDetails[data-id='"+id+"']").attr("data-n",n);



                    $("a.showBetDetails[data-id='"+id+"']").prev().append(content);
                    var old = div.text();
                    old = old.replace(/\./g,"")+content;
                    if(n>0){
                        old+="...";
                    }
                    div.text(old);
                }
            });
        }
    });

})
//选择方式：1：查询每日盈亏记录；2：查询团队盈亏详情
function teamRecord(n, ele){
    $(ele).addClass('active').siblings('.searchTeamBtn').removeClass('active');

    if(n==1){
        $('#teamRemarks').html("※每日盈亏记录※ 会统计您与下级团队查询时间内的盈亏总和，每天一条记录。不包含当天数据 ");
        $('#showChoose').css('display','none');
        $('#teamAccount').val('');
        $('#teamConditionStartTime').val(webProfitBiginTime);
        $('#teamConditionEndTime').val(webProfitEndTime);
        $('#teamHistoryAndNow').val(1);
        $('#dayReportBox').show();
        $('#allTeamReportBox,#allPersonalReportBox,#teamReportBox').hide();

    }else{
        $('#teamRemarks').html("※团队盈亏详情※ 会统计您查询时间内的团队盈亏总和，以及下一级的团队盈亏总和。包含当天数据");
        $('#showChoose').css('display','inline-block');
        $('#teamConditionStartTime').val(webProfitBiginTime);
        $('#teamConditionEndTime').val(webProfitEndTime);
        $('#teamHistoryAndNow').val(2);
        $('#dayReportBox').hide();
        $('#allTeamReportBox,#allPersonalReportBox,#teamReportBox').show();
    }
}
//选择1：今日；2：昨日；其他：本月
function chooseTime(n, ele){
    $(ele).addClass('active').siblings().removeClass('active');
    if(n==1){
        $('#teamConditionStartTime').val(webProfitBiginTime);
        $('#teamConditionEndTime').val(webProfitEndTime);
        $('#teamRemarks').html("※团队盈亏详情※ 会统计您查询时间内的团队盈亏总和，以及下一级的团队盈亏总和。仅今日数据");
    }else if(n==2){
        $('#teamConditionStartTime').val(GetDateStr(-1));
        $('#teamConditionEndTime').val(GetDateStr(-1));
        $('#teamRemarks').html("※团队盈亏详情※ 会统计您查询时间内的团队盈亏总和，以及下一级的团队盈亏总和。仅昨天数据");
    }else{
        $('#teamConditionStartTime').val(getMonthFirst());
        $('#teamConditionEndTime').val(webProfitEndTime);
        $('#teamRemarks').html("※团队盈亏详情※ 会统计您查询时间内的团队盈亏总和，以及下一级的团队盈亏总和。包含当天数据");
    }
}
//根据参数AddDayCount获取哪一天的日期，-1表示获取昨天的日期
function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth()+1;//获取当前月份的日期
    var d = dd.getDate();
    if (m<10){
        m = "0"+m;
    }
    if (d<10){
        d = "0"+d;
    }
    return y+"-"+m+"-"+d;
}
//获取本月的第一天日期
function getMonthFirst(){
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth()+1;
    if (month<10){
        month = "0"+month;
    }
    return year+"-"+month+"-"+"01";
}

function nextAccount(account){
    $("#teamAccount").val(account);
    $("#teamReportSearch").click();
}

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//查看详情
function showGeneralDetailArea(id,stutasId,Type){
    var unitName;
    var delWinName;
    $.getJSON("/game/ajaxGetBet","id="+id,function(data){

        $("#delLotteryName").text(data.lotteryName);
        $("#delLotteryName").attr('data-lotteryId',data.lotteryId);
        $("#delSeasonId").text(data.seasonId);
        $("#delCreateTime").text(data.createTime);
        if(data.unit==2){
            unitName="元";
        }else if(data.unit==0.2){
            unitName="角";
        }else if(data.unit==0.02){
            unitName="分";
        }else{
            unitName="厘";
        }
        $("#delAmounts").text("￥"+data.amount);
        $("#number").text(data.id);
        $("#delPlayName").text(data.playName);
        $("#delContent").text(data.content);
        if(data.content.indexOf(".")>0){
            $("#delContentPlan").attr("data-id",data.id);
            $("#delContentPlan").attr("data-n",1);
        }
        $("#delBetCount").text(data.betCount);
        $("#delPrice").text(data.price);
        $("#delAmount").text("￥"+data.amount);
        $("#delUnit").text(unitName);
        if(data.openNum!=null){
            $("#delOpenNum").text(data.openNum);
        }else{
            $("#delOpenNum").text("");
        }

        var bonusType;
        if(data.bonusType==0){
            bonusType ="高奖";
        }else{
            bonusType="高返";
        }
        $("#delBonusType").text(bonusType);
        if(data.status==0||data.status==3||data.status==6){
            delWinName="等待开奖";
        }else if(data.status==4||data.status==5||data.status==9){
            delWinName="已撤单";
        }else if(data.status==1||data.status==2){
            delWinName="￥"+data.win;
        }else if(data.status==8){
            delWinName="暂停";
        }else if(data.status==7){
            delWinName="恶意注单";
        }
        $("#delWin").text(delWinName);

        layer.open({
            type: 1,
            skin: 'generalLayer',
            shift: 5,
            area:['960px','425px'],
            title:'详情',
            content:$('#generalDetailArea'),
            success:function(){
                $('.closeBtn').on('click',function(){
                    layer.closeAll();
                });
            }
        });
    });
}