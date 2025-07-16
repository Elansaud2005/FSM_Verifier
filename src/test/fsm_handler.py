# src/fsm_handler.py

import sys
import json
from lark import Lark, UnexpectedInput

# Load the FSM grammar from external file
with open("src/fsm.lark") as f:
    grammar = f.read()

# Initialize the parser
parser = Lark(grammar, parser="lalr", propagate_positions=True)

def syntax_check(input_text):
    try:
        parser.parse(input_text)
        return []
    except UnexpectedInput as e:
        return [{
            "message": "Syntax error",
            "line": e.line,
            "column": e.column
        }]

def main():
    # Read input from stdin
    input_text = sys.stdin.read()

    # Run syntax check
    syntax_errors = syntax_check(input_text)

    # Return result to VS Code
    print(json.dumps(syntax_errors))

if __name__ == "__main__":
    main()
