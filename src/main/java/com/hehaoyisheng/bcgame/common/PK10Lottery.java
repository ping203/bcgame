package com.hehaoyisheng.bcgame.common;

import com.hehaoyisheng.bcgame.entity.BcLotteryOrder;
import com.hehaoyisheng.bcgame.entity.MoneyHistory;
import com.hehaoyisheng.bcgame.entity.User;
import com.hehaoyisheng.bcgame.manager.BcLotteryOrderManager;
import com.hehaoyisheng.bcgame.manager.MoneyHistoryManager;
import com.hehaoyisheng.bcgame.manager.TraceManager;
import com.hehaoyisheng.bcgame.manager.UserManager;
import org.springframework.util.CollectionUtils;

import java.util.List;

public class PK10Lottery implements Runnable{

    private BcLotteryOrderManager bcLotteryOrderManager;

    private UserManager userManager;

    private MoneyHistoryManager moneyHistoryManager;

    private List<BcLotteryOrder> bcLotteryOrders;

    private TraceManager traceManager;

    private String looteryContent;

    public List<BcLotteryOrder> getBcLotteryOrders() {
        return bcLotteryOrders;
    }

    public void setBcLotteryOrders(List<BcLotteryOrder> bcLotteryOrders) {
        this.bcLotteryOrders = bcLotteryOrders;
    }

    public String getLooteryContent() {
        return looteryContent;
    }

    public void setLooteryContent(String looteryContent) {
        this.looteryContent = looteryContent;
    }

    public PK10Lottery(BcLotteryOrderManager bcLotteryOrderManager, TraceManager traceManager, UserManager userManager, MoneyHistoryManager moneyHistoryManager,  List<BcLotteryOrder> bcLotteryOrders, String looteryContent) {
        this.bcLotteryOrderManager = bcLotteryOrderManager;
        this.bcLotteryOrders = bcLotteryOrders;
        this.moneyHistoryManager = moneyHistoryManager;
        this.looteryContent = looteryContent;
        this.userManager = userManager;
        this.traceManager = traceManager;
    }

    public void run() {{
        if(CollectionUtils.isEmpty(bcLotteryOrders)){
            return;
        }
        for(BcLotteryOrder bcLotteryOrder : bcLotteryOrders){
            try {
                bcLotteryOrder.setLotteryHaoMa(looteryContent);
                String playCode = bcLotteryOrder.getPlayCode();
                String betNumber = bcLotteryOrder.getHaoMa();
                int winCount = 0;
                if(playCode.contains("fs")){
                    winCount = GameLottery.pk10FsLottery(looteryContent, betNumber);
                }else if(playCode.contains("_dj")){
                    winCount = GameLottery.pk10CqLottery(looteryContent, betNumber);
                }else if(playCode.contains("dwd")){
                    winCount = GameLottery.pk10DwdLottery(looteryContent, betNumber, playCode);
                }else if(playCode.contains("_lh")){
                    winCount = GameLottery.pk10Lh(looteryContent, betNumber);
                }else if(playCode.contains("star2_and")){
                    winCount = GameLottery.pk10Gyh(looteryContent, betNumber);
                }
                int betCount = 0;
                if(BetCountData.hashmap.get(bcLotteryOrder.getPlayCode()) != null){
                    betCount = BetCountData.hashmap.get(bcLotteryOrder.getPlayCode());
                }
                if(bcLotteryOrder.getBuyZhuShu() < (betCount * 0.3)){
                    if((bcLotteryOrder.getOdds() * winCount * bcLotteryOrder.getMultiple() * (bcLotteryOrder.getMinBonusOdds() / 2)) > 20000){
                        bcLotteryOrder.setWinMoney(20000);
                    }else{
                        bcLotteryOrder.setWinMoney(bcLotteryOrder.getOdds() * winCount * bcLotteryOrder.getMultiple() * (bcLotteryOrder.getMinBonusOdds() / 2));
                    }
                }else{
                    bcLotteryOrder.setWinMoney(bcLotteryOrder.getOdds() * winCount * bcLotteryOrder.getMultiple() * (bcLotteryOrder.getMinBonusOdds() / 2));
                }
                LotteryCommon.addMoneyAndHistory(winCount, bcLotteryOrderManager, traceManager, bcLotteryOrder, userManager, moneyHistoryManager);
            }catch (Exception e){
                e.printStackTrace();
            }
        }
    }

    }
}
