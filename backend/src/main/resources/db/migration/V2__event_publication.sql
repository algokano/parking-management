-- Spring Modulith JPA event publication tables

CREATE TABLE event_publication (
    id                    UUID NOT NULL PRIMARY KEY,
    publication_date      TIMESTAMP WITH TIME ZONE NOT NULL,
    listener_id           TEXT NOT NULL,
    serialized_event      TEXT NOT NULL,
    event_type            TEXT NOT NULL,
    completion_date       TIMESTAMP WITH TIME ZONE,
    last_resubmission_date TIMESTAMP WITH TIME ZONE,
    completion_attempts   INTEGER NOT NULL DEFAULT 0,
    status                VARCHAR(50) NOT NULL DEFAULT 'PUBLISHED'
);

CREATE INDEX idx_event_pub_completion ON event_publication(completion_date);
CREATE INDEX idx_event_pub_status ON event_publication(status);

CREATE TABLE archived_event_publication (
    id                    UUID NOT NULL PRIMARY KEY,
    publication_date      TIMESTAMP WITH TIME ZONE NOT NULL,
    listener_id           TEXT NOT NULL,
    serialized_event      TEXT NOT NULL,
    event_type            TEXT NOT NULL,
    completion_date       TIMESTAMP WITH TIME ZONE,
    last_resubmission_date TIMESTAMP WITH TIME ZONE,
    completion_attempts   INTEGER NOT NULL DEFAULT 0,
    status                VARCHAR(50) NOT NULL DEFAULT 'PUBLISHED',
    archived_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
