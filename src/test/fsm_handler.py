import sys
import json
import os
from lark import Lark, UnexpectedInput

# Load the FSM grammar from external file reliably
script_dir = os.path.dirname(__file__)
grammar_path = os.path.join(script_dir, 'fsm.lark')

with open(grammar_path) as f:
    grammar = f.read()

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
    except Exception as e:
        return [{
            "message": f"Unhandled error: {str(e)}",
            "line": 1,
            "column": 1
        }]

def main():
    input_text = sys.stdin.read()
    syntax_errors = syntax_check(input_text)
    print(json.dumps(syntax_errors))

if __name__ == "__main__":
    main()
