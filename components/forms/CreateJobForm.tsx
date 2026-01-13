"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema } from "@/lib/schemas";
import { countryList } from "@/lib/countryList";
import SalaryRangeSelector from "../general/SalaryRangeSelector";
import JobDescriptionEditor from "../richTextEditor/JobDescriptionEditor";
import BenefitsSelector from "../general/BenefitsSelector";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";
import {JobListingDuration} from "../general/JobListingDurationSelector";
import { useState } from "react";
import { createJob } from "@/lib/actions";

interface iAppProps{
   companyName: string;
    companyLocation: string;
    companyWebsite: string;
    companyAbout: string;
    companyLogo: string;
    companyXAccount: string | null;
}

export function CreateJobForm({companyAbout, companyName, companyLocation, companyWebsite, companyLogo, companyXAccount} : iAppProps) {
  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      benefits: [],
      companyDescription: companyAbout,
      companyLocation: companyLocation,
      companyName: companyName,
      companyWebsite: companyWebsite,
      companyXAccount: companyXAccount || '',
      companyLogo: companyLogo,
      employmentType: "",
      jobDescription: "",
      jobTitle: "",
      location: "",
      salaryFrom: 0,
      salaryTo: 0,
      listingDuration: 30,
    },
  });

  const [pending, setPending] = useState(false)
  async function onSubmit(values: z.infer<typeof jobSchema>) {
    try {
      setPending(true);
      await createJob(values);
    } catch (error){
      if(error instanceof Error && error.message !== 'NEXT_REDIRECT'){
        console.log('Something went wrong')
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="col-span-1 lg:col-span-2  flex flex-col gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Job Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full overflow-hidden">
                          <SelectValue placeholder="Select Employment Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Employment Type</SelectLabel>
                          <SelectItem value="full-time">Full Time</SelectItem>
                          <SelectItem value="part-time">Part Time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full overflow-hidden'>
                          <SelectValue placeholder="Select Location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Worldwide</SelectLabel>
                          <SelectItem value="worldwide">
                            <span>🌍</span>
                            <span className="pl-2">Worldwide / Remote</span>
                          </SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Location</SelectLabel>
                          {countryList.map((country) => (
                            <SelectItem value={country.name} key={country.code}>
                              <span>{country.flagEmoji}</span>
                              <span className="pl-2">{country.name}</span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Salary Range</FormLabel>
                <FormControl>
                  <SalaryRangeSelector control={form.control} />
                </FormControl>
              </FormItem>
            </div>

            <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <JobDescriptionEditor field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="benefits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Benefits</FormLabel>
                    <FormControl>
                      <BenefitsSelector field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Company Information</CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Company Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='companyLocation'
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Company Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full overflow-hidden">
                          <SelectValue placeholder='Select Location' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Worldwide</SelectLabel>
                          <SelectItem value="worldwide">
                            <span>🌍</span>
                            <span className="pl-2">Worldwide / Remote</span>
                          </SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Location</SelectLabel>
                          {countryList.map((country) => (
                            <SelectItem value={country.name} key={country.code}>
                              <span>{country.flagEmoji}</span>
                              <span className="pl-2">{country.name}</span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="companyWebsite"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Company Website</FormLabel>
                    <FormControl>
                      <Input placeholder="Company Website" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                control={form.control}
                name="companyXAccount"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Company X Account</FormLabel>
                    <FormControl>
                      <Input placeholder="Company X Account" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
                control={form.control}
                name="companyDescription"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Company Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Company Description" className="resize-none min-h-30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
                control={form.control}
                name="companyLogo"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Company Logo</FormLabel>
                    <FormControl>
                {field.value ? (
                  <div className="relative w-fit">
                    <Image src={field.value} alt='Company Logo' width={100} height={100} />
                    <Button type='button' variant='destructive' className="absolute -top-2 -right-2" onClick={() => {field.onChange('')}}>
                      <XIcon className="size-4"  />
                    </Button>
                  </div>
                ) : (
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      field.onChange(res[0].ufsUrl);
                    }}
                    onUploadError={(error) => alert(error.message)}
                    className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground border-primary"
                  />
                )}
              </FormControl>
              <FormMessage />
                  </FormItem>
                )}
              />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Job Listing Duration</CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="listingDuration"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <JobListingDuration field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Button type='submit' className="w-full cursor-pointer" disabled={pending}>
          {pending ? 'Submitting...': 'Post Job'}
        </Button>
      </form>
    </Form>
  );
}
