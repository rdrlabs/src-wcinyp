import { 
  ClipboardList,
  User,
  Shield,
  Heart,
  FolderOpen,
  DollarSign,
  Stethoscope,
  Brain,
  Bone,
  Eye,
  Activity,
  AlertCircle,
  Zap,
  GraduationCap,
  Award,
  Languages,
  Star,
  LucideIcon
} from 'lucide-react';
import { getThemeColor } from './theme';
import { LOCATIONS, AFFILIATIONS } from '@/constants/locations';

/**
 * Get icon for document/form category
 */
export function getCategoryIcon(category: string): LucideIcon {
  const categoryLower = category.toLowerCase();
  
  switch (categoryLower) {
    case 'forms':
    case 'all':
      return ClipboardList;
    case 'patient':
    case 'patient-info':
      return User;
    case 'insurance':
      return Shield;
    case 'clinical':
      return Heart;
    case 'self-pay':
      return DollarSign;
    default:
      return FolderOpen;
  }
}

/**
 * Get icon for medical specialty
 */
export function getSpecialtyIcon(specialty: string): LucideIcon {
  const specialtyLower = specialty.toLowerCase();
  
  if (specialtyLower.includes('radiology') || specialtyLower.includes('imaging')) {
    return Activity;
  } else if (specialtyLower.includes('neuro')) {
    return Brain;
  } else if (specialtyLower.includes('cardio') || specialtyLower.includes('heart')) {
    return Heart;
  } else if (specialtyLower.includes('ortho') || specialtyLower.includes('bone')) {
    return Bone;
  } else if (specialtyLower.includes('ophthalm') || specialtyLower.includes('eye')) {
    return Eye;
  } else {
    return Stethoscope;
  }
}

/**
 * Get color class for location badge
 */
export function getLocationColor(location: string): string {
  const locationData = LOCATIONS[location as keyof typeof LOCATIONS];
  if (locationData?.colorKey) {
    return getThemeColor(locationData.colorKey);
  }
  return getThemeColor('gray');
}

/**
 * Get affiliation badge info
 */
export interface AffiliationInfo {
  label: string;
  color: string;
}

export function getAffiliationInfo(affiliation?: string): AffiliationInfo {
  const affiliationData = AFFILIATIONS[affiliation as keyof typeof AFFILIATIONS];
  if (affiliationData) {
    return {
      label: affiliationData.label,
      color: getThemeColor(affiliationData.colorKey),
    };
  }
  
  return { 
    label: affiliation || 'Unknown', 
    color: getThemeColor('gray'),
  };
}

/**
 * Get provider flag info
 */
export interface FlagInfo {
  icon: LucideIcon;
  tooltip: string;
  color: string;
}

export function getFlagInfo(flag: string): FlagInfo {
  const flags: Record<string, FlagInfo> = {
    'vip': { icon: Star, tooltip: 'VIP Provider', color: 'text-muted-foreground' },
    'urgent': { icon: AlertCircle, tooltip: 'Urgent Availability', color: 'text-destructive' },
    'new': { icon: Zap, tooltip: 'New Provider', color: 'text-primary' },
    'teaching': { icon: GraduationCap, tooltip: 'Teaching Faculty', color: 'text-primary' },
    'research': { icon: Award, tooltip: 'Research Faculty', color: 'text-primary' },
    'multilingual': { icon: Languages, tooltip: 'Multilingual', color: 'text-primary' },
  };
  
  return flags[flag] || { 
    icon: AlertCircle, 
    tooltip: flag, 
    color: 'text-muted-foreground' 
  };
}