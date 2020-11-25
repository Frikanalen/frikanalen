DROP FUNCTION IF EXISTS fk_schedule_gaps(TIMESTAMP, TIMESTAMP);
CREATE FUNCTION fk_schedule_gaps (
    search_start TIMESTAMP,
    search_end TIMESTAMP
)
RETURNS TABLE(
    preceding_item INT,
    following_item INT,
    gap_start_time TIMESTAMP,
    gap_end_time TIMESTAMP,
    gap_duration INTERVAL) AS $$
BEGIN
    RETURN query
    SELECT
        item_before,
        item_after,
        start_time at time zone 'Europe/Oslo',
        end_time at time zone 'Europe/Oslo',
        end_time - start_time AS duration
    FROM
        (
            SELECT
                *
            FROM
                (
                    SELECT
                        lag(id) OVER (ORDER BY starttime) AS item_before,
                        id AS item_after,
                        lag(starttime + duration) OVER (
                    ORDER BY
                        starttime) AS start_time,
                        starttime AS end_time
                    FROM
                        (
                            SELECT
                                id,
                                starttime,
                                duration
                            FROM
                                fk_scheduleitem
                            -- dummy schedule item at start for gap calculation
                            UNION ALL SELECT NULL, search_start, '0'
                            -- dummy schedule item at end for gap calculation
                            UNION ALL SELECT NULL, search_end, '0'
                        )
                        AS schedule_items
                )
                AS gaps_inner
        )
        AS gaps
    WHERE
        -- If the dummy schedule item overlaps with
        -- a real one, it will have a negative duration
        -- so this clause eliminates it
        end_time - start_time >= '0'
        AND gaps.start_time >= search_start
        AND gaps.end_time <= search_end;
END
;
$$ LANGUAGE 'plpgsql';
