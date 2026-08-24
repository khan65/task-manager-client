export interface TaskCategory {
  id: string;
  name: string;
  description: string;
}

export interface TaskSubCategory {
  id: string;
  name: string;
  description: string;
  taskCategoryId: string;
  taskCategoryName: string;
}

export interface TaskState {
  id: string;
  name: string;
  sortOrder: number;
}

export interface Priority {
  id: string;
  name: string;
  sortOrder: number;
}

export interface TaskFrequency {
  id: string;
  name: string;
}

export interface TaskType {
  id: string;
  name: string;
  description: string;
}

export interface TaskRole {
  id: string;
  name: string;
  description: string;
}

export interface ProjectTask {
  id: string;
  taskCode: string;
  title: string;
  description: string;
  dueDate: string | null;
  createdAt: string;
  isRemoved: boolean;
  toBeVerifiedDate: string | null;
  verifiedDate: string | null;
  verifiedByUserId: string | null;
  verifiedByUserName: string | null;
  projectId: string;
  projectName: string;
  taskCategoryId: string;
  taskCategoryName: string;
  taskSubCategoryId: string | null;
  taskSubCategoryName: string | null;
  taskTypeId: string | null;
  taskTypeName: string | null;
  taskRoleId: string | null;
  taskRoleName: string | null;
  priorityId: string | null;
  priorityName: string | null;
  taskFrequencyId: string | null;
  taskFrequencyName: string | null;
  taskStateId: string;
  taskStateName: string;
  assigneeId: string | null;
  assigneeName: string | null;
}

export interface TaskStateHistoryEntry {
  id: string;
  fromStateId: string | null;
  fromStateName: string | null;
  toStateId: string;
  toStateName: string;
  changedByUserId: string;
  changedByUserName: string;
  changedAt: string;
}

export interface TaskDiscussion {
  id: string;
  projectTaskId: string;
  authorUserId: string;
  authorName: string;
  message: string;
  createdAt: string;
}

export interface TaskAttachment {
  id: string;
  projectTaskId: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  uploadedByUserId: string;
  uploadedByUserName: string;
  uploadedAt: string;
}
