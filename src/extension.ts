import * as vscode from 'vscode';
import { spawn } from 'child_process';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    // ✅ Show message when the extension is activated
    vscode.window.showInformationMessage('✅ FSM Verifier extension is now active.');

    const diagnosticCollection = vscode.languages.createDiagnosticCollection('fsm');

    vscode.workspace.onDidOpenTextDocument(validate);
    vscode.workspace.onDidChangeTextDocument(e => validate(e.document));

    async function validate(document: vscode.TextDocument) {
        if (document.languageId !== 'json') return;

      const fileUri = vscode.Uri.joinPath(context.extensionUri, 'fsm_handler.py');
const filePath = fileUri.fsPath;

const python = spawn('python', [filePath]);

        const text = document.getText();

        let result = '';
        python.stdin.write(text);
        python.stdin.end();

        python.stdout.on('data', (data) => {
            result += data.toString();
        });

        python.stderr.on('data', (data) => {
            console.error("Python error:", data.toString());
        });

        python.on('close', () => {
            const diagnostics: vscode.Diagnostic[] = [];

            try {
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
            } catch (e) {
                console.error("Error parsing Python output:", e);
            }

            diagnosticCollection.set(document.uri, diagnostics);
        });
    }
}
