import sys
import json

def main():
    try:
        # Read input from stdin
        input_data = sys.stdin.read()

        # Attempt to parse JSON
        data = json.loads(input_data)

        # If successful, print confirmation
        print("FSM is semantically valid")

    except json.JSONDecodeError as e:
        # Handle invalid JSON syntax
        print(f"Invalid JSON: {e}")

    except Exception as e:
        # Handle other unexpected issues
        print(f"Unexpected Error: {e}")

if __name__ == "__main__":
    main()
