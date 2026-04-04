import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from "next/server";
import AuthService from "./services/AuthService";

export async function proxy(request: NextRequest) {
  console.log(`[PROXY] - ${request.url}`);
  const { pathname } = request.nextUrl;

  // Lógica de auth: só roda em /panel e /auth
  if (!pathname.startsWith("/panel") && !pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  const cookieStore = await cookies();

  // Rotas públicas — sempre permitidas
  if (pathname.startsWith("/auth/signup") || pathname.startsWith("/auth/forgot-password")) {
    return NextResponse.next();
  }

  // verify-account limpa o cookie e permite acesso
  if (pathname.startsWith("/auth/verify-account")) {
    cookieStore.delete("systatus_token");
    return NextResponse.next();
  }

  // Sem token: protege /panel
  if (!cookieStore.has("systatus_token")) {
    if (pathname.startsWith("/panel")) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
    return NextResponse.next();
  }

  // Com token: valida antes de qualquer redirect
  try {
    const response = await AuthService.verifyToken(cookieStore.get("systatus_token")!.value);

    if (!response.data.verified) {
      return NextResponse.redirect(new URL(`/auth/verify-account?email=${response.data.email}`, request.url));
    }

    if (pathname.startsWith("/auth/signin")) {
      return NextResponse.redirect(new URL("/panel", request.url));
    }
  } catch (error: any) {
    console.log(`[PROXY] - Token error ${error.message}`);

    if (error.data?.needVerifyFlow == true) {
      return NextResponse.redirect(new URL(`/auth/verify-account?authFlowId=${error.data.authFlowId}`, request.url));
    }

    // Só invalida o token em erros de autenticação, não em falhas de infra
    if ([401, 403].includes(error.status)) {
      cookieStore.delete("systatus_token");
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    // API fora do ar ou 5xx: deixa passar sem deslogar
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};