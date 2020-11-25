GRANT SELECT ON fk_video, fk_scheduleitem, fk_organization TO fkschedule;
GRANT INSERT ON fk_scheduleitem to fkschedule;
GRANT USAGE, SELECT ON SEQUENCE "ScheduleItem_id_seq" to fkschedule;
