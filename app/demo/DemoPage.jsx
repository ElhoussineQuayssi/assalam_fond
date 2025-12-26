"use client";
import { ProjectContentRenderer } from '@/components/ProjectContentRenderer';

const demoContent = [
  {
    id: "intro",
    type: "text",
    content: {
      heading: "Our Mission",
      text: "At our foundation, we are committed to creating sustainable change in communities across Morocco. Through targeted programs and partnerships, we work to address the root causes of poverty and inequality, ensuring that every child has access to education, healthcare, and opportunities for a brighter future."
    }
  },
  {
    id: "stats",
    type: "stats",
    content: {
      heading: "Key Achievements",
      stats: [
        { value: "500", label: "Children Supported" },
        { value: "25", label: "Communities Served" },
        { value: "98%", label: "Program Success Rate" },
        { value: "15", label: "Years of Service" }
      ]
    }
  },
  {
    id: "features",
    type: "list",
    content: {
      title: "Our Core Programs",
      items: [
        "Comprehensive educational support and tutoring",
        "Healthcare access and medical assistance",
        "Nutritional programs and food security initiatives",
        "Vocational training and skill development",
        "Community development and infrastructure projects",
        "Emergency relief and crisis response"
      ]
    }
  },
  {
    id: "programme",
    type: "programme",
    content: {
      title: "Professional Culinary Training Program",
      duration: "9 Months",
      modules: [
        {
          name: "Foundation Skills",
          description: "Basic cooking techniques, kitchen safety, and food handling"
        },
        {
          name: "Traditional Moroccan Cuisine",
          description: "Authentic recipes, spice blending, and cultural cooking methods"
        },
        {
          name: "Modern Techniques",
          description: "Contemporary cooking methods and presentation skills"
        },
        {
          name: "Business Management",
          description: "Restaurant operations, cost control, and entrepreneurship"
        }
      ]
    }
  },
  {
    id: "impact",
    type: "impact",
    content: {
      title: "Social & Economic Impact",
      impacts: [
        {
          icon: "family",
          title: "Family Stability",
          description: "Supporting 200 families with stable income and housing security"
        },
        {
          icon: "education",
          title: "Education Access",
          description: "100% of supported children enrolled in quality education programs"
        },
        {
          icon: "money",
          title: "Economic Growth",
          description: "Created 50 sustainable jobs and micro-enterprises"
        }
      ]
    }
  },
  {
    id: "sponsorship",
    type: "sponsorship",
    content: {
      title: "Kafala Sponsorship Program",
      sponsorships: [
        {
          amount: "300",
          title: "Basic Support",
          benefits: [
            "Monthly food assistance",
            "School supplies and uniforms",
            "Basic healthcare coverage",
            "Educational monitoring"
          ]
        },
        {
          amount: "500",
          title: "Comprehensive Care",
          benefits: [
            "All Basic Support benefits",
            "Extra-curricular activities",
            "Psychological support",
            "Clothing and personal items",
            "Transportation assistance"
          ]
        },
        {
          amount: "1000",
          title: "Full Sponsorship",
          benefits: [
            "All Comprehensive Care benefits",
            "Higher education support",
            "Skill development programs",
            "Emergency medical coverage",
            "Family counseling services"
          ]
        }
      ]
    }
  },
  {
    id: "timeline",
    type: "timeline",
    content: {
      title: "Project Milestones",
      events: [
        {
          date: "January 2020",
          title: "Foundation Established",
          description: "Official launch of our organization with initial community assessment"
        },
        {
          date: "March 2021",
          title: "First Major Program",
          description: "Launched educational support program serving 50 children"
        },
        {
          date: "June 2022",
          title: "Expansion Phase",
          description: "Extended services to 5 additional communities"
        },
        {
          date: "December 2023",
          title: "Impact Recognition",
          description: "Received national award for community development excellence"
        },
        {
          date: "March 2024",
          title: "Sustainable Growth",
          description: "Achieved self-sustaining programs in 3 communities"
        }
      ]
    }
  },
  {
    id: "services",
    type: "services",
    content: {
      title: "Support Services Offered",
      services: [
        {
          icon: "material",
          title: "Material Support",
          description: "School supplies, clothing, household items, and educational materials"
        },
        {
          icon: "financial",
          title: "Financial Assistance",
          description: "Direct financial aid, micro-loans, and economic empowerment programs"
        },
        {
          icon: "medical",
          title: "Medical Care",
          description: "Healthcare access, medical treatments, and wellness programs"
        }
      ]
    }
  }
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4">
            Project Content Renderer Demo
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            This page showcases all available block types in the dynamic content renderer.
            Each block demonstrates different content structures and layouts.
          </p>
        </div>

        <ProjectContentRenderer contentArray={demoContent} />
      </div>
    </div>
  );
}