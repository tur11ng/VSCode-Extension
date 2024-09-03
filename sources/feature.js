// 20221110
"use strict"
const vscode = require ("vscode")
const fs = require ("fs")
const path = require ("path")


exports.updateButtonConfig = function (btnCfg) {
	const userIcoDirForCode = path.join (__dirname, "../images/userIcons")
	const userIcoDirForCfg = "./images/userIcons"
	const builtinIcoDirForCfg = "./images/builtinIcons"
	if (! fs.existsSync (userIcoDirForCode))
		fs.mkdirSync (userIcoDirForCode)
	for (const filename of fs.readdirSync (userIcoDirForCode))
		fs.unlinkSync (path.join (userIcoDirForCode, filename))
	let commands = []
	let keybindings = []
	let buttons = []
	for (let idx = 0; idx < btnCfg.length; idx ++) {
		let icon = btnCfg[idx]["icon"]
		if (typeof icon === "object")
			for (const key in icon)
				if (icon[key].startsWith ("builtin/")) {
					icon[key] = icon[key].replace ("builtin", builtinIcoDirForCfg)
				} else {
					const newName = `btn${idx+1}_${key}.svg`
					fs.copyFileSync (icon[key], path.join (userIcoDirForCode, newName))
					icon[key] = path.join (userIcoDirForCfg, newName)
				}
		else
			icon = `$(${icon})`
		const cmdName = `action-buttons-customizer.command-${idx+1}`
		commands[idx] = {
			"command": cmdName,
			"category": "Action buttons customizer",
			"title": btnCfg[idx]["name"],
			"icon": icon
		}
		buttons[idx] = {
			"group": `navigation@${idx+1}`,
			// "when": `config.CustomizeToolbar.buttonConfig.length >= ${idx+1} && resourceFilename =~ ${btnCfg[idx]["when"]}`,
			"when": btnCfg[idx]["when"] === undefined ? undefined :
				`resourceFilename =~ /${btnCfg[idx]["when"]}/`,
			"command": cmdName
		}
	}
	const contribFilePath = path.join (__dirname, "../package.json")
	let data = JSON.parse (fs.readFileSync (contribFilePath, "utf-8"))
	commands.unshift ({
		"command": "action-buttons-customizer.refresh",
		"category": "Action buttons customizer",
		"title": "Refresh"
	})
	data["contributes"]["commands"] = commands
	data["contributes"]["keybindings"] = keybindings
	data["contributes"]["menus"]["editor/title"] = buttons
	fs.writeFileSync (contribFilePath, JSON.stringify (data, null, "\t") + "\n")
}


exports.promptToReload = function () {
	const message = "Changed. Please restart VSCode to apply."
	const action = ["Reload", "Not Now"]
	vscode.window.showInformationMessage (message, ...action) .then( (selectedAction) => {
		if (selectedAction === "Reload")
			vscode.commands.executeCommand ("workbench.action.reloadWindow")
	})
}


function executeInTerminal (cmdStrWithVar, preserveFocus) {
	let placeholders = {}
	if (vscode.window.activeTextEditor) {
		const _document = vscode.window.activeTextEditor.document
		const filePath = _document.fileName
		const fileDir = path.dirname (filePath)
		const fileName = path.basename (filePath)
		const fileStem = path.basename (filePath, path.extname(filePath))
		const _allWorkspace = vscode.workspace.workspaceFolders
		const _workspace = vscode.workspace.getWorkspaceFolder(_document.uri)
		const fileWorkspace =
			! _allWorkspace ? fileDir :
			! _workspace ? _allWorkspace[0].uri.fsPath :
			_workspace.uri.fsPath
		const fileRelative =
			! _workspace ? filePath :
			path.relative (fileWorkspace, filePath)
		placeholders = {
			"path": filePath,
			"dir": fileDir,
			"name": fileName,
			"stem": fileStem,
			"workspace": fileWorkspace,
			"relative": fileRelative,
		}
	}
	let cmdStrFinal = cmdStrWithVar
	Object.entries(placeholders).forEach( ([key, val]) => {
		cmdStrFinal = cmdStrFinal.replace (new RegExp ("\\\$"+key,"g"), val)
	})
	if (!executeInTerminal["terminal"] || executeInTerminal["terminal"].exitStatus)
		executeInTerminal["terminal"] = vscode.window.createTerminal ("Toolbar")
	executeInTerminal["terminal"].show (preserveFocus)
	executeInTerminal["terminal"].sendText (cmdStrFinal)
}


exports.registerCommands = function (context, btnCfg) {
	for (let idx = 0; idx < btnCfg.length; idx ++) {
		const cmdName = `action-buttons-customizer.command-${idx+1}`
		console.log(btnCfg[idx]["command_vscode"]);
		const cmdFunc = "command_vscode" in btnCfg[idx] ?
			()=> vscode.commands.executeCommand(...btnCfg[idx]["command_vscode"]) :
			()=> executeInTerminal (btnCfg[idx]["command_terminal"])
		context.subscriptions.push( vscode.commands.registerCommand( cmdName, cmdFunc ))
	}
}
