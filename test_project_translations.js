// Test script to add project translations
// Run with: node test_project_translations.js

const testProjectTranslations = async () => {
  try {
    // First get the projects to see their IDs
    const projectsResponse = await fetch('http://localhost:3000/api/projects');
    const projectsData = await projectsResponse.json();
    const projects = projectsData.data.projects;

    console.log('Available projects:');
    projects.forEach(p => console.log(`- ${p.id}: ${p.title}`));

    // Find the rayhana/rihana project
    const rihanaProject = projects.find(p => p.id.includes('rihana') || p.id.includes('rayhana'));
    if (!rihanaProject) {
      console.log('Rayhana project not found');
      return;
    }

    console.log(`\nAdding translations for project: ${rihanaProject.id} - ${rihanaProject.title}`);

    const translations = [
      {
        project_id: rihanaProject.id,
        lang: "en",
        title: "Rayhana Assalam Kindergarten",
        excerpt: "A kindergarten aiming to provide a safe and inspiring educational environment for preschool children, focusing on the development of social, cognitive, and emotional skills.",
        content: null,
      },
      {
        project_id: rihanaProject.id,
        lang: "ar",
        title: "ريحانة السلام - روضة أطفال",
        excerpt: "روضة أطفال تهدف إلى توفير بيئة تعليمية آمنة وملهمة للأطفال في مرحلة ما قبل المدرسة، مع التركيز على تطوير المهارات الاجتماعية والمعرفية والعاطفية.",
        content: null,
      }
    ];

    for (const translation of translations) {
      const response = await fetch('http://localhost:3000/api/project-translations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(translation),
      });

      const result = await response.json();
      console.log(`Translation for ${translation.lang}:`, result.success ? 'SUCCESS' : 'FAILED');
      if (!result.success) console.log('Error:', result.error);
    }

    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testProjectTranslations();
