-- TIP-024D service-principal boundary.
-- A worker principal is attributable but cannot authenticate or inherit an
-- administrative role. These invariants live in PostgreSQL so application or
-- operator mistakes fail closed.

CREATE TYPE "PrincipalType" AS ENUM ('HUMAN', 'SERVICE');

ALTER TABLE "user"
  ADD COLUMN "principal_type" "PrincipalType" NOT NULL DEFAULT 'HUMAN';

CREATE FUNCTION hiveos_guard_principal_type_immutable()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.principal_type <> OLD.principal_type THEN
    RAISE EXCEPTION 'principal type is immutable'
      USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER user_principal_type_immutable
BEFORE UPDATE ON "user"
FOR EACH ROW EXECUTE FUNCTION hiveos_guard_principal_type_immutable();

CREATE FUNCTION hiveos_reject_service_credentials()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "user"
    WHERE id = NEW.user_id AND principal_type = 'SERVICE'
  ) THEN
    RAISE EXCEPTION 'service principals cannot receive authentication credentials or sessions'
      USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER account_reject_service_principal
BEFORE INSERT OR UPDATE ON account
FOR EACH ROW EXECUTE FUNCTION hiveos_reject_service_credentials();

CREATE TRIGGER session_reject_service_principal
BEFORE INSERT OR UPDATE ON "session"
FOR EACH ROW EXECUTE FUNCTION hiveos_reject_service_credentials();

CREATE FUNCTION hiveos_guard_service_membership_role()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.role IN ('OWNER', 'ADMIN') AND EXISTS (
    SELECT 1 FROM "user"
    WHERE id = NEW.user_id AND principal_type = 'SERVICE'
  ) THEN
    RAISE EXCEPTION 'service principals cannot hold owner or admin membership'
      USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER organization_membership_guard_service_role
BEFORE INSERT OR UPDATE ON organization_membership
FOR EACH ROW EXECUTE FUNCTION hiveos_guard_service_membership_role();

CREATE TRIGGER workspace_membership_guard_service_role
BEFORE INSERT OR UPDATE ON membership
FOR EACH ROW EXECUTE FUNCTION hiveos_guard_service_membership_role();

CREATE FUNCTION hiveos_guard_service_scoped_grant()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.subject_type = 'USER'
     AND NEW.subject_user_id IS NOT NULL
     AND NEW.role <> 'BUILDER'
     AND EXISTS (
       SELECT 1 FROM "user"
       WHERE id = NEW.subject_user_id AND principal_type = 'SERVICE'
     ) THEN
    RAISE EXCEPTION 'service principals may receive only the builder scoped role'
      USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER scoped_grant_guard_service_role
BEFORE INSERT OR UPDATE ON scoped_grant
FOR EACH ROW EXECUTE FUNCTION hiveos_guard_service_scoped_grant();
