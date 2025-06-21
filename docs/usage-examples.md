---
title: "Usage Examples"
description: "Practical examples and tutorials for using Zulip MCP Server effectively"
---

**Navigation:** [Home](index) | [Installation](installation) | [API Reference](api-reference) | [Configuration](configuration) | [Troubleshooting](troubleshooting)

# Usage Examples & Tutorials

Practical examples and real-world use cases for the Zulip MCP Server across different teams and workflows.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Team Workflows](#development-team-workflows)
- [Customer Success Operations](#customer-success-operations)
- [Project Management](#project-management)
- [Sales Team Automation](#sales-team-automation)
- [Advanced Use Cases](#advanced-use-cases)

---

## Getting Started

### First Steps with Your LLM

Once configured, start with these basic interactions:

#### 1. Test Your Connection

```
You: "Can you check if Zulip is connected and show me what streams are available?"

LLM Response: I'll test the Zulip connection and get an overview of your workspace.

[Uses get-started tool]

✅ Connected to Zulip successfully! 
Your workspace has 15 streams available including: general, development, announcements, customer-success, and random.
```

#### 2. Find Team Members

```
You: "Can you find all users with 'john' in their name?"

LLM Response: I'll search for users with 'john' in their name.

[Uses search-users tool]

Found 3 users matching "john":
- John Smith (john.smith@company.com) - Active
- Johnny Doe (johnny.doe@company.com) - Active  
- John Admin (john@company.com) - Active, Admin role
```

#### 3. Send Your First Message

```
You: "Send a hello message to the general stream introducing myself as the new AI assistant"

LLM Response: I'll send an introduction message to the general stream.

[Uses send-message tool]

Message sent successfully! I've introduced you as the new AI assistant to the team in the general stream.
```

---

## Development Team Workflows

### Deployment Notifications

#### Automated Build Status Updates

```
You: "Our CI/CD pipeline just completed successfully. Send an update to the #development stream with the topic 'Deployments' including:
- Version: v2.3.1
- Environment: Production
- Status: ✅ Success
- Features: Added user dashboard, fixed payment bugs
- Rollback plan: Available if needed"

LLM Response: I'll send a comprehensive deployment notification to the development stream.

[Uses send-message tool with formatted content]

Deployment notification sent! The team has been informed about the successful v2.3.1 production deployment with all the details you specified.
```

#### Code Review Requests

```
You: "I need to request code review for PR #234. Send a message to @john.smith and @sarah.dev asking them to review the authentication refactor PR. Include the GitHub link: https://github.com/company/app/pull/234"

LLM Response: I'll send a direct message to both John and Sarah requesting the code review.

[Uses send-message tool with type: "direct"]

Code review request sent! Both John Smith and Sarah have been notified about PR #234 and asked to review the authentication refactor.
```

#### Error Monitoring Alerts

```
You: "We're seeing 5xx errors spike on the API. Send an urgent message to the #development stream with topic 'Incidents' asking the on-call engineer to investigate. Include:
- Time: Started 10 minutes ago
- Affected endpoints: /api/payments, /api/users
- Error rate: 15% of requests
- Monitoring dashboard: [link]"

LLM Response: I'll send an urgent incident notification to alert the development team.

[Uses send-message tool with formatted alert]

Incident alert sent! The development team has been notified about the 5xx error spike and the on-call engineer should see this immediately.
```

### Release Planning

```
You: "Create a release planning message for the #development stream. We're planning v2.4.0 for next Friday. Ask team leads to confirm their feature completion status for:
- User onboarding flow (Sarah's team)
- Payment processing updates (Mike's team)  
- Mobile API improvements (Lisa's team)
- Security audit fixes (Security team)"

LLM Response: I'll create a comprehensive release planning message to coordinate with all team leads.

[Uses send-message tool with structured planning format]

Release planning message sent! All team leads have been asked to confirm their feature completion status for the v2.4.0 release next Friday.
```

---

## Customer Success Operations

### Customer Health Check Summaries

#### Weekly Health Reports

```
You: "Generate a weekly customer health check summary for the #customer-success stream. Include these metrics:
- Total active customers: 1,247 (+23 this week)
- At-risk accounts: 8 (down from 12 last week)
- Expansion opportunities: 15 accounts showing usage growth
- Support ticket trends: 15% decrease in critical issues
- Key wins: 3 major renewals, 2 upsells completed"

LLM Response: I'll create a comprehensive weekly health check summary for the customer success team.

[Uses send-message tool with formatted metrics]

Weekly health check summary posted! The customer success team now has a clear overview of customer health metrics and key achievements.
```

#### Escalation Notifications

```
You: "Customer Acme Corp (Enterprise plan) is reporting critical issues with data sync. Create an escalation notice for #customer-success with topic 'Escalations':
- Customer: Acme Corp
- Plan: Enterprise ($50k ARR)
- Issue: Data sync failing for 2 hours
- Impact: Production workflows blocked
- Contact: jane.doe@acme.com
- Assigned CSM: @sarah.johnson
- Next action: Engineering escalation needed"

LLM Response: I'll create an immediate escalation notice for the customer success team.

[Uses send-message tool with urgent escalation format]

Escalation notice sent! The customer success team has been alerted about Acme Corp's critical data sync issue and Sarah Johnson has been notified as the assigned CSM.
```

### Customer Feedback Collection

```
You: "Post a message in #customer-success asking for this week's customer feedback highlights. Request team members to share:
- Top feature requests from customer calls
- Common pain points mentioned
- Positive feedback and testimonials
- Competitive mentions or concerns
Format it as a collaborative thread for easy responses."

LLM Response: I'll create a collaborative feedback collection post for the team.

[Uses send-message tool with engaging format]

Feedback collection message posted! The customer success team can now easily share this week's customer insights in a structured thread format.
```

---

## Project Management

### Sprint Planning & Updates

#### Sprint Retrospective Summary

```
You: "Create a sprint retrospective summary for #development with topic 'Sprint 23 Retro':
- Sprint goal: ✅ User dashboard completion
- Stories completed: 24/26 (92% completion rate)
- Velocity: 87 story points (target: 85)
- What went well: Great collaboration, early testing
- Challenges: API rate limiting, design changes
- Action items: Implement rate limiting strategy, earlier design reviews
- Next sprint focus: Mobile app improvements"

LLM Response: I'll create a comprehensive sprint retrospective summary for the team.

[Uses send-message tool with structured retrospective format]

Sprint retrospective summary posted! The development team now has a clear record of Sprint 23 outcomes and action items for improvement.
```

#### Milestone Tracking

```
You: "Send an update to #general about our Q3 milestone progress:
- Overall progress: 75% complete (on track)
- Key achievements: User dashboard launched, API v2 stable
- Upcoming deliverables: Mobile app beta (next week), payment flow redesign (2 weeks)
- Blockers resolved: Database performance issues fixed
- Team spotlight: Congratulations to the backend team for exceptional performance!"

LLM Response: I'll create an engaging Q3 milestone update for the entire company.

[Uses send-message tool with milestone tracking format]

Q3 milestone update sent! The entire company is now informed about our progress and the backend team has been recognized for their excellent work.
```

### Resource Planning

```
You: "Create a resource planning discussion for #project-management with topic 'Q4 Planning':
- Current team capacity: 85% utilization
- New hires starting: 2 frontend developers (Oct 1), 1 designer (Oct 15)
- Major projects: Mobile app launch, enterprise features, security compliance
- Resource needs assessment: Additional backend support for enterprise features
- Please share your team's capacity and resource needs for Q4 planning"

LLM Response: I'll create a comprehensive resource planning discussion to help coordinate Q4 efforts.

[Uses send-message tool with planning format]

Resource planning discussion started! Project managers can now share their team capacity and resource needs for effective Q4 planning.
```

---

## Sales Team Automation

### Deal Updates & Pipeline Management

#### Weekly Pipeline Review

```
You: "Create a weekly pipeline review for #sales with topic 'Pipeline Review - Week 42':
- Total pipeline value: $2.3M (up 15% from last week)
- Deals in closing stage: 8 opportunities ($340k value)
- New leads this week: 23 qualified leads
- Demo requests: 12 scheduled
- Key wins: Closed deal with TechCorp ($85k ARR)
- Focus areas: Follow up on Q3 proposals, prepare Q4 campaigns
Tag @sales.manager for review"

LLM Response: I'll create a comprehensive weekly pipeline review for the sales team.

[Uses send-message tool with pipeline metrics and mentions]

Weekly pipeline review posted! The sales team has a clear overview of this week's performance and the sales manager has been tagged for review.
```

#### Lead Qualification Alerts

```
You: "New enterprise lead came in through the website. Send alert to #sales with topic 'Hot Leads':
- Company: Global Industries Inc.
- Contact: Mark Johnson, CTO
- Company size: 5,000+ employees  
- Use case: API integration for customer data
- Budget indicated: $100k+ annually
- Timeline: Implementation needed by Q1
- Lead score: 95/100 (hot lead!)
- Next step: Demo call scheduled for tomorrow 2 PM
Assign to @senior.sales.rep for immediate follow-up"

LLM Response: I'll create an immediate hot lead alert for the sales team.

[Uses send-message tool with urgent lead notification]

Hot lead alert sent! The sales team has been notified about Global Industries Inc. and the senior sales rep has been assigned for immediate follow-up.
```

### Customer Onboarding

```
You: "New customer TechStart just signed! Create onboarding announcement for #sales with topic 'New Customers':
- Customer: TechStart (Startup plan)
- Deal value: $24k annually
- Sales rep: @jenny.sales
- Implementation timeline: 30 days
- Key requirements: Slack integration, custom dashboards
- Success criteria: 80% team adoption in first month
- Onboarding kickoff: Scheduled for Monday 10 AM
- CSM assigned: @alex.success
Congratulate Jenny on closing this deal!"

LLM Response: I'll create a celebratory new customer announcement with all the onboarding details.

[Uses send-message tool with onboarding information and congratulations]

New customer announcement sent! Jenny has been congratulated on the TechStart deal and the team has all the onboarding information they need.
```

---

## Advanced Use Cases

### Automated Workflows

#### Integration with External Systems

```
You: "Our monitoring system detected that API response times are above 500ms. Check recent messages in #development for any related discussions, then send an alert about potential performance issues."

LLM Response: I'll check recent development messages for context and then send a performance alert.

[Uses get-messages tool to search development stream]
[Then uses send-message tool to create alert with context]

I found related discussions about database queries in the development stream. I've sent a performance alert that references the ongoing database optimization work and suggests coordination between teams.
```

#### Multi-Stream Coordination

```
You: "We have a customer-reported security issue. Send coordinated messages to:
1. #security-team: Technical details and immediate investigation request
2. #customer-success: Customer communication strategy  
3. #leadership: Executive summary and timeline
4. #development: Engineering response coordination
Ensure each team gets relevant information for their role."

LLM Response: I'll send coordinated messages to all four teams with role-specific information about the security issue.

[Uses multiple send-message tool calls with different content for each team]

Coordinated security response initiated! All four teams have been notified with appropriate details for their roles in addressing this customer-reported security issue.
```

### Data Collection & Analysis

#### Survey and Feedback Compilation

```
You: "Search the last 30 days of messages in #customer-success for mentions of 'feature request' and 'customer feedback'. Compile a summary of the most requested features."

LLM Response: I'll search through recent customer success messages to identify and compile feature requests.

[Uses get-messages tool with search parameters]
[Analyzes results and creates summary]

Based on 30 days of customer success messages, here are the top feature requests:
1. Advanced reporting (mentioned 8 times)
2. Mobile app improvements (mentioned 6 times)  
3. API rate limit increases (mentioned 5 times)
4. SSO integration (mentioned 4 times)
5. Custom dashboard widgets (mentioned 3 times)

Would you like me to send this summary to the product team?
```

#### Team Performance Insights

```
You: "Analyze message patterns in #development over the past week. Look for:
- Most active discussion topics
- Peak activity times
- Team collaboration patterns
- Any signs of blockers or concerns"

LLM Response: I'll analyze recent development team communication patterns to provide insights.

[Uses get-messages tool with various search parameters]
[Analyzes patterns and generates insights]

Development team analysis for the past week:
- Most active topics: Database optimization (25 messages), Code review process (18 messages)
- Peak activity: Tuesday-Thursday, 10 AM - 2 PM
- High collaboration: Backend and frontend teams working closely on API integration
- Potential concerns: 3 mentions of testing environment issues
- Positive indicators: Quick resolution times, proactive help between team members

This suggests a healthy, collaborative team with minor infrastructure concerns to address.
```

### Custom Automation Scripts

#### Daily Standups

```
You: "It's Monday morning. Create a standup prompt for #development asking each team member to share:
- What they completed last week
- What they're working on this week  
- Any blockers or help needed
- One team win or learning to celebrate
Format it as an engaging thread that encourages participation."

LLM Response: I'll create an engaging Monday standup prompt to kick off the week positively.

[Uses send-message tool with structured standup format]

Monday standup prompt posted! The development team has an engaging format to share their updates, blockers, and celebrate wins from last week.
```

#### Weekly Retrospectives

```
You: "Friday afternoon retrospective time! Send a message to #general asking teams to reflect on the week:
- Biggest accomplishment this week
- Most valuable lesson learned
- One thing to improve next week
- Kudos for a teammate who helped you
Make it positive and encourage cross-team sharing."

LLM Response: I'll create a positive weekly retrospective prompt to encourage team reflection and recognition.

[Uses send-message tool with retrospective format]

Weekly retrospective prompt sent! Teams across the company can now reflect on their week and share accomplishments and lessons learned.
```

---

## Best Practices & Tips

### Message Formatting

#### Use Rich Formatting
```markdown
**Bold headings** for important information
*Italics* for emphasis
`Code snippets` for technical terms
> Quoted text for references

### Structured Lists
- Bullet points for clarity
- **Key:** Value pairs for data
- Numbered lists for steps

[Links](https://example.com) for references
@**Name** for user mentions
#**stream-name** for stream references
```

#### Effective Use of Topics
- Use descriptive topic names: "Sprint 23 Retro" not "Meeting"
- Keep topics focused: One topic per discussion thread
- Use consistent naming: "Deployments", "Incidents", "Planning"

### Workflow Optimization

#### Batch Related Operations
```
You: "I need to update multiple teams about our product launch. Send messages to #sales, #marketing, and #customer-success with launch details customized for each team's needs."
```

#### Use Context from Previous Messages
```
You: "Check what was discussed about the API rate limiting issue in #development yesterday, then send a follow-up with the resolution we implemented."
```

#### Combine Multiple Tools
```
You: "Find all users in the sales team, then send them a direct message about the new CRM integration training session scheduled for next week."
```

---

Ready to implement these workflows? Start with the basic examples and gradually build more complex automations tailored to your team's specific needs. Check out our [API Reference](/api-reference) for detailed tool documentation or [Troubleshooting Guide](/troubleshooting) if you encounter any issues.