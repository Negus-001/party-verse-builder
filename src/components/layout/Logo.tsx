
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PartyPopper } from 'lucide-react';

interface LogoProps {
  variant?: 'default' | 'small' | 'large';
  showName?: boolean;
}

const Logo = ({ variant = 'default', showName = true }: LogoProps) => {
  let iconSize: number;
  let fontSize: string;
  
  switch (variant) {
    case 'small':
      iconSize = 20;
      fontSize = 'text-lg';
      break;
    case 'large':
      iconSize = 36;
      fontSize = 'text-3xl';
      break;
    default:
      iconSize = 24;
      fontSize = 'text-xl';
  }
  
  return (
    <Link to="/">
      <motion.div 
        className="flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.03 }}
      >
        <div className="relative">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              times: [0, 0.2, 0.8, 1],
              repeat: Infinity,
              repeatDelay: 8
            }}
          >
            <div className="rounded-full bg-gradient-to-r from-primary to-accent p-1.5 flex items-center justify-center shadow-lg">
              <PartyPopper size={iconSize} className="text-white" />
            </div>
          </motion.div>
          
          <motion.div
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1, 0] }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              times: [0, 0.3, 1],
              repeat: Infinity,
              repeatDelay: 7
            }}
          />
        </div>
        
        {showName && (
          <div className={`font-display font-bold ${fontSize} bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text`}>
            Celebration Central
          </div>
        )}
      </motion.div>
    </Link>
  );
};

export default Logo;
