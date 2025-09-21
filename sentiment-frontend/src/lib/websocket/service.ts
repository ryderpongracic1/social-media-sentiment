import { io, type Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  private readonly URL: string = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5142';

  public connect(): void {
    if (!this.socket) {
      this.socket = io(this.URL);

      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });

      this.socket.on('error', (error: Error) => {
        console.error('WebSocket error:', error);
      });
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public on<T = unknown>(event: string, callback: (data: T) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  public off<T = unknown>(event: string, callback?: (data: T) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  public emit(event: string, data: unknown): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

export const webSocketService = new WebSocketService();