const request = require("supertest");
const app = require("../src/app"); // Asegúrate de que la ruta sea correcta

// Pruebas para la ruta GET /
describe("GET /", () => {
  it("Debe retornar login.html", async () => {
    const res = await request(app).get("/"); // Realiza la solicitud GET
    expect(res.statusCode).toEqual(200); // Verifica que el estado sea 200
    expect(res.headers["content-type"]).toContain("text/html"); // Verifica el tipo de contenido
  });
});

// Pruebas para rutas protegidas
describe("Protected Routes", () => {
  it("Debe retornar 401 para /user sin token", async () => {
    const res = await request(app).get("/user"); // Solicitud sin token
    expect(res.statusCode).toEqual(401); // Verifica que el estado sea 401
  });

  it("Debe retornar 401 para /pago sin token", async () => {
    const res = await request(app).get("/pago");
    expect(res.statusCode).toEqual(401);
  });

  it("Debe retornar 401 para /usuario sin token", async () => {
    const res = await request(app).get("/usuario");
    expect(res.statusCode).toEqual(401);
  });

  it("Debe retornar 401 para /uploads sin token", async () => {
    const res = await request(app).get("/uploads");
    expect(res.statusCode).toEqual(401);
  });

  it("Debe retornar 401 para /usuarioAdmin sin token", async () => {
    const res = await request(app).get("/usuarioAdmin");
    expect(res.statusCode).toEqual(401);
  });
});

// Pruebas para la ruta POST /auth
describe("POST /auth", () => {
  it("debe retornar 200 y un token válido", async () => {
    const res = await request(app).post("/auth").send({
      nombre: "DavidLopez",
      password: "728910",
    });
    expect(res.statusCode).toEqual(200); // Verifica que el estado sea 200
    expect(res.body).toHaveProperty("accessToken"); // Verifica que se retorne un token
  });

  it("Debe retornar 401 para login inválido", async () => {
    const res = await request(app).post("/auth").send({
      nombre: "usuarioNoValid",
      password: "PasswordNoValido",
    });
    expect(res.statusCode).toEqual(401); // Verifica que el estado sea 401
  });
});

// Pruebas para la carga de archivos
describe("File Upload", () => {
  let token; // Variable para almacenar el token

  beforeAll(async () => {
    // Obtiene un token válido antes de las pruebas de carga
    const res = await request(app).post("/auth").send({
      nombre: "DavidLopez",
      password: "728910",
    });
    token = res.body.accessToken; // Guarda el token obtenido
  });

  it("Debe retornar 401 para /uploads sin token", async () => {
    const res = await request(app)
      .post("/uploads")
      .attach("file", "tp2-sistgestion-backend.pdf");
    expect(res.statusCode).toEqual(401); // Verifica que el estado sea 401
  });

  it("Debe cargar un archivo con token válido", async () => {
    const res = await request(app)
      .post("/uploads")
      .set("Authorization", `Bearer ${token}`) // Establece el token en la cabecera
      .attach("file", "tp2-sistgestion-backend.pdf"); // Adjunta el archivo
    expect(res.statusCode).toEqual(200); // Verifica que el estado sea 200
  });
});
