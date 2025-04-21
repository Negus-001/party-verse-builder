
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { motion } from 'framer-motion';
import { CreditCard, Check, Loader2, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentMethodsProps {
  amount: number;
  onPaymentComplete?: () => void;
}

const PaymentMethods = ({ amount, onPaymentComplete }: PaymentMethodsProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('credit-card');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Validate input
    if (paymentMethod === 'credit-card' && (!cardNumber || !expiryDate || !cvv || !name)) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    // Simulate payment processing
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment successful!",
        description: `Your payment of $${amount.toFixed(2)} has been processed successfully.`,
      });
      
      if (onPaymentComplete) {
        onPaymentComplete();
      }
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date (MM/YY)
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    
    return v;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="w-full max-w-md mx-auto border-2 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-primary" />
            Payment
          </CardTitle>
          <CardDescription>
            Choose your preferred payment method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <motion.div className="space-y-6" variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <div className="mb-4">
                  <Label className="text-base font-semibold">Amount to Pay</Label>
                  <div className="mt-2 text-2xl font-bold text-center py-3 bg-accent/30 rounded-md">
                    ${amount.toFixed(2)}
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <RadioGroup 
                    defaultValue="credit-card" 
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                  >
                    <div>
                      <RadioGroupItem
                        value="credit-card"
                        id="credit-card"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="credit-card"
                        className="flex items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <div className="font-medium">Credit Card</div>
                        </div>
                        {paymentMethod === 'credit-card' && <Check className="h-4 w-4 text-primary" />}
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem
                        value="paypal"
                        id="paypal"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="paypal"
                        className="flex items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 font-bold">Pay</span>
                          <span className="text-blue-800 font-bold">Pal</span>
                        </div>
                        {paymentMethod === 'paypal' && <Check className="h-4 w-4 text-primary" />}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </motion.div>
              
              {paymentMethod === 'credit-card' && (
                <>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="name">Name on Card</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      className="transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                        maxLength={5}
                        className="transition-all focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/[^\d]/g, ''))}
                        maxLength={3}
                        className="transition-all focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </motion.div>
                </>
              )}
              
              {paymentMethod === 'paypal' && (
                <motion.div variants={itemVariants} className="bg-accent/30 p-4 rounded-md text-center">
                  <p>You'll be redirected to PayPal after clicking "Pay Now"</p>
                </motion.div>
              )}
            </motion.div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full transition-all hover:scale-105 hover:shadow-md"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Pay Now ${amount.toFixed(2)}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PaymentMethods;
