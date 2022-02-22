// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { initRunAnythinMenu } from './menus';
import { initNativeWorkspace, initRemoteWorkspace, syncRepository, WorkSpace } from './workspace';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	WorkSpace.context = context;

	// 初始化工作空间
	context.subscriptions.push(
		vscode.commands.registerCommand("initNativeWorkspace", initNativeWorkspace))
	
	// 初始化远程工作空间
	context.subscriptions.push(
		vscode.commands.registerCommand("initRemoteWorkspace", initRemoteWorkspace))

	// RunAnything
	context.subscriptions.push(
		vscode.commands.registerCommand("runAnything", initRunAnythinMenu));

	// 远程模板同步
	context.subscriptions.push(
		vscode.commands.registerCommand("youwantSyncRepo", syncRepository)
	)
}

// this method is called when your extension is deactivated
export function deactivate() {}
