export type LeadSubmission = {
  form: "find-your-path" | "contact-form" | "study-italy-free";
  submittedAt: string;
  sourcePath: string;
  pageUrl: string;
  referrer: string;
  userAgent: string;
  name: string;
  phone: string;
  email?: string;
  degree?: string;
  countries?: string[];
  intakes?: string[];
  levels?: string[];
  streams?: string[];
  tests?: string[];
  budget?: string;
};

const getSubmissionEndpoint = () => {
  const endpoint = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_WEB_APP_URL as string | undefined;
  return endpoint?.trim() || "";
};

export const submitLeadSubmission = async (submission: LeadSubmission) => {
  const endpoint = getSubmissionEndpoint();

  if (!endpoint) {
    throw new Error("Missing VITE_GOOGLE_APPS_SCRIPT_WEB_APP_URL");
  }

  const payload = new URLSearchParams({
    payload: JSON.stringify(submission),
  });

  const response = await fetch(endpoint, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: payload.toString(),
  });

  return response;
};
