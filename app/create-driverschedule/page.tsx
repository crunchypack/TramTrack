import DriverScheduleForm from "@/components/DriverScheduleForm";
import Head from "next/head";

const CreateTripPage = () => {
  // Create the object the form is looking for
  const apiEndpoints = {
    drivers: "/api/driver",
    circulations: "/api/circulationTemplate",
    tramstop: "/api/tramstop",
    save: "/api/driverSchedule"
  };

  return (
    <div>
      <Head>
        <title>Create Schedule</title>
      </Head>
      <DriverScheduleForm endpoints={apiEndpoints} />
    </div>
  );
};

export default CreateTripPage;