import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";


export async function middleware(
  request: NextRequest
) {


  let response =
    NextResponse.next({
      request,
    });



  const supabase =
    createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {

        cookies: {

          getAll() {
            return request.cookies.getAll();
          },


          setAll(cookies) {

            cookies.forEach(
              ({name,value,options})=>{

                request.cookies.set({
                  name,
                  value,
                });


                response.cookies.set({
                  name,
                  value,
                  ...options,
                });

              }
            );

          },

        },

      }
    );



  const {
    data:{
      user
    }
  } =
    await supabase.auth.getUser();



  const protectedRoutes=[

    "/dashboard",
    "/campaigns",
    "/list-space",
    "/messages",
    "/settings",

  ];



  const adminRoutes=[

    "/admin"

  ];



  const path =
    request.nextUrl.pathname;



  const isProtected =
    protectedRoutes.some(
      route =>
      path.startsWith(route)
    );



  const isAdmin =
    adminRoutes.some(
      route =>
      path.startsWith(route)
    );



  if(isProtected && !user){

    return NextResponse.redirect(
      new URL(
        "/auth/login",
        request.url
      )
    );

  }



  if(isAdmin && !user){

    return NextResponse.redirect(
      new URL(
        "/auth/login",
        request.url
      )
    );

  }



  return response;

}



export const config={

 matcher:[
  "/((?!_next/static|_next/image|favicon.ico).*)"
 ]

};