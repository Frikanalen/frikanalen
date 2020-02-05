import socket
import logging
import xml.etree.ElementTree as ET
import re

class CasparLayer():
    def __init__(self, caspar_instance, channel_id, layer_id):
        self.layer_id = layer_id
        self.channel_id = channel_id
        self.caspar = caspar_instance

    @property
    def name(self):
        return '%d-%d' % (self.channel_id, self.layer_id)

    @property
    def id(self):
        return self.layer_id

    def clear(self):
        self.caspar._send_command('CLEAR %s' % (self.name,))

    def play(self, filename, transition = None, loop = False, seek = False):
        command = 'PLAY ' + self.name + ' '

        #FIXME: file name needs proper escaping
        command += '"' + filename + '" '

        if transition:
            command += transition + ' '

        if loop:
            command += 'LOOP '

        if seek:
            command += 'SEEK %d ' % (seek,)

        self.caspar._send_command(command)

class CasparChannel():
    def __init__(self, caspar_instance, channel_id):
        self.channel_id = channel_id
        self.caspar = caspar_instance

    @property
    def framerate(self):
        self.caspar._get_info()
        return self.caspar._channels[self.channel_id]['framerate']

    @property
    def name(self):
        return '%d' % (self.channel_id,)

    @property
    def id(self):
        return self.channel_id

    def layer(self, layer_id):
        return CasparLayer(self.caspar, self.channel_id, layer_id)

    def clear(self):
        self.caspar._send_command('CLEAR %s' % (self.name,))

class CasparCG:
    def __init__(self, hostname, amcp_port = 5250):
        self.socket = None
        self.hostname = hostname
        self.amcp_port = amcp_port
        if self.socket is not None:
            self.disconnect()

        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.connect((self.hostname, self.amcp_port))

    def _read_reply(self):
        response = self.socket.recv(3)

        try:
            return_code = int(response)
        except ValueError:
            raise ValueError('Did not receive numeric return code from CasparCG')

        while response[-2:] != b'\r\n':
            response += self.socket.recv(1)

        logging.debug('CasparCG replied %s' % (response.strip().decode('UTF-8'),))

        response = ''

        # From the AMCP spec:
        #
        # 200 [command] OK - The command has been executed and several lines of
        # data (seperated by \r\n) are being returned (terminated with an
        # additional \r\n)
        #
        # 201 [command] OK - The command has been executed and
        # data (terminated by \r\n) is being returned.
        #
        # 202 [command] OK - The command has been executed.

        if return_code == 200: # multiline returned_data
            returned_data_buffer = ''

            while returned_data_buffer[-4:] != b'\r\n\r\n':
                returned_data_buffer += self.socket.recv(512)

            returned_data = returned_data_buffer.splitlines()[:-1]

        elif return_code == 201: # single-line returned_data
            returned_data = ''
            while returned_data[-2:] != b'\r\n':
                returned_data += self.socket.recv(512)

        elif return_code == 202: # no data returned
            returned_data = None

        else:
            raise ValueError('CasparCG command failed: ' + response)

        return returned_data

    def _send_command(self, command, xmlreply=False):
        self.socket.send(('%s\r\n' % command).encode('UTF-8'))
        logging.debug("sending command %s" % (command,))
        return self._read_reply()

    def _get_info(self):
        self._channels = {}
        for line in self._send_command('INFO'):
            (channel_id, video_standard, status) = line.split(' ', 3)
            self._channels[int(channel_id)] = {'standard': video_standard, 'status': status}
            (resolution, refreshmode, framerate) = re.match(r'([0-9]+)(.)([0-9]+)', video_standard).groups()
            self._channels[int(channel_id)]['framerate'] = float(framerate) / 100

        for channel_id in list(self._channels.keys()):
            xml_string = self._send_command('INFO %d' % (channel_id,))
            # This hack needs doing because CasparCG emits malformed XML; tags must begin with alpha...
            xml_string = re.sub(r'(?P<start><|</)(?P<number>[0-9]+?)>', '\g<start>tag\g<number>>', xml_string, 0)
            root = ET.fromstring(xml_string)
            self._layers = {}
            for child in root.findall("stage/layer/"):
                layer_id = int(re.match(r'...(?P<number>[0-9]+)$', child.tag).group('number'))
                self._layers[layer_id] = child

    @property
    def channels(self):
        self._get_info()
        return self._layers

    def layer(self, channel_id, layer_id):
        return CasparLayer(self, channel_id, layer_id)

    def channel(self, channel_id):
        return CasparChannel(self, channel_id)

    @property
    def layers(self):
        self._get_info()
        return self._layers

if __name__ == '__main__':
    c = CasparCG('localhost')
    #print(c._send_command('INFO 1-50'))
    print((c.channel(1).framerate))
