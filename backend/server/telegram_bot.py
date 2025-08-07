#!/usr/bin/env python3
"""
Telegram Bot for Social Postify
Posts all draft posts from database to Telegram
"""

import os
import sys
import django
import asyncio
from dotenv import load_dotenv
from telegram import Bot

# Setup Django
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from function.models import Post

# Load environment variables
load_dotenv(os.path.join('..', '..', '.env'))
TOKEN = os.getenv("TELEGRAM_TOKEN")
CHAT_ID = os.getenv("CHAT_ID")

async def post_all_drafts():
    """Post all draft posts from database to Telegram"""
    if not TOKEN or not CHAT_ID:
        print("Telegram credentials not found in .env")
        return
    
    bot = Bot(token=TOKEN)
    draft_posts = Post.objects(status='draft')
    
    if not draft_posts:
        print("No draft posts found")
        return
    
    print(f"Posting {len(draft_posts)} draft posts to Telegram...")
    
    for post in draft_posts:
        try:
            caption = f"{post.title}\n\n{post.content}"
            
            # Send with image if available
            if post.image_path and os.path.exists(post.image_path.replace('/media/', 'media/')):
                image_path = post.image_path.replace('/media/', 'media/')
                with open(image_path, "rb") as photo:
                    await bot.send_photo(chat_id=CHAT_ID, photo=photo, caption=caption)
                print(f"Posted with image: {post.title}")
            else:
                await bot.send_message(chat_id=CHAT_ID, text=caption)
                print(f"Posted text: {post.title}")
            
            # Update status
            post.status = 'posted'
            from datetime import datetime
            post.posted_at = datetime.utcnow()
            post.save()
            
        except Exception as e:
            print(f"Failed to post '{post.title}': {e}")

if __name__ == "__main__":
    asyncio.run(post_all_drafts())