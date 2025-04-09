
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { specialties } from "@/data/mockData";
import { register } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<"patient" | "doctor">("patient");
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Las Contraseñas No Coinciden",
        description: "Por favor asegúrese de que sus contraseñas coincidan",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const userData = {
        name,
        email,
        userType,
        ...(userType === "doctor" && {
          specialty,
          location,
        }),
      };
      
      const user = register(userData, password);
      
      toast({
        title: "Cuenta Creada",
        description: "¡Su cuenta ha sido creada exitosamente!",
      });
      
      if (user.userType === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/patient-dashboard");
      }
    } catch (error) {
      toast({
        title: "Registro Fallido",
        description: "Hubo un problema al crear su cuenta",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Crear Una Cuenta</CardTitle>
        <CardDescription className="text-center">
          Ingrese su información para crear una cuenta
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
            <Label htmlFor="name">Nombre Completo</Label>
            <Input
              id="name"
              placeholder="Ingrese su nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="Ingrese su correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          {userType === "doctor" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidad</Label>
                <Select value={specialty} onValueChange={setSpecialty} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((spec) => (
                      <SelectItem key={spec.id} value={spec.name}>
                        {spec.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  placeholder="Ciudad, Estado"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Cree una contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirme su contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Crear Cuenta
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-muted-foreground">
          ¿Ya tiene una cuenta?{" "}
          <Button variant="link" className="p-0" onClick={() => navigate("/login")}>
            Iniciar Sesión
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
