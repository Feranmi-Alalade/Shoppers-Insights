"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Heart,
  MessageCircle,
  Share2,
  Plus,
  Search,
  TrendingUp,
  // Users, // Unused
  Award,
  DollarSign,
} from "lucide-react";
import { useState } from "react";

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: number;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  category: string;
  savings?: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  duration: string;
  reward: string;
  category: string;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: {
        name: "Sarah Johnson",
        avatar: "/api/placeholder/32/32",
        level: 5,
      },
      content: "Just saved $200 on groceries using the new budget tool! 🎉",
      timestamp: "2025-07-14T09:00:00Z",
      likes: 34,
      comments: 12,
      category: "Savings",
      savings: 200,
    },
    {
      id: "2",
      author: { name: "Mike Lee", avatar: "/api/placeholder/32/32", level: 3 },
      content: "Joined the weekly challenge and cut my snack spending by 30%!",
      timestamp: "2025-07-13T15:30:00Z",
      likes: 21,
      comments: 5,
      category: "Challenge",
    },
  ]);

  const [challenges] = useState<Challenge[]>([
    {
      id: "c1",
      title: "Weekly Savings Challenge",
      description: "Save as much as you can on groceries this week!",
      participants: 42,
      duration: "7 days",
      reward: "$50 Gift Card",
      category: "Savings",
    },
    {
      id: "c2",
      title: "Healthy Eating Challenge",
      description: "Buy at least 5 healthy items in your next grocery trip.",
      participants: 28,
      duration: "5 days",
      reward: "Badge + $20",
      category: "Health",
    },
  ]);

  const [search, setSearch] = useState("");
  const [newPost, setNewPost] = useState("");
  const [open, setOpen] = useState(false);

  // Filter posts by search
  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(search.toLowerCase()) ||
      post.author.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Like handler
  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    );
  };

  // Share handler
  const handleShare = async (post: Post) => {
    const shareData = {
      title: `Community Post by ${post.author.name}`,
      text: post.content,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        alert("Sharing is not supported on this browser.");
      }
    } catch {
      alert("Could not share post.");
    }
  };

  return (
    <div className="py-8 px-4">
      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="mb-6 flex gap-2">
          <TabsTrigger value="feed">
            <TrendingUp className="inline mr-2" />
            Feed
          </TabsTrigger>
          <TabsTrigger value="challenges">
            <Award className="inline mr-2" />
            Challenges
          </TabsTrigger>
        </TabsList>
        <TabsContent value="feed">
          <div className="flex items-center gap-2 mb-4">
            <Search className="text-muted-foreground" />
            <Input
              placeholder="Search posts or users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="mr-1" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a Post</DialogTitle>
                </DialogHeader>
                <Textarea
                  placeholder="Share your savings tip or challenge story..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                />
                <Button
                  onClick={() => {
                    setPosts([
                      {
                        id: String(posts.length + 1),
                        author: {
                          name: "You",
                          avatar: "/api/placeholder/32/32",
                          level: 1,
                        },
                        content: newPost,
                        timestamp: new Date().toISOString(),
                        likes: 0,
                        comments: 0,
                        category: "General",
                      },
                      ...posts,
                    ]);
                    setNewPost("");
                    setOpen(false);
                  }}
                  disabled={!newPost.trim()}
                >
                  Post
                </Button>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <Avatar>
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      {post.author.name}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground">
                      Level {post.author.level} •{" "}
                      {new Date(post.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <Badge className="ml-auto" variant="secondary">
                    {post.category}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">{post.content}</p>
                  {post.savings && (
                    <div className="flex items-center gap-1 text-green-600 font-bold">
                      <DollarSign className="w-4 h-4" />
                      Saved ${post.savings}
                    </div>
                  )}
                  <div className="flex gap-4 mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart className="mr-1" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="mr-1" />
                      {post.comments}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(post)}
                    >
                      <Share2 className="mr-1" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="challenges">
          <div className="space-y-6">
            {challenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardHeader>
                  <CardTitle>{challenge.title}</CardTitle>
                  <Badge variant="secondary" className="mt-2">
                    {challenge.category}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p>{challenge.description}</p>
                  <div className="flex gap-4 mt-4">
                    <span className="text-xs text-muted-foreground">
                      Participants: {challenge.participants}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Duration: {challenge.duration}
                    </span>
                    <span className="text-xs text-green-600 font-bold">
                      Reward: {challenge.reward}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
