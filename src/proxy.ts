import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req:NextRequest){
    const {pathname} = req.nextUrl

    const publicRoute = ['/login','/register','/api/auth','/favicon.ico','/_next']

    if(publicRoute.some((path)=>pathname.startsWith(path))){
        return NextResponse.next()
    }

    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    // console.log("token", token)
    if(!token){
        const loginUrl = new URL('/login', req.url)
        loginUrl.searchParams.set('callbackUrl',req.url);
        return NextResponse.redirect(loginUrl)

    }
    const role = token.role
    if(pathname.startsWith('/user') && role!=='user'){
      NextResponse.redirect(new URL('/unauthorized',req.url))
    }
    if(pathname.startsWith('/admin') && role!=='admin'){
      NextResponse.redirect(new URL('/unauthorized',req.url))
    }
    if(pathname.startsWith('/deliveryboy') && role!=='deliveryboy'){
      NextResponse.redirect(new URL('/unauthorized',req.url))
    }
     return NextResponse.next();
}
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
}