CREATE TABLE public.licenses (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  license_key     TEXT        NOT NULL UNIQUE,
  customer_email  TEXT,
  customer_name   TEXT,
  order_id        TEXT,                               -- Lemon Squeezy order ID
  product_id      TEXT,                               -- LS product / variant ID
  edition         TEXT        NOT NULL DEFAULT 'pro', -- 'pro' | 'enterprise'
  status          TEXT        NOT NULL DEFAULT 'active'
                              CHECK (status IN ('active', 'expired', 'revoked')),
  seats_limit     INTEGER     NOT NULL DEFAULT 1,     -- max Sanity projects
  expires_at      TIMESTAMPTZ,                        -- NULL = never expires
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role only" ON public.licenses
  USING (false);

CREATE INDEX licenses_license_key_idx ON public.licenses (license_key);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER licenses_updated_at
  BEFORE UPDATE ON public.licenses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.license_projects (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  license_key   TEXT        NOT NULL REFERENCES public.licenses (license_key) ON DELETE CASCADE,
  project_id    TEXT        NOT NULL,   -- Sanity project ID (e.g. "abc123de")
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (license_key, project_id)
);

ALTER TABLE public.license_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role only" ON public.license_projects
  USING (false);

CREATE INDEX license_projects_license_key_idx ON public.license_projects (license_key);

CREATE TABLE public.usage_logs (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  license_key TEXT        NOT NULL,
  project_id  TEXT,
  valid       BOOLEAN     NOT NULL,
  reason      TEXT,
  ip_address  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role only" ON public.usage_logs
  USING (false);

CREATE INDEX usage_logs_license_key_idx ON public.usage_logs (license_key);
CREATE INDEX usage_logs_created_at_idx  ON public.usage_logs (created_at DESC);
