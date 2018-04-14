package com.hehaoyisheng.bcgame.common;

import com.google.common.collect.Maps;
import com.hehaoyisheng.bcgame.entity.BcLotteryHistory;

import java.util.Map;

public class GameData {
    /**
     * 游戏时间
     */
    public static Map<String, Long> gameTime = Maps.newConcurrentMap();

    /**
     * 游戏期号
     */
    public static Map<String, String> gameSeasonId = Maps.newConcurrentMap();

    /**
     * 最后开奖
     */
    public static Map<String, BcLotteryHistory> lastOpen = Maps.newConcurrentMap();

    /**
     * 总期数
     */
    public static Map<String, Integer> seasonCount = Maps.newConcurrentMap();

    /**
     * 已开期数
     */
    public static Map<String, Integer> openCount = Maps.newConcurrentMap();

    /**
     * 赔率
     */
    public static Map<String, Double> oddsMap = Maps.newHashMap();

    /**
     * 防止空指针，初始化彩票时间
     */
    static {
        gameTime.put("cqssc", 100L);
        gameTime.put("gd11x5", 100L);
        gameTime.put("pk10", 100L);
        gameTime.put("fc3d", 100L);
        gameTime.put("xjssc", 100L);
        gameTime.put("tjssc", 100L);
        gameTime.put("jx11x5", 100L);
        gameTime.put("sd11x5", 100L);
        gameTime.put("jsk3", 100L);
        gameTime.put("shk3", 100L);

        seasonCount.put("cqssc", 120);
        seasonCount.put("xjssc", 96);
        seasonCount.put("tjssc", 84);
        seasonCount.put("pk10", 179);
        seasonCount.put("gd11x5", 84);
        seasonCount.put("jx11x5", 84);
        seasonCount.put("sd11x5", 87);
        seasonCount.put("jsk3", 82);
        seasonCount.put("shk3", 82);
        //seasonCount.put("11x5", 84);

        lastOpen.put("cqssc", new BcLotteryHistory());
        lastOpen.put("xjssc", new BcLotteryHistory());
        lastOpen.put("tjssc", new BcLotteryHistory());
        lastOpen.put("pk10", new BcLotteryHistory());
        lastOpen.put("gd11x5", new BcLotteryHistory());
        lastOpen.put("jx11x5", new BcLotteryHistory());
        lastOpen.put("sd11x5", new BcLotteryHistory());
        lastOpen.put("jsk3", new BcLotteryHistory());
        lastOpen.put("shk3", new BcLotteryHistory());

        openCount.put("cqssc", 0);
        openCount.put("tjssc", 0);
        openCount.put("xjssc", 0);
        openCount.put("pk10", 0);
        openCount.put("gd11x5", 0);
        openCount.put("jx11x5", 0);
        openCount.put("sd11x5", 0);
        openCount.put("jsk3", 0);
        openCount.put("shk3", 0);
    }

    public static void main(String[] args){
        System.out.println("insert into bcLotteryOrder (account, accountId, buyMoney, buyZhuShu, haoMa, lotCode, lotName, lotType, multiple, playCode, playName, qiHao, minBonusOdds, shangji) values (#{account}, #{accountId}, #{buyMoney}, #{buyZhuShu}, #{haoMa}, #{lotCode}, #{lotName}, #{lotType}, #{multiple}, #{playCode}, #{playName}, #{qiHao}, #{minBonusOdds}, #{shangji})".substring(429, 1));
    }
}