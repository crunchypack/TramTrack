import Head from "next/head";
import TripForm from "../../components/TripForm";

const tripFields = [
  {
    name: "tramline",
    label: "TramLine",
    type: "select",
  },
  { name: "startTime", label: "Start Time", type: "datetime-local" },
  { name: "endTime", label: "End Time", type: "datetime-local" },
];

const CreateTripPage = () => {
  return (
    <div>
      <Head>
        <title>Create Trip</title>
      </Head>
      <TripForm fields={tripFields} endpoint="/api/trip/new" />
    </div>
  );
};

export default CreateTripPage;
