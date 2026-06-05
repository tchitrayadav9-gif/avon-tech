const dbClient = require('../database/dbClient');

// @desc    Process chatbot prompt
// @route   POST /api/ai/chat
// @access  Private
exports.chatWithAI = async (req, res) => {
  const { message } = req.body;
  const user = req.user;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Message prompt is required' });
  }

  const msgLower = message.toLowerCase().trim();

  try {
    let reply = '';
    let suggestions = [];

    // Helper: format lists
    const makeBullet = (str) => `• ${str}\n`;

    // 1. Projects Lookup
    if (msgLower.includes('project') || msgLower.includes('projects') || msgLower.includes('my work') || msgLower.includes('status')) {
      let filter = {};
      if (user.role === 'employee') {
        filter.team = user._id || user.id;
      } else if (user.role === 'client') {
        filter.client = user._id || user.id;
      }

      const projectsResult = await dbClient.projects.find(filter);
      const projects = Array.isArray(projectsResult) ? projectsResult : projectsResult.data;

      if (projects.length === 0) {
        reply = `I couldn't find any projects associated with your profile, ${user.name}. If you believe this is an error, please contact the Admin at admin@avon.com.`;
      } else {
        reply = `Hello ${user.name}! Here is the live status of the projects under your account:\n\n`;
        projects.forEach(p => {
          reply += `**${p.name}**\n`;
          reply += `   *Type:* ${p.projectType}\n`;
          reply += `   *Status:* ${p.status}\n`;
          reply += `   *Progress:* ${p.progress}%\n`;
          reply += `   *Timeline:* ${new Date(p.startDate).toLocaleDateString()} to ${new Date(p.endDate).toLocaleDateString()}\n\n`;
        });
      }
      suggestions = ['Show my support tickets', 'What services does Avon offer?', 'How do I raise a ticket?'];
    }
    
    // 2. Tickets Lookup
    else if (msgLower.includes('ticket') || msgLower.includes('tickets') || msgLower.includes('support') || msgLower.includes('help')) {
      let filter = {};
      if (user.role === 'client') {
        filter.raisedBy = user._id || user.id;
      } else if (user.role === 'employee') {
        filter.assignedTo = user._id || user.id;
      }

      const ticketsResult = await dbClient.tickets.find(filter);
      const tickets = Array.isArray(ticketsResult) ? ticketsResult : ticketsResult.data;

      if (tickets.length === 0) {
        reply = `There are currently no active support tickets filed under your account, ${user.name}.`;
        if (user.role === 'client') {
          reply += ` You can raise a support ticket by navigating to the Support Tickets page and clicking "Raise Ticket".`;
        }
      } else {
        reply = `Here is the current status of support tickets for your account:\n\n`;
        tickets.forEach(t => {
          reply += `**Ticket ${t.ticketId}: ${t.title}**\n`;
          reply += `   *Status:* ${t.status}\n`;
          reply += `   *Priority:* ${t.priority}\n`;
          reply += `   *Updated:* ${new Date(t.updatedAt).toLocaleDateString()}\n\n`;
        });
      }
      suggestions = ['Check my projects', 'What is the ticket resolution process?', 'Contact information'];
    }

    // 3. Avon Services Info
    else if (msgLower.includes('service') || msgLower.includes('services') || msgLower.includes('offerings') || msgLower.includes('specialties')) {
      reply = `**Avon Technologies (India) Pvt. Ltd.** specializes in standard enterprise software solutions, including:\n\n` +
        makeBullet(`**Enterprise Software Solutions**: Customized systems for logistics, retail, finance, and industrial scales.`) +
        makeBullet(`**Web Development Services**: Responsive, high-performance web applications built on React and Node.js.`) +
        makeBullet(`**Mobile Application Solutions**: Native and cross-platform applications for iOS and Android.`) +
        makeBullet(`**CRM Solutions**: Dedicated platforms for client retention, analytics, and marketing automations.`) +
        makeBullet(`**ERP / BaaN Services**: Deep integration consulting and support for resource planners and ERP databases.`) +
        makeBullet(`**Business Intelligence (BI) Tools**: Advanced data reports, charting, and business metrics analytics.`) +
        makeBullet(`**Cloud Portals**: Highly secure intranet portals and collaboration workspaces.`) +
        makeBullet(`**Technical Consulting & Support**: 24/7 client systems monitoring and bug resolution.`);
      
      suggestions = ['Where is Avon located?', 'How do I contact support?', 'Check my project status'];
    }

    // 4. Contact / Location Info
    else if (msgLower.includes('location') || msgLower.includes('address') || msgLower.includes('contact') || msgLower.includes('office') || msgLower.includes('phone') || msgLower.includes('email')) {
      reply = `**Avon Technologies (India) Pvt. Ltd.**\n` +
        `* **Headquarters:** HITEC City, Hyderabad, Telangana, India - 500081.\n` +
        `* **General Queries:** contact@avontech.com | +91 40 4433 2211\n` +
        `* **Support Helpdesk:** support@avontech.com | Toll-Free: 1800-425-AVON (2866)\n` +
        `* **HR Operations:** hr@avontech.com\n\n` +
        `Our office operates Monday through Friday, 9:00 AM to 6:00 PM IST. Support services are online 24/7.`;
      
      suggestions = ['What services does Avon offer?', 'Check my project status', 'Raise a ticket'];
    }

    // 5. Help / Raise Tickets Process
    else if (msgLower.includes('how to raise') || msgLower.includes('how do i raise') || msgLower.includes('create ticket') || msgLower.includes('resolution process')) {
      reply = `**Ticket Resolution Process at Avon Technologies:**\n\n` +
        `1. **Create:** Navigate to the Support Tickets page on your dashboard and click the **"Raise Ticket"** button.\n` +
        `2. **Detail:** Fill in the ticket title, descriptive issue text, and select the priority level (Low, Medium, High, Critical).\n` +
        `3. **Assign:** The system routes the ticket to the support queue. Admins assign it to the respective QA or Backend development team.\n` +
        `4. **Updates:** You can chat directly inside the ticket comments thread for updates.\n` +
        `5. **Resolution:** Once resolved, the status is set to "Resolved". Clients can verify and mark the issue closed.`;
      
      suggestions = ['Show my support tickets', 'Check my projects', 'Contact information'];
    }

    // Default Fallback
    else {
      reply = `Hi there! I am the **Avon Smart Enterprise AI Assistant**.\n\n` +
        `I can help you navigate operations and query real-time database details. Try asking me:\n` +
        makeBullet(`"Show my project status"`) +
        makeBullet(`"What is the status of my support tickets?"`) +
        makeBullet(`"What services does Avon Technologies provide?"`) +
        makeBullet(`"How do I raise a ticket?"`) +
        makeBullet(`"Show Avon contact information and office address"`);
      
      if (user.role === 'admin') {
        suggestions = ['Check my projects', 'What services does Avon offer?', 'Contact information'];
      } else if (user.role === 'client') {
        suggestions = ['How do I raise a ticket?', 'What services does Avon offer?', 'Check my projects'];
      } else {
        suggestions = ['Check my projects', 'Show my support tickets', 'Contact information'];
      }
    }

    res.json({
      success: true,
      reply,
      suggestions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
