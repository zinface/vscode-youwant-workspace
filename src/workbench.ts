import * as fs from 'fs';
import { promisify } from 'util';
import * as vscode from 'vscode';
import path = require('path');

export class WorkBench {
    public static refreshFilesExplorer() {
        vscode.commands.executeCommand("workbench.files.action.refreshFilesExplorer")
    }
}

export function filesNotExists(files :string[], filename :string) :boolean {
    return (files.filter(name => name === filename).length === 0)
}

export function writeToNotExists(files :string[], filename :string, content :string, uri: vscode.Uri) {
    if (filesNotExists(files, filename)) 
        promisify(fs.writeFile)(path.join(uri.fsPath, filename),content)
}

/**
 * 将模板资源目录下的所有文件及目录复制到工作空间下
 * @param source 模板资源目录
 * @param uri 工作空间目录
 */
export function copyToNotExists(source: vscode.Uri, uri :vscode.Uri) {
    
    if (fs.existsSync(source.fsPath)) {
        const files = fs.readdirSync(source.fsPath)

        files.forEach(file => {
            const sf = vscode.Uri.file(path.join(source.fsPath, file))
            const tf = vscode.Uri.file(path.join(uri.fsPath, file))
            const sfExists = fs.existsSync(sf.fsPath)
            const tfExists = fs.existsSync(tf.fsPath)

            if (!sfExists) 
                return;

            if (fs.statSync(sf.fsPath).isDirectory()) {
                if (!tfExists) {
                    fs.mkdirSync(tf.fsPath)
                }
                copyToNotExists(sf,tf)
            }
            
            if (fs.statSync(sf.fsPath).isFile()) {
                if (!tfExists) {
                    vscode.window.showInformationMessage(file+"已拷贝")
                    fs.copyFileSync(sf.fsPath, tf.fsPath)
                }
            }
        });
    }
}

