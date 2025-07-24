from djongo import models
from django.contrib.auth.models import User
from django.utils import timezone

class SocialAccount(models.Model):
    PLATFORM_CHOICES = [
        ('telegram', 'Telegram'),
        ('instagram', 'Instagram'),
        ('facebook', 'Facebook'),
        ('whatsapp', 'WhatsApp'),
    ]
    
    _id = models.ObjectIdField()
    user_id = models.IntegerField()
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    username = models.CharField(max_length=100, blank=True)
    token = models.TextField(blank=True)
    chat_id = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        abstract = False

class Post(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('scheduled', 'Scheduled'),
        ('posted', 'Posted'),
        ('failed', 'Failed'),
    ]
    
    _id = models.ObjectIdField()
    user_id = models.IntegerField()
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='posts/', blank=True, null=True)
    generated_image_prompt = models.TextField(blank=True)
    platform_ids = models.JSONField(default=list)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    scheduled_time = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    posted_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        abstract = False

class PostResult(models.Model):
    _id = models.ObjectIdField()
    post_id = models.CharField(max_length=24)
    platform_id = models.CharField(max_length=24)
    success = models.BooleanField(default=False)
    error_message = models.TextField(blank=True)
    posted_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        abstract = False
