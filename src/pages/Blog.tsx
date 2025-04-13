
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Search, User, ArrowUpRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for blog posts
const blogPosts = [
  {
    id: 1,
    title: '10 AI-Powered Tools That Will Transform Your Event Planning',
    excerpt: 'Discover how artificial intelligence is revolutionizing the event planning industry with these innovative tools.',
    image: 'https://images.unsplash.com/photo-1558008258-3256797b43f3',
    date: 'April 10, 2024',
    author: 'Sarah Johnson',
    category: 'Technology',
    readTime: '8 min read'
  },
  {
    id: 2,
    title: 'How to Create a Stunning Wedding on a Budget',
    excerpt: 'Plan your dream wedding without breaking the bank with these creative money-saving tips and strategies.',
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf',
    date: 'April 5, 2024',
    author: 'Michael Chen',
    category: 'Weddings',
    readTime: '12 min read'
  },
  {
    id: 3,
    title: 'The Ultimate Guide to Corporate Event Planning',
    excerpt: 'Everything you need to know about planning successful corporate events that leave a lasting impression.',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678',
    date: 'March 28, 2024',
    author: 'Jessica Taylor',
    category: 'Corporate',
    readTime: '15 min read'
  },
  {
    id: 4,
    title: 'Sustainable Event Planning: Reducing Your Environmental Impact',
    excerpt: 'Learn how to plan eco-friendly events that minimize waste and environmental impact without sacrificing style.',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
    date: 'March 20, 2024',
    author: 'David Wilson',
    category: 'Sustainability',
    readTime: '10 min read'
  },
  {
    id: 5,
    title: 'Virtual Events: Best Practices and Tools for Remote Gatherings',
    excerpt: 'Navigate the world of virtual events with these tips, tools, and strategies for engaging online experiences.',
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7',
    date: 'March 15, 2024',
    author: 'Amanda Rodriguez',
    category: 'Virtual Events',
    readTime: '9 min read'
  },
  {
    id: 6,
    title: 'Creative Theme Ideas for Your Next Birthday Celebration',
    excerpt: 'Surprise your loved ones with these unique and memorable birthday party themes for all ages.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d',
    date: 'March 8, 2024',
    author: 'Robert Kim',
    category: 'Birthdays',
    readTime: '7 min read'
  }
];

const Blog = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen py-24 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Event Planning Blog</h1>
              <p className="text-muted-foreground">Tips, trends, and inspiration for your next event</p>
            </div>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search articles..." 
                className="pl-10 w-full md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => (
                <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="pt-6">
                    <Badge variant="outline" className="mb-2 bg-accent/50">
                      {post.category}
                    </Badge>
                    <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                    <CardDescription className="mb-4">{post.excerpt}</CardDescription>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User size={14} className="mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <CalendarDays size={14} className="mr-1" />
                        {post.date}
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full group">
                      Read Article
                      <ArrowUpRight size={16} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-xl font-semibold mb-2">No articles found</h2>
              <p className="text-muted-foreground mb-6">Try a different search term</p>
              <Button onClick={() => setSearchTerm('')}>Clear Search</Button>
            </div>
          )}
          
          <div className="mt-12 flex justify-center">
            <Button variant="outline">Load More Articles</Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Blog;
