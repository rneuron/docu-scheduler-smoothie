
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Shield } from "lucide-react";
import AppHeader from "@/components/Layout/AppHeader";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-medical-100 via-medical-50 to-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-medical-900 mb-6">
                Schedule Medical Appointments with Confidence
              </h1>
              <p className="text-xl text-medical-700 mb-8">
                Book appointments with specialized doctors in your area with our secure scheduling platform that protects both patients and providers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="text-base px-6"
                  onClick={() => navigate("/doctors")}
                >
                  Find a Doctor
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base px-6"
                  onClick={() => navigate("/register")}
                >
                  Sign Up Now
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-medical-100 p-4 rounded-full mb-4">
                  <Calendar className="h-10 w-10 text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Easy Scheduling</h3>
                <p className="text-gray-600">
                  Search for doctors by specialty and book available appointment slots with just a few clicks.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-medical-100 p-4 rounded-full mb-4">
                  <Clock className="h-10 w-10 text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Time Protection</h3>
                <p className="text-gray-600">
                  Our system automatically handles late arrivals, ensuring everyone's time is respected.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-medical-100 p-4 rounded-full mb-4">
                  <Shield className="h-10 w-10 text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure Payments</h3>
                <p className="text-gray-600">
                  Process appointment fees and automatic refunds with our secure PayPal integration.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-medical-600 py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join our platform today and experience hassle-free medical appointment scheduling.
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate("/register")}
            >
              Create an Account
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600 text-sm">
            <p>&copy; {new Date().getFullYear()} DocScheduler. All rights reserved.</p>
            <p className="mt-2">This is a demo application showcasing appointment scheduling functionality.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
