const cors = require("cors"),
  jsonServer = require("json-server"),
  server = jsonServer.create(),
  router = jsonServer.router("db.json"),
  middlewares = jsonServer.defaults({
    static: "./public",
  });

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(cors());

server.delete("/api/hotels/all", async (_, res) => {
  await router.db.setState({ hotels: [] });
  res.sendStatus(200);
});

server.post("/api/hotels/bulkload", async ({ body: { hotels } }, res) => {
  await router.db.setState({ hotels });
  res.sendStatus(200);
});

server.get("/api/cities", (req, res) => {
  // const cities = ['Seattle', 'Burlingame'];
  const cities = [
    {
      id: "Seattle",
      name: "Seattle",
    },
    {
      id: "Chicago",
      name: "Chicago",
    },
    {
      id: "New York",
      name: "New York",
    },
    {
      id: "California",
      name: "California",
    },
    {
      id: "Burlingame",
      name: "Burlingame",
    },
  ];
  res.send(cities);
});

server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
  })
);

server.use(router);

const listener = server.listen(3000, () => {
  console.log(`JSON Server is running at port ${listener.address().port}`);
});
