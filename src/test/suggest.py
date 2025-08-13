# import built-in modules
import json
import sys

# the function returns all keywords that might be used in fsm definitions, 
# values are fixed (hardcoded), not generated from LARK file

def get_hardcoded_suggestions():
    return {
        # top-level keys inside the root of the fsm
        "fsm_keys": [
            "id",
            "initial",
            "states"
        ],

        # allowed keys inside a state definition
        "state_fields": [
            "entry",
            "exit",
            "on",
            "meta",
            "type"
        ],

        # valid action types that can appear in "actions"
        "action_types": [
            "get_parameters",
            "get_from_file",
            "set",
            "done",
            "assign",
            "load_control_channel_configuration",
            "configure_client_control_channel",
            "configure_server_control_channel",
            "start_control_channel",
            "signal_ready_connection",
            "signal_ready_listen",
            "signal_listening",
            "signal_ready_stop",
            "return_values"
        ],

        # common keys used inside params or actions
        "param_keys": [
            "target",
            "cond",
            "internal"
        ],

        # known guard operators (like conditions inside transitions)
        "guard_types": [
            "eq",
            "neq",
            "lt",
            "gt",
            "in",
            "not_in"
        ],

        # common constant values used in json
        "constant_values": [
            "true",
            "false",
            "null"
        ]
    }

# script entry point 
if __name__ == "__main__":
   
    # get the suggestions object
    suggestions = get_hardcoded_suggestions()

    # print the result as pretty json
    print(json.dumps(suggestions, indent=2))
