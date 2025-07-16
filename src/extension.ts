import * as vscode from 'vscode';
import { spawn } from 'child_process';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage('✅ FSM Verifier extension is now active.');

  const diagnosticCollection = vscode.languages.createDiagnosticCollection('fsm');

  vscode.workspace.onDidOpenTextDocument(validate);
  vscode.workspace.onDidChangeTextDocument(e => validate(e.document));

  async function validate(document: vscode.TextDocument) {
    if (document.languageId !== 'json') return;

    const fileContent = document.getText();
    const fileUri = vscode.Uri.joinPath(context.extensionUri, 'test', 'fsm_handler.py');
    const filePath = fileUri.fsPath;

    const python = spawn('python', [filePath]);

    let result = '';
    let errorOutput = '';

    // Send JSON text to Python
    python.stdin.write(fileContent);
    python.stdin.end();

    python.stdout.on('data', (data) => {
      result += data.toString();
    });

    python.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    python.on('close', () => {
      if (errorOutput) {
        vscode.window.showErrorMessage(`Python Error: ${errorOutput}`);
        return;
      }

      try {
        const diagnostics: vscode.Diagnostic[] = [];
        const errors = JSON.parse(result);

        for (const err of errors) {
          const range = new vscode.Range(
            err.line - 1, err.column - 1,
            err.line - 1, err.column
          );
          const diagnostic = new vscode.Diagnostic(
            range,
            err.message,
            vscode.DiagnosticSeverity.Error
          );
          diagnostics.push(diagnostic);
        }

        diagnosticCollection.set(document.uri, diagnostics);
      } catch (e) {
        console.error("Error parsing Python output:", e);
      }
    });
  }
}

export function deactivate() {}
