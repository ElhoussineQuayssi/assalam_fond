// Seed script for comments and messages
// Run this script to populate the database with sample data

const sampleComments = [
  {
    content: "This is a great blog post! I really enjoyed reading about the organization's work in the community.",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    post_id: "e794a4b2-3499-41d5-9538-7e057fe6bba6",
    status: "approved"
  },
  {
    content: "I'd love to volunteer for your next project. Please let me know how I can help!",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    post_id: "e794a4b2-3499-41d5-9538-7e057fe6bba6",
    status: "pending"
  },
  {
    content: "Amazing work! This organization is making a real difference in people's lives.",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    post_id: "e794a4b2-3499-41d5-9538-7e057fe6bba6",
    status: "approved"
  },
  {
    content: "Could you provide more information about your education programs?",
    name: "David Kim",
    email: "david.kim@email.com",
    post_id: "e794a4b2-3499-41d5-9538-7e057fe6bba6",
    status: "pending"
  },
  {
    content: "I disagree with some points mentioned in this article.",
    name: "Anonymous User",
    email: "anonymous@email.com",
    post_id: "e794a4b2-3499-41d5-9538-7e057fe6bba6",
    status: "rejected"
  }
];

const sampleMessages = [
  {
    first_name: "John",
    last_name: "Smith",
    email: "john.smith@email.com",
    phone: "+1-555-0123",
    message: "Hi, I'm interested in volunteering with your organization. I have experience in event planning and community outreach. Could you please let me know about upcoming volunteer opportunities?",
    type: "volunteer",
    status: "unread",
    created_at: new Date('2024-12-20T11:30:00Z').toISOString()
  },
  {
    first_name: "Maria",
    last_name: "Garcia",
    email: "maria.garcia@email.com",
    phone: "+1-555-0124",
    message: "Hello, I would like to make a donation to support your cause. What are the best ways to contribute?",
    type: "donation",
    status: "read",
    created_at: new Date('2024-12-21T13:45:00Z').toISOString()
  },
  {
    first_name: "Robert",
    last_name: "Williams",
    email: "robert.williams@email.com",
    phone: "+1-555-0125",
    message: "Our company is interested in exploring partnership opportunities with your organization. We believe our services could complement your mission. Would you be available for a meeting next week?",
    type: "partnership",
    status: "replied",
    created_at: new Date('2024-12-19T15:20:00Z').toISOString()
  },
  {
    first_name: "Lisa",
    last_name: "Anderson",
    email: "lisa.anderson@email.com",
    phone: "+1-555-0126",
    message: "Hi, I'm a parent looking for educational programs for my children. Could you provide more information about your current offerings and enrollment process?",
    type: "inquiry",
    status: "unread",
    created_at: new Date('2024-12-24T10:15:00Z').toISOString()
  },
  {
    first_name: "James",
    last_name: "Thompson",
    email: "james.thompson@email.com",
    phone: "+1-555-0127",
    message: "I'm a journalist writing a story about community organizations making an impact. I'd love to interview someone from your team about your recent projects.",
    type: "media",
    status: "read",
    created_at: new Date('2024-12-22T12:00:00Z').toISOString()
  },
  {
    first_name: "Jennifer",
    last_name: "Lee",
    email: "jennifer.lee@email.com",
    phone: "+1-555-0128",
    message: "Hello, I'm a university student working on a project about social impact organizations. I'd appreciate the opportunity to learn more about your work for academic purposes.",
    type: "academic",
    status: "replied",
    created_at: new Date('2024-12-18T14:30:00Z').toISOString()
  }
];

// Function to seed comments
async function seedComments() {
  try {
    console.log('Seeding comments...');
    for (const comment of sampleComments) {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(comment)
      });
      
      if (response.ok) {
        console.log(`✅ Added comment from ${comment.name}`);
      } else {
        console.error(`❌ Failed to add comment from ${comment.name}`);
      }
    }
    console.log('Comments seeding completed!');
  } catch (error) {
    console.error('Error seeding comments:', error);
  }
}

// Function to seed messages
async function seedMessages() {
  try {
    console.log('Seeding messages...');
    for (const message of sampleMessages) {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });
      
      if (response.ok) {
        console.log(`✅ Added message from ${message.first_name} ${message.last_name}`);
      } else {
        console.error(`❌ Failed to add message from ${message.first_name} ${message.last_name}`);
      }
    }
    console.log('Messages seeding completed!');
  } catch (error) {
    console.error('Error seeding messages:', error);
  }
}

// Main seeding function
async function seedAll() {
  console.log('🌱 Starting database seeding...');
  console.log('=====================================');
  
  await seedComments();
  console.log('');
  await seedMessages();
  
  console.log('=====================================');
  console.log('🎉 Database seeding completed!');
  console.log(`📝 Added ${sampleComments.length} comments`);
  console.log(`📧 Added ${sampleMessages.length} messages`);
}

// Run if called directly
if (typeof window === 'undefined') {
  // Node.js environment
  seedAll().catch(console.error);
} else {
  // Browser environment - expose functions globally
  window.seedCommentsAndMessages = {
    seedComments,
    seedMessages,
    seedAll
  };
  
  console.log('Seeding functions are now available in the browser console:');
  console.log('- seedCommentsAndMessages.seedAll()');
  console.log('- seedCommentsAndMessages.seedComments()');
  console.log('- seedCommentsAndMessages.seedMessages()');
}

module.exports = {
  seedComments,
  seedMessages,
  seedAll,
  sampleComments,
  sampleMessages
};