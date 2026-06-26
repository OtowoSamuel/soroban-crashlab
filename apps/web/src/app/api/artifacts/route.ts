import { NextResponse } from 'next/server';
import { listArtifactMetadata, saveArtifact } from '@/lib/artifact-fs-adapter';
import { logger } from '@/lib/logger';
import { successResponse, errorResponse, createdResponse, status } from '@/lib/api-response-utils';

/**
 * GET /api/artifacts
 * Lists all artifacts from CRASHLAB_ARTIFACT_DIR
 */
export async function GET() {
  try {
    const artifacts = await listArtifactMetadata();

    return successResponse({ artifacts }, { total: artifacts.length });
  } catch (error) {
    logger.error('GET /api/artifacts failed', { error });
    return errorResponse('Failed to list artifacts', status.internalError);
  }
}

/**
 * POST /api/artifacts
 * Stores an uploaded artifact in CRASHLAB_ARTIFACT_DIR (or temp dir).
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return errorResponse('file is required', status.badRequest);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await saveArtifact(file.name, buffer);
    return createdResponse({ artifact: metadata });
  } catch (error) {
    logger.error('POST /api/artifacts failed', { error });
    return errorResponse('Failed to upload artifact', status.internalError);
  }
}
