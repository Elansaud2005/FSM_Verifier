import sys
import json

def main():
    try:
        input_data = sys.stdin.read()
        json_obj = json.loads(input_data)
        print(" JSON is valid")
    except json.JSONDecodeError as e:
        print(f"Invalid JSON: {e}")

if __name__ == "__main__":
    main()
