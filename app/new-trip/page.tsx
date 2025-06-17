import NewTripForm from "@/components/NewTripForm";

const NewTripPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">New Trip</h1>
      <NewTripForm />
    </div>
  );
};
export default NewTripPage;
