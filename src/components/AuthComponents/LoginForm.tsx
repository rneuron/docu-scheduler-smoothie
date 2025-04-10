
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { login } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"patient" | "doctor">("patient");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Demo user shortcuts
      if (userType === "patient" && !email) {
        setEmail("alex@example.com");
        setPassword("password123");
      } else if (userType === "doctor" && !email) {
        setEmail("jane.smith@example.com");
        setPassword("password123");
      }
      
      const user = await login(email, password);
      
      if (user) {
        toast({
          title: "Inicio de Sesión Exitoso",
          description: `¡Bienvenido de nuevo, ${user.name}!`,
        });
        
        if (user.userType === "doctor") {
          navigate("/doctor-dashboard");
        } else {
          navigate("/patient-dashboard");
        }
      } else {
        toast({
          title: "Inicio de Sesión Fallido",
          description: "Correo o contraseña inválidos. Para la demostración, utilice las cuentas de ejemplo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al iniciar sesión. Por favor intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
        <CardDescription className="text-center">
          Ingrese sus credenciales para acceder a su cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="patient" className="w-full mb-6" onValueChange={(v) => setUserType(v as "patient" | "doctor")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patient">Paciente</TabsTrigger>
            <TabsTrigger value="doctor">Médico</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder={userType === "patient" ? "alex@example.com" : "jane.smith@example.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-muted-foreground">
          ¿No tiene una cuenta?{" "}
          <Button variant="link" className="p-0" onClick={() => navigate("/register")}>
            Registrarse
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground text-center p-2 border border-dashed rounded">
          <strong>Cuentas de Demostración:</strong><br/>
          Paciente: alex@example.com<br/>
          Médico: jane.smith@example.com<br/>
          (Contraseña: password123)
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
