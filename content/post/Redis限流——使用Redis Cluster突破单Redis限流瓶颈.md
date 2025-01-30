---
title: Redis限流——使用Redis Cluster突破单Redis限流瓶颈
author: 听雨coding
date: 2025-01-30
tags:
  - Redis
layout: post
published: true
image: /img/2018-06-04-introducing-the-istio-v1alpha3-routing-api/background.jpg
---

# 概述

当我们借助Redis实现分布式限流时，通常会根据将一个限流key放在一个Redis节点上，例如使用Redission的限流：
```java
RRateLimiter rateLimiter = redissonClient.getRateLimiter("rate:limiter:key");  
rateLimiter.trySetRate(  
        RateType.OVERALL,  
        100, 
        1,  
        RateIntervalUnit.SECONDS  
);
rateLimiter.tryAcquire(1);
```
使用这种方式限流，关于`rate:limiter:key`这个限流key的请求都会请求该key所在的Redis节点，也就是说是单个Redis实例承担了这个限流key的所有请求。

然而当这个限流key的QPS超出单个Redis实例所能承受的极限时，那么将会导致这个Redis节点宕机，导致限流甚至服务不可用。

本文针对此问题，使用Redis Cluster来优化Redis限流单点瓶颈的问题，如有问题还请大家在评论区指出。

# Redis Cluster限流

首先我们需要知道为什么Redis Cluster可以解决Redis单点的问题。

Redis Cluster中有多个主节点可以接收请求，并且每个主节点有多个从节点进行容灾和备份。

Redis Cluster的各个主节点是通过分配16384个槽来决定每个主节点应该负责哪些key。

一个key是如何路由到Redis Cluster中的一个主节点的呢？
Redis Cluster会根据key计算出一个哈希key，这个key是整数，判断这个key对应的槽是哪个主节点负责，就将这个key分配给对应主节点。
当Redis的key加了`{}`大括号的后缀，Redis Cluster就会根据`{}`里的信息去计算哈希key。

因此，我们可以通过指定`{}`的信息去将单个限流key分散到不同的主节点，每个主节点负责一部分限流，同时我们对其进行负载均衡，确保请求能均匀的分布在这些Redis节点上。

以下是简单的代码实现:
```java
public class RedisRateLimiter implements RateLimiter {  
  
    // 线程安全的负载均衡计数器  
    private final AtomicInteger loadBalanced = new AtomicInteger(0);  
  
    // 集群节点数量  
    private final int size;  
  
    // 限流键  
    private final String key;  
  
    // 总限流速率  
    private final long rate;  
  
    // 时间单位  
    private final TimeUnit unit;  
  
    // 每个节点的限流器列表  
    private final List<RRateLimiter> rateLimiters = new ArrayList<>();  
  
    public RedisRateLimiter(String key, long rate, int time, TimeUnit unit) {  
        this.key = key;  
        this.rate = rate;  
        this.unit = unit;  
  
        // 获取 Redisson 客户端实例  
        RedissonClient redissonClient = RedissonClusterSingleton.getInstance();  
  
        // 获取集群节点数量  
        this.size = redissonClient.getClusterNodesGroup().getNodes().size();  
  
        // 初始化每个节点的限流器  
        for (int i = 0; i < size; i++) {  
            // 限流键分片，确保分布在不同的 Redis 节点上  
            RRateLimiter rateLimiter = redissonClient.getRateLimiter(key + "{" + (i + 1) + "}");  
  
            // 设置限流规则：每个节点分配均等的限流速率  
            rateLimiter.trySetRate(  
                    RateType.OVERALL,  
                    rate / size,  
                    time,  
                    RateIntervalUnit.valueOf(unit.name())  
            );  
  
            rateLimiters.add(rateLimiter);  
        }  
    }  
  
    /**  
     * 获取下一个限流器索引 (负载均衡)  
     *     
     * @return 限流器索引  
     */  
    private int getLoadBalanced() {  
        // 使用 AtomicInteger 实现线程安全的轮询  
        return loadBalanced.getAndIncrement() % size;  
    }  
  
    @Override  
    public boolean acquire() {  
        // 通过负载均衡获取对应的限流器  
        RRateLimiter rRateLimiter = rateLimiters.get(getLoadBalanced());  
        return rRateLimiter.tryAcquire(1);  
    }  
  
    @Override  
    public boolean acquire(int permits) {  
        // 通过负载均衡获取对应的限流器  
        RRateLimiter rRateLimiter = rateLimiters.get(getLoadBalanced());  
        return rRateLimiter.tryAcquire(permits);  
    }  
}
```
上述代码有很多不完善的地方，比如负载均衡没有考虑CRC16算法计算`{}`中的值后再计算哈希key是否能保证每个Redis节点的轮询等等，后续将完善并更新。