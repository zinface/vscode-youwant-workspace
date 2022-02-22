import * as vscode from 'vscode';
import { IRemoteTemplateMetaData } from './remote_template';

const repo = "youwant.repo"
const configuration = "youwant.configuration"
const custome = "youwant.custome.configuration"
const runAnything = "youwant.runAnything"
const offline = "youwant.offline.repo.configuration"

/**
 * YouWant本地配置元信息
 */
interface IConfiguration extends IRemoteTemplateMetaData {
    
}


export class Configuration {
    public static getConfig(): string[]|undefined {
        const config = vscode.workspace.getConfiguration().get<string[]>(repo)
        return config?config:[];
    }

    public static getLocalConfiguration(): IRemoteTemplateMetaData[] {
        const config = vscode.workspace.getConfiguration().get<IRemoteTemplateMetaData[]>(configuration);
        return config?config:[];
    }

    public static getCustomeConfiguration(): IRemoteTemplateMetaData[] {
        const config = vscode.workspace.getConfiguration().get<IRemoteTemplateMetaData[]>(custome);
        return config?config:[];
    }

    public static getRunAnythingConfig() : any {
        const config = vscode.workspace.getConfiguration().get<any>(runAnything)
        return config?config:{};
    }

    public static getOfflineConfiguration(): IRemoteTemplateMetaData[] {
        const config = vscode.workspace.getConfiguration().get<IRemoteTemplateMetaData[]>(offline);
        return config?config:[];
    }
    public static setOfflineConfiguration(config: IRemoteTemplateMetaData[]) {
        // 最后一个参数，为true时表示写入全局配置，为false或不传时则只写入工作区配置
        vscode.workspace.getConfiguration().update(offline, config, true);
    }
}