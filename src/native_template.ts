import * as vscode from 'vscode'
import { ITemplate } from './template'
import { copyToNotExists } from './workbench'
import { WorkSpace } from './workspace'

export interface INativeTemplate{
    message: string
    source?: string
    func?(uri?: vscode.Uri): void
    commands?: string[]
}

/**
 * 本地模板接口描述信息
 */
export interface INativeTemplateMetaData extends ITemplate {
    type: string
    template: INativeTemplate
}

export function RunNativeTemplate(template: INativeTemplateMetaData,  uri?: vscode.Uri) {
    if (WorkSpace.context && uri) {
        vscode.window.showInformationMessage(template.template.message)

        // 如果声明了本地资源目录
        if (template.template.source) {
            const dirPath = WorkSpace.getExtensionFileVscodePath(WorkSpace.context, template.template.source);
            copyToNotExists(dirPath, uri)
        }

        // 如果声明了自定义函数
        if (template.template.func) {
            template.template.func(uri)
        }
        
        // 如果声明了后续执行的指令
        if (template.template.commands) {
            template.template.commands.forEach(command => {
                vscode.commands.executeCommand(command);
            })
        }
    }
}

export function GetNativeTemplates(): INativeTemplateMetaData[] {
    let native_templates: INativeTemplateMetaData[] = []

    templates.forEach(element => {
        let native : INativeTemplateMetaData = {
            label: "",
            detail: element.detail,
            type: element.type,
            template: element.template,
        }

        native.label = element.type?"Native: "+ element.label+" ("+element.type+")":"Native: "+ element.label
        native_templates.push(native)
    });
    return native_templates
}

const templates = [
    {
        label: "C",
        detail: "Generate a C program based on CMake.",
        type: "project",
        template: {
            message: "初始化工作空间为 CMake-c",
            source: "assets/languages/cmake-c",
            commands: [
                "cmake.configure",
                "workbench.files.action.refreshFilesExplorer"
            ]
        }
    },
    {
        label: "C++",
        detail: "Generate a C++ program based on CMake.",
        type: "project",
        template: {
            message: "初始化工作空间为 CMake-cpp",
            source: "assets/languages/cmake-cpp",
            commands: [
                "cmake.configure",
                "workbench.files.action.refreshFilesExplorer"
            ]
        }
    },
    {
        label: "QtCli",
        detail: "Build a Qt command line application based on CMake",
        type: "project",
        template: {
            message: "初始化工作空间为 CMake-Qt-Cli",
            source: "assets/languages/cmake-qt-cli",
            commands: [
                "cmake.configure",
                "workbench.files.action.refreshFilesExplorer"
            ]
        }
    },
    {
        label: "QtGui",
        detail: "Build Qt graphical application based on CMake",
        type: "project",
        template: {
            message: "初始化工作空间为 CMake-Qt-Gui",
            source: "assets/languages/cmake-qt-gui",
            commands: [
                "cmake.configure",
                "workbench.files.action.refreshFilesExplorer"
            ]
        }
    },
]