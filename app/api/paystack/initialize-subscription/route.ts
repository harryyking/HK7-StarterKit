import Paystack from 'paystack-node';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!); // Correct instantiation
    const body = await request.json();
    const { email, amount, plan, metadata, userId } = body;
    const planCode = "PLN_o1h2io6q0pxg36t";

    const response = await paystack.transaction.initialize({
      email,
      amount: amount * 100,
      plan: planCode,
      metadata: { ...metadata, userId: userId },
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription-success`,
    });

    return NextResponse.json({ authorization_url: response.data.authorization_url });
  } catch (error: any) {
    console.error('Paystack API error:', error);

    let errorMessage = 'Failed to initialize payment. Please try again.';

    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}