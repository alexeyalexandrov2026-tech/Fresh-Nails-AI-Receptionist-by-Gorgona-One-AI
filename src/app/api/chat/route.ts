import { NextResponse } from 'next/server';

const DIFY_API_URL = process.env.DIFY_API_URL || 'https://api.dify.ai/v1';
const DIFY_API_KEY = process.env.DIFY_API_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, user = 'anonymous_client', conversation_id } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    if (!DIFY_API_KEY) {
      console.warn("DIFY_API_KEY is not set. Returning mock response.");
      // Полезно для локальной разработки, пока ключи не подключены
      return NextResponse.json({ 
        answer: "Извините, система ИИ временно отключена (API ключ не настроен). Пожалуйста, свяжитесь с нами по телефону.",
        conversation_id: "mock_id"
      });
    }

    const difyPayload = {
      inputs: {},
      query,
      response_mode: 'blocking', // Для начала используем blocking, позже можно перевести на streaming
      user,
      conversation_id: conversation_id || undefined,
    };

    const difyResponse = await fetch(`${DIFY_API_URL}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(difyPayload),
    });

    if (!difyResponse.ok) {
      const errorText = await difyResponse.text();
      console.error(`Dify API error (status ${difyResponse.status}): ${errorText}`);
      return NextResponse.json({ error: 'Dify API error', status: difyResponse.status, details: errorText }, { status: 502 });
    }

    const data = await difyResponse.json();

    return NextResponse.json({
      answer: data.answer,
      conversation_id: data.conversation_id,
    });

  } catch (error: any) {
    console.error('Chat API Error:', error?.message || String(error));
    return NextResponse.json({ error: 'Internal Server Error', details: error?.message || String(error) }, { status: 500 });
  }
}
