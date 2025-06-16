import CirculationForm from "@/components/CirculationForm";
import Head from "next/head";
import React, { Suspense } from "react";
const CreateTripPage = () => {
  return (
    <div>
      <Head>
        <title>Create circulation</title>
      </Head>
      <Suspense fallback={<div>Loading...</div>}>
        <h1 className="text-2xl font-bold mb-4">Create Circulation</h1>
        <CirculationForm />
      </Suspense>
    </div>
  );
};

export default CreateTripPage;
