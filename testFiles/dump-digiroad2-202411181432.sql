--
-- PostgreSQL database cluster dump
--

-- Started on 2024-11-18 14:32:49 EET

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE digiroad2;
ALTER ROLE digiroad2 WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;

--
-- User Configurations
--








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

-- Dumped from database version 16.1 (Debian 16.1-1.pgdg110+1)
-- Dumped by pg_dump version 17.0 (Ubuntu 17.0-1.pgdg20.04+1)

-- Started on 2024-11-18 14:32:50 EET

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

-- Completed on 2024-11-18 14:32:50 EET

--
-- PostgreSQL database dump complete
--

--
-- Database "digiroad2" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Debian 16.1-1.pgdg110+1)
-- Dumped by pg_dump version 17.0 (Ubuntu 17.0-1.pgdg20.04+1)

-- Started on 2024-11-18 14:32:50 EET

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
-- TOC entry 5517 (class 1262 OID 16384)
-- Name: digiroad2; Type: DATABASE; Schema: -; Owner: digiroad2
--

CREATE DATABASE digiroad2 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE digiroad2 OWNER TO digiroad2;

\connect digiroad2

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
-- TOC entry 5518 (class 0 OID 0)
-- Name: digiroad2; Type: DATABASE PROPERTIES; Schema: -; Owner: digiroad2
--

ALTER DATABASE digiroad2 SET search_path TO '$user', 'public', 'topology', 'tiger';


\connect digiroad2

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
-- TOC entry 11 (class 2615 OID 19300)
-- Name: tiger; Type: SCHEMA; Schema: -; Owner: digiroad2
--

CREATE SCHEMA tiger;


ALTER SCHEMA tiger OWNER TO digiroad2;

--
-- TOC entry 12 (class 2615 OID 19556)
-- Name: tiger_data; Type: SCHEMA; Schema: -; Owner: digiroad2
--

CREATE SCHEMA tiger_data;


ALTER SCHEMA tiger_data OWNER TO digiroad2;

--
-- TOC entry 10 (class 2615 OID 19121)
-- Name: topology; Type: SCHEMA; Schema: -; Owner: digiroad2
--

CREATE SCHEMA topology;


ALTER SCHEMA topology OWNER TO digiroad2;

--
-- TOC entry 5519 (class 0 OID 0)
-- Dependencies: 10
-- Name: SCHEMA topology; Type: COMMENT; Schema: -; Owner: digiroad2
--

COMMENT ON SCHEMA topology IS 'PostGIS Topology schema';


--
-- TOC entry 4 (class 3079 OID 19288)
-- Name: fuzzystrmatch; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA public;


--
-- TOC entry 5520 (class 0 OID 0)
-- Dependencies: 4
-- Name: EXTENSION fuzzystrmatch; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION fuzzystrmatch IS 'determine similarities and distance between strings';


--
-- TOC entry 2 (class 3079 OID 18043)
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- TOC entry 5521 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- TOC entry 5 (class 3079 OID 19301)
-- Name: postgis_tiger_geocoder; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder WITH SCHEMA tiger;


--
-- TOC entry 5522 (class 0 OID 0)
-- Dependencies: 5
-- Name: EXTENSION postgis_tiger_geocoder; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_tiger_geocoder IS 'PostGIS tiger geocoder and reverse geocoder';


--
-- TOC entry 3 (class 3079 OID 19122)
-- Name: postgis_topology; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_topology WITH SCHEMA topology;


--
-- TOC entry 5523 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION postgis_topology; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_topology IS 'PostGIS topology spatial types and functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 284 (class 1259 OID 54335)
-- Name: additional_panel; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.additional_panel (
    id bigint,
    asset_id bigint NOT NULL,
    property_id bigint NOT NULL,
    additional_sign_type bigint,
    additional_sign_value character varying(128),
    additional_sign_info character varying(128),
    form_position bigint,
    additional_sign_text character varying(128),
    additional_sign_size bigint,
    additional_sign_coating_type bigint,
    additional_sign_panel_color bigint,
    CONSTRAINT sys_c003961016 CHECK ((form_position <= 5))
);


ALTER TABLE public.additional_panel OWNER TO digiroad2;

--
-- TOC entry 285 (class 1259 OID 54339)
-- Name: additional_panel_history; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.additional_panel_history (
    id bigint NOT NULL,
    asset_id bigint NOT NULL,
    property_id bigint NOT NULL,
    additional_sign_type bigint,
    additional_sign_value character varying(128),
    additional_sign_info character varying(128),
    form_position bigint,
    additional_sign_text character varying(128),
    additional_sign_size bigint,
    additional_sign_coating_type bigint,
    additional_sign_panel_color bigint,
    CONSTRAINT sys_c003961116 CHECK ((form_position <= 5))
);


ALTER TABLE public.additional_panel_history OWNER TO digiroad2;

--
-- TOC entry 286 (class 1259 OID 54343)
-- Name: administrative_class; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.administrative_class (
    id bigint NOT NULL,
    mml_id bigint,
    link_id character varying(40),
    administrative_class bigint,
    master_data_administrative_class bigint,
    created_date timestamp without time zone DEFAULT LOCALTIMESTAMP NOT NULL,
    modified_by character varying(128),
    created_by character varying(128),
    valid_to timestamp without time zone,
    vvh_id numeric(38,0)
);


ALTER TABLE public.administrative_class OWNER TO digiroad2;

--
-- TOC entry 287 (class 1259 OID 54347)
-- Name: asset; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.asset (
    id bigint NOT NULL,
    national_id bigint,
    asset_type_id bigint,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by character varying(128),
    modified_date timestamp without time zone,
    modified_by character varying(128),
    bearing bigint,
    valid_from timestamp without time zone,
    valid_to timestamp without time zone,
    geometry public.geometry,
    municipality_code bigint,
    floating boolean DEFAULT false,
    area numeric(38,0),
    verified_by character varying(128),
    verified_date timestamp without time zone,
    information_source numeric(38,0),
    external_id character varying(128),
    CONSTRAINT cons_floating_is_boolean CHECK ((floating = ANY (ARRAY[true, false]))),
    CONSTRAINT information_source CHECK ((information_source = ANY (ARRAY[(1)::numeric, (2)::numeric, (3)::numeric]))),
    CONSTRAINT validity_period CHECK ((valid_from <= valid_to))
);


ALTER TABLE public.asset OWNER TO digiroad2;

--
-- TOC entry 288 (class 1259 OID 54357)
-- Name: asset_history; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.asset_history (
    id bigint NOT NULL,
    national_id bigint,
    asset_type_id bigint,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by character varying(128),
    modified_date timestamp without time zone,
    modified_by character varying(128),
    bearing bigint,
    valid_from timestamp without time zone,
    valid_to timestamp without time zone,
    geometry public.geometry,
    municipality_code bigint,
    floating boolean DEFAULT false,
    area numeric(38,0),
    verified_by character varying(128),
    verified_date timestamp without time zone,
    information_source numeric(38,0),
    external_id character varying(128),
    CONSTRAINT hist_cons_floating_is_boolean CHECK ((floating = ANY (ARRAY[true, false]))),
    CONSTRAINT hist_information_source CHECK ((information_source = ANY (ARRAY[(1)::numeric, (2)::numeric, (3)::numeric]))),
    CONSTRAINT hist_validity_period CHECK ((valid_from <= valid_to))
);


ALTER TABLE public.asset_history OWNER TO digiroad2;

--
-- TOC entry 289 (class 1259 OID 54367)
-- Name: asset_link; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.asset_link (
    asset_id bigint,
    position_id numeric(38,0)
);


ALTER TABLE public.asset_link OWNER TO digiroad2;

--
-- TOC entry 290 (class 1259 OID 54370)
-- Name: asset_link_history; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.asset_link_history (
    asset_id bigint,
    position_id numeric(38,0)
);


ALTER TABLE public.asset_link_history OWNER TO digiroad2;

--
-- TOC entry 291 (class 1259 OID 54373)
-- Name: asset_type; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.asset_type (
    id bigint NOT NULL,
    name character varying(512) NOT NULL,
    geometry_type character varying(128) NOT NULL,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by character varying(128),
    modified_date timestamp without time zone,
    modified_by character varying(128),
    verifiable bigint DEFAULT 0
);


ALTER TABLE public.asset_type OWNER TO digiroad2;

--
-- TOC entry 292 (class 1259 OID 54380)
-- Name: assets_on_expired_road_links; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.assets_on_expired_road_links (
    asset_id bigint NOT NULL,
    asset_type_id integer NOT NULL,
    link_id character varying(40) NOT NULL,
    side_code integer,
    start_measure numeric(1000,3),
    end_measure numeric(1000,3),
    road_link_expired_date timestamp without time zone NOT NULL,
    asset_geometry public.geometry
);


ALTER TABLE public.assets_on_expired_road_links OWNER TO digiroad2;

--
-- TOC entry 293 (class 1259 OID 54385)
-- Name: automatically_processed_lanes_work_list; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.automatically_processed_lanes_work_list (
    id bigint NOT NULL,
    link_id character varying(40),
    property character varying(128),
    old_value integer,
    new_value integer,
    start_dates character varying(128),
    created_date timestamp without time zone,
    created_by character varying(128)
);


ALTER TABLE public.automatically_processed_lanes_work_list OWNER TO digiroad2;

--
-- TOC entry 294 (class 1259 OID 54388)
-- Name: change_table; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.change_table (
    id numeric(38,0) NOT NULL,
    edit_date timestamp without time zone NOT NULL,
    edit_by character varying NOT NULL,
    change_type integer NOT NULL,
    asset_type_id integer NOT NULL,
    asset_id numeric NOT NULL,
    start_m_value numeric,
    end_m_value numeric,
    value character varying,
    value_type character varying,
    link_id character varying,
    side_code integer,
    CONSTRAINT change_type_values CHECK ((change_type = ANY (ARRAY[1, 2, 3]))),
    CONSTRAINT value_type_not_null_if_value CHECK (((value IS NULL) OR (value_type IS NOT NULL)))
);


ALTER TABLE public.change_table OWNER TO digiroad2;

--
-- TOC entry 295 (class 1259 OID 54395)
-- Name: connected_asset; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.connected_asset (
    linear_asset_id bigint NOT NULL,
    point_asset_id bigint NOT NULL,
    created_date timestamp without time zone DEFAULT LOCALTIMESTAMP NOT NULL,
    modified_date timestamp without time zone,
    valid_to timestamp without time zone
);


ALTER TABLE public.connected_asset OWNER TO digiroad2;

--
-- TOC entry 296 (class 1259 OID 54399)
-- Name: connected_asset_history; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.connected_asset_history (
    linear_asset_id bigint NOT NULL,
    point_asset_id bigint NOT NULL,
    created_date timestamp without time zone DEFAULT LOCALTIMESTAMP NOT NULL,
    modified_date timestamp without time zone,
    valid_to timestamp without time zone
);


ALTER TABLE public.connected_asset_history OWNER TO digiroad2;

--
-- TOC entry 297 (class 1259 OID 54403)
-- Name: dashboard_info; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.dashboard_info (
    municipality_id numeric(22,0),
    asset_type_id numeric(22,0),
    modified_by character varying(128),
    last_modified_date timestamp without time zone
);


ALTER TABLE public.dashboard_info OWNER TO digiroad2;

--
-- TOC entry 298 (class 1259 OID 54406)
-- Name: date_period_value; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.date_period_value (
    id bigint NOT NULL,
    asset_id bigint NOT NULL,
    property_id bigint NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL
);


ALTER TABLE public.date_period_value OWNER TO digiroad2;

--
-- TOC entry 299 (class 1259 OID 54409)
-- Name: date_period_value_history; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.date_period_value_history (
    id bigint NOT NULL,
    asset_id bigint NOT NULL,
    property_id bigint NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL
);


ALTER TABLE public.date_period_value_history OWNER TO digiroad2;

--
-- TOC entry 300 (class 1259 OID 54412)
-- Name: date_property_value; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.date_property_value (
    id bigint NOT NULL,
    asset_id bigint NOT NULL,
    property_id bigint NOT NULL,
    date_time timestamp without time zone NOT NULL
);


ALTER TABLE public.date_property_value OWNER TO digiroad2;

--
-- TOC entry 301 (class 1259 OID 54415)
-- Name: date_property_value_history; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.date_property_value_history (
    id bigint NOT NULL,
    asset_id bigint NOT NULL,
    property_id bigint NOT NULL,
    date_time timestamp without time zone NOT NULL
);


ALTER TABLE public.date_property_value_history OWNER TO digiroad2;

--
-- TOC entry 302 (class 1259 OID 54418)
-- Name: ely; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.ely (
    id smallint NOT NULL,
    name_fi character varying(512) NOT NULL,
    name_sv character varying(512) NOT NULL,
    geometry public.geometry,
    zoom smallint
);


ALTER TABLE public.ely OWNER TO digiroad2;

--
-- TOC entry 303 (class 1259 OID 54423)
-- Name: enumerated_value; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.enumerated_value (
    id bigint NOT NULL,
    property_id bigint NOT NULL,
    value numeric,
    name_fi character varying(512) NOT NULL,
    name_sv character varying(512),
    image_id bigint,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by character varying(128),
    modified_date timestamp without time zone,
    modified_by character varying(128)
);


ALTER TABLE public.enumerated_value OWNER TO digiroad2;

--
-- TOC entry 304 (class 1259 OID 54429)
-- Name: export_lock; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.export_lock (
    id numeric(38,0) NOT NULL,
    description character varying(4000),
    CONSTRAINT ck_export_id CHECK ((id = (1)::numeric))
);


ALTER TABLE public.export_lock OWNER TO digiroad2;

--
-- TOC entry 305 (class 1259 OID 54435)
-- Name: export_report; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.export_report (
    id numeric(38,0) NOT NULL,
    content text,
    file_name character varying(512),
    exported_assets character varying(2048),
    municipalities character varying(2048),
    status smallint DEFAULT 1 NOT NULL,
    created_by character varying(256),
    created_date timestamp without time zone DEFAULT LOCALTIMESTAMP NOT NULL
);


ALTER TABLE public.export_report OWNER TO digiroad2;

--
-- TOC entry 306 (class 1259 OID 54442)
-- Name: feedback; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.feedback (
    id bigint NOT NULL,
    created_by character varying(128),
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    subject character varying(128),
    body character varying(4000),
    status boolean DEFAULT false,
    status_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT status CHECK ((status = ANY (ARRAY[true, false])))
);


ALTER TABLE public.feedback OWNER TO digiroad2;

--
-- TOC entry 307 (class 1259 OID 54451)
-- Name: functional_class; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.functional_class (
    mml_id bigint,
    functional_class integer NOT NULL,
    modified_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_by character varying(128),
    link_id character varying(40),
    id bigint NOT NULL,
    vvh_id numeric(38,0)
);


ALTER TABLE public.functional_class OWNER TO digiroad2;

--
-- TOC entry 308 (class 1259 OID 54455)
-- Name: grouped_id_seq; Type: SEQUENCE; Schema: public; Owner: digiroad2
--

CREATE SEQUENCE public.grouped_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 100;


ALTER SEQUENCE public.grouped_id_seq OWNER TO digiroad2;

--
-- TOC entry 309 (class 1259 OID 54456)
-- Name: import_log; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.import_log (
    id numeric(38,0) NOT NULL,
    content text,
    import_type character varying(50),
    file_name character varying(128),
    status smallint DEFAULT 1 NOT NULL,
    created_date timestamp without time zone DEFAULT LOCALTIMESTAMP NOT NULL,
    created_by character varying(128)
);


ALTER TABLE public.import_log OWNER TO digiroad2;

--
-- TOC entry 310 (class 1259 OID 54463)
-- Name: inaccurate_asset; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.inaccurate_asset (
    asset_id bigint,
    asset_type_id bigint NOT NULL,
    municipality_code integer,
    administrative_class smallint,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    link_id character varying(40),
    vvh_id numeric(38,0)
);


ALTER TABLE public.inaccurate_asset OWNER TO digiroad2;

--
-- TOC entry 311 (class 1259 OID 54467)
-- Name: incomplete_link; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.incomplete_link (
    mml_id bigint,
    municipality_code bigint,
    administrative_class bigint,
    link_id character varying(40),
    id bigint NOT NULL,
    vvh_id numeric(38,0)
);


ALTER TABLE public.incomplete_link OWNER TO digiroad2;

--
-- TOC entry 312 (class 1259 OID 54470)
-- Name: kgv_roadlink; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.kgv_roadlink (
    linkid character varying(40),
    vvh_id numeric(38,0),
    mtkid numeric(38,0),
    adminclass integer,
    municipalitycode integer,
    mtkclass numeric(38,0),
    roadname_fi character varying(80),
    roadname_se character varying(80),
    roadnamesme character varying(80),
    roadnamesmn character varying(80),
    roadnamesms character varying(80),
    roadnumber numeric(38,0),
    roadpartnumber integer,
    surfacetype integer,
    constructiontype integer,
    directiontype integer,
    verticallevel integer,
    horizontalaccuracy numeric,
    verticalaccuracy numeric,
    geometrylength numeric(1000,3),
    mtkhereflip integer,
    from_left numeric(38,0),
    to_left numeric(38,0),
    from_right numeric(38,0),
    to_right numeric(38,0),
    created_date timestamp without time zone,
    last_edited_date timestamp without time zone,
    shape public.geometry(LineStringZM,3067),
    expired_date timestamp without time zone,
    CONSTRAINT expired_date_constraint CHECK ((expired_date <= CURRENT_TIMESTAMP))
);


ALTER TABLE public.kgv_roadlink OWNER TO digiroad2;

--
-- TOC entry 313 (class 1259 OID 54476)
-- Name: lane; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.lane (
    id bigint NOT NULL,
    lane_code numeric(20,0) NOT NULL,
    created_date timestamp without time zone NOT NULL,
    created_by character varying(128) NOT NULL,
    modified_date timestamp without time zone,
    modified_by character varying(128),
    expired_date timestamp without time zone,
    expired_by character varying(128),
    valid_from timestamp without time zone,
    valid_to timestamp without time zone,
    municipality_code bigint
);


ALTER TABLE public.lane OWNER TO digiroad2;

--
-- TOC entry 314 (class 1259 OID 54479)
-- Name: lane_attribute; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.lane_attribute (
    id bigint NOT NULL,
    lane_id bigint,
    name character varying(128),
    value character varying(128),
    required boolean DEFAULT false,
    created_date timestamp without time zone,
    created_by character varying(128),
    modified_date timestamp without time zone,
    modified_by character varying(128)
);


ALTER TABLE public.lane_attribute OWNER TO digiroad2;

--
-- TOC entry 315 (class 1259 OID 54485)
-- Name: lane_history; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.lane_history (
    id bigint NOT NULL,
    new_id bigint,
    old_id bigint,
    lane_code numeric(20,0) NOT NULL,
    created_date timestamp without time zone NOT NULL,
    created_by character varying(128) NOT NULL,
    modified_date timestamp without time zone,
    modified_by character varying(128),
    expired_date timestamp without time zone,
    expired_by character varying(128),
    valid_from timestamp without time zone,
    valid_to timestamp without time zone,
    municipality_code bigint,
    history_created_date timestamp without time zone NOT NULL,
    history_created_by character varying(128) NOT NULL,
    event_order_number numeric
);


ALTER TABLE public.lane_history OWNER TO digiroad2;

--
-- TOC entry 316 (class 1259 OID 54490)
-- Name: lane_history_attribute; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.lane_history_attribute (
    id bigint NOT NULL,
    lane_history_id bigint,
    name character varying(128),
    value character varying(128),
    required boolean DEFAULT false,
    created_date timestamp without time zone,
    created_by character varying(128),
    modified_date timestamp without time zone,
    modified_by character varying(128)
);


ALTER TABLE public.lane_history_attribute OWNER TO digiroad2;

--
-- TOC entry 317 (class 1259 OID 54496)
-- Name: lane_history_event_order_seq; Type: SEQUENCE; Schema: public; Owner: digiroad2
--

CREATE SEQUENCE public.lane_history_event_order_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lane_history_event_order_seq OWNER TO digiroad2;

--
-- TOC entry 318 (class 1259 OID 54497)
-- Name: lane_history_link; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.lane_history_link (
    lane_id bigint NOT NULL,
    lane_position_id bigint NOT NULL
);


ALTER TABLE public.lane_history_link OWNER TO digiroad2;

--
-- TOC entry 319 (class 1259 OID 54500)
-- Name: lane_history_position; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.lane_history_position (
    id bigint NOT NULL,
    side_code integer NOT NULL,
    start_measure numeric(1000,3) NOT NULL,
    end_measure numeric(1000,3) NOT NULL,
    link_id character varying(40),
    adjusted_timestamp numeric(38,0),
    modified_date timestamp without time zone,
    vvh_id bigint
);


ALTER TABLE public.lane_history_position OWNER TO digiroad2;

--
-- TOC entry 320 (class 1259 OID 54503)
-- Name: lane_link; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.lane_link (
    lane_id bigint NOT NULL,
    lane_position_id bigint NOT NULL
);


ALTER TABLE public.lane_link OWNER TO digiroad2;

--
-- TOC entry 321 (class 1259 OID 54506)
-- Name: lane_position; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.lane_position (
    id bigint NOT NULL,
    side_code integer NOT NULL,
    start_measure numeric(1000,3) NOT NULL,
    end_measure numeric(1000,3) NOT NULL,
    link_id character varying(40),
    adjusted_timestamp numeric(38,0),
    modified_date timestamp without time zone,
    vvh_id bigint
);


ALTER TABLE public.lane_position OWNER TO digiroad2;

--
-- TOC entry 322 (class 1259 OID 54509)
-- Name: lane_work_list; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.lane_work_list (
    id bigint NOT NULL,
    link_id character varying(40),
    property character varying(128),
    old_value integer,
    new_value integer,
    created_date timestamp without time zone,
    created_by character varying(128),
    vvh_id numeric(38,0)
);


ALTER TABLE public.lane_work_list OWNER TO digiroad2;

--
-- TOC entry 323 (class 1259 OID 54512)
-- Name: link_type; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.link_type (
    mml_id bigint,
    link_type integer NOT NULL,
    modified_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_by character varying(128),
    link_id character varying(40),
    id bigint NOT NULL,
    vvh_id numeric(38,0)
);


ALTER TABLE public.link_type OWNER TO digiroad2;

--
-- TOC entry 324 (class 1259 OID 54516)
-- Name: localized_string; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.localized_string (
    id numeric(38,0) NOT NULL,
    value_fi character varying(256),
    value_sv character varying(256),
    created_date timestamp without time zone NOT NULL,
    created_by character varying(128),
    modified_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_by character varying(128)
);


ALTER TABLE public.localized_string OWNER TO digiroad2;

--
-- TOC entry 325 (class 1259 OID 54522)
-- Name: lrm_position; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.lrm_position (
    id numeric(38,0) NOT NULL,
    lane_code integer,
    side_code integer,
    start_measure numeric(1000,3),
    end_measure numeric(1000,3),
    mml_id bigint,
    link_id character varying(40),
    adjusted_timestamp numeric(38,0) DEFAULT 0 NOT NULL,
    modified_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    link_source numeric(38,0) DEFAULT 1,
    vvh_id numeric(38,0),
    CONSTRAINT start_measure_positive CHECK (((start_measure)::double precision >= (0)::double precision))
);


ALTER TABLE public.lrm_position OWNER TO digiroad2;

--
-- TOC entry 326 (class 1259 OID 54529)
-- Name: lrm_position_history; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.lrm_position_history (
    id numeric(38,0) NOT NULL,
    lane_code integer,
    side_code integer,
    start_measure numeric(1000,3),
    end_measure numeric(1000,3),
    mml_id bigint,
    link_id character varying(40),
    adjusted_timestamp numeric(38,0) DEFAULT 0 NOT NULL,
    modified_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    link_source numeric(38,0) DEFAULT 1,
    vvh_id numeric(38,0),
    CONSTRAINT hist_start_measure_positive CHECK (((start_measure)::double precision >= (0)::double precision))
);


ALTER TABLE public.lrm_position_history OWNER TO digiroad2;

--
-- TOC entry 327 (class 1259 OID 54536)
-- Name: lrm_position_primary_key_seq; Type: SEQUENCE; Schema: public; Owner: digiroad2
--

CREATE SEQUENCE public.lrm_position_primary_key_seq
    START WITH 70000023
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 100
    CYCLE;


ALTER SEQUENCE public.lrm_position_primary_key_seq OWNER TO digiroad2;

--
-- TOC entry 328 (class 1259 OID 54537)
-- Name: manoeuvre; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.manoeuvre (
    id bigint NOT NULL,
    additional_info character varying(4000),
    type smallint NOT NULL,
    modified_date timestamp without time zone,
    modified_by character varying(128),
    valid_to timestamp without time zone,
    created_by character varying(128),
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    traffic_sign_id bigint,
    suggested boolean DEFAULT false,
    CONSTRAINT sys_c003961065 CHECK ((suggested = ANY (ARRAY[false, true])))
);


ALTER TABLE public.manoeuvre OWNER TO digiroad2;

--
-- TOC entry 329 (class 1259 OID 54545)
-- Name: manoeuvre_element; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.manoeuvre_element (
    manoeuvre_id bigint NOT NULL,
    element_type integer NOT NULL,
    mml_id bigint,
    link_id character varying(40),
    dest_link_id character varying(40),
    vvh_id numeric(38,0),
    dest_vvh_id numeric(38,0),
    CONSTRAINT non_final_has_destination CHECK (((element_type = 3) OR (dest_link_id IS NOT NULL)))
);


ALTER TABLE public.manoeuvre_element OWNER TO digiroad2;

--
-- TOC entry 330 (class 1259 OID 54549)
-- Name: manoeuvre_element_history; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.manoeuvre_element_history (
    manoeuvre_id bigint NOT NULL,
    element_type integer NOT NULL,
    mml_id bigint,
    link_id character varying(40),
    dest_link_id character varying(40),
    vvh_id numeric(38,0),
    dest_vvh_id numeric(38,0),
    CONSTRAINT hist_non_final_has_destination CHECK (((element_type = 3) OR (dest_link_id IS NOT NULL)))
);


ALTER TABLE public.manoeuvre_element_history OWNER TO digiroad2;

--
-- TOC entry 331 (class 1259 OID 54553)
-- Name: manoeuvre_exceptions; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.manoeuvre_exceptions (
    manoeuvre_id bigint NOT NULL,
    exception_type smallint NOT NULL
);


ALTER TABLE public.manoeuvre_exceptions OWNER TO digiroad2;

--
-- TOC entry 332 (class 1259 OID 54556)
-- Name: manoeuvre_exceptions_history; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.manoeuvre_exceptions_history (
    manoeuvre_id bigint NOT NULL,
    exception_type smallint NOT NULL
);


ALTER TABLE public.manoeuvre_exceptions_history OWNER TO digiroad2;

--
-- TOC entry 333 (class 1259 OID 54559)
-- Name: manoeuvre_history; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.manoeuvre_history (
    id bigint NOT NULL,
    additional_info character varying(4000),
    type smallint NOT NULL,
    modified_date timestamp without time zone,
    modified_by character varying(128),
    valid_to timestamp without time zone,
    created_by character varying(128),
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    traffic_sign_id bigint,
    suggested boolean DEFAULT false,
    CONSTRAINT sys_c003961196 CHECK ((suggested = ANY (ARRAY[false, true])))
);


ALTER TABLE public.manoeuvre_history OWNER TO digiroad2;

--
-- TOC entry 334 (class 1259 OID 54567)
-- Name: manoeuvre_id_seq; Type: SEQUENCE; Schema: public; Owner: digiroad2
--

CREATE SEQUENCE public.manoeuvre_id_seq
    START WITH 200000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 100
    CYCLE;


ALTER SEQUENCE public.manoeuvre_id_seq OWNER TO digiroad2;

--
-- TOC entry 335 (class 1259 OID 54568)
-- Name: manoeuvre_val_period_history; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.manoeuvre_val_period_history (
    id bigint NOT NULL,
    manoeuvre_id bigint NOT NULL,
    type numeric(38,0) NOT NULL,
    start_hour numeric(38,0) NOT NULL,
    end_hour numeric(38,0) NOT NULL,
    start_minute numeric(38,0) DEFAULT 0 NOT NULL,
    end_minute numeric(38,0) DEFAULT 0 NOT NULL,
    CONSTRAINT hist_mvp_hour_constraint CHECK (((start_hour >= (0)::numeric) AND (start_hour <= (24)::numeric) AND ((end_hour >= (0)::numeric) AND (end_hour <= (24)::numeric)))),
    CONSTRAINT hist_mvp_type_constraint CHECK (((type >= (1)::numeric) AND (type <= (3)::numeric)))
);


ALTER TABLE public.manoeuvre_val_period_history OWNER TO digiroad2;

--
-- TOC entry 336 (class 1259 OID 54575)
-- Name: manoeuvre_validity_period; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.manoeuvre_validity_period (
    id bigint NOT NULL,
    manoeuvre_id bigint NOT NULL,
    type numeric(38,0) NOT NULL,
    start_hour numeric(38,0) NOT NULL,
    end_hour numeric(38,0) NOT NULL,
    start_minute numeric(38,0) DEFAULT 0 NOT NULL,
    end_minute numeric(38,0) DEFAULT 0 NOT NULL,
    CONSTRAINT mvp_hour_constraint CHECK (((start_hour >= (0)::numeric) AND (start_hour <= (24)::numeric) AND ((end_hour >= (0)::numeric) AND (end_hour <= (24)::numeric)))),
    CONSTRAINT mvp_type_constraint CHECK (((type >= (1)::numeric) AND (type <= (3)::numeric)))
);


ALTER TABLE public.manoeuvre_validity_period OWNER TO digiroad2;

--
-- TOC entry 337 (class 1259 OID 54582)
-- Name: manouvre_samuutus_work_list; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.manouvre_samuutus_work_list (
    assetid numeric(38,0),
    linkids character varying(400)
);


ALTER TABLE public.manouvre_samuutus_work_list OWNER TO digiroad2;

--
-- TOC entry 338 (class 1259 OID 54585)
-- Name: multiple_choice_value; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.multiple_choice_value (
    id bigint NOT NULL,
    property_id bigint NOT NULL,
    enumerated_value_id bigint NOT NULL,
    asset_id bigint NOT NULL,
    modified_date timestamp without time zone,
    modified_by character varying(128),
    grouped_id bigint DEFAULT 0
);


ALTER TABLE public.multiple_choice_value OWNER TO digiroad2;

--
-- TOC entry 339 (class 1259 OID 54589)
-- Name: multiple_choice_value_history; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.multiple_choice_value_history (
    id bigint NOT NULL,
    property_id bigint NOT NULL,
    enumerated_value_id bigint NOT NULL,
    asset_id bigint NOT NULL,
    modified_date timestamp without time zone,
    modified_by character varying(128),
    grouped_id bigint DEFAULT 0
);


ALTER TABLE public.multiple_choice_value_history OWNER TO digiroad2;

--
-- TOC entry 340 (class 1259 OID 54593)
-- Name: municipality; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.municipality (
    id numeric(22,0) NOT NULL,
    name_fi character varying(128),
    name_sv character varying(128),
    ely_nro bigint,
    road_maintainer_id bigint,
    geometry public.geometry,
    zoom smallint
);


ALTER TABLE public.municipality OWNER TO digiroad2;

--
-- TOC entry 341 (class 1259 OID 54598)
-- Name: municipality_asset_id_mapping; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.municipality_asset_id_mapping (
    asset_id bigint NOT NULL,
    municipality_asset_id character varying(128) NOT NULL,
    municipality_code bigint NOT NULL
);


ALTER TABLE public.municipality_asset_id_mapping OWNER TO digiroad2;

--
-- TOC entry 342 (class 1259 OID 54601)
-- Name: municipality_dataset; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.municipality_dataset (
    dataset_id character(36) NOT NULL,
    geojson text NOT NULL,
    roadlinks text NOT NULL,
    received_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    processed_date timestamp without time zone,
    status bigint
);


ALTER TABLE public.municipality_dataset OWNER TO digiroad2;

--
-- TOC entry 343 (class 1259 OID 54607)
-- Name: municipality_email; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.municipality_email (
    id bigint NOT NULL,
    email_address character varying(255) NOT NULL,
    municipality_code bigint NOT NULL,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.municipality_email OWNER TO digiroad2;

--
-- TOC entry 344 (class 1259 OID 54611)
-- Name: municipality_feature; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.municipality_feature (
    dataset_id character(36) NOT NULL,
    status character varying(4000),
    feature_id character varying(4000) NOT NULL
);


ALTER TABLE public.municipality_feature OWNER TO digiroad2;

--
-- TOC entry 345 (class 1259 OID 54616)
-- Name: municipality_verification; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.municipality_verification (
    id bigint NOT NULL,
    municipality_id bigint,
    asset_type_id bigint,
    verified_date timestamp without time zone,
    verified_by character varying(128),
    valid_to timestamp without time zone,
    modified_by character varying(128),
    last_user_modification character varying(128),
    last_date_modification timestamp without time zone,
    number_of_assets numeric(38,0) DEFAULT 0,
    refresh_date timestamp without time zone,
    suggested_assets character varying(4000)
);


ALTER TABLE public.municipality_verification OWNER TO digiroad2;

--
-- TOC entry 346 (class 1259 OID 54622)
-- Name: national_bus_stop_id_seq; Type: SEQUENCE; Schema: public; Owner: digiroad2
--

CREATE SEQUENCE public.national_bus_stop_id_seq
    START WITH 300000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 100;


ALTER SEQUENCE public.national_bus_stop_id_seq OWNER TO digiroad2;

--
-- TOC entry 347 (class 1259 OID 54623)
-- Name: nopeusrajoitukset_29_12_2022; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.nopeusrajoitukset_29_12_2022 (
    id integer,
    link_id character varying(40),
    start_measure numeric(1000,3),
    end_measure numeric(1000,3),
    side_code integer,
    value integer,
    modified_date timestamp without time zone,
    municipality integer
);


ALTER TABLE public.nopeusrajoitukset_29_12_2022 OWNER TO digiroad2;

--
-- TOC entry 348 (class 1259 OID 54626)
-- Name: number_property_value; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.number_property_value (
    id bigint NOT NULL,
    asset_id bigint NOT NULL,
    property_id bigint NOT NULL,
    value numeric,
    grouped_id bigint DEFAULT 0
);


ALTER TABLE public.number_property_value OWNER TO digiroad2;

--
-- TOC entry 349 (class 1259 OID 54632)
-- Name: number_property_value_history; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.number_property_value_history (
    id bigint NOT NULL,
    asset_id bigint NOT NULL,
    property_id bigint NOT NULL,
    value numeric,
    grouped_id bigint DEFAULT 0
);


ALTER TABLE public.number_property_value_history OWNER TO digiroad2;

--
-- TOC entry 350 (class 1259 OID 54638)
-- Name: primary_key_seq; Type: SEQUENCE; Schema: public; Owner: digiroad2
--

CREATE SEQUENCE public.primary_key_seq
    START WITH 104857070
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 100
    CYCLE;


ALTER SEQUENCE public.primary_key_seq OWNER TO digiroad2;

--
-- TOC entry 351 (class 1259 OID 54639)
-- Name: proh_val_period_history; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.proh_val_period_history (
    id bigint NOT NULL,
    prohibition_value_id bigint NOT NULL,
    type numeric(38,0) NOT NULL,
    start_hour numeric(38,0) NOT NULL,
    end_hour numeric(38,0) NOT NULL,
    start_minute numeric(38,0) DEFAULT 0 NOT NULL,
    end_minute numeric(38,0) DEFAULT 0 NOT NULL,
    CONSTRAINT hist_hour_constraint CHECK (((start_hour >= (0)::numeric) AND (start_hour <= (24)::numeric) AND ((end_hour >= (0)::numeric) AND (end_hour <= (24)::numeric)))),
    CONSTRAINT hist_type_constraint CHECK (((type >= (1)::numeric) AND (type <= (3)::numeric)))
);


ALTER TABLE public.proh_val_period_history OWNER TO digiroad2;

--
-- TOC entry 352 (class 1259 OID 54646)
-- Name: prohibition_exception; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.prohibition_exception (
    id bigint NOT NULL,
    prohibition_value_id bigint NOT NULL,
    type numeric(38,0) NOT NULL
);


ALTER TABLE public.prohibition_exception OWNER TO digiroad2;

--
-- TOC entry 353 (class 1259 OID 54649)
-- Name: prohibition_exception_history; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.prohibition_exception_history (
    id bigint NOT NULL,
    prohibition_value_id bigint NOT NULL,
    type numeric(38,0) NOT NULL
);


ALTER TABLE public.prohibition_exception_history OWNER TO digiroad2;

--
-- TOC entry 354 (class 1259 OID 54652)
-- Name: prohibition_validity_period; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.prohibition_validity_period (
    id bigint NOT NULL,
    prohibition_value_id bigint NOT NULL,
    type numeric(38,0) NOT NULL,
    start_hour numeric(38,0) NOT NULL,
    end_hour numeric(38,0) NOT NULL,
    start_minute numeric(38,0) DEFAULT 0 NOT NULL,
    end_minute numeric(38,0) DEFAULT 0 NOT NULL,
    CONSTRAINT hour_constraint CHECK (((start_hour >= (0)::numeric) AND (start_hour <= (24)::numeric) AND ((end_hour >= (0)::numeric) AND (end_hour <= (24)::numeric)))),
    CONSTRAINT type_constraint CHECK (((type >= (1)::numeric) AND (type <= (3)::numeric)))
);


ALTER TABLE public.prohibition_validity_period OWNER TO digiroad2;

--
-- TOC entry 355 (class 1259 OID 54659)
-- Name: prohibition_value; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.prohibition_value (
    id bigint NOT NULL,
    asset_id bigint NOT NULL,
    type numeric(38,0) NOT NULL,
    additional_info character varying(4000)
);


ALTER TABLE public.prohibition_value OWNER TO digiroad2;

--
-- TOC entry 356 (class 1259 OID 54664)
-- Name: prohibition_value_history; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.prohibition_value_history (
    id bigint NOT NULL,
    asset_id bigint NOT NULL,
    type numeric(38,0) NOT NULL,
    additional_info character varying(4000)
);


ALTER TABLE public.prohibition_value_history OWNER TO digiroad2;

--
-- TOC entry 357 (class 1259 OID 54669)
-- Name: property; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.property (
    id bigint NOT NULL,
    asset_type_id bigint NOT NULL,
    property_type character varying(128),
    required boolean DEFAULT false,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by character varying(128),
    modified_date timestamp without time zone,
    modified_by character varying(128),
    name_localized_string_id numeric(38,0),
    public_id character varying(256),
    default_value character varying(256),
    max_value_length bigint,
    CONSTRAINT sys_c003960723 CHECK ((required = ANY (ARRAY[true, false])))
);


ALTER TABLE public.property OWNER TO digiroad2;

--
-- TOC entry 358 (class 1259 OID 54677)
-- Name: qgis_roadlinkex; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.qgis_roadlinkex (
    vvh_id numeric(38,0),
    linkid character varying(40),
    datasource integer,
    adminclass integer,
    municipalitycode integer,
    roadclass numeric(38,0),
    roadnamefin character varying(80),
    roadnameswe character varying(80),
    roadnamesme character varying(80),
    roadnamesmn character varying(80),
    roadnamesms character varying(80),
    roadnumber numeric(38,0),
    roadpartnumber integer,
    surfacetype integer,
    lifecyclestatus integer,
    directiontype integer,
    surfacerelation integer,
    horizontallength numeric(1000,3),
    starttime timestamp without time zone,
    created_user character varying(64),
    versionstarttime timestamp without time zone,
    shape public.geometry,
    track_code integer,
    cust_owner integer
);


ALTER TABLE public.qgis_roadlinkex OWNER TO digiroad2;

--
-- TOC entry 359 (class 1259 OID 54682)
-- Name: road_link_attributes; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.road_link_attributes (
    id bigint NOT NULL,
    link_id character varying(40),
    name character varying(128),
    value character varying(128),
    created_date timestamp without time zone DEFAULT LOCALTIMESTAMP NOT NULL,
    created_by character varying(128),
    modified_date timestamp without time zone,
    modified_by character varying(128),
    valid_to timestamp without time zone,
    mml_id bigint,
    adjusted_timestamp numeric(38,0) DEFAULT 0 NOT NULL,
    vvh_id numeric(38,0)
);


ALTER TABLE public.road_link_attributes OWNER TO digiroad2;

--
-- TOC entry 360 (class 1259 OID 54689)
-- Name: roadlink; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.roadlink (
    vvh_id numeric(38,0),
    objectid numeric(38,0),
    mtkid numeric(38,0),
    drid numeric(38,0),
    linkid character varying(40),
    sourceinfo integer,
    adminclass integer,
    municipalitycode integer,
    mtkgroup integer,
    mtkclass numeric(38,0),
    roadname_fi character varying(80),
    roadname_se character varying(80),
    roadname_sm character varying(80),
    roadnumber numeric(38,0),
    roadpartnumber integer,
    surfacetype integer,
    constructiontype integer,
    directiontype integer,
    verticallevel integer,
    horizontalaccuracy numeric(38,0),
    verticalaccuracy numeric(38,0),
    vectortype numeric(5,0),
    geometrylength numeric(11,3),
    minanleft numeric(38,0),
    maxanleft numeric(38,0),
    minanright numeric(38,0),
    maxanright numeric(38,0),
    validfrom timestamp without time zone,
    created_date timestamp without time zone,
    created_user character varying(64),
    last_edited_date timestamp without time zone,
    geometry_edited_date timestamp without time zone,
    validationstatus integer,
    updatenumber integer,
    objectstatus integer,
    subtype integer,
    shape public.geometry(LineStringZM,3067),
    se_anno_cad_data bytea,
    mtkhereflip integer,
    from_left numeric(38,0),
    to_left numeric(38,0),
    from_right numeric(38,0),
    to_right numeric(38,0),
    startnode numeric(38,0),
    endnode numeric(38,0)
);


ALTER TABLE public.roadlink OWNER TO digiroad2;

--
-- TOC entry 361 (class 1259 OID 54694)
-- Name: roadlinkex; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.roadlinkex (
    objectid numeric(38,0),
    drid numeric(38,0),
    linkid character varying(40) NOT NULL,
    sourceinfo integer,
    adminclass integer,
    municipalitycode integer,
    mtkgroup integer,
    mtkclass numeric(38,0),
    roadname_fi character varying(80),
    roadname_se character varying(80),
    roadname_sm character varying(80),
    roadnumber numeric(38,0),
    roadpartnumber integer,
    surfacetype integer,
    constructiontype integer,
    directiontype integer,
    verticallevel integer,
    horizontalaccuracy numeric(38,0),
    verticalaccuracy numeric(38,0),
    vectortype integer,
    geometrylength double precision,
    minanleft numeric(38,0),
    maxanleft numeric(38,0),
    minanright numeric(38,0),
    maxanright numeric(38,0),
    validfrom timestamp without time zone,
    created_date timestamp without time zone,
    created_user character varying(64),
    last_edited_date timestamp without time zone,
    geometry_edited_date timestamp without time zone,
    validationstatus integer,
    feedbackstatus integer,
    feedbackinfo character varying(255),
    objectstatus integer,
    subtype integer,
    jobid numeric(38,0),
    shape public.geometry,
    se_anno_cad_data bytea,
    from_left numeric(38,0),
    to_left numeric(38,0),
    from_right numeric(38,0),
    to_right numeric(38,0),
    estimated_completion timestamp without time zone,
    track_code integer,
    cust_class character varying(50),
    cust_id_str character varying(50),
    cust_id_num numeric(38,0),
    cust_owner numeric(38,0)
);


ALTER TABLE public.roadlinkex OWNER TO digiroad2;

--
-- TOC entry 362 (class 1259 OID 54699)
-- Name: samuutus_success; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.samuutus_success (
    asset_type_id integer,
    last_succesfull_samuutus timestamp without time zone
);


ALTER TABLE public.samuutus_success OWNER TO digiroad2;

--
-- TOC entry 363 (class 1259 OID 54702)
-- Name: schema_version; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.schema_version (
    version_rank integer NOT NULL,
    installed_rank integer NOT NULL,
    version character varying(50) NOT NULL,
    description character varying(200) NOT NULL,
    type character varying(20) NOT NULL,
    script character varying(1000) NOT NULL,
    checksum integer,
    installed_by character varying(100) NOT NULL,
    installed_on timestamp without time zone DEFAULT now() NOT NULL,
    execution_time integer NOT NULL,
    success boolean NOT NULL
);


ALTER TABLE public.schema_version OWNER TO digiroad2;

--
-- TOC entry 364 (class 1259 OID 54708)
-- Name: service_area; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.service_area (
    id smallint NOT NULL,
    geometry public.geometry,
    zoom smallint
);


ALTER TABLE public.service_area OWNER TO digiroad2;

--
-- TOC entry 365 (class 1259 OID 54713)
-- Name: service_point_value; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.service_point_value (
    id bigint NOT NULL,
    asset_id bigint NOT NULL,
    type numeric(38,0) NOT NULL,
    additional_info character varying(4000),
    parking_place_count bigint,
    name character varying(128),
    type_extension bigint,
    is_authority_data boolean,
    weight_limit bigint,
    CONSTRAINT is_authority_data_boolean CHECK ((is_authority_data = ANY (ARRAY[true, false])))
);


ALTER TABLE public.service_point_value OWNER TO digiroad2;

--
-- TOC entry 366 (class 1259 OID 54719)
-- Name: service_point_value_history; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.service_point_value_history (
    id bigint NOT NULL,
    asset_id bigint NOT NULL,
    type numeric(38,0) NOT NULL,
    additional_info character varying(4000),
    parking_place_count bigint,
    name character varying(128),
    type_extension bigint,
    is_authority_data boolean,
    weight_limit bigint,
    CONSTRAINT hist_is_authority_data_boolean CHECK ((is_authority_data = ANY (ARRAY[true, false])))
);


ALTER TABLE public.service_point_value_history OWNER TO digiroad2;

--
-- TOC entry 367 (class 1259 OID 54725)
-- Name: service_user; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.service_user (
    id bigint NOT NULL,
    username character varying(256) NOT NULL,
    configuration character varying(4000),
    name character varying(256),
    created_at timestamp without time zone,
    modified_at timestamp without time zone
);


ALTER TABLE public.service_user OWNER TO digiroad2;

--
-- TOC entry 368 (class 1259 OID 54730)
-- Name: single_choice_value; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.single_choice_value (
    asset_id bigint NOT NULL,
    enumerated_value_id bigint NOT NULL,
    property_id bigint NOT NULL,
    modified_date timestamp without time zone,
    modified_by character varying(128),
    grouped_id bigint DEFAULT 0 NOT NULL
);


ALTER TABLE public.single_choice_value OWNER TO digiroad2;

--
-- TOC entry 369 (class 1259 OID 54734)
-- Name: single_choice_value_history; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.single_choice_value_history (
    asset_id bigint NOT NULL,
    enumerated_value_id bigint NOT NULL,
    property_id bigint NOT NULL,
    modified_date timestamp without time zone,
    modified_by character varying(128),
    grouped_id bigint DEFAULT 0 NOT NULL
);


ALTER TABLE public.single_choice_value_history OWNER TO digiroad2;

--
-- TOC entry 370 (class 1259 OID 54738)
-- Name: temp_road_address_info; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.temp_road_address_info (
    id bigint NOT NULL,
    link_id character varying(40) NOT NULL,
    municipality_code bigint NOT NULL,
    road_number bigint NOT NULL,
    road_part bigint NOT NULL,
    track_code bigint NOT NULL,
    start_address_m bigint NOT NULL,
    end_address_m bigint NOT NULL,
    start_m_value numeric(1000,3) NOT NULL,
    end_m_value numeric(1000,3) NOT NULL,
    side_code numeric(38,0),
    created_date timestamp without time zone DEFAULT LOCALTIMESTAMP NOT NULL,
    created_by character varying(128)
);


ALTER TABLE public.temp_road_address_info OWNER TO digiroad2;

--
-- TOC entry 371 (class 1259 OID 54742)
-- Name: temporary_id; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.temporary_id (
    id bigint NOT NULL
);


ALTER TABLE public.temporary_id OWNER TO digiroad2;

--
-- TOC entry 372 (class 1259 OID 54745)
-- Name: terminal_bus_stop_link; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.terminal_bus_stop_link (
    terminal_asset_id bigint,
    bus_stop_asset_id bigint
);


ALTER TABLE public.terminal_bus_stop_link OWNER TO digiroad2;

--
-- TOC entry 373 (class 1259 OID 54748)
-- Name: text_property_value; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.text_property_value (
    id bigint NOT NULL,
    asset_id bigint NOT NULL,
    property_id bigint NOT NULL,
    value_fi character varying(4000),
    value_sv character varying(4000),
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by character varying(128),
    modified_date timestamp without time zone,
    modified_by character varying(128),
    grouped_id bigint DEFAULT 0
);


ALTER TABLE public.text_property_value OWNER TO digiroad2;

--
-- TOC entry 374 (class 1259 OID 54755)
-- Name: text_property_value_history; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.text_property_value_history (
    id bigint NOT NULL,
    asset_id bigint NOT NULL,
    property_id bigint NOT NULL,
    value_fi character varying(4000),
    value_sv character varying(4000),
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by character varying(128),
    modified_date timestamp without time zone,
    modified_by character varying(128),
    grouped_id bigint DEFAULT 0
);


ALTER TABLE public.text_property_value_history OWNER TO digiroad2;

--
-- TOC entry 375 (class 1259 OID 54762)
-- Name: traffic_direction; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.traffic_direction (
    mml_id bigint,
    traffic_direction integer NOT NULL,
    modified_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_by character varying(128),
    link_id character varying(40),
    id bigint NOT NULL,
    link_type integer,
    vvh_id numeric(38,0)
);


ALTER TABLE public.traffic_direction OWNER TO digiroad2;

--
-- TOC entry 376 (class 1259 OID 54766)
-- Name: traffic_sign_manager; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.traffic_sign_manager (
    traffic_sign_id bigint NOT NULL,
    linear_asset_type_id bigint NOT NULL,
    sign text
);


ALTER TABLE public.traffic_sign_manager OWNER TO digiroad2;

--
-- TOC entry 377 (class 1259 OID 54771)
-- Name: unknown_speed_limit; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.unknown_speed_limit (
    municipality_code integer,
    administrative_class smallint,
    link_id character varying(40),
    mml_id numeric(38,0),
    unnecessary numeric(38,0) DEFAULT 0 NOT NULL,
    vvh_id numeric(38,0)
);


ALTER TABLE public.unknown_speed_limit OWNER TO digiroad2;

--
-- TOC entry 378 (class 1259 OID 54775)
-- Name: user_notification; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.user_notification (
    id bigint NOT NULL,
    created_date timestamp without time zone DEFAULT LOCALTIMESTAMP,
    heading character varying(256),
    content character varying(4000)
);


ALTER TABLE public.user_notification OWNER TO digiroad2;

--
-- TOC entry 379 (class 1259 OID 54781)
-- Name: user_notification_seq; Type: SEQUENCE; Schema: public; Owner: digiroad2
--

CREATE SEQUENCE public.user_notification_seq
    START WITH 4
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_notification_seq OWNER TO digiroad2;

--
-- TOC entry 380 (class 1259 OID 54782)
-- Name: val_period_property_value_hist; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.val_period_property_value_hist (
    id bigint NOT NULL,
    asset_id bigint NOT NULL,
    property_id bigint NOT NULL,
    type numeric(38,0),
    period_week_day numeric(38,0) NOT NULL,
    start_hour numeric(38,0) NOT NULL,
    end_hour numeric(38,0) NOT NULL,
    start_minute numeric(38,0) DEFAULT 0 NOT NULL,
    end_minute numeric(38,0) DEFAULT 0 NOT NULL,
    CONSTRAINT hist_minute_constraint CHECK (((start_minute >= (0)::numeric) AND (start_minute <= (59)::numeric) AND ((end_minute >= (0)::numeric) AND (end_minute <= (59)::numeric))))
);


ALTER TABLE public.val_period_property_value_hist OWNER TO digiroad2;

--
-- TOC entry 381 (class 1259 OID 54788)
-- Name: validity_period_property_value; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.validity_period_property_value (
    id bigint NOT NULL,
    asset_id bigint NOT NULL,
    property_id bigint NOT NULL,
    type numeric(38,0),
    period_week_day numeric(38,0) NOT NULL,
    start_hour numeric(38,0) NOT NULL,
    end_hour numeric(38,0) NOT NULL,
    start_minute numeric(38,0) DEFAULT 0 NOT NULL,
    end_minute numeric(38,0) DEFAULT 0 NOT NULL,
    CONSTRAINT minute_constraint CHECK (((start_minute >= (0)::numeric) AND (start_minute <= (59)::numeric) AND ((end_minute >= (0)::numeric) AND (end_minute <= (59)::numeric))))
);


ALTER TABLE public.validity_period_property_value OWNER TO digiroad2;

--
-- TOC entry 382 (class 1259 OID 54794)
-- Name: vallu_xml_ids; Type: TABLE; Schema: public; Owner: digiroad2
--

CREATE TABLE public.vallu_xml_ids (
    id bigint NOT NULL,
    asset_id bigint NOT NULL,
    created_date timestamp without time zone DEFAULT LOCALTIMESTAMP
);


ALTER TABLE public.vallu_xml_ids OWNER TO digiroad2;

--
-- TOC entry 4974 (class 2606 OID 54802)
-- Name: additional_panel_history additional_panel_history_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.additional_panel_history
    ADD CONSTRAINT additional_panel_history_pkey PRIMARY KEY (id);


--
-- TOC entry 4976 (class 2606 OID 54804)
-- Name: administrative_class administrative_class_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.administrative_class
    ADD CONSTRAINT administrative_class_pkey PRIMARY KEY (id);


--
-- TOC entry 4989 (class 2606 OID 54806)
-- Name: asset_history asset_history_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.asset_history
    ADD CONSTRAINT asset_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5149 (class 2606 OID 54808)
-- Name: municipality_asset_id_mapping asset_id_unique; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.municipality_asset_id_mapping
    ADD CONSTRAINT asset_id_unique UNIQUE (asset_id);


--
-- TOC entry 4981 (class 2606 OID 54810)
-- Name: asset asset_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.asset
    ADD CONSTRAINT asset_pkey PRIMARY KEY (id);


--
-- TOC entry 5002 (class 2606 OID 54812)
-- Name: asset_type asset_type_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.asset_type
    ADD CONSTRAINT asset_type_pkey PRIMARY KEY (id);


--
-- TOC entry 5004 (class 2606 OID 54814)
-- Name: automatically_processed_lanes_work_list automatically_processed_lanes_work_list_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.automatically_processed_lanes_work_list
    ADD CONSTRAINT automatically_processed_lanes_work_list_pkey PRIMARY KEY (id);


--
-- TOC entry 5006 (class 2606 OID 54816)
-- Name: change_table change_table_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.change_table
    ADD CONSTRAINT change_table_pkey PRIMARY KEY (id);


--
-- TOC entry 4923 (class 2606 OID 54817)
-- Name: asset chk_mass_transits_municipality; Type: CHECK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE public.asset
    ADD CONSTRAINT chk_mass_transits_municipality CHECK ((((asset_type_id = 10) AND (municipality_code IS NOT NULL)) OR (asset_type_id <> 10))) NOT VALID;


--
-- TOC entry 5012 (class 2606 OID 54819)
-- Name: connected_asset_history connected_asset_history_linear_asset_id_point_asset_id_vali_key; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.connected_asset_history
    ADD CONSTRAINT connected_asset_history_linear_asset_id_point_asset_id_vali_key UNIQUE (linear_asset_id, point_asset_id, valid_to);


--
-- TOC entry 5010 (class 2606 OID 54821)
-- Name: connected_asset connected_asset_linear_asset_id_point_asset_id_valid_to_key; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.connected_asset
    ADD CONSTRAINT connected_asset_linear_asset_id_point_asset_id_valid_to_key UNIQUE (linear_asset_id, point_asset_id, valid_to);


--
-- TOC entry 5016 (class 2606 OID 54823)
-- Name: date_period_value_history date_period_value_history_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.date_period_value_history
    ADD CONSTRAINT date_period_value_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5014 (class 2606 OID 54825)
-- Name: date_period_value date_period_value_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.date_period_value
    ADD CONSTRAINT date_period_value_pkey PRIMARY KEY (id);


--
-- TOC entry 5020 (class 2606 OID 54827)
-- Name: date_property_value_history date_property_value_history_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.date_property_value_history
    ADD CONSTRAINT date_property_value_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5018 (class 2606 OID 54829)
-- Name: date_property_value date_property_value_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.date_property_value
    ADD CONSTRAINT date_property_value_pkey PRIMARY KEY (id);


--
-- TOC entry 5022 (class 2606 OID 54831)
-- Name: ely ely_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.ely
    ADD CONSTRAINT ely_pkey PRIMARY KEY (id);


--
-- TOC entry 5024 (class 2606 OID 54833)
-- Name: enumerated_value enumerated_value_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.enumerated_value
    ADD CONSTRAINT enumerated_value_pkey PRIMARY KEY (id);


--
-- TOC entry 5027 (class 2606 OID 54835)
-- Name: export_lock export_lock_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.export_lock
    ADD CONSTRAINT export_lock_pkey PRIMARY KEY (id);


--
-- TOC entry 5030 (class 2606 OID 54837)
-- Name: export_report export_report_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.export_report
    ADD CONSTRAINT export_report_pkey PRIMARY KEY (id);


--
-- TOC entry 5032 (class 2606 OID 54839)
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);


--
-- TOC entry 5035 (class 2606 OID 54841)
-- Name: functional_class functional_class_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.functional_class
    ADD CONSTRAINT functional_class_pkey PRIMARY KEY (id);


--
-- TOC entry 4927 (class 2606 OID 54842)
-- Name: asset_history hist_chk_mass_transits_mun; Type: CHECK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE public.asset_history
    ADD CONSTRAINT hist_chk_mass_transits_mun CHECK ((((asset_type_id = 10) AND (municipality_code IS NOT NULL)) OR (asset_type_id <> 10))) NOT VALID;


--
-- TOC entry 5039 (class 2606 OID 54844)
-- Name: import_log import_log_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.import_log
    ADD CONSTRAINT import_log_pkey PRIMARY KEY (id);


--
-- TOC entry 5042 (class 2606 OID 54846)
-- Name: inaccurate_asset inaccurate_asset_asset_id_link_id_asset_type_id_key; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.inaccurate_asset
    ADD CONSTRAINT inaccurate_asset_asset_id_link_id_asset_type_id_key UNIQUE (asset_id, link_id, asset_type_id);


--
-- TOC entry 5047 (class 2606 OID 54848)
-- Name: incomplete_link incomplete_link_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.incomplete_link
    ADD CONSTRAINT incomplete_link_pkey PRIMARY KEY (id);


--
-- TOC entry 5052 (class 2606 OID 54850)
-- Name: kgv_roadlink kgv_roadlink_linkid; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.kgv_roadlink
    ADD CONSTRAINT kgv_roadlink_linkid UNIQUE (linkid);


--
-- TOC entry 5070 (class 2606 OID 54852)
-- Name: lane_attribute lane_attribute_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.lane_attribute
    ADD CONSTRAINT lane_attribute_pkey PRIMARY KEY (id);


--
-- TOC entry 5079 (class 2606 OID 54854)
-- Name: lane_history_attribute lane_history_attribute_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.lane_history_attribute
    ADD CONSTRAINT lane_history_attribute_pkey PRIMARY KEY (id);


--
-- TOC entry 5081 (class 2606 OID 54856)
-- Name: lane_history_link lane_history_link_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.lane_history_link
    ADD CONSTRAINT lane_history_link_pkey PRIMARY KEY (lane_id, lane_position_id);


--
-- TOC entry 5076 (class 2606 OID 54858)
-- Name: lane_history lane_history_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.lane_history
    ADD CONSTRAINT lane_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5085 (class 2606 OID 54860)
-- Name: lane_history_position lane_history_position_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.lane_history_position
    ADD CONSTRAINT lane_history_position_pkey PRIMARY KEY (id);


--
-- TOC entry 5088 (class 2606 OID 54862)
-- Name: lane_link lane_link_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.lane_link
    ADD CONSTRAINT lane_link_pkey PRIMARY KEY (lane_id, lane_position_id);


--
-- TOC entry 5067 (class 2606 OID 54864)
-- Name: lane lane_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.lane
    ADD CONSTRAINT lane_pkey PRIMARY KEY (id);


--
-- TOC entry 5092 (class 2606 OID 54866)
-- Name: lane_position lane_position_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.lane_position
    ADD CONSTRAINT lane_position_pkey PRIMARY KEY (id);


--
-- TOC entry 5095 (class 2606 OID 54868)
-- Name: lane_work_list lane_work_list_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.lane_work_list
    ADD CONSTRAINT lane_work_list_pkey PRIMARY KEY (id);


--
-- TOC entry 5098 (class 2606 OID 54870)
-- Name: link_type link_type_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.link_type
    ADD CONSTRAINT link_type_pkey PRIMARY KEY (id);


--
-- TOC entry 5101 (class 2606 OID 54872)
-- Name: localized_string localized_string_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.localized_string
    ADD CONSTRAINT localized_string_pkey PRIMARY KEY (id);


--
-- TOC entry 5110 (class 2606 OID 54874)
-- Name: lrm_position_history lrm_position_history_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.lrm_position_history
    ADD CONSTRAINT lrm_position_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5105 (class 2606 OID 54876)
-- Name: lrm_position lrm_position_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.lrm_position
    ADD CONSTRAINT lrm_position_pkey PRIMARY KEY (id);


--
-- TOC entry 5129 (class 2606 OID 54878)
-- Name: manoeuvre_history manoeuvre_history_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.manoeuvre_history
    ADD CONSTRAINT manoeuvre_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5113 (class 2606 OID 54880)
-- Name: manoeuvre manoeuvre_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.manoeuvre
    ADD CONSTRAINT manoeuvre_pkey PRIMARY KEY (id);


--
-- TOC entry 5132 (class 2606 OID 54882)
-- Name: manoeuvre_val_period_history manoeuvre_val_period_history_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.manoeuvre_val_period_history
    ADD CONSTRAINT manoeuvre_val_period_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5135 (class 2606 OID 54884)
-- Name: manoeuvre_validity_period manoeuvre_validity_period_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.manoeuvre_validity_period
    ADD CONSTRAINT manoeuvre_validity_period_pkey PRIMARY KEY (id);


--
-- TOC entry 5137 (class 2606 OID 54886)
-- Name: manouvre_samuutus_work_list manouvre_samuutus_work_list_asset_unique; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.manouvre_samuutus_work_list
    ADD CONSTRAINT manouvre_samuutus_work_list_asset_unique UNIQUE (assetid);


--
-- TOC entry 5143 (class 2606 OID 54888)
-- Name: multiple_choice_value_history multiple_choice_value_history_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.multiple_choice_value_history
    ADD CONSTRAINT multiple_choice_value_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5139 (class 2606 OID 54890)
-- Name: multiple_choice_value multiple_choice_value_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.multiple_choice_value
    ADD CONSTRAINT multiple_choice_value_pkey PRIMARY KEY (id);


--
-- TOC entry 5153 (class 2606 OID 54892)
-- Name: municipality_dataset municipality_dataset_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.municipality_dataset
    ADD CONSTRAINT municipality_dataset_pkey PRIMARY KEY (dataset_id);


--
-- TOC entry 5155 (class 2606 OID 54894)
-- Name: municipality_email municipality_email_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.municipality_email
    ADD CONSTRAINT municipality_email_pkey PRIMARY KEY (id);


--
-- TOC entry 5157 (class 2606 OID 54896)
-- Name: municipality_feature municipality_feature_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.municipality_feature
    ADD CONSTRAINT municipality_feature_pkey PRIMARY KEY (feature_id, dataset_id);


--
-- TOC entry 5145 (class 2606 OID 54898)
-- Name: municipality municipality_id_ely_nro_road_maintainer_id_key; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.municipality
    ADD CONSTRAINT municipality_id_ely_nro_road_maintainer_id_key UNIQUE (id, ely_nro, road_maintainer_id);


--
-- TOC entry 5147 (class 2606 OID 54900)
-- Name: municipality municipality_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.municipality
    ADD CONSTRAINT municipality_pkey PRIMARY KEY (id);


--
-- TOC entry 5161 (class 2606 OID 54902)
-- Name: municipality_verification municipality_verification_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.municipality_verification
    ADD CONSTRAINT municipality_verification_pkey PRIMARY KEY (id);


--
-- TOC entry 5169 (class 2606 OID 54904)
-- Name: number_property_value_history number_property_value_history_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.number_property_value_history
    ADD CONSTRAINT number_property_value_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5163 (class 2606 OID 54906)
-- Name: number_property_value number_property_value_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.number_property_value
    ADD CONSTRAINT number_property_value_pkey PRIMARY KEY (id);


--
-- TOC entry 5151 (class 2606 OID 54908)
-- Name: municipality_asset_id_mapping pk_municipality_asset_id_code_pair; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.municipality_asset_id_mapping
    ADD CONSTRAINT pk_municipality_asset_id_code_pair PRIMARY KEY (municipality_asset_id, municipality_code);


--
-- TOC entry 5172 (class 2606 OID 54910)
-- Name: proh_val_period_history proh_val_period_history_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.proh_val_period_history
    ADD CONSTRAINT proh_val_period_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5178 (class 2606 OID 54912)
-- Name: prohibition_exception_history prohibition_exception_history_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.prohibition_exception_history
    ADD CONSTRAINT prohibition_exception_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5175 (class 2606 OID 54914)
-- Name: prohibition_exception prohibition_exception_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.prohibition_exception
    ADD CONSTRAINT prohibition_exception_pkey PRIMARY KEY (id);


--
-- TOC entry 5181 (class 2606 OID 54916)
-- Name: prohibition_validity_period prohibition_validity_period_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.prohibition_validity_period
    ADD CONSTRAINT prohibition_validity_period_pkey PRIMARY KEY (id);


--
-- TOC entry 5187 (class 2606 OID 54918)
-- Name: prohibition_value_history prohibition_value_history_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.prohibition_value_history
    ADD CONSTRAINT prohibition_value_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5184 (class 2606 OID 54920)
-- Name: prohibition_value prohibition_value_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.prohibition_value
    ADD CONSTRAINT prohibition_value_pkey PRIMARY KEY (id);


--
-- TOC entry 5189 (class 2606 OID 54922)
-- Name: property property_asset_type_id_public_id_key; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT property_asset_type_id_public_id_key UNIQUE (asset_type_id, public_id);


--
-- TOC entry 5192 (class 2606 OID 54924)
-- Name: property property_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT property_pkey PRIMARY KEY (id);


--
-- TOC entry 5195 (class 2606 OID 54926)
-- Name: qgis_roadlinkex qgis_roadlinkex_linkid; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.qgis_roadlinkex
    ADD CONSTRAINT qgis_roadlinkex_linkid UNIQUE (linkid) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5200 (class 2606 OID 54929)
-- Name: road_link_attributes road_link_attributes_link_id_name_valid_to_key; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.road_link_attributes
    ADD CONSTRAINT road_link_attributes_link_id_name_valid_to_key UNIQUE (link_id, name, valid_to);


--
-- TOC entry 5202 (class 2606 OID 54931)
-- Name: road_link_attributes road_link_attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.road_link_attributes
    ADD CONSTRAINT road_link_attributes_pkey PRIMARY KEY (id);


--
-- TOC entry 5215 (class 2606 OID 54933)
-- Name: roadlink roadlink_linkid; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.roadlink
    ADD CONSTRAINT roadlink_linkid UNIQUE (linkid) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5217 (class 2606 OID 54936)
-- Name: roadlink roadlink_mtkid; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.roadlink
    ADD CONSTRAINT roadlink_mtkid UNIQUE (mtkid) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5229 (class 2606 OID 54939)
-- Name: roadlinkex roadlinkex_linkid; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.roadlinkex
    ADD CONSTRAINT roadlinkex_linkid UNIQUE (linkid) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 5232 (class 2606 OID 54942)
-- Name: roadlinkex roadlinkex_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.roadlinkex
    ADD CONSTRAINT roadlinkex_pkey PRIMARY KEY (linkid);


--
-- TOC entry 5236 (class 2606 OID 54944)
-- Name: schema_version schema_version_pk; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.schema_version
    ADD CONSTRAINT schema_version_pk PRIMARY KEY (version);


--
-- TOC entry 5240 (class 2606 OID 54946)
-- Name: service_area service_area_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.service_area
    ADD CONSTRAINT service_area_pkey PRIMARY KEY (id);


--
-- TOC entry 5244 (class 2606 OID 54948)
-- Name: service_point_value_history service_point_value_history_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.service_point_value_history
    ADD CONSTRAINT service_point_value_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5242 (class 2606 OID 54950)
-- Name: service_point_value service_point_value_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.service_point_value
    ADD CONSTRAINT service_point_value_pkey PRIMARY KEY (id);


--
-- TOC entry 5246 (class 2606 OID 54952)
-- Name: service_user service_user_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.service_user
    ADD CONSTRAINT service_user_pkey PRIMARY KEY (id);


--
-- TOC entry 5248 (class 2606 OID 54954)
-- Name: service_user service_user_username_key; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.service_user
    ADD CONSTRAINT service_user_username_key UNIQUE (username);


--
-- TOC entry 5252 (class 2606 OID 54956)
-- Name: single_choice_value_history single_choice_value_history_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.single_choice_value_history
    ADD CONSTRAINT single_choice_value_history_pkey PRIMARY KEY (asset_id, enumerated_value_id, grouped_id);


--
-- TOC entry 5250 (class 2606 OID 54958)
-- Name: single_choice_value single_choice_value_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.single_choice_value
    ADD CONSTRAINT single_choice_value_pkey PRIMARY KEY (asset_id, enumerated_value_id, grouped_id);


--
-- TOC entry 5254 (class 2606 OID 54960)
-- Name: temporary_id temporary_id_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.temporary_id
    ADD CONSTRAINT temporary_id_pkey PRIMARY KEY (id);


--
-- TOC entry 5258 (class 2606 OID 54962)
-- Name: terminal_bus_stop_link terminal_bus_stop_link_terminal_asset_id_bus_stop_asset_id_key; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.terminal_bus_stop_link
    ADD CONSTRAINT terminal_bus_stop_link_terminal_asset_id_bus_stop_asset_id_key UNIQUE (terminal_asset_id, bus_stop_asset_id);


--
-- TOC entry 5264 (class 2606 OID 54964)
-- Name: text_property_value_history text_property_value_history_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.text_property_value_history
    ADD CONSTRAINT text_property_value_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5261 (class 2606 OID 54966)
-- Name: text_property_value text_property_value_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.text_property_value
    ADD CONSTRAINT text_property_value_pkey PRIMARY KEY (id);


--
-- TOC entry 5267 (class 2606 OID 54968)
-- Name: traffic_direction traffic_direction_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.traffic_direction
    ADD CONSTRAINT traffic_direction_pkey PRIMARY KEY (id);


--
-- TOC entry 5270 (class 2606 OID 54970)
-- Name: traffic_sign_manager traffic_sign_manager_traffic_sign_id_linear_asset_type_id_key; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.traffic_sign_manager
    ADD CONSTRAINT traffic_sign_manager_traffic_sign_id_linear_asset_type_id_key UNIQUE (traffic_sign_id, linear_asset_type_id);


--
-- TOC entry 5008 (class 2606 OID 54972)
-- Name: change_table unique_change_event; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.change_table
    ADD CONSTRAINT unique_change_event UNIQUE (edit_date, edit_by, change_type, asset_type_id, asset_id);


--
-- TOC entry 5275 (class 2606 OID 54974)
-- Name: user_notification user_notification_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.user_notification
    ADD CONSTRAINT user_notification_pkey PRIMARY KEY (id);


--
-- TOC entry 5277 (class 2606 OID 54976)
-- Name: val_period_property_value_hist val_period_property_value_hist_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.val_period_property_value_hist
    ADD CONSTRAINT val_period_property_value_hist_pkey PRIMARY KEY (id);


--
-- TOC entry 5279 (class 2606 OID 54978)
-- Name: validity_period_property_value validity_period_property_value_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.validity_period_property_value
    ADD CONSTRAINT validity_period_property_value_pkey PRIMARY KEY (id);


--
-- TOC entry 5281 (class 2606 OID 54980)
-- Name: vallu_xml_ids vallu_xml_ids_asset_id_created_date_key; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.vallu_xml_ids
    ADD CONSTRAINT vallu_xml_ids_asset_id_created_date_key UNIQUE (asset_id, created_date);


--
-- TOC entry 5283 (class 2606 OID 54982)
-- Name: vallu_xml_ids vallu_xml_ids_pkey; Type: CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.vallu_xml_ids
    ADD CONSTRAINT vallu_xml_ids_pkey PRIMARY KEY (id);


--
-- TOC entry 5204 (class 1259 OID 54983)
-- Name: adminclass_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX adminclass_index ON public.roadlink USING btree (adminclass);


--
-- TOC entry 4977 (class 1259 OID 54984)
-- Name: administrative_class_vvh_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX administrative_class_vvh_id_idx ON public.administrative_class USING btree (vvh_id);


--
-- TOC entry 5259 (class 1259 OID 54985)
-- Name: aid_pid_text_property_sx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE UNIQUE INDEX aid_pid_text_property_sx ON public.text_property_value USING btree (asset_id, property_id, grouped_id);


--
-- TOC entry 4978 (class 1259 OID 54986)
-- Name: asset_floating_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX asset_floating_idx ON public.asset USING btree (floating);


--
-- TOC entry 4979 (class 1259 OID 54987)
-- Name: asset_geometry_sx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX asset_geometry_sx ON public.asset USING gist (geometry);


--
-- TOC entry 4997 (class 1259 OID 54988)
-- Name: asset_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX asset_id_idx ON public.asset_link USING btree (asset_id);


--
-- TOC entry 4982 (class 1259 OID 54989)
-- Name: asset_type_and_modified_by_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX asset_type_and_modified_by_idx ON public.asset USING btree (asset_type_id, modified_by);


--
-- TOC entry 4983 (class 1259 OID 54990)
-- Name: asset_type_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX asset_type_idx ON public.asset USING btree (asset_type_id);


--
-- TOC entry 5255 (class 1259 OID 54991)
-- Name: bus_stop_asset_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX bus_stop_asset_id_idx ON public.terminal_bus_stop_link USING btree (bus_stop_asset_id);


--
-- TOC entry 5205 (class 1259 OID 54992)
-- Name: constructio_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX constructio_index ON public.roadlink USING btree (constructiontype);


--
-- TOC entry 5037 (class 1259 OID 54993)
-- Name: created_by_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX created_by_idx ON public.import_log USING btree (created_by);


--
-- TOC entry 5115 (class 1259 OID 54994)
-- Name: element_manoeuvre_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX element_manoeuvre_idx ON public.manoeuvre_element USING btree (manoeuvre_id);


--
-- TOC entry 5116 (class 1259 OID 54995)
-- Name: element_source_link_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX element_source_link_idx ON public.manoeuvre_element USING btree (link_id, element_type);


--
-- TOC entry 5206 (class 1259 OID 54996)
-- Name: endnode_municipalitycode_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX endnode_municipalitycode_index ON public.roadlink USING btree (endnode, municipalitycode);


--
-- TOC entry 5025 (class 1259 OID 54997)
-- Name: enumvalue_property_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX enumvalue_property_id_idx ON public.enumerated_value USING btree (property_id);


--
-- TOC entry 5028 (class 1259 OID 54998)
-- Name: export_report_created_by_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX export_report_created_by_idx ON public.export_report USING btree (created_by);


--
-- TOC entry 4984 (class 1259 OID 54999)
-- Name: external_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX external_id_idx ON public.asset USING btree (external_id);


--
-- TOC entry 5033 (class 1259 OID 55000)
-- Name: funct_class_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE UNIQUE INDEX funct_class_idx ON public.functional_class USING btree (link_id);


--
-- TOC entry 5036 (class 1259 OID 55001)
-- Name: functional_class_vvh_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX functional_class_vvh_id_idx ON public.functional_class USING btree (vvh_id);


--
-- TOC entry 4990 (class 1259 OID 55002)
-- Name: hist_a_type_and_modi_by_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX hist_a_type_and_modi_by_idx ON public.asset_history USING btree (asset_type_id, modified_by);


--
-- TOC entry 5262 (class 1259 OID 55003)
-- Name: hist_aid_pid_text_property_sx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE UNIQUE INDEX hist_aid_pid_text_property_sx ON public.text_property_value_history USING btree (asset_id, property_id, grouped_id);


--
-- TOC entry 4991 (class 1259 OID 55004)
-- Name: hist_asset_floating_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX hist_asset_floating_idx ON public.asset_history USING btree (floating);


--
-- TOC entry 4999 (class 1259 OID 55005)
-- Name: hist_asset_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX hist_asset_id_idx ON public.asset_link_history USING btree (asset_id);


--
-- TOC entry 4992 (class 1259 OID 55006)
-- Name: hist_asset_type_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX hist_asset_type_idx ON public.asset_history USING btree (asset_type_id);


--
-- TOC entry 5121 (class 1259 OID 55007)
-- Name: hist_element_manoeuvre_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX hist_element_manoeuvre_idx ON public.manoeuvre_element_history USING btree (manoeuvre_id);


--
-- TOC entry 5122 (class 1259 OID 55008)
-- Name: hist_element_source_link_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX hist_element_source_link_idx ON public.manoeuvre_element_history USING btree (link_id, element_type);


--
-- TOC entry 4993 (class 1259 OID 55009)
-- Name: hist_external_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX hist_external_id_idx ON public.asset_history USING btree (external_id);


--
-- TOC entry 5107 (class 1259 OID 55010)
-- Name: hist_lrm_position_link_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX hist_lrm_position_link_id_idx ON public.lrm_position_history USING btree (link_id);


--
-- TOC entry 5108 (class 1259 OID 55011)
-- Name: hist_lrm_position_mml_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX hist_lrm_position_mml_idx ON public.lrm_position_history USING btree (mml_id);


--
-- TOC entry 5130 (class 1259 OID 55012)
-- Name: hist_m_valid_period_mid; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX hist_m_valid_period_mid ON public.manoeuvre_val_period_history USING btree (manoeuvre_id);


--
-- TOC entry 5126 (class 1259 OID 55013)
-- Name: hist_manoeuvre_exceptions_mid; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX hist_manoeuvre_exceptions_mid ON public.manoeuvre_exceptions_history USING btree (manoeuvre_id);


--
-- TOC entry 5127 (class 1259 OID 55014)
-- Name: hist_manoeuvre_valid_to_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX hist_manoeuvre_valid_to_idx ON public.manoeuvre_history USING btree (valid_to);


--
-- TOC entry 5141 (class 1259 OID 55015)
-- Name: hist_multiple_choice_value_sx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX hist_multiple_choice_value_sx ON public.multiple_choice_value_history USING btree (asset_id, property_id);


--
-- TOC entry 4994 (class 1259 OID 55016)
-- Name: hist_municipality_code_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX hist_municipality_code_idx ON public.asset_history USING btree (municipality_code);


--
-- TOC entry 4995 (class 1259 OID 55017)
-- Name: hist_national_id_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE UNIQUE INDEX hist_national_id_index ON public.asset_history USING btree (national_id);


--
-- TOC entry 5166 (class 1259 OID 55018)
-- Name: hist_npv_asset_prop_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX hist_npv_asset_prop_id_idx ON public.number_property_value_history USING btree (asset_id, property_id);


--
-- TOC entry 5167 (class 1259 OID 55019)
-- Name: hist_numpropval_prop_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX hist_numpropval_prop_id_idx ON public.number_property_value_history USING btree (property_id);


--
-- TOC entry 5000 (class 1259 OID 55020)
-- Name: hist_position_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX hist_position_id_idx ON public.asset_link_history USING btree (position_id);


--
-- TOC entry 5176 (class 1259 OID 55021)
-- Name: hist_proh_except_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX hist_proh_except_idx ON public.prohibition_exception_history USING btree (prohibition_value_id);


--
-- TOC entry 5170 (class 1259 OID 55022)
-- Name: hist_proh_val_period_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX hist_proh_val_period_idx ON public.proh_val_period_history USING btree (prohibition_value_id);


--
-- TOC entry 5185 (class 1259 OID 55023)
-- Name: hist_proh_value_asset_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX hist_proh_value_asset_idx ON public.prohibition_value_history USING btree (asset_id);


--
-- TOC entry 4996 (class 1259 OID 55024)
-- Name: hist_type_modi_by_and_date_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX hist_type_modi_by_and_date_idx ON public.asset_history USING btree (modified_date, asset_type_id, modified_by);


--
-- TOC entry 5040 (class 1259 OID 55025)
-- Name: inaccurate_asset_all_info_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX inaccurate_asset_all_info_idx ON public.inaccurate_asset USING btree (asset_type_id, municipality_code, administrative_class);


--
-- TOC entry 5043 (class 1259 OID 55026)
-- Name: inaccurate_asset_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX inaccurate_asset_id_idx ON public.inaccurate_asset USING btree (asset_id);


--
-- TOC entry 5044 (class 1259 OID 55027)
-- Name: inaccurate_asset_type_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX inaccurate_asset_type_id_idx ON public.inaccurate_asset USING btree (asset_type_id);


--
-- TOC entry 5045 (class 1259 OID 55028)
-- Name: incomp_linkid_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE UNIQUE INDEX incomp_linkid_idx ON public.incomplete_link USING btree (link_id);


--
-- TOC entry 5048 (class 1259 OID 55029)
-- Name: incomplete_link_vvh_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX incomplete_link_vvh_id_idx ON public.incomplete_link USING btree (vvh_id);


--
-- TOC entry 5049 (class 1259 OID 55030)
-- Name: kgv_roadlink_adminclass_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX kgv_roadlink_adminclass_index ON public.kgv_roadlink USING btree (adminclass);


--
-- TOC entry 5050 (class 1259 OID 55031)
-- Name: kgv_roadlink_constructio_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX kgv_roadlink_constructio_index ON public.kgv_roadlink USING btree (constructiontype);


--
-- TOC entry 5053 (class 1259 OID 55032)
-- Name: kgv_roadlink_linkid_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX kgv_roadlink_linkid_index ON public.kgv_roadlink USING btree (linkid);


--
-- TOC entry 5054 (class 1259 OID 55033)
-- Name: kgv_roadlink_linkid_mtkc_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX kgv_roadlink_linkid_mtkc_index ON public.kgv_roadlink USING btree (linkid, mtkclass);


--
-- TOC entry 5055 (class 1259 OID 55034)
-- Name: kgv_roadlink_mtkclass_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX kgv_roadlink_mtkclass_index ON public.kgv_roadlink USING btree (mtkclass);


--
-- TOC entry 5056 (class 1259 OID 55035)
-- Name: kgv_roadlink_mtkid_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX kgv_roadlink_mtkid_index ON public.kgv_roadlink USING btree (mtkid);


--
-- TOC entry 5057 (class 1259 OID 55036)
-- Name: kgv_roadlink_mtkid_mtkhereflip_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX kgv_roadlink_mtkid_mtkhereflip_index ON public.kgv_roadlink USING btree (mtkid, mtkhereflip);


--
-- TOC entry 5058 (class 1259 OID 55037)
-- Name: kgv_roadlink_muni_mtkc_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX kgv_roadlink_muni_mtkc_index ON public.kgv_roadlink USING btree (municipalitycode, mtkclass);


--
-- TOC entry 5059 (class 1259 OID 55038)
-- Name: kgv_roadlink_municipality_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX kgv_roadlink_municipality_index ON public.kgv_roadlink USING btree (municipalitycode);


--
-- TOC entry 5060 (class 1259 OID 55039)
-- Name: kgv_roadlink_roadlink_spatial_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX kgv_roadlink_roadlink_spatial_index ON public.kgv_roadlink USING gist (shape);


--
-- TOC entry 5061 (class 1259 OID 55040)
-- Name: kgv_roadlink_roadlink_vvh_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX kgv_roadlink_roadlink_vvh_id_idx ON public.kgv_roadlink USING btree (vvh_id);


--
-- TOC entry 5062 (class 1259 OID 55041)
-- Name: kgv_roadlink_roadnum_mtkc_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX kgv_roadlink_roadnum_mtkc_index ON public.kgv_roadlink USING btree (roadnumber, mtkclass);


--
-- TOC entry 5063 (class 1259 OID 55042)
-- Name: kgv_roadlink_vvh_id; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX kgv_roadlink_vvh_id ON public.kgv_roadlink USING btree (vvh_id);


--
-- TOC entry 5064 (class 1259 OID 55043)
-- Name: lane_code_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX lane_code_index ON public.lane USING btree (lane_code);


--
-- TOC entry 5082 (class 1259 OID 55044)
-- Name: lane_hist_pos_linkid_sidec_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX lane_hist_pos_linkid_sidec_idx ON public.lane_history_position USING btree (link_id, side_code);


--
-- TOC entry 5071 (class 1259 OID 55045)
-- Name: lane_history_code_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX lane_history_code_index ON public.lane_history USING btree (lane_code);


--
-- TOC entry 5072 (class 1259 OID 55046)
-- Name: lane_history_mun_code_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX lane_history_mun_code_idx ON public.lane_history USING btree (municipality_code);


--
-- TOC entry 5073 (class 1259 OID 55047)
-- Name: lane_history_new_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX lane_history_new_id_idx ON public.lane_history USING btree (new_id);


--
-- TOC entry 5074 (class 1259 OID 55048)
-- Name: lane_history_old_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX lane_history_old_id_idx ON public.lane_history USING btree (old_id);


--
-- TOC entry 5083 (class 1259 OID 55049)
-- Name: lane_history_pos_link_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX lane_history_pos_link_id_idx ON public.lane_history_position USING btree (link_id);


--
-- TOC entry 5086 (class 1259 OID 55050)
-- Name: lane_history_position_vvh_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX lane_history_position_vvh_id_idx ON public.lane_history_position USING btree (vvh_id);


--
-- TOC entry 5077 (class 1259 OID 55051)
-- Name: lane_history_valid_to_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX lane_history_valid_to_idx ON public.lane_history USING btree (valid_to);


--
-- TOC entry 5065 (class 1259 OID 55052)
-- Name: lane_municipality_code_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX lane_municipality_code_idx ON public.lane USING btree (municipality_code);


--
-- TOC entry 5089 (class 1259 OID 55053)
-- Name: lane_pos_linkid_side_code_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX lane_pos_linkid_side_code_idx ON public.lane_position USING btree (link_id, side_code);


--
-- TOC entry 5090 (class 1259 OID 55054)
-- Name: lane_position_link_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX lane_position_link_id_idx ON public.lane_position USING btree (link_id);


--
-- TOC entry 5093 (class 1259 OID 55055)
-- Name: lane_position_vvh_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX lane_position_vvh_id_idx ON public.lane_position USING btree (vvh_id);


--
-- TOC entry 5068 (class 1259 OID 55056)
-- Name: lane_valid_to_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX lane_valid_to_idx ON public.lane USING btree (valid_to);


--
-- TOC entry 5096 (class 1259 OID 55057)
-- Name: link_type_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE UNIQUE INDEX link_type_idx ON public.link_type USING btree (link_id);


--
-- TOC entry 5099 (class 1259 OID 55058)
-- Name: link_type_vvh_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX link_type_vvh_id_idx ON public.link_type USING btree (vvh_id);


--
-- TOC entry 5207 (class 1259 OID 55059)
-- Name: linkid_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX linkid_index ON public.roadlink USING btree (linkid);


--
-- TOC entry 5208 (class 1259 OID 55060)
-- Name: linkid_mtkc_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX linkid_mtkc_index ON public.roadlink USING btree (linkid, mtkclass);


--
-- TOC entry 5111 (class 1259 OID 55061)
-- Name: lrm_position_history_vvh_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX lrm_position_history_vvh_id_idx ON public.lrm_position_history USING btree (vvh_id);


--
-- TOC entry 5102 (class 1259 OID 55062)
-- Name: lrm_position_link_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX lrm_position_link_id_idx ON public.lrm_position USING btree (link_id);


--
-- TOC entry 5103 (class 1259 OID 55063)
-- Name: lrm_position_mml_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX lrm_position_mml_idx ON public.lrm_position USING btree (mml_id);


--
-- TOC entry 5106 (class 1259 OID 55064)
-- Name: lrm_position_vvh_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX lrm_position_vvh_id_idx ON public.lrm_position USING btree (vvh_id);


--
-- TOC entry 5133 (class 1259 OID 55065)
-- Name: m_valid_period_mid; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX m_valid_period_mid ON public.manoeuvre_validity_period USING btree (manoeuvre_id);


--
-- TOC entry 5117 (class 1259 OID 55066)
-- Name: manoeuvre_element_dest_vvh_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX manoeuvre_element_dest_vvh_id_idx ON public.manoeuvre_element USING btree (dest_vvh_id);


--
-- TOC entry 5123 (class 1259 OID 55067)
-- Name: manoeuvre_element_history_dest_vvh_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX manoeuvre_element_history_dest_vvh_id_idx ON public.manoeuvre_element_history USING btree (dest_vvh_id);


--
-- TOC entry 5124 (class 1259 OID 55068)
-- Name: manoeuvre_element_history_vvh_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX manoeuvre_element_history_vvh_id_idx ON public.manoeuvre_element_history USING btree (vvh_id);


--
-- TOC entry 5118 (class 1259 OID 55069)
-- Name: manoeuvre_element_vvh_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX manoeuvre_element_vvh_id_idx ON public.manoeuvre_element USING btree (vvh_id);


--
-- TOC entry 5125 (class 1259 OID 55070)
-- Name: manoeuvre_exceptions_mid; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX manoeuvre_exceptions_mid ON public.manoeuvre_exceptions USING btree (manoeuvre_id);


--
-- TOC entry 5114 (class 1259 OID 55071)
-- Name: manoeuvre_valid_to_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX manoeuvre_valid_to_idx ON public.manoeuvre USING btree (valid_to);


--
-- TOC entry 5209 (class 1259 OID 55072)
-- Name: mtkclass_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX mtkclass_index ON public.roadlink USING btree (mtkclass);


--
-- TOC entry 5210 (class 1259 OID 55073)
-- Name: mtkid_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX mtkid_index ON public.roadlink USING btree (mtkid);


--
-- TOC entry 5211 (class 1259 OID 55074)
-- Name: mtkid_mtkhereflip_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX mtkid_mtkhereflip_index ON public.roadlink USING btree (mtkid, mtkhereflip);


--
-- TOC entry 5140 (class 1259 OID 55075)
-- Name: multiple_choice_value_sx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX multiple_choice_value_sx ON public.multiple_choice_value USING btree (asset_id, property_id);


--
-- TOC entry 5212 (class 1259 OID 55076)
-- Name: muni_mtkc_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX muni_mtkc_index ON public.roadlink USING btree (municipalitycode, mtkclass);


--
-- TOC entry 5158 (class 1259 OID 55077)
-- Name: municipality_assettype_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX municipality_assettype_idx ON public.municipality_verification USING btree (municipality_id, asset_type_id);


--
-- TOC entry 4985 (class 1259 OID 55078)
-- Name: municipality_code_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX municipality_code_idx ON public.asset USING btree (municipality_code);


--
-- TOC entry 5159 (class 1259 OID 55079)
-- Name: municipality_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX municipality_idx ON public.municipality_verification USING btree (municipality_id);


--
-- TOC entry 5213 (class 1259 OID 55080)
-- Name: municipality_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX municipality_index ON public.roadlink USING btree (municipalitycode);


--
-- TOC entry 4986 (class 1259 OID 55081)
-- Name: national_id_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE UNIQUE INDEX national_id_index ON public.asset USING btree (national_id);


--
-- TOC entry 5164 (class 1259 OID 55082)
-- Name: numpropval_asset_prop_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX numpropval_asset_prop_id_idx ON public.number_property_value USING btree (asset_id, property_id);


--
-- TOC entry 5165 (class 1259 OID 55083)
-- Name: numpropval_prop_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX numpropval_prop_id_idx ON public.number_property_value USING btree (property_id);


--
-- TOC entry 4998 (class 1259 OID 55084)
-- Name: position_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX position_id_idx ON public.asset_link USING btree (position_id);


--
-- TOC entry 5173 (class 1259 OID 55085)
-- Name: proh_except_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX proh_except_idx ON public.prohibition_exception USING btree (prohibition_value_id);


--
-- TOC entry 5179 (class 1259 OID 55086)
-- Name: proh_valid_period_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX proh_valid_period_idx ON public.prohibition_validity_period USING btree (prohibition_value_id);


--
-- TOC entry 5182 (class 1259 OID 55087)
-- Name: proh_value_asset_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX proh_value_asset_idx ON public.prohibition_value USING btree (asset_id);


--
-- TOC entry 5190 (class 1259 OID 55088)
-- Name: property_assettype_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX property_assettype_id_idx ON public.property USING btree (asset_type_id);


--
-- TOC entry 5193 (class 1259 OID 55089)
-- Name: qgis_roadlinkex_adminclass_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX qgis_roadlinkex_adminclass_index ON public.qgis_roadlinkex USING btree (adminclass);


--
-- TOC entry 5196 (class 1259 OID 55090)
-- Name: qgis_roadlinkex_municipality_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX qgis_roadlinkex_municipality_index ON public.qgis_roadlinkex USING btree (municipalitycode);


--
-- TOC entry 5197 (class 1259 OID 55091)
-- Name: qgis_roadlinkex_roadlink_spatial_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX qgis_roadlinkex_roadlink_spatial_index ON public.qgis_roadlinkex USING gist (shape);


--
-- TOC entry 5198 (class 1259 OID 55092)
-- Name: qgis_roadlinkex_vvh_id_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX qgis_roadlinkex_vvh_id_index ON public.qgis_roadlinkex USING btree (vvh_id);


--
-- TOC entry 5203 (class 1259 OID 55093)
-- Name: road_link_attributest_vvh_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX road_link_attributest_vvh_id_idx ON public.road_link_attributes USING btree (vvh_id);


--
-- TOC entry 5218 (class 1259 OID 55094)
-- Name: roadlink_spatial_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX roadlink_spatial_index ON public.roadlink USING gist (shape);


--
-- TOC entry 5219 (class 1259 OID 55095)
-- Name: roadlink_vvh_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX roadlink_vvh_id_idx ON public.roadlink USING btree (vvh_id);


--
-- TOC entry 5226 (class 1259 OID 55096)
-- Name: roadlinkex_adminclass_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX roadlinkex_adminclass_index ON public.roadlinkex USING btree (adminclass);


--
-- TOC entry 5227 (class 1259 OID 55097)
-- Name: roadlinkex_jobid_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX roadlinkex_jobid_index ON public.roadlinkex USING btree (jobid);


--
-- TOC entry 5230 (class 1259 OID 55098)
-- Name: roadlinkex_municipalitycode_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX roadlinkex_municipalitycode_index ON public.roadlinkex USING btree (municipalitycode);


--
-- TOC entry 5233 (class 1259 OID 55099)
-- Name: roadlinkex_spatial_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX roadlinkex_spatial_index ON public.roadlinkex USING gist (shape);


--
-- TOC entry 5220 (class 1259 OID 55100)
-- Name: roadnum_mtkc_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX roadnum_mtkc_index ON public.roadlink USING btree (roadnumber, mtkclass);


--
-- TOC entry 5234 (class 1259 OID 55101)
-- Name: schema_version_ir_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX schema_version_ir_idx ON public.schema_version USING btree (installed_rank);


--
-- TOC entry 5237 (class 1259 OID 55102)
-- Name: schema_version_s_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX schema_version_s_idx ON public.schema_version USING btree (success);


--
-- TOC entry 5238 (class 1259 OID 55103)
-- Name: schema_version_vr_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX schema_version_vr_idx ON public.schema_version USING btree (version_rank);


--
-- TOC entry 5221 (class 1259 OID 55104)
-- Name: startnode_municipalitycode_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX startnode_municipalitycode_index ON public.roadlink USING btree (startnode, municipalitycode);


--
-- TOC entry 5256 (class 1259 OID 55105)
-- Name: terminal_asset_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX terminal_asset_id_idx ON public.terminal_bus_stop_link USING btree (terminal_asset_id);


--
-- TOC entry 5265 (class 1259 OID 55106)
-- Name: traffic_dir_link_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE UNIQUE INDEX traffic_dir_link_idx ON public.traffic_direction USING btree (link_id);


--
-- TOC entry 5268 (class 1259 OID 55107)
-- Name: traffic_direction_vvh_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX traffic_direction_vvh_id_idx ON public.traffic_direction USING btree (vvh_id);


--
-- TOC entry 4987 (class 1259 OID 55108)
-- Name: type_modified_by_and_date_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX type_modified_by_and_date_idx ON public.asset USING btree (modified_date, asset_type_id, modified_by);


--
-- TOC entry 5119 (class 1259 OID 55109)
-- Name: uniq_first_element; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE UNIQUE INDEX uniq_first_element ON public.manoeuvre_element USING btree ((
CASE element_type
    WHEN 1 THEN manoeuvre_id
    ELSE NULL::bigint
END));


--
-- TOC entry 5120 (class 1259 OID 55110)
-- Name: uniq_last_element; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE UNIQUE INDEX uniq_last_element ON public.manoeuvre_element USING btree ((
CASE element_type
    WHEN 3 THEN manoeuvre_id
    ELSE NULL::bigint
END));


--
-- TOC entry 5271 (class 1259 OID 55111)
-- Name: unknown_speed_limit_link_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX unknown_speed_limit_link_id_idx ON public.unknown_speed_limit USING btree (link_id);


--
-- TOC entry 5272 (class 1259 OID 55112)
-- Name: unknown_speed_limit_mc_ac; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX unknown_speed_limit_mc_ac ON public.unknown_speed_limit USING btree (municipality_code, administrative_class);


--
-- TOC entry 5273 (class 1259 OID 55113)
-- Name: unknown_speed_limit_vvh_id_idx; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX unknown_speed_limit_vvh_id_idx ON public.unknown_speed_limit USING btree (vvh_id);


--
-- TOC entry 5222 (class 1259 OID 55114)
-- Name: updatenumbe_adminclass_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX updatenumbe_adminclass_index ON public.roadlink USING btree (updatenumber, adminclass);


--
-- TOC entry 5223 (class 1259 OID 55115)
-- Name: updatenumbe_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX updatenumbe_index ON public.roadlink USING btree (updatenumber);


--
-- TOC entry 5224 (class 1259 OID 55116)
-- Name: updatenumber_adminclass_municipalitycode_index; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX updatenumber_adminclass_municipalitycode_index ON public.roadlink USING btree (updatenumber, adminclass, municipalitycode);


--
-- TOC entry 5225 (class 1259 OID 55117)
-- Name: vvh_id; Type: INDEX; Schema: public; Owner: digiroad2
--

CREATE INDEX vvh_id ON public.roadlink USING btree (vvh_id);


--
-- TOC entry 5306 (class 2606 OID 55118)
-- Name: inaccurate_asset fk_asset_id; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.inaccurate_asset
    ADD CONSTRAINT fk_asset_id FOREIGN KEY (asset_id) REFERENCES public.asset(id);


--
-- TOC entry 5307 (class 2606 OID 55123)
-- Name: inaccurate_asset fk_asset_type_id; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.inaccurate_asset
    ADD CONSTRAINT fk_asset_type_id FOREIGN KEY (asset_type_id) REFERENCES public.asset_type(id);


--
-- TOC entry 5309 (class 2606 OID 55128)
-- Name: lane_history_attribute fk_l_hist_attrib_lane_hist; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.lane_history_attribute
    ADD CONSTRAINT fk_l_hist_attrib_lane_hist FOREIGN KEY (lane_history_id) REFERENCES public.lane_history(id);


--
-- TOC entry 5310 (class 2606 OID 55133)
-- Name: lane_history_link fk_l_hist_link_lane_hist_pos; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.lane_history_link
    ADD CONSTRAINT fk_l_hist_link_lane_hist_pos FOREIGN KEY (lane_position_id) REFERENCES public.lane_history_position(id);


--
-- TOC entry 5311 (class 2606 OID 55138)
-- Name: lane_history_link fk_l_hist_link_lane_history; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.lane_history_link
    ADD CONSTRAINT fk_l_hist_link_lane_history FOREIGN KEY (lane_id) REFERENCES public.lane_history(id);


--
-- TOC entry 5308 (class 2606 OID 55143)
-- Name: lane_attribute fk_lane_attribute_lane; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.lane_attribute
    ADD CONSTRAINT fk_lane_attribute_lane FOREIGN KEY (lane_id) REFERENCES public.lane(id);


--
-- TOC entry 5312 (class 2606 OID 55148)
-- Name: lane_link fk_lane_link_lane; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.lane_link
    ADD CONSTRAINT fk_lane_link_lane FOREIGN KEY (lane_id) REFERENCES public.lane(id);


--
-- TOC entry 5313 (class 2606 OID 55153)
-- Name: lane_link fk_lane_link_lane_position; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.lane_link
    ADD CONSTRAINT fk_lane_link_lane_position FOREIGN KEY (lane_position_id) REFERENCES public.lane_position(id);


--
-- TOC entry 5357 (class 2606 OID 55158)
-- Name: traffic_sign_manager fk_linear_asset_type_id; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.traffic_sign_manager
    ADD CONSTRAINT fk_linear_asset_type_id FOREIGN KEY (linear_asset_type_id) REFERENCES public.asset_type(id);


--
-- TOC entry 5358 (class 2606 OID 55163)
-- Name: traffic_sign_manager fk_m_traffic_sign_id; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.traffic_sign_manager
    ADD CONSTRAINT fk_m_traffic_sign_id FOREIGN KEY (traffic_sign_id) REFERENCES public.asset(id);


--
-- TOC entry 5327 (class 2606 OID 55168)
-- Name: municipality_asset_id_mapping fk_municipality_asset_id_mapping_asset; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.municipality_asset_id_mapping
    ADD CONSTRAINT fk_municipality_asset_id_mapping_asset FOREIGN KEY (asset_id) REFERENCES public.asset(id);


--
-- TOC entry 5341 (class 2606 OID 55173)
-- Name: property fk_prop_name_localized; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT fk_prop_name_localized FOREIGN KEY (name_localized_string_id) REFERENCES public.localized_string(id);


--
-- TOC entry 5314 (class 2606 OID 55178)
-- Name: manoeuvre fk_traffic_sign_id; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.manoeuvre
    ADD CONSTRAINT fk_traffic_sign_id FOREIGN KEY (traffic_sign_id) REFERENCES public.asset(id);


--
-- TOC entry 5318 (class 2606 OID 55183)
-- Name: manoeuvre_exceptions_history hist_manoeuvre_fk; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.manoeuvre_exceptions_history
    ADD CONSTRAINT hist_manoeuvre_fk FOREIGN KEY (manoeuvre_id) REFERENCES public.manoeuvre_history(id);


--
-- TOC entry 5317 (class 2606 OID 55188)
-- Name: manoeuvre_exceptions manoeuvre_fk; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.manoeuvre_exceptions
    ADD CONSTRAINT manoeuvre_fk FOREIGN KEY (manoeuvre_id) REFERENCES public.manoeuvre(id);


--
-- TOC entry 5288 (class 2606 OID 55193)
-- Name: asset sys_c003960718; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.asset
    ADD CONSTRAINT sys_c003960718 FOREIGN KEY (asset_type_id) REFERENCES public.asset_type(id);


--
-- TOC entry 5342 (class 2606 OID 55198)
-- Name: property sys_c003960725; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT sys_c003960725 FOREIGN KEY (asset_type_id) REFERENCES public.asset_type(id);


--
-- TOC entry 5353 (class 2606 OID 55203)
-- Name: text_property_value sys_c003960730; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.text_property_value
    ADD CONSTRAINT sys_c003960730 FOREIGN KEY (asset_id) REFERENCES public.asset(id);


--
-- TOC entry 5354 (class 2606 OID 55208)
-- Name: text_property_value sys_c003960731; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.text_property_value
    ADD CONSTRAINT sys_c003960731 FOREIGN KEY (property_id) REFERENCES public.property(id);


--
-- TOC entry 5305 (class 2606 OID 55213)
-- Name: enumerated_value sys_c003960738; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.enumerated_value
    ADD CONSTRAINT sys_c003960738 FOREIGN KEY (property_id) REFERENCES public.property(id);


--
-- TOC entry 5345 (class 2606 OID 55218)
-- Name: single_choice_value sys_c003960743; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.single_choice_value
    ADD CONSTRAINT sys_c003960743 FOREIGN KEY (asset_id) REFERENCES public.asset(id);


--
-- TOC entry 5346 (class 2606 OID 55223)
-- Name: single_choice_value sys_c003960744; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.single_choice_value
    ADD CONSTRAINT sys_c003960744 FOREIGN KEY (enumerated_value_id) REFERENCES public.enumerated_value(id);


--
-- TOC entry 5347 (class 2606 OID 55228)
-- Name: single_choice_value sys_c003960745; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.single_choice_value
    ADD CONSTRAINT sys_c003960745 FOREIGN KEY (property_id) REFERENCES public.property(id);


--
-- TOC entry 5321 (class 2606 OID 55233)
-- Name: multiple_choice_value sys_c003960750; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.multiple_choice_value
    ADD CONSTRAINT sys_c003960750 FOREIGN KEY (property_id) REFERENCES public.property(id);


--
-- TOC entry 5322 (class 2606 OID 55238)
-- Name: multiple_choice_value sys_c003960751; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.multiple_choice_value
    ADD CONSTRAINT sys_c003960751 FOREIGN KEY (enumerated_value_id) REFERENCES public.enumerated_value(id);


--
-- TOC entry 5323 (class 2606 OID 55243)
-- Name: multiple_choice_value sys_c003960752; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.multiple_choice_value
    ADD CONSTRAINT sys_c003960752 FOREIGN KEY (asset_id) REFERENCES public.asset(id);


--
-- TOC entry 5290 (class 2606 OID 55248)
-- Name: asset_link sys_c003960765; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.asset_link
    ADD CONSTRAINT sys_c003960765 FOREIGN KEY (asset_id) REFERENCES public.asset(id);


--
-- TOC entry 5291 (class 2606 OID 55253)
-- Name: asset_link sys_c003960766; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.asset_link
    ADD CONSTRAINT sys_c003960766 FOREIGN KEY (position_id) REFERENCES public.lrm_position(id);


--
-- TOC entry 5331 (class 2606 OID 55258)
-- Name: number_property_value sys_c003960774; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.number_property_value
    ADD CONSTRAINT sys_c003960774 FOREIGN KEY (asset_id) REFERENCES public.asset(id);


--
-- TOC entry 5332 (class 2606 OID 55263)
-- Name: number_property_value sys_c003960775; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.number_property_value
    ADD CONSTRAINT sys_c003960775 FOREIGN KEY (property_id) REFERENCES public.property(id);


--
-- TOC entry 5315 (class 2606 OID 55268)
-- Name: manoeuvre_element sys_c003960796; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.manoeuvre_element
    ADD CONSTRAINT sys_c003960796 FOREIGN KEY (manoeuvre_id) REFERENCES public.manoeuvre(id);


--
-- TOC entry 5339 (class 2606 OID 55273)
-- Name: prohibition_value sys_c003960811; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.prohibition_value
    ADD CONSTRAINT sys_c003960811 FOREIGN KEY (asset_id) REFERENCES public.asset(id);


--
-- TOC entry 5336 (class 2606 OID 55278)
-- Name: prohibition_exception sys_c003960815; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.prohibition_exception
    ADD CONSTRAINT sys_c003960815 FOREIGN KEY (prohibition_value_id) REFERENCES public.prohibition_value(id);


--
-- TOC entry 5338 (class 2606 OID 55283)
-- Name: prohibition_validity_period sys_c003960823; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.prohibition_validity_period
    ADD CONSTRAINT sys_c003960823 FOREIGN KEY (prohibition_value_id) REFERENCES public.prohibition_value(id);


--
-- TOC entry 5320 (class 2606 OID 55288)
-- Name: manoeuvre_validity_period sys_c003960831; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.manoeuvre_validity_period
    ADD CONSTRAINT sys_c003960831 FOREIGN KEY (manoeuvre_id) REFERENCES public.manoeuvre(id);


--
-- TOC entry 5343 (class 2606 OID 55293)
-- Name: service_point_value sys_c003960836; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.service_point_value
    ADD CONSTRAINT sys_c003960836 FOREIGN KEY (asset_id) REFERENCES public.asset(id);


--
-- TOC entry 5351 (class 2606 OID 55298)
-- Name: terminal_bus_stop_link sys_c003960943; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.terminal_bus_stop_link
    ADD CONSTRAINT sys_c003960943 FOREIGN KEY (terminal_asset_id) REFERENCES public.asset(id);


--
-- TOC entry 5352 (class 2606 OID 55303)
-- Name: terminal_bus_stop_link sys_c003960944; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.terminal_bus_stop_link
    ADD CONSTRAINT sys_c003960944 FOREIGN KEY (bus_stop_asset_id) REFERENCES public.asset(id);


--
-- TOC entry 5329 (class 2606 OID 55308)
-- Name: municipality_verification sys_c003960976; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.municipality_verification
    ADD CONSTRAINT sys_c003960976 FOREIGN KEY (municipality_id) REFERENCES public.municipality(id);


--
-- TOC entry 5330 (class 2606 OID 55313)
-- Name: municipality_verification sys_c003960977; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.municipality_verification
    ADD CONSTRAINT sys_c003960977 FOREIGN KEY (asset_type_id) REFERENCES public.asset_type(id);


--
-- TOC entry 5301 (class 2606 OID 55318)
-- Name: date_property_value sys_c003960987; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.date_property_value
    ADD CONSTRAINT sys_c003960987 FOREIGN KEY (asset_id) REFERENCES public.asset(id);


--
-- TOC entry 5302 (class 2606 OID 55323)
-- Name: date_property_value sys_c003960988; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.date_property_value
    ADD CONSTRAINT sys_c003960988 FOREIGN KEY (property_id) REFERENCES public.property(id);


--
-- TOC entry 5361 (class 2606 OID 55328)
-- Name: validity_period_property_value sys_c003960999; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.validity_period_property_value
    ADD CONSTRAINT sys_c003960999 FOREIGN KEY (asset_id) REFERENCES public.asset(id);


--
-- TOC entry 5362 (class 2606 OID 55333)
-- Name: validity_period_property_value sys_c003961000; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.validity_period_property_value
    ADD CONSTRAINT sys_c003961000 FOREIGN KEY (property_id) REFERENCES public.property(id);


--
-- TOC entry 5284 (class 2606 OID 55338)
-- Name: additional_panel sys_c003961017; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.additional_panel
    ADD CONSTRAINT sys_c003961017 FOREIGN KEY (asset_id) REFERENCES public.asset(id);


--
-- TOC entry 5285 (class 2606 OID 55343)
-- Name: additional_panel sys_c003961018; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.additional_panel
    ADD CONSTRAINT sys_c003961018 FOREIGN KEY (property_id) REFERENCES public.property(id);


--
-- TOC entry 5294 (class 2606 OID 55348)
-- Name: connected_asset sys_c003961022; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.connected_asset
    ADD CONSTRAINT sys_c003961022 FOREIGN KEY (linear_asset_id) REFERENCES public.asset(id);


--
-- TOC entry 5295 (class 2606 OID 55353)
-- Name: connected_asset sys_c003961023; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.connected_asset
    ADD CONSTRAINT sys_c003961023 FOREIGN KEY (point_asset_id) REFERENCES public.asset(id);


--
-- TOC entry 5297 (class 2606 OID 55358)
-- Name: date_period_value sys_c003961031; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.date_period_value
    ADD CONSTRAINT sys_c003961031 FOREIGN KEY (asset_id) REFERENCES public.asset(id);


--
-- TOC entry 5298 (class 2606 OID 55363)
-- Name: date_period_value sys_c003961032; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.date_period_value
    ADD CONSTRAINT sys_c003961032 FOREIGN KEY (property_id) REFERENCES public.property(id);


--
-- TOC entry 5363 (class 2606 OID 55368)
-- Name: vallu_xml_ids sys_c003961055; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.vallu_xml_ids
    ADD CONSTRAINT sys_c003961055 FOREIGN KEY (asset_id) REFERENCES public.asset(id);


--
-- TOC entry 5328 (class 2606 OID 55373)
-- Name: municipality_feature sys_c003961062; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.municipality_feature
    ADD CONSTRAINT sys_c003961062 FOREIGN KEY (dataset_id) REFERENCES public.municipality_dataset(dataset_id);


--
-- TOC entry 5296 (class 2606 OID 55378)
-- Name: dashboard_info sys_c003961067; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.dashboard_info
    ADD CONSTRAINT sys_c003961067 FOREIGN KEY (municipality_id) REFERENCES public.municipality(id);


--
-- TOC entry 5289 (class 2606 OID 55383)
-- Name: asset_history sys_c003961106; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.asset_history
    ADD CONSTRAINT sys_c003961106 FOREIGN KEY (asset_type_id) REFERENCES public.asset_type(id);


--
-- TOC entry 5299 (class 2606 OID 55388)
-- Name: date_period_value_history sys_c003961112; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.date_period_value_history
    ADD CONSTRAINT sys_c003961112 FOREIGN KEY (asset_id) REFERENCES public.asset_history(id);


--
-- TOC entry 5300 (class 2606 OID 55393)
-- Name: date_period_value_history sys_c003961113; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.date_period_value_history
    ADD CONSTRAINT sys_c003961113 FOREIGN KEY (property_id) REFERENCES public.property(id);


--
-- TOC entry 5286 (class 2606 OID 55398)
-- Name: additional_panel_history sys_c003961118; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.additional_panel_history
    ADD CONSTRAINT sys_c003961118 FOREIGN KEY (asset_id) REFERENCES public.asset_history(id);


--
-- TOC entry 5287 (class 2606 OID 55403)
-- Name: additional_panel_history sys_c003961119; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.additional_panel_history
    ADD CONSTRAINT sys_c003961119 FOREIGN KEY (property_id) REFERENCES public.property(id);


--
-- TOC entry 5359 (class 2606 OID 55408)
-- Name: val_period_property_value_hist sys_c003961129; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.val_period_property_value_hist
    ADD CONSTRAINT sys_c003961129 FOREIGN KEY (asset_id) REFERENCES public.asset_history(id);


--
-- TOC entry 5360 (class 2606 OID 55413)
-- Name: val_period_property_value_hist sys_c003961130; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.val_period_property_value_hist
    ADD CONSTRAINT sys_c003961130 FOREIGN KEY (property_id) REFERENCES public.property(id);


--
-- TOC entry 5303 (class 2606 OID 55418)
-- Name: date_property_value_history sys_c003961135; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.date_property_value_history
    ADD CONSTRAINT sys_c003961135 FOREIGN KEY (asset_id) REFERENCES public.asset_history(id);


--
-- TOC entry 5304 (class 2606 OID 55423)
-- Name: date_property_value_history sys_c003961136; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.date_property_value_history
    ADD CONSTRAINT sys_c003961136 FOREIGN KEY (property_id) REFERENCES public.property(id);


--
-- TOC entry 5344 (class 2606 OID 55428)
-- Name: service_point_value_history sys_c003961141; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.service_point_value_history
    ADD CONSTRAINT sys_c003961141 FOREIGN KEY (asset_id) REFERENCES public.asset_history(id);


--
-- TOC entry 5333 (class 2606 OID 55433)
-- Name: number_property_value_history sys_c003961145; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.number_property_value_history
    ADD CONSTRAINT sys_c003961145 FOREIGN KEY (asset_id) REFERENCES public.asset_history(id);


--
-- TOC entry 5334 (class 2606 OID 55438)
-- Name: number_property_value_history sys_c003961146; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.number_property_value_history
    ADD CONSTRAINT sys_c003961146 FOREIGN KEY (property_id) REFERENCES public.property(id);


--
-- TOC entry 5324 (class 2606 OID 55443)
-- Name: multiple_choice_value_history sys_c003961151; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.multiple_choice_value_history
    ADD CONSTRAINT sys_c003961151 FOREIGN KEY (property_id) REFERENCES public.property(id);


--
-- TOC entry 5325 (class 2606 OID 55448)
-- Name: multiple_choice_value_history sys_c003961152; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.multiple_choice_value_history
    ADD CONSTRAINT sys_c003961152 FOREIGN KEY (enumerated_value_id) REFERENCES public.enumerated_value(id);


--
-- TOC entry 5326 (class 2606 OID 55453)
-- Name: multiple_choice_value_history sys_c003961153; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.multiple_choice_value_history
    ADD CONSTRAINT sys_c003961153 FOREIGN KEY (asset_id) REFERENCES public.asset_history(id);


--
-- TOC entry 5348 (class 2606 OID 55458)
-- Name: single_choice_value_history sys_c003961157; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.single_choice_value_history
    ADD CONSTRAINT sys_c003961157 FOREIGN KEY (asset_id) REFERENCES public.asset_history(id);


--
-- TOC entry 5349 (class 2606 OID 55463)
-- Name: single_choice_value_history sys_c003961158; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.single_choice_value_history
    ADD CONSTRAINT sys_c003961158 FOREIGN KEY (enumerated_value_id) REFERENCES public.enumerated_value(id);


--
-- TOC entry 5350 (class 2606 OID 55468)
-- Name: single_choice_value_history sys_c003961159; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.single_choice_value_history
    ADD CONSTRAINT sys_c003961159 FOREIGN KEY (property_id) REFERENCES public.property(id);


--
-- TOC entry 5355 (class 2606 OID 55473)
-- Name: text_property_value_history sys_c003961164; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.text_property_value_history
    ADD CONSTRAINT sys_c003961164 FOREIGN KEY (asset_id) REFERENCES public.asset_history(id);


--
-- TOC entry 5356 (class 2606 OID 55478)
-- Name: text_property_value_history sys_c003961165; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.text_property_value_history
    ADD CONSTRAINT sys_c003961165 FOREIGN KEY (property_id) REFERENCES public.property(id);


--
-- TOC entry 5292 (class 2606 OID 55483)
-- Name: asset_link_history sys_c003961170; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.asset_link_history
    ADD CONSTRAINT sys_c003961170 FOREIGN KEY (asset_id) REFERENCES public.asset_history(id);


--
-- TOC entry 5293 (class 2606 OID 55488)
-- Name: asset_link_history sys_c003961171; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.asset_link_history
    ADD CONSTRAINT sys_c003961171 FOREIGN KEY (position_id) REFERENCES public.lrm_position_history(id);


--
-- TOC entry 5340 (class 2606 OID 55493)
-- Name: prohibition_value_history sys_c003961175; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.prohibition_value_history
    ADD CONSTRAINT sys_c003961175 FOREIGN KEY (asset_id) REFERENCES public.asset_history(id);


--
-- TOC entry 5337 (class 2606 OID 55498)
-- Name: prohibition_exception_history sys_c003961179; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.prohibition_exception_history
    ADD CONSTRAINT sys_c003961179 FOREIGN KEY (prohibition_value_id) REFERENCES public.prohibition_value_history(id);


--
-- TOC entry 5335 (class 2606 OID 55503)
-- Name: proh_val_period_history sys_c003961189; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.proh_val_period_history
    ADD CONSTRAINT sys_c003961189 FOREIGN KEY (prohibition_value_id) REFERENCES public.prohibition_value_history(id);


--
-- TOC entry 5316 (class 2606 OID 55508)
-- Name: manoeuvre_element_history sys_c003961204; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.manoeuvre_element_history
    ADD CONSTRAINT sys_c003961204 FOREIGN KEY (manoeuvre_id) REFERENCES public.manoeuvre_history(id);


--
-- TOC entry 5319 (class 2606 OID 55513)
-- Name: manoeuvre_val_period_history sys_c003961214; Type: FK CONSTRAINT; Schema: public; Owner: digiroad2
--

ALTER TABLE ONLY public.manoeuvre_val_period_history
    ADD CONSTRAINT sys_c003961214 FOREIGN KEY (manoeuvre_id) REFERENCES public.manoeuvre_history(id);


-- Completed on 2024-11-18 14:32:50 EET

--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Debian 16.1-1.pgdg110+1)
-- Dumped by pg_dump version 17.0 (Ubuntu 17.0-1.pgdg20.04+1)

-- Started on 2024-11-18 14:32:50 EET

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

-- Completed on 2024-11-18 14:32:51 EET

--
-- PostgreSQL database dump complete
--

--
-- Database "template_postgis" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Debian 16.1-1.pgdg110+1)
-- Dumped by pg_dump version 17.0 (Ubuntu 17.0-1.pgdg20.04+1)

-- Started on 2024-11-18 14:32:51 EET

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
-- TOC entry 4649 (class 1262 OID 16385)
-- Name: template_postgis; Type: DATABASE; Schema: -; Owner: digiroad2
--

CREATE DATABASE template_postgis WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE template_postgis OWNER TO digiroad2;

\connect template_postgis

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
-- TOC entry 4650 (class 0 OID 0)
-- Name: template_postgis; Type: DATABASE PROPERTIES; Schema: -; Owner: digiroad2
--

ALTER DATABASE template_postgis IS_TEMPLATE = true;
ALTER DATABASE template_postgis SET search_path TO '$user', 'public', 'topology', 'tiger';


\connect template_postgis

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
-- TOC entry 11 (class 2615 OID 17643)
-- Name: tiger; Type: SCHEMA; Schema: -; Owner: digiroad2
--

CREATE SCHEMA tiger;


ALTER SCHEMA tiger OWNER TO digiroad2;

--
-- TOC entry 12 (class 2615 OID 17899)
-- Name: tiger_data; Type: SCHEMA; Schema: -; Owner: digiroad2
--

CREATE SCHEMA tiger_data;


ALTER SCHEMA tiger_data OWNER TO digiroad2;

--
-- TOC entry 10 (class 2615 OID 17464)
-- Name: topology; Type: SCHEMA; Schema: -; Owner: digiroad2
--

CREATE SCHEMA topology;


ALTER SCHEMA topology OWNER TO digiroad2;

--
-- TOC entry 4651 (class 0 OID 0)
-- Dependencies: 10
-- Name: SCHEMA topology; Type: COMMENT; Schema: -; Owner: digiroad2
--

COMMENT ON SCHEMA topology IS 'PostGIS Topology schema';


--
-- TOC entry 4 (class 3079 OID 17631)
-- Name: fuzzystrmatch; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA public;


--
-- TOC entry 4652 (class 0 OID 0)
-- Dependencies: 4
-- Name: EXTENSION fuzzystrmatch; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION fuzzystrmatch IS 'determine similarities and distance between strings';


--
-- TOC entry 2 (class 3079 OID 16386)
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- TOC entry 4653 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- TOC entry 5 (class 3079 OID 17644)
-- Name: postgis_tiger_geocoder; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder WITH SCHEMA tiger;


--
-- TOC entry 4654 (class 0 OID 0)
-- Dependencies: 5
-- Name: EXTENSION postgis_tiger_geocoder; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_tiger_geocoder IS 'PostGIS tiger geocoder and reverse geocoder';


--
-- TOC entry 3 (class 3079 OID 17465)
-- Name: postgis_topology; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_topology WITH SCHEMA topology;


--
-- TOC entry 4655 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION postgis_topology; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_topology IS 'PostGIS topology spatial types and functions';


-- Completed on 2024-11-18 14:32:51 EET

--
-- PostgreSQL database dump complete
--

-- Completed on 2024-11-18 14:32:51 EET

--
-- PostgreSQL database cluster dump complete
--

