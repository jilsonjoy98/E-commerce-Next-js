"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

let socketInstance: Socket | null = null;

export function getSocket(): Socket {
  if (!socketInstance && typeof window !== "undefined") {
    socketInstance = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      transports: ["websocket", "polling"],
    });
  }
  return socketInstance!;
}

/**
 * Hook to track live active viewers for a specific product.
 * Returns the exact number of connected tabs/users viewing this product.
 */
export function useProductViewers(productId: string) {
  const [viewerCount, setViewerCount] = useState<number>(1);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const isJoinedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!productId || typeof window === "undefined") return;

    const socket = getSocket();

    const handleConnect = () => {
      setIsConnected(true);
      socket.emit("join_product", productId);
      isJoinedRef.current = true;
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      isJoinedRef.current = false;
    };

    const handleViewersUpdate = (data: {
      productId: string;
      viewerCount: number;
    }) => {
      if (data.productId === productId) {
        setViewerCount(Math.max(1, data.viewerCount));
      }
    };

    // If socket is already connected, emit immediately
    if (socket.connected) {
      setIsConnected(true);
      socket.emit("join_product", productId);
      isJoinedRef.current = true;
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("product_viewers_update", handleViewersUpdate);

    return () => {
      if (socket.connected && isJoinedRef.current) {
        socket.emit("leave_product", productId);
        isJoinedRef.current = false;
      }
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("product_viewers_update", handleViewersUpdate);
    };
  }, [productId]);

  return { viewerCount, isConnected };
}

/**
 * Hook to track total active shoppers across the whole store.
 * Returns the exact number of open tabs connected to the server.
 */
export function useTotalActiveUsers() {
  const [activeUsers, setActiveUsers] = useState<number>(1);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const socket = getSocket();

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    const handleUpdate = (total: number) => {
      setActiveUsers(Math.max(1, total));
    };

    if (socket.connected) {
      setIsConnected(true);
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("total_active_users", handleUpdate);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("total_active_users", handleUpdate);
    };
  }, []);

  return { activeUsers, isConnected };
}
