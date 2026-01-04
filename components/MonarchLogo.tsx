import { motion } from 'framer-motion';
import Image from 'next/image';

interface MonarchLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

export default function MonarchLogo({ 
  size = 'md', 
  className = '',
  animated = true 
}: MonarchLogoProps) {
  const sizeClasses = {
    sm: 'h-16 w-auto',
    md: 'h-28 w-auto',
    lg: 'h-40 w-auto',
    xl: 'h-56 w-auto',
  };

  const LogoImage = () => (
    <div 
      className={`${sizeClasses[size]} ${className} relative`}
      style={{
        filter: 'brightness(0) saturate(100%) invert(77%) sepia(52%) saturate(450%) hue-rotate(358deg) brightness(103%) contrast(96%) drop-shadow(0 0 20px rgba(251, 191, 36, 0.4))',
      }}
    >
      <Image 
        src="/monarch2.png"
        alt="Monarch"
        fill
        className="object-contain"
        priority
      />
    </div>
  );

  if (!animated) {
    return <LogoImage />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <LogoImage />
    </motion.div>
  );
}
