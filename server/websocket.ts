import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

interface ClientConnection {
  ws: WebSocket;
  userId?: string;
  householdId?: string;
}

class RealtimeSync {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, ClientConnection> = new Map();

  initialize(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });

    this.wss.on('connection', (ws: WebSocket) => {
      const clientId = this.generateClientId();
      const client: ClientConnection = { ws };
      this.clients.set(clientId, client);

      console.log(`[WebSocket] Cliente conectado: ${clientId}`);

      // Mensagem de boas-vindas
      ws.send(JSON.stringify({
        type: 'connected',
        message: 'Conectado ao servidor de sincronização em tempo real',
        clientId
      }));

      // Receber mensagens do cliente
      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(clientId, message);
        } catch (error) {
          console.error('[WebSocket] Erro ao processar mensagem:', error);
        }
      });

      // Cliente desconectou
      ws.on('close', () => {
        console.log(`[WebSocket] Cliente desconectado: ${clientId}`);
        this.clients.delete(clientId);
      });

      // Erro na conexão
      ws.on('error', (error) => {
        console.error(`[WebSocket] Erro no cliente ${clientId}:`, error);
      });
    });

    console.log('[WebSocket] Servidor WebSocket inicializado em /ws');
  }

  private handleClientMessage(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (!client) return;

    switch (message.type) {
      case 'authenticate':
        // Autenticar cliente com userId e householdId
        client.userId = message.userId;
        client.householdId = message.householdId;
        console.log(`[WebSocket] Cliente ${clientId} autenticado: user=${message.userId}, household=${message.householdId}`);
        break;

      case 'ping':
        // Responder ao ping para manter conexão viva
        client.ws.send(JSON.stringify({ type: 'pong' }));
        break;

      default:
        console.log(`[WebSocket] Mensagem desconhecida de ${clientId}:`, message.type);
    }
  }

  // Notificar todos os clientes de um household sobre uma mudança
  notifyHousehold(householdId: string, event: string, data: any) {
    let notifiedCount = 0;

    this.clients.forEach((client) => {
      if (client.householdId === householdId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify({
          type: 'update',
          event,
          data,
          timestamp: new Date().toISOString()
        }));
        notifiedCount++;
      }
    });

    if (notifiedCount > 0) {
      console.log(`[WebSocket] Notificados ${notifiedCount} clientes do household ${householdId} sobre: ${event}`);
    }
  }

  // Notificar um usuário específico
  notifyUser(userId: string, event: string, data: any) {
    let notifiedCount = 0;

    this.clients.forEach((client) => {
      if (client.userId === userId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify({
          type: 'notification',
          event,
          data,
          timestamp: new Date().toISOString()
        }));
        notifiedCount++;
      }
    });

    if (notifiedCount > 0) {
      console.log(`[WebSocket] Notificado usuário ${userId} sobre: ${event}`);
    }
  }

  // Broadcast para todos os clientes conectados
  broadcast(event: string, data: any) {
    const message = JSON.stringify({
      type: 'broadcast',
      event,
      data,
      timestamp: new Date().toISOString()
    });

    let sentCount = 0;
    this.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(message);
        sentCount++;
      }
    });

    console.log(`[WebSocket] Broadcast enviado para ${sentCount} clientes: ${event}`);
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Obter estatísticas de conexões
  getStats() {
    const stats = {
      totalClients: this.clients.size,
      authenticatedClients: 0,
      households: new Set<string>()
    };

    this.clients.forEach((client) => {
      if (client.userId) stats.authenticatedClients++;
      if (client.householdId) stats.households.add(client.householdId);
    });

    return {
      ...stats,
      uniqueHouseholds: stats.households.size
    };
  }
}

// Exportar instância singleton
export const realtimeSync = new RealtimeSync();
