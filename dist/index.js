"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json()); //middleware
app.use('/', express_1.default.static('public')); //middleware
let id_sequence = 1;
const employee = [
    {
        'id': 1,
        'cedula': "001-1432464-9",
        'fullname': "Dayhan Garcia",
        'pricePerHour': 20000,
    }
];
const workedHours = [
    {
        'employeeId': 1,
        'hours': 10
    },
    {
        'employeeId': 1,
        'hours': 2
    },
    {
        'employeeId': 1,
        'hours': 13
    },
    {
        'employeeId': 1,
        'hours': 8
    }
];
//Endpoint
//Mostrar todos los empleados
app.get('/employee', (req, res) => {
    res.status(200).json(employee);
});
//Mostrar empleado unico
app.get('/employee/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);
    const empleado = employee.find(x => x.id === id);
    if (isNaN(id) || id <= 0 || id > employee.length) {
        return res.json({
            statusCode: 400,
            statusValue: 'Bad Request',
            message: `El ID digitado no es válido: ${id}`
        });
    }
    res.json({
        statusCode: 200,
        statusValue: 'Ok',
        data: empleado
    });
});
//Mostrar horas de un empleado
app.get('/employee/:id/hours', (req, res) => {
    const id = Number.parseInt(req.params.id);
    if (isNaN(id) || id <= 0 || id > employee.length) {
        return res.json({
            statusCode: 400,
            statusValue: 'Bad Request',
            message: `El ID digitado no es válido: ${id}`
        });
    }
    const horas = workedHours.filter((x) => x.employeeId === id);
    let totalHoras = 0;
    workedHours.forEach(i => totalHoras += i.hours);
    res.json({
        workedHours,
        totalHoras
    });
});
//Mostrar salario de un empleado
app.get('/employee/:id/salary', (req, res) => {
    const id = Number.parseInt(req.params.id);
    if (isNaN(id) || id <= 0 || id > employee.length) {
        return res.json({
            statusCode: 400,
            statusValue: 'Bad Request',
            message: `El ID digitado no es válido: ${id}`
        });
    }
    const horas = workedHours.find((x) => x.employeeId === id);
    if (!horas) {
        return res.status(404).json({
            statusCode: 404,
            statusValue: 'Not Found',
            message: `No se encontraron horas trabajadas para el empleado con ID: ${id}`
        });
    }
    const totalHoras = horas.hours;
    const money = employee.find((x) => x.id === id);
    if (!money) {
        return res.status(404).json({
            statusCode: 404,
            statusValue: 'Not Found',
            message: `No se encontró información del empleado con ID: ${id}`
        });
    }
    const precioPorHora = money.pricePerHour;
    const salario = totalHoras * precioPorHora;
    res.json({
        employee: money,
        salario: salario
    });
});
//Agregar empleado nuevo
app.post('/employee', (req, res) => {
    const { cedula, fullname, pricePerHour } = req.body;
    if (cedula.length === 0) {
        res.status(400).json({
            statusCode: 400,
            statusValue: 'Bad Request',
            message: `cedula es requerido`
        });
    }
    if (fullname.trim().length === 0) {
        res.status(400).json({
            statusCode: 400,
            statusValue: 'Bad Request',
            message: `fullname es requerido`
        });
    }
    if (isNaN(pricePerHour) || pricePerHour <= 0) {
        res.status(400).json({
            statusCode: 400,
            statusValue: 'Bad Request',
            message: `pricePerHour es requerido`
        });
    }
    const dupliCedula = employee.find((e) => e.cedula === cedula);
    if (dupliCedula) {
        return res.status(400).json({
            statusCode: 400,
            statusValue: 'Bad Request',
            message: `La cédula insertada ya existe (${cedula}).`
        });
    }
    ;
    id_sequence += 1;
    const pino = {
        id: id_sequence,
        cedula,
        fullname,
        pricePerHour
    };
    employee.push(pino);
    res.status(201).json(pino);
});
//Agregar horas a empleado
app.post('/employee/:id/hours', (req, res) => {
    const { hours } = req.body;
    const id = Number.parseInt(req.params.id);
    if (isNaN(id) || id <= 0 || id > employee.length) {
        return res.json({
            statusCode: 400,
            statusValue: 'Bad Request',
            message: `El ID digitado no es válido: ${id}`
        });
    }
    ;
    if (isNaN(hours) || hours <= 0) {
        res.status(400).json({
            statusCode: 400,
            statusValue: 'Bad Request',
            message: `hours es requerido`
        });
    }
    ;
    const newHoras = {
        employeeId: id,
        hours
    };
    workedHours.push(newHoras);
    res.status(201).json(newHoras);
});
//Modificar usuario (Fullname y Price Per Hour)
app.put('/employee/:id', (req, res) => {
    const { fullname, pricePerHour } = req.body;
    const id = Number.parseInt(req.params.id);
    if (isNaN(id) || id <= 0 || id > employee.length) {
        return res.json({
            statusCode: 400,
            statusValue: 'Bad Request',
            message: `El ID digitado no es válido: ${id}`
        });
    }
    ;
    if (isNaN(pricePerHour) || pricePerHour <= 0) {
        res.status(400).json({
            statusCode: 400,
            statusValue: 'Bad Request',
            message: `pricePerHour es requerido`
        });
    }
    ;
    if (fullname.trim().length === 0) {
        res.status(400).json({
            statusCode: 400,
            statusValue: 'Bad Request',
            message: `fullname es requerido`
        });
    }
    ;
    const esclavo = employee.find((e) => e.id === id);
    if (!esclavo) {
        return res.status(404).json({
            statusCode: 404,
            statusValue: 'Not Found',
            message: `El empleado con el id ${id} no existe.`
        });
    }
    ;
    esclavo.fullname = fullname;
    esclavo.pricePerHour = pricePerHour;
    res.status(201).json(esclavo);
});
//Eliminar usuario
app.delete('/employee/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);
    if (isNaN(id) || id <= 0 || id > employee.length) {
        return res.json({
            statusCode: 400,
            statusValue: 'Bad Request',
            message: `El ID digitado no es válido: ${id}`
        });
    }
    ;
    const esclavo = employee.find((e) => e.id === id);
    if (!esclavo) {
        return res.status(404).json({
            statusCode: 404,
            statusValue: 'Not Found',
            message: `El empleado con el id ${id} no existe.`
        });
    }
    ;
    const esclavoIndex = employee.findIndex((e) => e.id === id);
    employee.splice(esclavoIndex, 1);
    const horasIndex = workedHours.findIndex((w) => w.employeeId === id);
    workedHours.splice(horasIndex);
    res.status(201).json({
        statusCode: 201,
        statusValue: 'OK',
        message: `El usuario ha sido eliminado exitosamente.`
    });
});
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
//# sourceMappingURL=index.js.map