import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useState } from 'react';

type Post = {
  id: number;
  user: string;
  avatar: string;
  question: string;
  item: string;
  price: number;
  votes: { yes: number; no: number; maybe: number };
  comments: number;
  timeAgo: string;
};

const SAMPLE_POSTS: Post[] = [
  {
    id: 1,
    user: 'Sarah M.',
    avatar: '👩',
    question: 'Should I buy these?',
    item: 'New Running Shoes',
    price: 180,
    votes: { yes: 12, no: 3, maybe: 5 },
    comments: 8,
    timeAgo: '2h ago',
  },
  {
    id: 2,
    user: 'Alex K.',
    avatar: '🧑',
    question: 'Honest opinions needed!',
    item: 'Gaming Console',
    price: 499,
    votes: { yes: 8, no: 15, maybe: 12 },
    comments: 23,
    timeAgo: '5h ago',
  },
  {
    id: 3,
    user: 'Jamie L.',
    avatar: '👨',
    question: 'Is this worth it?',
    item: 'Meditation App Subscription',
    price: 12,
    votes: { yes: 24, no: 2, maybe: 1 },
    comments: 15,
    timeAgo: '1d ago',
  },
];

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState<'feed' | 'friends'>('feed');
  const [newPost, setNewPost] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <View style={styles.dividerGold} />
        <Text style={styles.subtitle}>Get support from others on their mindful journey</Text>
      </View>

      <View style={styles.tabSelector}>
        <Pressable
          style={[styles.tab, activeTab === 'feed' && styles.tabActive]}
          onPress={() => setActiveTab('feed')}
        >
          <Text style={[styles.tabText, activeTab === 'feed' && styles.tabTextActive]}>
            Community Feed
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'friends' && styles.tabActive]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.tabTextActive]}>
            My Friends
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'feed' ? (
          <>
            <View style={styles.createPost}>
              <Text style={styles.createPostTitle}>Ask the Community</Text>
              <TextInput
                style={styles.createPostInput}
                placeholder="What purchase are you thinking about?"
                placeholderTextColor="#666"
                value={newPost}
                onChangeText={setNewPost}
                multiline
              />
              <Pressable style={styles.createPostButton}>
                <Text style={styles.createPostButtonText}>Create Poll</Text>
              </Pressable>
            </View>

            {SAMPLE_POSTS.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.userInfo}>
                    <Text style={styles.avatar}>{post.avatar}</Text>
                    <View>
                      <Text style={styles.userName}>{post.user}</Text>
                      <Text style={styles.timeAgo}>{post.timeAgo}</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.postQuestion}>{post.question}</Text>
                <View style={styles.purchaseInfo}>
                  <Text style={styles.purchaseItem}>{post.item}</Text>
                  <Text style={styles.purchasePrice}>${post.price}</Text>
                </View>

                <View style={styles.votingSection}>
                  <Pressable style={[styles.voteButton, styles.yesButton]}>
                    <Text style={styles.voteButtonText}>👍 Yes</Text>
                    <Text style={styles.voteCount}>{post.votes.yes}</Text>
                  </Pressable>
                  <Pressable style={[styles.voteButton, styles.maybeButton]}>
                    <Text style={styles.voteButtonText}>🤔 Maybe</Text>
                    <Text style={styles.voteCount}>{post.votes.maybe}</Text>
                  </Pressable>
                  <Pressable style={[styles.voteButton, styles.noButton]}>
                    <Text style={styles.voteButtonText}>👎 No</Text>
                    <Text style={styles.voteCount}>{post.votes.no}</Text>
                  </Pressable>
                </View>

                <Pressable style={styles.commentsButton}>
                  <Text style={styles.commentsButtonText}>
                    💬 {post.comments} comments
                  </Text>
                </Pressable>
              </View>
            ))}
          </>
        ) : (
          <View style={styles.friendsSection}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>👥</Text>
              <Text style={styles.emptyTitle}>Connect with Friends</Text>
              <Text style={styles.emptyText}>
                Add friends to share your purchase decisions and get personalized advice from
                people who know you best!
              </Text>
              <Pressable style={styles.addFriendsButton}>
                <Text style={styles.addFriendsButtonText}>Add Friends</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
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
  tabSelector: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#111',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    fontFamily: 'System',
  },
  tabTextActive: {
    color: '#000',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 0,
  },
  createPost: {
    backgroundColor: '#0a0a0a',
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  createPostTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 12,
    fontFamily: 'System',
  },
  createPostInput: {
    backgroundColor: '#111',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: '#fff',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
    fontFamily: 'System',
  },
  createPostButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  createPostButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'System',
  },
  postCard: {
    backgroundColor: '#111',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  friendsSection: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    fontFamily: 'System',
  },
  emptyText: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 24,
    fontFamily: 'System',
  },
  addFriendsButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  addFriendsButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'System',
  },
});