import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface RealtimeSyncOptions {
  userId?: string;
  householdId?: string;
  onUpdate?: (event: string, data: any) => void;
  onNotification?: (event: string, data: any) => void;
}

export function useRealtimeSync(options: RealtimeSyncOptions = {}) {
  const { userId, householdId, onUpdate, onNotification } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const queryClient = useQueryClient();

  const connect = useCallback(() => {
    // Determinar URL do WebSocket baseado no ambiente
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws`;

    console.log('[RealtimeSync] Conectando ao WebSocket:', wsUrl);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('[RealtimeSync] Conectado ao servidor');
      setIsConnected(true);

      // Autenticar se temos userId e householdId
      if (userId && householdId) {
        ws.send(JSON.stringify({
          type: 'authenticate',
          userId,
          householdId
        }));
      }

      // Enviar ping a cada 30 segundos para manter conexão viva
      const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping' }));
        }
      }, 30000);

      // Limpar intervalo quando desconectar
      ws.addEventListener('close', () => clearInterval(pingInterval));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case 'connected':
            console.log('[RealtimeSync]', message.message);
            break;

          case 'update':
            // Atualização de dados - invalidar queries relevantes
            console.log('[RealtimeSync] Atualização recebida:', message.event);
            handleUpdate(message.event, message.data);
            setLastUpdate(new Date(message.timestamp));
            if (onUpdate) onUpdate(message.event, message.data);
            break;

          case 'notification':
            // Notificação para o usuário
            console.log('[RealtimeSync] Notificação recebida:', message.event);
            if (onNotification) onNotification(message.event, message.data);
            break;

          case 'broadcast':
            // Mensagem broadcast
            console.log('[RealtimeSync] Broadcast recebido:', message.event);
            handleUpdate(message.event, message.data);
            break;

          case 'pong':
            // Resposta ao ping
            break;

          default:
            console.log('[RealtimeSync] Mensagem desconhecida:', message.type);
        }
      } catch (error) {
        console.error('[RealtimeSync] Erro ao processar mensagem:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('[RealtimeSync] Erro no WebSocket:', error);
    };

    ws.onclose = () => {
      console.log('[RealtimeSync] Desconectado do servidor');
      setIsConnected(false);
      wsRef.current = null;

      // Tentar reconectar após 3 segundos
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('[RealtimeSync] Tentando reconectar...');
        connect();
      }, 3000);
    };
  }, [userId, householdId, onUpdate, onNotification]);

  const handleUpdate = (event: string, data: any) => {
    // Invalidar queries do React Query baseado no tipo de evento
    switch (event) {
      case 'expense.created':
      case 'expense.updated':
      case 'expense.deleted':
        queryClient.invalidateQueries({ queryKey: ['expenses'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        break;

      case 'fixedExpense.created':
      case 'fixedExpense.updated':
      case 'fixedExpense.deleted':
        queryClient.invalidateQueries({ queryKey: ['fixedExpenses'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        break;

      case 'revenue.created':
      case 'revenue.updated':
      case 'revenue.deleted':
        queryClient.invalidateQueries({ queryKey: ['revenue'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        break;

      case 'project.created':
      case 'project.updated':
      case 'project.deleted':
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        break;

      case 'item.created':
      case 'item.updated':
      case 'item.deleted':
        queryClient.invalidateQueries({ queryKey: ['items'] });
        break;

      case 'category.created':
      case 'category.updated':
      case 'category.deleted':
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        break;

      default:
        // Invalidar tudo se não soubermos o tipo específico
        queryClient.invalidateQueries();
    }
  };

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected,
    lastUpdate,
    disconnect,
    reconnect: connect
  };
}
