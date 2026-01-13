"use server";

import { z } from "zod";
import { companySchema, jobSchema, jobSeekerSchema } from "./schemas";
import { requireUser } from "./requireUser";
import { prisma } from "./prisma";
import { redirect } from "next/navigation";
import arcjet, { detectBot, shield } from "./arcjet";
import { request } from "@arcjet/next";
import { stripe } from "./stripe";
import { jobListingDurationPricing } from "./jobListingDurationPricing";
import { inngest } from "./inngest/client";
import { revalidatePath } from "next/cache";

const aj = arcjet
  .withRule(
    shield({
      mode: "LIVE",
    })
  )
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    })
  );

export const createCompany = async (data: z.infer<typeof companySchema>) => {
  const session = await requireUser();

  const req = await request();
  const decission = await aj.protect(req);
  if (decission.isDenied()) {
    throw new Error("Forbidden");
  }

  const validateData = companySchema.parse(data);

  await prisma.user.update({
    where: {
      id: session.id as string,
    },
    data: {
      onboardingCompleted: true,
      userType: "COMPANY",
      company: {
        create: {
          ...validateData,
        },
      },
    },
  });
  return redirect("/");
};

export const createJobSeeker = async (
  data: z.infer<typeof jobSeekerSchema>
) => {
  const session = await requireUser();

  const req = await request();
  const decission = await aj.protect(req);
  if (decission.isDenied()) {
    throw new Error("Forbidden");
  }

  const validateData = jobSeekerSchema.parse(data);

  await prisma.user.update({
    where: {
      id: session.id as string,
    },
    data: {
      onboardingCompleted: true,
      userType: "JOB_SEEKER",
      jobSeeker: {
        create: {
          ...validateData,
        },
      },
    },
  });
  return redirect("/");
};

export const createJob = async (data: z.infer<typeof jobSchema>) => {
  const user = await requireUser();
  const req = await request();
  const decision = await aj.protect(req);
  if (decision.isDenied()) throw new Error("Forbidden");

  const validateData = jobSchema.parse(data);

  const company = await prisma.company.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      user: {
        select: {
          stripeCustomerId: true,
        },
      },
    },
  });

  if (!company?.id) {
    return redirect("/");
  }

  let stripeCustomerId = company.user.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      name: user.name as string,
      email: user.email as string,
    });

    stripeCustomerId = customer.id;

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        stripeCustomerId: customer.id,
      },
    });
  }

  const jobPost = await prisma.jobPost.create({
    data: {
      jobDescription: validateData.jobDescription,
      jobTitle: validateData.jobTitle,
      location: validateData.location,
      employmentType: validateData.employmentType,
      listingDuration: validateData.listingDuration,
      salaryFrom: validateData.salaryFrom,
      salaryTo: validateData.salaryTo,
      benifits: validateData.benefits,
      companyId: company.id,
      userId: user.id as string,

    },
    select: {
        id: true
    }
  });

  const pricingTier = jobListingDurationPricing.find(
    (tier) => tier.days === validateData.listingDuration
  );

  if(!pricingTier) throw new Error('Invalid listed duration selected');

  await inngest.send({
    name: 'job/created',
    data: {
      jobId: jobPost.id,
      expirationDays: validateData.listingDuration
    }
  })

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer: stripeCustomerId,
    line_items: [
        {
            quantity: 1,
            price_data: {
                currency: 'usd',
                unit_amount: pricingTier.price * 100,
                product_data: {
                    name: `Job Posting - ${pricingTier.days} Days`,
                    description: pricingTier.description,
                    images: ['https://cgmfaeimyr.ufs.sh/f/q7zThJ5ClET120ynilVJnkdCzeUOgVWIXH36jGYrFxBvAZTP']
                }
            }
        }
    ],
    success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
    metadata: {
        jobId: jobPost.id
    },
    payment_method_types: ['card']
  })

  return redirect(session.url as string);
};

export const saveJobPost = async (jobId: string) => {
  const user = await requireUser()
  const req = await request()
  const decision = await aj.protect(req)
  if(decision.isDenied()){
    throw new Error('forbidden')
  }

  await prisma.savedJobPost.create({
    data: {
      jobPostId: jobId, 
      userId: user.id as string
    }
  })
  revalidatePath(`/job/${jobId}`)
}

export const unSaveJobPost = async (savedJobPostId: string) => {
  const user = await requireUser()
  const req = await request()
  const decision = await aj.protect(req)
  if(decision.isDenied()){
    throw new Error('forbidden')
  }

  const savedJob = await prisma.savedJobPost.delete({
    where: {
      id: savedJobPostId, 
      userId: user.id as string
    },
    select: {
      jobPostId: true
    }
  })
  revalidatePath(`/job/${savedJob.jobPostId}`)
}

export const editJob = async (jobId: string, data: z.infer<typeof jobSchema>) => {
  const user = await requireUser()
  const req = await request()
  const decission = await aj.protect(req)
    if (decission.isDenied()) {
    throw new Error("Forbidden");
  }
  const validateData = jobSchema.parse(data)
  await prisma.jobPost.update({
    where: {
      id: jobId,
      company: {
        userId: user.id
      }
    },
    data: {
      benifits: validateData.benefits,
      employmentType: validateData.employmentType,
      jobDescription: validateData.jobDescription,
      jobTitle: validateData.jobTitle,
      salaryFrom: validateData.salaryFrom,
      salaryTo: validateData.salaryTo,
      location: validateData.location
    }
  })
  redirect('/my-jobs')
}

export const deleteJob = async (jobId: string) => {

  const user = await requireUser()
  const req = await request()
  const decission = await aj.protect(req)
    if (decission.isDenied()) {
    throw new Error("Forbidden");
  }
  await prisma.jobPost.delete({
    where: {
      id: jobId,
      company: {
        userId: user.id
      }
    }
  })
  await inngest.send({
    name: 'job/cancel.expiration',
    data: {
      jobId: jobId
    }
  })
  return redirect('/my-jobs')
}

export const applyJobPost = async (applyJobPostId: string) => {
  const user = await requireUser()
  const req = await request()
  const decision = await aj.protect(req)
  if(decision.isDenied()){
    throw new Error('forbidden')
  }

  await prisma.appliedJobPost.create({
    data: {
      jobPostId: applyJobPostId,
      userId: user.id as string
    }
  })
  revalidatePath(`/`)
}
