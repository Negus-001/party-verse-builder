
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EventTypeSelector from '@/components/events/EventTypeSelector';
import EventBasicDetailsForm from '@/components/events/EventBasicDetailsForm';
import EventAIAssistant from '@/components/events/EventAIAssistant';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Confetti, PartyPopper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

enum CreationStep {
  SelectType,
  BasicDetails,
  AIAssistant,
  Summary,
}

const CreateEvent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = React.useState<CreationStep>(CreationStep.SelectType);
  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(25);

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
    setCurrentStep(CreationStep.BasicDetails);
    setProgress(50);
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case CreationStep.BasicDetails:
        setCurrentStep(CreationStep.AIAssistant);
        setProgress(75);
        break;
      case CreationStep.AIAssistant:
        setCurrentStep(CreationStep.Summary);
        setProgress(100);
        break;
    }
  };

  const handlePrevStep = () => {
    switch (currentStep) {
      case CreationStep.BasicDetails:
        setCurrentStep(CreationStep.SelectType);
        setProgress(25);
        break;
      case CreationStep.AIAssistant:
        setCurrentStep(CreationStep.BasicDetails);
        setProgress(50);
        break;
      case CreationStep.Summary:
        setCurrentStep(CreationStep.AIAssistant);
        setProgress(75);
        break;
    }
  };

  const handleFinish = () => {
    toast({
      title: "Event created!",
      description: "Your event has been successfully created.",
    });
    navigate('/dashboard');
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen py-24 px-6">
        <div className="container max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-center mb-2">Create Your Event</h1>
          <p className="text-center text-muted-foreground mb-8">
            Let's set up your event in a few easy steps
          </p>

          <div className="mb-8">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Event Type</span>
              <span>Event Details</span>
              <span>AI Assistant</span>
              <span>Summary</span>
            </div>
          </div>
          
          <Card className="p-6 shadow-md">
            {currentStep === CreationStep.SelectType && (
              <EventTypeSelector 
                selectedType={selectedType} 
                onSelectType={handleSelectType} 
              />
            )}

            {currentStep === CreationStep.BasicDetails && selectedType && (
              <EventBasicDetailsForm 
                onNextStep={handleNextStep}
                onPrevStep={handlePrevStep}
                selectedType={selectedType}
              />
            )}

            {currentStep === CreationStep.AIAssistant && selectedType && (
              <EventAIAssistant 
                onNextStep={handleNextStep}
                onPrevStep={handlePrevStep}
                eventType={selectedType}
              />
            )}

            {currentStep === CreationStep.Summary && (
              <div className="text-center space-y-6 py-8">
                <div className="flex justify-center">
                  <div className="bg-accent/50 w-16 h-16 rounded-full flex items-center justify-center text-primary">
                    <PartyPopper size={32} />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-semibold mb-2">Event Created Successfully!</h2>
                  <p className="text-muted-foreground">
                    Your {selectedType} has been set up with AI-powered suggestions.
                  </p>
                </div>

                <div className="max-w-sm mx-auto pt-4">
                  <Button onClick={handleFinish} className="w-full">
                    Go to Your Dashboard
                  </Button>
                  <Button variant="ghost" onClick={() => navigate('/')} className="w-full mt-2">
                    Return to Home
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CreateEvent;
