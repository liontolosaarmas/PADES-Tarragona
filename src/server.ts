import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';

interface PadesPatient {
  id: number;
  nombre: string;
  paciente: string;
  razon?: string;
  descripcion?: string;
  municipio: string;
  activo: boolean;
}

const browserDistFolder = join(import.meta.dirname, '../browser');
const patientsJsonPath = join(process.cwd(), 'public/data/pades-patients.json');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());

const defaultPatients: PadesPatient[] = [
  {
    id: 1,
    nombre: 'PADES Tarragona',
    paciente: 'Maria Soler',
    razon: 'Control de dolor cronico',
    descripcion: 'Control del dolor y seguimiento semanal domiciliario.',
    municipio: 'Tarragona',
    activo: true,
  },
];

const isValidPatient = (value: unknown): value is PadesPatient => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate['id'] === 'number' &&
    typeof candidate['nombre'] === 'string' &&
    typeof candidate['paciente'] === 'string' &&
    (typeof candidate['razon'] === 'string' || typeof candidate['razon'] === 'undefined') &&
    (typeof candidate['descripcion'] === 'string' || typeof candidate['descripcion'] === 'undefined') &&
    typeof candidate['municipio'] === 'string' &&
    typeof candidate['activo'] === 'boolean'
  );
};

const readPatients = async (): Promise<PadesPatient[]> => {
  try {
    const raw = await readFile(patientsJsonPath, 'utf-8');
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return defaultPatients;
    }

    const patients = parsed.filter(isValidPatient);
    return patients.length > 0 ? patients : defaultPatients;
  } catch {
    await writePatients(defaultPatients);
    return defaultPatients;
  }
};

const writePatients = async (patients: PadesPatient[]): Promise<void> => {
  await writeFile(patientsJsonPath, JSON.stringify(patients, null, 2), 'utf-8');
};

app.get('/api/pades-patients', async (_req, res) => {
  const patients = await readPatients();
  res.json(patients);
});

app.post('/api/pades-patients', async (req, res) => {
  const paciente = typeof req.body?.paciente === 'string' ? req.body.paciente.trim() : '';
  const razon = typeof req.body?.razon === 'string' ? req.body.razon.trim() : '';
  const descripcion = typeof req.body?.descripcion === 'string' ? req.body.descripcion.trim() : '';
  if (!paciente || !razon) {
    res.status(400).json({ message: 'Nombre y razon son obligatorios.' });
    return;
  }

  const currentPatients = await readPatients();
  const nextId = currentPatients.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;

  const newPatient: PadesPatient = {
    id: nextId,
    nombre: 'PADES Tarragona',
    paciente,
    razon,
    descripcion,
    municipio: 'Tarragona',
    activo: true,
  };

  const updatedPatients = [...currentPatients, newPatient];
  await writePatients(updatedPatients);
  res.status(201).json(newPatient);
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
