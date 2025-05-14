
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishDate: string;
  tags: string[];
  readingTime: string;
}

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogCard = ({ post, featured = false }: BlogCardProps) => {
  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-md ${featured ? 'border-2 border-primary/20' : ''}`}>
      <div className={`aspect-video w-full overflow-hidden ${featured ? 'max-h-64' : 'max-h-48'}`}>
        <img 
          src={post.coverImage} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="flex flex-wrap gap-2 mb-2">
          {post.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="secondary" className="font-normal text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <Link to={`/blog/${post.id}`} className="group">
          <h3 className={`font-semibold group-hover:text-primary transition-colors ${featured ? 'text-xl' : 'text-lg'}`}>
            {post.title}
          </h3>
        </Link>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className={`text-muted-foreground ${featured ? 'text-sm' : 'text-xs'} line-clamp-2`}>
          {post.excerpt}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>
              <User size={14} />
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{post.author.name}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{post.publishDate}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
