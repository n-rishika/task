import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidCode(code: string): boolean {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

export async function POST(request: NextRequest) {
  try {
    const { url, code } = await request.json();

    if (!url || typeof url !== 'string' || !isValidUrl(url)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    let finalCode = code;
    if (code) {
      if (!isValidCode(code)) {
        return NextResponse.json({ error: 'Code must be 6-8 alphanumeric characters' }, { status: 400 });
      }
      const existing = await prisma.link.findUnique({ where: { code } });
      if (existing) {
        return NextResponse.json({ error: 'Code already exists' }, { status: 409 });
      }
    } else {
      // Generate unique code
      let attempts = 0;
      do {
        finalCode = nanoid(6);
        attempts++;
        if (attempts > 10) {
          finalCode = nanoid(8); // fallback to 8 chars
        }
      } while (await prisma.link.findUnique({ where: { code: finalCode } }));
    }

    const link = await prisma.link.create({
      data: { code: finalCode!, url },
    });

    return NextResponse.json({
      code: link.code,
      url: link.url,
      clicks: link.clicks,
      lastClicked: link.lastClicked,
      createdAt: link.createdAt,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(links.map(link => ({
      code: link.code,
      url: link.url,
      clicks: link.clicks,
      lastClicked: link.lastClicked,
      createdAt: link.createdAt,
    })));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}