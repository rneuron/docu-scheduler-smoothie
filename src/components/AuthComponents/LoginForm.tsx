
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
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo user shortcuts
    if (userType === "patient" && !email) {
      setEmail("alex@example.com");
      setPassword("password123");
    } else if (userType === "doctor" && !email) {
      setEmail("jane.smith@example.com");
      setPassword("password123");
    }
    
    const user = login(email, password);
    
    if (user) {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      });
      
      if (user.userType === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/patient-dashboard");
      }
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. For demo, use the sample accounts.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Sign In</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder={userType === "patient" ? "alex@example.com" : "jane.smith@example.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="For demo, any password works"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <Button variant="link" className="p-0" onClick={() => navigate("/register")}>
            Sign Up
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground text-center p-2 border border-dashed rounded">
          <strong>Demo Accounts:</strong><br/>
          Patient: alex@example.com<br/>
          Doctor: jane.smith@example.com<br/>
          (Password is optional for demo)
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
