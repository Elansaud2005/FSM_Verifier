# fsm_handler.py – multi-error FSM validator using Lark only (no json.loads)

import sys
import json
import os
from lark import Lark, UnexpectedInput  # import parser and error class

# get directory where this script is located
script_dir = os.path.dirname(__file__)

# path to the grammar 
with open(grammar_path) as f:
    grammar = f.read()

# create Lark parser (LALR + track positions)
parser = Lark(grammar, parser="lalr", propagate_positions=True)
# helper to get line/column from offset
def get_line_column_from_offset(text, offset):
    lines = text[:offset].splitlines()
    line = len(lines)
    column = len(lines[-1]) + 1 if lines else 1
    return line, column

def multi_error_syntax_check(text, max_errors=1):
    errors = []
    offset = 0
    remaining = text

    while len(errors)<  max_errors:
        try:
            parser.parse(remaining)
            break
        except UnexpectedInput as e:
            error_offset = offset + e.pos_in_stream

            token_type = getattr(e.token, 'type', 'UNKNOWN')
            token_value = getattr(e.token, 'value', 'UNKNOWN')
            message = f"Unexpected token: {token_value} (type: {token_type})"

            # get correct line/column from full text, not the remaining
            line, column = get_line_column_from_offset(text, error_offset)

            errors.append({
                "offset": error_offset,
                "line": line,
                "column": column,
                "end_column": column + len(token_value),
                "message": message
            })

    return errors

# Entry Point
if __name__ == "__main__":
    try:
        input_text = sys.stdin.read()
        errors = multi_error_syntax_check(input_text)
        print(json.dumps(errors))
    except Exception as e:
        print(json.dumps([{
            "offset": 0,
            "line": 1,
            "column": 1,
            "message": f"Unexpected failure: {str(e)}"
        }]))
