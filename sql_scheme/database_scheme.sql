CREATE DATABASE IF NOT EXISTS pixomaticdma;
USE pixomaticdma;

CREATE TABLE Companies(
id       		int(255) auto_increment not null,
name        	varchar(100),
cif         	char(9),
shortdesc 		text(100),
description		mediumtext,
email   		varchar(100),
ccc				varchar(100),
date 			date,
status			boolean,
logo			mediumtext,
token			char(64),
createdAt		date,
updatedAt		date,
CONSTRAINT companies_uniques_fields UNIQUE (name, cif, token),
CONSTRAINT pk_companies PRIMARY KEY(id)
)ENGINE = InnoDb;