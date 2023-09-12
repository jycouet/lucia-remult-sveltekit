CREATE TABLE auth_user(
    id varchar NOT NULL PRIMARY KEY,
    email varchar NOT NULL,
    email_verified boolean DEFAULT FALSE NOT NULL
);

CREATE TABLE auth_user_key(
    id varchar NOT NULL PRIMARY KEY,
    user_id varchar NOT NULL,
    hashed_password varchar NOT NULL,
    FOREIGN KEY (user_id) REFERENCES auth_user(id)
);

CREATE TABLE auth_user_session(
    id varchar NOT NULL PRIMARY KEY,
    user_id varchar NOT NULL,
    active_expires bigint NOT NULL,
    idle_expires bigint NOT NULL,
    username varchar DEFAULT '' NOT NULL,
    roles varchar DEFAULT '' NOT NULL,
    FOREIGN KEY (user_id) REFERENCES auth_user(id)
);

CREATE TABLE auth_email_verification_token(
    id varchar NOT NULL PRIMARY KEY,
    user_id varchar NOT NULL,
    expires bigint NOT NULL
);

CREATE TABLE auth_password_reset_token(
    id varchar NOT NULL PRIMARY KEY,
    user_id varchar NOT NULL,
    expires bigint NOT NULL
);

