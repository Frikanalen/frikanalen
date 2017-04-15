import os


class UploadError(Exception):
    pass


def handle_upload(forms, files, dest):
    if 'name' in forms:
        filename = forms['name']
    else:
        raise UploadError("Filename must be present")

    if 'chunk' in forms and 'chunks' in forms:
        chunk = int(forms['chunk'])
        total = int(forms['chunks'])
    else:
        chunk = 0
        total = 1

    first = chunk == 0
    last = chunk == total - 1

    destfile = os.path.join(dest, filename)
    if os.access(destfile, os.F_OK):
        raise UploadError("File already uploaded")

    tmpfile = os.path.join(dest, '{0}.part'.format(filename))
    try:
        with open(tmpfile, 'w+b' if first else 'ab') as fd:
            files['file'].save(fd)
        if last:
            os.rename(tmpfile, destfile)
    except:
        raise UploadError("Failed to write file.")
    return last and destfile or None
