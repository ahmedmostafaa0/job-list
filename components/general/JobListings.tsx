import { prisma } from "@/lib/prisma";
import { EmptyState } from "./EmptyState";
import JobCard from "./JobCard";
import { MainPagination } from "./MainPagination";
import { JobPostStatus } from "@/lib/generated/prisma/enums";

const getJobs = async ({page, pageSize = 2, jobTypes, location}: {page: number, pageSize: number, jobTypes: string[], location: string}) => {
  const skip = (page - 1) * pageSize;
  const where = {
    status: JobPostStatus.ACTIVE,
    ...(jobTypes.length > 0 && {
      employmentType: {
        in: jobTypes
      }
    }),
    ...(location && location !== 'worldwide' && {
      location: location
    })
  }
  const [jobs, totalCount] = await Promise.all([
    prisma.jobPost.findMany({
      where: where,
      take: pageSize,
      skip: skip,
      select: {
        jobTitle: true,
        id: true,
        salaryFrom: true,
        salaryTo: true,
        employmentType: true,
        location: true,
        createdAt: true,
        company: {
          select: {
            name: true,
            logo: true,
            location: true,
            about: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.jobPost.count({
      where: {
        status: "ACTIVE",
      },
    }),
  ]);
  return {
    jobs,
    totalPages: Math.ceil(totalCount / pageSize),
  };
};

const JobListings = async ({currentPage, jobTypes, location}: {currentPage: number, jobTypes: string[], location: string}) => {
  const {jobs, totalPages} = await getJobs({page: currentPage, pageSize: 2, jobTypes: jobTypes, location});
  return (
    <>
      {jobs.length > 0 ? (
        <div className="flex flex-col gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No jobs found"
          description="Try searching for a different job title or location."
          buttonText="Clear all filters"
          href="/"
        />
      )}
      <div>
        <MainPagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </>
  );
};

export default JobListings;
