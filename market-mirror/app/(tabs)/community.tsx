import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { getCommunityPosts } from './index';
import React from 'react';

type Comment = {
  id: number;
  user: string;
  avatar: string;
  text: string;
  timeAgo: string;
};


type Post = {
  id: number;
  user: string;
  avatar: string;
  question: string;
  item: string;
  price: number;
  mood: string;
  type?: 'emotional' | 'rational';
  photoUri?: string;
  votes: { yes: number; no: number; maybe: number };
  userVote?: 'yes' | 'no' | 'maybe';
  comments: Comment[];
  timeAgo: string;
};

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    user: 'Sarah M.',
    avatar: '👩',
    question: 'Should I buy these?',
    item: 'New Running Shoes',
    price: 180,
    mood: 'Excited',
    type: 'emotional',
    votes: { yes: 12, no: 3, maybe: 5 },
    comments: [
      { id: 1, user: 'Mike T.', avatar: '🧑', text: 'Do you already have running shoes?', timeAgo: '1h ago' },
      { id: 2, user: 'Emma K.', avatar: '👩', text: 'If your current ones are worn out, go for it!', timeAgo: '45m ago' },
    ],
    timeAgo: '2h ago',
  },
  {
    id: 2,
    user: 'Alex K.',
    avatar: '🧑',
    question: 'Honest opinions needed!',
    item: 'Gaming Console',
    price: 499,
    mood: 'Impulsive',
    type: 'emotional',
    votes: { yes: 8, no: 15, maybe: 12 },
    comments: [
      { id: 1, user: 'Jordan L.', avatar: '👨', text: 'Maybe wait for a sale? They usually drop prices during holidays.', timeAgo: '3h ago' },
    ],
    timeAgo: '5h ago',
  },
  {
    id: 3,
    user: 'Jamie L.',
    avatar: '👨',
    question: 'Is this worth it?',
    item: 'Meditation App Subscription',
    price: 12,
    mood: 'Calm',
    type: 'rational',
    votes: { yes: 24, no: 2, maybe: 1 },
    comments: [],
    timeAgo: '1d ago',
  },
];

export default function CommunityScreen() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const userPosts = getCommunityPosts();
    if (userPosts.length > 0) {
      setPosts([...userPosts, ...INITIAL_POSTS]);
    }
  }, []);

  // Refresh posts when tab is focused
  useEffect(() => {
    const interval = setInterval(() => {
      const userPosts = getCommunityPosts();
      if (userPosts.length > 0) {
        setPosts([...userPosts, ...INITIAL_POSTS]);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleVote = (postId: number, voteType: 'yes' | 'no' | 'maybe') => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newVotes = { ...post.votes };
        
        if (post.userVote) {
          newVotes[post.userVote]--;
        }
        
        newVotes[voteType]++;
        
        return { ...post, votes: newVotes, userVote: voteType };
      }
      return post;
    }));
  };

  const openComments = (post: Post) => {
    setSelectedPost(post);
    setShowComments(true);
  };

  const addComment = () => {
    if (commentText.trim() && selectedPost) {
      const newComment: Comment = {
        id: selectedPost.comments.length + 1,
        user: 'You',
        avatar: '😊',
        text: commentText,
        timeAgo: 'Just now',
      };

      setPosts(posts.map(post => {
        if (post.id === selectedPost.id) {
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      }));

      setSelectedPost({ ...selectedPost, comments: [...selectedPost.comments, newComment] });
      setCommentText('');
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'Excited': return '#FFD700';
      case 'Calm': return '#90EE90';
      case 'Happy': return '#FFD700';
      case 'Stressed': return '#ff8844';
      case 'Anxious': return '#ff4444';
      case 'Impulsive': return '#ff6b6b';
      default: return '#888';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <View style={styles.dividerGold} />
        <Text style={styles.subtitle}>Get support from others on their mindful journey</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            {post.photoUri && (
              <Image source={{ uri: post.photoUri }} style={styles.postImage} />
            )}
            
            <View style={styles.postHeader}>
              <View style={styles.userInfo}>
                <Text style={styles.avatar}>{post.avatar}</Text>
                <View>
                  <Text style={styles.userName}>{post.user}</Text>
                  <Text style={styles.timeAgo}>{post.timeAgo}</Text>
                </View>
              </View>
              <View style={styles.badgeContainer}>
                <View style={[styles.moodBadge, { backgroundColor: getMoodColor(post.mood) + '20', borderColor: getMoodColor(post.mood) }]}>
                  <Text style={[styles.moodText, { color: getMoodColor(post.mood) }]}>
                    {post.mood}
                  </Text>
                </View>
                {post.type && (
                  <View style={[
                    styles.typeBadge,
                    post.type === 'emotional' ? styles.emotionalBadge : styles.rationalBadge
                  ]}>
                    <Text style={styles.typeText}>
                      {post.type === 'emotional' ? '💭 Emotional' : '🧠 Rational'}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <Text style={styles.postQuestion}>{post.question}</Text>
            <View style={styles.purchaseInfo}>
              <Text style={styles.purchaseItem}>{post.item}</Text>
              <Text style={styles.purchasePrice}>${post.price}</Text>
            </View>

            <View style={styles.votingSection}>
              <Pressable
                style={[
                  styles.voteButton,
                  styles.yesButton,
                  post.userVote === 'yes' && styles.voteButtonActive
                ]}
                onPress={() => handleVote(post.id, 'yes')}
              >
                <Text style={styles.voteButtonText}>👍 Yes</Text>
                <Text style={styles.voteCount}>{post.votes.yes}</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.voteButton,
                  styles.maybeButton,
                  post.userVote === 'maybe' && styles.voteButtonActive
                ]}
                onPress={() => handleVote(post.id, 'maybe')}
              >
                <Text style={styles.voteButtonText}>🤔 Maybe</Text>
                <Text style={styles.voteCount}>{post.votes.maybe}</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.voteButton,
                  styles.noButton,
                  post.userVote === 'no' && styles.voteButtonActive
                ]}
                onPress={() => handleVote(post.id, 'no')}
              >
                <Text style={styles.voteButtonText}>👎 No</Text>
                <Text style={styles.voteCount}>{post.votes.no}</Text>
              </Pressable>
            </View>

            <Pressable style={styles.commentsButton} onPress={() => openComments(post)}>
              <Text style={styles.commentsButtonText}>
                💬 {post.comments.length} comments
              </Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={showComments}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowComments(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comments</Text>
              <Pressable onPress={() => setShowComments(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.commentsScroll}>
              {selectedPost?.comments.length === 0 ? (
                <View style={styles.noComments}>
                  <Text style={styles.noCommentsText}>
                    No comments yet. Be the first to share your thoughts!
                  </Text>
                </View>
              ) : (
                selectedPost?.comments.map((comment) => (
                  <View key={comment.id} style={styles.commentItem}>
                    <Text style={styles.commentAvatar}>{comment.avatar}</Text>
                    <View style={styles.commentContent}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentUser}>{comment.user}</Text>
                        <Text style={styles.commentTime}>{comment.timeAgo}</Text>
                      </View>
                      <Text style={styles.commentText}>{comment.text}</Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>

            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                value={commentText}
                onChangeText={setCommentText}
                placeholder="Add a comment..."
                placeholderTextColor="#666"
                multiline
              />
              <Pressable
                style={[styles.sendButton, !commentText.trim() && styles.sendButtonDisabled]}
                onPress={addComment}
                disabled={!commentText.trim()}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 12,
    fontFamily: 'System',
  },
  dividerGold: {
    width: 60,
    height: 3,
    backgroundColor: '#FFD700',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    fontFamily: 'System',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 0,
  },
  postCard: {
    backgroundColor: '#111',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#0a0a0a',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    fontSize: 32,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'System',
  },
  timeAgo: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'System',
  },
  badgeContainer: {
    gap: 6,
    alignItems: 'flex-end',
  },
  moodBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  moodText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'System',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  emotionalBadge: {
    backgroundColor: '#ff884420',
    borderColor: '#ff8844',
  },
  rationalBadge: {
    backgroundColor: '#FFD70020',
    borderColor: '#FFD700',
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'System',
  },
  postQuestion: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 12,
    fontFamily: 'System',
  },
  purchaseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  purchaseItem: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFD700',
    fontFamily: 'System',
  },
  purchasePrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    fontFamily: 'System',
  },
  votingSection: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  voteButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
  },
  voteButtonActive: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
  yesButton: {
    backgroundColor: '#FFD70020',
    borderColor: '#FFD700',
  },
  maybeButton: {
    backgroundColor: '#88888820',
    borderColor: '#888',
  },
  noButton: {
    backgroundColor: '#ff444420',
    borderColor: '#ff4444',
  },
  voteButtonText: {
    fontSize: 13,
    color: '#fff',
    marginBottom: 4,
    fontFamily: 'System',
  },
  voteCount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    fontFamily: 'System',
  },
  commentsButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  commentsButtonText: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'System',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFD700',
    fontFamily: 'System',
  },
  closeButton: {
    fontSize: 28,
    color: '#888',
  },
  commentsScroll: {
    flex: 1,
    paddingHorizontal: 24,
  },
  noComments: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  noCommentsText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'System',
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  commentAvatar: {
    fontSize: 32,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'System',
  },
  commentTime: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'System',
  },
  commentText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
    fontFamily: 'System',
  },
  commentInputContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#fff',
    maxHeight: 100,
    fontFamily: 'System',
  },
  sendButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#333',
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'System',
  },
});