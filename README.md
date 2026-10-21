# Smart Campus — College Management System (ERP)

Smart Campus is an enterprise-grade academic management system designed for colleges and universities. It centralizes operations across **Management**, **Heads of Departments (HOD)**, **Administration**, **Faculty**, and **Students**.

The application is grounded in the academic context of **B.Tech Computer Science and Engineering, Academic Session 2026–2027**.

---

## 🏛️ System User Hierarchy & Dashboards

Smart Campus provides tailored workspaces for each tier in the institutional hierarchy:

1. **Management Dashboard**:
   - Executive KPIs (Total Students: 1,284, Faculty: 86, Departments: 12, Attendance: 87.6%).
   - Department-level performance comparisons across branches.
   - Financial fee realization summary (₹42.8L collected, 92%).
   - Helpdesk grievance resolution status and NIRF / NAAC accreditation report generators.

2. **HOD Dashboard (Computer Science & Engineering)**:
   - Department student & faculty strength.
   - Faculty workload distribution and syllabus progression.
   - Faculty-subject allocations for CSE Semester 5 courses.
   - Departmental attendance trends with automated low-attendance defaulters alerts (< 75%).

3. **Admin Dashboard**:
   - Student and faculty account provisioning shortcuts.
   - Academic session and semester schedule configuration (Autumn 2026–2027).
   - Urgent grievance tickets triage and facility staff dispatch.
   - Fee ledger monitoring and circular management.

4. **Faculty Dashboard**:
   - Today's teaching schedule with room and period timing.
   - Instant 1-click **Mark Attendance** shortcut for current lectures.
   - Coursework assignment grading queue (e.g. Dynamic Programming & POSIX threads).
   - Mid-term exam invigilation assignments.

5. **Student Dashboard**:
   - Personalized student banner (Aarav Mehta, Roll No: `24CSE118`, CSE Sec A).
   - Real-time monthly attendance gauge with compliance indicator.
   - Today's lecture schedule in Aryabhatta Room 304.
   - Pending assignment deadlines, semester grade report, and fee clearance status.

---

## 📚 Core Modules

### 1. Attendance Management
- **Faculty Workflow**:
  - Class selector (`B.Tech CSE 5th Sem Sec A`), Subject selector (`CS501 Design & Analysis of Algorithms`), Date, and Session (`Lecture 02: 10:00 AM`).
  - Searchable student roster with Present / Absent toggles.
  - Bulk actions: **All Present**, **All Absent**, and Reset.
  - Live count of Present vs. Absent students.
  - Confirmation modal before register lock and saved records log.
- **Student Monthly View**:
  - Formula-based percentage calculation:  
    $$\text{Monthly Attendance \%} = \left(\frac{\text{Classes Attended during Month}}{\text{Classes Conducted during Month}}\right) \times 100$$
  - Subject-by-subject percentage breakdown with safety criteria (> 75% safe, < 75% warning).
  - Handles zero conducted classes with a clean `N/A` state without divide-by-zero errors.

### 2. Student & Faculty Management
- **Student Directory**: Search by name or roll number, filter by status, student profile drawers, and role-authorized registration forms.
- **Faculty Directory**: Faculty profiles, designations, educational qualifications, assigned subjects, and weekly teaching workload hours.

### 3. Academics (Departments, Classes & Subjects)
- Department overviews with HOD assignments and AICTE intake limits.
- Class sections with assigned mentors and lecture rooms.
- Course syllabus directory with credit units, theory/practical classification, and assigned instructors.

### 4. Timetable Management
- Day-by-day interactive timetable (Monday through Friday, 09:00 AM to 05:00 PM).
- Room numbers, period numbers, faculty names, and conflict-free verification badge.

### 5. Coursework & Assignments
- **Faculty**: Publish new assignments with deadlines and rubrics, view submissions list, grade student work, and enter qualitative feedback.
- **Student**: View deadline alerts, upload submission archives (`.zip`, `.pdf`), and view released grades and instructor feedback.

### 6. Examinations & Results
- Datesheet for Mid-Semester Examinations Autumn 2026 with exam halls and timings.
- Digital hall ticket download.
- Official Semester Grade Card displaying subject-wise internal, external, total marks, letter grades, SGPA (9.18), and CGPA (8.92).

### 7. Administrative Modules
- **Notices & Circulars**: Categorized by Academic, Exams, Events, and Administrative, with target audience scoping and pinned notices.
- **Complaints & Grievances**: Student private ticketing system, category & priority tags, and staff resolution workflow pipeline (*Submitted → Under Review → Assigned → In Progress → Resolved → Closed*).
- **Fee Records**: Itemized tuition statements, payment clearance status, receipts, and offline payment recording for administrators.
- **Campus Events**: Symposia, hackathons (*HackCampus 2026*), guest lectures, and RSVP tracking.
- **Reports & Audits**: Exportable tables and charts for attendance compliance, branch intake ratios, and SGPA distribution curves.

### 8. Enhanced AI & Navigation Features
- **Campus AI Assistant**: Modal dialog answering campus queries (timetable, attendance rules, assignments, exam dates) with official references and prompt chips.
- **Global Search (`⌘K`)**: Fast multi-entity search indexing students, faculty, courses, rooms, and notices.
- **Notifications Drawer**: Interactive slide-out notification center with unread count and mark-as-read controls.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16.4 (App Router)
- **Library**: React 19
- **Language**: TypeScript 5.7 (Strict Mode)
- **Styling**: Tailwind CSS v4 & custom design tokens
- **Icons**: Lucide React
- **Backend Communication**: Central REST API Client (`lib/api-client.ts`) with development mock fallback pointing to FastAPI at `http://localhost:8000/api`

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js v20+ (Node v24 tested)
- pnpm v11+ / npm v10+

### 2. Installation
```bash
pnpm install
```

### 3. Environment Variables
Create a `.env.local` file (or copy `.env.example`):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### 4. Running the Development Server
```bash
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build & Type Checking
```bash
# Verify TypeScript types
pnpm exec tsc --noEmit

# Compile production bundle
pnpm run build
```

---

## 🔐 Credentials & Demo Testing

To quickly test role-based perspectives on the `/login` page:
- **Management**: `director@smartcampus.edu` / `SmartCampus@2026`
- **HOD CSE**: `hod.cse@smartcampus.edu` / `SmartCampus@2026`
- **Faculty**: `arjun.kumar@smartcampus.edu` / `SmartCampus@2026`
- **Student**: `aarav.24cse118@smartcampus.edu` / `SmartCampus@2026`
- **Admin**: `admin.office@smartcampus.edu` / `SmartCampus@2026`

You can also switch roles on the fly using the avatar dropdown in the top header.
