from rest_framework import serializers
from .models import Post, SocialAccount, PostResult
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class SocialAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialAccount
        fields = ['id', 'platform', 'username', 'is_active', 'created_at']
        read_only_fields = ['created_at']

class PostSerializer(serializers.ModelSerializer):
    platforms = SocialAccountSerializer(many=True, read_only=True)
    platform_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'image', 'generated_image_prompt', 
                 'platforms', 'platform_ids', 'status', 'scheduled_time', 
                 'created_at', 'posted_at']
        read_only_fields = ['created_at', 'posted_at']
    
    def create(self, validated_data):
        platform_ids = validated_data.pop('platform_ids', [])
        post = Post.objects.create(**validated_data)
        if platform_ids:
            platforms = SocialAccount.objects.filter(id__in=platform_ids, user=post.user)
            post.platforms.set(platforms)
        return post

class PostResultSerializer(serializers.ModelSerializer):
    platform = SocialAccountSerializer(read_only=True)
    
    class Meta:
        model = PostResult
        fields = ['id', 'platform', 'success', 'error_message', 'posted_at']