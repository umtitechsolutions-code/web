// Real API for Portal Dashboards
// Communicates with the Flask backend

const API_BASE_URL = (window.API_CONFIG && window.API_CONFIG.BASE_URL !== undefined) ? window.API_CONFIG.BASE_URL + '/api' : '/api';

const PortalAPI = {
    // Helper to get headers with JWT
    getHeaders() {
        const userRole = localStorage.getItem('user_role') || localStorage.getItem('umti_user_role');
        const rolePrefix = userRole ? `${userRole.toLowerCase()}_` : '';
        const token = localStorage.getItem(`${rolePrefix}umti_token`) ||
            localStorage.getItem('umti_token') ||
            localStorage.getItem('umti_access_token');

        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    },

    // Helper for fetch with error handling
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const finalOptions = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...(options.headers || {})
            }
        };

        try {
            const response = await fetch(url, finalOptions);
            if (response.status === 401) {
                // Unauthorized - could redirect to login
                console.warn("Session expired or unauthorized");
            }
            if (!response.ok) {
                const error = await response.json().catch(() => ({ msg: "An error occurred" }));
                throw new Error(error.msg || "API request failed");
            }
            return await response.json();
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    },

    // Admin Dashboard Data
    getAdminDashboard() {
        return this.request('/admin/dashboard');
    },

    // Student Dashboard Data
    getStudentDashboard() {
        return this.request('/student/dashboard');
    },

    // Employee Dashboard Data
    getEmployeeDashboard() {
        return this.request('/employee/dashboard');
    },

    // Client Dashboard Data
    getClientDashboard() {
        return this.request('/client/dashboard');
    },

    // Intern Dashboard Data
    getInternDashboard() {
        return this.request('/intern/dashboard');
    },

    // Messages Data
    getMessages() {
        return this.request('/common/messages');
    },

    sendMessage(receiverId, content) {
        return this.request('/common/messages', {
            method: 'POST',
            body: JSON.stringify({ receiver_id: receiverId, content: content })
        });
    },

    // Meetings Data
    getMeetings() {
        return this.request('/common/meetings');
    },

    createMeeting(meetingData) {
        return this.request('/common/meetings', {
            method: 'POST',
            body: JSON.stringify(meetingData)
        });
    },

    // Users List (for Admin)
    getUsers() {
        return this.request('/admin/users');
    },

    createUser(userData) {
        return this.request('/admin/users', { method: 'POST', body: JSON.stringify(userData) });
    },

    updateUser(userId, userData) {
        return this.request(`/admin/users/${userId}`, { method: 'PUT', body: JSON.stringify(userData) });
    },

    deleteUser(userId) {
        return this.request(`/admin/users/${userId}`, { method: 'DELETE' });
    },

    // User Profile
    getProfile() {
        return this.request('/common/profile');
    },

    // Course Management
    getCourses() {
        return this.request('/admin/courses');
    },

    createCourse(courseData) {
        return this.request('/admin/courses', { method: 'POST', body: JSON.stringify(courseData) });
    },

    updateCourse(courseId, courseData) {
        return this.request(`/admin/courses/${courseId}`, { method: 'PUT', body: JSON.stringify(courseData) });
    },

    deleteCourse(courseId) {
        return this.request(`/admin/courses/${courseId}`, { method: 'DELETE' });
    },

    // Project Management
    getProjects() {
        return this.request('/admin/projects');
    },

    createProject(data) {
        const isFormData = data instanceof FormData;
        return this.request('/admin/projects', {
            method: 'POST',
            body: isFormData ? data : JSON.stringify(data),
            headers: isFormData ? {} : { 'Content-Type': 'application/json' }
        });
    },

    updateProject(projectId, projectData) {
        return this.request(`/admin/projects/${projectId}`, { method: 'PUT', body: JSON.stringify(projectData) });
    },

    deleteProject(projectId) {
        return this.request(`/admin/projects/${projectId}`, { method: 'DELETE' });
    },

    // Invoice Management
    getInvoices() {
        return this.request('/admin/invoices');
    },

    createInvoice(invoiceData) {
        return this.request('/admin/invoices', { method: 'POST', body: JSON.stringify(invoiceData) });
    },

    updateInvoice(invoiceId, invoiceData) {
        return this.request(`/admin/invoices/${invoiceId}`, { method: 'PUT', body: JSON.stringify(invoiceData) });
    },

    deleteInvoice(invoiceId) {
        return this.request(`/admin/invoices/${invoiceId}`, { method: 'DELETE' });
    },

    getReceipts() {
        return this.request('/admin/receipts');
    },

    verifyReceipt(receiptId) {
        return this.request(`/admin/receipts/${receiptId}/verify`, { method: 'POST' });
    },

    // Course Enrollment
    enrollStudents(courseId, studentIds) {
        return this.request('/admin/courses/enroll', {
            method: 'POST',
            body: JSON.stringify({ course_id: courseId, student_ids: studentIds })
        });
    },

    // Student specific lists
    getMyCourses() {
        return this.request('/student/courses');
    },

    getAssignments() {
        return this.request('/student/assignments');
    },

    getStudentAttendance() {
        return this.request('/student/attendance');
    },

    getStudentInvoices() {
        return this.request('/student/invoices');
    },

    submitReceipt(data) {
        const isFormData = data instanceof FormData;
        return this.request('/student/invoices/' + (isFormData ? data.get('invoice_id') : data.invoice_id) + '/submit-receipt', {
            method: 'POST',
            body: isFormData ? data : JSON.stringify(data),
            headers: isFormData ? {} : { 'Content-Type': 'application/json' }
        });
    },

    getStudentReceipts() {
        return this.request('/student/receipts');
    },

    // Employee specific
    getEmployeeTasks() {
        return this.request('/employee/tasks');
    },

    getEmployeeProjects() {
        return this.request('/employee/projects');
    },

    submitProjectWork(projectId, data) {
        return this.request(`/employee/projects/${projectId}/submit`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    submitInternClaim(data) {
        return this.request('/intern/claims', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // Client specific
    getClientProjects() {
        return this.request('/client/projects');
    },

    getClientInvoices() {
        return this.request('/client/invoices');
    },

    // Intern specific
    submitAssignment(assignmentId, data) {
        return this.request(`/student/assignments/${assignmentId}/submit`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    getInternTraining() {
        return this.request('/intern/training');
    },

    getInternTasks() {
        return this.request('/intern/tasks');
    },

    getInternInvoices() {
        return this.request('/intern/invoices');
    },

    // Common (Messaging & Meetings)
    getMessages() {
        return this.request('/common/messages');
    },

    sendMessage(receiverId, content) {
        return this.request('/common/messages', {
            method: 'POST',
            body: JSON.stringify({ receiver_id: receiverId, content: content })
        });
    },

    getMeetings() {
        return this.request('/common/meetings');
    },

    createMeeting(meetingData) {
        return this.request('/common/meetings', {
            method: 'POST',
            body: JSON.stringify(meetingData)
        });
    },

    getResources() {
        return this.request('/common/resources');
    }
};

// Map old MockAPI name to new PortalAPI for backward compatibility
const MockAPI = PortalAPI;

// Helper function to fetch dashboard data based on role
async function fetchDashboardData(role) {
    const dataFunctions = {
        admin: PortalAPI.getAdminDashboard,
        student: PortalAPI.getStudentDashboard,
        employee: PortalAPI.getEmployeeDashboard,
        client: PortalAPI.getClientDashboard,
        intern: PortalAPI.getInternDashboard
    };

    const fetchFunction = dataFunctions[role];
    if (!fetchFunction) {
        throw new Error(`No data function found for role: ${role}`);
    }

    return await fetchFunction.call(PortalAPI);
}
