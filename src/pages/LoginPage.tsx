
import AppHeader from "@/components/Layout/AppHeader";
import LoginForm from "@/components/AuthComponents/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className="flex-grow flex items-center justify-center container mx-auto px-4 py-8">
        <LoginForm />
      </main>
    </div>
  );
};

export default LoginPage;
