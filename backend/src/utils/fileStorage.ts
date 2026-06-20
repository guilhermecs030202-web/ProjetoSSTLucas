import path from "path";
import fs from "fs";
import { uploadDir } from "../config/multer";

export function getAbsoluteFilePath(savedPath: string): string {
    if (!savedPath) return "";
    // Se for um caminho absoluto válido e existente (compatibilidade com registros antigos)
    if (path.isAbsolute(savedPath) && fs.existsSync(savedPath)) {
        return savedPath;
    }
    // Caso contrário, resolve relativo ao diretório de uploads usando apenas o nome do arquivo
    return path.resolve(uploadDir, path.basename(savedPath));
}

export function deleteFileIfExists(savedPath: string): void {
    const fullPath = getAbsoluteFilePath(savedPath);
    if (fullPath && fs.existsSync(fullPath)) {
        try {
            fs.unlinkSync(fullPath);
        } catch (error) {
            console.error(`Erro ao deletar arquivo em ${fullPath}:`, error);
        }
    }
}
