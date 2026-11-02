const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.SOCKET_PORT || 4000;

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("eShop Socket.IO server is running.\n");
});

// Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for local dev
    methods: ["GET", "POST"],
  },
});

// Map of productId -> Set of socket IDs
const productRooms = new Map();

function getProductViewerCount(productId) {
  return productRooms.get(productId)?.size || 0;
}

function broadcastTotalUsers() {
  const total = io.engine.clientsCount;
  console.log(`[Socket.IO] Total active users online: ${total}`);
  io.emit("total_active_users", total);
}

io.on("connection", (socket) => {
  console.log(`[Socket.IO] Tab/Client connected: ${socket.id}`);
  broadcastTotalUsers();

  // When a user opens a product detail page
  socket.on("join_product", (productId) => {
    if (!productId) return;

    socket.join(`product:${productId}`);

    if (!productRooms.has(productId)) {
      productRooms.set(productId, new Set());
    }
    productRooms.get(productId).add(socket.id);

    const viewerCount = getProductViewerCount(productId);
    console.log(
      `[Socket.IO] ${socket.id} viewing product "${productId}". Exact count: ${viewerCount}`
    );

    // Broadcast exact viewer count to all clients viewing this product
    io.to(`product:${productId}`).emit("product_viewers_update", {
      productId,
      viewerCount,
    });
  });

  // When user navigates away from the product
  socket.on("leave_product", (productId) => {
    if (!productId) return;

    socket.leave(`product:${productId}`);

    if (productRooms.has(productId)) {
      const room = productRooms.get(productId);
      room.delete(socket.id);
      if (room.size === 0) {
        productRooms.delete(productId);
      }
    }

    const viewerCount = getProductViewerCount(productId);
    console.log(
      `[Socket.IO] ${socket.id} left product "${productId}". Exact count: ${viewerCount}`
    );

    io.to(`product:${productId}`).emit("product_viewers_update", {
      productId,
      viewerCount,
    });
  });

  // Clean up on tab close / disconnect
  socket.on("disconnect", () => {
    console.log(`[Socket.IO] Tab/Client disconnected: ${socket.id}`);

    // Remove socket from any product rooms
    for (const [productId, sockets] of productRooms.entries()) {
      if (sockets.has(socket.id)) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          productRooms.delete(productId);
        }

        const viewerCount = sockets.size;
        io.to(`product:${productId}`).emit("product_viewers_update", {
          productId,
          viewerCount,
        });
      }
    }

    broadcastTotalUsers();
  });
});

server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`⚡ eShop Socket.IO Server running on port ${PORT}`);
  console.log(`⚡ Tracking 100% exact real-time active tabs & viewers`);
  console.log(`===============================================`);
});
