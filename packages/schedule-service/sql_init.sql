/* CREATE ROLE fkschedule LOGIN PASSWORD 'temporary';*/

grant select on fk_scheduleitem, fk_schedulepurpose, fk_video, fk_organization to fkschedule;
