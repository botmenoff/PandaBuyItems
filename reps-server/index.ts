import { connectDB } from "./config/database";

async function startServer() {
    await connectDB(); // Conectar a MongoDB antes de iniciar el servidor
    const server = Bun.serve({
        port: Number(process.env.PORT),
        fetch(req) {
            const url = new URL(req.url);
            // Redirigir solo si es la ruta raíz "/"
            if (url.pathname === "/") {
                return Response.redirect("http://localhost:8081", 302);
            }

            return new Response("Bun Server!");
        },
    });

    console.log(`🚀 Servidor corriendo en http://localhost:${server.port}`);
}

startServer()