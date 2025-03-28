
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
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match",
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
        title: "Account Created",
        description: "Your account has been created successfully!",
      });
      
      if (user.userType === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/patient-dashboard");
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was a problem creating your account",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Create An Account</CardTitle>
        <CardDescription className="text-center">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="patient" className="w-full mb-6" onValueChange={(v) => setUserType(v as "patient" | "doctor")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patient">Patient</TabsTrigger>
            <TabsTrigger value="doctor">Doctor</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          {userType === "doctor" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Select value={specialty} onValueChange={setSpecialty} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a specialty" />
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
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, State"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button variant="link" className="p-0" onClick={() => navigate("/login")}>
            Sign In
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
