$(document).ready(function(){
	
	//通过彩种初始化获取玩法和期号
//	$('#lotteryId').change(function(){ 
//		var p=$(this).children('option:selected').val();//这就是selected的值 
//		args = "&lotteryId="+p;
//		ajaxExt({
//			loading:'',
//			url:'ajaxSelect',
//			method:"get",
//			data: args,
//			callback:function(success) {			
//				var data = success.seasonList;
//				var map =success.playerMap;
//				
//				var s ='<option value="">所有期号</option>';
//				for(var i=0;i<data.length;i++){
//					s+='<option class="options" value="'+data[i]+'">'+ data[i]+'</option>';			
//				}
//				$('#seasonId').html(s);
//			}
//		});
//	});
	
	$("#reBet").click(function(){
		var betId = $("#number").text();
		var lotteryId = $("#delLotteryName").attr('data-lotteryId');
		var url = '/lotts/'+lotteryId+'/reBet';
		ajaxExt({
			url:url,
			method:'post',
			data:{betId:betId},
			callback:function(rel) {
				$.alert('投注成功');
				$("#search").click();
			}
		});
	});
//	$('#traceLotteryId').change(function(){ 
//		var p=$(this).children('option:selected').val();//这就是selected的值 
//		args = "&lotteryId="+p;
//		ajaxExt({
//			loading:'',
//			url:'ajaxSelect',
//			method:"get",
//			data: args,
//			callback:function(success) {			
//				var data = success.seasonList;
//				var map =success.playerMap;
//				var d= " ";
//				for (var key in map) { 
//		              var p="<option class=\"tracePlayerOptions\" value="+key+">"+map[key]+"</option>";
//						d+=p;
//		          } 
//				
//				
//				var s =" ";
//				for(var i=0;i<data.length;i++){
//					var t="<option class=\"traceOptions\" value="+data[i]+">"+ data[i]+"</option>";
//					s+=t;			
//				}
//				$('#traceOption').after(s);
//				$('#tracePlayerOption').after(d);
//			}
//		});
//	});
	
	//投注记录
	$("#search").click(function(){
		var args = $('#searchArgs').serialize();
//		if(!$("#betBox:checked").length){     
//			args += "&includeChildren=0";
//		}
		ajaxExt({
			url:'/game/list',
			method:"get",
			data: args,
			callback:function(data) {
				hs.pagination.refleshPages(data.total, "searchArgs");
				$("#gameRecordListTable tr:gt(0)").remove();
				
				var rows = data.rows;
				if(rows.length>0){
					$("#nullMsg").css("display","none");
				}else{
					$("#nullMsg").css("display","block");
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
					$('#gameRecordHeader').append(tr);
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
				
				$('#gameRecordHeader').append(tr1);
			}
		})
	});
	//追号记录查询
	$("#searchTraceList").click(function(){
		var args = $('#traceSearchArgs').serialize();
//		if(!$("#traceBox:checked").length){     
//			args += "&isLowerLevel=0";
//		}
		ajaxExt({
			url:'/game/traceList',
			method:"get",
			data: args,
			callback:function(data) {

				hs.pagination.refleshPages(data.total, "traceSearchArgs");
				$("#traceRecordListTable tr:gt(0)").each(function(){
					$(this).remove();
				});
				
				var rows = data.rows;
				if(rows.length>0){
					$("#traceNullMsg").css("display","none");
				}else{
					$("#traceNullMsg").css("display","block");
				}
				
				for(var i = 0;i < rows.length;i++){
					var tr = $("<tr class=\"listDetail\"></tr>");
					/*$(tr).append("<td>"+rows[i].id+"</td>");*/
					$(tr).append("<td>"+rows[i].account+"</td>");
					$(tr).append("<td>"+rows[i].lotteryName+"</td>");
					$(tr).append("<td>"+rows[i].startSeason+"</td>");
					
					$(tr).append("<td>"+rows[i].finishTraceNum+"/"+rows[i].traceNum+"</td>");
					$(tr).append("<td>"+rows[i].finishTraceAmount+"/"+rows[i].traceAmount+"</td>");
				
					switch(rows[i].isWinStop){
					 case 0: $(tr).append("<td>否</td>");break;
					 case 1: $(tr).append("<td>是</td>");break;
					 }
					$(tr).append("<td>"+rows[i].createTime+"</td>");		
					if(rows[i].status==0){
						$(tr).append("<td>进行中</td>");
					}else{
						$(tr).append("<td>已完成</td>");
					}
					$(tr).append("<td  id=\"tdStatus_131\"><a href=\"javascript:;\" class='fontColorTheme' onclick=\"showTraceSummary('"+rows[i].id+"',1)\">查看</a></td>");
					$('#traceRecordHeader').append(tr);
				}
			
			}
		})
	});
	
	//撤销投注
	$(document).on("click","a.cancelOrder",function(ev){
		var a = $(this);
		var url = a.attr("href");
		ajaxExt({
			url:url,
			timeout:10000,
			callback:function(rel){
				a.parent("td").prev().text("个人撤单");
				a.remove();
				$.alert("撤销成功");
			}
		});
		ev.stopPropagation();
		ev.preventDefault();
		return false;
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
	
});
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
			delWinName="￥"+ (data.win.sub( data.amount));
		}else if(data.status==8){
			delWinName="暂停";
		}else if(data.status==7){
			delWinName="恶意注单";
		}
		$("#delWin").text(delWinName);
		if(data.status==0||data.status==3){
			if(account==data.account){
				$('#cancelOrder').html("<a href=\"javascript:void(0);\" class=\"btn repealOrder\" onclick=\"cancelOrderScheme('"+data.id+"','"+data.lotteryId+"','"+stutasId+"','"+Type+"')\">撤单</a>");	
			}else{
				$('#cancelOrder').html("");
			}
		} else {
			$('#cancelOrder').html("");
		}
		
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

function closeGeneralDetailArea(){
	$("#generalDetailArea").hide();
	$("#search").click();
}
//撤销方案撤单
function cancelOrderScheme(id,lotteryId,statusId,type){
	var args ="&ids="+id;
	$.getJSON("/lotts/"+lotteryId+"/cancelOrder",args,function(data){
		if(data.status==200){			
			$.alert('撤单成功！');
			if(statusId==0&&type==1){
				closeGeneralDetailArea();
			}else{
				showTraceSummary(statusId);
			}
			
		}else{			
			$.alert('不是当期，不允许撤单！');
		}
	});
}



//显示追号具体列表
function showTraceSummary(id){
	var traceArgs="&id="+id;
	$.getJSON("/game/findTraceById",traceArgs,function(data){
	$("#summaryId").text(data.id);
	$("#summaryStartSeasonId").text(data.startSeason);
	$("#summaryCreateTime").text(data.createTime);
	$("#summaryLotteryName").text(data.lotteryName);
	$("#summaryProcess").text("已追"+data.finishTraceNum+"期/总"+data.traceNum+"期");
	$("#summaryFinishTraceAmount").text("￥"+data.finishTraceAmount+"元");
	$("#summaryTraceAmount").text("￥"+data.traceAmount+"元");
	if(data.isWinStop==1){
		$("#summaryIsWinStop").text("中奖即停");
	}else{
		$("#summaryIsWinStop").text("追中不停");
	}
	if(data.winAmount!=null){
		$("#summaryWinAmount").text("￥"+data.winAmount+"元");
	}else{
		$("#summaryWinAmount").text("￥"+"0.00"+"元");
	}
	});
	var page = 1;
	var rows = 10;
	var args ="&traceId="+id;
	args += "&page="+page+"&rows="+rows;
	$.getJSON("/game/summaryList",args,function(data){
		
		$("#summaryListTable tr:gt(0)").each(function(){
			$(this).remove();
		});
		
		$("#schemeListTable tr:gt(0)").each(function(){
			$(this).remove();
		});
		var rows = data.rows;
		var curAccount="";
		for(var i = 0;i < 1;i++){
			var tr = $("<tr class=\"listDetail\"></tr>");
			$(tr).append("<td>"+rows[i].playName+"</td>");
			var content = rows[i].content;
			var detailBtnByTrace = "";
			if( content.length > 24 ){//超过24个字节则显示详情
				var n = 0;
				if(content.indexOf(".")>0) {
					n = 1;
					content = content.replace(/\./g,"");
				}
				var detailBtnByTrace = "<a href='javascript:;' class='fontColorTheme showBetDetails' data-id='"+rows[i].id+"' data-n='"+n+"')\">详情</a>";
			}
			$(tr).append("<td class='gameLottNumCont' style='text-align :center'><span class='gameLottListCont overflowEllipsis'>"+content+"</span>" + detailBtnByTrace +"</td>");
			$(tr).append("<td>"+rows[i].betCount+"</td>");
		    $(tr).append("<td>"+1+"</td>");
			if(rows[i].unit==2){
				$(tr).append("<td>"+"元"+"</td>");
			}else if(rows[i].unit==0.2){
				$(tr).append("<td>"+"角"+"</td>");
			}else if(rows[i].unit==0.02){
				$(tr).append("<td>"+"分"+"</td>");
			}else{
				$(tr).append("<td>"+"厘"+"</td>");
			}
			curAccount = rows[i].account;
			$('#detailHeader-c').append(tr);
		}
		var strId = "";
		var lotteryId ="";
		for(var i = 0;i < rows.length;i++){
			var statusName;
			
			lotteryId=rows[0].lotteryId;
			var tr = $("<tr class=\"listDetail\"></tr>");
			$(tr).append("<td>"+rows[i].seasonId+"</td>");
			$(tr).append("<td>"+rows[i].price+"</td>");			
			$(tr).append("<td>"+rows[i].amount+"</td>");
			if(rows[i].openNum!=null){
				$(tr).append("<td>"+rows[i].openNum+"</td>");
			}else{
				$(tr).append("<td>"+" "+"</td>");
			}
			if(rows[i].win!=null){
				$(tr).append("<td class='fontColorTheme'>"+rows[i].win+"</td>");
			}else{
				$(tr).append("<td>"+" "+"</td>");
			}
			if(rows[i].status==0||rows[i].status==6){
				statusName="等待开奖";
				strId += rows[i].id + ",";
			}else if(rows[i].status==3){
				statusName="未开始";
				strId += rows[i].id + ",";
			}else if(rows[i].status==4){
				statusName="个人撤单";
			}else if(rows[i].status==1)
			{
				statusName="已中奖";
			}else if(rows[i].status==2){	
				statusName="未中奖";
			}else if(rows[i].status==5){
				statusName="系统撤单";
			}else if(rows[i].status==8){
				statusName="暂停";
			}else if(rows[i].status==9){
				statusName="追中撤单";
			}else if(rows[i].status==7){
				statusName="恶意注单";
			}
			$(tr).append("<td>"+statusName+"</td>");	
			
			if(rows[i].status==0||rows[i].status==3){
				var txt ="<td id=\"tdStatus_131\"><a href=\"javascript:void(0);\" class='fontColorTheme' onclick=\"showGeneralDetailArea('"+rows[i].id+"','"+id+"',2)\">查看</a>";
				if(account==rows[i].account){
					txt +='&nbsp;&nbsp;<a class="cancelOrder fontColorTheme" id=\"cancelOrderByTrace\" href="/lotts/'+rows[i].lotteryId+'/cancelOrder?ids='+ rows[i].id + '">撤单</a>'+"</td>";
				}else{
					txt+="&nbsp;&nbsp</td>";
				}
				/*$(tr).append("<td id=\"tdStatus_131\"><a href=\"javascript:void(0);\" class='fontColorTheme' onclick=\"showGeneralDetailArea('"+rows[i].id+"','"+id+"',2)\">查看</a>&nbsp;&nbsp;" +
								'<a class="cancelOrder" id=\"cancelOrderByTrace\" href="/lotts/'+rows[i].lotteryId+'/cancelOrder?ids='+ rows[i].id + '">撤单</a>'+"</td>");*/
				$(tr).append(txt);
			}else{
				$(tr).append("<td id=\"tdStatus_131\"><a href=\"javascript:void(0);\" class='fontColorTheme' onclick=\"showGeneralDetailArea('"+rows[i].id+"','"+id+"',2)\">查看</a></td>");
				$(".operate").remove("#cancelOrderByTrace");
			}
		
						 
			$('#detailHeader-d').append(tr);
		}
		//去掉最后一个逗号(如果不需要去掉，就不用写) 
	    if (strId.length > 0) { 
	    	strId = strId.substr(0,strId.length - 1); 
	    }
	    if(account==curAccount){
		 $('#endAppNum').html("<a href=\"javascript:;\" class=\"btn repealOrder\" onclick=\"cancelOrderScheme('"+strId+"','"+lotteryId+"','"+id+"')\">终止追号</a>");
	    }else{
	    	 $('#endAppNum').html("");
	    }
	});
	$("#traceDelList").hide();
	$("#traceSummaryList").show();
}

function getBack(){
	$("#traceDelList").show();
	$("#traceSummaryList").hide();
}