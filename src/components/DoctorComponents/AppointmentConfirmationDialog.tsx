
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface AppointmentConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const AppointmentConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isChecked,
  onCheckedChange
}: AppointmentConfirmationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Confirmar Cita</DialogTitle>
        <DialogDescription>
          Al confirmar esta cita, usted está aceptando la siguiente condición:
        </DialogDescription>
        
        <div className="flex items-start space-x-2 mt-4">
          <Checkbox 
            id="confirmation-checkbox" 
            checked={isChecked}
            onCheckedChange={() => onCheckedChange(!isChecked)}
            className="mt-1"
          />
          <label htmlFor="confirmation-checkbox" className="text-sm">
            Entiendo que si llego más de 15 minutos tarde a esta cita, debo ofrecerla sin costo para el paciente. Estoy de acuerdo con esta política.
          </label>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={!isChecked}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentConfirmationDialog;
