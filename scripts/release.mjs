import {verifyInstitutional} from './verify-institutional.mjs';
const report=verifyInstitutional('dist');console.log(`Artefacto institucional apto: ${report.checks} comprobaciones. No incluye biblioteca ni archivos sanitarios. Publicación externa pendiente de autorización.`);
