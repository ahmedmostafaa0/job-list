import EditJobForm from "@/components/forms/EditJobForm";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { notFound } from "next/navigation";

const getData = async (jobId: string, userId: string) => {
    const data = await prisma.jobPost.findUnique({
        where: {
            id: jobId,
            userId
        },
        select: {
            benifits: true,
            id: true, 
            jobDescription: true,
            jobTitle: true,
            salaryFrom: true,
            salaryTo: true,
            location: true,
            employmentType: true,
            listingDuration: true,
            company: {
                select: {
                    name: true,
                    about: true,
                    location: true,
                    xAccount:true,
                    logo: true,
                    website: true
                }
            }

        }
    })

    if(!data){
        return notFound()
    }
    return data
}

type Params = Promise<{jobId: string}>

const EditJob = async ({params}: {params: Params}) => {
    const {jobId} = await params
    const user = await requireUser()
    const data = await getData(jobId, user.id as string)
  return <EditJobForm jobPost={data} />;
};

export default EditJob;
