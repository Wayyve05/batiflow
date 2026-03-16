import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export async function POST(req) {
  try {
    const body = await req.text()
    const event = JSON.parse(body)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const userId = session.client_reference_id
      if (userId) {
        await supabase.from('profiles').update({
          plan: 'pro',
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription
        }).eq('id', userId)
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object
      const customerId = subscription.customer
      await supabase.from('profiles').update({
        plan: 'trial'
      }).eq('stripe_customer_id', customerId)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
