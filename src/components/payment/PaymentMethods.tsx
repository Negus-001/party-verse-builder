
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { CreditCard, Check, Loader2, DollarSign, Receipt, Clock, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { processPayment, PaymentTransaction, formatCurrency, getPaymentHistory } from '@/lib/paymentService';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  const [activeTab, setActiveTab] = useState<string>('payment');
  const [paymentHistory, setPaymentHistory] = useState<PaymentTransaction[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === 'history') {
      loadPaymentHistory();
    }
  }, [activeTab]);

  const loadPaymentHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const history = await getPaymentHistory("current-user");
      setPaymentHistory(history);
    } catch (error) {
      console.error("Error loading payment history:", error);
      toast({
        title: "Error",
        description: "Failed to load payment history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

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

    try {
      const result = await processPayment({
        cardNumber,
        cardholderName: name,
        expiryDate,
        cvv,
        amount,
        description: "Event Planning Service"
      });
      
      if (result) {
        if (onPaymentComplete) {
          onPaymentComplete();
        }

        // Add the new transaction to payment history
        setPaymentHistory(prev => [result, ...prev]);
      }
    } catch (error) {
      console.error("Payment error:", error);
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
      className="space-y-6"
    >
      <Card className="w-full max-w-2xl mx-auto border-2 shadow-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-primary" />
            Payment Center
          </CardTitle>
          <CardDescription>
            Secure payment processing for your Celebration Central services
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="payment" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6 pt-2">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="payment" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Make Payment
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Payment History
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="payment">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                <motion.div className="space-y-6" variants={containerVariants}>
                  <motion.div variants={itemVariants}>
                    <div className="mb-4">
                      <Label className="text-base font-semibold">Amount to Pay</Label>
                      <div className="mt-2 text-2xl font-bold text-center py-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-md">
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
                className="w-full transition-all hover:scale-105 hover:shadow-md bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
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
          </TabsContent>
          
          <TabsContent value="history">
            <CardContent className="pt-6">
              {isLoadingHistory ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : paymentHistory.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {paymentHistory.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4 hover:bg-accent/10 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{transaction.description}</h4>
                          <div className="text-sm text-muted-foreground flex items-center mt-1">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            {transaction.date.toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatCurrency(transaction.amount, transaction.currency)}</div>
                          <div className="flex items-center justify-end mt-1">
                            <CreditCard className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {transaction.paymentMethod} •••• {transaction.last4Digits}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <Badge variant="outline" className={cn(
                          "text-xs",
                          transaction.status === 'completed' && "bg-green-500/10 text-green-600 border-green-300",
                          transaction.status === 'pending' && "bg-yellow-500/10 text-yellow-700 border-yellow-300",
                          transaction.status === 'failed' && "bg-red-500/10 text-red-600 border-red-300"
                        )}>
                          {transaction.status === 'completed' && <Check className="h-3 w-3 mr-1" />}
                          {transaction.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">ID: {transaction.id}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto opacity-20 mb-3" />
                  <h3 className="text-lg font-medium">No payment history</h3>
                  <p className="max-w-xs mx-auto mt-1">
                    When you make payments, they will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  );
};

export default PaymentMethods;
