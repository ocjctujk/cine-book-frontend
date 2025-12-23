import type { UserRole } from "../components/ProtectedRoute";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dob: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  pincode: string;
  role: UserRole;
};
