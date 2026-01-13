import { Badge } from "@/components/ui/badge";

import { notFound } from "next/navigation";
import React from "react";

import { prisma } from "@/lib/prisma";
import { getFlagEmoji } from "@/lib/countryList";
import JsonToHtml from "@/components/general/JsonToHtml";
import { benefits } from "@/lib/benefits";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import arcjet from "@/lib/arcjet";
import { detectBot, tokenBucket } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Heart } from "lucide-react";
import { ApplyJobButton, SaveJobButton } from "@/components/general/SubmitButtons";
import { applyJobPost, saveJobPost, unSaveJobPost } from "@/lib/actions";

const aj = arcjet.withRule(
  detectBot({
    mode: "LIVE",
    allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
  })
);

const getClient = (session: boolean) => {
  if (session) {
    return aj.withRule(
      tokenBucket({
        mode: "LIVE",
        capacity: 100,
        interval: 60,
        refillRate: 30,
      })
    );
  } else {
    return aj.withRule(
      tokenBucket({
        mode: "LIVE",
        capacity: 100,
        interval: 60,
        refillRate: 10,
      })
    );
  }
};

const getJob = async (jobId: string, userId?: string) => {  
  const [jobData, savedJob, appliedJob] = await Promise.all([
    prisma.jobPost.findUnique({
      where: {
        id: jobId,
        status: "ACTIVE",
      },
      select: {
        jobTitle: true,
        jobDescription: true,

        location: true,

        employmentType: true,
        benifits: true,

        createdAt: true,
        listingDuration: true,
        company: {
          select: {
            name: true,
            logo: true,
            location: true,
            about: true,
          },
        },
      },
    }),
    userId &&
      prisma.savedJobPost.findUnique({
        where: {
          userId_jobPostId: {
            jobPostId: jobId,
            userId: userId,
          },
        },
        select: {
          id: true,
        },
      }),
      prisma.appliedJobPost.findUnique({
        where: {
          userId_jobPostId: {
            userId: userId as string,
            jobPostId: jobId
          }
        },
        select: {
          id: true
        }
      })
  ]);

  if (!jobData) {
    return notFound();
  }

  return {
    jobData,
    savedJob,
    appliedJob
  };
};

type Params = Promise<{ jobId: string }>;

const JobIdPage = async ({ params }: { params: Params }) => {
  const { jobId } = await params;
  const session = await auth();
  const req = await request();
  const decision = await getClient(!!session).protect(req, { requested: 10 });

  if (decision.isDenied()) {
    throw new Error("forbidden");
  }
  const { jobData, savedJob, appliedJob } = await getJob(jobId, session?.user?.id);
  const locationFlag = getFlagEmoji(jobData.location);

  return (
    <div className="container mx-auto py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="space-y-8 col-span-2">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{jobData.jobTitle}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-medium">{jobData.company.name}</span>

                <Badge className="rounded-full" variant="secondary">
                  {jobData.employmentType}
                </Badge>
                <span className="hidden md:inline text-muted-foreground">
                  •
                </span>
                <Badge className="rounded-full">
                  {locationFlag && <span className="mr-1">{locationFlag}</span>}
                  {jobData.location} Only
                </Badge>
              </div>
            </div>
            {session?.user ? (
              <form
                action={
                  savedJob
                    ? unSaveJobPost.bind(null, savedJob.id)
                    : saveJobPost.bind(null, jobId)
                }
              >
                <SaveJobButton savedJob={!!savedJob} />
              </form>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/login">
                  <Heart className="size-4 mr-2" />
                  Save Job
                </Link>
              </Button>
            )}
          </div>

          <section>
            <JsonToHtml json={JSON.parse(jobData.jobDescription)} />
          </section>

          <section>
            <h3 className="font-semibold mb-4">Benefits </h3>
            <div className="flex flex-wrap gap-3">
              {benefits.map((benefit) => {
                const isOffered = jobData.benifits.includes(benefit.id);
                return (
                  <Badge
                    key={benefit.id}
                    variant="default"
                    className={`text-sm px-4 py-1.5 rounded-full ${
                      !isOffered && "hidden"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {isOffered && benefit.icon}
                      {isOffered && benefit.label}
                    </span>
                  </Badge>
                );
              })}
            </div>
          </section>
        </div>
        <div className="space-y-6">
          {/* Apply Now Card */}
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Apply now</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Please let {jobData.company.name} know you found this job on
                  Job-List. This helps us grow!
                </p>
              </div>
              <form action={async () => {
                'use server'
                await applyJobPost(jobId)
              }}>
                <ApplyJobButton appliedJob={!!appliedJob} />
              </form>
            </div>
          </Card>

          {/* Job Details Card */}
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold">About the job</h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Apply before
                  </span>
                  <span className="text-sm">
                    {new Date(
                      jobData.createdAt.getTime() +
                        jobData.listingDuration * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Posted on
                  </span>
                  <span className="text-sm">
                    {jobData.createdAt.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Employment type
                  </span>
                  <span className="text-sm">{jobData.employmentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Location
                  </span>
                  <Badge variant="secondary">{jobData.location}</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Company Card */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Image
                  src={
                    jobData.company.logo ??
                    `https://avatar.vercel.sh/${jobData.company.name}`
                  }
                  alt={jobData.company.name}
                  width={48}
                  height={48}
                  className="rounded-full size-12"
                />
                <div>
                  <h3 className="font-semibold">{jobData.company.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {jobData.company.about}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobIdPage;
