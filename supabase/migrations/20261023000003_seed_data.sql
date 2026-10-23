-- ==============================================================================
-- BRIGHTPATH CRM: MIGRATION 03 — DEMO SEED DATA
-- ==============================================================================
-- Purpose:
--   Populates realistic sample data for BrightPath Academy to test the pipeline,
--   KPI aggregations, overdue follow-up indicators, and activity timelines.
--   Uses idempotent INSERT patterns so it can be safely re-run without duplicate key errors.
-- ==============================================================================

do $$
declare
  v_lead_1 uuid := '11111111-1111-1111-1111-111111111111';
  v_lead_2 uuid := '22222222-2222-2222-2222-222222222222';
  v_lead_3 uuid := '33333333-3333-3333-3333-333333333333';
  v_lead_4 uuid := '44444444-4444-4444-4444-444444444444';
  v_lead_5 uuid := '55555555-5555-5555-5555-555555555555';
  v_lead_6 uuid := '66666666-6666-6666-6666-666666666666';
  v_lead_7 uuid := '77777777-7777-7777-7777-777777777777';
  v_lead_8 uuid := '88888888-8888-8888-8888-888888888888';
  v_lead_9 uuid := '99999999-9999-9999-9999-999999999999';
  v_lead_10 uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  v_lead_11 uuid := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
  v_lead_12 uuid := 'cccccccc-cccc-cccc-cccc-cccccccccccc';
begin

  -- 1. Insert Sample Leads
  insert into public.leads (id, full_name, email, phone, course_interest, source, status, notes, created_at)
  values
    (v_lead_1, 'Rohit Sharma', 'rohit.sharma@example.com', '+91 98765 43210', 'Python & Generative AI Bootcamp', 'Website', 'New', 'Enquired through contact form. Wants weekend batch.', now() - interval '2 days'),
    (v_lead_2, 'Ananya Iyer', 'ananya.iyer@example.com', '+91 98234 56789', 'Full Stack Web Development', 'Walk-in', 'Contacted', 'Visited campus. Attended 30-minute counsellor demo.', now() - interval '5 days'),
    (v_lead_3, 'Vikram Patel', 'vikram.patel@example.com', '+91 97123 45678', 'Data Science & Machine Learning', 'Referral', 'Qualified', 'College final year student. Wants career placement assistance.', now() - interval '10 days'),
    (v_lead_4, 'Priya Nair', 'priya.nair@example.com', '+91 99345 67890', 'UI/UX Design Masterclass', 'Social', 'Converted', 'Enrolled and completed registration fee payment.', now() - interval '12 days'),
    (v_lead_5, 'Amit Verma', 'amit.verma@example.com', '+91 96456 78901', 'Python & Generative AI Bootcamp', 'Call', 'Lost', 'Lost Reason: Enrolled in university master degree program instead.', now() - interval '8 days'),
    (v_lead_6, 'Sneha Kulkarni', 'sneha.k@example.com', '+91 95567 89012', 'Full Stack Web Development', 'Website', 'Contacted', 'Discussed syllabus. Requested brochure via email.', now() - interval '3 days'),
    (v_lead_7, 'Karan Malhotra', 'karan.m@example.com', '+91 94678 90123', 'Cloud DevOps & AWS', 'Walk-in', 'Qualified', 'Working professional with 2 years IT experience looking to upskill.', now() - interval '6 days'),
    (v_lead_8, 'Divya Menon', 'divya.menon@example.com', '+91 93789 01234', 'UI/UX Design Masterclass', 'Social', 'New', 'Instagram campaign enquiry regarding portfolio reviews.', now() - interval '1 day'),
    (v_lead_9, 'Rajesh Gupta', 'rajesh.gupta@example.com', '+91 92890 12345', 'Data Science & Machine Learning', 'Referral', 'Converted', 'Referred by alumni Rahul. Paid batch seat reservation.', now() - interval '15 days'),
    (v_lead_10, 'Neha Joshi', 'neha.j@example.com', '+91 91901 23456', 'Python & Generative AI Bootcamp', 'Call', 'New', 'Called asking about evening class recordings and mentor support.', now() - interval '4 hours'),
    (v_lead_11, 'Siddharth Rao', 'sid.rao@example.com', '+91 90112 34567', 'Cloud DevOps & AWS', 'Website', 'Contacted', 'Scheduled demo session for Saturday 11 AM.', now() - interval '4 days'),
    (v_lead_12, 'Tanvi Deshmukh', 'tanvi.d@example.com', '+91 89223 45678', 'Full Stack Web Development', 'Referral', 'Converted', 'Completed admission interview. Assigned student ID.', now() - interval '20 days')
  on conflict (id) do nothing;

  -- 2. Insert Follow-ups (including overdue and upcoming tasks for testing)
  insert into public.follow_ups (id, lead_id, due_at, note, status, completed_at, created_at)
  values
    -- Overdue tasks (due_at in past and pending)
    ('f1111111-1111-1111-1111-111111111111', v_lead_1, now() - interval '1 day', 'Call student to explain Python weekend batch schedule and fee structure.', 'pending', null, now() - interval '2 days'),
    ('f2222222-2222-2222-2222-222222222222', v_lead_6, now() - interval '4 hours', 'Confirm if student received the Full Stack course syllabus PDF.', 'pending', null, now() - interval '1 day'),
    
    -- Due Today / Upcoming tasks
    ('f3333333-3333-3333-3333-333333333333', v_lead_2, now() + interval '3 hours', 'Follow up on walk-in visit and check if parents approved registration.', 'pending', null, now() - interval '2 days'),
    ('f4444444-4444-4444-4444-444444444444', v_lead_7, now() + interval '1 day', 'Schedule 1-on-1 career consultation call with Cloud mentor.', 'pending', null, now() - interval '1 day'),
    ('f5555555-5555-5555-5555-555555555555', v_lead_10, now() + interval '2 days', 'Send course curriculum and enrollment link for AI Bootcamp.', 'pending', null, now() - interval '2 hours'),
    
    -- Completed tasks
    ('f6666666-6666-6666-6666-666666666666', v_lead_4, now() - interval '3 days', 'Verify payment confirmation receipt and email batch timetable.', 'completed', now() - interval '3 days', now() - interval '6 days'),
    ('f7777777-7777-7777-7777-777777777777', v_lead_9, now() - interval '7 days', 'Send welcome kit and invite to WhatsApp community group.', 'completed', now() - interval '7 days', now() - interval '10 days')
  on conflict (id) do nothing;

  -- 3. Insert Activity History Records
  insert into public.activities (id, lead_id, activity_type, description, metadata, created_at)
  values
    ('a1111111-1111-1111-1111-111111111111', v_lead_1, 'lead_created', 'New enquiry received from Website Contact Form', '{"source": "Website"}'::jsonb, now() - interval '2 days'),
    ('a2222222-2222-2222-2222-222222222222', v_lead_2, 'lead_created', 'Student walked into reception for course inquiry', '{"source": "Walk-in"}'::jsonb, now() - interval '5 days'),
    ('a3333333-3333-3333-3333-333333333333', v_lead_2, 'status_changed', 'Status updated from New to Contacted after campus consultation', '{"old_status": "New", "new_status": "Contacted"}'::jsonb, now() - interval '4 days'),
    ('a4444444-4444-4444-4444-444444444444', v_lead_4, 'status_changed', 'Status transitioned from Qualified to Converted (Admission confirmed)', '{"old_status": "Qualified", "new_status": "Converted"}'::jsonb, now() - interval '4 days'),
    ('a5555555-5555-5555-5555-555555555555', v_lead_4, 'follow_up_completed', 'Completed follow-up: Verified payment receipt and sent batch timetable', '{}'::jsonb, now() - interval '3 days'),
    ('a6666666-6666-6666-6666-666666666666', v_lead_5, 'status_changed', 'Status marked as Lost: Student selected university master degree program', '{"reason": "Enrolled in university master degree program instead"}'::jsonb, now() - interval '7 days')
  on conflict (id) do nothing;

end $$;
