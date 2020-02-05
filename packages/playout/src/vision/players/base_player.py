from abc import ABCMeta, abstractmethod


class BasePlayer(object, metaclass=ABCMeta):
    def __init__(self, loop_filename):
        pass

    @abstractmethod
    def play_program(self, program=None, resume_offset=0):
        pass

    @abstractmethod
    def show_still(self, filename):
        pass

    @abstractmethod
    def pause_screen(self):
        pass

    @abstractmethod
    def seconds_until_end_of_playing_video(self):
        pass

    def snapshot(self):
        pass
