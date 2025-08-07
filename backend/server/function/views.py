import asyncio
import os
import base64
import uuid
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Post, SocialAccount, PostResult, User
from .serializers import PostSerializer, SocialAccountSerializer, PostResultSerializer
from .services import ImageGenerator, PostingService
from django.core.files.base import ContentFile

# Simple in-memory session storage
user_sessions = {}

class PostViewSet(viewsets.ViewSet):
    parser_classes = (MultiPartParser, FormParser)
    
    def list(self, request):
        session_id = request.META.get('HTTP_AUTHORIZATION', '').replace('Bearer ', '')
        user_id = user_sessions.get(session_id)
        if not user_id:
            return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            user = User.objects.get(id=user_id)
            posts = Post.objects(user=user)
            serializer = PostSerializer(posts, many=True)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def create(self, request):
        # Get token from Authorization header
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith('Bearer '):
            return Response({'error': 'No authorization header'}, status=status.HTTP_401_UNAUTHORIZED)
        
        session_id = auth_header.replace('Bearer ', '')
        user_id = user_sessions.get(session_id)
        
        if not user_id:
            return Response({'error': f'Invalid token: {session_id[:10]}...'}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            user = User.objects.get(id=user_id)
            data = request.data.copy()
            
            # Handle image upload
            image_path = ''
            if 'image' in request.FILES:
                image = request.FILES['image']
                import os
                from django.conf import settings
                media_path = os.path.join(settings.MEDIA_ROOT, 'posts')
                os.makedirs(media_path, exist_ok=True)
                image_path = os.path.join(media_path, image.name)
                with open(image_path, 'wb') as f:
                    for chunk in image.chunks():
                        f.write(chunk)
                image_path = f'/media/posts/{image.name}'
            
            post = Post(
                user=user,
                title=data['title'],
                content=data['content'],
                image_path=image_path,
                generated_image_prompt=data.get('generated_image_prompt', ''),
                status=data.get('status', 'draft')
            ).save()
            
            serializer = PostSerializer(post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def retrieve(self, request, pk=None):
        session_id = request.META.get('HTTP_AUTHORIZATION', '').replace('Bearer ', '')
        user_id = user_sessions.get(session_id)
        if not user_id:
            return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            user = User.objects.get(id=user_id)
            post = Post.objects.get(id=pk, user=user)
            serializer = PostSerializer(post)
            return Response(serializer.data)
        except (User.DoesNotExist, Post.DoesNotExist):
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def destroy(self, request, pk=None):
        session_id = request.META.get('HTTP_AUTHORIZATION', '').replace('Bearer ', '')
        user_id = user_sessions.get(session_id)
        if not user_id:
            return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            user = User.objects.get(id=user_id)
            post = Post.objects.get(id=pk, user=user)
            post.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except (User.DoesNotExist, Post.DoesNotExist):
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def generate_image(self, request):
        prompt = request.data.get('prompt')
        if not prompt:
            return Response({'error': 'Prompt is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            image_base64 = ImageGenerator.generate_image(prompt)
            return Response({
                'image_base64': image_base64,
                'filename': f'generated-{len(prompt)}.png'
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        # Get token from Authorization header
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith('Bearer '):
            return Response({'error': 'No authorization header'}, status=status.HTTP_401_UNAUTHORIZED)
        
        session_id = auth_header.replace('Bearer ', '')
        user_id = user_sessions.get(session_id)
        
        if not user_id:
            return Response({'error': f'Invalid token: {session_id[:10]}...'}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            user = User.objects.get(id=user_id)
            post = Post.objects.get(id=pk, user=user)
            
            # Handle form data
            import json
            publish_data = {
                'platforms': json.loads(request.data.get('platforms', '{}')),
                'credentials': json.loads(request.data.get('credentials', '{}'))
            }
            
            # Run async function in sync context
            results = asyncio.run(PostingService.publish_post(str(post.id), publish_data))
            
            return Response({'results': results})
        except (User.DoesNotExist, Post.DoesNotExist):
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SocialAccountViewSet(viewsets.ViewSet):
    
    def list(self, request):
        session_id = request.META.get('HTTP_AUTHORIZATION', '').replace('Bearer ', '')
        user_id = user_sessions.get(session_id)
        if not user_id:
            return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            user = User.objects.get(id=user_id)
            accounts = SocialAccount.objects(user=user)
            serializer = SocialAccountSerializer(accounts, many=True)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@csrf_exempt
@api_view(['POST'])
def create_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    
    if User.objects(username=username).first():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User(username=username, email=email)
    user.set_password(password)
    user.save()
    
    return Response({'message': 'User created successfully', 'user_id': str(user.id)})

@csrf_exempt
@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = User.objects(username=username).first()
    if user and user.check_password(password):
        session_id = str(uuid.uuid4())
        user_sessions[session_id] = str(user.id)
        return Response({
            'message': 'Login successful', 
            'user_id': str(user.id),
            'username': user.username,
            'token': session_id
        })
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@csrf_exempt
@api_view(['POST'])
def logout_user(request):
    session_id = request.META.get('HTTP_AUTHORIZATION', '').replace('Bearer ', '')
    if session_id in user_sessions:
        del user_sessions[session_id]
    return Response({'message': 'Logged out successfully'})

@csrf_exempt
@api_view(['GET', 'PUT'])
def user_profile(request):
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    if not auth_header.startswith('Bearer '):
        return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
    
    session_id = auth_header.replace('Bearer ', '')
    user_id = user_sessions.get(session_id)
    
    if not user_id:
        return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        user = User.objects.get(id=user_id)
        
        if request.method == 'GET':
            return Response({
                'username': user.username,
                'email': user.email,
                'id': str(user.id)
            })
        
        elif request.method == 'PUT':
            user.username = request.data.get('username', user.username)
            user.email = request.data.get('email', user.email)
            user.save()
            
            return Response({
                'message': 'Profile updated successfully',
                'username': user.username,
                'email': user.email
            })
    
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@csrf_exempt
@api_view(['POST'])
def change_password(request):
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    if not auth_header.startswith('Bearer '):
        return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
    
    session_id = auth_header.replace('Bearer ', '')
    user_id = user_sessions.get(session_id)
    
    if not user_id:
        return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        user = User.objects.get(id=user_id)
        current_password = request.data.get('currentPassword')
        new_password = request.data.get('newPassword')
        
        if not user.check_password(current_password):
            return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()
        
        return Response({'message': 'Password changed successfully'})
    
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)