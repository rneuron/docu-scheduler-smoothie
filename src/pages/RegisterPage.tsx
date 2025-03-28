
import AppHeader from "@/components/Layout/AppHeader";
import RegisterForm from "@/components/AuthComponents/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className="flex-grow flex items-center justify-center container mx-auto px-4 py-8">
        <RegisterForm />
      </main>
    </div>
  );
};

export default RegisterPage;
