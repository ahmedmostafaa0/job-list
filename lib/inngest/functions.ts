import { inngest } from "@/lib/inngest/client";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);
export const handleJobExpiration = inngest.createFunction(
  { id: "job-expiration", cancelOn: [
    {
      event: 'job/cancel.expiration',
      if: 'async.data.jobId == event.data.jobId'
    }
  ] },
  { event: "job/created" },
  async ({ event, step }) => {
    const { jobId, expirationDays } = event.data;
    await step.sleep("wait-for-expiration", `${expirationDays}d`);
    await step.run("update-job-status", async () => {
      await prisma.jobPost.update({
        where: {
          id: jobId,
        },
        data: {
          status: "EXPIRED",
        },
      });
    });
    return { jobId, message: "Job marked as expired" };
  }
);

export const sendPeriodicJobListings = inngest.createFunction(
  { id: "send-job-listing" },
  { event: "jobseeker/created" },
  async ({ event, step }) => {
    const { userId, email, day = 0 } = event.data;

    const recentJobs = await step.run("fetch-jobs", async () => {
      return prisma.jobPost.findMany({
        where: { status: "ACTIVE" },
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          company: {
            select: {
              name: true,
            },
          },
        },
      });
    });

    if (recentJobs.length) {
      await step.run("send-email", async () => {
        const jobListingsHTML = recentJobs
          .map(
            (job) => `
                <div style="margin-bottom:20px; padding:15px; border:1px solid #eee; border-radius:5px">
                  <h3 style="margin:0">${job.jobTitle}</h3>
                  <p style="margin: 5px 0">${job.company.name} ● ${
              job.location
            }</p>
                  <p style="margin: 5px 0">$${job.salaryFrom.toLocaleString()} - $${job.salaryTo.toLocaleString()}</p>
                </div>
              `
          )
          .join("");
        return resend.emails.send({
          from: "Job-List <onboarding@resend.dev>",
          to: ["a7med.mostafa.s3d@gmail.com"],
          subject: "Latest job opportunities",
          html: `
                  <div style="font-family:Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Latest Job opportunities</h2>
                    ${jobListingsHTML}
                    <div style="margin-top: 30px; text-align: center">
                      <a href=${process.env.NEXT_PUBLIC_URL} style="background-color:#007bff; color: white; text-decoration:none; border-radius; 5px">
                        View More Jobs
                      </a>
                    </div>
                  </div>
                `,
        });
      });
    }

    if (day < 30) {
      await step.sleep("wait-2-days", "2d");

      await step.sendEvent("trigger-next", {
        name: "jobseeker/created",
        data: {
          userId,
          email,
          day: day + 2,
        },
      });
    }

    return { userId, message: "Completed 30 days job listing notifications" };
  }
);
