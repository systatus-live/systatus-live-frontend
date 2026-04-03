import StripeService from '@/services/StripeService';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();

  try {
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { planId } = await request.json();
    const response = await StripeService.createCheckoutSession(token, planId);

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: error.status ?? 500 });
  }
}
