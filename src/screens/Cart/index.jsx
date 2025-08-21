import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useState, useMemo } from 'react';
import Header from '../../components/Header';
import { FlatList } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import Typography from '../../library/components/Typography';
import { useAuth } from '../../context/AuthContext';
import CartItem from './components/CartItem';
import EmptyComponent from '../../components/EmptyComponent';
import { cartSlice } from '../../store/slices/cart-slice';
import { useTheme } from '../../context/ThemeContext';

const Cart = ({ navigation }) => {
  const cartState = useSelector(state => state.cart);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { colors } = useTheme();

  const { user } = useAuth();

  const { width: screenWidth } = Dimensions.get('window');
  const isTablet = screenWidth > 768;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    searchBar: {
      backgroundColor: colors.cardBackground,
      marginHorizontal: 6,
      borderRadius: 25,
      padding: 15,
      fontSize: 16,
      marginBottom: 20,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      alignSelf: 'center',
      width: '100%',
      color: colors.textPrimary,
    },
    tabletSearchBar: {
      fontSize: 20,
      padding: 18,
      width: '80%',
    },
    flatListContent: {
      paddingBottom: 20,
    },
    footer: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    expandButton: {
      alignItems: 'center',
      paddingVertical: 4,
      marginBottom: 8,
    },
    expandIndicator: {
      width: '20%',
      height: 5,
      backgroundColor: colors.white,
      borderRadius: 2,
    },
    breakdownContainer: {
      marginBottom: 16,
    },
    breakdownRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    breakdownLabel: {
      fontSize: 16,
      color: colors.white,
      fontWeight: '500',
    },
    breakdownValue: {
      fontSize: 16,
      color: colors.white,
      fontWeight: '600',
    },
    divider: {
      height: 1,
      backgroundColor: colors.white,
      opacity: 0.3,
      marginVertical: 8,
    },
    totalContainer: {
      alignItems: 'center',
      marginBottom: 16,
    },
    orderTotalLabel: {
      fontSize: 16,
      color: colors.white,
      fontWeight: '500',
      marginBottom: 4,
    },
    orderTotalAmount: {
      fontSize: 24,
      color: colors.white,
      fontWeight: 'bold',
    },
    paymentButton: {
      backgroundColor: colors.black,
      paddingVertical: 16,
      paddingHorizontal: 40,
      borderRadius: 25,
      alignItems: 'center',
      marginBottom: 10,
    },
    paymentButtonText: {
      fontSize: 16,
      color: colors.white,
      fontWeight: '600',
    },
    placeholderText: {
      color: colors.textQuaternary,
    },
  });

  // Function to calculate GST for individual item
  const calculateGSTForItem = (price, gstRate = 18) => {
    const gstAmount = (price * gstRate) / (100 + gstRate);
    const coursePrice = price - gstAmount;
    return {
      coursePrice: coursePrice.toFixed(2),
      gst: gstAmount.toFixed(2),
      total: price.toFixed(2),
    };
  };

  // Function to calculate GST and total cost including GST
  const calculateGST = (cartItems, gstRate = 18) => {
    const sessionNumber = 1; // You might need to adjust this based on your logic

    const gstDetails = cartItems.map(item => {
      const price = item.workshop_id
        ? parseFloat(item.price) * sessionNumber
        : parseFloat(item.price);
      return calculateGSTForItem(price, gstRate);
    });

    // Calculate total GST and course price excluding GST
    const totalGST = gstDetails
      .reduce((total, details) => total + parseFloat(details.gst), 0)
      .toFixed(2);
    const totalCoursePriceExGST = gstDetails
      .reduce((total, details) => total + parseFloat(details.coursePrice), 0)
      .toFixed(2);
    const total = cartItems
      .reduce((sum, item) => {
        const itemPrice = item.workshop_id
          ? parseFloat(item.price) * sessionNumber
          : parseFloat(item.price);
        return sum + itemPrice;
      }, 0)
      .toFixed(2);

    return {
      total,
      coursePriceExGST: totalCoursePriceExGST,
      gst: totalGST,
    };
  };

  // Calculate total amount and breakdown
  const priceBreakdown = useMemo(() => {
    return calculateGST(cartState.cart);
  }, [cartState.cart]);

  const totalAmount = useMemo(() => {
    return cartState.cart.reduce((sum, item) => sum + parseInt(item.price), 0);
  }, [cartState.cart]);

  const renderItem = ({ item }) => {
    return <CartItem item={item} />;
  };

  const Footer = () => (
    <View style={styles.footer}>
      {/* Expand/Collapse Button */}
      <TouchableOpacity
        style={styles.expandButton}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.expandIndicator} />
      </TouchableOpacity>

      {/* Price Breakdown - Shows when expanded */}
      {isExpanded && (
        <View style={styles.breakdownContainer}>
          <View style={styles.breakdownRow}>
            <Typography style={styles.breakdownLabel}>
              Course/Workshop Price:
            </Typography>
            <Typography style={styles.breakdownValue}>
              ₹ {priceBreakdown.coursePriceExGST}/-
            </Typography>
          </View>
          <View style={styles.breakdownRow}>
            <Typography style={styles.breakdownLabel}>GST @ 18%:</Typography>
            <Typography style={styles.breakdownValue}>
              ₹ {priceBreakdown.gst}/-
            </Typography>
          </View>
          <View style={styles.divider} />
        </View>
      )}

      {/* Total Section */}
      <View style={styles.totalContainer}>
        <Typography style={styles.orderTotalLabel}>Total:</Typography>
        <Typography style={styles.orderTotalAmount}>
          ₹ {priceBreakdown.total}/-
        </Typography>
      </View>

      {/* Payment Button */}
      <TouchableOpacity
        style={styles.paymentButton}
        onPress={() => {
          navigation.navigate('Checkout', { routeCourseData: cartState.cart });
        }}
      >
        <Typography style={styles.paymentButtonText}>
          Continue to Payment
        </Typography>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={`Namaste!`}
        subtitle={'Cart'}
        onBack={() => navigation.goBack()}
      />
      <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 24 }}>
        <TextInput
          style={[styles.searchBar, isTablet && styles.tabletSearchBar]}
          placeholder="Search something..."
          placeholderTextColor={colors.textQuaternary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FlatList
          data={cartState.cart}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.course_id || item.workshop_id}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={() => <EmptyComponent />}
        />
      </View>
      {cartState.cart.length > 0 && <Footer />}
    </SafeAreaView>
  );
};

export default Cart;
