import path = require('path');
import * as vscode from 'vscode';
import { Configuration } from './configuration';
import { GetNativeTemplates, RunNativeTemplate } from './native_template';
import { GetRemoteTemplates, IRemoteTemplateMetaData, RunRemoteTemplate, RunRemoteTemplatesSync } from './remote_template';

export class WorkSpace {

    public static context: vscode.ExtensionContext | undefined = undefined; 

    /**
     * 获取某个扩展文件相对于webview需要的一种特殊路径格式
     * 形如：vscode-resource:/Users/toonces/projects/vscode-cat-coding/media/cat.gif
     * @param context 上下文
     * @param relativePath 扩展中某个文件相对于根目录的路径，如 images/test.jpg
     */
    public static getExtensionFileVscodeResource(context :vscode.ExtensionContext, relativePath: string) {
        const diskPath = vscode.Uri.file(path.join(context.extensionPath, relativePath));
        return diskPath.with({ scheme: 'vscode-resource' }).toString();
    }

    /**
     * 获取扩展下的资源路径
     * @param context 上下文
     * @param relativePath 扩展中某个文件相对于根目录的路径
     */
    public static getExtensionFileVscodePath(context :vscode.ExtensionContext, relativePath: string) {
        const diskPath = vscode.Uri.file(path.join(context.extensionPath, relativePath));
        return diskPath
    }
}

/**
 * 初始化工作空间为本地模板
 * @param uri 资源描述符
 * @returns 
 */
export async function initNativeWorkspace(uri?: vscode.Uri) {
    
    const selectedTemplate = await vscode.window.showQuickPick(
        GetNativeTemplates(),
        {
            matchOnDescription: true,
            placeHolder: "Which template do you want?",
        },
    );
    
    if (!selectedTemplate)
        return;
    
    RunNativeTemplate(selectedTemplate, uri);
}

/**
 * 封装 vscode.QuickPickItem 接口
 */
interface IRemoteMetaItem extends vscode.QuickPickItem {
    child: IRemoteTemplateMetaData
}

/**
 * 初始化工作空间为远程模板
 * @param uri 资源描述符
 */
export async function initRemoteWorkspace(uri?: vscode.Uri) {
    const remote = Configuration.getConfig()
    if (!remote) {
        vscode.window.showInformationMessage("未找到 youwant.repo 配置")
    }

    vscode.window.showQuickPick<IRemoteMetaItem>(
        (await GetRemoteTemplates()).map((template) => {
            const item: IRemoteMetaItem = {
				label: template.label,
				detail: template.detail,
                child: template
			};
			return item;
        }),
        {
            // matchOnDescription: true,
            canPickMany: true,
            placeHolder: "Which template do you want?",
        }
    ).then((selectedTemplate) => {
        selectedTemplate?.map(item => {
            RunRemoteTemplate(item.child, uri)
        })
    })
}


/**
 * 同步远程模板仓库
 * @param uri 资源描述符
 */
export async function syncRepository(uri?: vscode.Uri) {
    RunRemoteTemplatesSync()
}