--##############3#######################################    ##################################################### 

use control_personal;
show tables;
describe personal;

-- ##################################################### SP #####################################################
-- 1. CREATE PROCEDURE CRUD PERSONAL
DESCRIBE personal;

DELIMITER $$

CREATE PROCEDURE SP_CRUD_PERSONAL(
vOption char (1),
aId varchar (20),
aNomCompleto varchar(120),
aGenero char(1),
aFecNacimiento date,
aHuela varchar(200),
aFoto varchar(200),
aEstado char(1)
)

BEGIN 

	CASE
		
		WHEN vOption = 'S'
 			THEN
			SELECT * FROM PERSONAL;
            
		WHEN vOption = 'A'
			THEN
			INSERT INTO PERSONAL
			(PER_id,PER_nom_completo,PER_genero, PER_fec_nacimiento, PER_huella, PER_foto, PER_estado)
			VALUES
			(aId , aNomCompleto , aGenero , aFecNacimiento , aHuela , aFoto , aEstado );
		
		WHEN vOption = 'M'
			THEN
			UPDATE PERSONAL 
			SET
			PER_nom_completo = aNomCompleto, PER_genero= aGenero, PER_fec_nacimiento= aFecNacimiento, PER_huella= aHuela, PER_foto= aFoto, PER_estado= aEstado WHERE PER_id = aId;
 		WHEN vOption = 'D'
 			THEN
			DELETE from PERSONAL WHERE PER_id = aId;
            
	END CASE;
	
END$$

DELIMITER ;


-- ##################################################### SP #####################################################

-- 2. CREATE PROCEDURE CRUD NIVEL SANCION
DESCRIBE nivel_sancion;

DELIMITER $$

CREATE PROCEDURE SP_CRUD_NIVEL_SANCION(
vOption char (1),
aId varchar (20),
aDescripcion varchar(120),
aNivel char(1)
)

BEGIN 

	CASE
		
		WHEN vOption = 'S'
 			THEN
			SELECT * FROM NIVEL_SANCION;
            
		WHEN vOption = 'A'
			THEN
			INSERT INTO NIVEL_SANCION
			(NSA_id, NSA_descripcion, NSA_Nivel)
			VALUES
			(aId , aDescripcion , aNivel);
		
		WHEN vOption = 'M'
			THEN
			UPDATE NIVEL_SANCION 
			SET
			NSA_descripcion= aDescripcion, NSA_Nivel= aNivel WHERE NSA_id = aId;
 		WHEN vOption = 'D'
 			THEN
			DELETE from NIVEL_SANCION WHERE NSA_id = aId;
            
	END CASE;
	
END$$

DELIMITER ;




-- ##################################################### SP #####################################################

-- 3. CREATE PROCEDURE CRUD TIPO TRABAJADOR
DESCRIBE tipo_trabajador;

DELIMITER $$

CREATE PROCEDURE SP_CRUD_TIPO_TRABAJADOR(
vOption char (1),
aId varchar (20),
aDescripcion varchar(100),
aEstado char(1)
)

BEGIN 

	CASE
		
		WHEN vOption = 'S'
 			THEN
			SELECT * FROM tipo_trabajador;
            
		WHEN vOption = 'A'
			THEN
			INSERT INTO tipo_trabajador
			(TTR_id, TTR_descripcion, TTR_estado)
			VALUES
			(aId , aDescripcion , aEstado);
		
		WHEN vOption = 'M'
			THEN
			UPDATE tipo_trabajador 
			SET
			TTR_descripcion= aDescripcion, TTR_estado= aEstado WHERE TTR_id = aId;
 		WHEN vOption = 'D'
 			THEN
			DELETE from tipo_trabajador WHERE TTR_id = aId;
            
	END CASE;
	
END$$

DELIMITER ;



-- ##################################################### SP #####################################################

-- 4. CREATE PROCEDURE CRUD HORARIO
DESCRIBE horario;

DELIMITER $$

CREATE PROCEDURE SP_CRUD_horario(
vOption char (1),
aId int,
aDetalle varchar(200),
aEntrada time,
aSalida time,
aRecesoInicio time,
aRecesoFin time,
aEstado char(1),
aDirigido varchar(50)
)

BEGIN 

	CASE
		
		WHEN vOption = 'S'
 			THEN
			SELECT * FROM horario;
            
		WHEN vOption = 'A'
			THEN
			INSERT INTO horario
			(HOR_id, HOR_detalle, HOR_entrada, HOR_salida, HOR_receso_inn, HOR_receso_out, HOR_estado, HOR_dirigido )
			VALUES
			(aId , aDetalle , aEntrada, aSalida, aRecesoInicio, aRecesoFin, aEstado, aDirigido);
		
		WHEN vOption = 'M'
			THEN
			UPDATE horario 
			SET
			HOR_detalle = aDetalle, HOR_entrada = aEntrada, HOR_salida = aSalida, HOR_receso_inn  = aRecesoInicio, HOR_receso_out  = aRecesoFin, HOR_estado = aEstado, HOR_dirigido = aDirigido WHERE HOR_id = aId;
 		WHEN vOption = 'D'
 			THEN
			DELETE from horario WHERE HOR_id = aId;
            
	END CASE;
	
END$$

DELIMITER ;



-- ##################################################### SP #####################################################

-- 5. CREATE PROCEDURE CRUD CONTRATO
DESCRIBE contrato;

DELIMITER $$

CREATE PROCEDURE SP_CRUD_contrato(
vOption char (1),
aId int,
aFechaInicio date,
aFechaFin date,
aEstado varchar(45),
kPersonal varchar(20),
kTTrabajador varchar(20)
)

BEGIN 

	CASE
		
		WHEN vOption = 'S'
 			THEN
			SELECT * FROM contrato;
            
		WHEN vOption = 'A'
			THEN
			INSERT INTO contrato
			(CON_id,CON_fecha_inn,CON_fecha_out,CON_estado,PER_id,TTR_id)
			VALUES
			(aId,aFechaInicio,aFechaFin,aEstado,kPersonal,kTTrabajador);
		
		WHEN vOption = 'M'
			THEN
			UPDATE contrato 
			SET
			CON_fecha_inn = aFechaInicio, CON_fecha_out = aFechaFin, CON_estado = aEstado, PER_id = kPersonal, TTR_id = kTTrabajador WHERE CON_id = aId;
 		WHEN vOption = 'D'
 			THEN
			DELETE from contrato WHERE CON_id = aId;
            
	END CASE;
	
END$$

DELIMITER ;

-- ##################################################### SP #####################################################

-- 6. CREATE PROCEDURE CRUD PERMISO
DESCRIBE permiso;

DELIMITER $$

CREATE PROCEDURE SP_CRUD_permiso(
vOption char (1),
aId int,
aDetalle varchar(200),
aFechaInicio date,
aEstado varchar(45),
kContrato int,
aFechaFinal date
)

BEGIN 

	CASE
		
		WHEN vOption = 'S'
 			THEN
			SELECT * FROM permiso;
            
		WHEN vOption = 'A'
			THEN
			INSERT INTO permiso
			(PER_id,PER_detalle,PER_fecha_inicio,PER_estado,CON_id,PER_fecha_final)
			VALUES
			(aId,aDetalle,aFechaInicio,aEstado,kContrato,aFechaFinal);
		
		WHEN vOption = 'M'
			THEN
			UPDATE permiso
			SET
			PER_detalle = aDetalle, PER_fecha_inicio = aFechaInicio, PER_estado = aEstado, CON_id = kContrato ,PER_fecha_final=aFechaFinal WHERE PER_id = aId;
 		WHEN vOption = 'D'
 			THEN
			DELETE from permiso WHERE PER_id = aId;
            
	END CASE;
	
END$$

DELIMITER ;



-- ##################################################### SP #####################################################

-- 7. CREATE PROCEDURE CRUD JORNADA LABORAL
DESCRIBE jornada_laboral;

DELIMITER $$

CREATE PROCEDURE SP_CRUD_jornada_laboral(
vOption char (1),
aId int,
kContrato int,
aFecha date,
aObservacion varchar(45),
aAsistencia char (1)
)

BEGIN 

	CASE
		
		WHEN vOption = 'S'
 			THEN
			SELECT * FROM jornada_laboral;
            
		WHEN vOption = 'A'
			THEN
			INSERT INTO jornada_laboral
			(JLAB_id,CON_id,JLAB_fecha,JLAB_observacion,JLAB_asistencia)
			VALUES
			(aId,kContrato,aFecha,aObservacion,aAsistencia);
		
		WHEN vOption = 'M'
			THEN
			UPDATE jornada_laboral
			SET
			PK_CONTRATO=kContrato,JLAB_fecha=aFecha,JLAB_observacion=aObservacion,JLAB_asistencia=aAsistencia WHERE JLAB_id=aId;
 		WHEN vOption = 'D'
 			THEN
			DELETE from jornada_laboral WHERE JLAB_id = aId AND PK_CONTRATO = kContrato;
            
	END CASE;
	
END$$

DELIMITER ;


-- ##################################################### SP #####################################################

-- 8. CREATE PROCEDURE CRUD REGISTRO DE ENTRADA
DESCRIBE registro_entrada;

DELIMITER $$

CREATE PROCEDURE SP_CRUD_registro_entrada(
vOption char (1),
aId int,
aFechaHora datetime,
aJustificacion char(1),
kJLaboral int,
kContrato int
)

BEGIN 

	CASE
		
		WHEN vOption = 'S'
 			THEN
			SELECT * FROM registro_entrada;
            
		WHEN vOption = 'A'
			THEN
			INSERT INTO registro_entrada
			(REGE_id,REGE_hora_inn,REGE_justificaion,JLAB_id,CON_id)
			VALUES
			(aId,aFechaHora,aJustificacion,kJLaboral,kContrato);
		
		WHEN vOption = 'M'
			THEN
			UPDATE registro_entrada
			SET
			REGE_hora_inn = aFechaHora, REGE_justificaion = aJustificacion, JLAB_id = kJLaboral, CON_id = kContrato WHERE REGE_id = aId;
 		WHEN vOption = 'D'
 			THEN
			DELETE from registro_entrada WHERE REGE_id = aId;
            
	END CASE;
	
END$$

DELIMITER ;


-- ##################################################### SP #####################################################

-- 9. CREATE PROCEDURE CRUD SANCION
DESCRIBE sancion;

DELIMITER $$

CREATE PROCEDURE SP_CRUD_SANCION(
vOption char (1),
KContrato int,
kNSancion int,
aDetalle varchar(250),
aAbsolucion char(1),
aEstado char(1)
)

BEGIN 

	CASE
		
		WHEN vOption = 'S'
 			THEN
			SELECT * FROM sancion;
            
		WHEN vOption = 'A'
			THEN
			INSERT INTO sancion
			(CON_id,NSA_id,SAN_detalle,SAN_adsolucion,SAN_estado)
			VALUES
			(KContrato,kNSancion,aDetalle,aAbsolucion,aEstado);
		
		WHEN vOption = 'M'
			THEN
			UPDATE sancion
			SET
			SAN_detalle = aDetalle, SAN_adsolucion = aAbsolucion, SAN_estado = aEstado WHERE CON_id = KContrato AND NSA_id = kNSancion;
 		
        WHEN vOption = 'D'
 			THEN
			DELETE from sancion WHERE CON_id = KContrato AND NSA_id = kNSancion;
            
	END CASE;
	
END$$

DELIMITER ;



-- ##################################################### SP #####################################################

-- 10. CREATE PROCEDURE CRUD SANCION
DESCRIBE contrato_horario;

DELIMITER $$

CREATE PROCEDURE SP_CRUD_CONTRATO_HORARIO(
vOption char (1),
KContrato int,
kHorario int
)

BEGIN 

	CASE
		
		WHEN vOption = 'S'
 			THEN
			SELECT * FROM contrato_horario;

            
		WHEN vOption = 'A'
			THEN
			INSERT INTO contrato_horario;
			(CON_id, HOR_id)
			VALUES
			(KContrato, kHorario);
		 
        WHEN vOption = 'D'
 			THEN
			DELETE from contrato_horario;
             WHERE CON_id = KContrato AND HOR_id = kHorario;
            
	END CASE;
	
END$$

DELIMITER ;


