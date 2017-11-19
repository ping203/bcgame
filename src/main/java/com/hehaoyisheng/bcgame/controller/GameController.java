package com.hehaoyisheng.bcgame.controller;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.hehaoyisheng.bcgame.entity.BcLotteryOrder;
import com.hehaoyisheng.bcgame.entity.User;
import com.hehaoyisheng.bcgame.entity.transfar.OrderTransfar;
import com.hehaoyisheng.bcgame.entity.vo.LotteryOrder;
import com.hehaoyisheng.bcgame.entity.vo.Result;
import com.hehaoyisheng.bcgame.manager.BcLotteryOrderManager;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Controller
@SessionAttributes("user")
public class GameController {

    @Resource
    private BcLotteryOrderManager bcLotteryOrderManager;

    /**
     * 投注和追号的记录
     */
    @RequestMapping("/game/index")
    public String game(String tabId, @ModelAttribute("user") User user, Model model){
        if(!StringUtils.isEmpty(tabId)){
            if(tabId.equals("trace") || tabId.equals("gameBetList")){
                model.addAttribute("account", user.getUsername());
                return "gameBetList";
            }
        }
        return null;
    }

    /**
     * 投注记录查询
     * @return
     */
    @RequestMapping("/game/list")
    @ResponseBody
    public Result gameList(@ModelAttribute("user") User user, int rows, int page, String lotteryId, int status, Date startTime, Date endTime){
        //计算页码
        int from = rows * page;
        //查询
        BcLotteryOrder bcLotteryOrder = new BcLotteryOrder();
        bcLotteryOrder.setAccount(user.getUsername());
        bcLotteryOrder.setAccountId(user.getId());
        bcLotteryOrder.setStatus(status);
        bcLotteryOrder.setLotCode(lotteryId);
        List<BcLotteryOrder> list = bcLotteryOrderManager.select(bcLotteryOrder, from, rows, startTime, endTime);
        int total = bcLotteryOrderManager.count(bcLotteryOrder, from, rows, startTime, endTime);
        //trans对象
        List<LotteryOrder> resultList = Lists.newArrayList();
        for(BcLotteryOrder bcLotteryOrder1 : list){
            resultList.add(OrderTransfar.bcLotteryToLottery(bcLotteryOrder1));
        }
        Map<String, Object> resultMap = Maps.newHashMap();
        resultMap.put("obj", null);
        resultMap.put("total", total);
        resultMap.put("rows", resultList);
        return Result.success(resultMap);
    }

    /**
     * 追号查询
     * @param user
     * @param rows
     * @param page
     * @param lotteryId
     * @param status
     * @param startTime
     * @param endTime
     * @return
     */
    @RequestMapping("/game/traceList")
    @ResponseBody
    public Result traceList(@ModelAttribute("user") User user, int rows, int page, String lotteryId, int status, Date startTime, Date endTime){
        return Result.success(null);
    }
}
