export interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  joiningDate: string;
  isActive: boolean;
  departmentId: string;
  departmentName: string;
  designationId: string;
  designationTitle: string;
  gradeId: string;
  gradeName: string;
  userId: string | null;
  userFullName: string | null;
}
