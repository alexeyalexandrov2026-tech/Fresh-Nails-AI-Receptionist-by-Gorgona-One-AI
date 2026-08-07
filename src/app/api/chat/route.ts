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
      const errorData = await difyResponse.json();
      throw new Error(`Dify API error: ${JSON.stringify(errorData)}`);
    }

    const data = await difyResponse.json();
    
    return NextResponse.json({
      answer: data.answer,
      conversation_id: data.conversation_id,
    });
    
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
