import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  MessageSquare,
  CheckCircle2,
  Target,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from "lucide-react";

export function CommunityDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 mt-10 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Beyond Words Community</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening in your community.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Schedule
            </Button>
            <Button className="gap-2 bg-green-600 hover:bg-green-700">
              <MessageSquare className="h-4 w-4" />
              New Post
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Members</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">2,847</p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">+12%</span>
                    <span className="text-sm text-gray-500">vs last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Projects</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">432</p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">+8%</span>
                    <span className="text-sm text-gray-500">vs last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Weekly Activity</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">86,543</p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">+24%</span>
                    <span className="text-sm text-gray-500">vs last week</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Engagement Rate</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">94%</p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-600 font-medium">-2%</span>
                    <span className="text-sm text-gray-500">vs last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Community Health Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Community Health Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="#e5e7eb"
                        strokeWidth="16"
                        fill="none"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="#10b981"
                        strokeWidth="16"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 88}`}
                        strokeDashoffset={`${2 * Math.PI * 88 * (1 - 0.82)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-bold text-gray-900">82%</span>
                      <span className="text-sm text-gray-600 mt-1">Excellent</span>
                    </div>
                  </div>
                  <p className="text-center text-gray-600 mt-6 max-w-md">
                    Your community is thriving! Keep up the great engagement and continue fostering meaningful connections.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Engagement Indicators */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Indicators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Daily Active Users</span>
                    <span className="text-sm font-bold text-gray-900">1,247 / 2,847</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '44%' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">44% of total members</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Post Engagement</span>
                    <span className="text-sm font-bold text-gray-900">2,156 / 2,500</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '86%' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">86% engagement rate</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Event Participation</span>
                    <span className="text-sm font-bold text-gray-900">892 / 1,200</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '74%' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">74% participation rate</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Resource Downloads</span>
                    <span className="text-sm font-bold text-gray-900">1,543 / 2,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '77%' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">77% download rate</span>
                </div>
              </CardContent>
            </Card>

            {/* Most Active Topics */}
            <Card>
              <CardHeader>
                <CardTitle>Most Active Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { topic: "Data Privacy", count: 234, trend: "+15%", color: "bg-red-500" },
                    { topic: "AI Ethics", count: 189, trend: "+22%", color: "bg-orange-500" },
                    { topic: "Research Methods", count: 156, trend: "+8%", color: "bg-yellow-500" },
                    { topic: "Community Events", count: 142, trend: "+31%", color: "bg-green-500" },
                    { topic: "Technical Support", count: 98, trend: "-5%", color: "bg-blue-500" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-1 h-12 ${item.color} rounded-full`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{item.topic}</span>
                          <span className="text-sm font-bold text-gray-900">{item.count}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">discussions this week</span>
                          <span className={`text-xs font-medium ${item.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {item.trend}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Community Status</p>
                    <p className="text-lg font-bold text-gray-900">Excellent</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  All systems operational. Your community is healthy and growing steadily.
                </p>
              </CardContent>
            </Card>

            {/* Member Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Member Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">New Members</span>
                      <span className="text-sm font-bold text-gray-900">+342</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Active Members</span>
                      <span className="text-sm font-bold text-gray-900">2,417</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Returning Members</span>
                      <span className="text-sm font-bold text-gray-900">1,892</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: '66%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: "Weekly Standup", date: "Today, 2:00 PM", attendees: 45 },
                  { title: "Research Workshop", date: "Tomorrow, 10:00 AM", attendees: 78 },
                  { title: "Community Meetup", date: "Mar 8, 6:00 PM", attendees: 124 }
                ].map((event, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{event.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{event.date}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Users className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{event.attendees} attending</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { action: "New member joined", time: "2 min ago", icon: Users, color: "text-blue-600" },
                  { action: "Event created", time: "15 min ago", icon: Calendar, color: "text-green-600" },
                  { action: "Post published", time: "1 hour ago", icon: MessageSquare, color: "text-purple-600" },
                  { action: "Achievement unlocked", time: "3 hours ago", icon: Award, color: "text-orange-600" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                    <span className="flex-1 text-gray-700">{activity.action}</span>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section - Research & Metrics */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Research Themes */}
          <Card>
            <CardHeader>
              <CardTitle>Research Themes & Priorities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Data Privacy</span>
                    <span className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 text-white px-2 py-0.5 text-xs font-medium">
                      High Priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Exploring user consent and data collection best practices
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>12 active projects</span>
                    <span>•</span>
                    <span>45 researchers</span>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">AI Ethics</span>
                    <span className="inline-flex items-center justify-center rounded-md border border-transparent bg-orange-600 text-white px-2 py-0.5 text-xs font-medium">
                      Medium Priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Investigating ethical implications of AI in decision-making
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>8 active projects</span>
                    <span>•</span>
                    <span>32 researchers</span>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Digital Wellbeing</span>
                    <span className="inline-flex items-center justify-center rounded-md border border-transparent bg-yellow-600 text-white px-2 py-0.5 text-xs font-medium">
                      Medium Priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Studying impact of technology on mental health and wellness
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>15 active projects</span>
                    <span>•</span>
                    <span>67 researchers</span>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Inclusive Design</span>
                    <span className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 text-white px-2 py-0.5 text-xs font-medium">
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Creating accessible and inclusive digital experiences
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>9 active projects</span>
                    <span>•</span>
                    <span>28 researchers</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Bar Chart */}
                <div className="h-64 flex items-end justify-between gap-2">
                  {[
                    { day: "Mon", value: 65, posts: 234, comments: 567 },
                    { day: "Tue", value: 45, posts: 189, comments: 423 },
                    { day: "Wed", value: 78, posts: 312, comments: 689 },
                    { day: "Thu", value: 82, posts: 345, comments: 734 },
                    { day: "Fri", value: 70, posts: 278, comments: 612 },
                    { day: "Sat", value: 55, posts: 198, comments: 445 },
                    { day: "Sun", value: 60, posts: 223, comments: 501 }
                  ].map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg hover:from-green-700 hover:to-green-500 transition-all cursor-pointer relative group" style={{ height: `${item.value}%` }}>
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          <div className="font-semibold">{item.posts} posts</div>
                          <div>{item.comments} comments</div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 font-medium">{item.day}</span>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600 rounded"></div>
                    <span className="text-sm text-gray-600">Posts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-600 rounded"></div>
                    <span className="text-sm text-gray-600">Comments</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Items & Notifications */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Action Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { task: "Review pending member applications", priority: "high", due: "Today" },
                { task: "Approve new research proposal", priority: "medium", due: "Tomorrow" },
                { task: "Schedule community town hall", priority: "medium", due: "This week" },
                { task: "Update community guidelines", priority: "low", due: "Next week" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.task}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                        item.priority === 'high' 
                          ? 'bg-red-100 text-red-700 border-red-300' 
                          : 'bg-gray-100 text-gray-700 border-gray-300'
                      }`}>
                        {item.priority}
                      </span>
                      <span className="text-xs text-gray-500">Due: {item.due}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">253,986</p>
                  <p className="text-sm text-gray-600 mt-1">Total Interactions</p>
                  <p className="text-xs text-green-600 font-medium mt-2">+18% this month</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">28,207</p>
                  <p className="text-sm text-gray-600 mt-1">New Posts</p>
                  <p className="text-xs text-blue-600 font-medium mt-2">+12% this month</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">92,156</p>
                  <p className="text-sm text-gray-600 mt-1">Comments</p>
                  <p className="text-xs text-orange-600 font-medium mt-2">+24% this month</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">141</p>
                  <p className="text-sm text-gray-600 mt-1">Events</p>
                  <p className="text-xs text-purple-600 font-medium mt-2">+6% this month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
