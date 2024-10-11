create database if not exists control_personal;
use control_personal;
-- script for db isabella
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
PER_dni char (8) not null unique,
PER_nombre varchar (100),
PER_apaterno varchar (45),
PER_amaterno varchar (45),
PER_genero char(1),
PER_fec_nacimiento date,
PER_foto varchar (250),
PER_direccion varchar (45),
PER_estado tinyint(1) default 1,
PER_contrasena varchar (200),
PER_correo varchar (100) not null unique,
PER_telefono varchar (9),
TTR_id int not null,
constraint FK_TTR_id foreign key (TTR_id) references tipo_trabajador (TTR_id)
on delete cascade on update cascade
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

constraint FK_PER_id2 foreign key  (PER_id) references personal (PER_id)
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

-- SELECT C.CON_id as 'contrato', P.PER_dni as 'dni', P.PER_nombre as 'nombre' ,P.PER_apaterno as 'paterno',
--  T.TTR_descripcion AS 'cargo', R.REGE_hora_inn AS 'ingreso', J.JLAB_fecha AS 'fecha',
-- FROM  contrato C INNER JOIN
--                   personal P ON C.PER_id = P.PER_id INNER JOIN
--                   tipo_trabajador T ON C.TTR_id = T.TTR_id INNER JOIN
--                   jornada_laboral J ON C.CON_id = J.CON_id INNER JOIN
--                   registro_entrada R ON J.JLAB_id = R.JLAB_id 
--                   AND J.CON_id = R.CON_id



-- SELECT *
-- FROM     contrato INNER JOIN
--                   contrato_horario ON contrato.CON_id = contrato_horario.CON_id INNER JOIN
--                   horario ON contrato_horario.HOR_id = horario.HOR_id INNER JOIN
--                   personal ON contrato.PER_id = personal.PER_id INNER JOIN
--                   tipo_trabajador ON contrato.TTR_id = tipo_trabajador.TTR_id

-- SELECT 
-- FROM     contrato INNER JOIN
--                   contrato AS contrato_1 ON contrato.CON_id = contrato_1.CON_id INNER JOIN
--                   jornada_laboral ON contrato.CON_id = jornada_laboral.CON_id AND contrato_1.CON_id = jornada_laboral.CON_id INNER JOIN
--                   registro_entrada ON jornada_laboral.JLAB_id = registro_entrada.JLAB_id AND jornada_laboral.CON_id = registro_entrada.CON_id
-- ## seleccionar las asitencias por hora de entrada y hora de salida agrupados por id contrato
-- SELECT
-- FROM     contrato INNER JOIN
--                   contrato AS contrato_1 ON contrato.CON_id = contrato_1.CON_id INNER JOIN
--                   jornada_laboral ON contrato.CON_id = jornada_laboral.CON_id AND contrato_1.CON_id = jornada_laboral.CON_id INNER JOIN
--                   registro_entrada ON jornada_laboral.JLAB_id = registro_entrada.JLAB_id AND jornada_laboral.CON_id = registro_entrada.CON_id



-- SELECT 
-- FROM     contrato INNER JOIN
--                   contrato_horario ON contrato.CON_id = contrato_horario.CON_id INNER JOIN
--                   horario ON contrato_horario.HOR_id = horario.HOR_id


-- SELECT contrato.CON_id, personal.PER_nombre, personal.PER_apaterno, jornada_laboral.JLAB_cargo, registro_entrada.REGE_hora_inn,
-- jornada_laboral.JLAB_asistencia, FUC_VERIFICAR_HORAS_TRABAJADAS(ontrato.CON_id,curDate())
-- FROM     contrato INNER JOIN
--                   personal ON contrato.PER_id = personal.PER_id INNER JOIN
--                   tipo_trabajador ON contrato.TTR_id = tipo_trabajador.TTR_id INNER JOIN
--                   registro_entrada ON contrato.CON_id = registro_entrada.CON_id INNER JOIN
--                   jornada_laboral ON contrato.CON_id = jornada_laboral.CON_id AND registro_entrada.JLAB_id = jornada_laboral.JLAB_id AND 
--                   registro_entrada.CON_id = jornada_laboral.CON_id                  


-- SELECT 
-- FROM     jornada_laboral INNER JOIN
--                   registro_entrada ON jornada_laboral.JLAB_id = registro_entrada.JLAB_id 
--                   AND jornada_laboral.CON_id = registro_entrada.CON_id
