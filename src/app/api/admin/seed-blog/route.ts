import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { BlogPost } from '@/models/BlogPost';

export async function GET() {
  try {
    await connectDB();

    const title = 'Mystery Mosaic Coloring Guide: Guess First, Color Later (and Watch the Magic Happen)';
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const excerpt = "At first glance, it looks like random tiles. Numbers everywhere. No clear picture. Kinda confusing. But here's the twist: You're not just coloring… you're solving a mystery.";
    const seoKeywords = ['mystery mosaic coloring book', 'color by number for adults', 'hidden picture coloring', 'mosaic coloring guide', 'relaxing coloring book'];
    
    const content = `👀 Wait… This Isn’t Just Coloring

At first glance, it looks like random tiles.
Numbers everywhere. No clear picture. Kinda confusing.

But here’s the twist 👇

👉 You’re not just coloring… you’re solving a mystery.

Each page in this book is designed with a 2-step experience:
- **Guess the hidden image** - No cheating!
- **Color it to reveal the truth** - Watch the magic unfold.

And trust me… when the image finally appears?
It hits different.

🧩 Step 1: Guess the Hidden Image (Don’t Skip This 👀)

Before you even touch your colors, there’s a little challenge waiting.

👉 “Can you guess this bright yellow flower that always faces the sun?”

Take a moment. Think about it.
No cheating. No scrolling ahead.

💡 This step is important because it makes your brain engage more, builds anticipation, and makes the final reveal way more satisfying.

(Hint: yeah… you probably got this one right 🌻)

🎨 Step 2: Color by Number (The Fun Begins)

Now move to the mosaic page.

You’ll see:
- A grid full of numbers & letters
- A color legend on the side
- Tons of tiny tiles waiting for you

**How to do it**:
Match each number to the correct color, fill in each tile carefully, and watch patterns slowly form.

🧠 Start from one color at a time instead of jumping around. It helps the image reveal faster and cleaner.

✨ Step 3: Watch the Image Reveal Itself

At first? Nothing makes sense.
Then suddenly…
Shapes start connecting.
Colors begin aligning.

And boom 💥

👉 The hidden image appears.

That moment when you realize:
“Ohhh THAT’S what it was!”
Yeah… that’s the addictive part.

## Tips to Level Up Your Coloring Game

- **Use markers** - for bold results
- **Use colored pencils** - for smooth blending
- **Take your time** - this is therapy, not a race
- **Zoom out sometimes** - to see the bigger picture

## Why Mystery Mosaic Is So Addictive

Let’s be real… this isn’t normal coloring.

You’re getting:
- Puzzle + creativity combo
- Stress relief (lowkey therapy)
- Surprise reward at the end

It’s basically: Gaming + Art + Relaxation in one.

## Ready to Try It Yourself?

If you enjoy hidden picture games, color by number, and a little challenge while relaxing, then this book is 100% your vibe.

👉 Start with one page. And don’t be surprised if you can’t stop.`;

    const existingPost = await BlogPost.findOne({ slug });
    
    if (existingPost) {
      existingPost.title = title;
      existingPost.content = content;
      existingPost.excerpt = excerpt;
      existingPost.seoKeywords = seoKeywords;
      existingPost.thumbnail = '';
      existingPost.category = 'Guides';
      await existingPost.save();
      return NextResponse.json({ message: 'Blog post updated successfully' });
    }

    await BlogPost.create({
      title,
      slug,
      excerpt,
      content,
      thumbnail: '',
      category: 'Guides',
      seoKeywords,
      published: true,
    });

    return NextResponse.json({ message: 'Blog post created successfully' });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
