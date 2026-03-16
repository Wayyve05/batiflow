import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { userId, email } = await req.json()
    const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY
    const PRICE_ID = process.env.STRIPE_PRICE_ID
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://quoty.tech'

    if (!STRIPE_SECRET || !PRICE_ID) {
      return NextResponse.json({ error: 'Stripe non configure' }, { status: 500 })
    }

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + STRIPE_SECRET,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'subscription',
        'payment_method_types[0]': 'card',
        'line_items[0][price]': PRICE_ID,
        'line_items[0][quantity]': '1',
        'success_url': SITE_URL + '?payment=success',
        'cancel_url': SITE_URL + '?payment=cancel',
        'customer_email': email,
        'client_reference_id': userId,
        'subscription_data[metadata][userId]': userId,
      }).toString()
    })

    const session = await response.json()
    if (session.error) {
      return NextResponse.json({ error: session.error.message }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
