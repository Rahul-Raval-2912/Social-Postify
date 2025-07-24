from django.db import models
from django.contrib.auth.models import User

class SocialAccount(models.Model):
    PLATFORM_CHOICES = [
        ('telegram', 'Telegram'),
        ('instagram', 'Instagram'),
        ('facebook', 'Facebook'),
        ('whatsapp', 'WhatsApp'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    username = models.CharField(max_length=100, blank=True)
    token = models.TextField(blank=True)
    chat_id = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Post(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('scheduled', 'Scheduled'),
        ('posted', 'Posted'),
        ('failed', 'Failed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='posts/', blank=True, null=True)
    generated_image_prompt = models.TextField(blank=True)
    platforms = models.ManyToManyField(SocialAccount, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    scheduled_time = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    posted_at = models.DateTimeField(blank=True, null=True)

class PostResult(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    platform = models.ForeignKey(SocialAccount, on_delete=models.CASCADE)
    success = models.BooleanField(default=False)
    error_message = models.TextField(blank=True)
    posted_at = models.DateTimeField(auto_now_add=True)
