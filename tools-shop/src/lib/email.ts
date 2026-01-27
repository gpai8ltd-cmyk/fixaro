import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const SHOP_EMAIL = 'fixaroshop@gmail.com';
const FROM_EMAIL = 'Fixaro <onboarding@resend.dev>'; // Use verified domain in production

interface OrderItem {
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
}

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  deliveryCity: string;
  deliveryAddress: string;
  courier: string;
  courierOffice: string | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
  notes: string | null;
  items: OrderItem[];
}

export async function sendOrderNotification(order: OrderEmailData) {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.productName}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.productPrice.toFixed(2)} лв.</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.subtotal.toFixed(2)} лв.</td>
      </tr>
    `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Нова поръчка - ${order.orderNumber}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Нова поръчка!</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px;">${order.orderNumber}</p>
      </div>

      <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 18px; border-bottom: 2px solid #f97316; padding-bottom: 10px;">Данни на клиента</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; width: 140px;">Име:</td>
            <td style="padding: 8px 0; font-weight: 600;">${order.customerName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Телефон:</td>
            <td style="padding: 8px 0; font-weight: 600;">
              <a href="tel:${order.customerPhone}" style="color: #f97316; text-decoration: none;">${order.customerPhone}</a>
            </td>
          </tr>
          ${order.customerEmail ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Имейл:</td>
            <td style="padding: 8px 0;">${order.customerEmail}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Град:</td>
            <td style="padding: 8px 0;">${order.deliveryCity}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Адрес/Офис:</td>
            <td style="padding: 8px 0;">${order.deliveryAddress}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Куриер:</td>
            <td style="padding: 8px 0; font-weight: 600;">${order.courier}</td>
          </tr>
        </table>

        ${order.notes ? `
        <div style="margin-top: 15px; padding: 12px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
          <strong style="color: #92400e;">Бележка:</strong>
          <p style="margin: 5px 0 0 0; color: #78350f;">${order.notes}</p>
        </div>
        ` : ''}

        <h2 style="color: #1f2937; margin: 30px 0 20px 0; font-size: 18px; border-bottom: 2px solid #f97316; padding-bottom: 10px;">Продукти</h2>
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 12px; text-align: left; font-weight: 600;">Продукт</th>
              <th style="padding: 12px; text-align: center; font-weight: 600;">Бр.</th>
              <th style="padding: 12px; text-align: right; font-weight: 600;">Цена</th>
              <th style="padding: 12px; text-align: right; font-weight: 600;">Общо</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top: 20px; padding: 20px; background: white; border-radius: 8px;">
          <table style="width: 100%;">
            <tr>
              <td style="padding: 5px 0; color: #6b7280;">Междинна сума:</td>
              <td style="padding: 5px 0; text-align: right;">${order.subtotal.toFixed(2)} лв.</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #6b7280;">Доставка:</td>
              <td style="padding: 5px 0; text-align: right;">${order.deliveryFee === 0 ? 'Безплатна' : order.deliveryFee.toFixed(2) + ' лв.'}</td>
            </tr>
            <tr style="font-size: 20px; font-weight: bold;">
              <td style="padding: 15px 0 5px 0; border-top: 2px solid #e5e7eb;">ОБЩО:</td>
              <td style="padding: 15px 0 5px 0; border-top: 2px solid #e5e7eb; text-align: right; color: #f97316;">${order.total.toFixed(2)} лв.</td>
            </tr>
          </table>
        </div>
      </div>

      <div style="background: #1e293b; padding: 20px; border-radius: 0 0 12px 12px; text-align: center;">
        <p style="color: #94a3b8; margin: 0; font-size: 14px;">Fixaro - Качествени инструменти</p>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: SHOP_EMAIL,
      subject: `Нова поръчка ${order.orderNumber} - ${order.customerName}`,
      html,
    });

    if (error) {
      console.error('Error sending order notification email:', error);
      return { success: false, error };
    }

    console.log('Order notification email sent:', data?.id);
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Error sending order notification email:', error);
    return { success: false, error };
  }
}
