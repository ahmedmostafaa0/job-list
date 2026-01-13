/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Slider } from "../ui/slider";
import { Control, useController } from "react-hook-form";
import { formatCurrency } from "@/lib/formatCurrency";

interface iAppProps {
  control: Control<any>;
  minSalary?: number;
  maxSalary?: number;
  step?: number;
}

const SalaryRangeSelector = ({
  control,
  minSalary = 30000,
  maxSalary = 200000,
  step = 1000,
}: iAppProps) => {
  const { field: fromField } = useController({
    name: "salaryFrom",
    control,
  });

  const { field: toField } = useController({
    name: "salaryTo",
    control,
  });

  const defaultFrom = fromField.value || minSalary;
  const defaultTo = toField.value || maxSalary / 2;

  const [range, setRange] = useState<[number, number]>([
    defaultFrom,
    defaultTo,
  ]);

  useEffect(() => {
    fromField.onChange(defaultFrom);
    toField.onChange(defaultTo);
  }, [fromField, toField, defaultFrom, defaultTo]);

  const handleRangeChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setRange(newRange);
    fromField.onChange(newRange[0]);
    toField.onChange(newRange[1]);
  };

  return (
    <div>
      <Slider
        value={range}
        onValueChange={handleRangeChange}
        min={minSalary}
        max={maxSalary}
        step={step}
      />

      <div className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          {formatCurrency(range[0])}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatCurrency(range[1])}
        </p>
      </div>
    </div>
  );
};

export default SalaryRangeSelector;
