// this file runs when the extension is activated in vscode
import * as vscode from 'vscode';
import { spawn } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
  // show a welcome message when the extension starts
  vscode.window.showInformationMessage('fsm verifier extension is now active!');

  // this will collect all syntax issues to show in the editor
  const diagnosticCollection = vscode.languages.createDiagnosticCollection('fsm');

  // trigger validation when file is opened or changed
  vscode.workspace.onDidOpenTextDocument(validate);
  vscode.workspace.onDidChangeTextDocument(e => validate(e.document));

  // autocompletion section
  const fsmCompletionProvider: vscode.CompletionItemProvider = {
    async provideCompletionItems(document, position) {
      // get paths to grammar file and python script
      const suggestScriptPath = vscode.Uri.joinPath(context.extensionUri,'src', 'test', 'suggest.py').fsPath;

      return new Promise((resolve) => {
        // run python suggest script
        const python = spawn('py', [suggestScriptPath]);

        let result = '';
        let errorOutput = '';

        // collect stdout
        python.stdout.on('data', data => result += data.toString());

        // collect stderr (errors)
        python.stderr.on('data', data => errorOutput += data.toString());

        python.on('close', () => {
          if (errorOutput) {
            console.error('autocomplete python error:', errorOutput);
            return resolve([]); // return no suggestions
          }

          try {
            const suggestions = JSON.parse(result);

            // combine all suggestion types into one array
            const allLabels = suggestions.fsm_keys.concat(
              suggestions.state_fields,
              suggestions.action_types,
              suggestions.guard_types,
              suggestions.param_keys
            );

            // convert each label into a CompletionItem
            const completionItems = allLabels.map((label: string) => {
              const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Property);
              item.sortText = "0";      // show suggestions at the top
              item.filterText = label;  // allow partial match
              item.preselect = true;    // preselect suggestion
              return item;
            });

            resolve(completionItems);
          } catch (err) {
            console.error('error parsing autocomplete output:', err);
            resolve([]);
          }
        });
      });
    }
  };

  // register the autocomplete trigger
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { language: 'json', scheme: 'file' },  // only in JSON files
      fsmCompletionProvider,
      '"', ':', '{', ',', ' '                // trigger on these characters
    )
  );

  // syntax validation section
  async function validate(document: vscode.TextDocument) {
    // only run validation on json files
    if (document.languageId !== 'json') {return;};

    const fileContent = document.getText(); // full content
    const handlerScriptPath = vscode.Uri.joinPath(context.extensionUri, 'src', 'test', 'fsm_handler.py').fsPath;

    // run python validation script
    const python = spawn('py', [handlerScriptPath]);

    let result = '';
    let errorOutput = '';

    // send content to python via stdin
    python.stdin.write(fileContent);
    python.stdin.end();

    // collect output from python
    python.stdout.on('data', data => result += data.toString());
    python.stderr.on('data', data => errorOutput += data.toString());

    python.on('close', () => {
      if (errorOutput) {
        vscode.window.showErrorMessage(`python error: ${errorOutput}`);
        return;
      }

      try {
        const errors = JSON.parse(result);
        const diagnostics: vscode.Diagnostic[] = [];

        for (const err of errors) {
          // use line and column from python
          const start = new vscode.Position(err.line - 1, err.column - 1);
          const end = new vscode.Position(err.line - 1, err.end_column - 1);
          const range = new vscode.Range(start, end);

          // always use Error severity for now
          const diagnostic = new vscode.Diagnostic(
            range,
            err.message,
            vscode.DiagnosticSeverity.Error
          );

          diagnostics.push(diagnostic);
        }

        // show all diagnostics in VS Code
        diagnosticCollection.set(document.uri, diagnostics);
      } catch (e) {
        console.error('error parsing python output:', e);
      }
    });
  }
}

// this function runs when extension is deactivated
export function deactivate() {}
