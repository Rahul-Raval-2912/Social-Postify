from mongoengine import Document, StringField, IntField, BooleanField, DateTimeField, ListField, ImageField, ReferenceField
from datetime import datetime
import hashlib

class User(Document):
    username = StringField(max_length=100, required=True, unique=True)
    email = StringField(max_length=100, required=True)
    password_hash = StringField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    
    meta = {'collection': 'users'}
    
    def set_password(self, password):
        self.password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    def check_password(self, password):
        return self.password_hash == hashlib.sha256(password.encode()).hexdigest()

class SocialAccount(Document):
    PLATFORM_CHOICES = [
        ('telegram', 'Telegram'),
        ('instagram', 'Instagram'),
        ('facebook', 'Facebook'),
        ('whatsapp', 'WhatsApp'),
    ]
    
    user = ReferenceField(User, required=True)
    platform = StringField(max_length=20, choices=PLATFORM_CHOICES, required=True)
    username = StringField(max_length=100)
    token = StringField()
    chat_id = StringField(max_length=100)
    is_active = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.utcnow)
    
    meta = {'collection': 'social_accounts'}

class Post(Document):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('scheduled', 'Scheduled'),
        ('posted', 'Posted'),
        ('failed', 'Failed'),
    ]
    
    user = ReferenceField(User, required=True)
    title = StringField(max_length=200, required=True)
    content = StringField(required=True)
    image_path = StringField()
    generated_image_prompt = StringField()
    platforms = ListField(ReferenceField(SocialAccount))
    status = StringField(max_length=20, choices=STATUS_CHOICES, default='draft')
    scheduled_time = DateTimeField()
    created_at = DateTimeField(default=datetime.utcnow)
    posted_at = DateTimeField()
    
    meta = {'collection': 'posts'}

class PostResult(Document):
    post = ReferenceField(Post, required=True)
    platform = ReferenceField(SocialAccount, required=True)
    success = BooleanField(default=False)
    error_message = StringField()
    posted_at = DateTimeField(default=datetime.utcnow)
    
    meta = {'collection': 'post_results'}