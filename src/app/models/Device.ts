import { Category } from './Category';

export interface Device {
  id: number;
  model: string;
  tagNumber: string;
  serialNumber: string;
  remarks: string;
  status: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}
