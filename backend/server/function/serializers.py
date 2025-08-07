from rest_framework import serializers
from .models import Post, SocialAccount, PostResult, User

class UserSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    username = serializers.CharField()
    email = serializers.CharField()

class SocialAccountSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    platform = serializers.CharField()
    username = serializers.CharField(required=False, allow_blank=True)
    is_active = serializers.BooleanField(default=True)
    created_at = serializers.DateTimeField(read_only=True)

class PostSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    title = serializers.CharField()
    content = serializers.CharField()
    image_path = serializers.CharField(required=False, allow_blank=True)
    generated_image_prompt = serializers.CharField(required=False, allow_blank=True)
    status = serializers.CharField(default='draft')
    scheduled_time = serializers.DateTimeField(required=False, allow_null=True)
    created_at = serializers.DateTimeField(read_only=True)
    posted_at = serializers.DateTimeField(read_only=True)
    platforms = serializers.SerializerMethodField()
    
    def get_platforms(self, obj):
        if hasattr(obj, 'platforms') and obj.platforms:
            return [SocialAccountSerializer(platform).data for platform in obj.platforms]
        return []

class PostResultSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    success = serializers.BooleanField()
    error_message = serializers.CharField()
    posted_at = serializers.DateTimeField()
    platform = serializers.SerializerMethodField()
    
    def get_platform(self, obj):
        if hasattr(obj, 'platform') and obj.platform:
            return SocialAccountSerializer(obj.platform).data
        return None