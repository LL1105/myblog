# Serial GC

> JDK6及以前的版本的默认GC，包括Serial和Serial Old

# Parallel GC

> JDK7、8的默认GC，包括新生代的Parallel Scavenge和老年代的Parallel Old

# ParNew GC

> 新生代GC，只能搭配CMS和Serial Old

# CMS GC

> JDK5推出的老年代GC

**步骤**：
1. 初始标记
2. 并发标记
3. 重新标记
4. 并发清除

# G1 GC

> JDK9及其以后的版本的默认GC

**步骤**：
1. 初始标记
2. 并发标记
3. 最终标记
4. 筛选回收

# Shenandoah GC

> OpenJDK12作为实验性GC引入

**步骤**：
1. 初始标记
2. 并发标记
3. 最终标记
4. 并发清理
5. 并发回收
6. 初始引用更新
7. 并发引用更新
8. 最终引用更新
9. 并发清理
# Z GC

> JDK11作为实验性GC引入

**步骤**：
1. 并发标记
2. 并发预备重分配
3. 并发重分配
4. 并发重映射