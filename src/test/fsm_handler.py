import sys
import json
import os
from lark import Lark, UnexpectedInput  # import Lark for parsing

# define the path to the grammar file (fsm.lark)
script_dir = os.path.dirname(__file__)  # get the current script directory
grammar_path = os.path.join(script_dir, 'fsm.lark')  # build full path to the grammar file

# read the grammar file content
with open(grammar_path) as f:
    grammar = f.read()

# create the parser using Lark and enable position tracking for error reporting
parser = Lark(grammar, parser="lalr", propagate_positions=True)

# function to check syntax of fsm json input
def syntax_check(input_text):
    try:
        parser.parse(input_text)  # try to parse the input
        return []  # return empty list if no syntax errors

    except UnexpectedInput as e:
        # return the position and error message if a syntax error occurs
        return [{
            "offset": e.pos_in_stream,
            "message": str(e)
        }]

    except Exception as e:
        # return fallback message for any other error
        return [{
            "message": f"unhandled error: {str(e)}",
            "offset": 0  # fallback offset
        }]

# main function: reads input from stdin and prints any syntax errors in json format
# this function is triggered by the vscode extension
def main():
    input_text = sys.stdin.read()  # read the input sent from the extension
    syntax_errors = syntax_check(input_text)  # check for syntax issues
    print(json.dumps(syntax_errors))  # send the result back as json

# run main only if this file is executed directly
if __name__ == "__main__":
    main()
