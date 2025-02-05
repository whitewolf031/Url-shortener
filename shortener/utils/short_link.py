import random
import string

def generate_short_link():
    """Tasodifiy 6 belgidan iborat qisqa URL yaratish"""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=6))