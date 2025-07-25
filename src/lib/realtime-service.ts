class RealTimeService {
  private static instance: RealTimeService;
  private ws: WebSocket | null = null;
  private subscribers: Map<string, Function[]> = new Map();

  static getInstance() {
    if (!RealTimeService.instance) {
      RealTimeService.instance = new RealTimeService();
    }
    return RealTimeService.instance;
  }

  connect() {
    if (typeof window === 'undefined') return;
    
    this.ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001');
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.notifySubscribers(data.type, data.payload);
    };
  }

  subscribe(type: string, callback: Function) {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, []);
    }
    this.subscribers.get(type)!.push(callback);
  }

  private notifySubscribers(type: string, data: any) {
    const callbacks = this.subscribers.get(type) || [];
    callbacks.forEach(callback => callback(data));
  }

  async fetchRealTimeData(endpoint: string) {
    const response = await fetch(`/api/realtime/${endpoint}`, {
      headers: { 'Cache-Control': 'no-cache' }
    });
    return response.json();
  }
}

export const realTimeService = RealTimeService.getInstance();