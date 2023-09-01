SELECT * FROM waggle.student_activity_progress_data ORDER BY CreatedDate DESC LIMIT 200 ;
SELECT COUNT(1) FROM waggle.student_activity_progress_data WHERE CreatedDate >'2023-08-31' AND IsPublished=1 ORDER BY  CreatedDate DESC ;
SELECT COUNT(1) FROM waggle.student_activity_progress_data WHERE CreatedDate >'2023-08-01' AND IsPublished=0 ORDER BY  CreatedDate DESC  ;
SELECT COUNT(1) FROM waggle_roster_sync.ed_districts WHERE OrgRefId IS NOT NULL  OR OrgRefId!='' ;
call waggle_roster_sync.GetSchoolRosterDetails() ;
SELECT COUNT(1) FROM waggle.student_activity_progress_data WHERE IsPublished=1;
SELECT  COUNT(DISTINCT StudentRefId) TotalStudents  FROM waggle.student_activity_progress_data WHERE IsPublished=1 ORDER BY  CreatedDate DESC ;
SELECT COUNT(1) FROM waggle.student_activity_progress_data WHERE IsPublished=0 ORDER BY  CreatedDate DESC  ;
SELECT COUNT(1) FROM waggle.student_activity_progress_data WHERE CreatedDate LIKE '%2023-08-29%' AND IsPublished=1 ORDER BY  CreatedDate DESC ;
