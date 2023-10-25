// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

function getCurrentTimestamp(): string {
    const date = new Date();
    const YYYY = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');  // Months are 0-based in JS
    const dd = String(date.getDate()).padStart(2, '0');
    const HH = String(date.getHours()).padStart(2, '0');
    const MM = String(date.getMinutes()).padStart(2, '0');
    const SS = String(date.getSeconds()).padStart(2, '0');
    const fff = String(date.getMilliseconds()).padStart(3, '0');  // Pad milliseconds to 3 digits
    return `[sifu ${YYYY}-${mm}-${dd} ${HH}:${MM}:${SS}.${fff}]`;
}

let outputChannel: vscode.OutputChannel;

async function saveAllUnchangedFiles() {
    await Promise.all(vscode.workspace.textDocuments.map(async doc => {
        if (doc.isDirty) {
            if (fs.existsSync(doc.fileName)) {
                const savedContent = await fs.promises.readFile(doc.fileName, 'utf-8');
                const editorContent = doc.getText();
                if (editorContent === savedContent) {
                    outputChannel.appendLine(`${getCurrentTimestamp()} Saving file "${doc.fileName}" as editor content matches disk`);
                    await doc.save();
                } else {
                    outputChannel.appendLine(`${getCurrentTimestamp()} Did not save file "${doc.fileName}" as editor content does not match disk`);
                } 
            } else {
                outputChannel.appendLine(`${getCurrentTimestamp()} Could not save file "${doc.fileName}" as it does not exist on the host`);
            }
        }
    }));
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    outputChannel = vscode.window.createOutputChannel('Sifu Extension Logs');
    outputChannel.appendLine(`${getCurrentTimestamp()} Activating extension sifu`);

    let config = vscode.workspace.getConfiguration('sifu');
    let runOnStartup = config.get('runOnStartup');

    if (runOnStartup) {
        outputChannel.appendLine(`${getCurrentTimestamp()} Running immediately on startup`);
        await saveAllUnchangedFiles();
    }

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('sifu.saveAllUnchangedFiles', saveAllUnchangedFiles);

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
