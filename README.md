# WorkWise Assistant

# WORKWISE AI — AI-POWERED WORKPLACE PRODUCTIVITY ASSISTANT

Build a complete, professional and responsive web application called:

# WorkWise AI

### Tagline

**Your intelligent workplace productivity assistant.**

This is an academic AI productivity project based on the requirement to design and develop an AI-powered solution that addresses real-world workplace problems, uses AI tools effectively, demonstrates prompt engineering, improves productivity, and applies responsible AI practices.

The application must be built as **ONE integrated platform**.

Do NOT create separate unrelated applications.

All features must share the same:

* Branding
* Dashboard
* Navigation
* Design system
* AI assistant
* User experience
* Data/state where appropriate

---

# 1. PROJECT PURPOSE

WorkWise AI should help professionals reduce time spent on repetitive workplace activities such as:

* Planning tasks
* Prioritising workloads
* Summarising information
* Conducting research
* Drafting professional emails
* Summarising meeting notes
* Creating action items
* Asking workplace-related questions

The application should demonstrate how AI can improve workplace productivity while keeping humans responsible for reviewing AI-generated information and decisions.

---

# 2. REQUIRED AI FEATURES

The application MUST include these three primary AI-powered features:

### 1. AI Task Planner / Scheduler

* Generate daily plans
* Generate weekly plans
* Prioritise tasks based on urgency and importance
* Consider deadlines
* Consider estimated duration
* Suggest time optimisation strategies

### 2. AI Research Assistant

* Summarise articles, reports, topics or supplied text
* Extract key insights
* Provide recommendations
* Simplify complex information

### 3. AI Workplace Chatbot

* Interactive workplace assistant
* Multiple user prompts and responses
* Conversational interface
* Workplace productivity assistance

---

# 3. ADDITIONAL WORKPLACE AI CAPABILITIES

To strengthen the application, include additional capabilities INSIDE the AI Workplace Chat rather than creating separate applications.

The chatbot should provide quick actions for:

### Write Professional Email

Generate context-based professional emails.

Allow:

* Formal
* Informal
* Persuasive

Allow the user to specify the audience:

* Client
* Manager
* Team
* Colleague

### Summarise Meeting Notes

Allow users to paste meeting notes and generate:

* Concise summary
* Key points
* Decisions
* Action items
* Responsibilities
* Deadlines

### Create Action Items

Convert workplace notes or conversations into structured tasks.

### Create Meeting Agenda

Generate a professional meeting agenda from a topic, purpose and participants.

These are additional capabilities and must remain integrated into WorkWise AI.

---

# 4. APPLICATION NAVIGATION

Create a professional sidebar navigation.

Navigation items:

1. Dashboard
2. AI Task Planner
3. AI Research Assistant
4. AI Workplace Chat
5. Responsible AI
6. Settings

Use appropriate icons.

The current page must be visually highlighted.

On mobile devices, convert the sidebar into a hamburger/mobile navigation menu.

---

# 5. DASHBOARD

Create the main WorkWise AI dashboard.

Display:

**Good morning, [User Name]**

**Let's make today productive.**

Show the current date.

Create summary cards:

### Today's Tasks

Number of tasks planned.

### High Priority

Number of high-priority tasks.

### Completed

Number of completed tasks.

### AI Assistance

Number of AI-assisted actions during the current session.

---

## Today's Schedule

Display the user's current schedule.

Each task should show:

* Time
* Task
* Priority
* Duration
* Status

Use visual indicators for:

* High
* Medium
* Low
* Completed
* Pending

---

## Quick AI Actions

Create buttons:

**Plan My Day**

**Research a Topic**

**Ask AI**

**Write an Email**

**Summarise Meeting**

These should navigate to or activate the appropriate functionality.

---

# 6. AI TASK PLANNER

Page title:

**AI Task Planner**

Subtitle:

**Turn your workload into a structured and prioritised schedule.**

Create an easy-to-use task input system.

Users should be able to enter:

* Task name
* Description
* Deadline
* Estimated duration
* Priority
* Optional notes

Priority options:

* High
* Medium
* Low

Allow users to specify:

* Working start time
* Working end time
* Break duration
* Important deadlines

Also provide a large text area:

### What do you need to accomplish?

Example:

"Finish the monthly report, prepare for the team meeting, respond to client emails, analyse sales data and complete my presentation."

Button:

**Generate AI Schedule**

---

# 7. AI TASK PLANNER PROMPT ENGINEERING

Use a structured AI prompt.

The AI should receive:

### ROLE

You are a professional workplace productivity and scheduling assistant.

### CONTEXT

Use the user's tasks, deadlines, estimated durations, priorities and available working hours.

### TASK

Create a realistic and prioritised schedule.

### CONSTRAINTS

* Do not overlap tasks.
* Respect working hours.
* Consider deadlines.
* Consider urgency and importance.
* Include reasonable breaks.
* Avoid unrealistic workloads.
* Do not assume missing information.
* Identify conflicts.
* Identify tasks that may need to be postponed.

### OUTPUT FORMAT

Return:

1. Recommended Schedule
2. AI Prioritisation
3. Potential Conflicts
4. Productivity Suggestions
5. Deferred Tasks if necessary

---

# 8. GENERATED TASK SCHEDULE

Display the AI result in a professional schedule/table.

Columns:

| Time | Task | Priority | Duration | Status |

Allow the user to:

* Complete task
* Edit task
* Delete task
* Change priority

Show daily progress.

Example:

**Daily Progress**

6 of 10 tasks completed

Include a visual progress indicator.

If the AI determines that too many tasks have been provided for the available time, clearly identify the tasks that could be postponed.

---

# 9. AI RESEARCH ASSISTANT

Page title:

**AI Research Assistant**

Subtitle:

**Understand information faster with AI-powered research assistance.**

Provide a large input area.

Users can enter:

* Topic
* Article
* Report
* Notes
* Workplace information
* Question

Create research modes:

### Summarise

Create a concise summary.

### Explain

Explain the subject in simple language.

### Key Insights

Extract important findings.

### Recommendations

Provide practical recommendations.

### Questions

Generate follow-up research questions.

### Action Points

Convert information into practical workplace actions.

---

# 10. RESEARCH PROMPT STRUCTURE

Use structured prompts containing:

### ROLE

You are an AI research and information assistant.

### CONTEXT

The user has supplied information that needs to be understood or analysed.

### TASK

Perform the selected research function.

### CONSTRAINTS

* Base source-specific responses primarily on the supplied content.
* Do not invent facts.
* Do not present assumptions as facts.
* Clearly identify insufficient information.
* Separate factual summaries from recommendations.
* Encourage verification of important information.

### OUTPUT

Use clear headings, bullet points and structured information.

For example:

### Summary

### Key Points

### Important Findings

### Recommendations

### Considerations

---

# 11. IMPORTANT RESEARCH LIMITATION

Do NOT make the application pretend that it has searched the internet or external databases unless an actual search/API integration is implemented.

If the user only provides text, analyse the supplied text.

If no source information is supplied and the user asks a general question, clearly indicate that the response is a general AI-generated response rather than a verified source-based research result.

Display:

**AI-generated research assistance should be reviewed and verified before being used for important workplace decisions.**

---

# 12. AI WORKPLACE CHAT

Page title:

**AI Workplace Assistant**

Subtitle:

**Your conversational AI assistant for everyday workplace tasks.**

Create a modern chat interface.

Include:

* User messages
* AI responses
* Timestamps
* Loading indicator
* Message input
* Send button
* Clear conversation option

The assistant should maintain context during the current conversation.

---

# 13. CHAT QUICK ACTIONS

Display convenient quick-action buttons:

### Plan My Day

Open/use the AI Task Planner.

### Write an Email

Activate the professional email generator.

### Summarise Meeting

Activate meeting-note summarisation.

### Create Action Items

Convert information into tasks.

### Prepare Meeting Agenda

Generate an agenda.

### Research Topic

Open/use the Research Assistant.

### Explain a Topic

Ask the AI to explain information simply.

---

# 14. PROFESSIONAL EMAIL GENERATOR

Inside AI Workplace Chat, provide an email-generation mode.

Inputs:

### Recipient Type

* Client
* Manager
* Team
* Colleague

### Tone

* Formal
* Informal
* Persuasive

### Purpose

Text area.

### Important Information

Text area.

Button:

**Generate Email**

Output:

### Generated Email

Allow:

**Copy Email**

The AI should produce professional, clear and appropriate workplace communication.

---

# 15. MEETING NOTES SUMMARISER

Inside AI Workplace Chat, provide a meeting summarisation mode.

Input:

### Paste Meeting Notes

Button:

**Summarise Meeting**

Output:

### Meeting Summary

### Key Points

### Decisions

### Action Items

### Responsibilities

### Deadlines

The AI should not invent decisions, responsibilities or deadlines that are not contained in the supplied notes.

If information is missing, state:

**Not specified in the provided notes.**

---

# 16. AI WORKPLACE ASSISTANT SYSTEM PROMPT

Configure the main AI assistant as:

**A professional workplace productivity assistant.**

The assistant should:

* Be helpful
* Be professional
* Be concise but useful
* Ask for clarification when necessary
* Avoid fabricating information
* Distinguish facts from suggestions
* Protect confidential information
* Avoid making high-stakes decisions on behalf of users
* Encourage human review
* Clearly identify limitations
* Help users organise and improve their work

The AI must not pretend to be a human employee.

The AI must not claim to have completed external actions unless those actions were actually performed.

---

# 17. PROMPT ENGINEERING DEMONSTRATION

Because prompt engineering is a major component of this academic project, include an expandable section called:

## How the AI Works

Explain that WorkWise AI uses structured prompts based on:

1. Role
2. Context
3. Task
4. Constraints
5. Output Format
6. Validation

Show an example prompt structure.

Example:

**Role:** Professional workplace productivity assistant.

**Context:** User's tasks, deadlines and working hours.

**Task:** Create a realistic schedule.

**Constraints:** Avoid overlapping tasks, respect working hours and include breaks.

**Output:** Structured schedule with prioritisation reasoning and conflicts.

**Validation:** Identify unrealistic workloads and information requiring user confirmation.

Do not expose API keys, secrets or private system credentials.

---

# 18. PROMPT TESTING / REFINEMENT

Include a small educational section demonstrating that prompts can be refined.

Show:

### Basic Prompt

"Plan my day."

Then:

### Improved Prompt

"Act as a workplace productivity assistant. Organise the following tasks according to urgency, importance, deadlines and estimated duration. Respect my working hours, avoid overlapping tasks, include reasonable breaks and identify tasks that cannot realistically fit into the day."

Then explain:

**Why the improved prompt is better:**

* Provides a clear role
* Provides context
* Defines the task
* Adds constraints
* Specifies the desired output
* Reduces ambiguity

This helps demonstrate the project's prompt-engineering requirement.

---

# 19. RESPONSIBLE AI

Create a dedicated:

# Responsible AI

page.

Include the following sections.

### Human Oversight

AI-generated content should be reviewed by a human before important decisions are made.

### Accuracy and Limitations

AI can generate incorrect, incomplete or outdated information.

Users must verify important information.

### Privacy

Users should not enter confidential, sensitive, personal, financial, medical, password or proprietary company information unless the system has been specifically approved and configured to handle it.

### Bias

AI systems may reproduce biases present in their training data or inputs.

Users should critically review outputs.

### Transparency

Clearly identify AI-generated content.

### Appropriate Use

WorkWise AI is designed to assist productivity and should not replace human judgement.

---

## Responsible AI Disclaimer

Display prominently:

**Responsible AI Notice: WorkWise AI provides AI-generated assistance. Users remain responsible for reviewing, verifying and making final decisions based on AI-generated information.**

---

# 20. VALIDATION AND SAFETY

Where appropriate, encourage users to:

* Verify important information
* Review AI-generated emails before sending
* Check AI-generated schedules
* Verify research information
* Confirm meeting decisions and responsibilities
* Avoid entering confidential information

Do not allow the AI to present uncertain information as guaranteed fact.

---

# 21. SETTINGS

Create a Settings page.

### User Profile

* Name
* Workplace role

### Working Preferences

* Working start time
* Working end time
* Break duration

### Productivity Preferences

* Default task priority
* Preferred response length

Response options:

* Concise
* Balanced
* Detailed

### Appearance

* Light
* Dark
* System

Button:

**Save Preferences**

---

# 22. RESPONSIVE DESIGN

The entire application must work properly on:

* Desktop
* Laptop
* Tablet
* Mobile

On mobile:

* Sidebar becomes a hamburger menu
* Cards stack vertically
* Tables remain usable
* Chat fits the screen
* Buttons are easy to tap
* Inputs resize appropriately

Test all major pages at mobile and desktop sizes.

---

# 23. PROFESSIONAL UI/UX

Use a polished modern workplace SaaS design.

Use:

* Clean backgrounds
* Professional typography
* Consistent spacing
* Rounded cards
* Subtle borders
* Professional icons
* Clear buttons
* Consistent visual hierarchy
* Subtle hover effects
* Minimal animations

Do not make the application look like a generic chatbot.

It should look like a complete workplace productivity platform.

Prioritise usability over excessive visual effects.

---

# 24. LOADING AND ERROR STATES

Every AI operation should provide a loading state.

Example:

**AI is analysing your request...**

If an AI request fails:

**We couldn't generate a response right now. Please try again.**

If required input is missing:

**Please provide some information before continuing.**

Do not expose technical errors, API keys or internal implementation details.

---

# 25. AI API SECURITY

If an external AI API is used:

* Never hard-code API keys.
* Never expose API keys in frontend code.
* Use environment variables/secrets.
* Keep sensitive credentials out of GitHub.
* Provide clear configuration instructions.
* Ensure `.env` files are included in `.gitignore`.

The application must be prepared for safe GitHub publication.

---

# 26. GITHUB READINESS

Prepare the project for GitHub.

Create a professional README containing:

# WorkWise AI

## Project Overview

## Problem Statement

## Solution

## Key Features

## AI Features

## Prompt Engineering Approach

## Responsible AI

## Technologies Used

## Installation

## Environment Variables

## Usage

## Project Structure

## Challenges and Solutions

## Future Improvements

Do not include:

* API keys
* Passwords
* Tokens
* Private credentials
* Sensitive personal information

---

# 27. PROJECT PROBLEM STATEMENT

Use this as the application's documented problem statement:

**Professionals across industries spend significant time on repetitive workplace tasks such as planning schedules, summarising information, conducting research, drafting emails and organising meeting information. WorkWise AI addresses this challenge by providing an integrated AI-powered workplace assistant that helps users organise tasks, understand information and automate common productivity activities while maintaining human oversight.**

---

# 28. SOLUTION OVERVIEW

Use this concept:

**WorkWise AI is an integrated AI-powered workplace productivity assistant that combines task planning, research assistance and conversational workplace support in one platform. The application uses structured prompts to generate schedules, summarise information, provide insights, draft professional communication and transform meeting information into actionable tasks. Responsible AI principles are incorporated through transparency, validation, privacy guidance, human oversight and clear AI limitations.**

---

# 29. PRODUCTIVITY VALUE

The application should clearly demonstrate productivity improvement.

Show users how AI can help:

* Reduce time spent organising tasks
* Prioritise workloads
* Quickly understand lengthy information
* Generate first drafts of workplace communication
* Convert meeting notes into actionable tasks
* Obtain workplace assistance through conversation

Do not claim specific percentage productivity improvements unless actual testing has produced evidence.

Instead, demonstrate productivity value through the functionality and workflow.

---

# 30. ACADEMIC PROJECT ALIGNMENT

The application must visibly demonstrate:

### Problem Relevance

A practical workplace productivity problem.

### AI Implementation

Real AI functionality used to assist workplace tasks.

### Prompt Engineering

Structured prompts, prompt refinement and clear output requirements.

### Functionality

Useful and understandable AI-generated outputs.

### Innovation

Multiple workplace productivity capabilities integrated into one platform.

### Responsible AI

Limitations, bias, privacy, validation and human oversight.

### Presentation

Professional interface suitable for a live demonstration.

---

# 31. PROJECT DELIVERABLE SUPPORT

The project should support the following deliverables:

### AI Solution / Prototype

The WorkWise AI application.

### Tool / Workflow / Interface

A functional dashboard demonstrating the AI features.

### Documentation

The project documentation should be able to explain:

* Problem statement
* Solution overview
* Tools used
* Sample prompts
* Challenges
* Solutions
* Responsible AI approach

### Presentation

The application should be suitable for a live walkthrough/demo.

---

# 32. FINAL APPLICATION STRUCTURE

The final navigation should be:

WORKWISE AI

├── Dashboard
│   ├── Today's Tasks
│   ├── Productivity Overview
│   └── Quick AI Actions
│
├── AI Task Planner
│   ├── Task Input
│   ├── AI Schedule
│   ├── Prioritisation
│   └── Productivity Suggestions
│
├── AI Research Assistant
│   ├── Summarise
│   ├── Explain
│   ├── Key Insights
│   ├── Recommendations
│   └── Action Points
│
├── AI Workplace Chat
│   ├── General AI Chat
│   ├── Write Email
│   ├── Summarise Meeting
│   ├── Create Action Items
│   └── Meeting Agenda
│
├── Responsible AI
│   ├── Human Oversight
│   ├── Accuracy
│   ├── Privacy
│   ├── Bias
│   ├── Transparency
│   └── AI Disclaimer
│
└── Settings
├── Profile
├── Working Preferences
├── AI Preferences
└── Appearance

---

# 33. FINAL QUALITY CHECK

Before considering the application complete, verify:

* All navigation works.
* All required pages exist.
* AI Task Planner works.
* AI Research Assistant works.
* AI Workplace Chat works.
* Email generation works.
* Meeting summarisation works.
* Action-item generation works.
* AI outputs are clearly displayed.
* Prompt engineering is demonstrated.
* Responsible AI information is visible.
* Loading states exist.
* Error states exist.
* Empty states exist.
* Mobile responsiveness works.
* Desktop responsiveness works.
* The interface looks professional.
* No API keys are exposed.
* The application is GitHub-ready.
* The application clearly demonstrates workplace productivity value.

Most importantly:

**This must remain ONE integrated WorkWise AI application, not multiple separate projects.**

Build the application as a polished, presentation-ready academic project that demonstrates practical AI implementation, prompt engineering, workplace productivity, innovation and responsible AI.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://work-focus-ai.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/89eed98c-b788-5241-b696-7e5b14201155).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
