import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { createSupabaseServerClient } from '@/lib/supabase/server';

/** 방문자 조회 */
export const GET = async () => {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('visitors')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};

export const POST = async () => {
  const supabase = await createSupabaseServerClient();
  const cookieStore = await cookies();
  const existingVisitorKey = cookieStore.get('visitor_key')?.value ?? null;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  const visitorKey = user?.id ? null : (existingVisitorKey ?? crypto.randomUUID());

  const { data, error } = await supabase.rpc('track_visitor', {
    p_visitor_key: visitorKey,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const response = NextResponse.json(data);

  if (!user?.id && !existingVisitorKey && visitorKey) {
    response.cookies.set('visitor_key', visitorKey, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  return response;
};
