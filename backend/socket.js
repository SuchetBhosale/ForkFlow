let io;

module.exports = {
    setIO: (ioInstance) => {
        io = ioInstance;
    },
    getIO: () => {
        if (!io) throw new Error("socket.io not initialized");
        return io;
    }
}