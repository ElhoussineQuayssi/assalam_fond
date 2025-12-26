import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

// Helper function to format time ago
const formatTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  } else {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  }
};

// Helper function to get date ranges
const getDateRange = (period) => {
  const now = new Date();
  const ranges = {
    "7d": { days: 7, label: "7 Days" },
    "30d": { days: 30, label: "30 Days" },
    "3m": { days: 90, label: "3 Months" },
    "1y": { days: 365, label: "1 Year" },
  };

  const range = ranges[period] || ranges["30d"];
  const endDate = new Date(now);
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - range.days);

  return { startDate, endDate, label: range.label };
};

// Analytics overview with comprehensive metrics
export const getAnalyticsOverview = async (period = "30d") => {
  try {
    const { startDate, endDate, label } = getDateRange(period);

    // Get total counts and recent activity
    const [
      projectsResult,
      blogPostsResult,
      commentsResult,
      messagesResult,
      adminsResult,
    ] = await Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("blog_posts").select("*", { count: "exact", head: true }),
      supabase.from("comments").select("*", { count: "exact", head: true }),
      supabase.from("messages").select("*", { count: "exact", head: true }),
      supabase.from("admins").select("*", { count: "exact", head: true }),
    ]);

    // Get previous period counts for comparison
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(
      prevStartDate.getDate() - (endDate - startDate) / (1000 * 60 * 60 * 24),
    );
    const prevEndDate = new Date(startDate);

    const [
      prevProjectsResult,
      prevBlogPostsResult,
      prevCommentsResult,
      prevMessagesResult,
    ] = await Promise.all([
      supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .gte("created_at", prevStartDate.toISOString())
        .lte("created_at", prevEndDate.toISOString()),
      supabase
        .from("blog_posts")
        .select("*", { count: "exact", head: true })
        .gte("created_at", prevStartDate.toISOString())
        .lte("created_at", prevEndDate.toISOString()),
      supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .gte("created_at", prevStartDate.toISOString())
        .lte("created_at", prevEndDate.toISOString()),
      supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .gte("created_at", prevStartDate.toISOString())
        .lte("created_at", prevEndDate.toISOString()),
    ]);

    // Calculate growth rates
    const calculateGrowthRate = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const totalProjects = projectsResult.count || 0;
    const totalBlogPosts = blogPostsResult.count || 0;
    const totalComments = commentsResult.count || 0;
    const totalMessages = messagesResult.count || 0;
    const totalAdmins = adminsResult.count || 0;

    const currentPeriodProjects = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());
    const currentPeriodBlogPosts = await supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());
    const currentPeriodComments = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());
    const currentPeriodMessages = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    return {
      period: label,
      dateRange: {
        start: startDate.toISOString().split("T")[0],
        end: endDate.toISOString().split("T")[0],
      },
      metrics: {
        totalContent: {
          value: totalProjects + totalBlogPosts,
          currentPeriod:
            (currentPeriodProjects.count || 0) +
            (currentPeriodBlogPosts.count || 0),
          previousPeriod:
            (prevProjectsResult.count || 0) + (prevBlogPostsResult.count || 0),
          growthRate: calculateGrowthRate(
            (currentPeriodProjects.count || 0) +
              (currentPeriodBlogPosts.count || 0),
            (prevProjectsResult.count || 0) + (prevBlogPostsResult.count || 0),
          ),
        },
        totalEngagement: {
          value: totalComments + totalMessages,
          currentPeriod:
            (currentPeriodComments.count || 0) +
            (currentPeriodMessages.count || 0),
          previousPeriod:
            (prevCommentsResult.count || 0) + (prevMessagesResult.count || 0),
          growthRate: calculateGrowthRate(
            (currentPeriodComments.count || 0) +
              (currentPeriodMessages.count || 0),
            (prevCommentsResult.count || 0) + (prevMessagesResult.count || 0),
          ),
        },
        totalProjects: {
          value: totalProjects,
          currentPeriod: currentPeriodProjects.count || 0,
          previousPeriod: prevProjectsResult.count || 0,
          growthRate: calculateGrowthRate(
            currentPeriodProjects.count || 0,
            prevProjectsResult.count || 0,
          ),
        },
        totalBlogPosts: {
          value: totalBlogPosts,
          currentPeriod: currentPeriodBlogPosts.count || 0,
          previousPeriod: prevBlogPostsResult.count || 0,
          growthRate: calculateGrowthRate(
            currentPeriodBlogPosts.count || 0,
            prevBlogPostsResult.count || 0,
          ),
        },
      },
    };
  } catch (error) {
    console.error("Error fetching analytics overview:", error);
    throw error;
  }
};

// Get analytics categories data
export const getAnalyticsCategories = async (period = "30d") => {
  try {
    const { startDate, endDate, label } = getDateRange(period);

    // Category distribution for pie/doughnut charts
    const projectsByCategory = await supabase
      .from("projects")
      .select("category, created_at")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    const categoryStats = {};
    (projectsByCategory.data || []).forEach((project) => {
      const category = project.category || "Uncategorized";
      categoryStats[category] = (categoryStats[category] || 0) + 1;
    });

    const categoryData = Object.entries(categoryStats).map(
      ([category, count]) => ({
        category,
        count,
        percentage: (
          (count / (projectsByCategory.data?.length || 1)) *
          100
        ).toFixed(1),
      }),
    );

    return {
      period: label,
      dateRange: {
        start: startDate.toISOString().split("T")[0],
        end: endDate.toISOString().split("T")[0],
      },
      categories: {
        data: categoryData,
        labels: categoryData.map((d) => d.category),
        values: categoryData.map((d) => d.count),
      },
    };
  } catch (error) {
    console.error("Error fetching analytics categories:", error);
    throw error;
  }
};

// Get chart data for visualizations
export const getAnalyticsCharts = async (period = "30d", chartType = "all") => {
  try {
    const { startDate, endDate, label } = getDateRange(period);

    // Time-based data for line/bar charts
    const timeBasedData = [];
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const interval = daysDiff > 30 ? 7 : 1; // Weekly for long periods, daily for short

    for (let i = 0; i <= daysDiff; i += interval) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + interval);

      const [projectsCount, blogPostsCount, commentsCount, messagesCount] =
        await Promise.all([
          supabase
            .from("projects")
            .select("*", { count: "exact", head: true })
            .gte("created_at", date.toISOString())
            .lt("created_at", nextDate.toISOString()),
          supabase
            .from("blog_posts")
            .select("*", { count: "exact", head: true })
            .gte("created_at", date.toISOString())
            .lt("created_at", nextDate.toISOString()),
          supabase
            .from("comments")
            .select("*", { count: "exact", head: true })
            .gte("created_at", date.toISOString())
            .lt("created_at", nextDate.toISOString()),
          supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .gte("created_at", date.toISOString())
            .lt("created_at", nextDate.toISOString()),
        ]);

      timeBasedData.push({
        date: date.toISOString().split("T")[0],
        label:
          interval > 1
            ? `Week of ${date.toLocaleDateString()}`
            : date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
        projects: projectsCount.count || 0,
        blogPosts: blogPostsCount.count || 0,
        comments: commentsCount.count || 0,
        messages: messagesCount.count || 0,
        total:
          (projectsCount.count || 0) +
          (blogPostsCount.count || 0) +
          (commentsCount.count || 0) +
          (messagesCount.count || 0),
      });
    }

    // Category distribution for pie/doughnut charts
    const projectsByCategory = await supabase
      .from("projects")
      .select("category, created_at")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    const categoryStats = {};
    (projectsByCategory.data || []).forEach((project) => {
      const category = project.category || "Uncategorized";
      categoryStats[category] = (categoryStats[category] || 0) + 1;
    });

    const categoryData = Object.entries(categoryStats).map(
      ([category, count]) => ({
        category,
        count,
        percentage: (
          (count / (projectsByCategory.data?.length || 1)) *
          100
        ).toFixed(1),
      }),
    );

    // Content performance (most popular items)
    const popularProjects = await supabase
      .from("projects")
      .select("id, title, created_at, updated_at")
      .order("created_at", { ascending: false })
      .limit(5);

    const popularBlogPosts = await supabase
      .from("blog_posts")
      .select("id, title, created_at, updated_at")
      .order("created_at", { ascending: false })
      .limit(5);

    return {
      period: label,
      timeSeries: {
        data: timeBasedData,
        labels: timeBasedData.map((d) => d.label),
        datasets: {
          projects: timeBasedData.map((d) => d.projects),
          blogPosts: timeBasedData.map((d) => d.blogPosts),
          comments: timeBasedData.map((d) => d.comments),
          messages: timeBasedData.map((d) => d.messages),
          total: timeBasedData.map((d) => d.total),
        },
      },
      categories: {
        data: categoryData,
        labels: categoryData.map((d) => d.category),
        values: categoryData.map((d) => d.count),
      },
      contentPerformance: {
        popularProjects: (popularProjects.data || []).map((project) => ({
          id: project.id,
          title: project.title,
          createdAt: project.created_at,
          timeAgo: formatTimeAgo(project.created_at),
        })),
        popularBlogPosts: (popularBlogPosts.data || []).map((post) => ({
          id: post.id,
          title: post.title,
          createdAt: post.created_at,
          timeAgo: formatTimeAgo(post.created_at),
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching analytics charts data:", error);
    throw error;
  }
};

// Get detailed metrics
export const getAnalyticsMetrics = async (period = "30d") => {
  try {
    const { startDate, endDate, label } = getDateRange(period);

    // Detailed breakdown by content type and time
    const [projectsMetrics, blogMetrics, engagementMetrics] = await Promise.all(
      [
        // Projects metrics
        supabase
          .from("projects")
          .select("created_at, updated_at, status")
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString()),

        // Blog posts metrics
        supabase
          .from("blog_posts")
          .select("created_at, updated_at, published")
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString()),

        // Engagement metrics
        supabase
          .from("comments")
          .select("created_at, blog_post_id")
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString()),
      ],
    );

    // Process hourly activity patterns
    const hourlyActivity = new Array(24).fill(0);
    const dailyActivity = new Array(7).fill(0); // 0 = Sunday, 6 = Saturday

    const allActivities = [
      ...(projectsMetrics.data || []),
      ...(blogMetrics.data || []),
      ...(engagementMetrics.data || []),
    ];

    allActivities.forEach((activity) => {
      const date = new Date(activity.created_at);
      const hour = date.getHours();
      const day = date.getDay();

      hourlyActivity[hour]++;
      dailyActivity[day]++;
    });

    // Calculate averages and trends
    const totalItems = allActivities.length;
    const avgDailyActivity =
      totalItems / Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    // Peak activity times
    const peakHour = hourlyActivity.indexOf(Math.max(...hourlyActivity));
    const peakDay = dailyActivity.indexOf(Math.max(...dailyActivity));

    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    return {
      period: label,
      summary: {
        totalActivities: totalItems,
        avgDailyActivity: Math.round(avgDailyActivity * 10) / 10,
        peakHour: `${peakHour}:00`,
        peakDay: dayNames[peakDay],
        contentBreakdown: {
          projects: (projectsMetrics.data || []).length,
          blogPosts: (blogMetrics.data || []).length,
          comments: (engagementMetrics.data || []).length,
        },
      },
      activityPatterns: {
        hourly: hourlyActivity.map((count, hour) => ({
          hour: `${hour}:00`,
          count,
        })),
        daily: dailyActivity.map((count, day) => ({
          day: dayNames[day],
          count,
        })),
      },
      trends: {
        hourlyActivity,
        dailyActivity,
      },
    };
  } catch (error) {
    console.error("Error fetching analytics metrics:", error);
    throw error;
  }
};

// Get analytics summary statistics
export const getAnalyticsSummary = async (period = "30d") => {
  try {
    const { startDate, endDate, label } = getDateRange(period);

    // Recent activity summary
    const [recentProjects, recentBlogPosts, recentComments, recentMessages] =
      await Promise.all([
        supabase
          .from("projects")
          .select("id, title, created_at")
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString())
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("blog_posts")
          .select("id, title, created_at")
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString())
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("comments")
          .select("id, author_name, created_at")
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString())
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("messages")
          .select("id, name, created_at")
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString())
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

    // Calculate growth compared to previous period
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(
      prevStartDate.getDate() - (endDate - startDate) / (1000 * 60 * 60 * 24),
    );
    const prevEndDate = new Date(startDate);

    const [prevProjects, prevBlogPosts, prevComments, prevMessages] =
      await Promise.all([
        supabase
          .from("projects")
          .select("*", { count: "exact", head: true })
          .gte("created_at", prevStartDate.toISOString())
          .lte("created_at", prevEndDate.toISOString()),
        supabase
          .from("blog_posts")
          .select("*", { count: "exact", head: true })
          .gte("created_at", prevStartDate.toISOString())
          .lte("created_at", prevEndDate.toISOString()),
        supabase
          .from("comments")
          .select("*", { count: "exact", head: true })
          .gte("created_at", prevStartDate.toISOString())
          .lte("created_at", prevEndDate.toISOString()),
        supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .gte("created_at", prevStartDate.toISOString())
          .lte("created_at", prevEndDate.toISOString()),
      ]);

    const calculateGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    return {
      period: label,
      dateRange: {
        start: startDate.toISOString().split("T")[0],
        end: endDate.toISOString().split("T")[0],
      },
      summary: {
        newProjects: {
          value: (recentProjects.data || []).length,
          growth: calculateGrowth(
            (recentProjects.data || []).length,
            prevProjects.count || 0,
          ),
        },
        newBlogPosts: {
          value: (recentBlogPosts.data || []).length,
          growth: calculateGrowth(
            (recentBlogPosts.data || []).length,
            prevBlogPosts.count || 0,
          ),
        },
        newComments: {
          value: (recentComments.data || []).length,
          growth: calculateGrowth(
            (recentComments.data || []).length,
            prevComments.count || 0,
          ),
        },
        newMessages: {
          value: (recentMessages.data || []).length,
          growth: calculateGrowth(
            (recentMessages.data || []).length,
            prevMessages.count || 0,
          ),
        },
      },
      recentActivity: {
        projects: (recentProjects.data || []).map((project) => ({
          id: project.id,
          title: project.title,
          timeAgo: formatTimeAgo(project.created_at),
          type: "project",
        })),
        blogPosts: (recentBlogPosts.data || []).map((post) => ({
          id: post.id,
          title: post.title,
          timeAgo: formatTimeAgo(post.created_at),
          type: "blog",
        })),
        comments: (recentComments.data || []).map((comment) => ({
          id: comment.id,
          author: comment.author_name,
          timeAgo: formatTimeAgo(comment.created_at),
          type: "comment",
        })),
        messages: (recentMessages.data || []).map((message) => ({
          id: message.id,
          author: message.name,
          timeAgo: formatTimeAgo(message.created_at),
          type: "message",
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    throw error;
  }
};
