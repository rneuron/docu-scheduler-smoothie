
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
                Programe Citas Médicas con Confianza
              </h1>
              <p className="text-xl text-medical-700 mb-8">
                Reserve citas con médicos especializados en su área con nuestra plataforma segura que protege tanto a pacientes como a proveedores.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="text-base px-6"
                  onClick={() => navigate("/doctors")}
                >
                  Encontrar un Médico
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base px-6"
                  onClick={() => navigate("/register")}
                >
                  Registrarse Ahora
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Cómo Funciona</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-medical-100 p-4 rounded-full mb-4">
                  <Calendar className="h-10 w-10 text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Programación Fácil</h3>
                <p className="text-gray-600">
                  Busque médicos por especialidad y reserve horarios disponibles con solo unos pocos clics.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-medical-100 p-4 rounded-full mb-4">
                  <Clock className="h-10 w-10 text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Protección del Tiempo</h3>
                <p className="text-gray-600">
                  Nuestro sistema maneja automáticamente las llegadas tardías, asegurando que el tiempo de todos sea respetado.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-medical-100 p-4 rounded-full mb-4">
                  <Shield className="h-10 w-10 text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Pagos Seguros</h3>
                <p className="text-gray-600">
                  Procese tarifas de citas y reembolsos automáticos con nuestra integración segura de PayPal.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-medical-600 py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">¿Listo para Comenzar?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Únase a nuestra plataforma hoy y experimente la programación de citas médicas sin complicaciones.
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate("/register")}
            >
              Crear una Cuenta
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600 text-sm">
            <p>&copy; {new Date().getFullYear()} DocScheduler. Todos los derechos reservados.</p>
            <p className="mt-2">Esta es una aplicación de demostración que muestra la funcionalidad de programación de citas.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
