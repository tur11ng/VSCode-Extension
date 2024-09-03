"use strict"
const vscode = require ("vscode")  // 请忽略提示，千万不要点击自动修复
const feature = require ("./feature.js")


exports.activate = function (context) {
	const getCfg = (cfgName) =>
		vscode.workspace .getConfiguration("CustomizeToolbar") .get(cfgName)
	const refresh = () => {  // 或 "const refresh = function () {" 或 "function refresh () {"
		feature.updateButtonConfig (getCfg ("buttonConfig"))
		feature.promptToReload ()
	}
	context.subscriptions.push( vscode.workspace.onDidChangeConfiguration( (event) => {
		if (event.affectsConfiguration ("CustomizeToolbar.buttonConfig")) refresh()
	}))
	context.subscriptions.push( vscode.commands.registerCommand(
		"action-buttons-customizer.refresh", () => refresh()
	))
	feature.registerCommands (context, getCfg ("buttonConfig"))
}


exports.deactivate = function () {
}
