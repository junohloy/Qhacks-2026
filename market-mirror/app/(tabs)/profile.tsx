import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Switch, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [name, setName] = useState('Alex Johnson');
  const [email, setEmail] = useState('alex.johnson@email.com');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [weeklyReportsEnabled, setWeeklyReportsEnabled] = useState(true);
  const [communityUpdates, setCommunityUpdates] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Modals
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Privacy settings states
  const [shareDataWithFriends, setShareDataWithFriends] = useState(false);
  const [shareInsights, setShareInsights] = useState(true);
  const [sharePurchaseHistory, setSharePurchaseHistory] = useState(false);
  const [shareMoodData, setShareMoodData] = useState(true);
  const [locationAccess, setLocationAccess] = useState(false);
  const [contactsAccess, setContactsAccess] = useState(false);
  const [calendarAccess, setCalendarAccess] = useState(false);
  const [photosAccess, setPhotosAccess] = useState(true);
  const [analyticsTracking, setAnalyticsTracking] = useState(true);
  const [personalizedAds, setPersonalizedAds] = useState(false);
  const [thirdPartySharing, setThirdPartySharing] = useState(false);

  // Load user data from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('userEmail');
        const savedName = await AsyncStorage.getItem('userName');
        
        if (savedEmail) {
          setEmail(savedEmail);
        }
        if (savedName) {
          setName(savedName);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);
  
  const handleLogout = () => {
    // Simply navigate back to login page
    // The login page will overwrite the stored data when a new user logs in
    router.replace('/');
  };
  
  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    // In a real app, this would make an API call
    alert('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordModal(false);
  };
  
  const handleSaveProfile = async () => {
    if (isEditing) {
      // Validate email
      if (!email.includes('@')) {
        alert('Please enter a valid email address');
        return;
      }
      // Save to AsyncStorage
      try {
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('userName', name);
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error saving profile:', error);
        alert('Error saving profile. Please try again.');
      }
    }
    setIsEditing(!isEditing);
  };

  const stats = {
    totalCheckIns: 47,
    emotionalPurchases: 23,
    rationalPurchases: 24,
    moneySaved: 1240,
    currentStreak: 12,
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.profileEmoji}>👤</Text>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.dividerGold} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor="#666"
              />
            ) : (
              <Text style={styles.infoValue}>{name}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.infoValue}>{email}</Text>
            )}
          </View>

          <Pressable
            style={styles.editButton}
            onPress={handleSaveProfile}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📊</Text>
            <Text style={styles.statValue}>{stats.totalCheckIns}</Text>
            <Text style={styles.statLabel}>Total Check-Ins</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>💭</Text>
            <Text style={[styles.statValue, styles.emotionalColor]}>{stats.emotionalPurchases}</Text>
            <Text style={styles.statLabel}>Emotional</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🧠</Text>
            <Text style={[styles.statValue, styles.rationalColor]}>{stats.rationalPurchases}</Text>
            <Text style={styles.statLabel}>Rational</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>💰</Text>
            <Text style={[styles.statValue, styles.rationalColor]}>${stats.moneySaved}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={[styles.statCard, styles.statCardWide]}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={[styles.statValue, styles.rationalColor]}>{stats.currentStreak} days</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.preferencesCard}>
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <Text style={styles.preferenceEmoji}>🔔</Text>
              <View>
                <Text style={styles.preferenceLabel}>Push Notifications</Text>
                <Text style={styles.preferenceDescription}>
                  Get reminders before purchases
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#333', true: '#FFD70080' }}
              thumbColor={notificationsEnabled ? '#FFD700' : '#666'}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <Text style={styles.preferenceEmoji}>📈</Text>
              <View>
                <Text style={styles.preferenceLabel}>Weekly Reports</Text>
                <Text style={styles.preferenceDescription}>
                  Summary of your decisions
                </Text>
              </View>
            </View>
            <Switch
              value={weeklyReportsEnabled}
              onValueChange={setWeeklyReportsEnabled}
              trackColor={{ false: '#333', true: '#FFD70080' }}
              thumbColor={weeklyReportsEnabled ? '#FFD700' : '#666'}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <Text style={styles.preferenceEmoji}>👥</Text>
              <View>
                <Text style={styles.preferenceLabel}>Community Updates</Text>
                <Text style={styles.preferenceDescription}>
                  Comments and votes on your posts
                </Text>
              </View>
            </View>
            <Switch
              value={communityUpdates}
              onValueChange={setCommunityUpdates}
              trackColor={{ false: '#333', true: '#FFD70080' }}
              thumbColor={communityUpdates ? '#FFD700' : '#666'}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.accountCard}>
          <Pressable style={styles.accountButton} onPress={() => setShowPasswordModal(true)}>
            <Text style={styles.accountButtonText}>Change Password</Text>
            <Text style={styles.accountButtonIcon}>›</Text>
          </Pressable>
          
          <Pressable style={styles.accountButton} onPress={() => setShowPrivacyModal(true)}>
            <Text style={styles.accountButtonText}>Privacy Settings</Text>
            <Text style={styles.accountButtonIcon}>›</Text>
          </Pressable>
          
          <Pressable style={styles.accountButton} onPress={() => setShowHelpModal(true)}>
            <Text style={styles.accountButtonText}>Help & Support</Text>
            <Text style={styles.accountButtonIcon}>›</Text>
          </Pressable>
          
          <Pressable style={styles.accountButton} onPress={() => setShowAboutModal(true)}>
            <Text style={styles.accountButtonText}>About Market Mirror</Text>
            <Text style={styles.accountButtonIcon}>›</Text>
          </Pressable>
        </View>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </Pressable>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
        <Text style={styles.footerText}>Made with 💛 for mindful decisions</Text>
      </View>

      {/* Password Modal */}
      <Modal
        visible={showPasswordModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <Pressable onPress={() => setShowPasswordModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Current Password</Text>
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  placeholderTextColor="#666"
                  secureTextEntry
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>New Password</Text>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password (min 6 characters)"
                  placeholderTextColor="#666"
                  secureTextEntry
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm New Password</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor="#666"
                  secureTextEntry
                />
              </View>
              <Pressable style={styles.modalButton} onPress={handlePasswordChange}>
                <Text style={styles.modalButtonText}>Update Password</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Privacy Modal */}
      <Modal
        visible={showPrivacyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy Settings</Text>
              <Pressable onPress={() => setShowPrivacyModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.privacyHeader}>🔒 Your Privacy Matters</Text>
              <Text style={styles.privacyIntro}>
                Control what data you share and with whom. All settings are encrypted and secure.
              </Text>

              {/* Data Sharing with Friends */}
              <View style={styles.privacySection}>
                <Text style={styles.privacySectionTitle}>👥 Share with Friends</Text>
                
                <View style={styles.privacyItem}>
                  <View style={styles.privacyItemLeft}>
                    <Text style={styles.privacyLabel}>Allow Friend Sharing</Text>
                    <Text style={styles.privacyDescription}>
                      Let friends see your check-ins and insights
                    </Text>
                  </View>
                  <Switch
                    value={shareDataWithFriends}
                    onValueChange={setShareDataWithFriends}
                    trackColor={{ false: '#333', true: '#FFD70080' }}
                    thumbColor={shareDataWithFriends ? '#FFD700' : '#666'}
                  />
                </View>

                {shareDataWithFriends && (
                  <>
                    <View style={styles.privacyItem}>
                      <View style={styles.privacyItemLeft}>
                        <Text style={styles.privacyLabel}>Share Insights</Text>
                        <Text style={styles.privacyDescription}>
                          Friends can see your emotional/rational balance
                        </Text>
                      </View>
                      <Switch
                        value={shareInsights}
                        onValueChange={setShareInsights}
                        trackColor={{ false: '#333', true: '#FFD70080' }}
                        thumbColor={shareInsights ? '#FFD700' : '#666'}
                      />
                    </View>

                    <View style={styles.privacyItem}>
                      <View style={styles.privacyItemLeft}>
                        <Text style={styles.privacyLabel}>Share Purchase History</Text>
                        <Text style={styles.privacyDescription}>
                          Friends can see items you've checked in
                        </Text>
                      </View>
                      <Switch
                        value={sharePurchaseHistory}
                        onValueChange={setSharePurchaseHistory}
                        trackColor={{ false: '#333', true: '#FFD70080' }}
                        thumbColor={sharePurchaseHistory ? '#FFD700' : '#666'}
                      />
                    </View>

                    <View style={styles.privacyItem}>
                      <View style={styles.privacyItemLeft}>
                        <Text style={styles.privacyLabel}>Share Mood Data</Text>
                        <Text style={styles.privacyDescription}>
                          Friends can see your mood patterns
                        </Text>
                      </View>
                      <Switch
                        value={shareMoodData}
                        onValueChange={setShareMoodData}
                        trackColor={{ false: '#333', true: '#FFD70080' }}
                        thumbColor={shareMoodData ? '#FFD700' : '#666'}
                      />
                    </View>
                  </>
                )}
              </View>

              {/* App Permissions */}
              <View style={styles.privacySection}>
                <Text style={styles.privacySectionTitle}>📱 App Permissions</Text>
                
                <View style={styles.privacyItem}>
                  <View style={styles.privacyItemLeft}>
                    <Text style={styles.privacyLabel}>Location Access</Text>
                    <Text style={styles.privacyDescription}>
                      Track where purchases are made
                    </Text>
                  </View>
                  <Switch
                    value={locationAccess}
                    onValueChange={setLocationAccess}
                    trackColor={{ false: '#333', true: '#FFD70080' }}
                    thumbColor={locationAccess ? '#FFD700' : '#666'}
                  />
                </View>

                <View style={styles.privacyItem}>
                  <View style={styles.privacyItemLeft}>
                    <Text style={styles.privacyLabel}>Contacts Access</Text>
                    <Text style={styles.privacyDescription}>
                      Find friends using Market Mirror
                    </Text>
                  </View>
                  <Switch
                    value={contactsAccess}
                    onValueChange={setContactsAccess}
                    trackColor={{ false: '#333', true: '#FFD70080' }}
                    thumbColor={contactsAccess ? '#FFD700' : '#666'}
                  />
                </View>

                <View style={styles.privacyItem}>
                  <View style={styles.privacyItemLeft}>
                    <Text style={styles.privacyLabel}>Calendar Access</Text>
                    <Text style={styles.privacyDescription}>
                      Schedule purchase reminders
                    </Text>
                  </View>
                  <Switch
                    value={calendarAccess}
                    onValueChange={setCalendarAccess}
                    trackColor={{ false: '#333', true: '#FFD70080' }}
                    thumbColor={calendarAccess ? '#FFD700' : '#666'}
                  />
                </View>

                <View style={styles.privacyItem}>
                  <View style={styles.privacyItemLeft}>
                    <Text style={styles.privacyLabel}>Photos Access</Text>
                    <Text style={styles.privacyDescription}>
                      Upload product images
                    </Text>
                  </View>
                  <Switch
                    value={photosAccess}
                    onValueChange={setPhotosAccess}
                    trackColor={{ false: '#333', true: '#FFD70080' }}
                    thumbColor={photosAccess ? '#FFD700' : '#666'}
                  />
                </View>
              </View>

              {/* Data & Analytics */}
              <View style={styles.privacySection}>
                <Text style={styles.privacySectionTitle}>📊 Data & Analytics</Text>
                
                <View style={styles.privacyItem}>
                  <View style={styles.privacyItemLeft}>
                    <Text style={styles.privacyLabel}>Analytics Tracking</Text>
                    <Text style={styles.privacyDescription}>
                      Help us improve with usage data
                    </Text>
                  </View>
                  <Switch
                    value={analyticsTracking}
                    onValueChange={setAnalyticsTracking}
                    trackColor={{ false: '#333', true: '#FFD70080' }}
                    thumbColor={analyticsTracking ? '#FFD700' : '#666'}
                  />
                </View>

                <View style={styles.privacyItem}>
                  <View style={styles.privacyItemLeft}>
                    <Text style={styles.privacyLabel}>Personalized Ads</Text>
                    <Text style={styles.privacyDescription}>
                      See ads relevant to your interests
                    </Text>
                  </View>
                  <Switch
                    value={personalizedAds}
                    onValueChange={setPersonalizedAds}
                    trackColor={{ false: '#333', true: '#FFD70080' }}
                    thumbColor={personalizedAds ? '#FFD700' : '#666'}
                  />
                </View>

                <View style={styles.privacyItem}>
                  <View style={styles.privacyItemLeft}>
                    <Text style={styles.privacyLabel}>Third-Party Data Sharing</Text>
                    <Text style={styles.privacyDescription}>
                      Share anonymized data with partners
                    </Text>
                  </View>
                  <Switch
                    value={thirdPartySharing}
                    onValueChange={setThirdPartySharing}
                    trackColor={{ false: '#333', true: '#FFD70080' }}
                    thumbColor={thirdPartySharing ? '#FFD700' : '#666'}
                  />
                </View>
              </View>

              <View style={styles.privacyFooter}>
                <Text style={styles.privacyFooterText}>
                  We never sell your personal data. All information is encrypted end-to-end.
                  {'\n\n'}
                  Learn more in our Privacy Policy.
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Help Modal */}
      <Modal
        visible={showHelpModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowHelpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Help & Support</Text>
              <Pressable onPress={() => setShowHelpModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.helpHeader}>💬 We're Here to Help!</Text>
              
              <View style={styles.helpSection}>
                <Text style={styles.helpQuestion}>How does the check-in work?</Text>
                <Text style={styles.helpAnswer}>
                  Answer a series of questions about your purchase, including your mood, energy level, and reasoning. 
                  Our algorithm analyzes your responses to determine if it's an emotional or rational decision.
                </Text>
              </View>

              <View style={styles.helpSection}>
                <Text style={styles.helpQuestion}>What do the insights show?</Text>
                <Text style={styles.helpAnswer}>
                  Your Insights tab displays your spending patterns over time, broken down by emotional vs. rational purchases. 
                  You can filter by daily, weekly, monthly, or all-time views.
                </Text>
              </View>

              <View style={styles.helpSection}>
                <Text style={styles.helpQuestion}>Is my data private?</Text>
                <Text style={styles.helpAnswer}>
                  Yes! Only you can see your check-ins unless you choose to share specific purchases to the Community. 
                  All data is encrypted and stored securely.
                </Text>
              </View>

              <View style={styles.helpSection}>
                <Text style={styles.helpQuestion}>How does the Community work?</Text>
                <Text style={styles.helpAnswer}>
                  Share your purchase dilemmas with the community and get honest feedback. Others can vote (yes/no/maybe) 
                  and leave comments to help you make better decisions.
                </Text>
              </View>

              <View style={styles.helpSection}>
                <Text style={styles.helpQuestion}>What is the streak feature?</Text>
                <Text style={styles.helpAnswer}>
                  Your streak tracks consecutive days of mindful check-ins. Building this habit helps you develop 
                  better awareness of your purchasing patterns.
                </Text>
              </View>

              <Text style={styles.helpContactHeader}>Need More Help?</Text>
              
              <Pressable style={styles.modalButton}>
                <Text style={styles.modalButtonText}>📧 Contact Support</Text>
              </Pressable>
              <Pressable style={styles.modalButton}>
                <Text style={styles.modalButtonText}>🎥 View Tutorial</Text>
              </Pressable>
              <Pressable style={styles.modalButton}>
                <Text style={styles.modalButtonText}>📚 Visit Help Center</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal
        visible={showAboutModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAboutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>About Market Mirror</Text>
              <Pressable onPress={() => setShowAboutModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.aboutEmoji}>🪞</Text>
              <Text style={styles.aboutTitle}>Market Mirror</Text>
              <Text style={styles.aboutVersion}>Version 1.0.0</Text>
              <View style={styles.dividerGold} />
              
              <Text style={styles.aboutTagline}>
                "The market didn't beat you. You beat yourself."
              </Text>

              <Text style={styles.aboutDescription}>
                Market Mirror helps you make mindful purchase decisions by understanding the 
                difference between emotional and rational choices.
                {'\n\n'}
                Our mission is to empower people to take control of their spending habits 
                through self-awareness and community support.
                {'\n\n'}
                By tracking your mood, energy levels, and purchase triggers, we help you 
                identify patterns that lead to impulse buying versus thoughtful decisions.
              </Text>

              <View style={styles.aboutFeatures}>
                <Text style={styles.aboutFeaturesTitle}>Key Features:</Text>
                <Text style={styles.aboutFeature}>✓ Smart purchase check-ins</Text>
                <Text style={styles.aboutFeature}>✓ Emotional vs. rational tracking</Text>
                <Text style={styles.aboutFeature}>✓ Community support & feedback</Text>
                <Text style={styles.aboutFeature}>✓ Personalized insights & patterns</Text>
                <Text style={styles.aboutFeature}>✓ Streak building for habit formation</Text>
              </View>

              <Text style={styles.aboutCredits}>
                Made with 💛 for mindful decisions
                {'\n\n'}
                © 2026 Market Mirror. All rights reserved.
              </Text>

              <Pressable style={styles.modalButton}>
                <Text style={styles.modalButtonText}>📄 Terms of Service</Text>
              </Pressable>
              <Pressable style={styles.modalButton}>
                <Text style={styles.modalButtonText}>🔒 Privacy Policy</Text>
              </Pressable>
              <Pressable style={styles.modalButton}>
                <Text style={styles.modalButtonText}>🌐 Visit Website</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    padding: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileEmoji: {
    fontSize: 64,
    marginBottom: 16,
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
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    fontFamily: 'System',
  },
  infoCard: {
    backgroundColor: '#111',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: 'System',
  },
  input: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#fff',
    fontFamily: 'System',
  },
  infoValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'System',
  },
  editButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  editButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'System',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#111',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: '30%',
    borderWidth: 1,
    borderColor: '#222',
  },
  statCardWide: {
    flex: 1,
    minWidth: '100%',
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 4,
    fontFamily: 'System',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'System',
  },
  emotionalColor: {
    color: '#ff8844',
  },
  rationalColor: {
    color: '#FFD700',
  },
  preferencesCard: {
    backgroundColor: '#111',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: '#222',
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  preferenceEmoji: {
    fontSize: 28,
  },
  preferenceLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    fontFamily: 'System',
  },
  preferenceDescription: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'System',
  },
  accountCard: {
    backgroundColor: '#111',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#222',
  },
  accountButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  accountButtonText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'System',
  },
  accountButtonIcon: {
    fontSize: 24,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'System',
  },
  footer: {
    alignItems: 'center',
    gap: 8,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#444',
    fontFamily: 'System',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
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
  modalBody: {
    flex: 1,
    padding: 24,
  },
  modalButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  dangerButton: {
    backgroundColor: '#ff4444',
  },
  modalButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'System',
  },
  // Privacy Modal Styles
  privacyHeader: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'System',
  },
  privacyIntro: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    fontFamily: 'System',
  },
  privacySection: {
    marginBottom: 28,
  },
  privacySectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    fontFamily: 'System',
  },
  privacyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  privacyItemLeft: {
    flex: 1,
    marginRight: 12,
  },
  privacyLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    fontFamily: 'System',
  },
  privacyDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    fontFamily: 'System',
  },
  privacyFooter: {
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  privacyFooterText: {
    fontSize: 13,
    color: '#aaa',
    lineHeight: 20,
    fontFamily: 'System',
  },
  // Help Modal Styles
  helpHeader: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'System',
  },
  helpSection: {
    marginBottom: 24,
  },
  helpQuestion: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    fontFamily: 'System',
  },
  helpAnswer: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 22,
    fontFamily: 'System',
  },
  helpContactHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'System',
  },
  // About Modal Styles
  aboutEmoji: {
    fontSize: 80,
    textAlign: 'center',
    marginBottom: 16,
  },
  aboutTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'System',
  },
  aboutVersion: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'System',
  },
  aboutTagline: {
    fontSize: 18,
    color: '#FFD700',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 12,
    marginBottom: 24,
    fontFamily: 'System',
  },
  aboutDescription: {
    fontSize: 15,
    color: '#ccc',
    lineHeight: 24,
    marginBottom: 24,
    fontFamily: 'System',
  },
  aboutFeatures: {
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  aboutFeaturesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 12,
    fontFamily: 'System',
  },
  aboutFeature: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
    fontFamily: 'System',
  },
  aboutCredits: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    fontFamily: 'System',
  },
});