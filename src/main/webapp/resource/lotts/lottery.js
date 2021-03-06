var hasNum = false;//是否有最新开奖号码
var useAnimate = false;	//使用动画
var timeAnimate = true;//时间到开启动画
var fireCount = 1;//火焰效果倍数增加计数器
var fireOff = false;//火焰效果开关，false为关闭
var audioCount = true;//开奖声音开关，false为关闭
var totleForecast = 0;//定额投注总盈利

function numberFormat(n) {
	if (n < 10)
		return "0" + n;
	else
		return n;
}

// 倒计时
function refererTime() {
	var allSecond = parseInt($("#saleAllSecond").attr("data-second"));
	allSecond -= 1;
	if (allSecond >= 0) {
		var hour = parseInt(allSecond / 3600);
		var minute = parseInt((allSecond % 3600) / 60);
		var second = parseInt(allSecond % 60);

		$("#saleAllSecond").attr("data-second", allSecond);
		var t = numberFormat(hour) + ":" + numberFormat(minute) + ":"
				+ numberFormat(second);
		$("#saleHour").text(numberFormat(hour));
		$("#saleMintue").text(numberFormat(minute));
		$("#saleSecond").text(numberFormat(second));

		$(".seasonTime").text(t);
	}
	
	if(allSecond <= 0) {
		getInfo();
	}
}

//显示隐藏可输入下拉框
function inputSelectFrame(ele) {
	var inputOptions = $(ele).next();
	$(inputOptions).is(':hidden') ? $(inputOptions).show() : $(inputOptions).hide();
	$(ele).parent().hover(function(){},function(){
		$(inputOptions).hide();
	});
}
//选择并赋值
function inputSelectConfirm(ele) {
	$(ele).parent().prev().prev().val(ele.innerHTML);
	refererPage();
	inputSelectFrame($(ele).parent().prev());
}
//减少倍数
function reduceMult(ele) {
	var modifyEle = $(ele).siblings('input');
	var betPrice = modifyEle.val();
	if (betPrice > 1) {
		modifyEle.val( betPrice - 1 );
		refererPage();
	}
}
//增加倍数
function addMult(ele) {
	var modifyEle = $(ele).siblings('input');
	var betPrice = modifyEle.val();
	if (betPrice < 9999) {
		modifyEle.val( parseInt(betPrice) + 1 );
		refererPage();

		//火焰效果：当计数器大于3时显示
		if (fireOff) {
			++fireCount;
			if (fireCount > 3 && fireCount < 15) {
				if (fireEffectCount) {

					//第一次只显示火焰,通过fireEffectCount来判断是否为第一次
					fireEffect();//fire effect
					fireEffectCount = false;

				} else {

					//之后调整画布大小，来使火焰变大
					var fireBox = $("#surface"),
						fireWidth = fireBox.width() + 2,
						fireHeight = fireBox.height() + 4,
						fireLeft = parseInt(fireBox.css('left')) - 1;

					fireBox.css({
						width: fireWidth,
						height: fireHeight,
						left: fireLeft
					});

				}
			}
		}
	}
}

//var getInfoIng = false;
// 获取最新数据
function getInfo() {
//	if(getInfoIng) return;
//	getInfoIng = true;
	ajaxExt({
		loading:'',
		noError:true,
		url : 'info',
//		complete:function(){
//			getInfoIng = false;
//		},
		callback : function(data) {
			var amount = data.amount.toFixed(4);
			$("#userAmount").text(amount);
			$("#currAmount").text(amount);
			if ( $("#accountHide").attr('data-value') == "false" ){
				$("#userBalance").text(amount);
			}
			$("#userBalance").attr("title",amount);
			$("#saleAllSecond").attr("data-second", data.allSecond); // 销售时间
			var saleSeasonId = $("#saleSeasonId").text();
			if (data.seasonId != saleSeasonId) {
				$("#saleSeasonId").text(data.seasonId); 	// 销售期号
				$("#saleSeasonId1").text(data.seasonId); 	// 销售期号(追号确认)
				var seasonCount = data.seasonCount;
				$("#openCount").text(seasonCount.openCount);
				$("#remainCount").text(seasonCount.allCount - seasonCount.openCount);//剩余期数
				$(".traceList").html("");	//清空追号功能
				$.alert("您好, <span>" + saleSeasonId + "</span> 期 已截止销售,<br/>当前期为 <span class='fontColorTheme fontBold'>"+data.seasonId+"</span> 期 ，请留意！", "", 3000);

				//截止投注提示窗口3秒消失
				var closeBtn = $(".dialogBoxContent[data-type='alert']:visible").find('a.closeBtn');
				var closeBtnText = closeBtn.html();
				closeBtn.html(closeBtnText + '(3)');
				var count = 3;
				$(closeBtn).everyTime('1s', 'alertCloseBtn' + saleSeasonId, function(){
					if(count == 0){
						$(this).stopTime('alertCloseBtn' + saleSeasonId);
						$(this).click();
						return;
					}
					--count;
					$(this).html(closeBtnText + '(' + count + ')');
				});

				//开启动画
				if(useAnimate) {
					if(timeAnimate) {	//时间到开启
						hasNum = false; //未开奖
						lottNumAnimate();//执行动画
					}
				}
//				else {
					//不要动画则只有开奖才运行即可
//					lottNumBaseAnim();
//				}
				//有新奖期就再拉一次。以便更快的获取开奖号码
				$(this).oneTime('1s', function(){
					getInfo();
				});
			}
			
			refererBetList(data.bets,false);
			refererTraceList(data.traces,false);

			var lastOpen = data.lastOpen;

			var openSeasonId = $("#openSeasonId").text();

			if (lastOpen.seasonId != openSeasonId) {
				$("#openSeasonId").text(lastOpen.seasonId);
				// 大号码
				//var ns = "";
				for ( var n in lastOpen.nums) {
					var num = lastOpen.nums[n];
					//---新开奖号码动画
					$('.lottNumDetail').eq(n).find('.bigNum' + num).eq(0).parent().addClass('active').siblings().removeClass('active');//开奖号码动画
				}

				hasNum = true; //已开奖
				//开启动画
				if(useAnimate) {
					if(!timeAnimate) {	//不是到时开启，在时间到的时候已经开启了
						lottNumAnimate();//执行动画
					}
				} else {
					lottNumBaseAnim();
				}

				//号码列表
				var openList ="";
				var openListCont = 0;
				if (hs.lottery.pk10) {
					var pkop = data.opens[0].nums.split(",");
					for(var m in pkop) {
						openList += '<tr class="beforeLottNumDetail">';
						openList += '<td>第' + (Number(m) + 1) + '名</td>';
						openList += '<td><span class="currLottNum' + pkop[m] + '"></span></td>';
						openList += '</tr>';
					}
				} else {
					for(var n in data.opens){
						var op = data.opens[n];
						openList += '<tr class="beforeLottNumDetail">';
						if (hs.lottery.k3) {
							openList += '<td class="smallFont12">' + op.seasonId.substring(op.seasonId.length-3,op.seasonId.length) + '</td>';
							openList += '<td class="fontColorTheme beforeLottNum k3">';
							for (var n in op.nums) {
								openList += '<span class="k3-' + op.nums[n] + '" data-value="' + op.nums[n] + '"></span>&nbsp;';
							}
							openList += '</td>';
							openList += '<td class="k3SumTd"></td>';
						} else {
							openList += '<td>' + op.seasonId + '</td>';
							openList += '<td class="fontColorTheme beforeLottNum">';
							for (var n in op.nums) {
								openList += '<span>' + op.nums[n] + '</span> ';
							}
							openList += '</td>';
						}
						openList += '</tr>';
						openListCont++;
						if (openListCont >= 5) break;
					}
				}
				
				$("#openList").html(openList);
				
				hs.lottery.k3 && k3Sum();
				
				//号码形态
				var xtt = "";
				var numStatus = data.numStatus;
				for(var n in numStatus){
					var d = numStatus[n];
					xtt+='<span class="lottTypeInfo">'+d+'</span>'; 
				}
				$("#openNumStatus").html(xtt);
			}
			
			// 中奖通知
			var userNotice = data.userNotice;
			//userNotice 的格式 [{id,account,content,createTime,status},....]
			if(!userNotice) return;
			
			//弹窗需求：右下角弹出，最多5个，3秒后消失。
			$(userNotice).each(function(){
				//每1秒弹出一个中奖窗口，避免重叠
				var currAwardTime = $(userNotice).index($(this)) * 2 + 's';
				$(this).oneTime(currAwardTime, function(){
					//控制最多显示5个
					var awardsTotal = $('#awardsMsgGroup .awardsMsgBox');
					if ( awardsTotal.length > 5 ){
						$(awardsTotal).eq(0).find('.closeAwardsMsg').click();
					}
					creatAwardsMsgDialog(this);
					if (audioCount) {
						audio5js.pause();//暂停上一个中奖窗口的声音
						audio5js.play();//中奖声音
					}
					$('#awardsMsgBox' + this.id).oneTime('1ds', function(){
						$(this).addClass('awardsShowBox');
					});
					//3秒后消失
					$('#awardsMsgBox' + this.id).oneTime('8s', function(){
						$(this).find('.closeAwardsMsg').click();
					});
				});
			});
		}
	});
}


function singleDelete(content){
	if(content){
		if(content.indexOf("|")>0){
			content = content.substring(content.indexOf("|")+1);
		}
	}
	return content;
}

// 获取号码盘的信息
function getSelectInfo() {
	var play = $(".lottTypeBox:visible")// 当前玩法组
	.find(".lottTypeDetail.active"); // 玩法
	
	
	var playId = play.attr("data-show"); // 玩法ID
	var playTitle = play.attr("data-title"); // 玩法名称

	var allText = "";
	
	// 号码盘
	$(playId).find(".numList").each(function(k, v) {
		var a = $(this).find("a.active");
		if (a.length == 0) {
			allText += "|-";
		} else {
			var t = "";
			a.each(function(n, m) {
				var num = $(this).attr("data-num");
				t += "," + num;
			});
			allText += "|" + t.substring(1);
		}
	});
	

	
	var anySelect = $(playId).attr("data-anySelect");
	var selectNum = 1;
	var mustNum = 1;
	var title = '';
	if(anySelect!=''){
		var selInput = $(playId).find("input.anySelect:checked");
		selectNum = selInput.length;
		mustNum = parseInt(anySelect);
		if(selectNum>=anySelect){
			selInput.each(function(){
				title+=$.trim($(this).val());
			});
			title+="|";
		}
	}
	
	var info = null;
	var pId = playId.substring(1);
	if(allText != ''){
		//复式
		allText = allText.substring(1);
		info = lottery.run(pId, allText);
	} else {
		//单式
		allText = $(playId).find(".singleNum").val();
		allText = singleDelete(allText);
		
		info =  lottery.run(pId, allText);
		if(allText==''){
			$(playId).find(".singleMsg").show();
		} else{
			$(playId).find(".singleMsg").hide();
		}
	}
	info.title = playTitle;
	info.content = title+ info.content;
	info.count = info.count.mul(lottery.combin(selectNum,mustNum));
	return info;
}

// 刷新信息,选号的统计数据
function refererPage() {
	var info = getSelectInfo();
	var unit = $("#amountType").val(); // 单价，圆角分模式
	if (unit == undefined) {
		unit = parseFloat($("a.amountType.active").attr("data-unit")); // 单价，圆角分模式
	}
	var price = parseInt($("#betPrice").val()); // 倍数
	if ( $("#betPrice").val() == "" ) price = 0;
	var amount = price.mul(info.count).mul(unit); // 总额度

	$("#betsCount").text(info.count);
	$("#betsPriceCount").text(price);
	$("#betsAmountCount").text(amount);

	//预计盈利
	var playBonus = $('#playBonus').html();
	var bonus = parseFloat(playBonus.substr(playBonus.indexOf('-')+1));
	if(info.count > 0){
		$('#betsAmountForecast').text((bonus * unit / 2 * price - amount).toFixed(2));
	}else{
		$('#betsAmountForecast').text('0');
	}

	var allCount = 0;
	var allAmount = 0;
	$("#selectBetPanle tr").each(function() {
		allCount = allCount.add(parseInt($(this).attr("data-count")));
		allAmount = allAmount.add(parseFloat($(this).attr("data-amount")));
	});
	$("#appNumCount").text(allCount);
	$("#appNumAmount").text(allAmount);
}

//刷新追号面板
function referereTrace() {
	var allMoney = 0;
	var allNum = 0;
	$(".appendBox:visible .traceList tr.listDetail").each(function() {
		var seasonId = $(this).find("input[name='seasonId']");
		if (seasonId.is(":checked")) {
			var price = $(this).find("td:eq(3)").attr("data-price");
			allMoney = allMoney.add(parseFloat(price));
			allNum += 1;
		}
	});
	var count = parseInt($("#traceBox").attr("data-count"));
	
	var allCount = allNum.mul(count);
	$("#traceAllNum").text(allNum);			//期数
	$("#traceAllCount").text(allCount);		//注数
	$("#traceAllMoney").text(allMoney);		//总额
}

function shortSeason(seasonId) {
	var index = seasonId.indexOf("-");
	if(index>0) {
		return seasonId.substring(index + 1);
	} else {
		return seasonId.substring(seasonId.length-3);
	}
}

//追号投注列表
function refererTraceList(traces,isAppend){
	var tr = "";
	for ( var n in traces) {
		var trace = traces[n];		
		var win = 0;
		if(trace.winAmount!=null) {
			win = trace.winAmount;
		}
		
		var statusStr = null;
		if(trace.status == 0) {
			statusStr = "进行中";
		} else if(trace.status == 8) {
			statusStr = "暂停";
		} else {
			statusStr = "已完成";
		}
		
		win = win.sub(trace.finishTraceAmount);
		tr += '<tr class="beforeLottNumDetail" onclick="showTraceSummary(\'' + trace.id + '\')">';
		tr += '<td>' + shortSeason(trace.startSeason) + '</td>';
		tr += '<td>' + statusStr + '</td>';
		tr += '<td class="fontColorTheme">'+ trace.traceAmount + '</td>';
		if (win > 0){
			tr += '<td class="fontColorGreen">' + win;
		} else {
			tr += '<td class="fontColorRed">' + win;
		}
		tr += '</td></tr>';
	}
	if(isAppend){
		$("#traceTable").prepend(tr);	//加到前面
		$("#traceTable .lottInfoDetail:gt(5)").remove();
	} else {
		$("#traceTable").html(tr);	//全部替换
	}
}

//刷新我的投注
function refererBetList(bets,isAppend){
	var tr = "";
	for ( var n in bets) {
		var bet = bets[n];

		tr += '<tr class="beforeLottNumDetail" onclick="showGeneralDetailArea(\'' + bet.id + '\', 0, 1)">';
		tr += '<td class="betListLottName overflowEllipsis">' + bet.lotteryName + '</td>';
		tr += '<td class="betListPlayName overflowEllipsis">' + bet.playName + '</td>';
		tr += '<td>￥' + bet.amount + '</td>';

		//盈亏颜色
		var num = 0;
		if(bet.win){
			num = bet.win.sub(bet.amount);
		} else {
			num = bet.amount * -1;
		}
		if (num > 0){
			tr += '<td class="fontColorGreen">' +  num + '</td>';
		} else {
			tr += '<td class="fontColorRed">' +  num + '</td>';
		}
//		if (bet.status == 0) {
//			tr += '<a class="cancelOrder fontColorTheme" href="cancelOrder?ids='+ bet.id + '">撤单</a>';
//		}
		tr += '</tr>';
	}
	if(isAppend){
		$("#betTable").prepend(tr);	//加到前面
		$("#betTable .beforeLottNumDetail:gt(4)").remove();
	} else {
		$("#betTable").html(tr);	//全部替换
	}
}

//查看最近投注详情
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
			delWinName="￥"+ (data.win.sub( data.amount) );
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
				if ($('#traceSummaryList').is(':visible')) {
					$('#generalDetailArea .closeBtn').hide();
				} else {
					$('#generalDetailArea .closeBtn').show();
				}
				$('.closeBtn').on('click',function(){
					layer.closeAll();
				});
			}
		});
	});
}
//查看最近追号详情
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
			if (!$('#repealOrder').length){
				$('#appNumIntroBtn').append("<a href='javascript:;' class='btn repealOrder' id='repealOrder' onclick=\"cancelOrderScheme('"+strId+"','"+lotteryId+"','"+id+"')\">终止追号</a>");
			}
		} else {
			$('#repealOrder').remove();
		}
	});
	layer.open({
		type: 1,
		skin: 'generalLayer',
		shift: 5,
		area:['960px', '543px'],
		title:'详情',
		content:$('#traceSummaryList'),
		success:function(){
			$('.closeBtn').on('click',function(){
				layer.closeAll();
			});
		}
	});
}
//撤销方案撤单
function cancelOrderScheme(id,lotteryId,statusId,type){
	var args ="&ids="+id;
	$.getJSON("/lotts/"+lotteryId+"/cancelOrder",args,function(data){
		if(data.status==200){
			$.alert('撤单成功！', '', 3000);
			if(statusId==0&&type==1){
				//closeGeneralDetailArea();
				$("#generalDetailArea").hide();
			}else{
				showTraceSummary(statusId);
			}
		}else{
			$.alert('不是当期，不允许撤单！', '', 3000);
		}
	});
}

$(function() {

	//将每个开奖号码列表的第一个复制到最后-----新开奖号码动画
	//var h = $('#theme').val() == 'theme-black' ? 70 : 74;
	var h = $('.lottNumDetail p:first').height();
	$('.lottNumDetail').each(function(){
		$(this).find('p').parent().append($(this).find('p:first').clone(true));

		//初始化开奖号码位置
		var index = $(this).find('p').index($(this).find('p.active'));
		$(this).css('margin-top', index * -h);
	});

	//通过彩种判断开奖号码动画选择方式,true:自主,false:官方
	var lottNumAnimateType = $('#theme').attr('data-lottery');
	if (lottNumAnimateType == 'false') {
		timeAnimate = false;
	}

	//中奖播报轮播
	var noticeIndex = 1;//网站公告滚动位置计数器
	var noticeScrollBox = $('#rewardList');
	var noticeHeight = $(noticeScrollBox).find("tr:first").height();
	var noticeTotalHeight = $(noticeScrollBox).height();
	$(noticeScrollBox).append($(noticeScrollBox).find('tr').clone(true));
	noticeAutoScroll();
	//网站公告滚动
	function noticeAutoScroll() {
		$(noticeScrollBox).everyTime('3s', 'noticeScrollBox', function () {
			$(this).everyTime('3cs', 'noticeScroll', function () {
				var h = parseInt($(this).css('margin-top'));
				h = h ? h : 0;
				if (h == (-noticeHeight * noticeIndex) && noticeIndex > 0) {
					$(this).stopTime('noticeScroll');
					noticeIndex++;
					if (h == -noticeTotalHeight) {
						noticeIndex = 1;
						$(this).css("margin-top", '0px');
					}
					return;
				}
				$(this).css("margin-top", h - 1 + 'px');
			}, 0, true);
		}, 0, true);
	}

	//左侧浮动显示隐藏
	$('#asideLeft h3').click(function(){
		$(this).siblings('.allGameList').toggle();
	});

	//切换玩法群
	$(".lottNavDetail").click(function(){
		if ($(this).hasClass("active")) {
			return;
		}
		$(".lottNavDetail").removeClass("active");
		$(this).addClass("active");
		var hide = $(this).attr("data-hide");
		var show = $(this).attr("data-show");
		$(hide).hide();
		$(show).show();
		
		if (show.length > 6) {
			var g = show.substring(0, 6);
			if (g == '#group') {
				$(show + " .lottTypeDetail:first a").click();
			}
		}
		$(".numList a").removeClass("active");
		$(".singleNum").val('');
		refererPage();
	});
	// 玩法切换
	$(".lottTypeDetail").click(function() {
		if ($(this).hasClass("active")) {
			return;
		}
		$(".lottTypeDetail").removeClass("active");
		$(this).addClass("active");
		var hide = $(this).attr("data-hide");
		var show = $(this).attr("data-show");
		$(hide).hide();
		$(show).show();

		if($(this).is("[data-example]")){
			$("#playRemark").html($(this).attr("data-remark"));
			$("#playExample").html($(this).attr("data-example"));
			var maxBonus = $(this).attr("data-MaxBonus");
			var minBonus = $(this).attr("data-bonus");
			var playRatio =parseFloat( $(this).attr("data-ratio"));
			
			var ratio = parseFloat($("#userRatio").attr("data-ratio"));
			ratio = ratio.sub(playRatio);
//			ratio = ratio.mul(100); //百分比

			/*
			var opts = '';
			if(ratio>0) {
				opts += '<option value="0">'+maxBonus+'-0%(高奖)</option>';
				opts += '<option value="1">'+minBonus+'-'+ratio+'%(高返)</option>';
			} else {
				opts += '<option value="0">'+minBonus+'</option>';
			}
			$("#bounsType").html(opts);
			*/
			var nowFandain = $("#bounsNumRangeValue").val();
			var fandian = $("#bounsNumRange").attr("max");
			maxBonus = (nowFandain * 20 + 1700) / (1700 / minBonus);
			var change = fandian - nowFandain;
            //$("#bounsNumRange").attr("max", maxBonus);
            //$("#bounsNumRange").val(maxBonus);
			if(nowFandain == fandian) {
                $("#bounsNum").text(maxBonus.toFixed(2));
            }else{
                $("#bounsNum").text(maxBonus.toFixed(2) + "-" + change + "%");
			}

            /*
            var bonus = null;
            if($("#bounsType").val() == 1){
                bonus = $(this).attr("data-bonus");
            } else {
                bonus = $(this).attr("data-MaxBonus");
            }
            */
			$("#playBonus").html(maxBonus.toFixed(2));
		}
		$(".numList a").removeClass("active");
		$(".singleNum").val('');
		refererPage();
	});

	
	//任选切换位置
	$(".anySelect").change(function(){
		refererPage();
	});
	
	//冷热切换
	$(".hotspot").click(function(){
		if($(this).hasClass("active")) return;
		$(this).addClass("active");
		$(".omit").removeClass("active");
		$(".hotspotIssue").show();
		$(".host30,.host50,.host100,.lost").hide();
		var len = $(".Issue.active").attr("data-len");
		$(".host"+len).show();
	});
	
	//遗漏切换
	$(".omit").click(function(){
		if($(this).hasClass("active")) return;
		$(this).addClass("active");
		$(".hotspot").removeClass("active");
		$(".hotspotIssue").hide();
		$(".host30,.host50,.host100,.lost").hide();
		$(".lost").show();
	});
	
	//冷热长度切换
	$(".Issue").click(function(){
		if($(this).hasClass("active")) return;
		$(".Issue").removeClass("active");
		$(this).addClass("active");
		var len = $(this).attr("data-len");
		$(".host30,.host50,.host100,.lost").hide();
		$(".host"+len).show();
	});
	
	//最近投注、追号记录切换
	$(".lottInfoNavDetail").click(function(){
		if ($(this).hasClass("active")) {
			return;
		}
		$(".lottInfoNavDetail").removeClass("active");
		$(this).addClass("active");
		var show = $(this).attr("data-show");
		$('.accountLottInfo').siblings('.beforeLottNumList').hide();

		//只用于pk10
		if ( $('#lotteryId').val() == 'pk10' ){
			$('.beforeLottNumContent .beforeLottNumList').hide();
		}

		$(show).show();
	});

	//再次投注
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

	//pk10 清空按钮-立即投注区域
	$('#clearSelectNum').click(function(){
		$('.changeNumList-pk10:visible .smallNum').removeClass('active');
		refererPage();
	});

	// 号码选择
	$(".numList a.smallNum").click(function() {
		if($(this).hasClass("active")) {
			$(this).removeClass("active");
		} else {
			var line = $(this).parents(".numList");
			var maxSelect =~~ line.attr("data-max");
			if(maxSelect > 0 ){
				var num = line.find("a.active").length;
				if(num>=maxSelect) {
					var last = line.attr("data-last");
					line.find("a[data-num='"+last+"']").removeClass("active");
				}
			}
			$(this).addClass("active");
			var n = $(this).attr("data-num");
			line.attr("data-last",n);
		}
		refererPage();
		return false;
	});

	// 快3-二同号 选择
	$('.numList a.smallNumBtn').click(function(){
		var siblings = $(this).parent().siblings('li').find('a.smallNum');
		$(this).attr('data-val', 'true');
		siblings.each(function(){
			if ($(this).hasClass('active') == false){
				$(this).parent().siblings('.last').find('.smallNumBtn').attr('data-val', 'false');
			}
		});
		var val = $(this).attr('data-val');
		if(val == 'false') {
			$(this).attr('data-val', 'true').parent().siblings('li').find('a.smallNum').addClass('active');
		} else {
			$(this).attr('data-val', 'false').parent().siblings('li').find('a.smallNum').removeClass('active');
		}
		refererPage();
	});
	
	//返奖模式切换
	$("#bounsType").change(function(){
		var bonus = null;
		var play = $(".lottTypeDetail.active");
		if($("#bounsType").val() == 1){
			bonus = play.attr("data-bonus");
		} else {
			bonus = play.attr("data-MaxBonus");
		}
		$("#playBonus").html(bonus);
		refererPage();
	});

	// 圆角分切换
	var unit = $("#amountType").val(); // 单价，圆角分模式
	if (unit == undefined) {
		$("a.amountType").on('click', function() {
			$("a.amountType").removeClass("active");
			$(this).addClass("active");
			refererPage();
		});
	} else {
		$("#amountType").on('change', function () {
			refererPage();
		});
	}

	// 倍数变更
	$("#betPrice,.inputSelectDiv .labelCond[id*=tracePrice]").keyup(function() {
		if ( this.value > 9999 ) this.value = 9999;
		refererPage();
	});
	$("#betPrice,.inputSelectDiv .labelCond[id*=tracePrice]").blur(function() {
		if( this.value == "" || this.value < 1 ) this.value = 1;
		refererPage();
	});

	//清除火焰效果
	if (fireOff) {
		$('.addMult').hover(function () {

			//重置开关，使下次hover时，增加三次倍数可以重新显示火焰效果
			fireEffectCount = true;

			$('.fireBox').append("<canvas class='fire' id='surface'></canvas>");

		}, function () {

			//清除火焰效果
			cancelAnimationFrame(timeout);

			//重置倍数计数器
			fireCount = 1;

			//清除画布
			var fireEle = document.querySelector('#surface'),
				fireEffect = fireEle.getContext('2d');
			fireEffect.clearRect(0, 0, fireEle.width, fireEle.height);

			//重置画布的位置
			$(fireEle).remove();
		});
	}

	//导入注单
	$(".uploadFile").click(function(){
		$("#file").click();
	});
	
	//注单提交
	$(document).on("change","#file",function(){
		// 上传文件
		$.ajaxFileUpload({
			url : 'upload',// 处理文本
			secureuri : false,
			fileElementId : 'file',// file控件id
			dataType : 'json',
			success : function(data, status) {
				if(data.status == 200) {
					var playId = $(".lottTypeBox:visible")	// 当前玩法组
						.find(".lottTypeDetail.active") 		// 玩法
						.attr("data-show"); 					// 玩法ID
				
					$(playId).find(".singleNum").val(data.content);
					$(playId+" .singleMsg").hide();
					refererPage();
				} else {
					$.alert(data.content);
				}
				
				$("#file").remove();
				$("#fileDiv").append('<input type="file" name="file" id="file"/>');
//				alert(data.content);
//				ajaxHref('/help/list', 'GET', {}, function(xml) {
//					$("#main-body").html(xml);
//				});
			},
			error : function(data, status, e)// 服务器响应失败处理函数
			{
				$("#file").remove();
				$("#fileDiv").append('<input type="file" name="file" id="file"/>');
				$.alert("上传失败，请重试");
			}
		});
	});
	
	$(".singleMsg").click(function(){
		$(this).hide();
		$(this).prev().focus();
	});
	
	//单式文本框
	$(".singleNum").blur(function(){
		var t = $(this).val();
		t = $.trim(t);
		if(t==''){
			$(this).next().show();
		} else {
			$(this).next().hide();
		}
		$(this).val(t);
	});
	
	//单式文本框
	$(".singleNum").keyup(function(){
		refererPage();
	});
	
	//删除错误项
	$("a.errBtn").click(function(){
		var info = getSelectInfo();
		
		if(info.err && info.err!=''){
			var p = '<span class="fontColorRed">已过滤错误项：</span><div class="overflowScroll">'+info.err + '</div>';
			$.alert(p);
			$('.dialogBoxContent[data-type="alert"]').find('.msg').css('text-align','left');
		}
		if(info.content){
			var content = singleDelete(info.content);

			var playId = $(this).attr("data-playId");
			$(playId+" .singleNum").val(content);
		}
		refererPage();
	});
	
	$("a.cfBtn").click(function(){
		var info = getSelectInfo();
		var msg = '';
		if((info.err && info.err!='') || (info.cf && info.cf!='')){
			msg = '<span class="fontColorRed">已过滤错误与重复项:</span><div class="overflowScroll">'+info.err +info.cf + '</div>';
		}
		
		if(msg!=''){
			$.alert(msg);
			$('.dialogBoxContent[data-type="alert"]').find('.msg').css('text-align','left');
		}
		
		if(info.ncf){
		var content = info.ncf;
			if(content==''){
				$(playId).find(".singleMsg").show();
			} else{
				$(playId).find(".singleMsg").hide();
			}
	
			var playId = $(this).attr("data-playId");
			$(playId+" .singleNum").val(content);
		}
		refererPage();
	});

	
	//单式清除
	$("a.clearBtn").click(function(){
		var playId = $(this).attr("data-playId");
		$(playId+" .singleNum").val("");
		refererPage();
	});
	// 按钮点击
	$("a.numBtn").click(function() {
		var mm = $(this);
		var a = mm.parents(".changeNumDetail").find(".numList a");
		a.removeClass("active"); // 清
		if (mm.hasClass("numBtnAll")) {
			a.addClass("active"); // 全
		} else if (mm.hasClass("numBtnBig")) {
			a.filter(":gt(4)").addClass("active"); // 大 前5个算小。其他算大
		} else if (mm.hasClass("numBtnSmall")) {
			a.filter(":lt(5)").addClass("active"); // 小 前5个算小。其他算大
		} else if (mm.hasClass("numBtnOdd")) {
			// 单
			if (a.first().attr("data-num") == '1' || a.first().attr("data-num") == '01') {
				a.filter(":even").addClass("active");
			} else {
				a.filter(":odd").addClass("active");
			}
		} else if (mm.hasClass("numBtnEven")) {
			// 双
			if (a.first().attr("data-num") == '1' || a.first().attr("data-num") == '01') {
				a.filter(":odd").addClass("active");
			} else {
				a.filter(":even").addClass("active");
			}
		}
		refererPage();
	});

	// 清空已选号码
	$("th.appNumClear").click(function() {
		$("#selectBetPanle").html("");
		refererPage();
	});

	// 删除当前注单
	$(document).on("click", "a.appNumDetailClear", function() {
		$(this).parents(".appNumDetail").remove();
		refererPage();
	});

	// 添加号码栏
	$("#addSelectNum").click(function() {
		var info = getSelectInfo();
		if (info.err && info.err!='') {
			$.alert("您录入的注单存在错误项,请删除错误项后添加");
			return;
		}
		if (info.count == 0) {
			$.alert("您尚未选定一个完整的投注");
			return;
		}

		var forecast = parseFloat($('#betsAmountForecast').text());//预计盈利
		var unitTxt = $("#amountType option:selected").text(); // 元、角、分
		var unit = $("#amountType").val(); // 圆角分金额
		if (unit == undefined) {
			unitTxt = $("a.amountType.active").text(); // 元、角、分
			unit = parseFloat($("a.amountType.active").attr("data-unit")); // 单价，圆角分模式
		}
		var price = parseInt($("#betPrice").val()); // 倍数
		var amount = price.mul(unit).mul(info.count); // 总额（单注）
		var bouns = $("#bounsNum").text();
		//添加到待投列表:(选号信息，总额（单注），倍数，元角分厘，单价-圆角分模式，预计盈利)
		addSelectBetPanle(info, amount, price, unitTxt, unit, forecast, bouns);
		refererPage();
	});

	// 追号方式切换
	$("a.appNumNav").click(function() {
		if ($(this).hasClass("active"))
			return;
		$("a.appNumNav").removeClass("active");
		$(this).addClass("active");
//		$(".createAppNumBar").hide();
		$($(this).attr("data-hide")).hide();
		$($(this).attr("data-show")).show();
		$(".traceList").html("");
		referereTrace();
	});

	// 同倍追号快捷期数
	$(".appendIssue a").click(function() {
		$(".appendIssue a").removeClass("active");
		$(this).addClass("active");
		var v = $(this).attr("data-num");
		$("#traceNum1").val(v);
	});

	// 显示追号面板
	$("#appBet").click(function() {
		var basePrice = 0;
		var allCount = 0;
		$(".appNumDetail").each(function() {
			var count = parseInt($(this).attr("data-count"));	//注数
			var unit = parseFloat($(this).attr("data-unit"));	//单价
			basePrice += count.mul(unit);	//单倍金额
			allCount += count;	//总注数
			$(".traceList").html("");
		});
		if (basePrice == 0) {
			$.alert("请先选号");
			return;
		}

		// 记录一倍的金额
		$("#traceBox").attr("data-price", basePrice);	//单期单倍全部金额
		$("#traceBox").attr("data-count", allCount);	//单期注数
		// $("#mask").show();
		$.dialog("#traceBox");
	});

	$(document).on("blur",".traceList .labelCond",function() {
		var mul = parseInt($(this).val());
		if(mul<1){
			$(this).val(1);
			mul = 1;
		} else {
			$(this).val(mul);
		}
		var basePrice = parseFloat($("#traceBox").attr("data-price"));
		var newPrice = mul.mul(basePrice);
		$(this).parent().next().text("￥ " + newPrice + " 元")
				.attr("data-price", newPrice);
		referereTrace();
	});

	$(document).on("change", "input[name='seasonId']", function() {
		var b = $(this).is(":checked");
		var t = $(this).parents(".listDetail").find("input[name='price']");
		if (b)
			t.removeAttr("disabled");
		else
			t.attr("disabled", "disabled");
		referereTrace();
	});

	// 同倍追号生成
	$("#traceCreate1").click(function() {
		//期数
		var num = parseInt($("#traceNum1").val());
		//倍数
		var mul = parseInt($("#tracePrice1").val());
		if (typeof (price) == 'NaN' || typeof (num) == 'NaN' || mul < 1 || num < 1) {
			$.alert("倍数或期数错误");
			return;
		}

		var basePrice = parseFloat($("#traceBox").attr("data-price"));
		ajaxExt({
			url : 'listTraceSeasonId?count=' + num,
			callback : function(rel) {
				var xml = "";
				for ( var n in rel) {
					n = parseInt(n);
					var nowTxt = "";
					if (n == 0) {
						nowTxt = '<span class="fontColorTheme">当前期</span>';
					}
					var d = rel[n];
					xml += '<tr class="listDetail">';
					xml += '<td>' + (n + 1) + '</td>';
					xml += '<td style="text-align:left;"><input type="checkbox" name="seasonId" value="'
							+ d.seasonId
							+ '" checked="checked" /> <span class="appNumIssue">'
							+ d.seasonId
							+ nowTxt
							+ '</span></td>';
					xml += '<td><input type="text" class="labelCond" name="price" value="'
							+ mul + '" /> <span>倍</span></td>';
					xml += '<td data-price="'
							+ mul.mul(basePrice) + '">￥ '
							+ mul.mul(basePrice) + ' 元</td>';
					xml += '<td>' + d.openTime + '</td>';
					xml += '</tr>';
				}
				$(".appendBox:visible .traceList").html(xml);
				referereTrace();
			}
		});
	});
	
	// 利率追号生成
	$("#traceCreate2").click(function() {
		var bate = parseInt($("#traceBate").val());	//最小利率
		var num = parseInt($("#traceNum2").val());	//总期数
		
		//倍数
		if (typeof (bate) == 'NaN' || typeof (num) == 'NaN'  || bate < 1 || num < 1) {
			$.alert("所有都必须为数字，并且大于0");
			return;
		}
		var allCount = $("#selectBetPanle tr").length;
		if(allCount!=1){
			$.alert("盈利率追号不支持多选、混投");
			return;
		}
		
		var tr = $("#selectBetPanle tr:first");
		
		var id = tr.attr("data-id");					//玩法
		var unit = parseFloat(tr.attr("data-unit"));	//单价
		
		
		//高奖金
		var bonus = parseFloat(parseFloat($(".lottTypeDetail[data-show='#"+ id +"']").attr("data-MaxBonus")).toFixed(4));
		bonus = bonus.mul(unit).div(2);	//根据单价得到的奖金
		//倍数
		var basePrice = parseFloat($("#traceBox").attr("data-price"));//一倍的总价
		
		var ll = bonus.sub(basePrice).div(basePrice).mul(100);	//利率
		if(ll<bate){
			$.alert("您设置的利率无法满足,请重新设置");
			return;
		}
		
		var win = allCount.mul(bonus);
		var allBetMoney = 0;
		var nowMul = 1;	//当前倍数
		ajaxExt({
			url : 'listTraceSeasonId?count=' + num,
			callback : function(rel) {
				var xml = "";
				for ( var n in rel) {
					n = parseInt(n);
					var nowTxt = "";
					if (n == 0) {
						nowTxt = '<span class="fontColorTheme">当前期</span>';
					}
					var nowMoney = 0;
					var nowBonus = 0;
					var nowWin =  0;
					var nowLv = ll;
					var ifAllBetMoney = allBetMoney;
					while(true){
						nowMoney = nowMul.mul(basePrice);			//当期金额
						nowBonus = win.mul(nowMul);					//当期奖金
						
						ifAllBetMoney = allBetMoney.add(nowMoney);	//累计金额
						nowWin = nowBonus.sub(ifAllBetMoney);			//累计盈利
						nowLv = parseFloat(nowWin.div(ifAllBetMoney).mul(100).toFixed(4));	//盈利利率
						if(nowMul>=9999) break;
						if(nowLv<bate){
							nowMul = nowMul.add(1);	//加一倍
						} else {
							break;
						}
					};
					allBetMoney = ifAllBetMoney;
					var d = rel[n];
					xml += '<tr class="listDetail">';
					xml += '<td>' + (n + 1) + '</td>';
					xml += '<td style="text-align:left;"><input type="checkbox" name="seasonId" value="'
							+ d.seasonId
							+ '" checked="checked" /> <span class="appNumIssue">'
							+ d.seasonId
							+ nowTxt
							+ '</span></td>';
					xml += '<td><input type="text" class="labelCond" name="price" value="'
							+ nowMul + '" /> <span>倍</span></td>';
					xml += '<td data-price="'
							+ nowMoney + '">￥ '
							+ nowMoney + ' 元</td>';
					
					xml += "<td>"+ nowBonus.toFixed(4) +"</td>";
					xml += "<td>"+ nowWin.toFixed(4) +"</td>";
					xml += "<td>"+ nowLv.toFixed(4) +"%</td>";
//					xml += '<td>' + d.openTime + '</td>';
					xml += '</tr>';
				}
				$(".appendBox:visible .traceList").html(xml);
				referereTrace();
			}
		});
	});
	
	// 翻倍追号生成
	$("#traceCreate3").click(function() {
		var begin = parseInt($("#traceBeginMul3").val());	//开始倍数
		var split = parseInt($("#traceMidSeason3").val());	//间隔
		var mul = parseInt($("#traceMul3").val());			//翻倍数
		var num = parseInt($("#traceNum3").val());			//总期数
		
		//倍数
		if (typeof (begin) == 'NaN' || typeof (split) == 'NaN' ||typeof (mul) == 'NaN' || typeof (num) == 'NaN' || begin < 1 || split < 1 || mul < 1 || num < 1) {
			$.alert("所有都必须为数字，并且大于0");
			return;
		}
		//单倍金额
		var basePrice = parseFloat($("#traceBox").attr("data-price"));
		var nowSplit = 0;
		var nowMul = begin;
		ajaxExt({
			url : 'listTraceSeasonId?count=' + num,
			callback : function(rel) {
				var xml = "";
				for ( var n in rel) {
					n = parseInt(n);
					var nowTxt = "";
					if (n == 0) {
						nowTxt = '<span class="fontColorTheme">当前期</span>';
					}
					var d = rel[n];
					xml += '<tr class="listDetail">';
					xml += '<td>' + (n + 1) + '</td>';
					xml += '<td style="text-align:left;"><input type="checkbox" name="seasonId" value="'
							+ d.seasonId
							+ '" checked="checked" /> <span class="appNumIssue">'
							+ d.seasonId
							+ nowTxt
							+ '</span></td>';
					xml += '<td><input type="text" class="labelCond" name="price" value="'
							+ nowMul + '" /> <span>倍</span></td>';
					xml += '<td data-price="'
							+ nowMul.mul(basePrice) + '">￥ '
							+ nowMul.mul(basePrice) + ' 元</td>';
					xml += '<td>' + d.openTime + '</td>';
					xml += '</tr>';
					nowSplit++;
					if(nowSplit==split){
						nowMul = nowMul.mul(mul);
						nowSplit = 0;
					}
				}
				$(".appendBox:visible .traceList").html(xml);
				referereTrace();
			}
		});
	});

	// 立即投注
	$('#promptlyBet').click(function() {
		if($(this).hasClass('disabled')) {
			return;
		}
		var info = getSelectInfo();
		if (info.err && info.err!='') {
			$.alert("您录入的注单存在错误项,请删除错误项后添加");
			return;
		}

		if (info.count == 0) {
			$.alert("您尚未选定一个完整的投注");
			return;
		}

		if(info.id.indexOf("star2") > -1){
			var dtCount = 0;
			if(info.id.indexOf("ssc") > -1){
				dtCount = 3;
			}
            if(info.id.indexOf("pk10") > -1){
                dtCount = 3;
            }
            if(info.id.indexOf("11x5") > -1){
                dtCount = 4;
            }
            if(info.count < dtCount){
				if(confirm("下注为单挑模式，最高返奖两万。确定下注？")){
				}else{
					return;
				}
			}
		}

        if(info.id.indexOf("star3") > -1){
            var dtCount = 0;
            if(info.id.indexOf("ssc") > -1){
                dtCount = 30;
            }
            if(info.id.indexOf("pk10") > -1){
                dtCount = 30;
            }
            if(info.id.indexOf("11x5") > -1){
                dtCount = 40;
            }
            if(info.count < dtCount){
                if(confirm("下注为单挑模式，最高返奖两万。确定下注？")){
                }else{
                    return;
                }
            }
        }

        if(info.id.indexOf("star4") > -1){
            var dtCount = 0;
            if(info.id.indexOf("ssc") > -1){
                dtCount = 300;
            }
            if(info.id.indexOf("pk10") > -1){
                dtCount = 300;
            }
            if(info.id.indexOf("11x5") > -1){
                dtCount = 400;
            }
            if(info.count < dtCount){
                if(confirm("下注为单挑模式，最高返奖两万。确定下注？")){
                }else{
                    return;
                }
            }
        }

        if(info.id.indexOf("star2") > -1){
            var dtCount = 0;
            if(info.id.indexOf("ssc") > -1){
                dtCount = 3;
            }
            if(info.id.indexOf("pk10") > -1){
                dtCount = 3;
            }
            if(info.id.indexOf("11x5") > -1){
                dtCount = 4;
            }
            if(info.count < dtCount){
                if(confirm("下注为单挑模式，最高返奖两万。确定下注？")){
                }else{
                    return;
                }
            }
        }

		$(this).addClass('disabled');

		// 高返高奖
		var bounsType = $("#bounsType").val();

        var max = $("#bounsNumRange").attr("max");

		var bounsRange = $("#bounsNumRange").val();

		var bouns = $("#bounsNum").text();

        //var bouns = ${"#bounsNum"}.text();

		// 倍数
		var price = parseInt($("#betPrice").val());
		// 单价
		var unit = $("#amountType").val();
		if (unit == undefined) {
			unit = parseFloat($("a.amountType.active").attr("data-unit")); // 单价，圆角分模式
		}


		var amount = price.mul(unit).mul(info.count);
		


		var formInputs = '<input type="hidden" name="isTrace" value="0"/>';
		formInputs += '<input type="hidden" name="traceWinStop" value="0"/>';
		formInputs += '<input type="hidden" name="bounsRange" value="'+(max - bounsRange)+'"/>';
		formInputs += '<input type="hidden" name="bouns" value="'+bouns+'"/>';
		//formInputs += '<input type="hidden" name="bounsType" value="'+bounsType+'"/>';
		formInputs += '<input type="hidden" name="order[0].playId" value="'+info.id+'"/>';
		formInputs += '<input type="hidden" name="order[0].content" value="'+info.content+'"/>';
		formInputs += '<input type="hidden" name="order[0].betCount" value="'+info.count+'"/>';
		formInputs += '<input type="hidden" name="order[0].price" value="'+price+'"/>';
		formInputs += '<input type="hidden" name="order[0].unit" value="'+unit+'"/>';
		formInputs += '<input type="hidden" name="order[0].bouns" value="'+bouns+'"/>';
		formInputs += '<input type="hidden" name="traceOrders[0].seasonId" value="'+$("#saleSeasonId").text()+'"/>';
		formInputs += '<input type="hidden" name="amount" value="'+amount+'"/>';
		formInputs += '<input type="hidden" name="count" value="'+info.count+'"/>';
		formInputs += '<input type="hidden" name="force" value="0"/>';
		
		var cn = '';
		if(info.content.length>20){
			cn = info.content.substring(0,20)+"...";
		} else {
			cn = info.content;
		}
		
		var trs ='<tr>';
		trs+='<td>【'+ info.title +'】</td>';
		trs+='<td width="180">'+ cn +'</td>';
		trs+='</tr>';
		
		$("#betConfirmForm").html(formInputs);
//		$("#betConfirmTable").html(trs);
//		$("#betConfirmAmount").text(amount);
//		$.dialog("#betConfirmBox");
		$("#betSubmit").click(); //不显示弹框，直接提交
		
	});
	
	$("#traceNum1,#traceNum2,#traceNum3").change(function(){
		var max = parseInt( $("#maxPlan").attr("data-plan"));
		var val = parseInt( $(this).val());
		if(max<val){
			$(this).val(max);
		}
	});

	// 投注确认
	$("#betConfirm").click(function() {
		// 号码行
		var allAmount = 0;
		var allCount = 0;


		if($("tr.appNumDetail").length == 0){
			$.alert("您未选择号码！");
			return;
		}
		var i = 0;
//		var url = "bet?isTrace=0&traceWinStop=0";
		var formInputs = '<input type="hidden" name="isTrace" value="0"/>';
		formInputs += '<input type="hidden" name="traceWinStop" value="0"/>';
		//formInputs += '<input type="hidden" name="bounsType" value="'+$("#bounsType").val()+'"/>';
        var bounsRange = $("#bounsNumRange").val();
        var max = $("#bounsNumRange").attr("max");
        var bouns = $("#bounsNum").text();
        formInputs += '<input type="hidden" name="bounsRange" value="'+(max - bounsRange)+'"/>';
        formInputs += '<input type="hidden" name="bouns" value="'+bouns+'"/>';
		var trs = '';
		$("tr.appNumDetail").each(function() {
			var id = $(this).attr("data-id"); // 玩法
			var content = $(this).attr("data-content"); // 内容
			var count =parseInt( $(this).attr("data-count")); // 注数
			var amount = parseFloat($(this).attr("data-amount")); // 单注金额
			var price = $(this).attr("data-price"); // 倍数
			var unit = $(this).attr("data-unit"); // 单价
			var bouns = $(this).attr("data-bouns"); // 单价

			allAmount = allAmount.add(amount);
			allCount = allCount.add(count);
			
			formInputs += '<input type="hidden" name="order[' + i + '].playId" value="'+id+'"/>';
			formInputs += '<input type="hidden" name="order[' + i + '].content" value="'+content+'"/>';
			formInputs += '<input type="hidden" name="order[' + i + '].betCount" value="'+count+'"/>';
			formInputs += '<input type="hidden" name="order[' + i + '].price" value="'+price+'"/>';
			formInputs += '<input type="hidden" name="order[' + i + '].unit" value="'+unit+'"/>';
			formInputs += '<input type="hidden" name="order[' + i + '].bouns" value="'+bouns+'"/>';

			trs +='<tr>';
			trs+='<td>'+ $(this).find("td:first").text() +'</td>';
			trs+='<td width="180">'+ $(this).find("td:eq(1)").text() +'</td>';
			trs+='</tr>';
			
			i++;
		});
		

		formInputs += '<input type="hidden" name="traceOrders[0].seasonId" value="'+$("#saleSeasonId").text()+'"/>';
		formInputs += '<input type="hidden" name="amount" value="'+allAmount+'"/>';
		formInputs += '<input type="hidden" name="count" value="'+allCount+'"/>';
		formInputs += '<input type="hidden" name="force" value="0"/>';
		$("#betConfirmForm").html(formInputs);
		$("#betConfirmTable").html(trs);
		$("#betConfirmAmount").text(allAmount);
		$.dialog("#betConfirmBox");
	});
	


	//追号确认按钮
	$("#traceSubmit").click(function() {
		var v = $("#traceWinStop").is(":checked") == true ? 1 : 0;
		
		var formInputs = '<input type="hidden" name="isTrace" value="1"/>';
		formInputs += '<input type="hidden" name="traceWinStop" value="'+v+'"/>';
        var bounsRange = $("#bounsNumRange").val();
        var max = $("#bounsNumRange").attr("max");
        var bouns = $("#bounsNum").text();
        formInputs += '<input type="hidden" name="bounsRange" value="'+(max - bounsRange)+'"/>';
        formInputs += '<input type="hidden" name="bouns" value="'+bouns+'"/>';
		//formInputs += '<input type="hidden" name="bounsType" value="'+$("#bounsType").val()+'"/>';
		
		var trs = '';
		
		var allAmount = 0, allCount = 0, i = 0;
		
		var oneSeasonAmount = 0;	//单期单倍金额
		var traceAmount=0;			//追号总额
		
		//具体下注内容
		$("tr.appNumDetail").each(function() {
			var id = $(this).attr("data-id"); // 玩法
			var content = $(this).attr("data-content"); // 内容
			var count =parseInt( $(this).attr("data-count")); // 注数
			var amount = parseFloat($(this).attr("data-amount")); // 单注金额
			var price = $(this).attr("data-price"); // 倍数
			var unit = $(this).attr("data-unit"); // 单价

			allAmount = allAmount.add(amount);
			allCount = allCount.add(count);

			formInputs += '<input type="hidden" name="order[' + i + '].playId" value="'+id+'"/>';
			formInputs += '<input type="hidden" name="order[' + i + '].content" value="'+content+'"/>';
			formInputs += '<input type="hidden" name="order[' + i + '].betCount" value="'+count+'"/>';
			formInputs += '<input type="hidden" name="order[' + i + '].price" value="'+price+'"/>';
			formInputs += '<input type="hidden" name="order[' + i + '].unit" value="'+unit+'"/>';
			
			oneSeasonAmount = oneSeasonAmount.add(count.mul(unit));
			trs +='<tr>';
			trs+='<td>'+ $(this).find("td:first").text() +'</td>';
			trs+='<td width="180">'+ $(this).find("td:eq(1)").text() +'</td>';
			trs+='</tr>';
			i++;
		});

		i = 0;
		$(".appendBox:visible .traceList tr").each(function() {
			var seasonId = $(this).find("input[name='seasonId']");
			if (seasonId.is(":checked")) {
				var p = $(this).find("input[name='price']").val();
				formInputs += '<input type="hidden" name="traceOrders['+i+'].seasonId" value="'+seasonId.val()+'"/>';
				formInputs += '<input type="hidden" name="traceOrders['+i+'].price" value="'+p+'"/>';
				traceAmount = traceAmount.add(oneSeasonAmount.mul(p));
				i++;
			}
		});
		formInputs += '<input type="hidden" name="amount" value="'+allAmount+'"/>';
		formInputs += '<input type="hidden" name="count" value="'+allCount+'"/>';
		formInputs += '<input type="hidden" name="force" value="0"/>';
		$("#betConfirmForm").html(formInputs);
		$("#betConfirmTable").html(trs);
		$("#betConfirmAmount").text(traceAmount);
		$.dialog("#betConfirmBox");
	});
	
	//撤销投注
	$(document).on("click","a.cancelOrder",function(ev){
		var a = $(this);
		a.addClass("disabled");
		var url = a.attr("href");
		ajaxExt({
			url:url,
			callback:function(rel){
				$.alert("撤销成功");
				a.parent("td").prev().text("个人撤单");
				a.remove();
			},
			complete:function(){
				a.removeClass("disabled");
			}
		});
		ev.stopPropagation();
		ev.preventDefault();
		return false;
	});

	//显示追号中投注详情
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
			area:['420px','200px'],
			title:'详情',
			content:$('#contentDetailsArea'),
			success:function(){
				$('.closeBtn').on('click',function(){
					layer.closeAll();
				});
			}
		});
	});

	//一键梭哈
	$(document).on('click', '#allBet', function(){
		var info = getSelectInfo();
		if (info.count == 0) {
			$.alert("您尚未选定一个完整的投注");
			return;
		}

		computeBetInfo(info, $('#userBalance').attr('data-value'));//计算投注信息
		refererPage();
	});

	//定额投注弹窗
	$(document).on('click', '#quotaBetBtn', function(){
		var info = getSelectInfo();
		if (info.count == 0) {
			$.alert("您尚未选定一个完整的投注");
			return;
		}
		$.dialog('#quotaBetArea');
		$('#quotaBetArea input.labelCond').val('').focus();
		$('#predictAmount').text('0');
	});
	//定额投注预计盈利
	$(document).on('keyup', '#quotaAmount', function(){
		totleForecast = 0;//初始化预计盈利
		$('#predictAmount').text(computeBetInfo(getSelectInfo(), this.value, false));
	});
	//定额投注
	$(document).on('click', '#quotaBet', function(){
		computeBetInfo(getSelectInfo(), $('#quotaAmount').val());//计算投注信息
		refererPage();
	});

	//声音开关
	$(document).on('click', '#audioCount', function(){
		if ($(this).hasClass('off')){
			$(this).removeClass('off');
			audioCount = true;
		} else {
			$(this).addClass('off');
			audioCount = false;
		}
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
	
	//投注提交
	$("#betSubmit").click(function(){
		betSubmit(this,'提交中...','确认');
	});
	$('body').on('click','#forceBetBtn',function(){
		$('input[name="force"]').val(1);
		betSubmit(this,'是','是');
	});
	
	hs.lottery.k3 && k3Sum();

	$('body').everyTime('1s', 'A', refererTime); // 1秒
	$('body').everyTime('5s','B',getInfo);	//5s  1das:10秒

	// 默认选择的菜单
	$("li.lottNavDetail:eq("+ lottery.defaultIndex +")").click();
	$(".lottTypeBox:visible").find(".lottTypeDetail[data-show='#"+lottery.defaultPlayer+"']").click();
});

//投注提交
function betSubmit(elem,texting,texted){
	$(elem).css('pointer-events','none');
	$(elem).text(texting);
	ajaxExt({
		url:'bet',
		method:"POST",
		data: $("#betConfirmForm").serialize(),
		dataType:'json',
		doOther:true,
		callback:function(rel) {
			var content = '';
			if(rel == '余额不足'){
			    content = "<p class='lottTipLayerTitle'>温馨提示</p><div class='lottTipBox'><p class='msg'><i></i><span class='content fontColorRed'>余额不足</span>是否需要进行充值？</p></div><div class='lottTipBtn2'><a href='/recharge/rechargeMoney1' class='blueBtn' style='display:inline-block;'>前往充值</a><a href='javascript:;' class='btn closeBtn'>关闭</a></div>";
			}else if(typeof(rel) == 'object'){
				//刷新投注列表
				if(rel.betList){
					refererBetList(rel.betList,true);
					refererTraceList(rel.traceList,true);
				} else {
					refererBetList(rel,true);
				}
				$("#selectBetPanle").html("");				//清空代投列表
				$(".numList a").removeClass("active");		//清空号码盘数据
				$(".singleNum").val("");					//清空单式文本
				refererPage();
				$("#refererUser").click();					//刷新余额
				$.alert("恭喜您，投注成功！");
			}else if(rel.indexOf('注单中奖') > -1){
			    content = "<p class='lottTipLayerTitle'>温馨提示</p><div class='lottTipBox'><p class='msg'><i></i>" + rel + "</p></div><div class='lottTipBtn2'><a href='javascript:;' class='blueBtn'  id='forceBetBtn' style='display:inline-block;'>是</a><a href='javascript:;' class='btn closeBtn'>否</a></div>";
			}else{
				$.alert(rel);
			}
			if(content){
				layer.closeAll();
				var index = layer.open({
					type: 1,
					skin: 'lottTipLayer',
					shift: 5,
					area: ['480px' , '260px'],
					title: false,
					content: content,
					success: function () {
						$('.closeBtn').on('click',function(){
							layer.close(index);
						});
					}
			    });
			}
		},
		complete:function(){
			$(elem).css('pointer-events','all');
			$('#promptlyBet[class~="disabled"]').removeClass('disabled');
			$(elem).text(texted);
		}
	});
}

//计算投注信息
function computeBetInfo(info, quotaAmount, add, unitTxt) {
	unitTxt = unitTxt || '元';// 元、角、分
	add = add == undefined ? true : add;

	var count = 0;
	if (unitTxt == '角') {
		count = 1;
	}
	var unit = $("#amountType option:eq(" + count + ")").val() || parseFloat($("a.amountType:eq(" + count + ")").attr("data-unit")); // 圆角分金额

	var price = parseInt(quotaAmount / info.count / unit); // 倍数
	if (add && price < 1) {
		if (unitTxt == '角') {
			$.alert('投注金额不足');
			return;
		}
	}
	var amount = price.mul(unit).mul(info.count); // 总额（单注）
	var balance = quotaAmount - amount;//剩余投注金额

	//预计盈利
	var playBonus = $('#playBonus').html();
	var bonus = parseFloat(playBonus.substr(playBonus.indexOf('-') + 1));
	var forecast = bonus * unit / 2 * price - amount;
    var bouns = $("#bounsNum").text();
	//添加到待投列表:(选号信息，总额（单注），倍数，元角分厘，单价-圆角分模式，预计盈利)
	if (add && amount > 0) {
		addSelectBetPanle(info, amount, price, unitTxt, unit, forecast, bouns);
	} else if (add == false) {
		totleForecast += forecast;
	}

	if (unitTxt == '元' && balance > 0) {
		computeBetInfo(info, balance, add, '角');//计算投注信息
	}
	return totleForecast.toFixed(2);
}

//添加到待投列表
function addSelectBetPanle(info, amount, price, unitTxt, unit, forecast, bouns){
	var xml = '<tr class="appNumDetail" data-amount="'
		+ amount + '" data-content="' + info.content
		+ '" data-count="' + info.count + '" data-id="'
		+ info.id + '" data-unit="' + unit
		+ '" data-price="' + price + '" + data-bouns="' + bouns + '">';
	xml += '<td>【' + info.title + '】</td>';
	xml += '<td class="appNum fontColorTheme overflowEllipsis">' + info.content.substring(0,40) + '</td>';
	xml += '<td>' + unitTxt + '</td>';
	xml += '<td>' + info.count + '注</td>';
	xml += '<td>' + price + '倍</td>';
	xml += '<td class="fontColorTheme">￥' + amount.toFixed(2) + '</td>';
	xml += '<td class="fontColorTheme">￥' + forecast.toFixed(2) + '</td>';//预计盈利
	xml += '<td><a href="javascript:;" class="appNumDetailClear"></a></td>';
	xml += '</tr>';
	$("#selectBetPanle").prepend(xml);
	$(".numList a").removeClass("active");
	//清空单式文本
	$(".singleNum").val("");
	layer.closeAll();
}

// betIn begin
function lottDetailShow() {
	$('.awardsLottDetail').each(function(){
		var index = $('.awardsLottDetail').index($(this));
		$(this).css({
			'bottom': parseInt(index / 3) * 49 + 'px',
			'left': index % 3 * 102 + 'px'
		}).show();
	});
}

//彩中彩随机倍数获取
function awardsGameRandom(playId, min, max){
	$('#' + playId + "-mult-l").everyTime('1cs', 'awardsRandom01', function(){
		this.innerHTML = getRendomNum(min, max);
	});
	$('#' + playId + "-mult-c").everyTime('1cs', 'awardsRandom02', function(){
		this.innerHTML = getRendomNum(min, max);
	});
	$('#' + playId + "-mult-r").everyTime('1cs', 'awardsRandom03', function(){
		this.innerHTML = getRendomNum(min, max);
	}); 
}
//随机范围内整数
function getRendomNum(min, max) {
	return Math.round(Math.random() * (max-min) + min);
}

//创建中奖弹窗DIV
function creatAwardsMsgDialog(userNotice){
	if (hs.lottery.betInOpen) {// 是否满足开启条件
		if (userNotice.win > 0) {
			//中奖，且已经开启彩中彩
			openBetIn(userNotice.betId, userNotice.win);
		} else {
			//未中奖，且已经开启彩中彩
			openContent(userNotice.id, userNotice.content, userNotice.createTime);
		}
	} else {
		//默认弹窗
		openContent(userNotice.id, userNotice.content, userNotice.createTime);
	}
}

function openBetIn(betId, win) {
	// 中奖小窗口
	var winId = "win-" + betId;
	$("#awardsMsgGroupWin").append($("#winExampleHtml").html().replace(new RegExp("winExample","gm"), winId));
	$("#" + winId + "-amount").html(win);
	if ($("#awardsMsgGroupWin .active").length == 0) {
		$("#awardsMsgGroupWin .awardsLottDetail").addClass("active");
	}
	lottDetailShow();

	// 彩中彩窗口
	var playId = "play-" + betId;
	$('#awardsMsgGroup').append($("#betExampleHtml").html().replace(new RegExp("betExample","gm"), playId));
	$("#" + playId + "-amount").text(win);
	$("#" + playId + "-win").html(win);
	$("#" + playId + "-gameCount").html(hs.lottery.betInCount);
	$("#" + playId + "-currResultAmount").html(win);
	if ($("#awardsMsgGroup .open").length == 0) {
		openBetInWindow(playId);
	}
	bindBuyBetInEvent(playId);
	checkDisable(playId, win);
}

function openBetInWindow(id) {
	var playId = id.replace("win", "play");
	$("#awardsMsgGroup div[id^='play-']").removeClass("open").hide();
	$("#" + playId).addClass("open").show();
	checkClose(playId);
}

var checkCloseTimerArray = {};
function checkClose(playId) {
	initContDown(playId);
	if (!checkCloseTimerArray[playId]) {
		checkCloseTimerArray[playId] = true;
		var checkCloseTimer = setInterval(function() {
			if (!betInBuyDoingArray[playId] && $("#" + playId).is('.open')) {	
				var $countDown = $("#" + playId + "-countDown");
				var t = parseInt($countDown.text());
				console.log(playId + " count down " + t);
				if (t > 0) {
					t--;
				}
				$countDown.text(t);
				if (t == 0) {
					clearInterval(checkCloseTimer);
					$(".closeAwardsDialogBtn[data-id='win-" + playId.replace("play-", "") + "']").click();// 关闭中奖窗口
				}
			}
		}, 1000); 
	}
}

function initContDown(playId) {
	 $("#" + playId + "-countDown").text(hs.lottery.gameSecondMax);
}

function openContent(id, msg, time) {
	var html = "",
		sysTime = new Date(time),
		year = sysTime.getFullYear(),
		month = sysTime.getMonth()+ 1,
		day = sysTime.getDate(),
		hour = sysTime.getHours(),
		min = sysTime.getMinutes();
	
	time = year + '-' +  month + '-' + day + ' ' + hour + ':' + min;
	
	html += "<div class='awardsMsgBox' id='awardsMsgBox" + id + "'>";
	//html += "<embed src='/dd.mp3' autoplay='true' loop='1' style='display: none;'></embed>";
	html += "<p class='awardsMsgTitle'><span>中奖信息</span>";
	html += "<a href='javascript:;' class='closeAwardsMsg' data-id='awardsMsgBox" + id + "'></a>";
	html += "</p><div class='awardsMsgContent'>";
	html += "<span class='awardsMsg'>" + msg + "</span>";
	html += "<span class='awardsMsgTime'>" + time + "</span>";
	html += "</div></div>";
	
	$('#awardsMsgGroup').append(html);
}

function openStart(betId, win) {
	var betStartId = "start-" + betId;
	$("#awardsMsgGroupWin").append($("#awardsNoticeDialogHtml").html().replace(new RegExp("betStartExample","gm"), betStartId));
	
	$("#" + betStartId + "-win").text(win);
	var $awardsNoticeTime = $("#" + betStartId + "-awardsNoticeTime");
	var betInStartTimer = setInterval(function() {
		var t = parseInt($awardsNoticeTime.text());
		if (t > 0) {
			t--;
		}
		$awardsNoticeTime.text(t);
		if (t == 0) {
			$("#" + betStartId).remove();
		}
	}, 1000);
	
	$("#" + betStartId + "-playAwardsLottery").click(function() {
		$("#" + betStartId).remove();
		openBetIn(betId, win);
	});
	
	$("#" + betStartId).show();
}

function bindBuyBetInEvent(playId) {
	$("#" + playId).find(".awardsGameType[id^='awardsGameType-']").each(function() {
		var type = this.id.replace("awardsGameType-" + playId + "-", "");
		$(this).click(function() {
			buyBetIn(playId, type);
		});
	});
}

function getGameAmount(type, currResultAmount) {
	if (type == '1') {
		return 1;
	} else if (type == '5') {
		return 5;
	} else if (type == '10') {
		return 10;
	} else if (type == 'half') {
		return Math.div(currResultAmount, 2).toFixed(4);
	} else if (type == 'all') {
		return currResultAmount;
	} else {
		return 0;
	}
}

var betInBuyDoingArray = {};
function buyBetIn(playId, type) {
	initContDown(playId);
	if (betInBuyDoingArray[playId]) {
		console.log(playId + ' is doing...');
		return;
	}
	betInBuyDoingArray[playId] = true;;
	// 剩余额度
	var currResultAmount = $("#" + playId + "-currResultAmount").text();
	// 本轮游戏金额
	var amount = getGameAmount(type, currResultAmount);
	// 投注编号
	var betId = playId.replace("play-", "");
	
	if (!checkBetIn(betId, amount, currResultAmount)) {
		console.log(playId + ' was done. error!');
		delete(betInBuyDoingArray[playId]);
		return;
	}
	
	$("#play-" + betId + "-gameAmount").text(amount);
	
	//点击获取随机倍数
	awardsGameRandom(playId, 0, 9);
	ajaxExt({
		url:'/lotts/betIn/buy',
		dataType:'json',
		data:{'betId' : betId, 'amount' : amount},
		loading:'',
		noError:false,
		callback:function(rel){
			var v = "" + rel.multiples;
			var index = v.indexOf('.');
			
			var multl = v.substring(0, index);
			var multc = v.substr(index + 1, 1);
			var multr = v.substr(index + 2, 1);
			
			multl = multl || 0;
			multc = multc || 0;
			multr = multr || 0;
			
			$('#' + playId + "-mult-r").oneTime('1s', function(){
				$(this).stopTime('awardsRandom03');
				this.innerHTML = multr;
			});
			$('#' + playId + "-mult-c").oneTime('2s', function(){
				$(this).stopTime('awardsRandom02');
				this.innerHTML = multc;
			});
			$('#' + playId + "-mult-l").oneTime('3s', function(){
				$(this).stopTime('awardsRandom01');
				this.innerHTML = multl;
				
				var currAmount = Math.add(Math.sub($("#play-" + betId + "-currResultAmount").text(), amount), rel.win);
				
				$("#play-" + betId + "-resultAmount").text(rel.win);
				$("#play-" + betId + "-gameCount").text(Math.sub($("#play-" + betId + "-gameCount").text(), 1));
				$("#play-" + betId + "-currResultAmount").text(currAmount);
				
				checkDisable(playId, currAmount);
				
				console.log(playId + ' was done.');
				delete(betInBuyDoingArray[playId]);
			});
			
		},
		success : function(rel) {
			spinner.spin();
			try {
				rel = eval('('+rel+')');
			} catch (e) {
			}
			
			//JSON
			if (rel.status == 302) {
				location.href = "/logout";
			} else if (rel.status != 200) {
				$.alert(rel.content);
				stopPlayGame(playId);
			} else {
				this.callback(rel.content);
			}
		},
		error : function() {
			spinner.spin();
			if(!noError){
				$.alert("您的网络连接异常，请重试");
			}
			stopPlayGame(playId);
		}
	});
}

function stopPlayGame(playId) {
	$('#' + playId + "-mult-r").oneTime('1s', function(){
		$(this).stopTime('awardsRandom03');
		this.innerHTML = 0;
	});
	$('#' + playId + "-mult-c").oneTime('2s', function(){
		$(this).stopTime('awardsRandom02');
		this.innerHTML = 0;
	});
	$('#' + playId + "-mult-l").oneTime('3s', function(){
		$(this).stopTime('awardsRandom01');
		this.innerHTML = 0;
		
		console.log(playId + ' was done.');
		delete(betInBuyDoingArray[playId]);
	});
}

function checkDisable(playId, currAmount) {
	
	$("#" + playId).find(".awardsGameType[id^='awardsGameType-']").each(function() {
		var ty = this.id.replace("awardsGameType-" + playId + "-", "");
		var ga = getGameAmount(ty, currAmount);
		if (currAmount < ga || ga < hs.lottery.betInAmountMix) {
			$(this).addClass("disabled");
		} else {
			$(this).removeClass("disabled");
		}
	});
}

var betInMsgTimer;
function checkBetIn(betId, amount, currResultAmount) {
	var $awardsWarn = $("#awardsWarn");
	var $awardsLottWarnInfo = $("#awardsLottWarnInfo");
	
	var colseWin = Math.sub($("#play-" + betId + "-currResultAmount").text(), hs.lottery.betInAmountMix) < 0;
	var flag = false;
	if (parseInt($("#play-" + betId + "-gameCount").text()) <= 0 || Math.sub(amount, currResultAmount) > 0) {
		$awardsLottWarnInfo.html("<p>您本轮的挑战次数/余额不足</p><p>请投注金牌娱乐彩种，中奖后将再次激活彩中彩</p>");
		colseWin = true;
	} else if (Math.sub(amount, hs.lottery.betInAmountMix) < 0) {
		$awardsLottWarnInfo.text("中奖额度不够开启彩中彩，需至少中奖" + hs.lottery.betInAmountMix + "元以上");
	} else if (Math.sub(amount, hs.lottery.betInAmountMax) > 0) {
		$awardsLottWarnInfo.text("彩中彩最高额度为：" + hs.lottery.betInAmountMax);
	} else {
		flag = true;
	}
	if (!flag) {
		$awardsWarn.find("a").click(function () {
			closeAwardsWarn(betId);
		});
		$awardsWarn.show();
		if (colseWin) {
			$("#awardsLottGameArea-play-" + betId).hide();
		}
		if (betInMsgTimer) {
			clearInterval(betInMsgTimer);
		}
		$("#awardsWarnTime").text(5);
		betInMsgTimer = setInterval(function() {
			var awardsWarnTime = parseInt($("#awardsWarnTime").text());
			if (awardsWarnTime > 0) {
				awardsWarnTime--;
			}
			$("#awardsWarnTime").text(awardsWarnTime);
			if (awardsWarnTime == 0) {
				clearInterval(betInMsgTimer);
				$("#awardsWarn").hide();
				if (colseWin) {
					$(".closeAwardsDialogBtn[data-id='win-" + betId + "']").click();// 关闭中奖窗口
				}
			}
		}, 1000);
	}
	return flag;
}

function closeAwardsWarn(betId) {
	if (betInMsgTimer) {
		clearInterval(betInMsgTimer);
	}
	$("#awardsWarn").hide();
	$(".closeAwardsDialogBtn[data-id='win-" + betId + "']").click();// 关闭中奖窗口
}

$(function () {
	//彩中彩上方中奖提示小窗口
	lottDetailShow();
	$(document).on('click', '.awardsLottDetail', function(){
		$(this).addClass('active').siblings().removeClass('active');
		//console.log('显示data-id为' + $(this).find('i').attr('data-id') + '的彩中彩窗口');
		openBetInWindow(this.id);
	});
	// 关闭中奖窗口
	$(document).on('click', '.closeAwardsDialogBtn', function(e){
		//阻止事件冒泡，阻止父元素的点击事件
		e = e || window.event;
		if (e && e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble=true;
		}
		//console.log('关闭当前窗口，及data-id等于' + $(this).attr('data-id') + '的彩中彩窗口');
		var isOpenWin = $("#" + $(this).attr('data-id')).attr('class').indexOf('active') >= 0;
		var betId = $(this).attr('data-id').replace("play", "").replace("win", "");
		$("#win" + betId).remove();
		$("#play" + betId).remove();
		if (isOpenWin) {
			$("#awardsMsgGroupWin li").first().click();
		}
		lottDetailShow();//彩中彩上方中奖提示小窗口位置重新排序
	});
	//彩中彩窗口关闭
	$(document).on('click', '.closeAwardsLott', function(){
		var id = $(this).attr('data-id');
		$(id).hide();
		$('.awardsLottListBox .closeAwardsDialogBtn[data-id="' + id + '"]').click();
		//console.log('关闭当前窗口，及data-id等于' + $(this).attr('data-id') + '的中奖小窗口');
		var betId = $(this).attr('data-id').replace("play", "").replace("win", "");
		var isOpenWin = $("#win" + betId).attr('class').indexOf('active') >= 0;
		$("#win" + betId).remove();
		$("#play" + betId).remove();
		if (isOpenWin) {
			$("#awardsMsgGroupWin li").first().click();
		}
		lottDetailShow();//彩中彩上方中奖提示小窗口位置重新排序
	});
	//彩中彩显示游戏规则
	$(document).on('click', '.awardsRuleBtn', function(){
		$(this).next().slideToggle('slow');
	});
	$(document).on('click', '#gameRuleBtn', function(){
		$('.awardsRuleBtn:visible').click();
	});
	
	//中奖弹窗关闭
	$('body').on('click', '.closeAwardsMsg', function(){
		$('#' + $(this).attr('data-id')).removeClass('awardsShowBox');
		$(this).oneTime('5ds',function(){
			$('#' + $(this).attr('data-id')).remove();
		});
		lottDetailShow();//彩中彩上方中奖提示小窗口位置重新排序
	});
});

//开奖没有动画
function lottNumBaseAnim(){
	var height = $('.lottNumDetail p:first').height(); //一个号码的高度
	//循环每列开奖号码
	$('.lottNumDetail').each(function () {
		//停止动画时获取当前开奖号码位置
		var baseIndex = $(this).find('p.active').index();
		//当开奖号码为第一个数字的时候
		if (baseIndex == 0){
			baseIndex = -0;
		}
		var baseNumPos = baseIndex * -height;//开奖号码所在的位置
		$(this).css('margin-top', baseNumPos + 'px');
	});
}

//开奖号码动画
function lottNumAnimate(){
	$("body").stopTime('lottOpen');	//停止上次动画

	var height = $('.lottNumDetail p:first').height(); //一个号码的高度
	var size = $('.lottNumDetail').length; //开奖号码个数
	
	
	var maxTimes = 25;  //每个速度运行的次数
	var maxSpeed = 60;	//最大速度
	var stpSpeed = 5;	//单次速度
	
	var okNum = 0;		//已完成的个数
	
	var infos = [];
	for(var i = 0; i < size; i++) {
		//speed:当前速度 ， times：次数，每个速度跑的次数,status:状态0初始  1加速度，2匀速  3完成
		infos.push({speed:0,times:0,status:-i*15,stop:false});
	}
	$("body").everyTime( '20ms', 'lottOpen', function(){
		for(var i=0;i<size;i++) {
			//计算速度
			var info = infos[i];
			var isRun = true;
			if(info.status == 0){
				//初始状态变成加速度状态
				info.status = 1;
				info.speed+=stpSpeed;	//速度开始起来
				info.times = 0;	//开始计算运行次数
			} else if(info.status == 1){
				if(info.speed<maxSpeed) {
					info.times++;
					//超过次数就加速度上去，并重新计算次数
					if(info.times>maxTimes) {
						info.times = 0;
						info.speed+=stpSpeed;	//速度开始起来
					}
				} else {
					//速度达到最大就变成下个状态：匀速
					info.times = 0;
					info.status = 2;
				}
			} else if(info.status == 2) {
				//匀速运行
				//直到有号码后再运行指定次数
				if(hasNum) {
					info.times++;
					if(info.times>maxTimes) {
						info.times=0;
						info.status = 3;
					}
				}
			} else if(info.status == 3) {
			} else {
				//没开始就一直加直到开始
				info.status ++;
				if(info.status>3) {
					info.status = 0;
				}
			}

			//如果有速度
			if(info.speed>0 && info.status >=0 && info.status<3) {
				var lottNum = $(".lottNumDetail").eq(i).find('p').length - 1; //获取每个开奖号码位置共有多少可选号码
				
				var posTop = parseInt($('.lottNumDetail').eq(i).css('margin-top'));
				var posAll = lottNum * -height;
				
				//到最后一个号码的位置时，跳到第一个号码
				if (posTop <= posAll) {
					posTop = 0;
				} else {
					posTop -= info.speed;
				}
				$('.lottNumDetail').eq(i).css('margin-top', posTop);
			} else if(info.status == 3 && !info.stop) {
				// 停止动画，显示开奖
//				var pos = $(".lottNumDetail").eq(i).find('p.active').index() * -height;
//				$('.lottNumDetail').eq(i).css('margin-top', pos);
				var pos = $(".lottNumDetail").eq(i).find('p.active').index() * -height;
				$('.lottNumDetail').eq(i).css('margin-top', pos);
				okNum++;
				info.stop = true;
			}
		}
		if(okNum>=size) {
			$("body").stopTime('lottOpen');
		}
	});
}

//快3：开奖号码和值
function k3Sum(){
	$('.beforeLottNum').each(function(index){
		var $beforeLottNum = $(this);
		var html = '';
		var sum = 0;
		$beforeLottNum.find('span').each(function(){
			var value = ~~$(this).attr('data-value'); 
			sum += value;
		});
		var daXiao = (sum>10) ? ('<span style="color:#f33;">大</span>&emsp;') : ('<span style="color:#f90;">小</span>&emsp;');
		var danShuang = (sum%2==0) ? ('<span style="color:#69f;">双 </span>'): ('<span style="color:#9c9;">单</span>');
		html += '<span style="color:#00ddcb;">' + sum + '</span>&emsp;' + daXiao + danShuang;
		$beforeLottNum.next('.k3SumTd').append(html);
	});
}

function changeBouns(){
    var play = $(".lottTypeBox:visible")
        .find(".lottTypeDetail.active");
	var bouns = play.attr("data-bonus");
	var beishu = 1700 / +bouns;
    var max = $("#bounsNumRange").attr("max");
    var bounsNumRange = $("#bounsNumRange").val();
    $("#bounsNumRangeValue").val(bounsNumRange);
    var bounsNum = ((bounsNumRange * 20 + 1700) / beishu).toFixed(2);
    if(max == bounsNumRange){
        $("#bounsNum").text(bounsNum);
	}else{
        bounsNumRange = max - bounsNumRange;
        bounsNumRange = bounsNumRange.toFixed(1);
        $("#bounsNum").text(bounsNum + "-" + bounsNumRange + "%");
	}
}