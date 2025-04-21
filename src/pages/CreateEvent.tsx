
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EventTypeSelector from '@/components/events/EventTypeSelector';
import EventBasicDetailsForm from '@/components/events/EventBasicDetailsForm';
import EventAIAssistant from '@/components/events/EventAIAssistant';
import SendInvitations from '@/components/events/SendInvitations';
import PaymentMethods from '@/components/payment/PaymentMethods';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PartyPopper, Check, CreditCard, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

enum CreationStep {
  SelectType,
  BasicDetails,
  AIAssistant,
  Invitations,
  Payment,
  Summary,
}

const CreateEvent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CreationStep>(CreationStep.SelectType);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [progress, setProgress] = useState(16);

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
    setCurrentStep(CreationStep.BasicDetails);
    setProgress(32);
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case CreationStep.BasicDetails:
        setCurrentStep(CreationStep.AIAssistant);
        setProgress(48);
        break;
      case CreationStep.AIAssistant:
        setCurrentStep(CreationStep.Invitations);
        setProgress(64);
        break;
      case CreationStep.Invitations:
        setCurrentStep(CreationStep.Payment);
        setProgress(80);
        break;
      case CreationStep.Payment:
        setCurrentStep(CreationStep.Summary);
        setProgress(100);
        break;
    }
  };

  const handlePrevStep = () => {
    switch (currentStep) {
      case CreationStep.BasicDetails:
        setCurrentStep(CreationStep.SelectType);
        setProgress(16);
        break;
      case CreationStep.AIAssistant:
        setCurrentStep(CreationStep.BasicDetails);
        setProgress(32);
        break;
      case CreationStep.Invitations:
        setCurrentStep(CreationStep.AIAssistant);
        setProgress(48);
        break;
      case CreationStep.Payment:
        setCurrentStep(CreationStep.Invitations);
        setProgress(64);
        break;
      case CreationStep.Summary:
        setCurrentStep(CreationStep.Payment);
        setProgress(80);
        break;
    }
  };

  const handlePaymentComplete = () => {
    setCurrentStep(CreationStep.Summary);
    setProgress(100);
  };

  const handleFinish = () => {
    toast({
      title: "Celebration created!",
      description: "Your celebration has been successfully created.",
    });
    navigate('/dashboard');
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen py-24 px-6 bg-gradient-to-b from-background to-accent/20">
        <motion.div 
          className="container max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-center mb-2 bg-gradient-to-r from-primary to-purple-400 text-transparent bg-clip-text animate-pulse-slow">
            Create Your Celebration
          </h1>
          <p className="text-center text-muted-foreground mb-8 animate-fade-in">
            Let's plan your perfect celebration in a few easy steps
          </p>

          <div className="mb-8">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span className={currentStep === CreationStep.SelectType ? "text-primary font-medium" : ""}>
                Event Type
              </span>
              <span className={currentStep === CreationStep.BasicDetails ? "text-primary font-medium" : ""}>
                Details
              </span>
              <span className={currentStep === CreationStep.AIAssistant ? "text-primary font-medium" : ""}>
                AI Assistant
              </span>
              <span className={currentStep === CreationStep.Invitations ? "text-primary font-medium" : ""}>
                Invitations
              </span>
              <span className={currentStep === CreationStep.Payment ? "text-primary font-medium" : ""}>
                Payment
              </span>
              <span className={currentStep === CreationStep.Summary ? "text-primary font-medium" : ""}>
                Complete
              </span>
            </div>
          </div>
          
          <Card className="p-6 shadow-md border-2 transition-all">
            <AnimatePresence mode="wait">
              {currentStep === CreationStep.SelectType && (
                <motion.div
                  key="select-type"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <EventTypeSelector 
                    selectedType={selectedType} 
                    onSelectType={handleSelectType} 
                  />
                </motion.div>
              )}

              {currentStep === CreationStep.BasicDetails && selectedType && (
                <motion.div
                  key="basic-details"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <EventBasicDetailsForm 
                    onNextStep={handleNextStep}
                    onPrevStep={handlePrevStep}
                    selectedType={selectedType}
                  />
                </motion.div>
              )}

              {currentStep === CreationStep.AIAssistant && selectedType && (
                <motion.div
                  key="ai-assistant"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <EventAIAssistant 
                    onNextStep={handleNextStep}
                    onPrevStep={handlePrevStep}
                    eventType={selectedType}
                  />
                </motion.div>
              )}

              {currentStep === CreationStep.Invitations && selectedType && (
                <motion.div
                  key="invitations"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-6">
                    <h2 className="text-2xl font-display font-semibold">Send Invitations</h2>
                    <p className="text-muted-foreground">
                      Invite your guests to your {selectedType} celebration
                    </p>

                    <SendInvitations
                      eventId="new-event-id" // This would come from context in a real implementation
                      eventTitle={`My ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}`}
                      eventDate="May 15, 2025"
                      eventLocation="Celebration Venue"
                      eventDescription="Join us for a wonderful celebration!"
                    />
                    
                    <div className="flex justify-between pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handlePrevStep}
                        className="transition-transform hover:scale-105"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={handleNextStep}
                        className="transition-all hover:scale-105 hover:shadow-md"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === CreationStep.Payment && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-6">
                    <h2 className="text-2xl font-display font-semibold">Payment</h2>
                    <p className="text-muted-foreground">
                      Complete your booking with payment
                    </p>

                    <PaymentMethods 
                      amount={99.99} 
                      onPaymentComplete={handlePaymentComplete}
                    />
                    
                    <div className="flex justify-between pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handlePrevStep}
                        className="transition-transform hover:scale-105"
                      >
                        Back
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === CreationStep.Summary && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center space-y-6 py-8"
                >
                  <motion.div 
                    className="flex justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.2 }}
                  >
                    <div className="bg-gradient-to-br from-primary/20 to-purple-400/20 w-20 h-20 rounded-full flex items-center justify-center text-primary">
                      <PartyPopper size={40} className="animate-pulse-slow" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h2 className="text-2xl font-display font-semibold mb-2 bg-gradient-to-r from-primary to-purple-400 text-transparent bg-clip-text">
                      Celebration Created Successfully!
                    </h2>
                    <p className="text-muted-foreground">
                      Your {selectedType} has been set up with AI-powered suggestions.
                    </p>
                  </motion.div>

                  <motion.div 
                    className="space-y-4 max-w-sm mx-auto pt-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="bg-accent/40 rounded-lg p-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Check size={16} className="text-green-500" />
                        <p className="text-sm">Event details saved</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check size={16} className="text-green-500" />
                        <p className="text-sm">AI suggestions included</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check size={16} className="text-green-500" />
                        <p className="text-sm">Invitations sent</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CreditCard size={16} className="text-green-500" />
                        <p className="text-sm">Payment processed</p>
                      </div>
                    </div>

                    <Button 
                      onClick={handleFinish} 
                      className="w-full transition-all hover:scale-105 hover:shadow-md bg-gradient-to-r from-primary to-purple-500"
                    >
                      Go to Your Dashboard
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      onClick={() => navigate('/')} 
                      className="w-full transition-colors"
                    >
                      Return to Home
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </>
  );
};

export default CreateEvent;
