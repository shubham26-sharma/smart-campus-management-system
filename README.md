# Smart Campus

A role-based, web-based **Smart Campus Management System** designed to
centralize academic and administrative workflows for a college in one
platform.

## Overview

Smart Campus aims to reduce fragmented records, repetitive manual work,
and delays in campus communication through role-specific dashboards and
structured workflows.

**User hierarchy:** Management → HOD → Admin → Faculty → Students

> **Scope note:** The Attendance module is explicitly excluded from this
> project.

## Objectives

-   Centralize authorized campus information and common workflows.
-   Provide role-specific dashboards and permissions.
-   Manage academic structure, timetables, assignments, examinations,
    results, notices, and campus service requests.
-   Improve traceability through request statuses, reports, and audit
    logs.
-   Provide a responsive interface for desktop, tablet, and mobile
    browsers.
-   Evaluate functionality, security, usability, and data integrity
    through testing.

## User Roles

  -----------------------------------------------------------------------
  Role                                Main responsibilities
  ----------------------------------- -----------------------------------
  **Management**                      View institution-wide summaries and
                                      approved reports; oversee
                                      departmental operations.

  **HOD**                             Supervise department-level records,
                                      academic planning, notices, and
                                      reports.

  **Admin**                           Maintain authorized operational
                                      records, academic structure, fee
                                      records, schedules, and service
                                      workflows.

  **Faculty**                         Manage assigned subjects,
                                      assignments, submissions, marks,
                                      learning resources, and class
                                      notices.

  **Students**                        View permitted personal academic
                                      information, timetable,
                                      assignments, exam schedule,
                                      released results, notices, and
                                      request status.
  -----------------------------------------------------------------------

Permissions must be enforced on the server/API, not only by hiding
interface elements.

## Planned Modules

-   Authentication, user profiles, and role/permission management
-   Student and faculty management
-   Department, program, class, section, subject, and room management
-   Timetable management with faculty/class/room conflict checks
-   Assignments, submissions, and learning resources
-   Examination schedules, marks, and results
-   Notices and announcements
-   Complaints and helpdesk tickets
-   Fee records and payment-status tracking
-   Events and campus service requests
-   Dashboards, reports, and analytics
-   Optional AI campus assistant for questions grounded in approved
    college documents

### Excluded

-   Attendance recording, attendance percentages, attendance reports,
    and attendance-related workflows
-   Unapproved access to real student or faculty data
-   Autonomous AI decisions about marks, fees, discipline, or other
    high-impact matters

## Proposed Technology Stack

  -----------------------------------------------------------------------
  Layer                   Technology              Purpose
  ----------------------- ----------------------- -----------------------
  Frontend                Next.js, React,         Responsive dashboards
                          TypeScript              and user interface

  Styling                 Tailwind CSS            Consistent responsive
                                                  design

  Backend/API             Python, FastAPI         Business logic and REST
                                                  APIs

  Database                PostgreSQL              Structured records and
                                                  relationships

  Charts                  Recharts or equivalent  Dashboard
                                                  visualizations

  AI integration          Gemini API or an        Campus document Q&A
  (optional)              approved model          

  Development             Visual Studio Code,     Coding and version
                          Git, GitHub             control

  Testing                 Unit, API integration,  Verify correctness and
                          role/permission, and    access control
                          usability tests         
  -----------------------------------------------------------------------

The stack is proposed and may be refined during implementation with
faculty guidance.

## High-Level Architecture

1.  **Presentation layer:** Role-specific web dashboards, forms, tables,
    and notifications.
2.  **API/application layer:** Authentication, authorization,
    validation, business rules, workflows, and reporting.
3.  **Data layer:** PostgreSQL database with relationships, constraints,
    indexes, and migrations.
4.  **Optional integration layer:** Approved AI document Q&A and
    notification services.
5.  **Operations and security:** HTTPS, environment-based secrets,
    backups, logs, and access reviews.

## Getting Started

Repository setup and implementation are in progress. Add verified
installation commands here once the source code and dependency files are
available.

### Prerequisites

-   Node.js and a package manager compatible with the frontend project
-   Python 3.10+ (confirm against backend configuration)
-   PostgreSQL
-   Git

### Planned local setup

1.  Clone the repository.
2.  Configure frontend and backend environment variables using example
    environment files.
3.  Create a PostgreSQL database and apply project migrations.
4.  Install frontend and backend dependencies.
5.  Start the API and frontend development servers.
6.  Sign in with development test accounts for each role.

Do not commit passwords, API keys, database credentials, production
data, or `.env` files. Use a `.env.example` with placeholders only.

## Semester III Deliverables

By the end of Week 12, the planned outcomes are:

1.  **Requirement analysis:** Problem statement, scope, user roles,
    functional requirements, and use cases.
2.  **System design:** Architecture, ER diagram, database schema draft,
    workflow diagrams, and UI wireframes.
3.  **Initial prototype and documentation:** Demonstrable core
    screens/workflows, preliminary testing evidence, project report, and
    review presentation.

## Development Roadmap

-   **Semester 3:** Requirements, architecture, database design,
    wireframes, prototype, and documentation.
-   **Semester 4:** Authentication, RBAC, profiles, academic structure,
    and foundational workflows.
-   **Semester 5:** Timetable, assignments, examinations/results,
    notices, and helpdesk.
-   **Semester 6:** Reports, fee records, events/services, audit trail,
    and optional AI prototype.
-   **Semester 7:** Pilot deployment, usability feedback,
    security/performance testing, and fixes.
-   **Semester 8:** Final validation, documentation, demonstration, and
    handover.

## Security and Privacy

-   Enforce least-privilege access and validate permissions on every
    protected API operation.
-   Hash passwords with a suitable password-hashing algorithm; never
    store plaintext passwords.
-   Validate inputs, protect secrets, use HTTPS in deployed
    environments, and maintain appropriate audit logs.
-   Use synthetic or authorized test data during development.
-   Restrict AI integrations to approved information and avoid sending
    unnecessary personal data.
-   Maintain backups and document recovery procedures.

## Testing Plan

-   Authentication and account-access tests
-   Role and permission tests across all five roles
-   CRUD and input-validation tests
-   Timetable conflict validation
-   Assignment submission and result-publication workflow tests
-   Complaint/service-request status tests
-   Database integrity and error-handling tests
-   Responsive UI, usability, and basic performance tests

Record actual test results and known limitations; do not report
unmeasured performance or success rates.

## Repository Structure (Proposed)

``` text
smart-campus/
├── frontend/          # Next.js application
├── backend/           # FastAPI application
├── docs/              # Requirements, diagrams, reports, and user guide
├── tests/             # Automated and manual test assets
├── .gitignore
└── README.md
```

Adjust this structure to match the actual repository as implementation
evolves.

## Project Status

**Current focus:** Semester III requirements, architecture, database
design, initial prototype, and documentation.

Features described as planned are not necessarily implemented yet.
Update this README as modules are built and tested.

## Contributing

1.  Create a feature branch.
2.  Make a focused change and add or update tests.
3.  Run relevant checks locally.
4.  Open a pull request describing the change, test evidence, and
    database/configuration updates.
5.  Never include secrets or real personal records in commits.

## License

No license has been selected yet. Add a license only after the project
team or institution decides how the source code may be used and
distributed.

## Acknowledgment

Developed as a B.Tech Computer Science and Engineering semester-wise
project. Add faculty guide, student team, and institutional details
after confirmation.
