# LiLiNo – Lightweight Linter for NoPASARAN

## 1. Introduction
LiLiNo (Lightweight Linter for NoPASARAN) is a Visual Studio Code extension developed to validate **Finite State Machine (FSM)** definitions in JSON format for the [NoPASARAN] network testing platform.  
The extension enforces FSM grammar compliance, assists in error detection, and eases the development process for NoPASARAN test configurations.

This project was implemented as part of an internship program to improve the reliability and efficiency of FSM authoring within NoPASARAN.


## 2. Features

### 2.1 Real-Time Syntax Validation
- Validates FSM JSON definitions as the user types.  
- Enforces structure and syntax rules defined in a `.lark` grammar file.  
- Displays error messages and underlines the issues using the diagnostic API.

### 2.2 Grammar-Based Parsing
- Uses the [Lark Parser] to apply formal grammar rules.  
- Ensures FSM definitions conform to NoPASARAN specifications.

### 2.3 Autocompletion Support
- Provides suggestions for FSM keywords and structure.  
- Current implementation uses hardcoded suggestions (dynamic extraction planned).

### 2.4 Extensible Architecture
- Designed to support semantic validation, error detection, and advanced rule enforcement in future iterations.

---

## 3. System Requirements
- **Visual Studio Code** (latest stable release)  
- **Node.js** v16 or later  
- **Python** 3.8 or later  
- **Lark Parser** Python package:
```bash
pip install lark

```
### 4. Project Structure
```
lilino/
├── src/
│   └── extension.ts
├── test/
│   ├── fsm_handler.py
│   ├── suggest.py
│   └── fsm.lark
├── package.json
└── README.md

```
## 5. Installation
5.1 Development Setup
Clone the repository:

```bash
git clone https://github.com/elansaud2005/lilino.git
cd lilino
```
Open the project in Visual Studio Code:

1. Open the project in VS Code.
2. Press **F5** or go to **Run → Start Debugging**.
3. A new VS Code window (Extension Development Host) will open with the extension loaded.
   
## 6. Usage
Open a `.json` file containing a NoPASARAN FSM definition.

The extension will:
- Validate the file against the FSM grammar.  
- Highlight syntax errors in real time.  
- Provide basic autocompletion suggestions.  
- Display errors both inline and in the Problems Panel.  

---
## 7. Internal Workflow

the extension works in a simple pipeline whenever a user opens or edits an fsm json file:

1. **event detection**  
   vscode listens for file events (`onDidOpenTextDocument`, `onDidChangeTextDocument`).

2. **frontend → backend call**  
   `extension.ts` sends the entire file content to the python backend using `child_process.spawn`.  
   - the text is passed through **stdin**.

3. **syntax validation (`fsm_handler.py`)**  
   - receives the text from stdin.  
   - parses it with **lark** using the grammar in `fsm.lark`.  
   - if errors are found, they are captured with exact line/column positions.  
   - results are formatted as json and written to **stdout**.

4. **frontend error reporting**  
   - `extension.ts` reads the json results from stdout.  
   - converts each item into a `vscode.Diagnostic`.  
   - errors are shown as **red squiggly lines** in the editor and listed in the **problems panel**.

5. **autocompletion (`suggest.py`)**  
   - when the user types `"`, the extension spawns `suggest.py`.  
   - the script returns a list of fsm keywords (currently hardcoded).  
   - these are displayed by vscode’s completion api as inline suggestions.

6. **grammar (`fsm.lark`)**  
   - defines the allowed structure of fsm definitions.  
   - ensures validation is consistent and future-proof.  
   - will also serve as the base for dynamic suggestion extraction in later versions.

**result:**  
- errors appear instantly when the file changes.  
- suggestions pop up when writing fsm attributes.  
