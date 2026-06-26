import { NextRequest, NextResponse } from "next/server";
import { findNetworkById, switchActiveNetwork } from "@/app/network-config-utils";
import { getStore, setStore } from "../_store";
import { successResponse, errorResponse, status } from '@/lib/api-response-utils';

/**
 * GET /api/networks/active
 * Returns the currently active network configuration.
 */
export async function GET() {
  const store = getStore();
  const network = findNetworkById(store, store.activeNetworkId);

  return successResponse({ network, activeNetworkId: store.activeNetworkId });
}

/**
 * PUT /api/networks/active
 * Switches the active network. Body: { id: string }
 */
export async function PUT(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body.", status.badRequest);
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).id !== "string"
  ) {
    return errorResponse(
      "Missing required field: id.",
      status.badRequest
    );
  }

  const { id } = body as { id: string };
  const store = getStore();
  const network = findNetworkById(store, id);

  if (!network) {
    return errorResponse("Network not found.", status.notFound);
  }

  const next = switchActiveNetwork(store, id);
  setStore(next);

  return successResponse({ activeNetworkId: next.activeNetworkId, network });
}
