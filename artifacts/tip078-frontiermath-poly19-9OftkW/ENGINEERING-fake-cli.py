#!/usr/bin/env python3
"""ENGINEERING_ONLY fake executable. No codex/model/network invocation."""
import json
import os
import sys
import time

assert 'OPENAI_API_KEY' not in os.environ and 'ANTHROPIC_API_KEY' not in os.environ
prompt = sys.stdin.buffer.read()
print(json.dumps({'type':'thread.started','thread_id':'ENGINEERING_ONLY_FAKE_THREAD'}), flush=True)
if b'ENGINEERING_CANCEL' in prompt:
    time.sleep(10)
print(json.dumps({'type':'item.completed','item':{'type':'agent_message','text':'ENGINEERING_ONLY unchanged original'}}), flush=True)
print(json.dumps({'type':'turn.completed','usage':{'input_tokens':1,'output_tokens':1}}), flush=True)
