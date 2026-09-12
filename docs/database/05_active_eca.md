# 5. Active Database (Event-Condition-Action Triggers) — Educational Guide

## 1. What Problem Does It Solve?
In traditional architectures, application code must explicitly remember to trigger notifications, update statistics, or enforce business invariants after every database update. If a database record is modified outside the primary API handler (e.g. via direct script, background task, or secondary service), notifications are silently missed.

An **Active Database** embeds event-driven rules into the database kernel using the **Event-Condition-Action (ECA)** paradigm:
- **EVENT**: Database state mutation (INSERT, UPDATE, DELETE).
- **CONDITION**: Logical predicate checked inside the trigger procedure (`IF NEW.status = 'available' AND ...`).
- **ACTION**: Automatic execution of SQL/PL-pgSQL procedure (inserting notification, alerting admin, updating audit logs).

## 2. Implemented ECA Rules

| Rule Name | Event | Condition | Action |
|---|---|---|---|
| **ECA 1: Availability Notification** | `UPDATE` on `resource_status` to `'available'` | Pending borrowing requests exist | Generate `RESOURCE_AVAILABLE` notification for requester |
| **ECA 2: Overdue Borrowing Detection** | `UPDATE` on `borrowing_record` / Cron Sweep | `CURRENT_TIMESTAMP > due_date AND returned_at IS NULL` | Generate `OVERDUE_ALERT` notification for borrower & lender |
| **ECA 3: Abuse Protection Threshold** | `INSERT` on `resource_reports` | Report count for resource $\ge 3$ | Flag resource as `'flagged'` and insert `ADMIN_ALERT` |
| **ECA 4: Transaction Finalization** | `UPDATE` on `transactions` to `'completed'` | Transaction status changed | Update Temporal DB history record automatically |

## 3. Trigger DDL (PL/pgSQL)

```sql
-- Trigger Function for ECA 1: Resource Availability Alert
CREATE OR REPLACE FUNCTION trg_fn_eca_resource_available()
RETURNS TRIGGER AS $$
BEGIN
    -- CONDITION: Status changed to 'available'
    IF (OLD.status <> 'available' AND NEW.status = 'available') THEN
        -- ACTION: Insert notification into active_notifications table
        INSERT INTO active_notifications (recipient_id, title, message, event_type)
        VALUES (
            NEW.owner_id,
            'Resource Now Available',
            'Your listed resource (' || NEW.title || ') is now marked as available.',
            'RESOURCE_AVAILABLE'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_eca_resource_available
AFTER UPDATE ON resource_history
FOR EACH ROW
EXECUTE FUNCTION trg_fn_eca_resource_available();
```

## 4. Expected Result
When a resource status changes to `'available'` in PostgreSQL, a row is automatically inserted into `active_notifications` without explicit backend API call logic.
