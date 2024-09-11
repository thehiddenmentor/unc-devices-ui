import { Department } from './Department';
import { Device } from './Device';
import { User } from './User';

export interface Transaction {
  id: number;
  borrowerName: string;
  borrowerId: string;
  device: Device;
  returned: boolean;
  remarks: string;
  user: User;
  department: Department;
  createdAt: string;
  updatedAt: string;
}
