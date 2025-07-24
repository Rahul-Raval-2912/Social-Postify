from rest_framework import serializers
from .models import Post, SocialAccount, PostResult
from django.contrib.auth.models import User
from bson import ObjectId

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class SocialAccountSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)
    
    class Meta:
        model = SocialAccount
        fields = ['id', 'platform', 'username', 'is_active', 'created_at']
        read_only_fields = ['created_at']

class PostSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)
    platforms = serializers.SerializerMethodField()
    platform_ids = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'image', 'generated_image_prompt', 
                 'platforms', 'platform_ids', 'status', 'scheduled_time', 
                 'created_at', 'posted_at']
        read_only_fields = ['created_at', 'posted_at']
    
    def get_platforms(self, obj):
        if obj.platform_ids:
            accounts = SocialAccount.objects.filter(_id__in=[ObjectId(pid) for pid in obj.platform_ids])
            return SocialAccountSerializer(accounts, many=True).data
        return []
    
    def create(self, validated_data):
        platform_ids = validated_data.pop('platform_ids', [])
        validated_data['platform_ids'] = platform_ids
        return Post.objects.create(**validated_data)

class PostResultSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)
    platform = serializers.SerializerMethodField()
    
    class Meta:
        model = PostResult
        fields = ['id', 'platform', 'success', 'error_message', 'posted_at']
    
    def get_platform(self, obj):
        try:
            account = SocialAccount.objects.get(_id=ObjectId(obj.platform_id))
            return SocialAccountSerializer(account).data
        except:
            return None