import re
import subprocess
import logging 

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__file__)
logger.setLevel(logging.INFO)

def _logged_popen(cmd_line, *args, **kwargs):
    logger.debug('Running command: {}'.format(subprocess.list2cmdline(cmd_line)))
    return subprocess.Popen(cmd_line, *args, **kwargs)

def analyze():
    p = _logged_popen(['tsanalyze', '--normalized', 'fk_test.ts'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
            )
    output = p.communicate()[0].decode('utf-8')
    if p.returncode != 0:
        sys.stderr.write(output)
        sys.exit(1)
    logger.debug(output)

    return output

def parse_pid(data):
    pid = {}
    for entry in data.split(':'):
        if '=' in entry:
            (key, value) = entry.split('=', 1)
            pid[key] = value
    return pid

def parse_analysis(input):
    ts = {}
    ts['pids'] = {}
    for line in input.strip().split('\n'):
        (record_type, data) = line.split(':', 1)
        if record_type == 'pid':
            new_pid = parse_pid(data)
            ts['pids'][int(new_pid['pid'])] = new_pid
    return ts

def analysis():
    return parse_analysis(analyze())

if __name__ == '__main__':
    print(parse_analysis(analyze()))
