

interface 编程范式 {
}

interface 面向过程编程 extends 编程范式 {
}

interface 面向对象编程 extends 编程范式{
    
}
interface 面向接口编程 extends 编程范式 {

}

interface 程序设计 extends 面向接口编程,面向对象编程,面向过程编程{
    
}

class C程序 implements 面向过程编程 {
    
}

class Java程序 implements 面向对象编程,面向过程编程 {

}

class Go程序 implements 面向接口编程, 面向对象编程, 面向过程编程 {

}

class 你的程序 {
    day1: 程序设计 = new C程序()
    day2: 程序设计 = new Java程序()
    day3: 程序设计 = new Go程序()

    新设计: 程序设计 = {
        语言: "意念",
        函数: "意念",
        语法糖 : ["bala","bala","bala","bala","bala","bala","bala",""]
    }
}

interface 框架模式 {}

interface 结构式框架 extends 框架模式 {}
interface 组件式框架 extends 框架模式 {}
interface 分布式框架 extends 框架模式 {}
interface 意念式框架 extends 框架模式 {}


class 结构式程序 implements 结构式框架{}
class 组件式程序 implements 组件式框架{}
class 分布式程序 implements 分布式框架{}
class 意念式程序 implements 意念式框架{}

interface 元宇宙概念 extends 结构式框架,组件式框架,分布式框架,意念式框架{}

class 元式编程 implements 元宇宙概念 {}

class 你的程序模式 {
    day1: 框架模式 = new 结构式程序()
    day2: 框架模式 = new 组件式程序()
    day3: 框架模式 = new 分布式程序()
    day4: 框架模式 = new 意念式程序()

    dayn: 框架模式 = new 元式编程()
}