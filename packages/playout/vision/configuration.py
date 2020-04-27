import os
import logging
import pprint
import yaml

class DictAsMember(dict):
    def __getattr__(self, name):
        value = self[name]
        if isinstance(value, dict):
            value = DictAsMember(value)
        return value

class Configuration():
    def __getattr__(self, name):
        value = self.cfg[name]
        if isinstance(value, dict):
            value = DictAsMember(value)
        return value

    def load_and_parse(self, filespec):
        logging.info("Reading configuration file {}...".format(filespec))
        try:
            f = open(filespec, 'rb')
            return yaml.load(f, Loader=yaml.FullLoader)
        except Exception as e:
            logging.error('Exception when reading configuration file!')
            raise 

    def __init__(self, filename="config.yaml"):
        self.cfg =self.load_and_parse(filename)

    def __repr__(self):
        return pprint.pprint(self.cfg)
        
configuration = Configuration()

if __name__ == '__main__':
    c = Configuration()
