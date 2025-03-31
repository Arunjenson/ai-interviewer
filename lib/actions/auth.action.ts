'use server'

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7

export async function signup(params:SignUpParams){
    const {uid,email,name} = params
    try{
        const userRecord =await db.collection('users').doc(uid).get()
        if(userRecord.exists){
            return {
                success:false,
                message:"User already exists",
            }
        }
        await db.collection('users').doc(uid).set({
            name,email
        })
        return {
            success:true,
            message:"User created successfully",
        }
    }
    catch(e:any){
        console.error("error creating a user",e);
        if(e.code ==='auth/email-already-exists'){
            return{
                success:false,
                message:"Email already exists",
            }
        }
        return{
            success:false,
            message:"Error creating user",
        }
    }
}

export async function setSessionCookie(idToken:string){
    const cookieStore = await cookies()
    const sessionCookie = await auth    .createSessionCookie(idToken, { expiresIn: ONE_WEEK * 1000}) // 7 days
    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    })
}

export async function signin(params:SignInParams){
    const {email,idToken} = params
    try{
        const userRecord = await auth.getUserByEmail(email)
        if(!userRecord){
            return {
                success:false,
                message:"User not found",
            }
        }
        await setSessionCookie(idToken)
        return {
            success:true,
            message:"Signed in successfully",
        }
    }
    catch(e:any){
        console.error("error signing in",e);
        if(e.code ==='auth/wrong-password'){
            return{
                success:false,
                message:"Wrong password",
            }
        }
        return{
            success:false,
            message:"Error signing in",
        }
    }
}

export async function getCurrentUser():Promise<User | null>{
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')?.value
    if(!sessionCookie){
        return null
    }
    try{
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true)
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get()
        if(!userRecord.exists){
            return null
        }
        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User
    }
    catch(e:any){
        console.log(e)
        return null
    }
}

export async function isAuthenticated(){
    const user = await getCurrentUser()
    return !!user;
}