'use client'
import Image from "next/image";
import { useState } from "react";
import Logo from '@/public/logo.png'
import { Card, CardContent } from "@/components/ui/card";
import UserTypeSelection from "./UserTypeSelection";
import CompanyForm from "./CompanyForm";
import JobSeekerForm from "./JobSeekerForm";


type userType = "company" | "jobSeeker" | null;
const OnboardingForm = () => {
    const [step, setStep] = useState<number>(1)
    const [userType, setUserType] = useState<userType>(null)

    const handleUserTypeSelect = (type: userType) => {
        setUserType(type)
        setStep(2)
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return <UserTypeSelection onSelect={handleUserTypeSelect} />
            case 2:
                return userType === 'company' ? <CompanyForm /> : <JobSeekerForm />
            default:
                return null;
        }
    }
  return <>
    <div className="flex items-center gap-3 mb-10">
        <Image src={Logo} alt="JobList Logo" width={50} height={50} />
        <h1 className="text-4xl font-bold">Job<span className="text-primary">List</span></h1>
    </div>
    <Card className="w-full max-w-lg">
        <CardContent className="p-6">{renderStep()}</CardContent>
    </Card>
  </>;
};

export default OnboardingForm;
