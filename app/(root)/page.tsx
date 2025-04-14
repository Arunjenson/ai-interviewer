import InterviewCard from '@/components/interview-card'
import { Button } from '@/components/ui/button'
import { getCurrentUser, getInterviewsByUserId, getLastestInterviews } from '@/lib/actions/auth.action'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

async function page() {
  const user = await getCurrentUser();
  const [userInterviews,lastestInterviews] = await Promise.all([
    await getInterviewsByUserId(user?.id!),
    await getLastestInterviews({userId:user?.id!})
  ])
  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews = lastestInterviews?.length > 0;
  return (
    <>
    <section className='card-cta'>
      <div className="flex flex-col gap-6 max-w-lg">
        <h2>Get Interview ready with AI-Powered Practice and Feedback Report</h2>
        <p className='text-lg'>Practice coding interviews with AI-powered feedback and personalized reports. Get ready for your next interview with confidence.</p>
        <Button asChild className='btn-primary max-sm:w-full'>
          <Link href="/interview">Start an Interview</Link>
        </Button>
      </div>
      <Image src="/robot.png" alt="robot" className="max-sm:hidden" width={400} height={400}/>
    </section>
    <section className="flex flex-col gap-6 mt-8">
      <h2>Your Interviews</h2>
      <div className="interviews-section">
        {
        hasPastInterviews ? (
          userInterviews?.map((interview) => (
            <InterviewCard key={interview.id} {...interview} />
          ))
        ):(
        <p>You haven&apos;t taken any interviews yet</p>
        )
      }
      </div>
    </section>
    <section className='flex flex-col gap-6 mt-8'>
      <h2>Take an Interview</h2>
      <div className="interviews-section">
         {
        hasUpcomingInterviews ? (
          lastestInterviews?.map((interview) => (
            <InterviewCard key={interview.id} {...interview} />
          ))
        ):(
        <p>There are no interviews available</p>
        )
      }
        <Button asChild className='btn-primary max-sm:w-full'>
          <Link href="/interview">Start an Interview</Link>
        </Button>
      </div>
    </section>


    </>
  )
}

export default page