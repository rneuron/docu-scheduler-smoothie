
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
        title: "Incomplete Form",
        description: "Please fill in all payment details",
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
          title: "Payment Successful",
          description: "Your appointment has been paid successfully",
        });
        onPaymentSuccess();
      } else {
        toast({
          title: "Payment Failed",
          description: "There was an error processing your payment",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "There was an error processing your payment",
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
          <DialogTitle>Payment Information</DialogTitle>
          <DialogDescription>
            Enter your payment details to complete your appointment booking.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
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
              <span className="text-sm font-medium">Appointment Fee:</span>
              <span className="font-medium">$75.00</span>
            </div>
            <div className="text-xs text-muted-foreground">
              <p>By proceeding, you agree to the late arrival policy:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>Patient late more than 15 min: $25 penalty fee</li>
                <li>Doctor late more than 15 min: Automatic refund</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Pay Now"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
