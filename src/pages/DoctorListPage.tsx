
import AppHeader from "@/components/Layout/AppHeader";
import DoctorDirectory from "@/components/DoctorComponents/DoctorDirectory";

const DoctorListPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find a Doctor</h1>
          <p className="text-gray-600 mt-2">
            Browse through our directory of medical professionals and book an appointment
          </p>
        </div>
        
        <DoctorDirectory />
      </main>
    </div>
  );
};

export default DoctorListPage;
