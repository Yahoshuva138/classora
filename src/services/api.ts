import {
  Student,
  Session,
  AttendanceRecord,
  FollowUp,
  CRTask,
  AppSettings,
  StudentRequest,
  AttendanceStatus,
  StudentSkillScores,
  GoogleUser,
  ActivityLog
} from '../types';

const API_BASE = '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn(`[Classora API Client] Error requesting ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // Bootstrap entire app state
  async getBootstrapData(): Promise<{
    students: Student[];
    sessions: Session[];
    attendanceRecords: AttendanceRecord[];
    followUps: FollowUp[];
    tasks: CRTask[];
    studentRequests: StudentRequest[];
    settings: AppSettings | null;
    activityLogs?: ActivityLog[];
  }> {
    const res = await request<{ success: boolean; data: any }>('/bootstrap');
    return res.data;
  },

  // Reset to Demo state
  async resetDemo(): Promise<void> {
    await request('/reset-demo', { method: 'POST' });
  },

  // Students
  async getStudents(batch?: string): Promise<Student[]> {
    const query = batch && batch !== 'All' ? `?batch=${encodeURIComponent(batch)}` : '';
    const res = await request<{ success: boolean; data: Student[] }>(`/students${query}`);
    return res.data;
  },

  async createStudent(student: Partial<Student>): Promise<Student> {
    const res = await request<{ success: boolean; data: Student }>('/students', {
      method: 'POST',
      body: JSON.stringify(student),
    });
    return res.data;
  },

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    const res = await request<{ success: boolean; data: Student }>(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return res.data;
  },

  async deleteStudent(id: string): Promise<void> {
    await request(`/students/${id}`, { method: 'DELETE' });
  },

  async addCRRemark(studentId: string, text: string, author?: string): Promise<any> {
    const res = await request<{ success: boolean; data: any }>(`/students/${studentId}/remarks`, {
      method: 'POST',
      body: JSON.stringify({ text, author }),
    });
    return res.data;
  },

  async addFacultyFeedback(studentId: string, text: string): Promise<any> {
    return this.addCRRemark(studentId, text, 'Dr. Priya Nair (Faculty)');
  },

  async updateStudentSkill(studentId: string, skill: keyof StudentSkillScores, score: number): Promise<any> {
    const res = await request<{ success: boolean; data: any }>(`/students/${studentId}/skills`, {
      method: 'PATCH',
      body: JSON.stringify({ skill, score }),
    });
    return res.data;
  },

  async updateStudentAssignment(studentId: string, assignmentId: string, score: number): Promise<any> {
    const res = await request<{ success: boolean; data: any }>(`/students/${studentId}/assignments/${assignmentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ score }),
    });
    return res.data;
  },

  // Sessions
  async getSessions(): Promise<Session[]> {
    const res = await request<{ success: boolean; data: Session[] }>('/sessions');
    return res.data;
  },

  async createSession(session: Omit<Session, 'id'>): Promise<Session> {
    const res = await request<{ success: boolean; data: Session }>('/sessions', {
      method: 'POST',
      body: JSON.stringify(session),
    });
    return res.data;
  },

  async updateSession(id: string, updates: Partial<Session>): Promise<Session> {
    const res = await request<{ success: boolean; data: Session }>(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return res.data;
  },

  async deleteSession(id: string): Promise<void> {
    await request(`/sessions/${id}`, { method: 'DELETE' });
  },

  // Attendance
  async markAttendance(sessionId: string, studentId: string, status: AttendanceStatus, remarks?: string): Promise<any> {
    const res = await request<{ success: boolean; record: any }>('/attendance/mark', {
      method: 'POST',
      body: JSON.stringify({ sessionId, studentId, status, remarks }),
    });
    return res.record;
  },

  async bulkMarkAttendance(sessionId: string, records: Array<{ studentId: string; status: AttendanceStatus }>): Promise<void> {
    await request('/attendance/bulk', {
      method: 'POST',
      body: JSON.stringify({ sessionId, records }),
    });
  },

  async resetSessionAttendance(sessionId: string): Promise<void> {
    await request(`/attendance/session/${sessionId}`, { method: 'DELETE' });
  },

  // Follow-ups
  async getFollowUps(): Promise<FollowUp[]> {
    const res = await request<{ success: boolean; data: FollowUp[] }>('/followups');
    return res.data;
  },

  async createFollowUp(followUp: Omit<FollowUp, 'id' | 'dateIdentified'>): Promise<FollowUp> {
    const res = await request<{ success: boolean; data: FollowUp }>('/followups', {
      method: 'POST',
      body: JSON.stringify(followUp),
    });
    return res.data;
  },

  async updateFollowUp(id: string, updates: Partial<FollowUp>): Promise<FollowUp> {
    const res = await request<{ success: boolean; data: FollowUp }>(`/followups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return res.data;
  },

  async deleteFollowUp(id: string): Promise<void> {
    await request(`/followups/${id}`, { method: 'DELETE' });
  },

  // Tasks
  async getTasks(): Promise<CRTask[]> {
    const res = await request<{ success: boolean; data: CRTask[] }>('/tasks');
    return res.data;
  },

  async createTask(task: Omit<CRTask, 'id'>): Promise<CRTask> {
    const res = await request<{ success: boolean; data: CRTask }>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
    return res.data;
  },

  async updateTask(id: string, updates: Partial<CRTask>): Promise<CRTask> {
    const res = await request<{ success: boolean; data: CRTask }>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return res.data;
  },

  async toggleTask(id: string): Promise<{ status: string }> {
    const res = await request<{ success: boolean; status: string }>(`/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
    return { status: res.status };
  },

  async deleteTask(id: string): Promise<void> {
    await request(`/tasks/${id}`, { method: 'DELETE' });
  },

  // Student Requests
  async getStudentRequests(studentId?: string): Promise<StudentRequest[]> {
    const query = studentId ? `?studentId=${encodeURIComponent(studentId)}` : '';
    const res = await request<{ success: boolean; data: StudentRequest[] }>(`/requests${query}`);
    return res.data;
  },

  async submitStudentRequest(req: { type: StudentRequest['type']; subject: string; message: string; studentId: string }): Promise<StudentRequest> {
    const res = await request<{ success: boolean; data: StudentRequest }>('/requests', {
      method: 'POST',
      body: JSON.stringify(req),
    });
    return res.data;
  },

  async resolveStudentRequest(id: string, response: string, newStatus?: 'Approved' | 'Resolved'): Promise<StudentRequest> {
    const res = await request<{ success: boolean; data: StudentRequest }>(`/requests/${id}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({ response, newStatus }),
    });
    return res.data;
  },

  // Settings
  async getSettings(): Promise<AppSettings> {
    const res = await request<{ success: boolean; data: AppSettings }>('/settings');
    return res.data;
  },

  async updateSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
    const res = await request<{ success: boolean; data: AppSettings }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return res.data;
  },

  // Resync Official SST 2026 Database
  async resyncOfficial(): Promise<void> {
    await request('/resync-official', { method: 'POST' });
  },

  // Users & Google Authentication
  async getUsers(): Promise<GoogleUser[]> {
    const res = await request<{ success: boolean; data: GoogleUser[] }>('/auth/users');
    return res.data;
  },

  async registerUser(payload: { name: string; email: string; password?: string; role?: string }): Promise<{ success: boolean; message?: string; studentName?: string; email?: string; user?: GoogleUser }> {
    return await request<{ success: boolean; message?: string; studentName?: string; email?: string; user?: GoogleUser }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async loginUser(payload: { email: string; password?: string }): Promise<{ success: boolean; user: GoogleUser; message?: string }> {
    return await request<{ success: boolean; user: GoogleUser; message?: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async changePassword(payload: { email: string; currentPassword?: string; newPassword: string }): Promise<{ success: boolean; user: GoogleUser; message: string }> {
    return await request<{ success: boolean; user: GoogleUser; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getCohortRoster(): Promise<{ id: string; name: string; email: string; rollNo: string; group: string }[]> {
    const res = await request<{ success: boolean; count: number; roster: { id: string; name: string; email: string; rollNo: string; group: string }[] }>('/auth/cohort-roster');
    return res.roster || [];
  },

  async authenticateGoogle(email: string, name?: string, avatar?: string): Promise<{ success: boolean; user: GoogleUser }> {
    return await request<{ success: boolean; user: GoogleUser }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ email, name, avatar }),
    });
  },

  async getAuthMe(): Promise<GoogleUser | null> {
    const res = await request<{ success: boolean; data: GoogleUser | null }>('/auth/me');
    return res.data;
  },

  // Activity Audit Logs
  async getActivityLogs(limit = 25): Promise<ActivityLog[]> {
    const res = await request<{ success: boolean; data: ActivityLog[] }>(`/activity-logs?limit=${limit}`);
    return res.data;
  },

  async logBroadcast(payload: { topic: string; recipients: string; channel?: string; actorName?: string; actorRole?: string }): Promise<void> {
    await request('/broadcast/log', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};

