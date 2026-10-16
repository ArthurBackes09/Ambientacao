import cors from "cors";

const corsMiddlewares = cors({
    origin: [
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://localhost:5500"
    ]
});

export default corsMiddlewares;
