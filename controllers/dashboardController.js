import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const getDashboardMetrics = async () => {
  try {
    // Get total counts for all entities
    const [projectsResult, blogPostsResult, commentsResult, messagesResult, adminsResult, projectImagesResult] = await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
      supabase.from('comments').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true }),
      supabase.from('admins').select('*', { count: 'exact', head: true }),
      supabase.from('project_images').select('*', { count: 'exact', head: true })
    ]);

    // Get recent activities (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [recentProjects, recentBlogPosts, recentComments, recentMessages] = await Promise.all([
      supabase.from('projects')
        .select('id, title, created_at, updated_at')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(5),
      supabase.from('blog_posts')
        .select('id, title, created_at, updated_at')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(5),
      supabase.from('comments')
        .select('id, author_name, created_at, blog_post_id')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(5),
      supabase.from('messages')
        .select('id, name, email, created_at')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(5)
    ]);

    // Calculate daily activity for the last 7 days
    const dailyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const [dayProjects, dayBlogPosts, dayComments, dayMessages] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true })
          .gte('created_at', startOfDay.toISOString())
          .lte('created_at', endOfDay.toISOString()),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true })
          .gte('created_at', startOfDay.toISOString())
          .lte('created_at', endOfDay.toISOString()),
        supabase.from('comments').select('*', { count: 'exact', head: true })
          .gte('created_at', startOfDay.toISOString())
          .lte('created_at', endOfDay.toISOString()),
        supabase.from('messages').select('*', { count: 'exact', head: true })
          .gte('created_at', startOfDay.toISOString())
          .lte('created_at', endOfDay.toISOString())
      ]);

      dailyActivity.push({
        date: date.toISOString().split('T')[0],
        projects: dayProjects.count || 0,
        blogPosts: dayBlogPosts.count || 0,
        comments: dayComments.count || 0,
        messages: dayMessages.count || 0
      });
    }

    // Prepare recent activities for display
    const projectActivities = (recentProjects.data || []).map(project => ({
      id: project.id,
      activity: `New project created: ${project.title}`,
      user: 'Admin',
      time: formatTimeAgo(project.created_at),
      status: 'Success',
      type: 'project'
    }));
    
    const blogActivities = (recentBlogPosts.data || []).map(post => ({
      id: post.id,
      activity: `Blog post published: ${post.title}`,
      user: 'Admin',
      time: formatTimeAgo(post.created_at),
      status: 'Success',
      type: 'blog'
    }));
    
    const commentActivities = (recentComments.data || []).map(comment => ({
      id: comment.id,
      activity: `New comment from ${comment.author_name}`,
      user: comment.author_name,
      time: formatTimeAgo(comment.created_at),
      status: 'Review',
      type: 'comment'
    }));
    
    const messageActivities = (recentMessages.data || []).map(message => ({
      id: message.id,
      activity: `Contact message from ${message.name}`,
      user: message.name,
      time: formatTimeAgo(message.created_at),
      status: 'Pending',
      type: 'message'
    }));
    
    const recentActivities = [...projectActivities, ...blogActivities, ...commentActivities, ...messageActivities]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 10);

    return {
      counts: {
        totalProjects: projectsResult.count || 0,
        totalBlogPosts: blogPostsResult.count || 0,
        totalComments: commentsResult.count || 0,
        totalMessages: messagesResult.count || 0,
        totalAdmins: adminsResult.count || 0,
        totalProjectImages: projectImagesResult.count || 0
      },
      recentActivities,
      dailyActivity,
      summary: {
        totalItems: (projectsResult.count || 0) + (blogPostsResult.count || 0) + (commentsResult.count || 0) + (messagesResult.count || 0),
        activeContent: (projectsResult.count || 0) + (blogPostsResult.count || 0),
        userInteractions: (commentsResult.count || 0) + (messagesResult.count || 0)
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error;
  }
};

// Helper function to format time ago
const formatTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
};