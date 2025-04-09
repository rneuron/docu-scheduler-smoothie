
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrentUser, logout, isDoctor, isPatient } from "@/lib/auth";
import { User } from "@/types";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Calendar, UserCircle, LogOut, Menu, X } from "lucide-react";

const AppHeader = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, [location]);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/");
  };

  const dashboardLink = isDoctor(user) 
    ? "/doctor-dashboard" 
    : "/patient-dashboard";

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-medical-600" />
            <span className="font-bold text-xl text-medical-800">DocScheduler</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-medical-600 font-medium">
              Inicio
            </Link>
            <Link to="/doctors" className="text-gray-700 hover:text-medical-600 font-medium">
              Buscar Médicos
            </Link>
            {user ? (
              <>
                <Link to={dashboardLink} className="text-gray-700 hover:text-medical-600 font-medium">
                  Panel
                </Link>
                <Link to="/appointments" className="text-gray-700 hover:text-medical-600 font-medium">
                  Mis Citas
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={isDoctor(user) ? user.profileImage : undefined} alt={user.name} />
                        <AvatarFallback className="bg-medical-100 text-medical-800">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Mi Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={() => navigate("/login")}>
                  Iniciar Sesión
                </Button>
                <Button onClick={() => navigate("/register")}>
                  Registrarse
                </Button>
              </div>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden rounded-md p-2 text-gray-500" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-3 space-y-3">
            <Link 
              to="/" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link 
              to="/doctors" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Buscar Médicos
            </Link>
            {user ? (
              <>
                <Link 
                  to={dashboardLink} 
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Panel
                </Link>
                <Link 
                  to="/appointments" 
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mis Citas
                </Link>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center px-3">
                    <div className="flex-shrink-0">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={isDoctor(user) ? user.profileImage : undefined} alt={user.name} />
                        <AvatarFallback className="bg-medical-100 text-medical-800">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{user.name}</div>
                      <div className="text-sm font-medium text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <button 
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-4 space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                >
                  Iniciar Sesión
                </Button>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    navigate("/register");
                    setIsMenuOpen(false);
                  }}
                >
                  Registrarse
                </Button>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
