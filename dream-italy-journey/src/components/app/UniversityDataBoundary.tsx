import { Outlet } from "react-router-dom";

import { UniversityDataProvider } from "@/context/UniversityDataContext";

const UniversityDataBoundary = () => (
  <UniversityDataProvider>
    <Outlet />
  </UniversityDataProvider>
);

export default UniversityDataBoundary;
