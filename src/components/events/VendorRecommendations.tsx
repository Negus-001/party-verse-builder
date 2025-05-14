
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { generateVendorRecommendations } from '@/lib/openai';
import { Sparkles, AlertCircle, QrCode, Check } from 'lucide-react';

interface Vendor {
  name: string;
  type: string;
  description: string;
  priceRange: string;
  services: string[];
  qrCode?: string;
}

interface VendorRecommendationsProps {
  eventType: string;
  location: string;
  budget: number;
}

const VendorRecommendations = ({ eventType, location, budget }: VendorRecommendationsProps) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  
  // Mock QR code generation (in a real app this would come from the backend)
  const generateMockQrCode = (vendorName: string) => {
    // This would be a real QR code URL in a production app
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=payment:${vendorName.replace(/\s+/g, '-').toLowerCase()}`;
  };

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const vendorData = await generateVendorRecommendations(eventType, location, budget);
        
        // Add mock QR codes
        const vendorsWithQr = vendorData.map((vendor: Vendor) => ({
          ...vendor,
          qrCode: generateMockQrCode(vendor.name),
        }));
        
        setVendors(vendorsWithQr);
      } catch (err) {
        console.error("Error fetching vendor recommendations:", err);
        setError("Unable to load vendor recommendations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [eventType, location, budget]);
  
  const toggleVendorSelection = (vendorName: string) => {
    setSelectedVendors(prev => 
      prev.includes(vendorName) 
        ? prev.filter(name => name !== vendorName)
        : [...prev, vendorName]
    );
  };
  
  const getPriceRangeBadge = (priceRange: string) => {
    switch (priceRange.toLowerCase()) {
      case 'cheap':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Affordable</Badge>;
      case 'expensive':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Premium</Badge>;
      default:
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Standard</Badge>;
    }
  };

  if (error) {
    return (
      <Card className="border-2 shadow-sm">
        <CardContent className="pt-6">
          <div className="text-center p-6">
            <AlertCircle className="h-10 w-10 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-primary" />
          Recommended Vendors
        </CardTitle>
        <CardDescription>
          Vendors that match your event type, location, and budget
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-64" />
                      <div className="pt-2">
                        <Skeleton className="h-4 w-56" />
                        <Skeleton className="h-4 w-48 mt-1" />
                      </div>
                    </div>
                    <Skeleton className="h-16 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {vendors.length > 0 ? (
              vendors.map((vendor, index) => (
                <Card 
                  key={index} 
                  className={`overflow-hidden transition-all ${
                    selectedVendors.includes(vendor.name) 
                      ? 'border-primary border-2' 
                      : 'hover:border-primary/50'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">{vendor.name}</h3>
                          {getPriceRangeBadge(vendor.priceRange)}
                        </div>
                        <p className="text-sm text-primary font-medium">{vendor.type}</p>
                        <p className="text-sm text-muted-foreground">{vendor.description}</p>
                        <ul className="pt-2 space-y-1">
                          {vendor.services.map((service, i) => (
                            <li key={i} className="text-sm flex items-center">
                              <Check size={14} className="mr-1 text-green-500" />
                              {service}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex flex-col items-center space-y-2">
                        <div className="bg-gray-100 p-2 rounded-md">
                          <img 
                            src={vendor.qrCode} 
                            alt={`${vendor.name} payment QR code`} 
                            className="w-24 h-24 object-contain" 
                          />
                        </div>
                        <Button 
                          variant={selectedVendors.includes(vendor.name) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleVendorSelection(vendor.name)}
                          className="w-full"
                        >
                          {selectedVendors.includes(vendor.name) ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              Selected
                            </>
                          ) : (
                            <>
                              <QrCode className="h-3 w-3 mr-1" />
                              Select
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center p-6">
                <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No vendors found</h3>
                <p className="text-muted-foreground">
                  We couldn't find vendors matching your criteria. Try adjusting your event details.
                </p>
              </div>
            )}
            
            <div className="border-t pt-4 mt-6">
              <p className="text-muted-foreground text-sm mb-4">
                Want to pay later? No problem! Select vendors now and you can complete payment closer to your event date.
              </p>
              <Button variant="outline" className="w-full">
                Save Selected Vendors
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VendorRecommendations;
