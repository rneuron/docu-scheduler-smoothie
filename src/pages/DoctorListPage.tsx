
import AppHeader from "@/components/Layout/AppHeader";
import DoctorDirectory from "@/components/DoctorComponents/DoctorDirectory";

const DoctorListPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Directorio de Médicos</h1>
          <p className="text-gray-600 mt-2">
            Explore nuestro directorio de profesionales médicos y reserve una cita
          </p>
        </div>
        
        <DoctorDirectory />
      </main>
    </div>
  );
};

export default DoctorListPage;
