import * as vscode from 'vscode';
import * as path from 'path';
import { spawn } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
  vscode.workspace.onDidOpenTextDocument((document) => {
    if (document.languageId === 'json') {
		vscode.window.showInformationMessage(' Extension Started!');
      const fileContent = document.getText();
	  console.log("JSON File Content:", fileContent);

      const pythonScriptPath = path.join(context.extensionPath, 'src', 'test', 'fsm_handler.py');

      const python = spawn('py', [pythonScriptPath]);

      let output = '';
      let errorOutput = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      python.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      python.on('close', (code) => {
        if (errorOutput) {
          vscode.window.showErrorMessage(`Python Error: ${errorOutput}`);
        } else {
          vscode.window.showInformationMessage(`FSM Verifier Result: ${output.trim()}`);
          console.log("Python result:", output.trim());
        }
      });

      python.stdin.write(fileContent);
      python.stdin.end();
    }
  });
}

export function deactivate() {}
