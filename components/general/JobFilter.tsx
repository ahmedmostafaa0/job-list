'use client'

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { countryList } from "@/lib/countryList";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const jobTypes = ["full-time", "part-time", "contract", "internship"]

const JobFilter = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const createQueryString = useCallback((name:string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if(value){
      params.set(name, value)
    }else{
      params.delete(name)
    }
    return params.toString()
  }, [searchParams])

  const currentJobTypes = searchParams.get('jobTypes')?.split(',') || []
  const currentLocation = searchParams.get('location') || ''
  


  const handleJobTypesChange = (type: string, checked: boolean) => {

    const current = new Set(currentJobTypes)
    if(checked){
      current.add(type)
    }else{
      current.delete(type)
    }

    const value = Array.from(current).join(',')

    router.push(`?${createQueryString('jobTypes', value)}`)
  }

  const handleLocationChange = (location: string) => {
    router.push(`?${createQueryString('location', location)}`)
  }

  const clearAllFilters = () =>{
    router.push('/')
  }
  return (
    <Card className="col-span-1 h-fit">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-semibold">Filter</CardTitle>
          <Button
            onClick={clearAllFilters}
            variant="destructive"
            size="sm"
            className="h-8"
          >
            <span className="mr-2">Clear all</span>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Job Type</Label>
          <div className="grid grid-cols-2 gap-4">
            {jobTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={currentJobTypes.includes(type)}
                  onCheckedChange={(checked) => {
                    handleJobTypesChange(type, checked as boolean)
                  }}
                />
                <Label
                  htmlFor={type}
                  className="text-sm font-medium"
                >
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Location</Label>
          <Select value={currentLocation} onValueChange={handleLocationChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
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
                  <SelectItem value={country.name} key={country.name}>
                    <span>{country.flagEmoji}</span>
                    <span className="pl-2">{country.name}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobFilter;
