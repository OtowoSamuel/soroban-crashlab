import { NextRequest, NextResponse } from "next/server";
import { findNetworkById, removeNetwork, switchActiveNetwork } from "@/app/network-config-utils";
import { getStore, setStore } from "../_store";
import { successResponse, errorResponse, status } from '@/lib/api-response-utils';

/**
 * DELETE /api/networks/[id]
 * Removes a custom network by ID.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const store = getStore();
  const network = findNetworkById(store, id);

  if (!network) {
    return errorResponse("Network not found.", status.notFound);
  }

  if (network.isBuiltIn) {
    return errorResponse(
      "Built-in networks cannot be deleted.",
      status.forbidden
    );
  }

  let next = removeNetwork(store, id);

  if (store.activeNetworkId === id) {
    next = switchActiveNetwork(next, "testnet");
  }

  setStore(next);

  return successResponse({ success: true, deletedId: id });
}
