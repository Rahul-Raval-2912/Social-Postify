import os
import base64
import requests
import asyncio
from telegram import Bot
from instagrapi import Client
from dotenv import load_dotenv
from .models import Post, PostResult

load_dotenv()

class ImageGenerator:
    @staticmethod
    def generate_image(prompt):
        """Generate image using Stability AI"""
        api_key = os.getenv("STABILITY_API_KEY")
        if not api_key:
            raise Exception("STABILITY_API_KEY not found in environment")
        
        url = "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        payload = {
            "text_prompts": [{"text": prompt}],
            "cfg_scale": 7,
            "height": 512,
            "width": 512,
            "samples": 1,
            "steps": 30
        }
        
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200:
            data = response.json()
            return data['artifacts'][0]['base64']
        else:
            raise Exception(f"Image generation failed: {response.text}")

class TelegramService:
    @staticmethod
    async def post_to_telegram(post, account):
        """Post to Telegram channel"""
        try:
            token = os.getenv("TELEGRAM_TOKEN")
            chat_id = os.getenv("CHAT_ID")
            
            if not token or not chat_id:
                raise Exception("Telegram credentials not configured in environment")
            
            bot = Bot(token=token)
            
            # Create post content with title
            content = f"**{post.title}**\n\n{post.content}"
            
            if post.image:
                with open(post.image.path, "rb") as photo:
                    await bot.send_photo(chat_id=chat_id, photo=photo, caption=content)
            else:
                await bot.send_message(chat_id=chat_id, text=content)
            
            return True, "Posted to Telegram successfully"
        except Exception as e:
            return False, str(e)

class InstagramService:
    @staticmethod
    def post_to_instagram(post, account, username, password):
        """Post to Instagram (requires user credentials)"""
        try:
            cl = Client()
            cl.delay_range = [1, 5]
            cl.login(username, password)
            
            if post.image:
                cl.photo_upload(post.image.path, caption=post.content)
            else:
                raise Exception("Instagram requires an image")
            
            return True, "Posted successfully"
        except Exception as e:
            return False, str(e)

class FacebookService:
    @staticmethod
    def post_to_facebook(post, account):
        """Post to Facebook (placeholder - requires Facebook API setup)"""
        # TODO: Implement Facebook posting
        return False, "Facebook posting not implemented yet"

class WhatsAppService:
    @staticmethod
    def post_to_whatsapp(post, account):
        """Post to WhatsApp (placeholder - requires WhatsApp Business API)"""
        # TODO: Implement WhatsApp posting
        return False, "WhatsApp posting not implemented yet"

class PostingService:
    @staticmethod
    async def post_to_platform(post, account, credentials=None):
        """Route posting to appropriate service"""
        if account.platform == 'telegram':
            return await TelegramService.post_to_telegram(post, account)
        elif account.platform == 'instagram':
            if not credentials or 'username' not in credentials or 'password' not in credentials:
                return False, "Instagram credentials required"
            return InstagramService.post_to_instagram(post, account, 
                                                    credentials['username'], 
                                                    credentials['password'])
        elif account.platform == 'facebook':
            return FacebookService.post_to_facebook(post, account)
        elif account.platform == 'whatsapp':
            return WhatsAppService.post_to_whatsapp(post, account)
        else:
            return False, f"Unsupported platform: {account.platform}"
    
    @staticmethod
    async def publish_post(post_id, credentials=None):
        """Publish post to all selected platforms"""
        try:
            post = Post.objects.get(id=post_id)
            results = []
            
            for account in post.platforms.all():
                success, message = await PostingService.post_to_platform(post, account, credentials)
                
                PostResult.objects.create(
                    post=post,
                    platform=account,
                    success=success,
                    error_message=message if not success else ""
                )
                
                results.append({
                    'platform': account.platform,
                    'success': success,
                    'message': message
                })
            
            # Update post status
            all_success = all(r['success'] for r in results) if results else False
            post.status = 'posted' if all_success else 'failed'
            if all_success:
                from django.utils import timezone
                post.posted_at = timezone.now()
            post.save()
            
            return results
        except Exception as e:
            return [{'platform': 'all', 'success': False, 'message': str(e)}]