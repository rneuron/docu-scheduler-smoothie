
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Doctor } from "@/types";

interface ProfileEditorProps {
  doctor: Doctor;
  open: boolean;
  onClose: () => void;
  onUpdate: (updatedDoctor: Doctor) => void;
}

const ProfileEditor = ({ doctor, open, onClose, onUpdate }: ProfileEditorProps) => {
  const [name, setName] = useState(doctor.name);
  const [specialty, setSpecialty] = useState(doctor.specialty);
  const [profileImage, setProfileImage] = useState(doctor.profileImage || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Create updated doctor object
      const updatedDoctor: Doctor = {
        ...doctor,
        name,
        specialty,
        profileImage
      };
      
      // Call the onUpdate function with the updated doctor
      onUpdate(updatedDoctor);
      
      toast({
        title: "Perfil actualizado",
        description: "Su información de perfil ha sido actualizada exitosamente.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil. Por favor intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileImage} alt={name} />
              <AvatarFallback className="bg-medical-200 text-medical-800 text-xl">
                {name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="profileImage">URL de imagen de perfil</Label>
              <Input
                id="profileImage"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="specialty">Especialidad</Label>
            <Input
              id="specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              required
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditor;
