const { test, expect, tc } = require('../fixtures');
const d = require('../data/testData');
const { usDate, addDays } = require('../utils/dates');
const { ReportsPage } = require('../pages/ReportsPage');

test.describe.serial('CRM, Surveys & Events (TC-087..TC-092)', () => {
  test(...tc('TC-087'), async ({ crmPage }) => {
    // Every field on the lead form, including each Lead Property text box; an existing lead with the same name is updated.
    await crmPage.createLead(d.lead, { company: d.customer1.name, street: d.customer1.street, zip: d.customer1.zip }, d.lead.extras);
    expect(await crmPage.read('partner_name')).toBe(d.customer1.name);
    await crmPage.open('Leads');
    await crmPage.expectInList(d.lead.name);
  });

  test(...tc('TC-088'), async ({ crmPage }) => {
    // Every field on the opportunity form (Expected Closing a month out); an existing one with the same name is updated.
    await crmPage.createOpportunity(d.opportunity, d.customer1.name, { ...d.opportunity.extras, deadline: usDate(addDays(30)) });
    await crmPage.open('Opportunities');
    await crmPage.search(d.opportunity.name);
    await expect(crmPage.rows(d.opportunity.name).first()).toBeVisible();
  });

  test(...tc('TC-089'), async ({ crmPage }) => {
    // Every field on the calendar event (All Day / Recurrent stay off); an existing event with the same name is updated.
    // Employees: the employee created in TC-001.
    await crmPage.createEvent(d.crmEvent, d.customer1.name, `${usDate(addDays(1))} 10:00`, { ...d.crmEvent.extras, employees: d.employee.name });
    await crmPage.open('Calendar Events');
    await crmPage.expectInList(d.crmEvent.name);
  });

  test(...tc('TC-090'), async ({ surveyPage }) => {
    // Every field on the survey (Options, Description, End Message) and on its question (choices, description, options).
    const url = await surveyPage.createSurvey(d.survey, d.survey.extras);
    await surveyPage.goto(url);
    expect(await surveyPage.read('title')).toBe(d.survey.title);
    await expect(surveyPage.field('question_and_page_ids')).toContainText(d.survey.question);
    // Saved survey offers its workflow actions (Share / Live Session) and is open for answers.
    await expect(surveyPage.button('action_send_survey')).toBeVisible();
    await expect(surveyPage.button('action_start_session')).toBeVisible();
  });

  test(...tc('TC-091'), async ({ eventsPage }) => {
    // Every field on the event; the ticket is on sale from today until the day before the event.
    const extras = { ...d.event.extras, ticket: { ...d.event.extras.ticket, saleStart: `${usDate()} 09:00:00`, saleEnd: `${usDate(addDays(6))} 18:00:00` } };
    await eventsPage.createEvent(d.event, { start: `${usDate(addDays(7))} 09:00:00`, end: `${usDate(addDays(7))} 17:00:00` }, extras);
    await eventsPage.openApp('Events');
    await eventsPage.expectInList(d.event.name);
  });

  test(...tc('TC-092'), async ({ reportsPage }) => {
    // Customer activity history: the CRM calendar event for Customer 1 (TC-089, the day after it was entered, 10:00).
    // Columns for Events: Name | Created User | Created Date | Start Date | End Date | Attendees | Location | Duration | Description
    // (no customer column), so the row is checked against the event's own values.
    const ev = d.crmEvent.extras;
    const text = await reportsPage.run({
      category: 'Customer Care', tile: 'Customer Retention Report',
      filters: { Type: 'Events', start: usDate(addDays(-7)), end: usDate(addDays(7)), Status: 'All' },
      expectContains: [d.crmEvent.name],
    });
    const row = ReportsPage.rowFor(text, d.crmEvent.name);
    expect.soft(row, 'location').toContain(ev.location);
    expect.soft(row, 'duration 1.5 h').toMatch(/\t1\.5\t/);
    expect.soft(row, 'description').toContain(ev.description);
    expect.soft(row, 'created user / attendee').toContain('Komala');
    // Start should be shown in the user's time (entered 10:00); see FINDINGS.md TC-092 (report prints UTC).
    expect.soft(row, 'event start shown in user timezone (10:00)').toMatch(/\d{2}-\d{2}-\d{4} 10:00/);
  });
});
