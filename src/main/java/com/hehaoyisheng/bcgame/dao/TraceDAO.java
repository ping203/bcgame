package com.hehaoyisheng.bcgame.dao;

import com.hehaoyisheng.bcgame.entity.Trace;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.Date;
import java.util.List;

//TODO
public interface TraceDAO {
    @Insert("insert into trace (id, account, createTime, isWinStop, lotteryId, lotteryName, startSeason, traceAmount, traceNum, createTime) values (#{id}, #{account}, #{createTime}, #{isWinStop}, #{lotteryId}, #{lotteryName}, #{startSeason}, #{traceAmount}, #{traceNum}, now())")
    int insert(Trace trace);

    @Update("update trace set winAmount=#{winAmount}, status=#{status} where id=#{id}")
    int update(Trace trace);


    @Select("<script> " +
            "select * " +
            "from trace" +
            " <trim prefix=\"where\" prefixOverrides=\"AND |OR \">" +
            " <if test=\"trace.status != null\"> AND status=#{trace.status}</if> " +
            " <if test=\"trace.lotteryId != null\"> AND lotteryId=#{trace.lotteryId}</if> " +
            " <if test=\"trace.account != null\"> AND account=#{trace.account}</if> " +
            " <if test=\"startTime != null\"><![CDATA[  AND createTime >=  DATE_FORMAT(#{startTime}, '%Y-%m-%d %H:%T:%s') AND createTime <= DATE_FORMAT(#{endTime}, '%Y-%m-%d %H:%T:%s')]]></if>" +
            " </trim> " +
            " order by id desc" +
            " <if test=\"from != null\"> limit #{from},#{limit} </if> " +
            " </script> ")
    List<Trace> select(@Param("trace") Trace trace, @Param("from") Integer from, @Param("limit") Integer limit, @Param("startTime") Date startTime, @Param("endTime") Date endTime);

    @Select("<script> " +
            "select count(*) " +
            "from trace" +
            " <trim prefix=\"where\" prefixOverrides=\"AND |OR \">" +
            " <if test=\"trace.status != null\"> AND status=#{trace.status}</if> " +
            " <if test=\"trace.lotteryId != null\"> AND lotteryId=#{trace.lotteryId}</if> " +
            " <if test=\"trace.account != null\"> AND account=#{trace.account}</if> " +
            " <if test=\"startTime != null\"><![CDATA[  AND createTime >=  DATE_FORMAT(#{startTime}, '%Y-%m-%d %H:%T:%s') AND createTime <= DATE_FORMAT(#{endTime}, '%Y-%m-%d %H:%T:%s')]]></if>" +
            " </trim> " +
            " </script> ")
    int count(@Param("trace")Trace trace, @Param("startTime") Date startTime, @Param("endTime") Date endTime);
}
