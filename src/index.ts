import { Hono } from "hono";
import { register } from "./metrics";
import { loggingMiddleware } from "./middlewares/logging";

const app = new Hono();
app.use("*", loggingMiddleware);

app.get("/metrics", async (c) => {
    return c.text(await register.metrics());
});

interface Todo {
    id: string;
    title: string;
    completed: boolean;
}

const todos: Todo[] = [];

app.post("/todos", async (c) => {
    const body = await c.req.json();
    const todo: Todo = {
        id: Date.now().toString(),
        title: body.title,
        completed: false,
    };
    todos.push(todo);
    return c.json(todo, 201);
});

app.get("/todos", (c) => {
    return c.json(todos);
});

app.get("/todos/:id", (c) => {
    const todo = todos.find((t) => t.id === c.req.param("id"));
    if (!todo) return c.json({ message: "Not found" }, 404);
    return c.json(todo);
});

app.put("/todos/:id", async (c) => {
    const todo = todos.find((t) => t.id === c.req.param("id"));
    if (!todo) return c.json({ message: "Not found" }, 404);

    const body = await c.req.json();
    Object.assign(todo, body);
    return c.json(todo);
});

app.delete("/todos/:id", (c) => {
    const index = todos.findIndex((t) => t.id === c.req.param("id"));
    if (index === -1) return c.json({ message: "Not found" }, 404);

    todos.splice(index, 1);
    return c.json({ message: "Deleted" });
});

export default {
    port: 3001,
    fetch: app.fetch,
};
