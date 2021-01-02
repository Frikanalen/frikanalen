from django.utils import timezone

def api_utc_middleware(get_response):
    def middleware(request):
        is_api = request.path.startswith('/api/')
        with timezone.override(timezone.utc if is_api else None):
            return get_response(request)
    return middleware
