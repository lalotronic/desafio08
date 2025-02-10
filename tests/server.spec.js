const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafes", () => {
  it("Verifica que la ruta GET /cafes retorne un código de estado 200 y que el cuerpo de la respuesta sea un arreglo con al menos un objeto", async () => {
    const response = await request(server).get("/cafes");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(typeof response.body[0]).toBe("object");
  });

  it("Verifica que se recibe un código de estado 404 al intentar eliminar un café con un ID inexistente.", async () => {
    const idNoExiste = 488;
    const response = await request(server)
      .delete(`/cafes/${idNoExiste}`)
      .set("Authorization", "Bearer token_valido");

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(`No se encontró ningún cafe con ese id`);
  });

  it("Verifica que la ruta POST /cafes agrega un nuevo café y retorna un código de estado 201", async () => {
    const newCafe = {
      id: Math.floor(Math.random() * 1000),
      nombre: "Nuevo café vitamina",
    };
    const response = await request(server).post("/cafes").send(newCafe);

    expect(response.statusCode).toBe(201);
    expect(response.body).toContainEqual(newCafe);
  });

  it("Verifica que la ruta PUT /cafes retorna un código de estado 400 si el ID en los parámetros difiere del ID en el payload.", async () => {
    const updateCoffe = { id: 1, nombre: "Capuccino Vainilla deslactosado" };
    const response = await request(server).put("/cafes/2").send(updateCoffe);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      `El id del parámetro no coincide con el id del café recibido`
    );
  });
});
