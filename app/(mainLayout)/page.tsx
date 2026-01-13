import JobFilter from "@/components/general/JobFilter";
import JobListings from "@/components/general/JobListings";
import JobListingsLoading from "@/components/general/JobListingsLoading";
import { Suspense } from "react";

type SearchParams = {
  searchParams: Promise<{
    page?: string,
    jobTypes?: string,
    location?: string
  }>
}

export default async function Home({searchParams}: SearchParams) {
  const {page, jobTypes, location} = await searchParams
  const currentPage = Number(page) || 1
  const currentJobTypes = jobTypes?.split(',') || []
  const currentLocation = location || ''

  const filterKey = `page=${currentPage};jobTypes=${currentJobTypes};location=${currentLocation}`
  return (
    <div className="grid grid-cols-3 gap-8">
      <JobFilter />
      <div className="col-span-2 flex flex-col gap-6">
        <Suspense fallback={<JobListingsLoading />} key={filterKey}>
          <JobListings currentPage={currentPage} jobTypes={currentJobTypes} location={currentLocation} />
        </Suspense>
      </div>
    </div>
  );
}
