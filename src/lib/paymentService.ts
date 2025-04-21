
import { toast } from "@/hooks/use-toast";

export interface PaymentDetails {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  amount: number;
  currency?: string;
  description?: string;
}

export interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  date: Date;
  paymentMethod: string;
  last4Digits?: string;
}

// Mock payment history for demonstration purposes
const mockPaymentHistory: PaymentTransaction[] = [
  {
    id: 'pay_123456789',
    amount: 149.99,
    currency: 'USD',
    status: 'completed',
    description: 'Premium Package - Wedding Planning',
    date: new Date(2025, 3, 15),
    paymentMethod: 'Visa',
    last4Digits: '4242'
  },
  {
    id: 'pay_987654321',
    amount: 99.99,
    currency: 'USD',
    status: 'completed',
    description: 'Standard Package - Birthday Party',
    date: new Date(2025, 2, 10),
    paymentMethod: 'Mastercard',
    last4Digits: '5555'
  }
];

// In a real app, this would interact with Stripe or another payment processor
export const processPayment = async (paymentDetails: PaymentDetails): Promise<PaymentTransaction | null> => {
  try {
    console.log("Processing payment:", { 
      amount: paymentDetails.amount, 
      cardNumber: paymentDetails.cardNumber.replace(/\d(?=\d{4})/g, "*") 
    });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Basic validation
    if (!paymentDetails.cardNumber || !paymentDetails.cardholderName || !paymentDetails.expiryDate || !paymentDetails.cvv) {
      throw new Error("Missing required payment information");
    }
    
    // Additional credit card validation could be done here
    
    // Create a new transaction
    const transaction: PaymentTransaction = {
      id: 'pay_' + Math.random().toString(36).substr(2, 9),
      amount: paymentDetails.amount,
      currency: paymentDetails.currency || 'USD',
      status: 'completed',
      description: paymentDetails.description || 'Event Planning Service',
      date: new Date(),
      paymentMethod: getCardType(paymentDetails.cardNumber),
      last4Digits: paymentDetails.cardNumber.slice(-4),
    };
    
    // In a real app, we'd store this transaction in a database
    console.log("Payment processed successfully:", transaction);
    
    toast({
      title: "Payment Successful!",
      description: `Your payment of ${formatCurrency(transaction.amount, transaction.currency)} has been processed.`,
    });
    
    return transaction;
  } catch (error) {
    console.error("Error processing payment:", error);
    
    toast({
      title: "Payment Failed",
      description: error instanceof Error ? error.message : "There was a problem processing your payment. Please try again.",
      variant: "destructive",
    });
    
    return null;
  }
};

// Function to get payment history (in a real app, this would fetch from a database)
export const getPaymentHistory = async (userId: string): Promise<PaymentTransaction[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, we'd filter by user ID
  return [...mockPaymentHistory];
};

// Helper function to determine card type based on number
const getCardType = (cardNumber: string): string => {
  const firstDigit = cardNumber.charAt(0);
  const firstTwoDigits = parseInt(cardNumber.substring(0, 2));
  
  if (firstDigit === '4') return 'Visa';
  if (firstTwoDigits >= 51 && firstTwoDigits <= 55) return 'Mastercard';
  if (firstTwoDigits === 34 || firstTwoDigits === 37) return 'American Express';
  if (firstTwoDigits === 65 || (firstTwoDigits >= 44 && firstTwoDigits <= 49)) return 'Discover';
  
  return 'Credit Card';
};

// Helper function to format currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency 
  }).format(amount);
};
