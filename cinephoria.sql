-- Create the database named "cinephoria"
-- sql : CREATE DATABASE IF NOT EXISTS cinephoria;
CREATE DATABASE cinephoria; --postgreSQL

-- Select the "cinephoria" database to use
--sql : USE cinephoria; --sql

\c cinephoria; --psql

-- Create a table named "movie"
CREATE TABLE movie
(
    id              UUID                       NOT NULL PRIMARY KEY,
    title           VARCHAR(255)               NOT NULL,
    poster_path     VARCHAR(255) DEFAULT NULL,
    backdrop_path   VARCHAR(255) DEFAULT NULL,
    duration        SMALLINT     DEFAULT NULL,
    description     TEXT         DEFAULT NULL,
    favorite        BOOLEAN      DEFAULT false NOT NULL,
    rating          DOUBLE PRECISION           NOT NULL,
    release_date    DATE                       NOT NULL,
    age_restriction VARCHAR(255)               NOT NULL,
    warning         BOOLEAN                    NOT NULL
);

-- Create a table named "movie_genre" with columns for id, name and tmbd_id
CREATE TABLE movie_genre
(
    id      UUID         NOT NULL PRIMARY KEY,
    name    VARCHAR(255) NOT NULL,
    tmbd_id INT          NOT NULL
);

-- Create the "movie_movie_genre" junction table to represent a many-to-many relationship between the movie and movie_genre tables.
CREATE TABLE movie_movie_genre
(
    movie_id       UUID NOT NULL,                                              -- Foreign key to the movies table (movie's ID)
    movie_genre_id UUID NOT NULL,                                              -- Foreign key to the genres table (genre's ID)
    PRIMARY KEY (movie_id, movie_genre_id),                                    -- Composite primary key (movie_id, genre_id)
    FOREIGN KEY (movie_id) REFERENCES movie (id) ON DELETE CASCADE,            -- Ensures the movie exists in the movies table                         );
    FOREIGN KEY (movie_genre_id) REFERENCES movie_genre (id) ON DELETE CASCADE -- Ensures the genre exists in the movies table                         );
);
-- The process of adding indexes to the database can significantly improve query performance.
CREATE INDEX idx_movie_id ON movie_movie_genre (movie_id);
CREATE INDEX idx_movie_genre_id ON movie_movie_genre (movie_id);

-- Insert sample data into the "movie" table
INSERT INTO movie (id, title, backdrop_path, duration, description, favorite, rating, release_date, age_restriction,
                   warning)
VALUES ('c19f3400-cdd0-4a3a-a48d-19ff9d7e55ea',
        'Deadpool & Wolverine',
        'yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
        128,
        'Un Wade Wilson désabusé s''abrutit de travail dans le civil. Sa vie de mercenaire moralement flexible, Deadpool, est derrière lui. Mais quand son monde est menacé d''anéantissement, il accepte à contrecœur de reprendre le flambeau, et de convaincre un Wolverine non moins contre-cœureux... contre-cordial ? Contre-cardiaque ? Il doit le convaincre de... ah, laisse tomber, va voir le film. Un synopsis, c''est débile. Mais entends l''avertissement : des flashs lumineux dans l''image pourraient affecter les spectateurs photosensibles.',
        false,
        0,
        '2024-07-24',
        '12 ans',
        true),
       ('f22df4e9-af36-4a91-a3a1-58263d78c9f4',
        'Moi, moche et méchant 4',
        'lgkPzcOSnTvjeMnuFzozRO5HHw1.jpg',
        94,
        'Gru, Lucy et les filles, Margo, Édith et Agnès accueillent le petit dernier de la famille, Gru Junior, qui semble n’avoir qu’une passion : faire tourner son père en bourrique. Mais Gru est confronté à un nouvel ennemi, Maxime Le Mal, qui avec l’aide de sa petite amie, la fatale Valentina, va obliger toute la famille à fuir.',
        true,
        0,
        '2024-07-10',
        'Tous publics',
        false),
       ('9f2b850a-548e-4893-93d8-f4f38fae1b55',
        'Joker: Folie à Deux',
        'reNf6GBzOe48l9WEnFOxXgW56Vg.jpg',
        138,
        'Arthur Fleck, alors interné dans l''asile d''Arkham, attend d''être jugé pour les crimes qu''il a commis sous les traits du Joker. Déchiré entre ses deux identités, Arthur ne trouve pas seulement le grand amour, mais aussi la mélodie qui a toujours sommeillé en lui.',
        false,
        0,
        '2024-10-02',
        '12 ans',
        true
       )
;

-- Insert sample data into the "movie_genre" table
INSERT INTO movie_genre (id, name, tmbd_id)
VALUES
    ('0194f44f-d7de-7f18-926f-6b471c146f9b', 'Action', 28),
    ('0194f44f-d7de-7f18-926f-6b471cadd9cb', 'Aventure', 12),
    ('0194f44f-d7de-7f18-926f-6b471d55de67', 'Animation', 16),
    ('0194f44f-d7de-7f18-926f-6b471d851423', 'Comédie', 35),
    ('0194f44f-d7de-7f18-926f-6b471e671165', 'Crime', 80),
    ('0194f44f-d7de-7f18-926f-6b471ef5f42b', 'Documentaire', 99),
    ('0194f44f-d7de-7f18-926f-6b471fc8bb53', 'Drame', 18),
    ('0194f44f-d7de-7f18-926f-6b4720c29966', 'Familial', 10751),
    ('0194f44f-d7de-7f18-926f-6b4721638f7c', 'Fantastique', 14),
    ('0194f44f-d7de-7f18-926f-6b47225015e1', 'Histoire', 36),
    ('0194f44f-d7de-7f18-926f-6b4722892e8e', 'Horreur', 27),
    ('0194f44f-d7de-7f18-926f-6b4722e987e0', 'Musique', 10402),
    ('0194f44f-d7de-7f18-926f-6b47232a51db', 'Mystère', 9648),
    ('0194f44f-d7de-7f18-926f-6b47236e5e4b', 'Romance', 10749),
    ('0194f44f-d7de-7f18-926f-6b4723d7e6e7', 'Science-Fiction', 878),
    ('0194f44f-d7de-7f18-926f-6b472472719e', 'Téléfilm', 10770),
    ('0194f44f-d7de-7f18-926f-6b4724daaf89', 'Thriller', 53),
    ('0194f44f-d7de-7f18-926f-6b47254482b1', 'Guerre', 10752),
    ('0194f44f-d7de-7f18-926f-6b4725568de2', 'Western', 37)
;


-- Update the rating for a movie
UPDATE movie
SET rating = 4.5
WHERE title = 'Deadpool & Wolverine';

-- Select all movies to verify the updates
SELECT *
FROM movie;

--Instead of inserting a movie and then the genre(s) into the junction table, we perform the insertion within a transaction to ensure that the record is fully populated.
BEGIN; -- Start the transaction

-- Insert Movie
INSERT INTO movie (id, title, backdrop_path, duration, description, favorite, rating, release_date, age_restriction,
                   warning)
VALUES        ('3369a9c9-a825-49dd-9a9a-c2e75fbee107',
               'Speak No Evil',
               '9R9Za5kybgl5AhuCNoK3gngaBdG.jpg',
               53,
               'Quand une famille américaine est invitée à passer le week-end dans le domaine champêtre idyllique d''une charmante famille britannique qu''ils ont rencontrée en vacances, ce qui paraissait être des vacances de rêve se transforme bientôt en un cauchemar psychologique.',
               false,
               0,
               '2024-09-18',
               '12 ans',
               true
              );

INSERT INTO movie_movie_genre (movie_id, movie_genre_id)
SELECT '3369a9c9-a825-49dd-9a9a-c2e75fbee107', id
FROM movie_genre
WHERE tmbd_id IN (27, 53);

COMMIT; -- If everything is fine, commit the transaction
