// mobile/src/styles/dashboardStyles.js
import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './commonStyles';

const { width } = Dimensions.get('window');
const itemWidth = (width - 60) / 2; // 2 items per row with spacing

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: colors.secondary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
  },
  profileIcon: {
    padding: 5,
  },
  welcomeSection: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: colors.formBackground,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: colors.white,
    fontSize: 16,
  },
  categoriesSection: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: itemWidth,
    height: 130,
    backgroundColor: colors.formBackground,
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
    justifyContent: 'space-between',
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 225, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  categoryDescription: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.7,
    marginTop: 5,
  },
  recentActivitiesSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.formBackground,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 225, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  activityDate: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.7,
  },
  activityPlayer: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: colors.error,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 20,
  },
  logoutText: {
    color: colors.white,
    fontWeight: 'bold',
  }
});