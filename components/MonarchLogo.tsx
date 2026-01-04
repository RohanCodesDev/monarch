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
  const sizeMap = {
    sm: { width: 64, height: 64 },
    md: { width: 112, height: 112 },
    lg: { width: 160, height: 160 },
    xl: { width: 224, height: 224 },
  };

  const LogoImage = () => (
    <div 
      className={`${className} relative`}
      style={{
        filter: 'brightness(0) saturate(100%) invert(77%) sepia(52%) saturate(450%) hue-rotate(358deg) brightness(103%) contrast(96%) drop-shadow(0 0 20px rgba(251, 191, 36, 0.4))',
        width: sizeMap[size].width,
        height: sizeMap[size].height,
      }}
    >
      <Image 
        src="/monarch2.png"
        alt="Monarch"
        width={sizeMap[size].width}
        height={sizeMap[size].height}
        className="object-contain w-full h-full"
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
