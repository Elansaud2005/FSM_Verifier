import * as vscode from 'vscode';
import { spawn } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage(' FSM Verifier extension is now active!');

  const diagnosticCollection = vscode.languages.createDiagnosticCollection('fsm');

  vscode.workspace.onDidOpenTextDocument(validate);
  vscode.workspace.onDidChangeTextDocument(e => validate(e.document));


  // autocomplete (basic)
  const fsmCompletionProvider: vscode.CompletionItemProvider = {
    provideCompletionItems() {
      return [
        { label: '"id"', kind: vscode.CompletionItemKind.Property },
        { label: '"initial"', kind: vscode.CompletionItemKind.Property },
        { label: '"states"', kind: vscode.CompletionItemKind.Property },

      ];
    }
  };

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('json', fsmCompletionProvider, '"')
  )
  // FSM JSON syntax validator 
  async function validate(document: vscode.TextDocument) {
    if (document.languageId !== 'json') { return; }

    const fileContent = document.getText();
    const fileUri = vscode.Uri.joinPath(context.extensionUri, 'src', 'test', 'fsm_handler.py');
    const filePath = fileUri.fsPath;

    const python = spawn('py', [filePath]);
    let result = '';
    let errorOutput = '';

    python.stdin.write(fileContent);
    python.stdin.end();

    python.stdout.on('data', (data) => { result += data.toString(); });
    python.stderr.on('data', (data) => { errorOutput += data.toString(); });

    python.on('close', () => {
      if (errorOutput) {
        vscode.window.showErrorMessage(`Python Error: ${errorOutput}`);
        return;
      }

      try {
        const diagnostics: vscode.Diagnostic[] = [];
        const errors = JSON.parse(result);

        for (const err of errors) {
          const startPos = document.positionAt(err.offset);
          const endPos = document.positionAt(err.offset + 1);
          const range = new vscode.Range(startPos, endPos);
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
