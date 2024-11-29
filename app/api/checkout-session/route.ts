import { NextResponse } from "next/server";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function GET(request: Request) {
    const item = await request.json();

    const redirectURL =
        process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : 'https://stripe-checkout-next-js-demo.vercel.app';

    const transformedItem = {
        price_data: {
            currency: 'usd',
            product_data: {
                images: [item.image],
                name: item.name,
            },
            unit_amount: item.price * 100,
        },
        description: item.description,
        quantity: item.quantity,
    };

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [transformedItem],
        mode: 'payment',
        success_url: redirectURL + '?status=success',
        cancel_url: redirectURL + '?status=cancel',
        metadata: {
            images: item.image,
        },
    });

    NextResponse.json({ id: session.id });
}