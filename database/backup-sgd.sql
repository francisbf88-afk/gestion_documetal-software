--
-- PostgreSQL database cluster dump
--

-- Started on 2026-02-01 22:42:33

\restrict xQbbQFA9IquRpQHObgaOMZzZ83yFP6d35Pf7diR8QJVJHbEsVz0vuEf2CbFg4iP

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE movimientos_client;
ALTER ROLE movimientos_client WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:A+4BOZr2jXfDGCzzjXWpXw==$0Xu2A1jerRlmgXUbagtxDOOjyMHbMygsuCaqQ1jbHag=:3imhcb9uQS0OMvgVF8EnA2UucgJzCndRYNblBWuVXWY=';
CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:6NRonQP0yi0yplHkyTS76w==$UkIOlQYH6wk7s/BuyCRWNPFfWXvJjyp0b7gfETKQ5FE=:PuQlF43qeO87rdoSnpyY6flqLfL39Qk6O2wWnU8UoMQ=';

--
-- User Configurations
--








\unrestrict xQbbQFA9IquRpQHObgaOMZzZ83yFP6d35Pf7diR8QJVJHbEsVz0vuEf2CbFg4iP

--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

\restrict kRSX9dX44IpirdcdbCeKjqwzPv30IZgxoqLcz9wxWpGD8r5iovdm4OEos5LgZbl

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2026-02-01 22:42:33

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

-- Completed on 2026-02-01 22:42:34

--
-- PostgreSQL database dump complete
--

\unrestrict kRSX9dX44IpirdcdbCeKjqwzPv30IZgxoqLcz9wxWpGD8r5iovdm4OEos5LgZbl

--
-- Database "RRHH" dump
--

--
-- PostgreSQL database dump
--

\restrict sS2nrZwJvIMhs0dCdBhhnqYPYeTqJNH7gDi9mJ859TzMvWAwFTkYtTWsICNL4gI

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2026-02-01 22:42:34

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

--
-- TOC entry 4965 (class 1262 OID 22908)
-- Name: RRHH; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "RRHH" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';


ALTER DATABASE "RRHH" OWNER TO postgres;

\unrestrict sS2nrZwJvIMhs0dCdBhhnqYPYeTqJNH7gDi9mJ859TzMvWAwFTkYtTWsICNL4gI
\connect "RRHH"
\restrict sS2nrZwJvIMhs0dCdBhhnqYPYeTqJNH7gDi9mJ859TzMvWAwFTkYtTWsICNL4gI

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
-- TOC entry 226 (class 1259 OID 22971)
-- Name: cargos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cargos (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    nivel character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cargos OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 22970)
-- Name: cargos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cargos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cargos_id_seq OWNER TO postgres;

--
-- TOC entry 4966 (class 0 OID 0)
-- Dependencies: 225
-- Name: cargos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cargos_id_seq OWNED BY public.cargos.id;


--
-- TOC entry 218 (class 1259 OID 22910)
-- Name: departamentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departamentos (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.departamentos OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 22909)
-- Name: departamentos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.departamentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.departamentos_id_seq OWNER TO postgres;

--
-- TOC entry 4967 (class 0 OID 0)
-- Dependencies: 217
-- Name: departamentos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.departamentos_id_seq OWNED BY public.departamentos.id;


--
-- TOC entry 220 (class 1259 OID 22922)
-- Name: empleados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empleados (
    id integer NOT NULL,
    nombres character varying(100) NOT NULL,
    apellidos character varying(100) NOT NULL,
    ci character varying(20),
    edad integer,
    direccion text,
    correo_electronico character varying(100),
    telefono_personal character varying(20),
    telefono_casa character varying(20),
    lugar_residencia character varying(200),
    tiene_pasaporte boolean DEFAULT false,
    numero_pasaporte character varying(50),
    foto_ci_frontal character varying(255),
    foto_ci_posterior character varying(255),
    foto_perfil character varying(255),
    departamento_id integer,
    cargo character varying(100),
    estado character varying(20) DEFAULT 'Activo'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    territorio_id integer,
    cargo_id integer
);


ALTER TABLE public.empleados OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 22921)
-- Name: empleados_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.empleados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.empleados_id_seq OWNER TO postgres;

--
-- TOC entry 4968 (class 0 OID 0)
-- Dependencies: 219
-- Name: empleados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.empleados_id_seq OWNED BY public.empleados.id;


--
-- TOC entry 224 (class 1259 OID 22957)
-- Name: territorios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.territorios (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    codigo character varying(10),
    descripcion text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.territorios OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 22956)
-- Name: territorios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.territorios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.territorios_id_seq OWNER TO postgres;

--
-- TOC entry 4969 (class 0 OID 0)
-- Dependencies: 223
-- Name: territorios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.territorios_id_seq OWNED BY public.territorios.id;


--
-- TOC entry 222 (class 1259 OID 22944)
-- Name: usuarios_admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios_admin (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(100) NOT NULL,
    rol character varying(20) DEFAULT 'admin'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuarios_admin OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 22943)
-- Name: usuarios_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_admin_id_seq OWNER TO postgres;

--
-- TOC entry 4970 (class 0 OID 0)
-- Dependencies: 221
-- Name: usuarios_admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_admin_id_seq OWNED BY public.usuarios_admin.id;


--
-- TOC entry 4774 (class 2604 OID 22974)
-- Name: cargos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cargos ALTER COLUMN id SET DEFAULT nextval('public.cargos_id_seq'::regclass);


--
-- TOC entry 4762 (class 2604 OID 22913)
-- Name: departamentos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departamentos ALTER COLUMN id SET DEFAULT nextval('public.departamentos_id_seq'::regclass);


--
-- TOC entry 4764 (class 2604 OID 22925)
-- Name: empleados id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados ALTER COLUMN id SET DEFAULT nextval('public.empleados_id_seq'::regclass);


--
-- TOC entry 4772 (class 2604 OID 22960)
-- Name: territorios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.territorios ALTER COLUMN id SET DEFAULT nextval('public.territorios_id_seq'::regclass);


--
-- TOC entry 4769 (class 2604 OID 22947)
-- Name: usuarios_admin id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_admin ALTER COLUMN id SET DEFAULT nextval('public.usuarios_admin_id_seq'::regclass);


--
-- TOC entry 4959 (class 0 OID 22971)
-- Dependencies: 226
-- Data for Name: cargos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cargos (id, nombre, descripcion, nivel, created_at) FROM stdin;
1	Analista	Análisis de datos y procesos	Técnico	2026-01-28 16:44:34.422873
2	Desarrollador	Desarrollo de software	Técnico	2026-01-28 16:44:34.426602
3	Consultor	Consultoría especializada	Senior	2026-01-28 16:44:34.427132
4	Gerente	Gestión de equipos	Directivo	2026-01-28 16:44:34.427646
5	Director	Dirección estratégica	Ejecutivo	2026-01-28 16:44:34.428129
6	Coordinador	Coordinación de proyectos	Intermedio	2026-01-28 16:44:34.428571
7	Especialista	Especialización técnica	Senior	2026-01-28 16:44:34.428977
8	Asistente	Apoyo administrativo	Junior	2026-01-28 16:44:34.429348
9	Supervisor	Supervisión de operaciones	Intermedio	2026-01-28 16:44:34.429907
10	Técnico	Soporte técnico	Técnico	2026-01-28 16:44:34.430484
11	Administrador	Administración de sistemas	Senior	2026-01-28 16:44:34.431034
12	Contador	Gestión contable	Técnico	2026-01-28 16:44:34.431467
13	Vendedor	Ventas y comercialización	Técnico	2026-01-28 16:44:34.431879
14	Marketing Manager	Gestión de marketing	Senior	2026-01-28 16:44:34.432263
15	Team Leader	Liderazgo de equipo	Senior	2026-01-28 16:44:34.432668
\.


--
-- TOC entry 4951 (class 0 OID 22910)
-- Dependencies: 218
-- Data for Name: departamentos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departamentos (id, nombre, descripcion, created_at) FROM stdin;
1	Recursos Humanos	Gestión del personal y políticas de RRHH	2026-01-28 16:38:07.324879
2	Tecnología	Desarrollo y mantenimiento de sistemas	2026-01-28 16:38:07.328877
3	Ventas	Gestión comercial y ventas	2026-01-28 16:38:07.330077
4	Marketing	Estrategias de marketing y comunicación	2026-01-28 16:38:07.330725
5	Finanzas	Gestión financiera y contable	2026-01-28 16:38:07.331473
6	Operaciones	Gestión operativa y logística	2026-01-28 16:38:07.331813
31	Departamento Test	Departamento creado para testing	2026-01-28 17:20:03.729147
\.


--
-- TOC entry 4953 (class 0 OID 22922)
-- Dependencies: 220
-- Data for Name: empleados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.empleados (id, nombres, apellidos, ci, edad, direccion, correo_electronico, telefono_personal, telefono_casa, lugar_residencia, tiene_pasaporte, numero_pasaporte, foto_ci_frontal, foto_ci_posterior, foto_perfil, departamento_id, cargo, estado, created_at, updated_at, territorio_id, cargo_id) FROM stdin;
14	Alejandro	Procovar	\N	\N	\N	rcastrobauta@gmail.com	\N	\N	Suburbio Este	f	\N	\N	\N	foto_perfil-1769693109658-150613805.png	2	\N	Activo	2026-01-28 17:43:29.548037	2026-01-29 08:25:09.706395	3	5
1	Alfredo	Peterson	12345678	\N	Calle Principal 123	\N	+53 5 3891630	\N	La habana	f	\N	\N	\N	foto_perfil-1769693284306-314671777.png	2	Consultant	Activo	2026-01-28 16:38:07.332283	2026-01-29 08:28:04.524629	3	2
13	Franciso	Blanco Fis	88072350427	37	Calzada e/ I y J , Plaza de la revolucion	francisbf88@gmail.com	+53 597-894-52	21381281	Vedado	f	\N	\N	\N	foto_perfil-1769692840587-350776974.jpg	2	\N	Activo	2026-01-28 17:43:29.547554	2026-01-29 08:28:47.952542	3	7
\.


--
-- TOC entry 4957 (class 0 OID 22957)
-- Dependencies: 224
-- Data for Name: territorios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.territorios (id, nombre, codigo, descripcion, created_at) FROM stdin;
1	Pinar del Río	PR	Provincia occidental de Cuba	2026-01-28 16:44:34.411139
3	La Habana	LH	Capital de Cuba	2026-01-28 16:44:34.414927
8	Sancti Spíritus	SS	Provincia central de Cuba	2026-01-28 16:44:34.417655
10	Camagüey	CM	Provincia central de Cuba	2026-01-28 16:44:34.419122
11	Las Tunas	LT	Provincia oriental de Cuba	2026-01-28 16:44:34.419549
12	Holguín	HG	Provincia oriental de Cuba	2026-01-28 16:44:34.419978
14	Santiago de Cuba	SC	Provincia oriental de Cuba	2026-01-28 16:44:34.420971
15	Guantánamo	GT	Provincia oriental de Cuba	2026-01-28 16:44:34.421564
\.


--
-- TOC entry 4955 (class 0 OID 22944)
-- Dependencies: 222
-- Data for Name: usuarios_admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios_admin (id, username, password, email, rol, created_at) FROM stdin;
1	admin	$2a$10$uiTisPZfjmGTvcukKEwFeuDmLxHquD/P4PG0AVzhrxUpOGoXz2WCi	admin@empresa.com	admin	2026-01-28 16:38:07.421092
\.


--
-- TOC entry 4971 (class 0 OID 0)
-- Dependencies: 225
-- Name: cargos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cargos_id_seq', 75, true);


--
-- TOC entry 4972 (class 0 OID 0)
-- Dependencies: 217
-- Name: departamentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departamentos_id_seq', 45, true);


--
-- TOC entry 4973 (class 0 OID 0)
-- Dependencies: 219
-- Name: empleados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.empleados_id_seq', 15, true);


--
-- TOC entry 4974 (class 0 OID 0)
-- Dependencies: 223
-- Name: territorios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.territorios_id_seq', 80, true);


--
-- TOC entry 4975 (class 0 OID 0)
-- Dependencies: 221
-- Name: usuarios_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_admin_id_seq', 1, true);


--
-- TOC entry 4799 (class 2606 OID 22981)
-- Name: cargos cargos_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cargos
    ADD CONSTRAINT cargos_nombre_key UNIQUE (nombre);


--
-- TOC entry 4801 (class 2606 OID 22979)
-- Name: cargos cargos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cargos
    ADD CONSTRAINT cargos_pkey PRIMARY KEY (id);


--
-- TOC entry 4777 (class 2606 OID 22920)
-- Name: departamentos departamentos_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departamentos
    ADD CONSTRAINT departamentos_nombre_key UNIQUE (nombre);


--
-- TOC entry 4779 (class 2606 OID 22918)
-- Name: departamentos departamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departamentos
    ADD CONSTRAINT departamentos_pkey PRIMARY KEY (id);


--
-- TOC entry 4781 (class 2606 OID 22935)
-- Name: empleados empleados_ci_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_ci_key UNIQUE (ci);


--
-- TOC entry 4783 (class 2606 OID 22937)
-- Name: empleados empleados_correo_electronico_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_correo_electronico_key UNIQUE (correo_electronico);


--
-- TOC entry 4785 (class 2606 OID 22933)
-- Name: empleados empleados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_pkey PRIMARY KEY (id);


--
-- TOC entry 4793 (class 2606 OID 22969)
-- Name: territorios territorios_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.territorios
    ADD CONSTRAINT territorios_codigo_key UNIQUE (codigo);


--
-- TOC entry 4795 (class 2606 OID 22967)
-- Name: territorios territorios_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.territorios
    ADD CONSTRAINT territorios_nombre_key UNIQUE (nombre);


--
-- TOC entry 4797 (class 2606 OID 22965)
-- Name: territorios territorios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.territorios
    ADD CONSTRAINT territorios_pkey PRIMARY KEY (id);


--
-- TOC entry 4787 (class 2606 OID 22955)
-- Name: usuarios_admin usuarios_admin_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_admin
    ADD CONSTRAINT usuarios_admin_email_key UNIQUE (email);


--
-- TOC entry 4789 (class 2606 OID 22951)
-- Name: usuarios_admin usuarios_admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_admin
    ADD CONSTRAINT usuarios_admin_pkey PRIMARY KEY (id);


--
-- TOC entry 4791 (class 2606 OID 22953)
-- Name: usuarios_admin usuarios_admin_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_admin
    ADD CONSTRAINT usuarios_admin_username_key UNIQUE (username);


--
-- TOC entry 4802 (class 2606 OID 22987)
-- Name: empleados empleados_cargo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_cargo_id_fkey FOREIGN KEY (cargo_id) REFERENCES public.cargos(id);


--
-- TOC entry 4803 (class 2606 OID 22938)
-- Name: empleados empleados_departamento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_departamento_id_fkey FOREIGN KEY (departamento_id) REFERENCES public.departamentos(id);


--
-- TOC entry 4804 (class 2606 OID 22982)
-- Name: empleados empleados_territorio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_territorio_id_fkey FOREIGN KEY (territorio_id) REFERENCES public.territorios(id);


-- Completed on 2026-02-01 22:42:34

--
-- PostgreSQL database dump complete
--

\unrestrict sS2nrZwJvIMhs0dCdBhhnqYPYeTqJNH7gDi9mJ859TzMvWAwFTkYtTWsICNL4gI

--
-- Database "postgis_35_sample" dump
--

--
-- PostgreSQL database dump
--

\restrict iPkIiPc0GYXeA4BU3PQTbRfKST4AVLMvzMPcjzCDxpO0lOoQY8AmTSoNY24dL9X

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2026-02-01 22:42:34

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

--
-- TOC entry 7534 (class 1262 OID 16387)
-- Name: postgis_35_sample; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE postgis_35_sample WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';


ALTER DATABASE postgis_35_sample OWNER TO postgres;

\unrestrict iPkIiPc0GYXeA4BU3PQTbRfKST4AVLMvzMPcjzCDxpO0lOoQY8AmTSoNY24dL9X
\connect postgis_35_sample
\restrict iPkIiPc0GYXeA4BU3PQTbRfKST4AVLMvzMPcjzCDxpO0lOoQY8AmTSoNY24dL9X

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

--
-- TOC entry 7535 (class 0 OID 0)
-- Name: postgis_35_sample; Type: DATABASE PROPERTIES; Schema: -; Owner: postgres
--

ALTER DATABASE postgis_35_sample SET search_path TO '$user', 'public', 'topology', 'tiger';


\unrestrict iPkIiPc0GYXeA4BU3PQTbRfKST4AVLMvzMPcjzCDxpO0lOoQY8AmTSoNY24dL9X
\connect postgis_35_sample
\restrict iPkIiPc0GYXeA4BU3PQTbRfKST4AVLMvzMPcjzCDxpO0lOoQY8AmTSoNY24dL9X

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

--
-- TOC entry 21 (class 2615 OID 18788)
-- Name: tiger; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA tiger;


ALTER SCHEMA tiger OWNER TO postgres;

--
-- TOC entry 22 (class 2615 OID 19044)
-- Name: tiger_data; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA tiger_data;


ALTER SCHEMA tiger_data OWNER TO postgres;

--
-- TOC entry 20 (class 2615 OID 18387)
-- Name: topology; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA topology;


ALTER SCHEMA topology OWNER TO postgres;

--
-- TOC entry 7536 (class 0 OID 0)
-- Dependencies: 20
-- Name: SCHEMA topology; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA topology IS 'PostGIS Topology schema';


--
-- TOC entry 6 (class 3079 OID 18557)
-- Name: address_standardizer; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS address_standardizer WITH SCHEMA public;


--
-- TOC entry 7537 (class 0 OID 0)
-- Dependencies: 6
-- Name: EXTENSION address_standardizer; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION address_standardizer IS 'Used to parse an address into constituent elements. Generally used to support geocoding address normalization step.';


--
-- TOC entry 7 (class 3079 OID 18565)
-- Name: address_standardizer_data_us; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS address_standardizer_data_us WITH SCHEMA public;


--
-- TOC entry 7538 (class 0 OID 0)
-- Dependencies: 7
-- Name: EXTENSION address_standardizer_data_us; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION address_standardizer_data_us IS 'Address Standardizer US dataset example';


--
-- TOC entry 12 (class 3079 OID 18776)
-- Name: fuzzystrmatch; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA public;


--
-- TOC entry 7539 (class 0 OID 0)
-- Dependencies: 12
-- Name: EXTENSION fuzzystrmatch; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION fuzzystrmatch IS 'determine similarities and distance between strings';


--
-- TOC entry 14 (class 3079 OID 19188)
-- Name: h3; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS h3 WITH SCHEMA public;


--
-- TOC entry 7540 (class 0 OID 0)
-- Dependencies: 14
-- Name: EXTENSION h3; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION h3 IS 'H3 bindings for PostgreSQL';


--
-- TOC entry 2 (class 3079 OID 16388)
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- TOC entry 7541 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- TOC entry 3 (class 3079 OID 17468)
-- Name: postgis_raster; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_raster WITH SCHEMA public;


--
-- TOC entry 7542 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION postgis_raster; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_raster IS 'PostGIS raster types and functions';


--
-- TOC entry 15 (class 3079 OID 19304)
-- Name: h3_postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS h3_postgis WITH SCHEMA public;


--
-- TOC entry 7543 (class 0 OID 0)
-- Dependencies: 15
-- Name: EXTENSION h3_postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION h3_postgis IS 'H3 PostGIS integration';


--
-- TOC entry 11 (class 3079 OID 18770)
-- Name: ogr_fdw; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS ogr_fdw WITH SCHEMA public;


--
-- TOC entry 7544 (class 0 OID 0)
-- Dependencies: 11
-- Name: EXTENSION ogr_fdw; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION ogr_fdw IS 'foreign-data wrapper for GIS data access';


--
-- TOC entry 4 (class 3079 OID 18025)
-- Name: pgrouting; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgrouting WITH SCHEMA public;


--
-- TOC entry 7545 (class 0 OID 0)
-- Dependencies: 4
-- Name: EXTENSION pgrouting; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgrouting IS 'pgRouting Extension';


--
-- TOC entry 9 (class 3079 OID 18664)
-- Name: pointcloud; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pointcloud WITH SCHEMA public;


--
-- TOC entry 7546 (class 0 OID 0)
-- Dependencies: 9
-- Name: EXTENSION pointcloud; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pointcloud IS 'data type for lidar point clouds';


--
-- TOC entry 10 (class 3079 OID 18759)
-- Name: pointcloud_postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pointcloud_postgis WITH SCHEMA public;


--
-- TOC entry 7547 (class 0 OID 0)
-- Dependencies: 10
-- Name: EXTENSION pointcloud_postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pointcloud_postgis IS 'integration for pointcloud LIDAR data and PostGIS geometry data';


--
-- TOC entry 8 (class 3079 OID 18602)
-- Name: postgis_sfcgal; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_sfcgal WITH SCHEMA public;


--
-- TOC entry 7548 (class 0 OID 0)
-- Dependencies: 8
-- Name: EXTENSION postgis_sfcgal; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_sfcgal IS 'PostGIS SFCGAL functions';


--
-- TOC entry 13 (class 3079 OID 18789)
-- Name: postgis_tiger_geocoder; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder WITH SCHEMA tiger;


--
-- TOC entry 7549 (class 0 OID 0)
-- Dependencies: 13
-- Name: EXTENSION postgis_tiger_geocoder; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_tiger_geocoder IS 'PostGIS tiger geocoder and reverse geocoder';


--
-- TOC entry 5 (class 3079 OID 18388)
-- Name: postgis_topology; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_topology WITH SCHEMA topology;


--
-- TOC entry 7550 (class 0 OID 0)
-- Dependencies: 5
-- Name: EXTENSION postgis_topology; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_topology IS 'PostGIS topology spatial types and functions';


--
-- TOC entry 7224 (class 0 OID 18666)
-- Dependencies: 262
-- Data for Name: pointcloud_formats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pointcloud_formats (pcid, srid, schema) FROM stdin;
\.


--
-- TOC entry 7217 (class 0 OID 16710)
-- Dependencies: 235
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- TOC entry 7223 (class 0 OID 18579)
-- Dependencies: 259
-- Data for Name: us_gaz; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.us_gaz (id, seq, word, stdword, token, is_custom) FROM stdin;
\.


--
-- TOC entry 7221 (class 0 OID 18567)
-- Dependencies: 257
-- Data for Name: us_lex; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.us_lex (id, seq, word, stdword, token, is_custom) FROM stdin;
\.


--
-- TOC entry 7222 (class 0 OID 18591)
-- Dependencies: 261
-- Data for Name: us_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.us_rules (id, rule, is_custom) FROM stdin;
\.


--
-- TOC entry 7225 (class 0 OID 18795)
-- Dependencies: 265
-- Data for Name: geocode_settings; Type: TABLE DATA; Schema: tiger; Owner: postgres
--

COPY tiger.geocode_settings (name, setting, unit, category, short_desc) FROM stdin;
\.


--
-- TOC entry 7226 (class 0 OID 19127)
-- Dependencies: 310
-- Data for Name: pagc_gaz; Type: TABLE DATA; Schema: tiger; Owner: postgres
--

COPY tiger.pagc_gaz (id, seq, word, stdword, token, is_custom) FROM stdin;
\.


--
-- TOC entry 7227 (class 0 OID 19137)
-- Dependencies: 312
-- Data for Name: pagc_lex; Type: TABLE DATA; Schema: tiger; Owner: postgres
--

COPY tiger.pagc_lex (id, seq, word, stdword, token, is_custom) FROM stdin;
\.


--
-- TOC entry 7228 (class 0 OID 19147)
-- Dependencies: 314
-- Data for Name: pagc_rules; Type: TABLE DATA; Schema: tiger; Owner: postgres
--

COPY tiger.pagc_rules (id, rule, is_custom) FROM stdin;
\.


--
-- TOC entry 7219 (class 0 OID 18390)
-- Dependencies: 250
-- Data for Name: topology; Type: TABLE DATA; Schema: topology; Owner: postgres
--

COPY topology.topology (id, name, srid, "precision", hasz) FROM stdin;
\.


--
-- TOC entry 7220 (class 0 OID 18402)
-- Dependencies: 251
-- Data for Name: layer; Type: TABLE DATA; Schema: topology; Owner: postgres
--

COPY topology.layer (topology_id, layer_id, schema_name, table_name, feature_column, feature_type, level, child_id) FROM stdin;
\.


--
-- TOC entry 7551 (class 0 OID 0)
-- Dependencies: 249
-- Name: topology_id_seq; Type: SEQUENCE SET; Schema: topology; Owner: postgres
--

SELECT pg_catalog.setval('topology.topology_id_seq', 1, false);


-- Completed on 2026-02-01 22:42:34

--
-- PostgreSQL database dump complete
--

\unrestrict iPkIiPc0GYXeA4BU3PQTbRfKST4AVLMvzMPcjzCDxpO0lOoQY8AmTSoNY24dL9X

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

\restrict arqvz3DSeX0K0yDeYfi8oXY1XKAlv0j0ObLCG3Q5sPeUGeiDAW6fdskkqppzvPe

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2026-02-01 22:42:35

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

-- Completed on 2026-02-01 22:42:35

--
-- PostgreSQL database dump complete
--

\unrestrict arqvz3DSeX0K0yDeYfi8oXY1XKAlv0j0ObLCG3Q5sPeUGeiDAW6fdskkqppzvPe

--
-- Database "report" dump
--

--
-- PostgreSQL database dump
--

\restrict lz7n4eIni7g2jiaygklfnfe9hqMqKxAGOhDqYNQB6b94romaKGTzT5DXrIgDw8p

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2026-02-01 22:42:35

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

--
-- TOC entry 4910 (class 1262 OID 21928)
-- Name: report; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE report WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';


ALTER DATABASE report OWNER TO postgres;

\unrestrict lz7n4eIni7g2jiaygklfnfe9hqMqKxAGOhDqYNQB6b94romaKGTzT5DXrIgDw8p
\connect report
\restrict lz7n4eIni7g2jiaygklfnfe9hqMqKxAGOhDqYNQB6b94romaKGTzT5DXrIgDw8p

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
-- TOC entry 218 (class 1259 OID 21930)
-- Name: mercancias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mercancias (
    id integer NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(200) NOT NULL,
    descripcion character varying(500),
    created_at timestamp without time zone
);


ALTER TABLE public.mercancias OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 21929)
-- Name: mercancias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mercancias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mercancias_id_seq OWNER TO postgres;

--
-- TOC entry 4911 (class 0 OID 0)
-- Dependencies: 217
-- Name: mercancias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mercancias_id_seq OWNED BY public.mercancias.id;


--
-- TOC entry 220 (class 1259 OID 21941)
-- Name: movimientos_mercancia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movimientos_mercancia (
    id integer NOT NULL,
    mercancia_id integer NOT NULL,
    fecha timestamp without time zone NOT NULL,
    tipo_movimiento character varying(50) NOT NULL,
    cantidad double precision NOT NULL,
    precio_unitario double precision,
    total double precision,
    observaciones character varying(500),
    archivo_origen character varying(200),
    created_at timestamp without time zone
);


ALTER TABLE public.movimientos_mercancia OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 21940)
-- Name: movimientos_mercancia_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.movimientos_mercancia_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.movimientos_mercancia_id_seq OWNER TO postgres;

--
-- TOC entry 4912 (class 0 OID 0)
-- Dependencies: 219
-- Name: movimientos_mercancia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movimientos_mercancia_id_seq OWNED BY public.movimientos_mercancia.id;


--
-- TOC entry 4747 (class 2604 OID 21933)
-- Name: mercancias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mercancias ALTER COLUMN id SET DEFAULT nextval('public.mercancias_id_seq'::regclass);


--
-- TOC entry 4748 (class 2604 OID 21944)
-- Name: movimientos_mercancia id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientos_mercancia ALTER COLUMN id SET DEFAULT nextval('public.movimientos_mercancia_id_seq'::regclass);


--
-- TOC entry 4902 (class 0 OID 21930)
-- Dependencies: 218
-- Data for Name: mercancias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mercancias (id, codigo, nombre, descripcion, created_at) FROM stdin;
1	COD_0	Movimiento de mercancias por operaciones		2026-01-21 20:16:08.129381
2	COD_1	Producto_1		2026-01-21 20:16:08.135313
3	COD_2	Entidad	Desde fecha y hora	2026-01-21 20:16:08.136314
4	COD_3	Producto_3	07/01/2026 00:00:00	2026-01-21 20:16:08.137314
5	COD_4	Producto_4	07/01/2026 00:00:00	2026-01-21 20:16:08.138326
6	COD_5	Producto_5	07/01/2026 00:00:00	2026-01-21 20:16:08.139321
7	COD_6	Producto_6	07/01/2026 00:00:00	2026-01-21 20:16:08.139321
8	COD_7	Producto_7	07/01/2026 00:00:00	2026-01-21 20:16:08.140321
9	COD_8	Producto_8	07/01/2026 00:00:00	2026-01-21 20:16:08.141313
10	COD_9	Producto_9	07/01/2026 00:00:00	2026-01-21 20:16:08.14232
11	COD_10	Producto_10	07/01/2026 00:00:00	2026-01-21 20:16:08.14232
12	COD_11	Producto_11	07/01/2026 00:00:00	2026-01-21 20:16:08.143321
13	COD_12	Producto_12	07/01/2026 00:00:00	2026-01-21 20:16:08.14432
14	COD_13	Producto_13	07/01/2026 00:00:00	2026-01-21 20:16:08.14432
15	COD_14	Producto_14	07/01/2026 00:00:00	2026-01-21 20:16:08.14532
16	COD_15	Producto_15	07/01/2026 00:00:00	2026-01-21 20:16:08.14632
17	COD_16	Producto_16	07/01/2026 00:00:00	2026-01-21 20:16:08.14632
18	COD_17	Producto_17	07/01/2026 00:00:00	2026-01-21 20:16:08.147313
19	COD_18	Producto_18	07/01/2026 00:00:00	2026-01-21 20:16:08.14832
20	COD_19	Producto_19	07/01/2026 00:00:00	2026-01-21 20:16:08.14832
21	COD_20	Producto_20	07/01/2026 00:00:00	2026-01-21 20:16:08.14932
22	COD_21	Producto_21	07/01/2026 00:00:00	2026-01-21 20:16:08.150316
23	COD_22	Producto_22	07/01/2026 00:00:00	2026-01-21 20:16:08.151323
24	COD_23	Producto_23	07/01/2026 00:00:00	2026-01-21 20:16:08.151323
25	COD_24	Producto_24	07/01/2026 00:00:00	2026-01-21 20:16:08.15232
26	COD_25	Producto_25	07/01/2026 00:00:00	2026-01-21 20:16:08.15332
27	COD_26	Producto_26	07/01/2026 00:00:00	2026-01-21 20:16:08.154327
28	COD_27	Producto_27	07/01/2026 00:00:00	2026-01-21 20:16:08.154327
29	COD_28	Producto_28	07/01/2026 00:00:00	2026-01-21 20:16:08.155314
30	COD_29	Producto_29	07/01/2026 00:00:00	2026-01-21 20:16:08.156314
31	COD_30	Producto_30	07/01/2026 00:00:00	2026-01-21 20:16:08.156314
32	COD_31	Producto_31	07/01/2026 00:00:00	2026-01-21 20:16:08.157326
33	COD_32	Producto_32	07/01/2026 00:00:00	2026-01-21 20:16:08.15832
34	COD_33	Producto_33	07/01/2026 00:00:00	2026-01-21 20:16:08.15832
35	COD_34	Producto_34	07/01/2026 00:00:00	2026-01-21 20:16:08.15932
36	COD_35	Producto_35	07/01/2026 00:00:00	2026-01-21 20:16:08.159984
37	COD_36	Producto_36	07/01/2026 00:00:00	2026-01-21 20:16:08.161056
38	COD_37	Producto_37	07/01/2026 00:00:00	2026-01-21 20:16:08.161056
39	COD_38	Producto_38	07/01/2026 00:00:00	2026-01-21 20:16:08.162061
40	COD_39	Producto_39	07/01/2026 00:00:00	2026-01-21 20:16:08.163057
41	COD_40	Producto_40	07/01/2026 00:00:00	2026-01-21 20:16:08.163057
42	COD_41	Producto_41	07/01/2026 00:00:00	2026-01-21 20:16:08.164061
43	COD_42	Producto_42	07/01/2026 00:00:00	2026-01-21 20:16:08.165062
44	COD_43	Producto_43	07/01/2026 00:00:00	2026-01-21 20:16:08.165062
45	COD_44	Producto_44	07/01/2026 00:00:00	2026-01-21 20:16:08.165995
46	COD_45	Producto_45	07/01/2026 00:00:00	2026-01-21 20:16:08.166993
47	COD_46	Producto_46	07/01/2026 00:00:00	2026-01-21 20:16:08.167992
48	COD_47	Producto_47	07/01/2026 00:00:00	2026-01-21 20:16:08.167992
49	COD_48	Producto_48	07/01/2026 00:00:00	2026-01-21 20:16:08.168999
50	COD_49	Producto_49	07/01/2026 00:00:00	2026-01-21 20:16:08.17
51	COD_50	Producto_50	07/01/2026 00:00:00	2026-01-21 20:16:08.170994
52	COD_51	Producto_51	07/01/2026 00:00:00	2026-01-21 20:16:08.171993
53	COD_52	Producto_52	07/01/2026 00:00:00	2026-01-21 20:16:08.172997
54	COD_53	Producto_53	07/01/2026 00:00:00	2026-01-21 20:16:08.172997
55	COD_54	Producto_54	07/01/2026 00:00:00	2026-01-21 20:16:08.173996
56	COD_55	Producto_55	07/01/2026 00:00:00	2026-01-21 20:16:08.174996
57	COD_56	Producto_56	07/01/2026 00:00:00	2026-01-21 20:16:08.174996
58	COD_57	Producto_57	07/01/2026 00:00:00	2026-01-21 20:16:08.175996
59	COD_58	Producto_58	07/01/2026 00:00:00	2026-01-21 20:16:08.176997
60	COD_59	Producto_59	07/01/2026 00:00:00	2026-01-21 20:16:08.176997
61	COD_60	Producto_60	07/01/2026 00:00:00	2026-01-21 20:16:08.177995
62	COD_61	Producto_61	07/01/2026 00:00:00	2026-01-21 20:16:08.178997
63	COD_62	Producto_62	07/01/2026 00:00:00	2026-01-21 20:16:08.178997
64	COD_63	Producto_63	07/01/2026 00:00:00	2026-01-21 20:16:08.179995
65	COD_64	Producto_64	07/01/2026 00:00:00	2026-01-21 20:16:08.179995
66	COD_65	Producto_65	07/01/2026 00:00:00	2026-01-21 20:16:08.180996
67	COD_66	Producto_66	07/01/2026 00:00:00	2026-01-21 20:16:08.181996
68	COD_67	Producto_67	07/01/2026 00:00:00	2026-01-21 20:16:08.182896
69	COD_68	Producto_68	07/01/2026 00:00:00	2026-01-21 20:16:08.183902
70	COD_69	Producto_69	07/01/2026 00:00:00	2026-01-21 20:16:08.183902
71	COD_70	Producto_70	07/01/2026 00:00:00	2026-01-21 20:16:08.1849
72	COD_71	Producto_71	07/01/2026 00:00:00	2026-01-21 20:16:08.185901
73	COD_72	Producto_72	07/01/2026 00:00:00	2026-01-21 20:16:08.185901
74	COD_73	Producto_73	07/01/2026 00:00:00	2026-01-21 20:16:08.1869
75	COD_74	Producto_74	07/01/2026 00:00:00	2026-01-21 20:16:08.187902
76	COD_75	Producto_75	07/01/2026 00:00:00	2026-01-21 20:16:08.187902
77	ALIM0001	QUESO GOUDA RUCKER CAJA 4U		2026-01-21 20:16:39.440088
78	ALIM0002	ACEITE SOYA SAUDE 900 ML CAJA 20U		2026-01-21 20:16:39.442138
79	ALIM0003	ARROZ VITAPRO 25 KG SACO		2026-01-21 20:16:39.444092
80	ALIM0004	ARROZ ENERGY 1 KG PACA 10U		2026-01-21 20:16:39.445088
81	ALIM0005	ARROZ ENERGY 1 KG PACA 30U		2026-01-21 20:16:39.446087
82	ALIM0006	AZUCAR ENERGY ICUMSA 45 10KG PACA 10U		2026-01-21 20:16:39.447087
83	ALIM0007	AZUCAR  ENERGY ICUMSA 45 50KG SACO		2026-01-21 20:16:39.448094
84	ALIM0008	AZUCAR ENERGY ICUMSA 150 50KG SACO		2026-01-21 20:16:39.449087
85	ALIM0009	PASTA DE TOMATE VITAPRO 400G CAJA 24U		2026-01-21 20:16:39.450086
86	ALIM0010	ACEITE SOYA SAUDE 500 ML CAJA 20U		2026-01-21 20:16:39.450086
87	ALIM0011	ARROZ CAMIL 1 KG PACA 10U		2026-01-21 20:16:39.451087
88	ALIM0012	AZUCAR CAMIL 1 KG PACA 10U		2026-01-21 20:16:39.452087
89	ALIM0013	AZUCAR PATEKO 1 KG PACA 10U		2026-01-21 20:16:39.453089
90	ALIM0014	AZUCAR MAGDALENA 50 KG SACO		2026-01-21 20:16:39.454086
91	ALIM0015	ESPAGUETTI ALLEGRA 454G CAJA 20U		2026-01-21 20:16:39.454487
92	ALIM0016	SALSA DE TOMATE DE BEST 200G CAJA 36U		2026-01-21 20:16:39.455501
93	ALIM0017	QUESO GOUDA RUCKER 3 KG BARRA		2026-01-21 20:16:39.457501
94	ALIM0018	ARROZ PATEKO 1 KG PACA 10U		2026-01-21 20:16:39.458503
95	CERV0001	CERVEZA LA FRIA CAJA 24U		2026-01-21 20:16:39.45956
96	CERV0002	CERVEZA SANTA ISABEL CAJA 24U		2026-01-21 20:16:39.45956
97	CERV0003	CERVEZA SANTA ISABEL CAJA 24U X PALET		2026-01-21 20:16:39.460587
98	CONF0001	PAPITAS VIPA 40G GRILL CAJA 35U		2026-01-21 20:16:39.461558
99	CONF0002	PAPITAS VIPA 40G SWEET PEPPER CAJA 35U		2026-01-21 20:16:39.462568
100	CONF0003	PAPITAS VIPA 40G PIZZA CAJA 35U		2026-01-21 20:16:39.463558
101	CONF0004	PAPITAS VIPA 40G PAPRIKA CAJA 35U		2026-01-21 20:16:39.463558
102	CONF0005	PAPITAS VIPA 75G OREGANO CAJA 16U		2026-01-21 20:16:39.464562
103	CONF0006	PAPITAS VIPA 75G KETCHUP CAJA 16U		2026-01-21 20:16:39.464562
104	CONF0007	PAPITAS VIPA 75G PIZZA CAJA 16U		2026-01-21 20:16:39.465558
105	CONF0008	PAPITAS VIPA 75G SWEET PEPPER CAJA 16U		2026-01-21 20:16:39.466553
106	CONF0010	GALLETAS TOCO CHOCOLATE 75G CAJA 102U		2026-01-21 20:16:39.467525
107	CONF0011	GALLETAS TOCO CHOCOLATE 178G CAJA 28U		2026-01-21 20:16:39.467525
108	CONF0012	GALLETAS TOCO VAINILLA 75G CAJA 102U		2026-01-21 20:16:39.468496
109	CONF0013	GALLETAS TOCO VAINILLA 150G CAJA 26U		2026-01-21 20:16:39.469493
110	CONF0014	GALLETAS TOCO VAINILLA 500G CAJA 12U		2026-01-21 20:16:39.470505
111	HGHG00010	DETERGENTE KAPITAL LAVADO 1000 ML CAJA 12U		2026-01-21 20:16:39.470843
112	CONF0015	GALLETAS TOCO MANTEQUILLA 80G CAJA 102U		2026-01-21 20:16:39.471858
113	CONF0016	GALLETAS TOCO COCO-CACAO 225G CAJA 22U		2026-01-21 20:16:39.473857
114	CONF0017	SORBETO TOCO LIMON 250G CAJA 20U		2026-01-21 20:16:39.474861
115	CONF0018	SORBETO TOCO CACAO-MANI 250G CAJA 20U		2026-01-21 20:16:39.475924
116	CONF0019	SORBETO TOCO CACAO-MANI 45G CAJA 64U		2026-01-21 20:16:39.475924
117	CONF0020	SORBETO TOCO FRESA 250G CAJA 20U		2026-01-21 20:16:39.476924
118	CONF0021	SORBETO TOCO FRESA 45G CAJA 64U		2026-01-21 20:16:39.476924
119	CONF0022	SORBETO TOCO LIMON 45G CAJA 64U		2026-01-21 20:16:39.477918
120	HGHG0001	DETERGENTE KAPITAL MULTIUSO 750 ML CAJA 12U		2026-01-21 20:16:39.478914
121	HGHG0002	DETERGENTE KAPITAL LAVADO 1000 ML CAJA 10U		2026-01-21 20:16:39.478914
122	HGHG0003	DETERGENTE KAPITAL INDUSTRIAL 1000 ML CAJA 10U		2026-01-21 20:16:39.479929
123	HGHG0004	DETERGENTE BOW 500G PACA 40U		2026-01-21 20:16:39.480915
124	HGHG0005	PAPEL HIGIENICO PROSITO PACA 12P		2026-01-21 20:16:39.480915
125	HGHG0006	SERVILLETA PROSITO PACA 24P		2026-01-21 20:16:39.481926
126	HGHG0007	COLCHON KAPITAL BONELL 135X190		2026-01-21 20:16:39.482881
127	HGHG0008	DETERGENTE KAPITAL MULTIUSO AGRANEL		2026-01-21 20:16:39.483849
128	HGHG0009	PAPEL HIGIENICO LIRIO 44M PACA 12 P DE 4U		2026-01-21 20:16:39.485292
129	HGHG0010	PAPEL HIGIENICO PROSITO 18M PACA 24P DE 2U		2026-01-21 20:16:39.489369
130	HGHG0011	PAPEL HIGIENICO PROSITO 15M PACA 12P DE 4U		2026-01-21 20:16:39.489369
131	HGHG0012	PAPEL HIGIENICO PROSITO 18M PACA 12P DE 4UU		2026-01-21 20:16:39.490368
132	PARR0001	CERVEZA PARRANDA 330 ML BLISTER 6U		2026-01-21 20:16:39.491367
133	PARR0002	CERVEZA PARRANDA 500 ML BLISTER 6U		2026-01-21 20:16:39.492367
134	PARR0003	CERVEZA PARRANDA 1500 ML BLISTER 6U		2026-01-21 20:16:39.492367
135	PARR0004	MALTA GUAJIRA 330 ML BLISTER 6U		2026-01-21 20:16:39.493367
136	PARR0005	MALTA GUAJIRA 500 ML BLISTER 6U		2026-01-21 20:16:39.494368
137	PARR0006	CERVEZA PARRANDA TONEL 30 L		2026-01-21 20:16:39.494368
138	PARR0007	MALTA GUAJIRA 1500 ML BLISTER 6U		2026-01-21 20:16:39.495367
139	REFR0001	REFRESCO SANTA COLA 330ML CAJA 24U		2026-01-21 20:16:39.496368
140	REFR0002	REFRESCO SANTA LEMON 330ML CAJA 24U		2026-01-21 20:16:39.496368
141	REFR0003	REFRESCO SANTA ORANGE 330ML CAJA 24U		2026-01-21 20:16:39.497367
142	REFR0004	ENERGIZANTE GO+ NIGTH NEGRO CAJA 24U		2026-01-21 20:16:39.498367
143	REFR0005	ENERGIZANTE GO+ DAY ROJO CAJA 24U		2026-01-21 20:16:39.498367
144	REFR0006	REFRESCO SANTA PINA 330ML CAJA 24U		2026-01-21 20:16:39.499368
146	REFR0008	ENERGIZANTE GO+ AZUL CAJA 24U		2026-01-21 20:16:39.500367
147	RONE0001	RON SANTIAGO CARTA BLANCA CAJA 12U		2026-01-21 20:16:39.501367
148	RONE0002	RON SANTIAGO ANEJO TRADICION CAJA 12U		2026-01-21 20:16:39.502368
149	RONE0003	RON SANTIAGO ANEJO 8 ANOS CAJA 12U		2026-01-21 20:16:39.503367
150	RONE0004	RON SANTIAGO EXTRA SECO CAJA 6U		2026-01-21 20:16:39.503367
151	RONE0005	RON SANTIAGO EXTRA ANEJO 11 ANOS CAJA 6U		2026-01-21 20:16:39.504369
152	RONE0006	RON SANTIAGO EXTRA ANEJO 12 ANOS CAJA 6U		2026-01-21 20:16:39.505367
153	RONE0007	RON SANTIAGO CARTA BLANCA CAJA 6U		2026-01-21 20:16:39.505367
154	RONE0008	RON SANTIAGO ANEJO TRADICION CAJA 6U		2026-01-21 20:16:39.506367
155	TECN0005	CONGELADOR HORIZONTAL MILEXUS 4.2 PIES		2026-01-21 20:16:39.507368
156	TECN0006	CONGELADOR HORIZONTAL MILEXUS 6 PIES		2026-01-21 20:16:39.507368
157	TECN0007	EXHIBIDOR VERTICAL ICOOL 1 PUERTA 13 PIES		2026-01-21 20:16:39.508368
158	TECN0008	EXHIBIDOR VERTICAL ICOOL 2 PUERTAS 27 PIES		2026-01-21 20:16:39.509368
159	TECN0025	KIT BATERIA INVERSOR TECH FINE 5500W		2026-01-21 20:16:39.509368
160	TECN0026	PANEL SOLAR BIFACIAL DAH 590W UNIDAD		2026-01-21 20:16:39.510368
161	TECN0027	BATERIA PARA INVERSOR 5100 KW HUAN TAI		2026-01-21 20:16:39.511369
162	TECN0028	KIT BATERIA E INVERSOR 5000 KW 110-220 HUAN TAI		2026-01-21 20:16:39.511369
\.


--
-- TOC entry 4904 (class 0 OID 21941)
-- Dependencies: 220
-- Data for Name: movimientos_mercancia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movimientos_mercancia (id, mercancia_id, fecha, tipo_movimiento, cantidad, precio_unitario, total, observaciones, archivo_origen, created_at) FROM stdin;
\.


--
-- TOC entry 4913 (class 0 OID 0)
-- Dependencies: 217
-- Name: mercancias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mercancias_id_seq', 162, true);


--
-- TOC entry 4914 (class 0 OID 0)
-- Dependencies: 219
-- Name: movimientos_mercancia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movimientos_mercancia_id_seq', 1, false);


--
-- TOC entry 4750 (class 2606 OID 21939)
-- Name: mercancias mercancias_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mercancias
    ADD CONSTRAINT mercancias_codigo_key UNIQUE (codigo);


--
-- TOC entry 4752 (class 2606 OID 21937)
-- Name: mercancias mercancias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mercancias
    ADD CONSTRAINT mercancias_pkey PRIMARY KEY (id);


--
-- TOC entry 4754 (class 2606 OID 21948)
-- Name: movimientos_mercancia movimientos_mercancia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientos_mercancia
    ADD CONSTRAINT movimientos_mercancia_pkey PRIMARY KEY (id);


--
-- TOC entry 4755 (class 2606 OID 21949)
-- Name: movimientos_mercancia movimientos_mercancia_mercancia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientos_mercancia
    ADD CONSTRAINT movimientos_mercancia_mercancia_id_fkey FOREIGN KEY (mercancia_id) REFERENCES public.mercancias(id);


-- Completed on 2026-02-01 22:42:35

--
-- PostgreSQL database dump complete
--

\unrestrict lz7n4eIni7g2jiaygklfnfe9hqMqKxAGOhDqYNQB6b94romaKGTzT5DXrIgDw8p

--
-- Database "stock" dump
--

--
-- PostgreSQL database dump
--

\restrict wRH42wbEB3ySTaFcIh8e5NhxAR9WTACBemB8R8KsXzwdnSI7mBsI0QAl9thcQP6

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2026-02-01 22:42:35

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

--
-- TOC entry 4993 (class 1262 OID 21927)
-- Name: stock; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE stock WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';


ALTER DATABASE stock OWNER TO postgres;

\unrestrict wRH42wbEB3ySTaFcIh8e5NhxAR9WTACBemB8R8KsXzwdnSI7mBsI0QAl9thcQP6
\connect stock
\restrict wRH42wbEB3ySTaFcIh8e5NhxAR9WTACBemB8R8KsXzwdnSI7mBsI0QAl9thcQP6

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
-- TOC entry 228 (class 1259 OID 22187)
-- Name: configuraciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.configuraciones (
    id integer NOT NULL,
    clave character varying(100) NOT NULL,
    valor jsonb NOT NULL,
    descripcion text,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.configuraciones OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 22186)
-- Name: configuraciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.configuraciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.configuraciones_id_seq OWNER TO postgres;

--
-- TOC entry 4994 (class 0 OID 0)
-- Dependencies: 227
-- Name: configuraciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.configuraciones_id_seq OWNED BY public.configuraciones.id;


--
-- TOC entry 224 (class 1259 OID 22152)
-- Name: inventarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventarios (
    id integer NOT NULL,
    producto_id integer,
    territorio_id integer,
    cantidad numeric(12,3) DEFAULT 0 NOT NULL,
    fecha_inventario date NOT NULL,
    tipo_inventario character varying(50) DEFAULT 'STOCK'::character varying,
    observaciones text,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.inventarios OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 22151)
-- Name: inventarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventarios_id_seq OWNER TO postgres;

--
-- TOC entry 4995 (class 0 OID 0)
-- Dependencies: 223
-- Name: inventarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventarios_id_seq OWNED BY public.inventarios.id;


--
-- TOC entry 230 (class 1259 OID 22199)
-- Name: logs_sistema; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logs_sistema (
    id integer NOT NULL,
    nivel character varying(20) NOT NULL,
    mensaje text NOT NULL,
    modulo character varying(100),
    funcion character varying(100),
    datos_adicionales jsonb,
    fecha_log timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.logs_sistema OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 22198)
-- Name: logs_sistema_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.logs_sistema_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.logs_sistema_id_seq OWNER TO postgres;

--
-- TOC entry 4996 (class 0 OID 0)
-- Dependencies: 229
-- Name: logs_sistema_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.logs_sistema_id_seq OWNED BY public.logs_sistema.id;


--
-- TOC entry 218 (class 1259 OID 21955)
-- Name: mercancias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mercancias (
    id integer NOT NULL,
    codigo_mercancia character varying(50) NOT NULL,
    nombre_mercancia character varying(200) NOT NULL,
    codigo character varying(50),
    nombre character varying(255),
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mercancias OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 21954)
-- Name: mercancias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mercancias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mercancias_id_seq OWNER TO postgres;

--
-- TOC entry 4997 (class 0 OID 0)
-- Dependencies: 217
-- Name: mercancias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mercancias_id_seq OWNED BY public.mercancias.id;


--
-- TOC entry 220 (class 1259 OID 22129)
-- Name: productos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productos (
    id integer NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(255) NOT NULL,
    categoria character varying(100),
    unidad_medida character varying(20),
    precio_unitario numeric(10,2),
    activo boolean DEFAULT true,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.productos OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 22128)
-- Name: productos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.productos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.productos_id_seq OWNER TO postgres;

--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 219
-- Name: productos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.productos_id_seq OWNED BY public.productos.id;


--
-- TOC entry 226 (class 1259 OID 22176)
-- Name: reportes_generados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reportes_generados (
    id integer NOT NULL,
    nombre_reporte character varying(255) NOT NULL,
    tipo_reporte character varying(100) NOT NULL,
    ruta_archivo character varying(500),
    parametros jsonb,
    fecha_generacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    usuario character varying(100),
    estado character varying(50) DEFAULT 'COMPLETADO'::character varying
);


ALTER TABLE public.reportes_generados OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 22175)
-- Name: reportes_generados_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reportes_generados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reportes_generados_id_seq OWNER TO postgres;

--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 225
-- Name: reportes_generados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reportes_generados_id_seq OWNED BY public.reportes_generados.id;


--
-- TOC entry 222 (class 1259 OID 22141)
-- Name: territorios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.territorios (
    id integer NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(255) NOT NULL,
    region character varying(100),
    activo boolean DEFAULT true,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.territorios OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 22140)
-- Name: territorios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.territorios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.territorios_id_seq OWNER TO postgres;

--
-- TOC entry 5000 (class 0 OID 0)
-- Dependencies: 221
-- Name: territorios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.territorios_id_seq OWNED BY public.territorios.id;


--
-- TOC entry 4789 (class 2604 OID 22190)
-- Name: configuraciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuraciones ALTER COLUMN id SET DEFAULT nextval('public.configuraciones_id_seq'::regclass);


--
-- TOC entry 4782 (class 2604 OID 22155)
-- Name: inventarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventarios ALTER COLUMN id SET DEFAULT nextval('public.inventarios_id_seq'::regclass);


--
-- TOC entry 4791 (class 2604 OID 22202)
-- Name: logs_sistema id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs_sistema ALTER COLUMN id SET DEFAULT nextval('public.logs_sistema_id_seq'::regclass);


--
-- TOC entry 4772 (class 2604 OID 21958)
-- Name: mercancias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mercancias ALTER COLUMN id SET DEFAULT nextval('public.mercancias_id_seq'::regclass);


--
-- TOC entry 4775 (class 2604 OID 22132)
-- Name: productos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos ALTER COLUMN id SET DEFAULT nextval('public.productos_id_seq'::regclass);


--
-- TOC entry 4786 (class 2604 OID 22179)
-- Name: reportes_generados id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reportes_generados ALTER COLUMN id SET DEFAULT nextval('public.reportes_generados_id_seq'::regclass);


--
-- TOC entry 4779 (class 2604 OID 22144)
-- Name: territorios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.territorios ALTER COLUMN id SET DEFAULT nextval('public.territorios_id_seq'::regclass);


--
-- TOC entry 4985 (class 0 OID 22187)
-- Dependencies: 228
-- Data for Name: configuraciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.configuraciones (id, clave, valor, descripcion, fecha_actualizacion) FROM stdin;
\.


--
-- TOC entry 4981 (class 0 OID 22152)
-- Dependencies: 224
-- Data for Name: inventarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventarios (id, producto_id, territorio_id, cantidad, fecha_inventario, tipo_inventario, observaciones, fecha_creacion) FROM stdin;
\.


--
-- TOC entry 4987 (class 0 OID 22199)
-- Dependencies: 230
-- Data for Name: logs_sistema; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.logs_sistema (id, nivel, mensaje, modulo, funcion, datos_adicionales, fecha_log) FROM stdin;
\.


--
-- TOC entry 4975 (class 0 OID 21955)
-- Dependencies: 218
-- Data for Name: mercancias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mercancias (id, codigo_mercancia, nombre_mercancia, codigo, nombre, fecha_creacion, fecha_actualizacion) FROM stdin;
138	PROD001	Producto de Prueba 1	\N	\N	2026-01-25 09:15:59.58999	2026-01-25 09:15:59.58999
141	DEMO001	Mercancía Demo 1	\N	\N	2026-01-25 09:16:00.702596	2026-01-25 09:16:00.702596
3	ALIM0003	ARROZ VITAPRO 25 KG SACO	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
5	ALIM0005	ARROZ ENERGY 1 KG PACA 30U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
147	EXAMPLE1	Ejemplo de Mercancía 1	\N	\N	2026-01-25 09:16:01.99995	2026-01-25 09:16:01.99995
7	ALIM0007	AZUCAR  ENERGY ICUMSA 45 50KG SACO	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
9	ALIM0009	PASTA DE TOMATE VITAPRO 400G CAJA 24U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
10	ALIM0010	ACEITE SOYA SAUDE 500 ML CAJA 20U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
21	CERV0003	CERVEZA SANTA ISABEL CAJA 24U X PALET	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
22	CONF0001	PAPITAS VIPA 40G GRILL CAJA 35U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
23	CONF0002	PAPITAS VIPA 40G SWEET PEPPER CAJA 35U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
24	CONF0003	PAPITAS VIPA 40G PIZZA CAJA 35U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
25	CONF0004	PAPITAS VIPA 40G PAPRIKA CAJA 35U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
26	CONF0005	PAPITAS VIPA 75G OREGANO CAJA 16U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
27	CONF0006	PAPITAS VIPA 75G KETCHUP CAJA 16U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
29	CONF0008	PAPITAS VIPA 75G SWEET PEPPER CAJA 16U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
31	CONF0011	GALLETAS TOCO CHOCOLATE 178G CAJA 28U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
32	CONF0012	GALLETAS TOCO VAINILLA 75G CAJA 102U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
35	HGHG00010	DETERGENTE KAPITAL LAVADO 1000 ML CAJA 12U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
77	RONE0007	RON SANTIAGO CARTA BLANCA CAJA 6U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
78	RONE0008	RON SANTIAGO ANEJO TRADICION CAJA 6U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
84	TECN0026	PANEL SOLAR BIFACIAL DAH 590W UNIDAD	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
85	TECN0027	BATERIA PARA INVERSOR 5100 KW HUAN TAI	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
86	TECN0028	KIT BATERIA E INVERSOR 5000 KW 110-220 HUAN TAI	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
89	68	ACEITE SOYA SAUDE 500 ML CAJA 20 U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
90	TECNO0011	BATERIAS PARA INVERSORES 5100KW HUAN TAI	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
91	COMB0001	COMBO 1 (ACEITE + AZUCAR PATEKO)	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
79	TECN0005	CONGELADOR HORIZONTAL MILEXUS 4.2 PIES	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
80	TECN0006	CONGELADOR HORIZONTAL MILEXUS 6 PIES	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
81	TECN0007	EXHIBIDOR VERTICAL ICOOL 1 PUERTA 13 PIES	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
82	TECN0008	EXHIBIDOR VERTICAL ICOOL 2 PUERTAS 27 PIES	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
92	TECN0010	KIT BATERIA INVERSOR TECH  5000 KW110-220	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
83	TECN0025	KIT BATERIA INVERSOR TECH FINE 5500W	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
139	PROD002	Producto de Prueba 2	\N	\N	2026-01-25 09:16:00.055771	2026-01-25 09:16:00.055771
94	TECN0009	PANEL SOLAR 590 W DAH SOLAR	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
58	PARR0003	CERVEZA PARRANDA 1500 ML BLISTER 6U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
56	PARR0001	CERVEZA PARRANDA 330 ML BLISTER 6U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
57	PARR0002	CERVEZA PARRANDA 500 ML BLISTER 6U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
61	PARR0006	CERVEZA PARRANDA TONEL 30 L	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
62	PARR0007	MALTA GUAJIRA 1500 ML BLISTER 6U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
59	PARR0004	MALTA GUAJIRA 330 ML BLISTER 6U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
60	PARR0005	MALTA GUAJIRA 500 ML BLISTER 6U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
2	ALIM0002	ACEITE SOYA SAUDE 900 ML CAJA 20U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
11	ALIM0011	ARROZ CAMIL 1 KG PACA 10U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
4	ALIM0004	ARROZ ENERGY 1 KG PACA 10U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
18	ALIM0018	ARROZ PATEKO 1 KG PACA 10U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
12	ALIM0012	AZUCAR CAMIL 1 KG PACA 10U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
8	ALIM0008	AZUCAR ENERGY ICUMSA 150 50KG SACO	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
6	ALIM0006	AZUCAR ENERGY ICUMSA 45 10KG PACA 10U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
14	ALIM0014	AZUCAR MAGDALENA 50 KG SACO	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
13	ALIM0013	AZUCAR PATEKO 1 KG PACA 10U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
15	ALIM0015	ESPAGUETTI ALLEGRA 454G CAJA 20U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
17	ALIM0017	QUESO GOUDA RUCKER 3 KG BARRA	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
1	ALIM0001	QUESO GOUDA RUCKER CAJA 4U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
16	ALIM0016	SALSA DE TOMATE DE BEST 200G CAJA 36U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
142	DEMO002	Mercancía Demo 2	\N	\N	2026-01-25 09:16:00.878877	2026-01-25 09:16:00.878877
69	REFR0007	ENERGIZANTE EVOLUTION 250ML CAJA 24U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
70	REFR0008	ENERGIZANTE GO+ AZUL CAJA 24U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
67	REFR0005	ENERGIZANTE GO+ DAY ROJO CAJA 24U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
66	REFR0004	ENERGIZANTE GO+ NIGTH NEGRO CAJA 24U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
63	REFR0001	REFRESCO SANTA COLA 330ML CAJA 24U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
64	REFR0002	REFRESCO SANTA LEMON 330ML CAJA 24U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
65	REFR0003	REFRESCO SANTA ORANGE 330ML CAJA 24U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
68	REFR0006	REFRESCO SANTA PINA 330ML CAJA 24U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
50	HGHG0007	COLCHON KAPITAL BONELL 135X190	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
47	HGHG0004	DETERGENTE BOW 500G PACA 40U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
46	HGHG0003	DETERGENTE KAPITAL INDUSTRIAL 1000 ML CAJA 10U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
45	HGHG0002	DETERGENTE KAPITAL LAVADO 1000 ML CAJA 10U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
44	HGHG0001	DETERGENTE KAPITAL MULTIUSO 750 ML CAJA 12U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
51	HGHG0008	DETERGENTE KAPITAL MULTIUSO AGRANEL	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
52	HGHG0009	PAPEL HIGIENICO LIRIO 44M PACA 12P DE 4U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
54	HGHG0011	PAPEL HIGIENICO PROSITO 15M PACA 12P DE 4U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
55	HGHG0012	PAPEL HIGIENICO PROSITO 18M PACA 12P DE 4U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
53	HGHG0010	PAPEL HIGIENICO PROSITO 18M PACA 24P DE 2U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
48	HGHG0005	PAPEL HIGIENICO PROSITO PACA 12P	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
49	HGHG0006	SERVILLETA PROSITO PACA 24P	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
19	CERV0001	CERVEZA LA FRIA CAJA 24U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
20	CERV0002	CERVEZA SANTA ISABEL CAJA 24U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
145	SAMPLE01	Muestra de Producto 1	\N	\N	2026-01-25 09:16:01.469418	2026-01-25 09:16:01.469418
30	CONF0010	GALLETAS TOCO CHOCOLATE 75G CAJA 102U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
37	CONF0016	GALLETAS TOCO COCO-CACAO 225G CAJA 22U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
36	CONF0015	GALLETAS TOCO MANTEQUILLA 80G CAJA 102U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
33	CONF0013	GALLETAS TOCO VAINILLA 150G CAJA 26U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
34	CONF0014	GALLETAS TOCO VAINILLA 500G CAJA 12U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
28	CONF0007	PAPITAS VIPA 75G PIZZA CAJA 16U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
39	CONF0018	SORBETO TOCO CACAO-MANI 250G CAJA 20U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
40	CONF0019	SORBETO TOCO CACAO-MANI 45G CAJA 64U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
41	CONF0020	SORBETO TOCO FRESA 250G CAJA 20U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
42	CONF0021	SORBETO TOCO FRESA 45G CAJA 64U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
38	CONF0017	SORBETO TOCO LIMON 250G CAJA 20U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
43	CONF0022	SORBETO TOCO LIMON 45G CAJA 64U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
73	RONE0003	RON SANTIAGO ANEJO 8 ANOS CAJA 12U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
72	RONE0002	RON SANTIAGO ANEJO TRADICION CAJA 12U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
71	RONE0001	RON SANTIAGO CARTA BLANCA CAJA 12U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
75	RONE0005	RON SANTIAGO EXTRA ANEJO 11 ANOS CAJA 6U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
76	RONE0006	RON SANTIAGO EXTRA ANEJO 12 ANOS CAJA 6U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
74	RONE0004	RON SANTIAGO EXTRA SECO CAJA 6U	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
140	PROD003	Producto de Prueba 3	\N	\N	2026-01-25 09:16:00.421175	2026-01-25 09:16:00.421175
146	SAMPLE02	Muestra de Producto 2	\N	\N	2026-01-25 09:16:01.842184	2026-01-25 09:16:01.842184
123	M001	Arroz Blanco	M001J	Arroz Blanco	2026-01-25 09:09:34.823392	2026-01-25 09:36:23.232473
103	57	Producto 57	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
104	58	Producto 58	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
105	69	Producto 69	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
106	70	Producto 70	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
107	71	Producto 71	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
108	46	Producto 46	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
109	ALIM0019	Producto ALIM0019	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
110	ALIM0020	Producto ALIM0020	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
111	152	Producto 152	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
112	151	Producto 151	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
113	RONE009	Producto RONE009	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
114	RONE008	Producto RONE008	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
115	ALIM 0018	Producto ALIM 0018	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
116	TEC 0010	Producto TEC 0010	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
117	TEC0011	Producto TEC0011	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
118	TEC0009	Producto TEC0009	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
120	50	Producto 50	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
121	49	Producto 49	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
122	48	Producto 48	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
124	M002	Frijoles Negros	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
125	M003	Aceite de Cocina	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
126	M004	Azúcar Refinada	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
127	M005	Sal de Mesa	\N	\N	2026-01-25 09:09:34.823392	2026-01-25 09:09:34.823392
\.


--
-- TOC entry 4977 (class 0 OID 22129)
-- Dependencies: 220
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.productos (id, codigo, nombre, categoria, unidad_medida, precio_unitario, activo, fecha_creacion, fecha_actualizacion) FROM stdin;
\.


--
-- TOC entry 4983 (class 0 OID 22176)
-- Dependencies: 226
-- Data for Name: reportes_generados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reportes_generados (id, nombre_reporte, tipo_reporte, ruta_archivo, parametros, fecha_generacion, usuario, estado) FROM stdin;
\.


--
-- TOC entry 4979 (class 0 OID 22141)
-- Dependencies: 222
-- Data for Name: territorios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.territorios (id, codigo, nombre, region, activo, fecha_creacion) FROM stdin;
\.


--
-- TOC entry 5001 (class 0 OID 0)
-- Dependencies: 227
-- Name: configuraciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.configuraciones_id_seq', 1, false);


--
-- TOC entry 5002 (class 0 OID 0)
-- Dependencies: 223
-- Name: inventarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventarios_id_seq', 1, false);


--
-- TOC entry 5003 (class 0 OID 0)
-- Dependencies: 229
-- Name: logs_sistema_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.logs_sistema_id_seq', 1, false);


--
-- TOC entry 5004 (class 0 OID 0)
-- Dependencies: 217
-- Name: mercancias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mercancias_id_seq', 147, true);


--
-- TOC entry 5005 (class 0 OID 0)
-- Dependencies: 219
-- Name: productos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productos_id_seq', 1, false);


--
-- TOC entry 5006 (class 0 OID 0)
-- Dependencies: 225
-- Name: reportes_generados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reportes_generados_id_seq', 1, false);


--
-- TOC entry 5007 (class 0 OID 0)
-- Dependencies: 221
-- Name: territorios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.territorios_id_seq', 1, false);


--
-- TOC entry 4820 (class 2606 OID 22197)
-- Name: configuraciones configuraciones_clave_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuraciones
    ADD CONSTRAINT configuraciones_clave_key UNIQUE (clave);


--
-- TOC entry 4822 (class 2606 OID 22195)
-- Name: configuraciones configuraciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuraciones
    ADD CONSTRAINT configuraciones_pkey PRIMARY KEY (id);


--
-- TOC entry 4813 (class 2606 OID 22162)
-- Name: inventarios inventarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventarios
    ADD CONSTRAINT inventarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4815 (class 2606 OID 22164)
-- Name: inventarios inventarios_producto_id_territorio_id_fecha_inventario_tipo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventarios
    ADD CONSTRAINT inventarios_producto_id_territorio_id_fecha_inventario_tipo_key UNIQUE (producto_id, territorio_id, fecha_inventario, tipo_inventario);


--
-- TOC entry 4826 (class 2606 OID 22207)
-- Name: logs_sistema logs_sistema_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs_sistema
    ADD CONSTRAINT logs_sistema_pkey PRIMARY KEY (id);


--
-- TOC entry 4796 (class 2606 OID 21964)
-- Name: mercancias mercancias_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mercancias
    ADD CONSTRAINT mercancias_codigo_key UNIQUE (codigo_mercancia);


--
-- TOC entry 4798 (class 2606 OID 22216)
-- Name: mercancias mercancias_codigo_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mercancias
    ADD CONSTRAINT mercancias_codigo_key1 UNIQUE (codigo);


--
-- TOC entry 4800 (class 2606 OID 21962)
-- Name: mercancias mercancias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mercancias
    ADD CONSTRAINT mercancias_pkey PRIMARY KEY (id);


--
-- TOC entry 4802 (class 2606 OID 22139)
-- Name: productos productos_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_codigo_key UNIQUE (codigo);


--
-- TOC entry 4804 (class 2606 OID 22137)
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (id);


--
-- TOC entry 4818 (class 2606 OID 22185)
-- Name: reportes_generados reportes_generados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reportes_generados
    ADD CONSTRAINT reportes_generados_pkey PRIMARY KEY (id);


--
-- TOC entry 4806 (class 2606 OID 22150)
-- Name: territorios territorios_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.territorios
    ADD CONSTRAINT territorios_codigo_key UNIQUE (codigo);


--
-- TOC entry 4808 (class 2606 OID 22148)
-- Name: territorios territorios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.territorios
    ADD CONSTRAINT territorios_pkey PRIMARY KEY (id);


--
-- TOC entry 4809 (class 1259 OID 22210)
-- Name: idx_inventarios_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventarios_fecha ON public.inventarios USING btree (fecha_inventario);


--
-- TOC entry 4810 (class 1259 OID 22208)
-- Name: idx_inventarios_producto; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventarios_producto ON public.inventarios USING btree (producto_id);


--
-- TOC entry 4811 (class 1259 OID 22209)
-- Name: idx_inventarios_territorio; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventarios_territorio ON public.inventarios USING btree (territorio_id);


--
-- TOC entry 4823 (class 1259 OID 22212)
-- Name: idx_logs_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_logs_fecha ON public.logs_sistema USING btree (fecha_log);


--
-- TOC entry 4824 (class 1259 OID 22213)
-- Name: idx_logs_nivel; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_logs_nivel ON public.logs_sistema USING btree (nivel);


--
-- TOC entry 4793 (class 1259 OID 22219)
-- Name: idx_mercancias_codigo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_mercancias_codigo ON public.mercancias USING btree (codigo);


--
-- TOC entry 4794 (class 1259 OID 22220)
-- Name: idx_mercancias_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_mercancias_nombre ON public.mercancias USING btree (nombre);


--
-- TOC entry 4816 (class 1259 OID 22211)
-- Name: idx_reportes_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reportes_fecha ON public.reportes_generados USING btree (fecha_generacion);


--
-- TOC entry 4827 (class 2606 OID 22165)
-- Name: inventarios inventarios_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventarios
    ADD CONSTRAINT inventarios_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id);


--
-- TOC entry 4828 (class 2606 OID 22170)
-- Name: inventarios inventarios_territorio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventarios
    ADD CONSTRAINT inventarios_territorio_id_fkey FOREIGN KEY (territorio_id) REFERENCES public.territorios(id);


-- Completed on 2026-02-01 22:42:35

--
-- PostgreSQL database dump complete
--

\unrestrict wRH42wbEB3ySTaFcIh8e5NhxAR9WTACBemB8R8KsXzwdnSI7mBsI0QAl9thcQP6

--
-- Database "ventas" dump
--

--
-- PostgreSQL database dump
--

\restrict e9ZxIdvdVKeHTQL5Dbc7VVwgs6itS04yUWWTo1i9EmJ82O1GZMaSREQxiT4Jcjz

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2026-02-01 22:42:35

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

--
-- TOC entry 4924 (class 1262 OID 22021)
-- Name: ventas; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE ventas WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';


ALTER DATABASE ventas OWNER TO postgres;

\unrestrict e9ZxIdvdVKeHTQL5Dbc7VVwgs6itS04yUWWTo1i9EmJ82O1GZMaSREQxiT4Jcjz
\connect ventas
\restrict e9ZxIdvdVKeHTQL5Dbc7VVwgs6itS04yUWWTo1i9EmJ82O1GZMaSREQxiT4Jcjz

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
-- TOC entry 222 (class 1259 OID 22884)
-- Name: archivos_cargados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.archivos_cargados (
    id integer NOT NULL,
    nombre_archivo character varying(255) NOT NULL,
    territorio character varying(100) NOT NULL,
    tipo character varying(50) NOT NULL,
    registros_cargados integer NOT NULL,
    tamano_bytes bigint,
    fecha_carga timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.archivos_cargados OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 22883)
-- Name: archivos_cargados_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.archivos_cargados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.archivos_cargados_id_seq OWNER TO postgres;

--
-- TOC entry 4925 (class 0 OID 0)
-- Dependencies: 221
-- Name: archivos_cargados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.archivos_cargados_id_seq OWNED BY public.archivos_cargados.id;


--
-- TOC entry 220 (class 1259 OID 22876)
-- Name: stock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock (
    id integer NOT NULL,
    fecha date NOT NULL,
    territorio character varying(100) NOT NULL,
    mercancia character varying(255) NOT NULL,
    cantidad numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.stock OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 22875)
-- Name: stock_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_id_seq OWNER TO postgres;

--
-- TOC entry 4926 (class 0 OID 0)
-- Dependencies: 219
-- Name: stock_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_id_seq OWNED BY public.stock.id;


--
-- TOC entry 218 (class 1259 OID 22868)
-- Name: ventas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ventas (
    id integer NOT NULL,
    fecha date NOT NULL,
    fecha_hora timestamp without time zone,
    mercancia character varying(255) NOT NULL,
    territorio character varying(100) NOT NULL,
    cantidad numeric(10,2) NOT NULL,
    precio_venta numeric(10,2),
    importe numeric(12,2),
    suma_total numeric(12,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.ventas OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 22867)
-- Name: ventas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ventas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ventas_id_seq OWNER TO postgres;

--
-- TOC entry 4927 (class 0 OID 0)
-- Dependencies: 217
-- Name: ventas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ventas_id_seq OWNED BY public.ventas.id;


--
-- TOC entry 4756 (class 2604 OID 22887)
-- Name: archivos_cargados id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archivos_cargados ALTER COLUMN id SET DEFAULT nextval('public.archivos_cargados_id_seq'::regclass);


--
-- TOC entry 4754 (class 2604 OID 22879)
-- Name: stock id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock ALTER COLUMN id SET DEFAULT nextval('public.stock_id_seq'::regclass);


--
-- TOC entry 4752 (class 2604 OID 22871)
-- Name: ventas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventas ALTER COLUMN id SET DEFAULT nextval('public.ventas_id_seq'::regclass);


--
-- TOC entry 4918 (class 0 OID 22884)
-- Dependencies: 222
-- Data for Name: archivos_cargados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.archivos_cargados (id, nombre_archivo, territorio, tipo, registros_cargados, tamano_bytes, fecha_carga) FROM stdin;
1	ventas Bayamo.xls	General	ventas	0	29184	2026-01-28 15:16:22.045887
2	ventas Camaguey.xlsx	Camaguey	ventas	0	14659	2026-01-28 15:16:22.095097
3	ventas Guantanamo.xls	Guantanamo	ventas	0	67072	2026-01-28 15:16:22.14878
4	ventas Habana.xls	Habana	ventas	0	33792	2026-01-28 15:16:22.189611
5	ventas Holguin.xls	Holguin	ventas	0	41984	2026-01-28 15:16:22.218215
6	ventas Santiago.xls	Santiago	ventas	0	55808	2026-01-28 15:16:22.256659
7	ventas Ss.xls	General	ventas	0	35328	2026-01-28 15:16:22.279988
8	ventas Tunas.xlsx	Tunas	ventas	0	16883	2026-01-28 15:16:22.348013
\.


--
-- TOC entry 4916 (class 0 OID 22876)
-- Dependencies: 220
-- Data for Name: stock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock (id, fecha, territorio, mercancia, cantidad, created_at) FROM stdin;
\.


--
-- TOC entry 4914 (class 0 OID 22868)
-- Dependencies: 218
-- Data for Name: ventas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ventas (id, fecha, fecha_hora, mercancia, territorio, cantidad, precio_venta, importe, suma_total, created_at) FROM stdin;
\.


--
-- TOC entry 4928 (class 0 OID 0)
-- Dependencies: 221
-- Name: archivos_cargados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.archivos_cargados_id_seq', 8, true);


--
-- TOC entry 4929 (class 0 OID 0)
-- Dependencies: 219
-- Name: stock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_id_seq', 1, false);


--
-- TOC entry 4930 (class 0 OID 0)
-- Dependencies: 217
-- Name: ventas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ventas_id_seq', 1, false);


--
-- TOC entry 4767 (class 2606 OID 22890)
-- Name: archivos_cargados archivos_cargados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archivos_cargados
    ADD CONSTRAINT archivos_cargados_pkey PRIMARY KEY (id);


--
-- TOC entry 4765 (class 2606 OID 22882)
-- Name: stock stock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (id);


--
-- TOC entry 4762 (class 2606 OID 22874)
-- Name: ventas ventas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT ventas_pkey PRIMARY KEY (id);


--
-- TOC entry 4763 (class 1259 OID 22894)
-- Name: idx_stock_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_fecha ON public.stock USING btree (fecha);


--
-- TOC entry 4758 (class 1259 OID 22891)
-- Name: idx_ventas_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ventas_fecha ON public.ventas USING btree (fecha);


--
-- TOC entry 4759 (class 1259 OID 22893)
-- Name: idx_ventas_mercancia; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ventas_mercancia ON public.ventas USING btree (mercancia);


--
-- TOC entry 4760 (class 1259 OID 22892)
-- Name: idx_ventas_territorio; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ventas_territorio ON public.ventas USING btree (territorio);


-- Completed on 2026-02-01 22:42:36

--
-- PostgreSQL database dump complete
--

\unrestrict e9ZxIdvdVKeHTQL5Dbc7VVwgs6itS04yUWWTo1i9EmJ82O1GZMaSREQxiT4Jcjz

--
-- Database "wms" dump
--

--
-- PostgreSQL database dump
--

\restrict ywx6OpGtqAEff5BTRItURFJOnx3nCI4DRZehBjCtRnTbghwB4hJi5EUHcdRkrhf

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2026-02-01 22:42:36

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

--
-- TOC entry 5272 (class 1262 OID 22221)
-- Name: wms; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE wms WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';


ALTER DATABASE wms OWNER TO postgres;

\unrestrict ywx6OpGtqAEff5BTRItURFJOnx3nCI4DRZehBjCtRnTbghwB4hJi5EUHcdRkrhf
\connect wms
\restrict ywx6OpGtqAEff5BTRItURFJOnx3nCI4DRZehBjCtRnTbghwB4hJi5EUHcdRkrhf

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

--
-- TOC entry 951 (class 1247 OID 22726)
-- Name: enum_cycle_count_lines_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_cycle_count_lines_status AS ENUM (
    'PENDING',
    'COUNTED',
    'ADJUSTED'
);


ALTER TYPE public.enum_cycle_count_lines_status OWNER TO postgres;

--
-- TOC entry 942 (class 1247 OID 22670)
-- Name: enum_cycle_counts_countType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_cycle_counts_countType" AS ENUM (
    'FULL',
    'PARTIAL',
    'ABC',
    'RANDOM'
);


ALTER TYPE public."enum_cycle_counts_countType" OWNER TO postgres;

--
-- TOC entry 945 (class 1247 OID 22680)
-- Name: enum_cycle_counts_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_cycle_counts_status AS ENUM (
    'PLANNED',
    'ASSIGNED',
    'IN_PROGRESS',
    'COMPLETED',
    'ADJUSTED',
    'CANCELLED'
);


ALTER TYPE public.enum_cycle_counts_status OWNER TO postgres;

--
-- TOC entry 897 (class 1247 OID 22421)
-- Name: enum_inventory_movements_movementType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_inventory_movements_movementType" AS ENUM (
    'IN',
    'OUT',
    'TRANSFER',
    'ADJUSTMENT'
);


ALTER TYPE public."enum_inventory_movements_movementType" OWNER TO postgres;

--
-- TOC entry 900 (class 1247 OID 22430)
-- Name: enum_inventory_movements_referenceType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_inventory_movements_referenceType" AS ENUM (
    'PURCHASE',
    'SALE',
    'TRANSFER',
    'CYCLE_COUNT',
    'ADJUSTMENT'
);


ALTER TYPE public."enum_inventory_movements_referenceType" OWNER TO postgres;

--
-- TOC entry 912 (class 1247 OID 22531)
-- Name: enum_picking_order_lines_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_picking_order_lines_status AS ENUM (
    'PENDING',
    'PICKED',
    'SHORT_PICKED'
);


ALTER TYPE public.enum_picking_order_lines_status OWNER TO postgres;

--
-- TOC entry 906 (class 1247 OID 22484)
-- Name: enum_picking_orders_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_picking_orders_status AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public.enum_picking_orders_status OWNER TO postgres;

--
-- TOC entry 963 (class 1247 OID 22817)
-- Name: enum_receiving_order_lines_qualityStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_receiving_order_lines_qualityStatus" AS ENUM (
    'APPROVED',
    'REJECTED',
    'QUARANTINE'
);


ALTER TYPE public."enum_receiving_order_lines_qualityStatus" OWNER TO postgres;

--
-- TOC entry 966 (class 1247 OID 22824)
-- Name: enum_receiving_order_lines_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_receiving_order_lines_status AS ENUM (
    'PENDING',
    'RECEIVED',
    'PARTIAL',
    'NOT_RECEIVED',
    'REJECTED',
    'QUARANTINE'
);


ALTER TYPE public.enum_receiving_order_lines_status OWNER TO postgres;

--
-- TOC entry 957 (class 1247 OID 22774)
-- Name: enum_receiving_orders_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_receiving_orders_status AS ENUM (
    'PENDING',
    'ASSIGNED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public.enum_receiving_orders_status OWNER TO postgres;

--
-- TOC entry 933 (class 1247 OID 22635)
-- Name: enum_sync_logs_direction; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_sync_logs_direction AS ENUM (
    'IN',
    'OUT'
);


ALTER TYPE public.enum_sync_logs_direction OWNER TO postgres;

--
-- TOC entry 936 (class 1247 OID 22640)
-- Name: enum_sync_logs_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_sync_logs_status AS ENUM (
    'SUCCESS',
    'ERROR'
);


ALTER TYPE public.enum_sync_logs_status OWNER TO postgres;

--
-- TOC entry 921 (class 1247 OID 22587)
-- Name: enum_sync_queue_entityType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_sync_queue_entityType" AS ENUM (
    'PRODUCT',
    'STOCK',
    'ORDER'
);


ALTER TYPE public."enum_sync_queue_entityType" OWNER TO postgres;

--
-- TOC entry 924 (class 1247 OID 22594)
-- Name: enum_sync_queue_operation; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_sync_queue_operation AS ENUM (
    'CREATE',
    'UPDATE',
    'DELETE'
);


ALTER TYPE public.enum_sync_queue_operation OWNER TO postgres;

--
-- TOC entry 927 (class 1247 OID 22602)
-- Name: enum_sync_queue_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_sync_queue_status AS ENUM (
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED'
);


ALTER TYPE public.enum_sync_queue_status OWNER TO postgres;

--
-- TOC entry 870 (class 1247 OID 22239)
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_role AS ENUM (
    'ADMIN',
    'MANAGER',
    'OPERATOR',
    'VIEWER'
);


ALTER TYPE public.enum_users_role OWNER TO postgres;

--
-- TOC entry 888 (class 1247 OID 22369)
-- Name: enum_warehouse_locations_locationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_warehouse_locations_locationType" AS ENUM (
    'RECEIVING',
    'STORAGE',
    'PICKING',
    'SHIPPING'
);


ALTER TYPE public."enum_warehouse_locations_locationType" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 22222)
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 22567)
-- Name: axis_pos_config; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.axis_pos_config (
    id uuid NOT NULL,
    "organizationId" uuid NOT NULL,
    "apiUrl" character varying(255) NOT NULL,
    "apiKey" character varying(255) NOT NULL,
    "webhookSecret" character varying(255),
    "syncSettings" jsonb DEFAULT '{"batchSize": 100, "syncStock": true, "syncOrders": true, "syncProducts": true, "retryAttempts": 3, "enableWebhooks": true, "syncFrequencyMinutes": 15}'::jsonb,
    "isActive" boolean DEFAULT true NOT NULL,
    "lastSyncAt" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.axis_pos_config OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 22733)
-- Name: cycle_count_lines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cycle_count_lines (
    id uuid NOT NULL,
    "cycleCountId" uuid NOT NULL,
    "productVariantId" uuid NOT NULL,
    "warehouseLocationId" uuid NOT NULL,
    "stockLocationId" uuid,
    "systemQuantity" numeric(10,3) DEFAULT 0 NOT NULL,
    "countedQuantity" numeric(10,3) DEFAULT 0 NOT NULL,
    discrepancy numeric(10,3),
    "discrepancyPercentage" numeric(5,2),
    "batchNumber" character varying(100),
    "serialNumbers" json,
    status public.enum_cycle_count_lines_status DEFAULT 'PENDING'::public.enum_cycle_count_lines_status NOT NULL,
    notes text,
    "countedBy" uuid,
    "countedAt" timestamp with time zone,
    "adjustedAt" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.cycle_count_lines OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 22693)
-- Name: cycle_counts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cycle_counts (
    id uuid NOT NULL,
    "organizationId" uuid NOT NULL,
    "countNumber" character varying(50) NOT NULL,
    "warehouseId" uuid NOT NULL,
    "countType" public."enum_cycle_counts_countType" NOT NULL,
    status public.enum_cycle_counts_status DEFAULT 'PLANNED'::public.enum_cycle_counts_status NOT NULL,
    priority integer DEFAULT 1 NOT NULL,
    "scheduledDate" timestamp with time zone NOT NULL,
    "startedAt" timestamp with time zone,
    "completedAt" timestamp with time zone,
    "adjustedAt" timestamp with time zone,
    "assignedUserId" uuid,
    notes text,
    "totalLines" integer,
    "countedLines" integer,
    "discrepancyLines" integer,
    "accuracyPercentage" numeric(5,2),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.cycle_counts OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 22441)
-- Name: inventory_movements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_movements (
    id uuid NOT NULL,
    "organizationId" uuid NOT NULL,
    "movementType" public."enum_inventory_movements_movementType" NOT NULL,
    "referenceType" public."enum_inventory_movements_referenceType",
    "referenceId" uuid,
    "productVariantId" uuid NOT NULL,
    "fromLocationId" uuid,
    "toLocationId" uuid,
    quantity integer NOT NULL,
    "batchNumber" character varying(100),
    "serialNumbers" text[] DEFAULT ARRAY[]::text[],
    "unitCost" numeric(10,2),
    reason character varying(255),
    "userId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.inventory_movements OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 22227)
-- Name: organizations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organizations (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(50) NOT NULL,
    settings jsonb DEFAULT '{}'::jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.organizations OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 22537)
-- Name: picking_order_lines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.picking_order_lines (
    id uuid NOT NULL,
    "pickingOrderId" uuid NOT NULL,
    "productVariantId" uuid NOT NULL,
    "requestedQuantity" integer NOT NULL,
    "pickedQuantity" integer DEFAULT 0 NOT NULL,
    "fromLocationId" uuid,
    "batchNumber" character varying(100),
    "serialNumbers" text[] DEFAULT ARRAY[]::text[],
    status public.enum_picking_order_lines_status DEFAULT 'PENDING'::public.enum_picking_order_lines_status NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.picking_order_lines OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 22493)
-- Name: picking_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.picking_orders (
    id uuid NOT NULL,
    "organizationId" uuid NOT NULL,
    "orderNumber" character varying(100) NOT NULL,
    "warehouseId" uuid NOT NULL,
    status public.enum_picking_orders_status DEFAULT 'PENDING'::public.enum_picking_orders_status NOT NULL,
    priority integer DEFAULT 1 NOT NULL,
    "assignedUserId" uuid,
    "axisPosOrderId" character varying(100),
    "customerInfo" jsonb DEFAULT '{}'::jsonb,
    notes text,
    "completedAt" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.picking_orders OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 22270)
-- Name: product_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_categories (
    id uuid NOT NULL,
    "organizationId" uuid NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(50) NOT NULL,
    "parentId" uuid,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.product_categories OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 22322)
-- Name: product_variants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variants (
    id uuid NOT NULL,
    "productId" uuid NOT NULL,
    sku character varying(100) NOT NULL,
    name character varying(255) NOT NULL,
    attributes jsonb DEFAULT '{}'::jsonb,
    barcode character varying(100),
    cost numeric(10,2),
    price numeric(10,2),
    "axisPosVariantId" character varying(100),
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.product_variants OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 22292)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid NOT NULL,
    "organizationId" uuid NOT NULL,
    sku character varying(100) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    "categoryId" uuid,
    "unitOfMeasure" character varying(20) NOT NULL,
    weight numeric(10,3),
    dimensions jsonb,
    "isSerialized" boolean DEFAULT false NOT NULL,
    "isBatchTracked" boolean DEFAULT false NOT NULL,
    "minStockLevel" integer DEFAULT 0 NOT NULL,
    "maxStockLevel" integer,
    "reorderPoint" integer DEFAULT 0 NOT NULL,
    "axisPosProductId" character varying(100),
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 22837)
-- Name: receiving_order_lines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.receiving_order_lines (
    id uuid NOT NULL,
    "receivingOrderId" uuid NOT NULL,
    "productVariantId" uuid NOT NULL,
    "expectedQuantity" numeric(10,3) DEFAULT 0 NOT NULL,
    "receivedQuantity" numeric(10,3) DEFAULT 0 NOT NULL,
    "unitCost" numeric(10,2),
    "toLocationId" uuid,
    "batchNumber" character varying(100),
    "serialNumbers" json,
    "expiryDate" timestamp with time zone,
    "qualityStatus" public."enum_receiving_order_lines_qualityStatus",
    status public.enum_receiving_order_lines_status DEFAULT 'PENDING'::public.enum_receiving_order_lines_status NOT NULL,
    notes text,
    "receivedAt" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.receiving_order_lines OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 22785)
-- Name: receiving_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.receiving_orders (
    id uuid NOT NULL,
    "organizationId" uuid NOT NULL,
    "orderNumber" character varying(50) NOT NULL,
    "warehouseId" uuid NOT NULL,
    "supplierOrderId" character varying(100),
    "supplierName" character varying(200),
    status public.enum_receiving_orders_status DEFAULT 'PENDING'::public.enum_receiving_orders_status NOT NULL,
    "expectedDate" timestamp with time zone NOT NULL,
    "startedAt" timestamp with time zone,
    "completedAt" timestamp with time zone,
    "assignedUserId" uuid,
    notes text,
    "totalLines" integer,
    "receivedLines" integer,
    "rejectedLines" integer,
    "completionPercentage" numeric(5,2),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.receiving_orders OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 22393)
-- Name: stock_locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_locations (
    id uuid NOT NULL,
    "productVariantId" uuid NOT NULL,
    "warehouseLocationId" uuid NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    "reservedQuantity" integer DEFAULT 0 NOT NULL,
    "batchNumber" character varying(100),
    "serialNumbers" text[] DEFAULT ARRAY[]::text[],
    "expiryDate" date,
    "lastCountedAt" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.stock_locations OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 22645)
-- Name: sync_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sync_logs (
    id uuid NOT NULL,
    "organizationId" uuid NOT NULL,
    "syncType" character varying(50) NOT NULL,
    direction public.enum_sync_logs_direction NOT NULL,
    status public.enum_sync_logs_status NOT NULL,
    "requestData" jsonb,
    "responseData" jsonb,
    "errorDetails" text,
    "processingTimeMs" integer,
    "createdAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.sync_logs OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 22611)
-- Name: sync_queue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sync_queue (
    id uuid NOT NULL,
    "organizationId" uuid NOT NULL,
    "entityType" public."enum_sync_queue_entityType" NOT NULL,
    "entityId" uuid NOT NULL,
    operation public.enum_sync_queue_operation NOT NULL,
    payload jsonb NOT NULL,
    status public.enum_sync_queue_status DEFAULT 'PENDING'::public.enum_sync_queue_status NOT NULL,
    "retryCount" integer DEFAULT 0 NOT NULL,
    "maxRetries" integer DEFAULT 3 NOT NULL,
    "errorMessage" text,
    "scheduledAt" timestamp with time zone NOT NULL,
    "processedAt" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.sync_queue OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 22247)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    "organizationId" uuid NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    "passwordHash" character varying(255) NOT NULL,
    "firstName" character varying(100),
    "lastName" character varying(100),
    role public.enum_users_role DEFAULT 'OPERATOR'::public.enum_users_role NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "lastLogin" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 22377)
-- Name: warehouse_locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warehouse_locations (
    id uuid NOT NULL,
    "warehouseId" uuid NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(255),
    zone character varying(50),
    aisle character varying(10),
    rack character varying(10),
    shelf character varying(10),
    bin character varying(10),
    "locationType" public."enum_warehouse_locations_locationType" NOT NULL,
    capacity integer,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.warehouse_locations OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 22346)
-- Name: warehouses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warehouses (
    id uuid NOT NULL,
    "organizationId" uuid NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    address text,
    "managerId" uuid,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.warehouses OWNER TO postgres;

--
-- TOC entry 5248 (class 0 OID 22222)
-- Dependencies: 217
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
20240101000001-create-organizations.js
20240101000002-create-users.js
20240101000003-create-product-categories.js
20240101000004-create-products.js
20240101000005-create-product-variants.js
20240101000006-create-warehouses.js
20240101000007-create-warehouse-locations.js
20240101000008-create-stock-locations.js
20240101000009-create-inventory-movements.js
20240101000010-create-picking-orders.js
20240101000011-create-picking-order-lines.js
20240101000012-create-axis-pos-config.js
20240101000013-create-sync-queue.js
20240101000014-create-sync-logs.js
20240101000015-create-cycle-counts.js
20240101000016-create-cycle-count-lines.js
20240101000017-create-receiving-orders.js
20240101000018-create-receiving-order-lines.js
\.


--
-- TOC entry 5260 (class 0 OID 22567)
-- Dependencies: 229
-- Data for Name: axis_pos_config; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.axis_pos_config (id, "organizationId", "apiUrl", "apiKey", "webhookSecret", "syncSettings", "isActive", "lastSyncAt", "createdAt", "updatedAt") FROM stdin;
17e8d809-6690-40a2-bb68-a4d60c297cd6	0365b21a-1df9-4774-88f0-ef52d2bf3e58	https://demo.axispos.com/api	demo-api-key-12345	demo-webhook-secret	{"batchSize": 100, "syncStock": true, "syncOrders": true, "syncProducts": true, "retryAttempts": 3, "enableWebhooks": true, "syncFrequencyMinutes": 15}	f	\N	2026-01-27 17:19:58.877-05	2026-01-27 17:19:58.877-05
\.


--
-- TOC entry 5264 (class 0 OID 22733)
-- Dependencies: 233
-- Data for Name: cycle_count_lines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cycle_count_lines (id, "cycleCountId", "productVariantId", "warehouseLocationId", "stockLocationId", "systemQuantity", "countedQuantity", discrepancy, "discrepancyPercentage", "batchNumber", "serialNumbers", status, notes, "countedBy", "countedAt", "adjustedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5263 (class 0 OID 22693)
-- Dependencies: 232
-- Data for Name: cycle_counts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cycle_counts (id, "organizationId", "countNumber", "warehouseId", "countType", status, priority, "scheduledDate", "startedAt", "completedAt", "adjustedAt", "assignedUserId", notes, "totalLines", "countedLines", "discrepancyLines", "accuracyPercentage", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5257 (class 0 OID 22441)
-- Dependencies: 226
-- Data for Name: inventory_movements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_movements (id, "organizationId", "movementType", "referenceType", "referenceId", "productVariantId", "fromLocationId", "toLocationId", quantity, "batchNumber", "serialNumbers", "unitCost", reason, "userId", "createdAt") FROM stdin;
4b45c169-2f0d-4d30-8e6e-1eb7ec894c03	0365b21a-1df9-4774-88f0-ef52d2bf3e58	IN	PURCHASE	\N	d3697889-b986-4730-bf39-e2c2e5297e03	\N	196027ea-2b0a-40f5-8224-061c81f4601f	50	\N	{}	\N	Recepción de mercancía	ca187e17-554c-4d44-a172-a91a2edb9a81	2026-01-27 17:26:45.048-05
3007f55e-f617-4ca9-9110-288a77f1051f	0365b21a-1df9-4774-88f0-ef52d2bf3e58	TRANSFER	TRANSFER	\N	d3697889-b986-4730-bf39-e2c2e5297e03	196027ea-2b0a-40f5-8224-061c81f4601f	01b71e94-0b5d-4fb5-bae1-9e9de4e9b3c4	30	\N	{}	\N	Transferencia entre ubicaciones	ca187e17-554c-4d44-a172-a91a2edb9a81	2026-01-27 17:27:06.206-05
\.


--
-- TOC entry 5249 (class 0 OID 22227)
-- Dependencies: 218
-- Data for Name: organizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organizations (id, name, code, settings, "createdAt", "updatedAt") FROM stdin;
0365b21a-1df9-4774-88f0-ef52d2bf3e58	Empresa Demo IMS	DEMO	{"currency": "MXN", "language": "es", "timezone": "America/Mexico_City"}	2026-01-27 17:19:58.749-05	2026-01-27 17:19:58.749-05
\.


--
-- TOC entry 5259 (class 0 OID 22537)
-- Dependencies: 228
-- Data for Name: picking_order_lines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.picking_order_lines (id, "pickingOrderId", "productVariantId", "requestedQuantity", "pickedQuantity", "fromLocationId", "batchNumber", "serialNumbers", status, "createdAt", "updatedAt") FROM stdin;
18869167-3d1b-43cb-97f4-ec123965e2e8	e628e121-9a26-42fa-9f32-586f8b7b4b40	d3697889-b986-4730-bf39-e2c2e5297e03	5	0	01b71e94-0b5d-4fb5-bae1-9e9de4e9b3c4	\N	{}	PENDING	2026-01-27 17:29:25.907-05	2026-01-27 17:29:25.927-05
\.


--
-- TOC entry 5258 (class 0 OID 22493)
-- Dependencies: 227
-- Data for Name: picking_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.picking_orders (id, "organizationId", "orderNumber", "warehouseId", status, priority, "assignedUserId", "axisPosOrderId", "customerInfo", notes, "completedAt", "createdAt", "updatedAt") FROM stdin;
e628e121-9a26-42fa-9f32-586f8b7b4b40	0365b21a-1df9-4774-88f0-ef52d2bf3e58	SO-001	d1dc62db-777f-4267-888c-4defcb211859	PENDING	1	\N	\N	{}	Orden de picking demo	\N	2026-01-27 17:29:25.897-05	2026-01-27 17:29:25.897-05
\.


--
-- TOC entry 5251 (class 0 OID 22270)
-- Dependencies: 220
-- Data for Name: product_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_categories (id, "organizationId", name, code, "parentId", description, "isActive", "createdAt", "updatedAt") FROM stdin;
e049e0e9-8fbc-4d02-bb45-cd385a8ab1b1	0365b21a-1df9-4774-88f0-ef52d2bf3e58	Electrónicos	ELEC	\N	Productos electrónicos y tecnológicos	t	2026-01-27 17:19:58.855-05	2026-01-27 17:19:58.855-05
\.


--
-- TOC entry 5253 (class 0 OID 22322)
-- Dependencies: 222
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variants (id, "productId", sku, name, attributes, barcode, cost, price, "axisPosVariantId", "isActive", "createdAt", "updatedAt") FROM stdin;
d3697889-b986-4730-bf39-e2c2e5297e03	06eec4e7-21c1-400d-a235-cfdea7dcae74	PROD-001-BLK	Smartphone Demo - Negro	{"color": "Negro", "storage": "128GB"}	1234567890123	500.00	800.00	\N	t	2026-01-27 17:19:58.868-05	2026-01-27 17:19:58.868-05
\.


--
-- TOC entry 5252 (class 0 OID 22292)
-- Dependencies: 221
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, "organizationId", sku, name, description, "categoryId", "unitOfMeasure", weight, dimensions, "isSerialized", "isBatchTracked", "minStockLevel", "maxStockLevel", "reorderPoint", "axisPosProductId", "isActive", "createdAt", "updatedAt") FROM stdin;
06eec4e7-21c1-400d-a235-cfdea7dcae74	0365b21a-1df9-4774-88f0-ef52d2bf3e58	PROD-001	Smartphone Demo	Smartphone de demostración para el sistema IMS	e049e0e9-8fbc-4d02-bb45-cd385a8ab1b1	UNIT	0.200	{"width": 7, "height": 1, "length": 15}	t	f	10	100	20	\N	t	2026-01-27 17:19:58.86-05	2026-01-27 17:19:58.86-05
\.


--
-- TOC entry 5266 (class 0 OID 22837)
-- Dependencies: 235
-- Data for Name: receiving_order_lines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.receiving_order_lines (id, "receivingOrderId", "productVariantId", "expectedQuantity", "receivedQuantity", "unitCost", "toLocationId", "batchNumber", "serialNumbers", "expiryDate", "qualityStatus", status, notes, "receivedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5265 (class 0 OID 22785)
-- Dependencies: 234
-- Data for Name: receiving_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.receiving_orders (id, "organizationId", "orderNumber", "warehouseId", "supplierOrderId", "supplierName", status, "expectedDate", "startedAt", "completedAt", "assignedUserId", notes, "totalLines", "receivedLines", "rejectedLines", "completionPercentage", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5256 (class 0 OID 22393)
-- Dependencies: 225
-- Data for Name: stock_locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_locations (id, "productVariantId", "warehouseLocationId", quantity, "reservedQuantity", "batchNumber", "serialNumbers", "expiryDate", "lastCountedAt", "createdAt", "updatedAt") FROM stdin;
544ee0c3-97b8-4215-bcac-90f8d7c57649	d3697889-b986-4730-bf39-e2c2e5297e03	196027ea-2b0a-40f5-8224-061c81f4601f	20	0	\N	{}	\N	\N	2026-01-27 17:26:45.066-05	2026-01-27 17:27:06.213-05
2e75964d-73fd-4d74-80a3-b4a511763f6e	d3697889-b986-4730-bf39-e2c2e5297e03	01b71e94-0b5d-4fb5-bae1-9e9de4e9b3c4	30	0	\N	{}	\N	\N	2026-01-27 17:27:06.215-05	2026-01-27 17:27:06.215-05
\.


--
-- TOC entry 5262 (class 0 OID 22645)
-- Dependencies: 231
-- Data for Name: sync_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sync_logs (id, "organizationId", "syncType", direction, status, "requestData", "responseData", "errorDetails", "processingTimeMs", "createdAt") FROM stdin;
\.


--
-- TOC entry 5261 (class 0 OID 22611)
-- Dependencies: 230
-- Data for Name: sync_queue; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sync_queue (id, "organizationId", "entityType", "entityId", operation, payload, status, "retryCount", "maxRetries", "errorMessage", "scheduledAt", "processedAt", "createdAt") FROM stdin;
\.


--
-- TOC entry 5250 (class 0 OID 22247)
-- Dependencies: 219
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, "organizationId", username, email, "passwordHash", "firstName", "lastName", role, "isActive", "lastLogin", "createdAt", "updatedAt") FROM stdin;
c1b076ec-1856-47f9-a32d-caae7ec501a4	0365b21a-1df9-4774-88f0-ef52d2bf3e58	manager	manager@demo.com	$2a$10$sCxoo7LaQXIrUeU1763gaOvuKEtpogP7XGl6hvSncCS7f1Y8f5NUW	Gerente	Almacén	MANAGER	t	\N	2026-01-27 17:19:58.83-05	2026-01-27 17:19:58.83-05
554ad5a5-e260-43f0-bce1-2e45de8dbb0e	0365b21a-1df9-4774-88f0-ef52d2bf3e58	operator	operator@demo.com	$2a$10$sCxoo7LaQXIrUeU1763gaOvuKEtpogP7XGl6hvSncCS7f1Y8f5NUW	Operador	Almacén	OPERATOR	t	\N	2026-01-27 17:19:58.83-05	2026-01-27 17:19:58.83-05
ca187e17-554c-4d44-a172-a91a2edb9a81	0365b21a-1df9-4774-88f0-ef52d2bf3e58	admin	admin@demo.com	$2a$10$sCxoo7LaQXIrUeU1763gaOvuKEtpogP7XGl6hvSncCS7f1Y8f5NUW	Administrador	Sistema	ADMIN	t	2026-01-28 09:42:26.007-05	2026-01-27 17:19:58.83-05	2026-01-28 09:42:26.008-05
\.


--
-- TOC entry 5255 (class 0 OID 22377)
-- Dependencies: 224
-- Data for Name: warehouse_locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.warehouse_locations (id, "warehouseId", code, name, zone, aisle, rack, shelf, bin, "locationType", capacity, "isActive", "createdAt", "updatedAt") FROM stdin;
196027ea-2b0a-40f5-8224-061c81f4601f	d1dc62db-777f-4267-888c-4defcb211859	REC-001	Recepción 1	A	\N	\N	\N	\N	RECEIVING	1000	t	2026-01-27 17:19:58.849-05	2026-01-27 17:19:58.849-05
01b71e94-0b5d-4fb5-bae1-9e9de4e9b3c4	d1dc62db-777f-4267-888c-4defcb211859	STO-A01	Almacenamiento A01	A	01	01	01	\N	STORAGE	1000	t	2026-01-27 17:19:58.849-05	2026-01-27 17:19:58.849-05
45d305d2-621e-4051-b635-a8b8f38f8e8a	d1dc62db-777f-4267-888c-4defcb211859	STO-A02	Almacenamiento A02	A	01	01	02	\N	STORAGE	1000	t	2026-01-27 17:19:58.849-05	2026-01-27 17:19:58.849-05
686be50d-007a-49d9-8da8-3b5487582d35	d1dc62db-777f-4267-888c-4defcb211859	PICK-001	Picking 1	B	\N	\N	\N	\N	PICKING	1000	t	2026-01-27 17:19:58.849-05	2026-01-27 17:19:58.849-05
e7c5640b-45cb-4a52-ab90-00258d0a5c62	d1dc62db-777f-4267-888c-4defcb211859	SHIP-001	Despacho 1	C	\N	\N	\N	\N	SHIPPING	1000	t	2026-01-27 17:19:58.849-05	2026-01-27 17:19:58.849-05
\.


--
-- TOC entry 5254 (class 0 OID 22346)
-- Dependencies: 223
-- Data for Name: warehouses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.warehouses (id, "organizationId", code, name, address, "managerId", "isActive", "createdAt", "updatedAt") FROM stdin;
d1dc62db-777f-4267-888c-4defcb211859	0365b21a-1df9-4774-88f0-ef52d2bf3e58	WH-001	Almacén Principal	Calle Principal 123, Ciudad Demo	c1b076ec-1856-47f9-a32d-caae7ec501a4	t	2026-01-27 17:19:58.844-05	2026-01-27 17:19:58.844-05
\.


--
-- TOC entry 4902 (class 2606 OID 22226)
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- TOC entry 5006 (class 2606 OID 22577)
-- Name: axis_pos_config axis_pos_config_organizationId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.axis_pos_config
    ADD CONSTRAINT "axis_pos_config_organizationId_key" UNIQUE ("organizationId");


--
-- TOC entry 5009 (class 2606 OID 22575)
-- Name: axis_pos_config axis_pos_config_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.axis_pos_config
    ADD CONSTRAINT axis_pos_config_pkey PRIMARY KEY (id);


--
-- TOC entry 5044 (class 2606 OID 22742)
-- Name: cycle_count_lines cycle_count_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cycle_count_lines
    ADD CONSTRAINT cycle_count_lines_pkey PRIMARY KEY (id);


--
-- TOC entry 5033 (class 2606 OID 22703)
-- Name: cycle_counts cycle_counts_countNumber_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cycle_counts
    ADD CONSTRAINT "cycle_counts_countNumber_key" UNIQUE ("countNumber");


--
-- TOC entry 5037 (class 2606 OID 22701)
-- Name: cycle_counts cycle_counts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cycle_counts
    ADD CONSTRAINT cycle_counts_pkey PRIMARY KEY (id);


--
-- TOC entry 4976 (class 2606 OID 22448)
-- Name: inventory_movements inventory_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_movements
    ADD CONSTRAINT inventory_movements_pkey PRIMARY KEY (id);


--
-- TOC entry 4905 (class 2606 OID 22236)
-- Name: organizations organizations_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_code_key UNIQUE (code);


--
-- TOC entry 4907 (class 2606 OID 22234)
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- TOC entry 5000 (class 2606 OID 22546)
-- Name: picking_order_lines picking_order_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.picking_order_lines
    ADD CONSTRAINT picking_order_lines_pkey PRIMARY KEY (id);


--
-- TOC entry 4984 (class 2606 OID 22504)
-- Name: picking_orders picking_orders_axisPosOrderId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.picking_orders
    ADD CONSTRAINT "picking_orders_axisPosOrderId_key" UNIQUE ("axisPosOrderId");


--
-- TOC entry 4990 (class 2606 OID 22502)
-- Name: picking_orders picking_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.picking_orders
    ADD CONSTRAINT picking_orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4924 (class 2606 OID 22277)
-- Name: product_categories product_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4936 (class 2606 OID 22334)
-- Name: product_variants product_variants_axisPosVariantId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT "product_variants_axisPosVariantId_key" UNIQUE ("axisPosVariantId");


--
-- TOC entry 4940 (class 2606 OID 22332)
-- Name: product_variants product_variants_barcode_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_barcode_key UNIQUE (barcode);


--
-- TOC entry 4943 (class 2606 OID 22330)
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- TOC entry 4926 (class 2606 OID 22305)
-- Name: products products_axisPosProductId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "products_axisPosProductId_key" UNIQUE ("axisPosProductId");


--
-- TOC entry 4933 (class 2606 OID 22303)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 5059 (class 2606 OID 22846)
-- Name: receiving_order_lines receiving_order_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receiving_order_lines
    ADD CONSTRAINT receiving_order_lines_pkey PRIMARY KEY (id);


--
-- TOC entry 5051 (class 2606 OID 22794)
-- Name: receiving_orders receiving_orders_orderNumber_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receiving_orders
    ADD CONSTRAINT "receiving_orders_orderNumber_key" UNIQUE ("orderNumber");


--
-- TOC entry 5055 (class 2606 OID 22792)
-- Name: receiving_orders receiving_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receiving_orders
    ADD CONSTRAINT receiving_orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4963 (class 2606 OID 22402)
-- Name: stock_locations stock_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_locations
    ADD CONSTRAINT stock_locations_pkey PRIMARY KEY (id);


--
-- TOC entry 5027 (class 2606 OID 22651)
-- Name: sync_logs sync_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sync_logs
    ADD CONSTRAINT sync_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5016 (class 2606 OID 22620)
-- Name: sync_queue sync_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sync_queue
    ADD CONSTRAINT sync_queue_pkey PRIMARY KEY (id);


--
-- TOC entry 4910 (class 2606 OID 22259)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4914 (class 2606 OID 22255)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4918 (class 2606 OID 22257)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4956 (class 2606 OID 22382)
-- Name: warehouse_locations warehouse_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_locations
    ADD CONSTRAINT warehouse_locations_pkey PRIMARY KEY (id);


--
-- TOC entry 4952 (class 2606 OID 22353)
-- Name: warehouses warehouses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_pkey PRIMARY KEY (id);


--
-- TOC entry 5003 (class 1259 OID 22584)
-- Name: axis_pos_config_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX axis_pos_config_is_active ON public.axis_pos_config USING btree ("isActive");


--
-- TOC entry 5004 (class 1259 OID 22585)
-- Name: axis_pos_config_last_sync_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX axis_pos_config_last_sync_at ON public.axis_pos_config USING btree ("lastSyncAt");


--
-- TOC entry 5007 (class 1259 OID 22583)
-- Name: axis_pos_config_organization_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX axis_pos_config_organization_id ON public.axis_pos_config USING btree ("organizationId");


--
-- TOC entry 5041 (class 1259 OID 22772)
-- Name: cycle_count_lines_counted_by; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cycle_count_lines_counted_by ON public.cycle_count_lines USING btree ("countedBy");


--
-- TOC entry 5042 (class 1259 OID 22768)
-- Name: cycle_count_lines_cycle_count_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cycle_count_lines_cycle_count_id ON public.cycle_count_lines USING btree ("cycleCountId");


--
-- TOC entry 5045 (class 1259 OID 22769)
-- Name: cycle_count_lines_product_variant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cycle_count_lines_product_variant_id ON public.cycle_count_lines USING btree ("productVariantId");


--
-- TOC entry 5046 (class 1259 OID 22771)
-- Name: cycle_count_lines_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cycle_count_lines_status ON public.cycle_count_lines USING btree (status);


--
-- TOC entry 5047 (class 1259 OID 22770)
-- Name: cycle_count_lines_warehouse_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cycle_count_lines_warehouse_location_id ON public.cycle_count_lines USING btree ("warehouseLocationId");


--
-- TOC entry 5031 (class 1259 OID 22722)
-- Name: cycle_counts_assigned_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cycle_counts_assigned_user_id ON public.cycle_counts USING btree ("assignedUserId");


--
-- TOC entry 5034 (class 1259 OID 22724)
-- Name: cycle_counts_org_number_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX cycle_counts_org_number_unique ON public.cycle_counts USING btree ("organizationId", "countNumber");


--
-- TOC entry 5035 (class 1259 OID 22719)
-- Name: cycle_counts_organization_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cycle_counts_organization_id ON public.cycle_counts USING btree ("organizationId");


--
-- TOC entry 5038 (class 1259 OID 22723)
-- Name: cycle_counts_scheduled_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cycle_counts_scheduled_date ON public.cycle_counts USING btree ("scheduledDate");


--
-- TOC entry 5039 (class 1259 OID 22721)
-- Name: cycle_counts_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cycle_counts_status ON public.cycle_counts USING btree (status);


--
-- TOC entry 5040 (class 1259 OID 22720)
-- Name: cycle_counts_warehouse_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cycle_counts_warehouse_id ON public.cycle_counts USING btree ("warehouseId");


--
-- TOC entry 4971 (class 1259 OID 22481)
-- Name: inventory_movements_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX inventory_movements_created_at ON public.inventory_movements USING btree ("createdAt");


--
-- TOC entry 4972 (class 1259 OID 22478)
-- Name: inventory_movements_from_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX inventory_movements_from_location_id ON public.inventory_movements USING btree ("fromLocationId");


--
-- TOC entry 4973 (class 1259 OID 22476)
-- Name: inventory_movements_movement_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX inventory_movements_movement_type ON public.inventory_movements USING btree ("movementType");


--
-- TOC entry 4974 (class 1259 OID 22474)
-- Name: inventory_movements_organization_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX inventory_movements_organization_id ON public.inventory_movements USING btree ("organizationId");


--
-- TOC entry 4977 (class 1259 OID 22475)
-- Name: inventory_movements_product_variant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX inventory_movements_product_variant_id ON public.inventory_movements USING btree ("productVariantId");


--
-- TOC entry 4978 (class 1259 OID 22482)
-- Name: inventory_movements_product_variant_id_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX inventory_movements_product_variant_id_created_at ON public.inventory_movements USING btree ("productVariantId", "createdAt");


--
-- TOC entry 4979 (class 1259 OID 22477)
-- Name: inventory_movements_reference_type_reference_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX inventory_movements_reference_type_reference_id ON public.inventory_movements USING btree ("referenceType", "referenceId");


--
-- TOC entry 4980 (class 1259 OID 22479)
-- Name: inventory_movements_to_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX inventory_movements_to_location_id ON public.inventory_movements USING btree ("toLocationId");


--
-- TOC entry 4981 (class 1259 OID 22480)
-- Name: inventory_movements_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX inventory_movements_user_id ON public.inventory_movements USING btree ("userId");


--
-- TOC entry 4903 (class 1259 OID 22237)
-- Name: organizations_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX organizations_code ON public.organizations USING btree (code);


--
-- TOC entry 4996 (class 1259 OID 22565)
-- Name: picking_order_lines_from_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX picking_order_lines_from_location_id ON public.picking_order_lines USING btree ("fromLocationId");


--
-- TOC entry 4997 (class 1259 OID 22562)
-- Name: picking_order_lines_picking_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX picking_order_lines_picking_order_id ON public.picking_order_lines USING btree ("pickingOrderId");


--
-- TOC entry 4998 (class 1259 OID 22566)
-- Name: picking_order_lines_picking_order_id_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX picking_order_lines_picking_order_id_status ON public.picking_order_lines USING btree ("pickingOrderId", status);


--
-- TOC entry 5001 (class 1259 OID 22563)
-- Name: picking_order_lines_product_variant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX picking_order_lines_product_variant_id ON public.picking_order_lines USING btree ("productVariantId");


--
-- TOC entry 5002 (class 1259 OID 22564)
-- Name: picking_order_lines_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX picking_order_lines_status ON public.picking_order_lines USING btree (status);


--
-- TOC entry 4982 (class 1259 OID 22524)
-- Name: picking_orders_assigned_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX picking_orders_assigned_user_id ON public.picking_orders USING btree ("assignedUserId");


--
-- TOC entry 4985 (class 1259 OID 22526)
-- Name: picking_orders_axis_pos_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX picking_orders_axis_pos_order_id ON public.picking_orders USING btree ("axisPosOrderId");


--
-- TOC entry 4986 (class 1259 OID 22527)
-- Name: picking_orders_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX picking_orders_created_at ON public.picking_orders USING btree ("createdAt");


--
-- TOC entry 4987 (class 1259 OID 22521)
-- Name: picking_orders_organization_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX picking_orders_organization_id ON public.picking_orders USING btree ("organizationId");


--
-- TOC entry 4988 (class 1259 OID 22520)
-- Name: picking_orders_organization_id_order_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX picking_orders_organization_id_order_number ON public.picking_orders USING btree ("organizationId", "orderNumber");


--
-- TOC entry 4991 (class 1259 OID 22525)
-- Name: picking_orders_priority; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX picking_orders_priority ON public.picking_orders USING btree (priority);


--
-- TOC entry 4992 (class 1259 OID 22523)
-- Name: picking_orders_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX picking_orders_status ON public.picking_orders USING btree (status);


--
-- TOC entry 4993 (class 1259 OID 22529)
-- Name: picking_orders_status_priority; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX picking_orders_status_priority ON public.picking_orders USING btree (status, priority);


--
-- TOC entry 4994 (class 1259 OID 22528)
-- Name: picking_orders_status_warehouse_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX picking_orders_status_warehouse_id ON public.picking_orders USING btree (status, "warehouseId");


--
-- TOC entry 4995 (class 1259 OID 22522)
-- Name: picking_orders_warehouse_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX picking_orders_warehouse_id ON public.picking_orders USING btree ("warehouseId");


--
-- TOC entry 4919 (class 1259 OID 22291)
-- Name: product_categories_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX product_categories_is_active ON public.product_categories USING btree ("isActive");


--
-- TOC entry 4920 (class 1259 OID 22289)
-- Name: product_categories_organization_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX product_categories_organization_id ON public.product_categories USING btree ("organizationId");


--
-- TOC entry 4921 (class 1259 OID 22288)
-- Name: product_categories_organization_id_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX product_categories_organization_id_code ON public.product_categories USING btree ("organizationId", code);


--
-- TOC entry 4922 (class 1259 OID 22290)
-- Name: product_categories_parent_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX product_categories_parent_id ON public.product_categories USING btree ("parentId");


--
-- TOC entry 4937 (class 1259 OID 22344)
-- Name: product_variants_axis_pos_variant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX product_variants_axis_pos_variant_id ON public.product_variants USING btree ("axisPosVariantId");


--
-- TOC entry 4938 (class 1259 OID 22343)
-- Name: product_variants_barcode; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX product_variants_barcode ON public.product_variants USING btree (barcode);


--
-- TOC entry 4941 (class 1259 OID 22345)
-- Name: product_variants_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX product_variants_is_active ON public.product_variants USING btree ("isActive");


--
-- TOC entry 4944 (class 1259 OID 22341)
-- Name: product_variants_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX product_variants_product_id ON public.product_variants USING btree ("productId");


--
-- TOC entry 4945 (class 1259 OID 22340)
-- Name: product_variants_product_id_sku; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX product_variants_product_id_sku ON public.product_variants USING btree ("productId", sku);


--
-- TOC entry 4946 (class 1259 OID 22342)
-- Name: product_variants_sku; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX product_variants_sku ON public.product_variants USING btree (sku);


--
-- TOC entry 4927 (class 1259 OID 22320)
-- Name: products_axis_pos_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_axis_pos_product_id ON public.products USING btree ("axisPosProductId");


--
-- TOC entry 4928 (class 1259 OID 22318)
-- Name: products_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_category_id ON public.products USING btree ("categoryId");


--
-- TOC entry 4929 (class 1259 OID 22319)
-- Name: products_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_is_active ON public.products USING btree ("isActive");


--
-- TOC entry 4930 (class 1259 OID 22317)
-- Name: products_organization_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_organization_id ON public.products USING btree ("organizationId");


--
-- TOC entry 4931 (class 1259 OID 22316)
-- Name: products_organization_id_sku; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX products_organization_id_sku ON public.products USING btree ("organizationId", sku);


--
-- TOC entry 4934 (class 1259 OID 22321)
-- Name: products_sku; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_sku ON public.products USING btree (sku);


--
-- TOC entry 5060 (class 1259 OID 22863)
-- Name: receiving_order_lines_product_variant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX receiving_order_lines_product_variant_id ON public.receiving_order_lines USING btree ("productVariantId");


--
-- TOC entry 5061 (class 1259 OID 22862)
-- Name: receiving_order_lines_receiving_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX receiving_order_lines_receiving_order_id ON public.receiving_order_lines USING btree ("receivingOrderId");


--
-- TOC entry 5062 (class 1259 OID 22865)
-- Name: receiving_order_lines_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX receiving_order_lines_status ON public.receiving_order_lines USING btree (status);


--
-- TOC entry 5063 (class 1259 OID 22864)
-- Name: receiving_order_lines_to_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX receiving_order_lines_to_location_id ON public.receiving_order_lines USING btree ("toLocationId");


--
-- TOC entry 5048 (class 1259 OID 22813)
-- Name: receiving_orders_assigned_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX receiving_orders_assigned_user_id ON public.receiving_orders USING btree ("assignedUserId");


--
-- TOC entry 5049 (class 1259 OID 22814)
-- Name: receiving_orders_expected_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX receiving_orders_expected_date ON public.receiving_orders USING btree ("expectedDate");


--
-- TOC entry 5052 (class 1259 OID 22815)
-- Name: receiving_orders_org_number_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX receiving_orders_org_number_unique ON public.receiving_orders USING btree ("organizationId", "orderNumber");


--
-- TOC entry 5053 (class 1259 OID 22810)
-- Name: receiving_orders_organization_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX receiving_orders_organization_id ON public.receiving_orders USING btree ("organizationId");


--
-- TOC entry 5056 (class 1259 OID 22812)
-- Name: receiving_orders_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX receiving_orders_status ON public.receiving_orders USING btree (status);


--
-- TOC entry 5057 (class 1259 OID 22811)
-- Name: receiving_orders_warehouse_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX receiving_orders_warehouse_id ON public.receiving_orders USING btree ("warehouseId");


--
-- TOC entry 4960 (class 1259 OID 22418)
-- Name: stock_locations_expiry_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX stock_locations_expiry_date ON public.stock_locations USING btree ("expiryDate");


--
-- TOC entry 4961 (class 1259 OID 22419)
-- Name: stock_locations_last_counted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX stock_locations_last_counted_at ON public.stock_locations USING btree ("lastCountedAt");


--
-- TOC entry 4964 (class 1259 OID 22415)
-- Name: stock_locations_product_variant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX stock_locations_product_variant_id ON public.stock_locations USING btree ("productVariantId");


--
-- TOC entry 4965 (class 1259 OID 22668)
-- Name: stock_locations_product_variant_id_warehouse_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX stock_locations_product_variant_id_warehouse_location_id ON public.stock_locations USING btree ("productVariantId", "warehouseLocationId") WHERE ("batchNumber" IS NULL);


--
-- TOC entry 4966 (class 1259 OID 22667)
-- Name: stock_locations_product_variant_id_warehouse_location_id_batch_; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX stock_locations_product_variant_id_warehouse_location_id_batch_ ON public.stock_locations USING btree ("productVariantId", "warehouseLocationId", "batchNumber") WHERE ("batchNumber" IS NOT NULL);


--
-- TOC entry 4967 (class 1259 OID 22417)
-- Name: stock_locations_quantity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX stock_locations_quantity ON public.stock_locations USING btree (quantity);


--
-- TOC entry 4968 (class 1259 OID 22413)
-- Name: stock_locations_unique_with_batch; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX stock_locations_unique_with_batch ON public.stock_locations USING btree ("productVariantId", "warehouseLocationId", "batchNumber") WHERE ("batchNumber" IS NOT NULL);


--
-- TOC entry 4969 (class 1259 OID 22414)
-- Name: stock_locations_unique_without_batch; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX stock_locations_unique_without_batch ON public.stock_locations USING btree ("productVariantId", "warehouseLocationId") WHERE ("batchNumber" IS NULL);


--
-- TOC entry 4970 (class 1259 OID 22416)
-- Name: stock_locations_warehouse_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX stock_locations_warehouse_location_id ON public.stock_locations USING btree ("warehouseLocationId");


--
-- TOC entry 5020 (class 1259 OID 22661)
-- Name: sync_logs_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sync_logs_created_at ON public.sync_logs USING btree ("createdAt");


--
-- TOC entry 5021 (class 1259 OID 22665)
-- Name: sync_logs_created_at_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sync_logs_created_at_status ON public.sync_logs USING btree ("createdAt", status);


--
-- TOC entry 5022 (class 1259 OID 22659)
-- Name: sync_logs_direction; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sync_logs_direction ON public.sync_logs USING btree (direction);


--
-- TOC entry 5023 (class 1259 OID 22657)
-- Name: sync_logs_organization_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sync_logs_organization_id ON public.sync_logs USING btree ("organizationId");


--
-- TOC entry 5024 (class 1259 OID 22663)
-- Name: sync_logs_organization_id_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sync_logs_organization_id_status ON public.sync_logs USING btree ("organizationId", status);


--
-- TOC entry 5025 (class 1259 OID 22662)
-- Name: sync_logs_organization_id_sync_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sync_logs_organization_id_sync_type ON public.sync_logs USING btree ("organizationId", "syncType");


--
-- TOC entry 5028 (class 1259 OID 22660)
-- Name: sync_logs_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sync_logs_status ON public.sync_logs USING btree (status);


--
-- TOC entry 5029 (class 1259 OID 22658)
-- Name: sync_logs_sync_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sync_logs_sync_type ON public.sync_logs USING btree ("syncType");


--
-- TOC entry 5030 (class 1259 OID 22664)
-- Name: sync_logs_sync_type_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sync_logs_sync_type_status ON public.sync_logs USING btree ("syncType", status);


--
-- TOC entry 5010 (class 1259 OID 22629)
-- Name: sync_queue_entity_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sync_queue_entity_type ON public.sync_queue USING btree ("entityType");


--
-- TOC entry 5011 (class 1259 OID 22633)
-- Name: sync_queue_entity_type_entity_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sync_queue_entity_type_entity_id ON public.sync_queue USING btree ("entityType", "entityId");


--
-- TOC entry 5012 (class 1259 OID 22630)
-- Name: sync_queue_operation; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sync_queue_operation ON public.sync_queue USING btree (operation);


--
-- TOC entry 5013 (class 1259 OID 22626)
-- Name: sync_queue_organization_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sync_queue_organization_id ON public.sync_queue USING btree ("organizationId");


--
-- TOC entry 5014 (class 1259 OID 22632)
-- Name: sync_queue_organization_id_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sync_queue_organization_id_status ON public.sync_queue USING btree ("organizationId", status);


--
-- TOC entry 5017 (class 1259 OID 22628)
-- Name: sync_queue_scheduled_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sync_queue_scheduled_at ON public.sync_queue USING btree ("scheduledAt");


--
-- TOC entry 5018 (class 1259 OID 22627)
-- Name: sync_queue_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sync_queue_status ON public.sync_queue USING btree (status);


--
-- TOC entry 5019 (class 1259 OID 22631)
-- Name: sync_queue_status_scheduled_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sync_queue_status_scheduled_at ON public.sync_queue USING btree (status, "scheduledAt");


--
-- TOC entry 4908 (class 1259 OID 22266)
-- Name: users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email ON public.users USING btree (email);


--
-- TOC entry 4911 (class 1259 OID 22269)
-- Name: users_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_is_active ON public.users USING btree ("isActive");


--
-- TOC entry 4912 (class 1259 OID 22267)
-- Name: users_organization_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_organization_id ON public.users USING btree ("organizationId");


--
-- TOC entry 4915 (class 1259 OID 22268)
-- Name: users_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_role ON public.users USING btree (role);


--
-- TOC entry 4916 (class 1259 OID 22265)
-- Name: users_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_username ON public.users USING btree (username);


--
-- TOC entry 4953 (class 1259 OID 22392)
-- Name: warehouse_locations_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX warehouse_locations_is_active ON public.warehouse_locations USING btree ("isActive");


--
-- TOC entry 4954 (class 1259 OID 22390)
-- Name: warehouse_locations_location_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX warehouse_locations_location_type ON public.warehouse_locations USING btree ("locationType");


--
-- TOC entry 4957 (class 1259 OID 22389)
-- Name: warehouse_locations_warehouse_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX warehouse_locations_warehouse_id ON public.warehouse_locations USING btree ("warehouseId");


--
-- TOC entry 4958 (class 1259 OID 22388)
-- Name: warehouse_locations_warehouse_id_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX warehouse_locations_warehouse_id_code ON public.warehouse_locations USING btree ("warehouseId", code);


--
-- TOC entry 4959 (class 1259 OID 22391)
-- Name: warehouse_locations_zone; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX warehouse_locations_zone ON public.warehouse_locations USING btree (zone);


--
-- TOC entry 4947 (class 1259 OID 22367)
-- Name: warehouses_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX warehouses_is_active ON public.warehouses USING btree ("isActive");


--
-- TOC entry 4948 (class 1259 OID 22366)
-- Name: warehouses_manager_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX warehouses_manager_id ON public.warehouses USING btree ("managerId");


--
-- TOC entry 4949 (class 1259 OID 22365)
-- Name: warehouses_organization_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX warehouses_organization_id ON public.warehouses USING btree ("organizationId");


--
-- TOC entry 4950 (class 1259 OID 22364)
-- Name: warehouses_organization_id_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX warehouses_organization_id_code ON public.warehouses USING btree ("organizationId", code);


--
-- TOC entry 5086 (class 2606 OID 22578)
-- Name: axis_pos_config axis_pos_config_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.axis_pos_config
    ADD CONSTRAINT "axis_pos_config_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public.organizations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5092 (class 2606 OID 22763)
-- Name: cycle_count_lines cycle_count_lines_countedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cycle_count_lines
    ADD CONSTRAINT "cycle_count_lines_countedBy_fkey" FOREIGN KEY ("countedBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5093 (class 2606 OID 22743)
-- Name: cycle_count_lines cycle_count_lines_cycleCountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cycle_count_lines
    ADD CONSTRAINT "cycle_count_lines_cycleCountId_fkey" FOREIGN KEY ("cycleCountId") REFERENCES public.cycle_counts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5094 (class 2606 OID 22748)
-- Name: cycle_count_lines cycle_count_lines_productVariantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cycle_count_lines
    ADD CONSTRAINT "cycle_count_lines_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES public.product_variants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5095 (class 2606 OID 22758)
-- Name: cycle_count_lines cycle_count_lines_stockLocationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cycle_count_lines
    ADD CONSTRAINT "cycle_count_lines_stockLocationId_fkey" FOREIGN KEY ("stockLocationId") REFERENCES public.stock_locations(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5096 (class 2606 OID 22753)
-- Name: cycle_count_lines cycle_count_lines_warehouseLocationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cycle_count_lines
    ADD CONSTRAINT "cycle_count_lines_warehouseLocationId_fkey" FOREIGN KEY ("warehouseLocationId") REFERENCES public.warehouse_locations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5089 (class 2606 OID 22714)
-- Name: cycle_counts cycle_counts_assignedUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cycle_counts
    ADD CONSTRAINT "cycle_counts_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5090 (class 2606 OID 22704)
-- Name: cycle_counts cycle_counts_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cycle_counts
    ADD CONSTRAINT "cycle_counts_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public.organizations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5091 (class 2606 OID 22709)
-- Name: cycle_counts cycle_counts_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cycle_counts
    ADD CONSTRAINT "cycle_counts_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5075 (class 2606 OID 22459)
-- Name: inventory_movements inventory_movements_fromLocationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_movements
    ADD CONSTRAINT "inventory_movements_fromLocationId_fkey" FOREIGN KEY ("fromLocationId") REFERENCES public.warehouse_locations(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5076 (class 2606 OID 22449)
-- Name: inventory_movements inventory_movements_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_movements
    ADD CONSTRAINT "inventory_movements_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public.organizations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5077 (class 2606 OID 22454)
-- Name: inventory_movements inventory_movements_productVariantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_movements
    ADD CONSTRAINT "inventory_movements_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES public.product_variants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5078 (class 2606 OID 22464)
-- Name: inventory_movements inventory_movements_toLocationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_movements
    ADD CONSTRAINT "inventory_movements_toLocationId_fkey" FOREIGN KEY ("toLocationId") REFERENCES public.warehouse_locations(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5079 (class 2606 OID 22469)
-- Name: inventory_movements inventory_movements_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_movements
    ADD CONSTRAINT "inventory_movements_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5083 (class 2606 OID 22557)
-- Name: picking_order_lines picking_order_lines_fromLocationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.picking_order_lines
    ADD CONSTRAINT "picking_order_lines_fromLocationId_fkey" FOREIGN KEY ("fromLocationId") REFERENCES public.warehouse_locations(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5084 (class 2606 OID 22547)
-- Name: picking_order_lines picking_order_lines_pickingOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.picking_order_lines
    ADD CONSTRAINT "picking_order_lines_pickingOrderId_fkey" FOREIGN KEY ("pickingOrderId") REFERENCES public.picking_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5085 (class 2606 OID 22552)
-- Name: picking_order_lines picking_order_lines_productVariantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.picking_order_lines
    ADD CONSTRAINT "picking_order_lines_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES public.product_variants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5080 (class 2606 OID 22515)
-- Name: picking_orders picking_orders_assignedUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.picking_orders
    ADD CONSTRAINT "picking_orders_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5081 (class 2606 OID 22505)
-- Name: picking_orders picking_orders_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.picking_orders
    ADD CONSTRAINT "picking_orders_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public.organizations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5082 (class 2606 OID 22510)
-- Name: picking_orders picking_orders_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.picking_orders
    ADD CONSTRAINT "picking_orders_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5065 (class 2606 OID 22278)
-- Name: product_categories product_categories_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT "product_categories_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public.organizations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5066 (class 2606 OID 22283)
-- Name: product_categories product_categories_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT "product_categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public.product_categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5069 (class 2606 OID 22335)
-- Name: product_variants product_variants_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5067 (class 2606 OID 22311)
-- Name: products products_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.product_categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5068 (class 2606 OID 22306)
-- Name: products products_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "products_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public.organizations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5100 (class 2606 OID 22852)
-- Name: receiving_order_lines receiving_order_lines_productVariantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receiving_order_lines
    ADD CONSTRAINT "receiving_order_lines_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES public.product_variants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5101 (class 2606 OID 22847)
-- Name: receiving_order_lines receiving_order_lines_receivingOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receiving_order_lines
    ADD CONSTRAINT "receiving_order_lines_receivingOrderId_fkey" FOREIGN KEY ("receivingOrderId") REFERENCES public.receiving_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5102 (class 2606 OID 22857)
-- Name: receiving_order_lines receiving_order_lines_toLocationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receiving_order_lines
    ADD CONSTRAINT "receiving_order_lines_toLocationId_fkey" FOREIGN KEY ("toLocationId") REFERENCES public.warehouse_locations(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5097 (class 2606 OID 22805)
-- Name: receiving_orders receiving_orders_assignedUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receiving_orders
    ADD CONSTRAINT "receiving_orders_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5098 (class 2606 OID 22795)
-- Name: receiving_orders receiving_orders_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receiving_orders
    ADD CONSTRAINT "receiving_orders_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public.organizations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5099 (class 2606 OID 22800)
-- Name: receiving_orders receiving_orders_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receiving_orders
    ADD CONSTRAINT "receiving_orders_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5073 (class 2606 OID 22403)
-- Name: stock_locations stock_locations_productVariantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_locations
    ADD CONSTRAINT "stock_locations_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES public.product_variants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5074 (class 2606 OID 22408)
-- Name: stock_locations stock_locations_warehouseLocationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_locations
    ADD CONSTRAINT "stock_locations_warehouseLocationId_fkey" FOREIGN KEY ("warehouseLocationId") REFERENCES public.warehouse_locations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5088 (class 2606 OID 22652)
-- Name: sync_logs sync_logs_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sync_logs
    ADD CONSTRAINT "sync_logs_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public.organizations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5087 (class 2606 OID 22621)
-- Name: sync_queue sync_queue_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sync_queue
    ADD CONSTRAINT "sync_queue_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public.organizations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5064 (class 2606 OID 22260)
-- Name: users users_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public.organizations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5072 (class 2606 OID 22383)
-- Name: warehouse_locations warehouse_locations_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_locations
    ADD CONSTRAINT "warehouse_locations_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5070 (class 2606 OID 22359)
-- Name: warehouses warehouses_managerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT "warehouses_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5071 (class 2606 OID 22354)
-- Name: warehouses warehouses_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT "warehouses_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public.organizations(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2026-02-01 22:42:36

--
-- PostgreSQL database dump complete
--

\unrestrict ywx6OpGtqAEff5BTRItURFJOnx3nCI4DRZehBjCtRnTbghwB4hJi5EUHcdRkrhf

-- Completed on 2026-02-01 22:42:36

--
-- PostgreSQL database cluster dump complete
--

