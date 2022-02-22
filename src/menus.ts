
// type IRunAnything = Symbol

// export interface IRunAnything<K,V> extends IRunAnything {
//     key:K
//     value:V
// }

// class RunAnything<K,V> implements IRunAnything<K,V> {
//     toString(): string {
//         throw new Error('Method not implemented.')
//     }
//     valueOf(): symbol {
//         throw new Error('Method not implemented.')
//     }
//     description: string | undefined
//     [Symbol.toPrimitive](hint: string): symbol {
//         throw new Error('Method not implemented.')
//     }
//     [Symbol.toStringTag]: string
    
// }

interface IRunAnything {
    key : string;
    val: string | IRunAnything[]
}

// export const commands:IRunAnything<string, string>[] = [
    // {key: "terminal", value: "deepin-terminal"}
    // "terminal": "deepin-terminal",
    // "file": "dde-file-manager",
    // "control": "dde-control-center --show",
    // "launch": "dde-launcher --show",
    // "app": "deepin-home-appstore-client",
    // "bing": "xdg-open http://bing.com"
// ]

export const docs = {
    "x11": "xdg-open /usr/share/doc/libx11-dev/i18n/compose/zh_CN.html",
    "xcb": "xdg-open /usr/share/doc/libxcb1-dev/tutorial/index.html",
    "cmake" : "xdg-open https://devdocs.io/cmake~3.15/",
}
export const container = ['(',')']

// Object.keys(docs) 
// --> [ 'x11', 'xcb', 'cmake' ]

// Object.keys(docs).join(",")
// --> x11,xcb,cmake

// container.join(Object.keys(docs).join(","))
// --> (x11,xcb,cmake)

import { promisify } from 'util'
import * as vscode from 'vscode'
import * as fs from 'fs'
import { join } from 'path';
import { exec } from 'child_process';
import { type } from 'os';
import { Configuration } from './configuration'


function GetRunAnything(config : any) : IRunAnything[] {
    let anythings: IRunAnything[] = []
    Object.entries(config).forEach(element => {
        let anything: IRunAnything = {key: String(element[0]), val: element[0]}
        // console.log(element[0] + " --> "+ element[1])
        if (element[0] && element[1]) {
            if (typeof element[1] === 'string') {
                anything.val = String(element[1])
            } else if (typeof element[1] === 'object') {
                anything.val = GetRunAnything(element[1])
            }
            anythings.push(anything)
        }
    })

    return anythings
}

interface IRunAnythingItem extends vscode.QuickPickItem {
    anything: IRunAnything
}

function RunAnything(runAnythings: IRunAnything[]) {
    // let keys:string[] = []
    // runAnythings.forEach(element => {
    //     keys.push(element.key)
    // })

    let tip = runAnythings.filter(thing => thing.key === "anything")
    let anys = runAnythings.filter(thing => thing.key !== "anything")

    vscode.window.showQuickPick(
        anys.map(element => {
            if (typeof element.val === 'string') {}
            const item: IRunAnythingItem =  {
                label: String(element.key),
                detail: String(element.val),
                anything: element
            }
            return item
        }),
        {
            placeHolder: (tip.length>0)?String(tip[0].val):"",
        }
    ).then((value) => {
        if (value) {
            if (typeof value.anything.val === 'object') {
                RunAnything(value.anything.val)
            } else {
                exec(String(value.anything.val))
            }
        }
    })
}

export function initRunAnythinMenu(uri?: vscode.Uri){
    const config = Configuration.getRunAnythingConfig()
    var runAnythings:IRunAnything[] = GetRunAnything(config)

    RunAnything(runAnythings)

    return
    runAnythings.forEach(element => {
        console.log(element.key)
    });

    let keys:string[] = []
    runAnythings.forEach(element => {
        keys.push(element.key)
    })

    vscode.window.showQuickPick(
        runAnythings.map(element => {
            if (typeof element.val === 'string') {}
            const item: vscode.QuickPickItem =  {
                label: String(element.key),
                detail: String(element.val),
            }
            return item
        })
    ).then()

    return
    vscode.window.showInputBox({
        ignoreFocusOut: true,
        placeHolder: "你想执行点儿什么？",
        prompt: container.join(keys.join("|")),
        validateInput: function(v) {
            if (v === "") return
            for (let i = 0; i < keys.length; i++) {
                if (v === keys[i]) return
            }
            return "无此命令";
        },
        // prompt: container.join(Object.keys(commands).join("|").concat('|doc')),
        // validateInput: function(v) {
            // if (commands[v as keyof typeof commands] || v === "doc") {return "";}
            // return "无此命令";
        // },
    }).then((value) => { 
        if (value === "") return
        
        console.log(value)
        
        // const cmd = (v :string | undefined)=>(commands[v as keyof typeof commands] || undefined)
        
        // if (cmd(value)) {
        //     exec(String(cmd(value)));
        //     return;
        // }

        // if(value === "doc") {
        //     vscode.window.showInputBox({
        //         ignoreFocusOut: true,
        //         placeHolder: "你想查看点儿什么？",
        //         prompt: container.join(Object.keys(docs).join(",")),
        //         validateInput: function(v) {
        //             if (docs[v as keyof typeof docs])
        //                 return ""
        //             return "无此文档"
        //         },
        //     }).then((manual)=> {
        //         const doc = (v :string | undefined)=>(docs[v as keyof typeof docs] || undefined)

        //         if (doc(manual)) exec(String(doc(manual)))
        //     })
        // }
    })
}