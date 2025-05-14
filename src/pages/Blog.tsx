
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { blogPosts } from '@/data/blogPosts';
import BlogCard from '@/components/blog/BlogCard';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, FileText } from 'lucide-react';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  
  // Get all unique tags from blog posts
  const tags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));
  
  // Filter posts based on search query and active tag
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesTag = activeTag === null || post.tags.includes(activeTag);
    
    return matchesSearch && matchesTag;
  });
  
  // Featured post is the most recent one
  const featuredPost = blogPosts[0];
  const regularPosts = filteredPosts.filter(post => post.id !== featuredPost.id);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen py-24 px-6 bg-gradient-to-b from-background to-accent/5">
        <motion.div 
          className="container mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 bg-gradient-to-r from-primary to-purple-400 text-transparent bg-clip-text">
              Event Planning Blog
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover tips, guides, and inspiration for planning your perfect celebration
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Search articles..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <ScrollArea className="w-full md:w-auto">
                <div className="flex space-x-2 p-1">
                  <Badge 
                    variant={activeTag === null ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80 transition-colors"
                    onClick={() => setActiveTag(null)}
                  >
                    All
                  </Badge>
                  
                  {tags.map((tag, index) => (
                    <Badge 
                      key={index}
                      variant={activeTag === tag ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/80 transition-colors"
                      onClick={() => setActiveTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          
          {/* Featured Post */}
          {!searchQuery && !activeTag && (
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FileText className="mr-2 text-primary" size={20} />
                Featured Article
              </h2>
              <BlogCard post={featuredPost} featured={true} />
            </motion.div>
          )}
          
          {/* Regular Posts */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">
              {activeTag ? `Articles: ${activeTag}` : 'Latest Articles'}
              {searchQuery ? ` - Search results for "${searchQuery}"` : ''}
            </h2>
            
            {filteredPosts.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {regularPosts.map((post) => (
                  <motion.div key={post.id} variants={itemVariants}>
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto mb-4 text-muted-foreground" size={40} />
                <h3 className="text-lg font-medium mb-1">No articles found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter to find what you're looking for
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </>
  );
};

export default Blog;
