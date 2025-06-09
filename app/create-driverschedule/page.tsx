import DriverScheduleForm from "@/components/DriverScheduleForm";
import Head from "next/head";

const CreateTripPage = () => {
  return (
    <div>
      <Head>
        <title>Create Schedule</title>
      </Head>
      <DriverScheduleForm
        driverEndpoint="/api/driver"
        circulationEndpoint="/api/circulationTemplate"
        tramStopEndpoint="/api/tramstop"
        endpoint="/api/driverSchedule"
      />
    </div>
  );
};

export default CreateTripPage;
