export const taskCreatedTemplate = (title: string, description: string, dueDate: string): string => `
  <div style="
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      background: #f9f9f9;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #ddd;
  ">
    <div style="background: #4f46e5; color: white; padding: 16px 24px;">
      <h2 style="margin: 0;">📋 Nova tarefa criada</h2>
    </div>
    <div style="padding: 24px;">
      <h3 style="color: #333; margin-top: 0;">${title}</h3>
      <p style="font-size: 15px; color: #555;">${description}</p>
      <p style="font-size: 14px; color: #666;">📅 <b>Prazo:</b> ${new Date(dueDate).toLocaleDateString()}</p>
    </div>
    <div style="background: #f3f4f6; padding: 12px 24px; text-align: center; color: #777; font-size: 13px;">
      Enviado automaticamente pelo sistema SmartTasksManagement © ${new Date().getFullYear()}
    </div>
  </div>
`;
