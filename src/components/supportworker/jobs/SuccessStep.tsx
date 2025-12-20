import React from "react";
import { CheckCircle } from "@solar-icons/react";

export const SuccessStep = React.memo(({ jobTitle }: { jobTitle: string }) => (
  <div className="py-12 text-center flex flex-col items-center justify-center h-full">
    <CheckCircle className="h-20 w-20 text-green-500 mb-6" />
    <h3 className="text-2xl font-bold text-gray-900 mb-2">
      Application Submitted!
    </h3>
    <p className="text-gray-500 max-w-xs mx-auto">
      Your application for{" "}
      <span className="font-semibold text-gray-900">{jobTitle}</span> has been
      received successfully.
    </p>
  </div>
));
