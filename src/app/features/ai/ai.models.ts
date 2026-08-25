export interface AiSource {
  entityType: 'Task' | 'Project' | 'Discussion';
  entityId: string;
  title: string;
  snippet: string;
  projectId: string | null;
}

export interface AiAnswer {
  answer: string | null;
  aiEnabled: boolean;
  sources: AiSource[];
}
