
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserRole } from '@/context/AuthContext';
import { User, ShieldAlert, Package } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

const RoleSelector = ({ selectedRole, onSelectRole }: RoleSelectorProps) => {
  const roles: { id: UserRole; title: string; description: string; icon: React.ReactNode }[] = [
    {
      id: 'user',
      title: 'Event Planner',
      description: 'Plan and manage your personal events and celebrations',
      icon: <User className="h-6 w-6" />
    },
    {
      id: 'vendor',
      title: 'Vendor',
      description: 'Offer your services to event planners',
      icon: <Package className="h-6 w-6" />
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Manage the platform and all its users',
      icon: <ShieldAlert className="h-6 w-6" />
    }
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Select your account type</h3>
        <p className="text-sm text-muted-foreground">Choose the type of account you want to create</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((role) => (
          <Card 
            key={role.id}
            className={`cursor-pointer transition-all hover:border-primary hover:shadow-md ${
              selectedRole === role.id 
                ? 'border-2 border-primary bg-primary/5' 
                : 'bg-card/50'
            }`}
            onClick={() => onSelectRole(role.id)}
          >
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {role.icon}
              </div>
              <h4 className="font-medium">{role.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoleSelector;
