// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

async function saveAllUnchangedFiles() {
    await Promise.all(vscode.workspace.textDocuments.map(async doc => {
        if (doc.isDirty) {
            const savedContent = await fs.promises.readFile(doc.fileName, 'utf-8');
            const editorContent = doc.getText();

            if (editorContent === savedContent) {
                 await doc.save();
            }
        }
    }));
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    await saveAllUnchangedFiles();

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('sifu.saveAllUnchangedFiles', saveAllUnchangedFiles);

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
