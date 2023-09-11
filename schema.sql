CREATE TABLE public.user(
    id varchar(15) PRIMARY KEY,
    email varchar(31) NOT NULL UNIQUE,
    email_verified integer NOT NULL
);

CREATE TABLE user_key(
    id varchar(255) PRIMARY KEY,
    user_id varchar(15) NOT NULL,
    hashed_password varchar(255),
    FOREIGN KEY (user_id) REFERENCES public.user(id)
);

CREATE TABLE user_session(
    id varchar(127) PRIMARY KEY,
    user_id varchar(15) NOT NULL,
    active_expires bigint NOT NULL,
    idle_expires bigint NOT NULL,
    FOREIGN KEY (user_id) REFERENCES public.user(id)
);

CREATE TABLE email_verification_token(
    id varchar(63) PRIMARY KEY,
    user_id varchar(15) NOT NULL,
    expires bigint NOT NULL
);

CREATE TABLE password_reset_token(
    id varchar(63) PRIMARY KEY,
    user_id varchar(15) NOT NULL,
    expires bigint NOT NULL
);

