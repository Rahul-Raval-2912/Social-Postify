import os
import base64
import requests
import asyncio
from telegram import Bot
from instagrapi import Client
from dotenv import load_dotenv
from .models import Post, PostResult, SocialAccount

# Load .env from project root
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '..', '.env'))

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
                return False, "Telegram credentials not configured"
            
            bot = Bot(token=token)
            caption = f"{post.title}\n\n{post.content}"
            
            # Send message
            if post.image_path:
                # Try to find image
                possible_paths = [
                    post.image_path,
                    post.image_path.replace('/media/', 'media/'),
                    os.path.join('media', post.image_path.replace('/media/', ''))
                ]
                
                image_found = False
                for path in possible_paths:
                    if os.path.exists(path):
                        with open(path, "rb") as photo:
                            await bot.send_photo(chat_id=chat_id, photo=photo, caption=caption)
                        image_found = True
                        break
                
                if not image_found:
                    await bot.send_message(chat_id=chat_id, text=caption)
            else:
                await bot.send_message(chat_id=chat_id, text=caption)
            
            return True, "Posted to Telegram successfully"
            
        except Exception as e:
            return False, f"Telegram error: {str(e)}"

class InstagramService:
    @staticmethod
    def post_to_instagram(post, account, username, password):
        """Post to Instagram using instagrapi"""
        try:
            from instagrapi import Client
            
            if not post.image_path:
                return False, "Instagram requires an image"
            
            # Find image file
            image_path = post.image_path.replace('/media/', 'media/')
            if not os.path.exists(image_path):
                return False, f"Image file not found: {image_path}"
            
            cl = Client()
            cl.delay_range = [2, 8]
            
            # Login
            if not cl.login(username, password):
                return False, "Instagram login failed"
            
            # Upload photo
            caption = f"{post.title}\n\n{post.content}"
            media = cl.photo_upload(image_path, caption=caption)
            
            if media:
                return True, f"Posted to Instagram successfully (ID: {media.pk})"
            else:
                return False, "Failed to upload to Instagram"
                
        except Exception as e:
            return False, f"Instagram error: {str(e)}"

class FacebookService:
    @staticmethod
    def post_to_facebook(post, account):
        """Post to Facebook page"""
        try:
            page_id = os.getenv("FB_PAGE_ID")
            access_token = os.getenv("FB_ACCESS_TOKEN")
            
            if not page_id or not access_token:
                return False, "Facebook credentials not configured"
            
            message = f"{post.title}\n\n{post.content}"
            
            if post.image_path and os.path.exists(post.image_path.replace('/media/', 'media/')):
                # Post with image
                post_url = f"https://graph.facebook.com/{page_id}/feed"
                payload = {
                    "access_token": access_token,
                    "message": message
                }
                image_path = post.image_path.replace('/media/', 'media/')
                with open(image_path, "rb") as img:
                    files = {"source": img}
                    response = requests.post(post_url, data=payload, files=files)
            else:
                # Text only
                post_url = f"https://graph.facebook.com/{page_id}/feed"
                payload = {
                    "access_token": access_token,
                    "message": message
                }
                response = requests.post(post_url, data=payload)
            
            if response.status_code == 200:
                return True, "Posted to Facebook successfully"
            else:
                return False, f"Facebook error: {response.text}"
                
        except Exception as e:
            return False, f"Facebook error: {str(e)}"

class WhatsAppService:
    @staticmethod
    def post_to_whatsapp(post, account):
        """Post to WhatsApp using Cloud API"""
        try:
            access_token = os.getenv("WHATSAPP_ACCESS_TOKEN")
            phone_number_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
            recipient_phone = os.getenv("WHATSAPP_RECIPIENT_PHONE")
            
            if not all([access_token, phone_number_id, recipient_phone]):
                return False, "WhatsApp credentials not configured"
            
            url = f"https://graph.facebook.com/v19.0/{phone_number_id}/messages"
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
            
            message = f"{post.title}\n\n{post.content}"
            payload = {
                "messaging_product": "whatsapp",
                "to": recipient_phone,
                "type": "text",
                "text": {
                    "body": message
                }
            }
            
            response = requests.post(url, headers=headers, json=payload)
            
            if response.status_code == 200:
                return True, "Posted to WhatsApp successfully"
            else:
                return False, f"WhatsApp error: {response.text}"
                
        except Exception as e:
            return False, f"WhatsApp error: {str(e)}"

class PostingService:
    
    @staticmethod
    async def publish_post(post_id, publish_data=None):
        """Publish post to selected platforms"""
        try:
            post = Post.objects.get(id=post_id)
            results = []
            
            if not publish_data:
                return [{'platform': 'error', 'success': False, 'message': 'No platform data provided'}]
            
            platforms = publish_data.get('platforms', {})
            
            # Telegram - WORKING
            if platforms.get('telegram'):
                try:
                    account = SocialAccount.objects(user=post.user, platform='telegram').first()
                    if not account:
                        account = SocialAccount(user=post.user, platform='telegram', username='Telegram', is_active=True)
                        account.save()
                    
                    success, message = await TelegramService.post_to_telegram(post, account)
                    
                    # Save result
                    try:
                        PostResult(post=post, platform=account, success=success, error_message=message if not success else "").save()
                    except:
                        pass  # Don't fail if result save fails
                    
                    results.append({'platform': 'telegram', 'success': success, 'message': message})
                except Exception as e:
                    results.append({'platform': 'telegram', 'success': False, 'message': f'Telegram error: {str(e)}'})
            
            # Instagram - DISABLED (IP banned)
            if platforms.get('instagram'):
                results.append({'platform': 'instagram', 'success': False, 'message': 'Instagram disabled - IP banned'})
            
            # Facebook
            if platforms.get('facebook'):
                try:
                    account = SocialAccount.objects(user=post.user, platform='facebook').first()
                    if not account:
                        account = SocialAccount(user=post.user, platform='facebook', username='Facebook', is_active=True)
                        account.save()
                    
                    success, message = FacebookService.post_to_facebook(post, account)
                    
                    try:
                        PostResult(post=post, platform=account, success=success, error_message=message if not success else "").save()
                    except:
                        pass
                    
                    results.append({'platform': 'facebook', 'success': success, 'message': message})
                except Exception as e:
                    results.append({'platform': 'facebook', 'success': False, 'message': f'Facebook error: {str(e)}'})
            
            # WhatsApp
            if platforms.get('whatsapp'):
                try:
                    account = SocialAccount.objects(user=post.user, platform='whatsapp').first()
                    if not account:
                        account = SocialAccount(user=post.user, platform='whatsapp', username='WhatsApp', is_active=True)
                        account.save()
                    
                    success, message = WhatsAppService.post_to_whatsapp(post, account)
                    
                    try:
                        PostResult(post=post, platform=account, success=success, error_message=message if not success else "").save()
                    except:
                        pass
                    
                    results.append({'platform': 'whatsapp', 'success': success, 'message': message})
                except Exception as e:
                    results.append({'platform': 'whatsapp', 'success': False, 'message': f'WhatsApp error: {str(e)}'})
            
            # Update post status
            try:
                success_count = sum(1 for r in results if r['success'])
                if success_count > 0:
                    post.status = 'posted'
                    from datetime import datetime
                    post.posted_at = datetime.utcnow()
                else:
                    post.status = 'failed'
                post.save()
            except:
                pass  # Don't fail if post update fails
            
            return results
            
        except Exception as e:
            return [{'platform': 'error', 'success': False, 'message': f'System error: {str(e)}'}]