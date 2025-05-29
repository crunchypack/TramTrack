import DriverScheduleForm from "@/components/DriverScheduleForm";
import Head from "next/head";

const CreateTripPage = () => {
  return (
    <div>
      <Head>
        <title>Create block</title>
      </Head>
      <DriverScheduleForm
        circulationEndpoint="/api/circulation"
        driverEndpoint="/api/driver"
        endpoint="/api/driverschedule/new"
      />
    </div>
  );
};

export default CreateTripPage;
