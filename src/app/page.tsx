
import { auth } from "@/auth";
import EditMobileRole from "@/components/editMobileRole";
import Logout from "@/components/logout";
import Nav from "@/components/nav";
import UserHomePage from "@/components/user/userHomePage";
import AdminHomePage from "@/components/admin/adminHomePage";
import connectDb from "@/config/db";
import User from "@/models/user.model";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
export default async function Home() {
// await new Promise((resolve) => setTimeout(resolve, 300000));
  await connectDb(); 

  const session = await auth()
  // console.log(session?.user)
   if (!session?.user?.id) {
     redirect("/login");
   }
    const user = await User.findById(session?.user?.id).lean();
    if(!user){
      redirect('/login')
    }

    if (!user?.mobile || !user?.role || (!user?.mobile  && user?.role=="user")){
      if(!user?.password){
        return <EditMobileRole passwordProp={true} />;
      }else{
        return   <EditMobileRole passwordProp={false} />;
      }
       
    }
    const safeUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image || null,
      mobile: user.mobile || null,
    };
      return (
        <>
          {user?.role == "user" && (
            <>
              <Nav user={safeUser} />
              <section className="px-1 md:px-5 sm:mt-20 mt-17">
                <UserHomePage />
              </section>
            </>
          )}
          {user?.role == "admin" && (
            <>
              <AdminHomePage user={safeUser} />
            </>
          )}
        </>
      );
}
