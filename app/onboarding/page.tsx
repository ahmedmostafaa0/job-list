import OnboardingForm from "@/components/forms/onboarding/OnboardingForm";
import React from "react";
import { prisma } from '@/lib/prisma';
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/requireUser";

const checkOnboardingCompleted = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      onboardingCompleted: true
    }
  })
  if(user?.onboardingCompleted === true){
    return redirect('/')
  }
  return user
}

const Onboarding = async () => {
  const session = await requireUser()
  await checkOnboardingCompleted(session.id as string)
  return <div className="min-h-screen flex flex-col justify-center items-center py-10">
    <OnboardingForm />
  </div>;
};

export default Onboarding;
