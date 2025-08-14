# LiLiNo – Lightweight Linter for NoPASARAN

## 1. Introduction
LiLiNo (Lightweight Linter for NoPASARAN) is a Visual Studio Code extension developed to validate **Finite State Machine (FSM)** definitions in JSON format for the [NoPASARAN] network testing platform.  
The extension enforces FSM grammar compliance, assists in error detection, and ease the development process for NoPASARAN test configurations.

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
```bash
lilino/
├── src/
│  └──  test/
    ├──extension.ts
│   ├──fsm_handler.py        # FSM syntax validation script (Lark parser)
│   ├── suggest.py            # Autocompletion suggestions generator
│   └── fsm.lark              # FSM grammar definition
├── package.json              # Extension metadata & configuration
└── README.md                 # Project documentation
```
## 5. Installation
5.1 Development Setup
Clone the repository:

```bash
git clone https://github.com/your-username/lilino.git
cd lilino
```
Open the project in Visual Studio Code:

1. Open the project in VS Code.
2. Press **F5** or go to **Run → Start Debugging**.
3. A new VS Code window (Extension Development Host) will open with the extension loaded.
   
## 6. Usage
Open a .json file containing a NoPASARAN FSM definition.

The extension will:

Validate the file against the FSM grammar.

Highlight syntax errors in real time.

Provide autocompletion suggestions.

Errors are displayed both inline and in the Problems Panel.

## 7. Internal Workflow

The extension monitors file open and change events in VS Code.

Syntax Validation (fsm_handler.py)

Receives the JSON content from TypeScript via stdin.

Parses the content using Lark and returns structured error diagnostics.

Autocompletion (suggest.py)

Supplies a set of FSM keywords uggestions.

Currently hardcoded; dynamic grammar extraction is a planned enhancement.

Grammar (fsm.lark)

Defines the formal structure and allowed fields for FSM definitions.

---

