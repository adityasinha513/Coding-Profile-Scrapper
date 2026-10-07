import time
import threading

class SimpleTTLCache:
    """Thread-safe in-memory cache with Time-To-Live (TTL) expiration."""
    def __init__(self, default_ttl=600):
        self.default_ttl = default_ttl
        self._cache = {}
        self._lock = threading.Lock()

    def get(self, key):
        with self._lock:
            if key not in self._cache:
                return None
            val, expiry = self._cache[key]
            if time.time() > expiry:
                del self._cache[key]
                return None
            return val

    def set(self, key, val, ttl=None):
        with self._lock:
            if ttl is None:
                ttl = self.default_ttl
            expiry = time.time() + ttl
            self._cache[key] = (val, expiry)

    def delete(self, key):
        with self._lock:
            if key in self._cache:
                del self._cache[key]

    def clear(self):
        with self._lock:
            self._cache.clear()

cache = SimpleTTLCache(default_ttl=600)  # 10 minutes cache
