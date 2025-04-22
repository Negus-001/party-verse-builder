
import { format } from 'date-fns';

export const getEventTypeColor = (type: string): string => {
  const colorMap: { [key: string]: string } = {
    wedding: 'bg-pink-100 text-pink-800 border-pink-200',
    birthday: 'bg-blue-100 text-blue-800 border-blue-200',
    corporate: 'bg-purple-100 text-purple-800 border-purple-200',
    graduation: 'bg-green-100 text-green-800 border-green-200',
    babyshower: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    default: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return colorMap[type.toLowerCase()] || colorMap.default;
};

export const formatEventDate = (date: string): string => {
  try {
    return format(new Date(date), 'PPp');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};
