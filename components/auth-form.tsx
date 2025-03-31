'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import FormField from './FormField'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/client'
import { signin, signup } from '@/lib/actions/auth.action' 


const authFormSchema = (type: FormType)=>{
  return z.object({
    name: type === 'sign-up' ? z.string().min(2).max(50) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  })
}


export const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter()

const formSchema = authFormSchema(type)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {

      if(type === 'sign-up') {
        const {name,email,password} = values;
        const userCredentials = await createUserWithEmailAndPassword(auth,email,password)
        const result =await signup({
          uid: userCredentials.user.uid,
          name:name!,
          email:email,
          password:password
        })
        if(!result?.success){
									toast.error(result?.message);
                  return;
								}
        toast.success('Account created successfully.Please sign in')
        router.push('/sign-in')
						} else {
              const {email,password} = values 
              const userCredentials = await signInWithEmailAndPassword(auth,email,password)
              const idToken = await userCredentials.user.getIdToken()
              if(!idToken){
                  toast.error('Sign in failed ')
                  return;
              }
              await signin({
                email,
                idToken,
              })
              console.log('signin', values)
                toast.success('Signed in successfully')
        router.push('/')
						}
      console.log(values)
    } catch(e) {
      console.error(e)
      toast.error(`There was an error ${e}`)
    }
  }
  const isSignIn = type === 'sign-in'
  return (
    <div className="card-border lg:min-w-[566px] ">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt='logo' width={38} height={32} />
          <h2 className="text-primary-100">AI Interviewer</h2>
        </div>
        <h3>Ace Interviews with AI powered Mock Interviews</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
             {!isSignIn && (
              <FormField control={form.control} name="name" label="Name" placeholder='Your Name'/>
            )}
              <FormField control={form.control} name="email" label="Email" placeholder='Your Email address' type='email'/>
              <FormField control={form.control} name="password" label="Password" placeholder='Your Password' type='password'/>
            <Button type="submit" className='btn'>{isSignIn ? 'Sign in' : 'Create an account'}</Button>
          </form>
        </Form>
        <p className='text-center'>{isSignIn ? "No account yet?" : "have an account aleady?"}
          <Link href={isSignIn ? '/sign-up' : '/sign-in'} className='font-bold text-user-primary ml-1'>{isSignIn ? 'Sign Up' : 'Sign in'}</Link>
        </p>
      </div>
    </div>
  )
}

