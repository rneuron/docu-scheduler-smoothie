
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { processPayment } from "@/lib/appointmentService";
import { useToast } from "@/components/ui/use-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  onPaymentSuccess: () => void;
}

const PaymentModal = ({
  isOpen,
  onClose,
  appointmentId,
  onPaymentSuccess,
}: PaymentModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !expiryDate || !cvv) {
      toast({
        title: "Formulario Incompleto",
        description: "Por favor complete todos los datos de pago",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // For demo, we use a mock payment function
      const success = await processPayment(appointmentId);
      
      if (success) {
        toast({
          title: "Pago Exitoso",
          description: "Su cita ha sido pagada con éxito",
        });
        onPaymentSuccess();
      } else {
        toast({
          title: "Fallo en el Pago",
          description: "Hubo un error al procesar su pago",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error de Pago",
        description: "Hubo un error al procesar su pago",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Información de Pago</DialogTitle>
          <DialogDescription>
            Ingrese sus datos de pago para completar la reserva de su cita.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Número de Tarjeta</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Fecha de Vencimiento</Label>
              <Input
                id="expiryDate"
                placeholder="MM/AA"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                type="password"
                maxLength={4}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
              />
            </div>
          </div>
          
          <div className="pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tarifa de la Cita:</span>
              <span className="font-medium">$75.00</span>
            </div>
            <div className="text-xs text-muted-foreground">
              <p>Al continuar, acepta la política de llegadas tardías:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>Paciente que llega más de 15 min tarde: Tarifa de penalización de $25</li>
                <li>Médico que llega más de 15 min tarde: Reembolso automático</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? "Procesando..." : "Pagar Ahora"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
