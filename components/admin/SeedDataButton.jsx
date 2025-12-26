"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SeedDataButton() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingResults, setSeedingResults] = useState(null);

  const seedCommentsAndMessages = async () => {
    setIsSeeding(true);
    setSeedingResults(null);

    try {
      // Sample comments data
      const sampleComments = [
        {
          content:
            "This is a great blog post! I really enjoyed reading about the organization's work in the community.",
          author_name: "Sarah Johnson",
          author_email: "sarah.johnson@email.com",
          post_id: "1",
          status: "approved",
        },
        {
          content:
            "I'd love to volunteer for your next project. Please let me know how I can help!",
          author_name: "Michael Chen",
          author_email: "michael.chen@email.com",
          post_id: "2",
          status: "pending",
        },
        {
          content:
            "Amazing work! This organization is making a real difference in people's lives.",
          author_name: "Emily Rodriguez",
          author_email: "emily.rodriguez@email.com",
          post_id: "1",
          status: "approved",
        },
        {
          content:
            "Could you provide more information about your education programs?",
          author_name: "David Kim",
          author_email: "david.kim@email.com",
          post_id: "3",
          status: "pending",
        },
        {
          content: "I disagree with some points mentioned in this article.",
          author_name: "Anonymous User",
          author_email: "anonymous@email.com",
          post_id: "2",
          status: "rejected",
        },
      ];

      const sampleMessages = [
        {
          name: "John Smith",
          email: "john.smith@email.com",
          subject: "Volunteer Opportunities",
          message:
            "Hi, I'm interested in volunteering with your organization. I have experience in event planning and community outreach. Could you please let me know about upcoming volunteer opportunities?",
          status: "unread",
        },
        {
          name: "Maria Garcia",
          email: "maria.garcia@email.com",
          subject: "Donation Inquiry",
          message:
            "Hello, I would like to make a donation to support your cause. What are the best ways to contribute?",
          status: "read",
        },
        {
          name: "Robert Williams",
          email: "robert.williams@email.com",
          subject: "Partnership Proposal",
          message:
            "Our company is interested in exploring partnership opportunities with your organization. We believe our services could complement your mission. Would you be available for a meeting next week?",
          status: "replied",
        },
        {
          name: "Lisa Anderson",
          email: "lisa.anderson@email.com",
          subject: "Questions About Programs",
          message:
            "Hi, I'm a parent looking for educational programs for my children. Could you provide more information about your current offerings and enrollment process?",
          status: "unread",
        },
        {
          name: "James Thompson",
          email: "james.thompson@email.com",
          subject: "Media Inquiry",
          message:
            "I'm a journalist writing a story about community organizations making an impact. I'd love to interview someone from your team about your recent projects.",
          status: "read",
        },
        {
          name: "Jennifer Lee",
          email: "jennifer.lee@email.com",
          subject: "Student Project Collaboration",
          message:
            "Hello, I'm a university student working on a project about social impact organizations. I'd appreciate the opportunity to learn more about your work for academic purposes.",
          status: "replied",
        },
      ];

      let commentsAdded = 0;
      let messagesAdded = 0;
      const errors = [];

      // Seed comments
      for (const comment of sampleComments) {
        try {
          const response = await fetch("/api/comments", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(comment),
          });

          if (response.ok) {
            commentsAdded++;
          } else {
            const error = await response.json();
            errors.push(
              `Failed to add comment from ${comment.author_name}: ${error.error}`,
            );
          }
        } catch (error) {
          errors.push(
            `Error adding comment from ${comment.author_name}: ${error.message}`,
          );
        }
      }

      // Seed messages
      for (const message of sampleMessages) {
        try {
          const response = await fetch("/api/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
          });

          if (response.ok) {
            messagesAdded++;
          } else {
            const error = await response.json();
            errors.push(
              `Failed to add message from ${message.name}: ${error.error}`,
            );
          }
        } catch (error) {
          errors.push(
            `Error adding message from ${message.name}: ${error.message}`,
          );
        }
      }

      setSeedingResults({
        commentsAdded,
        messagesAdded,
        errors,
      });
    } catch (error) {
      setSeedingResults({
        commentsAdded: 0,
        messagesAdded: 0,
        errors: [error.message],
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Database Seeding</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Add sample comments and messages to test the admin panel
          functionality.
        </p>
        <Button
          onClick={seedCommentsAndMessages}
          disabled={isSeeding}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSeeding ? "Seeding..." : "Seed Sample Data"}
        </Button>

        {seedingResults && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Seeding Results:</h4>
            <div className="text-sm space-y-1">
              <div className="text-green-600">
                ✅ Comments added: {seedingResults.commentsAdded}
              </div>
              <div className="text-green-600">
                ✅ Messages added: {seedingResults.messagesAdded}
              </div>
              {seedingResults.errors.length > 0 && (
                <div className="text-red-600 mt-2">
                  <div className="font-medium">Errors:</div>
                  {seedingResults.errors.map((error, index) => (
                    <div key={index} className="ml-2">
                      • {error}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
