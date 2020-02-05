import os
import os
import platform
import ctypes

# TODO: Use PSUtil, http://code.google.com/p/psutil/


def get_free_space(folder):
    """ Return folder/drive free space (in bytes)
    """
    if platform.system() == 'Windows':
        free_bytes = ctypes.c_ulonglong(0)
        ctypes.windll.kernel32.GetDiskFreeSpaceExW(ctypes.c_wchar_p(folder),
                                                   None, None,
                                                   ctypes.pointer(free_bytes))
        return free_bytes.value
    else:
        p = os.statvfs(folder)
        return p.f_bfree*p.f_bsize
