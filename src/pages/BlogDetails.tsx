
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { blogPosts } from '@/data/blogPosts';
import { BlogPost } from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Calendar, User, Share, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const BlogDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  
  useEffect(() => {
    // Find the current post
    const currentPost = blogPosts.find(post => post.id === id);
    setPost(currentPost || null);
    
    // If post exists, find related posts
    if (currentPost) {
      const related = blogPosts
        .filter(p => p.id !== id)
        .filter(p => p.tags.some(tag => currentPost.tags.includes(tag)))
        .slice(0, 3);
      setRelatedPosts(related);
    }
    
    // Scroll to top when post changes
    window.scrollTo(0, 0);
  }, [id]);
  
  if (!post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen py-24 px-6 bg-gradient-to-b from-background to-accent/5">
          <div className="container max-w-4xl mx-auto text-center py-12">
            <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="mb-8 text-muted-foreground">The blog post you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/blog')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen py-24 px-6 bg-gradient-to-b from-background to-accent/5">
        <div className="container max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/blog')}
            className="mb-6 hover:bg-background"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
          
          {/* Featured Image */}
          <div className="w-full aspect-video rounded-lg overflow-hidden mb-6">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Post Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {post.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-muted-foreground">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>
                    <User size={16} />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">{post.author.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {post.publishDate}
                </div>
                <div className="flex items-center">
                  <BookOpen size={14} className="mr-1" />
                  {post.readingTime}
                </div>
              </div>
            </div>
          </div>
          
          {/* Share Button */}
          <div className="flex justify-end mb-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: window.location.href,
                  })
                  .catch(console.error);
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
            >
              <Share size={14} className="mr-2" />
              Share
            </Button>
          </div>
          
          {/* Post Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <ReactMarkdown>
              {post.content}
            </ReactMarkdown>
          </div>
          
          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12 border-t pt-8">
              <h3 className="text-xl font-semibold mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card 
                    key={relatedPost.id} 
                    className="overflow-hidden hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/blog/${relatedPost.id}`)}
                  >
                    <div className="aspect-video w-full">
                      <img 
                        src={relatedPost.coverImage} 
                        alt={relatedPost.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium mb-2 line-clamp-2">{relatedPost.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{relatedPost.excerpt}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default BlogDetails;
