// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

async function saveAllUnchangedFiles() {
    await Promise.all(vscode.workspace.textDocuments.map(async doc => {
        if (doc.isDirty) {
            if (fs.existsSync(doc.fileName)) {
                const savedContent = await fs.promises.readFile(doc.fileName, 'utf-8');
                const editorContent = doc.getText();
                if (editorContent === savedContent) {
                    console.log(`Saving file ${doc.fileName} as editor content matches disk`);
                    await doc.save();
                } else {
                    console.log(`Did not save file ${doc.fileName} as editor content does not match disk`);
                } 
            } else {
                console.log(`Could not save file ${doc.fileName} as it does not exist on the host`);
            }
        }
    }));
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    let config = vscode.workspace.getConfiguration('sifu');
    let runOnStartup = config.get('runOnStartup');

    if (runOnStartup) {
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
