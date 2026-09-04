--
-- PostgreSQL database dump
--

\restrict vzJ5JQoXb1QqNJgRkOwULTacmJvUQdv2Im49HIgtrZvXkbJcFaHVJNIxRF38y2B

-- Dumped from database version 17.10
-- Dumped by pg_dump version 17.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: auditlogs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auditlogs (
    id integer NOT NULL,
    user_id integer,
    action character varying(100) NOT NULL,
    resource character varying(100),
    details text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: auditlogs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.auditlogs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: auditlogs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.auditlogs_id_seq OWNED BY public.auditlogs.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text
);


--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- Name: rolepermissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rolepermissions (
    role_id integer NOT NULL,
    permission_id integer NOT NULL
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: userroles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.userroles (
    user_id integer NOT NULL,
    role_id integer NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash character varying(255) NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: auditlogs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auditlogs ALTER COLUMN id SET DEFAULT nextval('public.auditlogs_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: auditlogs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auditlogs (id, user_id, action, resource, details, created_at) FROM stdin;
1	1	LOGIN_SUCCESS	AUTHENTICATION	User logged in successfully	2026-09-04 00:55:26.596876
2	2	LOGIN_FAILED	AUTHENTICATION	Invalid password	2026-09-04 01:02:25.948988
3	2	LOGIN_FAILED	AUTHENTICATION	Invalid password	2026-09-04 01:02:35.327032
4	2	LOGIN_FAILED	AUTHENTICATION	Invalid password	2026-09-04 01:04:39.210926
5	2	LOGIN_SUCCESS	AUTHENTICATION	User logged in successfully	2026-09-04 01:05:45.626179
6	1	LOGIN_SUCCESS	AUTHENTICATION	User logged in successfully	2026-09-04 02:13:01.860247
7	1	LOGIN_SUCCESS	AUTHENTICATION	User logged in successfully	2026-09-04 02:14:01.37123
8	2	LOGIN_SUCCESS	AUTHENTICATION	User logged in successfully	2026-09-04 02:27:24.668838
9	1	LOGIN_SUCCESS	AUTHENTICATION	User logged in successfully	2026-09-04 02:53:26.897286
10	1	ROLE_UPDATED	User	Changed HR Employee's role from HR to Support	2026-09-04 02:56:30.568568
11	1	ROLE_UPDATED	User	Changed HR Employee's role from Support to Finance	2026-09-04 02:56:34.141169
12	1	ROLE_UPDATED	User	Changed Support Employee's role from Support to HR	2026-09-04 02:56:36.736638
13	1	ROLE_UPDATED	User	Changed HR Employee's role from Finance to HR	2026-09-04 02:57:09.775303
14	1	ROLE_UPDATED	User	Changed Support Employee's role from HR to Support	2026-09-04 02:57:20.923338
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.permissions (id, name, description) FROM stdin;
1	zoho_people_access	Access Zoho People
2	zoho_crm_access	Access Zoho CRM
3	zoho_desk_access	Access Zoho Desk
4	zoho_books_access	Access Zoho Books
5	user_manage	Create, edit and delete users
6	role_manage	Create and manage roles
7	permission_manage	Assign and manage permissions
8	audit_log_view	View user activity and access logs
\.


--
-- Data for Name: rolepermissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rolepermissions (role_id, permission_id) FROM stdin;
1	1
1	2
1	3
1	4
1	5
1	6
1	7
1	8
2	1
3	2
4	3
5	4
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, name, created_at) FROM stdin;
1	Admin	2026-09-04 00:26:08.011139
2	HR	2026-09-04 00:26:08.011139
3	Sales	2026-09-04 00:26:08.011139
4	Support	2026-09-04 00:26:08.011139
5	Finance	2026-09-04 00:26:08.011139
\.


--
-- Data for Name: userroles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.userroles (user_id, role_id) FROM stdin;
1	1
3	3
5	5
2	2
4	4
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, password_hash, is_active, created_at) FROM stdin;
1	System Administrator	admin@company.com	$2b$10$5eDG.3bJeAOHfnGEmgzL.eZ7cBjufX/7UnnwxQOOCbp5/4lq7Ga.6	t	2026-09-04 00:53:24.269299
2	HR Employee	hr@company.com	$2b$10$e95p17rDJHRgdIjYI9f17.Yp1zNKZFGElVZCHlwdFi.kU7FIe/vS2	t	2026-09-04 01:01:05.501025
3	Sales Employee	sales@company.com	$2b$10$e95p17rDJHRgdIjYI9f17.Yp1zNKZFGElVZCHlwdFi.kU7FIe/vS2	t	2026-09-04 01:01:05.501025
4	Support Employee	support@company.com	$2b$10$e95p17rDJHRgdIjYI9f17.Yp1zNKZFGElVZCHlwdFi.kU7FIe/vS2	t	2026-09-04 01:01:05.501025
5	Finance Employee	finance@company.com	$2b$10$e95p17rDJHRgdIjYI9f17.Yp1zNKZFGElVZCHlwdFi.kU7FIe/vS2	t	2026-09-04 01:01:05.501025
\.


--
-- Name: auditlogs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auditlogs_id_seq', 14, true);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.permissions_id_seq', 8, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_id_seq', 5, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- Name: auditlogs auditlogs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auditlogs
    ADD CONSTRAINT auditlogs_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key UNIQUE (name);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: rolepermissions rolepermissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rolepermissions
    ADD CONSTRAINT rolepermissions_pkey PRIMARY KEY (role_id, permission_id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: userroles userroles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.userroles
    ADD CONSTRAINT userroles_pkey PRIMARY KEY (user_id, role_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: auditlogs auditlogs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auditlogs
    ADD CONSTRAINT auditlogs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: rolepermissions rolepermissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rolepermissions
    ADD CONSTRAINT rolepermissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: rolepermissions rolepermissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rolepermissions
    ADD CONSTRAINT rolepermissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: userroles userroles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.userroles
    ADD CONSTRAINT userroles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: userroles userroles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.userroles
    ADD CONSTRAINT userroles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict vzJ5JQoXb1QqNJgRkOwULTacmJvUQdv2Im49HIgtrZvXkbJcFaHVJNIxRF38y2B

