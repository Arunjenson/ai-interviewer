import dayjs from 'dayjs'
import { CalendarHeart } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import { getRandomInterviewCover } from '@/lib/utils';
import DisplayTechIcons from './display-tech-icons';

const InterviewCard = ({
    role,type,interviewId,userId,techstack,createdAt
}:InterviewCardProps) => {
    const feedback = null as Feedback | null
    const normalizedType = /mix/gi.test(type) ? 'Mixed': type;
    const formatedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY')
  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
        <div className="card-interview">
            <div className="">
              <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
                <p className='badge-text'>
                    {normalizedType}
                </p>
            </div>
            <Image src={getRandomInterviewCover()} alt="cover" width={90} className="rounded-full object-fit size-[90px]" height={90}/>
            <h3 className='mt-5 capitalize'>
                {role} Interview
            </h3>
            <div className="flex flex-row gap-5 mt-3">
                <div className="flex flex-row gap-2">
                    <CalendarHeart />
                    <p>{formatedDate}</p>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <Image src="/star.svg" alt="star" width={22} height={22}/>
                    <p>{feedback?.totalScore || '---'}/100</p>
                </div>
            </div>
            <p className='line-clamp-2 mt-5'>
                {feedback?.finalAssessment || "You haven't taken this interview yet"}
            </p>

                        </div>
            <div className="flex flex-row justify-between">
               <DisplayTechIcons techstack={techstack}  />
                <Button className='btn-primary'>
                    <Link href={feedback ? `/interview/${interviewId}/feedback` : `/interview/${interviewId}`}>
                        {feedback ? 'View Feedback' : 'Take Interview'}
                    </Link>
                </Button>
            </div>
        </div>
    </div>
  )
}

export default InterviewCard