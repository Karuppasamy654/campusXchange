-- PL/pgSQL Active Database Triggers for CampusXchange

-- ECA Rule 1: Auto Notification on Availability Transition
CREATE OR REPLACE FUNCTION fn_eca_resource_available()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status <> 'available' AND NEW.status = 'available') THEN
        INSERT INTO active_notifications (recipient_id, title, message, event_type)
        VALUES (
            NEW.owner_id,
            'Resource Status Restored',
            'Your resource (' || NEW.title || ') status is now active and available for campus sharing.',
            'RESOURCE_AVAILABLE'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_resource_available ON resource_history;
CREATE TRIGGER trg_resource_available
AFTER UPDATE ON resource_history
FOR EACH ROW
EXECUTE FUNCTION fn_eca_resource_available();
