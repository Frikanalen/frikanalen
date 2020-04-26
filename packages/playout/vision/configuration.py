import os


class Configuration(object):
    config_keys = [
        'name',
        'cache_root', 'video_cache_root', 'schedule_cache_root', 'queue_root',
        'jobs_root', 'depot_root',
        'render_type', 'jukebox', 'video_cache_only', 'ident_media_root',
         'caspar_media_access_method', 'caspar_media_https_location']
    name = property(lambda self: self.__class__.__name__)
    base_path = os.path.normpath(os.path.join(
        os.path.abspath(__file__), '..', '..'))
    cache_root = os.path.join(base_path, 'cache')
    depot_root = os.path.join(base_path, 'cache', 'depot')
    video_cache_root = os.path.join(base_path, 'playout', 'video')
    schedule_cache_root = os.path.join(base_path, 'cache', 'dailyplan')
    queue_root = os.path.join(cache_root, 'queue')
    jobs_root = os.path.join(cache_root, 'jobs')
    ident_media_root = os.path.join(base_path, 'video')

    caspar_media_access_method = 'https' # alternative: file
    caspar_media_https_location = 'https://file01.frikanalen.no/media/'
    graphql_endpoint = 'https://forrige.frikanalen.no/graphql'

    player_class = 'vision.players.casparcg_player:CasparCGPlayer'

    def config_strings(self):
        l = []
        for key in self.config_keys:
            s = '%s: %s' % (key, getattr(self, key))
            l.append(s)
        return '\n'.join(l)

    def config_tuples(self):
        'For JSON serialization'
        l = []
        for key in self.config_keys:
            l.append((key, getattr(self, key)))
        return l


class FKConfiguration(Configuration):
    media_root = '/mnt/media'
    render_type = 'broadcast'
    jukebox = True
    video_cache_only = False

class DeveloperConfiguration(Configuration):
    media_root = './repo/testmedia/media'
    video_cache_root = './repo/video/'
    ident_media_root = './repo/ident/'
    render_type = ''
    jukebox = True
    video_cache_only = True
    depot_root = 'c:/Depot'


configuration = FKConfiguration()

if __name__ == '__main__':
    print('Configuration details:')
    print((configuration.config_strings()))
