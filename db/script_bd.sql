create database if not exists control_personal;
use control_personal;

create table nivel_sancion(
	NSA_id int auto_increment primary key not null,
    NSA_descripcion varchar (50),
    NSA_nivel char(1)
);

create table tipo_trabajador(
TTR_id int auto_increment not null primary key,
TTR_descripcion varchar (50),
TTR_estado char(1)
);

create table personal(
PER_id int auto_increment not null primary key,
PER_dni char (8),
PER_nombre varchar (100),
PER_apaterno varchar (45),
PER_amaterno varchar (45),
PER_genero char(1),
PER_fec_nacimiento date,
PER_foto varchar (250),
PER_direccion varchar (45),
PER_estado char (1)
);

create table huella(
HUE_id int auto_increment not null primary key,
HUE_huella varchar (250) not null,
PER_id int not null,

constraint FK_PER_id foreign key (PER_id) references personal(PER_id)
on delete cascade on update cascade
);

create table horario (
HOR_id int auto_increment not null primary key,
HOR_detalle varchar (100),
HOR_entrada time,
HOR_salida time,
HOR_receso_inn time,
HOR_receso_out time,
Hor_estado char (1),
Hor_dirigido varchar(50)
);

create table contrato (
CON_id int auto_increment not null primary key,
CON_fecha_inn date,
CON_fehcha_out date,
CON_estado char(1),

PER_id int not null,
TTR_id int not null,

constraint FK_PER_id2 foreign key  (PER_id) references personal (PER_id)
on delete cascade on update cascade
,
constraint FK_TTR_id foreign key (TTR_id) references tipo_trabajador (TTR_id)
on delete cascade on update cascade
)
ENGINE = InnoDB;

create table jornada_laboral(
JLAB_id int auto_increment not null,
JLAB_fecha date,
JLAB_observacion varchar (45),
JLAB_asistencia char(1),

CON_id int not null,

constraint FK_CON_id foreign key (CON_id) references contrato (CON_id)
on delete cascade on update cascade,

constraint PK_JLAB primary key (JLAB_id,CON_id)
)
ENGINE = InnoDB;

create table registro_entrada(
REGE_id int auto_increment not null primary key,
REGE_hora_inn time,
REGE_justificacion char(1),

JLAB_id int not null,
CON_id int not null,

constraint FK_REG foreign key (JLAB_id, CON_id) references jornada_laboral(JLAB_id, CON_id)
on update cascade on delete cascade
)
engine = InnoDB;

create table permiso (
PER_id int auto_increment not null primary key,
PER_detalle varchar (200),
PER_fecha date,
PER_estado char(1),

CON_id int not null,

constraint FK_CON_id3 foreign key (CON_id) references contrato (CON_id)
on delete cascade on update cascade
)
engine = InnoDB;

create table sancion(
CON_id int not null,
NSA_id int not null,
SAN_detalle varchar (250),
SAN_absolucion char(1),
SAN_estado char(1),

constraint FK_CON_id4 foreign key (CON_id) references contrato (CON_id)
on delete cascade on update cascade,
constraint FK_NSA_id foreign key (NSA_id) references nivel_sancion (NSA_id)
on delete cascade on update cascade,

constraint PK_SAN primary key (CON_id, NSA_id)
)
engine = InnoDB;

create table contrato_horario (
CON_id int not null,
HOR_id int not null,


constraint FK_CON_id5 foreign key (CON_id) references contrato (CON_id)
on delete cascade on update cascade,
constraint FK_HOR_id foreign key (HOR_id) references horario (HOR_id)
on delete cascade on update cascade,

constraint PK_SAN primary key (CON_id, HOR_id)
)
engine = InnoDB;