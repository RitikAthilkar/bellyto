import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import User from "./models/user.model"
import bcrypt from "bcryptjs"
import connectDb from "./config/db"
import { AuthError } from "next-auth";
import { Truculenta } from "next/font/google"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
        credentials:{
            email:{label:"email",type:"email"},
            password:{label:"password",type:"password"}
        },
        async authorize(credentials,request){

            await connectDb();
            const email = credentials.email
            const password = credentials.password as string

            const user =await User.findOne({email});

            const isMatch = await bcrypt.compare(password, user.password)
            if(!user){
                throw new AuthError("User Does Not Exist")
            }
            if(!isMatch){
                throw new AuthError("Incorrect Password")
            }
            return {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            }
        
        }
    }),
  Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }),
  
  ],
  callbacks:{
   async signIn({user,account}){
    if(account?.provider=='google'){
        await connectDb()
        let dbuser =await User.findOne({email:user.email})
        if(!dbuser){
            dbuser = await User.create({
                name:user.name,email:user.email,image:user.image
            })
        }
        user.id=dbuser._id.toString()
        user.role = dbuser.role
    }
    return true
   },

    jwt({token,user}){
        if(user){
            token.id=user.id,
            token.email=user.email,
            token.name = user.name,
            token.role = user.role
        }
        return token
    },
    session({session,token}) {
        if(session.user){
            session.user.id = token.id as string,
            session.user.name = token.name as string,
            session.user.email = token.email as string,
            session.user.role = token.role as string
        }
        return session
    },
  },
  pages:{
    signIn:'/login',
    error:'/login'
  },
  session:{
    strategy:"jwt",
    maxAge:30*24*60*60*1000
  },
  secret:process.env.AUTH_SECRET
})