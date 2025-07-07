import * as vscode from 'vscode';
import * as path from 'path';
import { spawn } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
  // Trigger on opening any JSON file
  vscode.workspace.onDidOpenTextDocument((document) => {
    if (document.languageId === 'json') {
      vscode.window.showInformationMessage('Extension started');

      const fileContent = document.getText();

      const pythonScriptPath = path.join(
        context.extensionPath,
        'src',
        'test',
        'fsm_handler.py'
      );

      const python = spawn('py', [pythonScriptPath]);

      let output = '';
      let errorOutput = '';

      // Capture normal Python output
      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      // Capture Python errors
      python.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      // Once the script ends, show results
      python.on('close', (code) => {
        if (errorOutput) {
          vscode.window.showErrorMessage(` Python Error: ${errorOutput}`);
        } else {
          vscode.window.showInformationMessage(` FSM Verifier Result: ${output.trim()}`);
          console.log("Python result:", output.trim());
        }
      });

      // Send the file content to Python via stdin
      python.stdin.write(fileContent);
      python.stdin.end();
    }
  });
}

export function deactivate() {}
