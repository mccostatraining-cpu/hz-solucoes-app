import { realtimeSync } from './websocket';

/**
 * Helper para emitir eventos de sincronização em tempo real
 * Deve ser chamado após operações de banco de dados que modificam dados
 */

export const realtimeEvents = {
  // Eventos de Despesas
  expenseCreated: (householdId: string, expense: any) => {
    realtimeSync.notifyHousehold(householdId, 'expense.created', expense);
  },

  expenseUpdated: (householdId: string, expense: any) => {
    realtimeSync.notifyHousehold(householdId, 'expense.updated', expense);
  },

  expenseDeleted: (householdId: string, expenseId: string) => {
    realtimeSync.notifyHousehold(householdId, 'expense.deleted', { id: expenseId });
  },

  // Eventos de Despesas Fixas
  fixedExpenseCreated: (householdId: string, expense: any) => {
    realtimeSync.notifyHousehold(householdId, 'fixedExpense.created', expense);
  },

  fixedExpenseUpdated: (householdId: string, expense: any) => {
    realtimeSync.notifyHousehold(householdId, 'fixedExpense.updated', expense);
  },

  fixedExpenseDeleted: (householdId: string, expenseId: string) => {
    realtimeSync.notifyHousehold(householdId, 'fixedExpense.deleted', { id: expenseId });
  },

  // Eventos de Faturamento
  revenueCreated: (householdId: string, revenue: any) => {
    realtimeSync.notifyHousehold(householdId, 'revenue.created', revenue);
  },

  revenueUpdated: (householdId: string, revenue: any) => {
    realtimeSync.notifyHousehold(householdId, 'revenue.updated', revenue);
  },

  revenueDeleted: (householdId: string, revenueId: string) => {
    realtimeSync.notifyHousehold(householdId, 'revenue.deleted', { id: revenueId });
  },

  // Eventos de Projetos/Metas
  projectCreated: (householdId: string, project: any) => {
    realtimeSync.notifyHousehold(householdId, 'project.created', project);
  },

  projectUpdated: (householdId: string, project: any) => {
    realtimeSync.notifyHousehold(householdId, 'project.updated', project);
  },

  projectDeleted: (householdId: string, projectId: string) => {
    realtimeSync.notifyHousehold(householdId, 'project.deleted', { id: projectId });
  },

  // Eventos de Itens
  itemCreated: (householdId: string, item: any) => {
    realtimeSync.notifyHousehold(householdId, 'item.created', item);
  },

  itemUpdated: (householdId: string, item: any) => {
    realtimeSync.notifyHousehold(householdId, 'item.updated', item);
  },

  itemDeleted: (householdId: string, itemId: string) => {
    realtimeSync.notifyHousehold(householdId, 'item.deleted', { id: itemId });
  },

  // Eventos de Categorias
  categoryCreated: (householdId: string, category: any) => {
    realtimeSync.notifyHousehold(householdId, 'category.created', category);
  },

  categoryUpdated: (householdId: string, category: any) => {
    realtimeSync.notifyHousehold(householdId, 'category.updated', category);
  },

  categoryDeleted: (householdId: string, categoryId: string) => {
    realtimeSync.notifyHousehold(householdId, 'category.deleted', { id: categoryId });
  },

  // Notificações para usuários específicos
  notifyUser: (userId: string, title: string, message: string, data?: any) => {
    realtimeSync.notifyUser(userId, 'notification', {
      title,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  },

  // Notificar sobre mensagem do WhatsApp
  whatsappMessageReceived: (householdId: string, from: string, message: string) => {
    realtimeSync.notifyHousehold(householdId, 'whatsapp.message', {
      from,
      message,
      timestamp: new Date().toISOString()
    });
  },

  // Notificar sobre comando WhatsApp processado
  whatsappCommandProcessed: (householdId: string, command: string, result: any) => {
    realtimeSync.notifyHousehold(householdId, 'whatsapp.command', {
      command,
      result,
      timestamp: new Date().toISOString()
    });
  }
};
