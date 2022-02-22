import axios from "axios";
import { ChildProcess, exec, execSync, spawn } from "child_process";
import * as vscode from 'vscode';
import { Configuration } from "./configuration";
import { ITemplate } from "./template";


// interface IRemoteGit {
//     url: string;
// }

// interface IRemoteShell {
//     commands: string[]
// }

// interface IRemoteExtension {
//     git: IRemoteGit,
//     shell: IRemoteShell
//     questions: IQuestion[]
// }

// /**
//  * 模板描述
//  */
// interface IRemoteTemplate extends IRemoteExtension {
//     action: string
//     message: string
//     commands: string[] | undefined
// }


interface IYes {
    yes: string;
}
interface INo {
    no: string;
}

interface IQuestion extends IYes ,INo {
    id: string;
    question: string;
    action: string;
}

function findNextQuestion(id: string, questions: IQuestion[]): IQuestion|undefined {
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].id === id) {
            return questions[i];
        }
    }
    return undefined;
}

interface IActionShellCommands {
    command: string;
    args: string[] | undefined;
}

interface IActionShell {
    delay: number | undefined;
    commands: string[] | IActionShellCommands[];
}

function RunActionShell(shell: IActionShell, uri?: vscode.Uri) {
    if (uri) {
        if (typeof shell.commands === "object" && shell.commands.length > 0)
        shell.commands.forEach(command => {
            try {
                if (typeof command === "string") {
                    execSync(command, {cwd:uri.fsPath})
                }
            } catch (error) {
                vscode.window.showErrorMessage(command + "执行失败")
            }
        })
    }
}

interface IActionGit {
    url: string;
}

interface IAction {
    action: string;
    shell: IActionShell;
    git: IActionGit;
}

function RunAction(action: IAction, uri?: vscode.Uri) {
    if (action.action === "shell") {
        RunActionShell(action.shell, uri)
    }
}

interface IAnswer extends IAction{
    answer: string;
}

function RunAnswer(answers: IAnswer[], answer: string,uri?: vscode.Uri) {
    answers.forEach(item => {
        if (item.answer === answer) {
            RunAction(item, uri)
        }
    });
}

export function RunQuestionQAndA(questions: IQuestion[], answers: IAnswer[], question: IQuestion|undefined,uri?: vscode.Uri) {
    if (question) {
        if (question.action === "yes|no") {
            vscode.window.showInformationMessage(question.question,"yes", "no").then((value) => {
                if (value && value === "yes") {
                    const next = findNextQuestion(question.yes, questions)
                    if (next) {
                        RunQuestionQAndA(questions, answers, next, uri)
                    } else {
                        RunAnswer(answers, question.yes, uri)
                    }
                }
                if (value && value === "no") {
                    const next = findNextQuestion(question.no, questions)
                    if (next) {
                        RunQuestionQAndA(questions, answers, next, uri)
                    } else {
                        RunAnswer(answers, question.no, uri)
                    }
                }
            })
        }
    } else {
        questions.forEach(question => {
            if (question.id === "a") {
                RunQuestionQAndA(questions, answers, question, uri)
                return
            }
        })
    }
}

/**
 * 模板描述
 */
interface IRemoteTemplate extends IAction  {
    action: string;
    message: string
    questions: IQuestion[] | undefined
    answers: IAnswer[] | undefined
    commands: string[] | undefined
}

/**
 * 远程模板元信息描述
 */
export interface IRemoteTemplateMetaData extends ITemplate {
    type: string | undefined
    template: IRemoteTemplate
}

/**
 * 确保后续VSCode执行指令正常执行
 */
function RunTemplateDoneCommands(commands?: string[]) {

    if (commands) {
        commands.forEach(command => {
            vscode.commands.executeCommand(command)
        });
    }
}

export async function RunRemoteTemplate(template: IRemoteTemplateMetaData, uri?: vscode.Uri) {
    const remote_template: IRemoteTemplate = template.template;
    if (uri) {
        // 1.检查模板动作类型
        if (remote_template.action === "git") {
            vscode.window.showInformationMessage(template.label + "是 git 类型模板")
            if (remote_template.git.url) {
                const cmd = "git clone remote_template.git.url";
            }
        } else if (remote_template.action === "shell") {
            // vscode.window.showInformationMessage(template.label + "是 shell 类型模板")
            vscode.window.withProgress({title: template.label, location: vscode.ProgressLocation.Notification, cancellable: false}, async (progress, token) => {
                
                // var childProcess: ChildProcess[] = []
                
                token.onCancellationRequested(()=> {
                    // childProcess.forEach(process => {
                    //     if (process.exitCode) {
                    //         return
                    //     }
                        // vscode.window.showInformationMessage(template.label + "正在取消")
                        // process.kill("SIGTERM");
                    // });
                })

                // 绑定显示逻辑
                var progressUpdate = '正在处理 ';
                progress.report({ message: progressUpdate })
                
                // 每次刷新进度信息，不超过300ms
                function update() {
                    setTimeout(() => progress.report({ message: progressUpdate + "-" }), 100);
                    setTimeout(() => progress.report({ message: progressUpdate + "/" }), 200);  
                    setTimeout(() => progress.report({ message: progressUpdate + "\\" }), 300);
                }

                // 每300ms一次更新
                const interval = setInterval(update, 300);
                
                // 完成时调用,停止刷新，并使完成信息将在300ms后显示
                function done() {
                    clearInterval(interval)
                    setTimeout(() => progress.report({ message: "完毕",increment: 100 }), 300);
                }

                return new Promise<void>((resolve, reject) => {

                    if (remote_template.shell.delay) {
                        execSync("sleep "+ remote_template.shell.delay);
                    }

                    const commands = remote_template.shell.commands
                    var finishe = commands.length;
                    function onClose() {
                        finishe--;
                        if (finishe === 0) {
                            done()
                            setTimeout(() => resolve(), 2000)

                            // vscode 后续执行指令
                            RunTemplateDoneCommands(remote_template.commands)
                        }
                    }

                    // 执行模板指令
                    for (let index = 0; index < commands.length; index++) {
                        let command = commands[index]
                        var childProcess: ChildProcess
                        if (typeof command === 'string') {
                            // 执行一整条命令
                            childProcess = exec(command, {cwd:uri.fsPath}).on("close", () => onClose())
                        } else {
                            // 按命令和参数进行传递执行
                            childProcess = spawn(command.command, command.args, {cwd:uri.fsPath}).on("close", () => onClose())
                        }
                        // vscode.window.showInformationMessage(template.label + "正在运行 "+ childProcess.pid)

                        token.onCancellationRequested(_ => {
                            vscode.window.showInformationMessage(template.label + "正在取消 "+ childProcess.pid)

                            childProcess.kill()
                        });
                    }
                })
            })
        } else if(remote_template.action === "questions") {
            vscode.window.showInformationMessage(template.label + "是 questions 类型模板")
            if (remote_template.questions && remote_template.answers) {
                const questions: IQuestion[]= remote_template.questions;
                const answers: IAnswer[] = remote_template.answers;
                RunQuestionQAndA(questions, answers, undefined, uri)          
            }

            // 2. vscode 后续执行指令
            RunTemplateDoneCommands(remote_template.commands)
        } else {
            vscode.window.showInformationMessage(template.label + "是未知类型模板("+remote_template.action+")")
        }
    }
}

/**
 * 组织所有远程模板描述信息
 */
export async function GetRemoteTemplates(): Promise<IRemoteTemplateMetaData[]> {

    let remote_templates: IRemoteTemplateMetaData[] = []

    // 为自定义配置进行分类 youwant.custome.configuration
    Configuration.getCustomeConfiguration().forEach((element: IRemoteTemplateMetaData) => {
        let remote : IRemoteTemplateMetaData = {
            label: "",
            detail: element.detail,
            template: element.template,
            type: element.type
        }
        // 标题追加模板类型
        remote.label = element.type?"Custome: "+ element.label + " ("+element.type+ ")":"Custome: "+ element.label
        remote_templates.push(remote)
    });
    
    // 为本地配置进行分类
    Configuration.getLocalConfiguration().forEach(element => {
        let remote : IRemoteTemplateMetaData = {
            label: "",
            detail: element.detail,
            template: element.template,
            type: element.type
        }
        // 标题追加模板类型
        remote.label = element.type?"Local: "+ element.label + " ("+element.type+ ")":"Local: "+ element.label
        remote_templates.push(remote)
    });

    // const templates = await remoteTemplates();
    const templates = Configuration.getOfflineConfiguration();

    // 为远程配置进行分类
    templates.forEach((element: IRemoteTemplateMetaData) => {
        let remote : IRemoteTemplateMetaData = {
            label: "",
            detail: element.detail,
            template: element.template,
            type: element.type
        }
        // 标题追加模板类型
        remote.label = element.type?"Remote: "+ element.label + " ("+element.type+ ")":"Remote: "+ element.label
        remote_templates.push(remote)
    });

    return remote_templates
}

/**
 * 读取repo配置并加载远程模板仓库描述
 */
async function remoteTemplates(): Promise<IRemoteTemplateMetaData[]> {
    const config = Configuration.getConfig()
    if (!config) return []

    let templates: IRemoteTemplateMetaData[] = []

    for (let index = 0; index < config.length; index++) {
        const element = config[index];
        await axios.get(element)
            .then((response) => {
                let data: IRemoteTemplateMetaData[] = response.data;
                data.forEach(element => {
                    templates.push(element);
                });
            })
            .catch((error) => {
                vscode.window.showInformationMessage(error.message);
            })
            .then(() => {
            });
    }
    return templates
}



export async function RunRemoteTemplatesSync() {
    vscode.window.withProgress({title: "同步: YouwantSyncRepo", location: vscode.ProgressLocation.Notification, cancellable: false}, async (progress, token) => {

        // 绑定显示逻辑
        var progressUpdate = '正在处理 ';
        progress.report({ message: progressUpdate })
        
        // 每次刷新进度信息，不超过300ms
        function update() {
            setTimeout(() => progress.report({ message: progressUpdate + "-" }), 100);
            setTimeout(() => progress.report({ message: progressUpdate + "/" }), 200);  
            setTimeout(() => progress.report({ message: progressUpdate + "\\" }), 300);
        }

        // 每300ms一次更新
        const interval = setInterval(update, 300);
        
        // 完成时调用,停止刷新，并使完成信息将在300ms后显示
        function done() {
            clearInterval(interval)
            setTimeout(() => progress.report({ message: "完毕",increment: 100 }), 300);
        }

        const templates = await remoteTemplates();

        return new Promise<void>((resolve, reject) => {
            Configuration.setOfflineConfiguration(templates)
        
            done()
            setTimeout(() => resolve(), 1000)

        })
            
    })
}