import { View, Text, StyleSheet } from 'react-native';

export default function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profil</Text>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar} />
        <Text style={styles.name}>Kullanıcı</Text>
        <Text style={styles.role}>Görev Yöneticisi</Text>
      </View>
      <Text style={styles.section}>İstatistikler</Text>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📅</Text>
          <Text style={styles.statValue}>1</Text>
          <Text style={styles.statLabel}>Bugünkü Görevler</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⏰</Text>
          <Text style={styles.statValue}>1</Text>
          <Text style={styles.statLabel}>Haftalık Görevler</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>✅</Text>
          <Text style={styles.statValue}>1</Text>
          <Text style={styles.statLabel}>Tamamlanan</Text>
        </View>
      </View>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Uygulama Hakkında</Text>
        <Text style={styles.infoDesc}>Bu uygulama günlük ve haftalık görevlerinizi organize etmenize yardımcı olur. Görevlerinizi ekleyebilir, düzenleyebilir ve tamamlandığında işaretleyebilirsiniz.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f8fa', padding: 16 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  avatarContainer: { alignItems: 'center', marginBottom: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#4285f4', marginBottom: 8, justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 20, fontWeight: 'bold' },
  role: { color: '#888', marginBottom: 8 },
  section: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12, alignItems: 'center', flex: 1, marginHorizontal: 4 },
  statIcon: { fontSize: 24, marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: '#888', fontSize: 12, textAlign: 'center' },
  infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  infoTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  infoDesc: { color: '#555' },
}); 