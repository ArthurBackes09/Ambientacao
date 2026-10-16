import express from "express";
import {
    listarLanches,
    buscarLanchePorId,
    cadastrarLanche,
    atualizarLanche,
    excluirLanche
} from "../controllers/lanchesController.js";

const router = express.Router();

router.get("/", listarLanches);
router.post("/", cadastrarLanche);
router.get("/:id", buscarLanchePorId);
router.put("/:id", atualizarLanche);
router.delete("/:id", excluirLanche);

export default router;
