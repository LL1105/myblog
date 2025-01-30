# Linux的进程

首先我们看下进程的定义：**进程就是处于执行期的程序**。

我们知道，进程是操作系统资源分配的基本单位，每个进程有独属于自己的虚拟空间。

在Linux中，内核把进程存放在一个双向循环链表中，称为任务队列。链表中的每一项都是task_struct，称为进程描述符。

Linux中的每个进程都有一个独一无二的pid，用于唯一标识这个进程，同时每个进程都有一个父进程，init进程是全局的父进程，它没有父进程。

那么Linux进程是如何知道它的task_struct在哪里呢？实际上每个进程都会有自己的内核栈，而在栈顶存储了一个名为thread_info的结构，thread_info中就存储着所对应task_struct的地址。

接下来我们介绍Linux内核创建进程的方式：**fork()**

# 使用fork()创建进程

在探索fork()执行流程之前，我们先来看看进程有哪些状态，也就是task_struct中的state字段：

- TASK_RUNNING：进程是可执行的。这表示它正在执行或者正在运行队列中等待执行。
- TASK_INTERRUPTIBLE：进程正在睡眠（被阻塞），等待某些条件的达成。一旦条件达成，那么进程就会立即运行。处于此状态的进程可以被立即唤醒并变为TASK_RUNNING状态。
- TASK_UNINTERRUPTIBLE：进程不可被唤醒，只能等待条件达成才可以变成TASK_RUNNING状态。
- TASK_TRACED：被其他线程跟踪。
- TASK_STOPPED：进程停止执行。

当使用fork()函数创建一个进程，此进程立马进入TASK_RUNNING状态（准备就绪但还未投入运行)，接下来通过schedule()函数将进程投入运行，此时的进程即处于运行状态。

![[Pasted image 20241125203947.png]]
## 创建进程

首先我们明确一点，Linux调用fork()函数只是拷贝当前进程去创建一个子进程。子进程与当前进程的区别仅是PID、PPID(父进程的pid)和某些资源和统计量(例如：挂起的信号)。而exec()函数则是读取一段代码去执行这个子进程，也就是说，想要让子进程执行与父进程不同的逻辑，就必须调用exec()函数。

以下是一个创建进程的简单代码实例：
```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main() {
    pid_t pid;

    // 创建子进程
    pid = fork();

    if (pid < 0) {
        perror("fork failed");
        exit(EXIT_FAILURE);
    } else if (pid == 0) {
        printf("Child process (PID: %d), executing new program...\n", getpid());
        char *args[] = {"ls", "-l", NULL};  // 参数数组
        execvp(args[0], args);
        perror("exec failed");
        exit(EXIT_FAILURE);
    } else {
        printf("Parent process (PID: %d), waiting for child process (PID: %d)...\n", getpid(), pid);
        int status;
        wait(&status); 
        if (WIFEXITED(status)) {
            printf("Child process exited with status %d\n", WEXITSTATUS(status));
        } else {
            printf("Child process did not terminate normally\n");
        }
    }
    return 0;
}

```
- **`fork()`**:
    - 创建一个子进程。
    - 返回值：
        - 父进程中返回子进程的 PID。
        - 子进程中返回 0。
        - 失败时返回 -1。
- **`execvp()`**:
    - 用新的程序替换当前进程的代码段。
    - 参数：
        - 第一个参数是要执行的程序名。
        - 第二个参数是参数数组，最后一个元素必须为 `NULL`。
- **`wait()`**:
    - 父进程等待子进程完成并获取其退出状态。

## 写时复制

Linux的写时复制(copy-on-write)是一种可以推迟甚至可以免除拷贝的技术。

在执行fork()函数时，Linux并不会将父进程的所有资源进行拷贝，而是让子进程和父进程共享空间。
只有在需要写入的时候，父进程的资源才会被复制。如果fork()后立即调用exec()，也就代表父进程的页不会被写入，所以父进程的资源就不会被复制了。
fork()的实际开销就是复制父进程的页表和给子进程创建一个task_struct，但是一般情况下，进程创建后都会立即执行exec()函数，也就是运行一个可执行文件，所以也就避免了拷贝大量的数据。

# 停止进程

## 僵尸进程

进程一般调用exit()系统调用去终结，或者接收到特定信号或异常时去终结，而这些终结进程的方式最后都会调用do_exit()方法。

在进程终结后会释放它所占用的资源，但是会保留它的进程描述符task_struct，处于这个状态的进程也叫**僵尸进程**。

在进程释放资源后，需要通知它的父进程来删除它的task_struct，父进程使用wati()函数(wait4()系统调用)去删除子进程的task_struct;

## 孤儿进程

当父进程在子进程之前终结，这时如果子进程找不到合适的父进程，子进程就成了一个**孤儿进程**，当孤儿进程终结时，无法找到父进程删除它的task_struct，那么这个进程就会永远变成僵尸进程。

解决方案就是当子进程找不到父进程时，就在当前线程组内找一个进程作为父进程，如果不行，就会让全局父进程init进程进行托管。

# 总结

- **进程的本质**：是操作系统中管理和分配资源的基本单位。
- **创建与执行**：
    - `fork()` 创建子进程，初始与父进程共享内存。
    - `exec()` 使子进程运行独立的逻辑。
- **僵尸进程** 和 **孤儿进程** 是进程管理中常见问题，需通过 `wait` 或 `init` 进程来处理。
- **写时复制** 提高了资源利用效率，是 `fork()` 的关键优化。



