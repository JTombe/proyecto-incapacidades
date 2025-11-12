USE gestion_incapacidades;
-- Aquí puedes insertar colaboradores de prueba, incapacidades demo y usuarios demo.
-- Ejemplo simple de colaborador demo:
INSERT INTO colaboradores (numero_identificacion, tipo_identificacion, nombres, apellidos, fecha_ingreso, salario_base, ibc, eps_id, arl_id)
VALUES ('1234567890','CC','Juan','Pérez','2020-01-01',2000000,2000000,(SELECT id FROM eps LIMIT 1),(SELECT id FROM arl LIMIT 1));
