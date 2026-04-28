-- +migrate Up
ALTER TABLE connections
ADD COLUMN color_hex VARCHAR(7) NOT NULL DEFAULT '#ec4899' AFTER `ssl`;

-- +migrate Down
ALTER TABLE connections
DROP COLUMN color_hex;
