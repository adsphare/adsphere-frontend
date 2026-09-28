/*
 * CANONICAL TRUST PROCESSOR
 *
 * Trust mutations must not be performed directly from the
 * process-local event bus.
 *
 * Authoritative trust updates are handled by the database
 * trust settlement path with durable idempotency.
 */

export {};
