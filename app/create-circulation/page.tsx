import CirculationForm from "@/components/CirculationForm";
import Head from "next/head";

const CreateTripPage = () => {
  return (
    <div>
      <Head>
        <title>Create circulation</title>
      </Head>
      <CirculationForm
        tripEndpoint="/api/trip"
        endpoint="/api/circulation/new"
      />
    </div>
  );
};

export default CreateTripPage;
