import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RazorpayCheckout from 'react-native-razorpay';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import { colors } from '../../../assets/colors';
import { useRoute } from '@react-navigation/native';
import { API } from '../../../constants';
import { useAuth } from '../../../context/AuthContext';
import { useDispatch } from 'react-redux';
import { removeFromCart } from '../../../store/slices/cart-slice';
import Header from '../../../components/Header';
import LoadingSpinnerWebView from '../../../components/Loader';
import InfoModal from '../../../components/Modal/InfoModal';
import axios from 'axios';
import { GST_RATE, SESSION_NUMBER, RAZORPAY_KEY } from '../../../constants';
import Typography from '../../../library/components/Typography';
import { useTheme } from '../../../context/ThemeContext';

const CheckoutScreen = ({ navigation }) => {
  const route = useRoute();
  const { token, user } = useAuth();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    loadingCard: {
      backgroundColor: colors.white,
      borderRadius: 12,
      padding: 40,
      alignItems: 'center',
      marginBottom: 20,
      boxShadow: `0 0 8px ${colors.cardShadow}`,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    errorCard: {
      backgroundColor: colors.white,
      borderRadius: 12,
      padding: 24,
      alignItems: 'center',
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.error,
    },
    errorText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.error,
      marginTop: 12,
      textAlign: 'center',
    },
    errorSubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: 'center',
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      marginTop: 16,
    },
    retryButtonText: {
      color: colors.white,
      fontWeight: '600',
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardHeader: {
      padding: 24,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    cardHeaderTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.white,
      marginBottom: 8,
    },
    cardHeaderSubtitle: {
      fontSize: 14,
      color: colors.white,
      opacity: 0.9,
      marginBottom: 4,
    },
    cardContent: {
      padding: 24,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 20,
      padding: 24,
      paddingBottom: 0,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 16,
    },
    courseItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
    },
    courseItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.lightGray,
    },
    courseInfo: {
      flex: 1,
    },
    courseTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    courseSubtitle: {
      fontSize: 14,
      color: colors.textTertiary,
    },
    coursePrice: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    priceBreakdown: {
      paddingHorizontal: 24,
      paddingBottom: 24,
    },
    priceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    priceLabel: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    priceValue: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    priceDivider: {
      height: 1,
      backgroundColor: colors.lightGray,
      marginVertical: 8,
    },
    totalLabel: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    totalValue: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    securityNotice: {
      backgroundColor: colors.white,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.lightGray,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    securityText: {
      fontSize: 14,
      color: colors.textSecondary,
      flex: 1,
    },
    payButton: {
      borderRadius: 12,
      marginBottom: 20,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    payButtonDisabled: {
      shadowOpacity: 0,
      elevation: 0,
    },
    payButtonGradient: {
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 24,
    },
    payButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    payButtonText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.white,
    },
    footerText: {
      textAlign: 'center',
      fontSize: 12,
      color: colors.textTertiary,
      marginBottom: 30,
      lineHeight: 16,
    },
  });

  const [state, setState] = useState({
    isProcessing: false,
    isCreatingOrder: false,
    isVerifyingPayment: false,
    orderData: null,
    error: null,
  });

  const [modalState, setModalState] = useState({
    visible: false,
    title: '',
    description: '',
  });

  const { routeCourseData: courseData, workshopData } = route?.params || {};

  const updateState = useCallback(updates => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const showModal = useCallback((title, description) => {
    setModalState({
      visible: true,
      title,
      description,
    });
  }, []);

  const hideModal = useCallback(() => {
    navigation.goBack();
    setModalState({
      visible: false,
      title: '',
      description: '',
    });
  }, []);

  const calculateGSTForItem = useCallback((price, gstRate = GST_RATE) => {
    const gstAmount = (price * gstRate) / (100 + gstRate);
    const coursePrice = price - gstAmount;
    return {
      coursePrice: parseFloat(coursePrice.toFixed(2)),
      gst: parseFloat(gstAmount.toFixed(2)),
      total: parseFloat(price.toFixed(2)),
    };
  }, []);

  const calculateGST = useCallback(
    (cartItems, gstRate = GST_RATE) => {
      const gstDetails = cartItems.map(item => {
        const price = item.workshop_id
          ? parseFloat(item.price) * SESSION_NUMBER
          : parseFloat(item.price);
        return calculateGSTForItem(price, gstRate);
      });

      const totalGST = gstDetails.reduce(
        (total, details) => total + details.gst,
        0,
      );
      const totalCoursePriceExGST = gstDetails.reduce(
        (total, details) => total + details.coursePrice,
        0,
      );
      const total = cartItems.reduce((sum, item) => {
        const itemPrice = item.workshop_id
          ? parseFloat(item.price) * SESSION_NUMBER
          : parseFloat(item.price);
        return sum + itemPrice;
      }, 0);

      return {
        total: parseFloat(total.toFixed(2)),
        coursePriceExGST: parseFloat(totalCoursePriceExGST.toFixed(2)),
        gst: parseFloat(totalGST.toFixed(2)),
      };
    },
    [calculateGSTForItem],
  );

  const createOrder = useCallback(async () => {
    updateState({ isCreatingOrder: true, error: null });

    try {
      const totalAmount = courseData.reduce(
        (sum, course) => sum + course.price,
        0,
      );
      const payload = {
        amount: totalAmount,
        currency: 'INR',
      };

      const hasCourseIds = courseData.some(course => course.course_id);
      const hasWorkshopIds = courseData.some(course => course.workshop_id);

      if (hasCourseIds) {
        payload.course_id = courseData.map(course => course.course_id);
      } else if (hasWorkshopIds) {
        payload.workshop_id = courseData.map(course => course.workshop_id);
      }

      const response = await fetch(`${API.BASE_URL}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      const responseData = await response.json();
      updateState({ orderData: responseData });
    } catch (error) {
      const errorMessage = error.message || 'Failed to create order';
      updateState({ error: errorMessage });

      showModal(
        'Order Creation Failed',
        `Failed to create order: ${errorMessage}`,
      );
    } finally {
      updateState({ isCreatingOrder: false });
    }
  }, [courseData, token, updateState, showModal, hideModal]);

  const verifyPayment = useCallback(
    async paymentData => {
      updateState({ isVerifyingPayment: true });

      try {
        const response = await axios.post(
          `${API.BASE_URL}/payments/verify-payment`,
          {
            razorpay_order_id: paymentData.razorpay_order_id,
            razorpay_payment_id: paymentData.razorpay_payment_id,
            razorpay_signature: paymentData.razorpay_signature,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const responseData = await response.data;
        console.log('response: ', responseData);

        await enrollUserAfterPayment();

        showModal(
          'Payment Successful!',
          `Payment completed successfully and you have been enrolled!\nPayment ID: ${paymentData.razorpay_payment_id}`,
        );

        return responseData;
      } catch (error) {
        showModal(
          'Payment Verification Failed',
          `Payment verification failed: ${error.message}`,
        );

        throw error;
      } finally {
        updateState({ isVerifyingPayment: false });
      }
    },
    [token, navigation, updateState, showModal, hideModal],
  );

  const enrollUserAfterPayment = useCallback(async () => {
    console.log('isem');
    if (!user?.email || !courseData) {
      return;
    }

    try {
      const enrollmentPromises = [];

      const courses = courseData.filter(item => item.course_id);
      const workshops = courseData.filter(item => item.workshop_id);

      console.log('courses: ', courses);
      console.log('workshops: ', workshops);

      for (const course of courses) {
        const courseEnrollmentPromise = axios.post(
          `${API.BASE_URL}/enroll`,
          {
            user_email: user.email,
            course_id: course.course_id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        enrollmentPromises.push(courseEnrollmentPromise);
      }

      for (const workshop of workshops) {
        const workshopEnrollmentPromise = axios.post(
          `${API.BASE_URL}/enroll/workshop`,
          {
            user_email: user.email,
            workshop_id: workshop.workshop_id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        enrollmentPromises.push(workshopEnrollmentPromise);
      }
      const enrollmentResults = await Promise.allSettled(enrollmentPromises);
      console.log('enrollmentResults: ', enrollmentResults);

      enrollmentResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const enrolledItem =
            index < courses.length
              ? courses[index]
              : workshops[index - courses.length];
          if (enrolledItem.course_id) {
            dispatch(removeFromCart(enrolledItem.course_id));
          } else if (enrolledItem.workshop_id) {
            dispatch(removeFromCart(enrolledItem.workshop_id));
          }
        } else {
        }
      });

      const failedEnrollments = enrollmentResults.filter(
        result => result.status === 'rejected',
      );

      if (failedEnrollments.length > 0) {
      }
    } catch (error) {
      console.log('error: ', error);
    }
  }, [courseData, token, user, dispatch]);

  const handlePayNow = useCallback(async () => {
    if (!state.orderData) {
      showModal('Order Not Ready', 'Please create an order first');
      return;
    }

    updateState({ isProcessing: true });

    try {
      const options = {
        description: 'Credits towards consultation',
        currency: state.orderData?.currency,
        key: RAZORPAY_KEY,
        amount: state.orderData.amount,
        name: 'Vibe Gurukul',
        order_id: state.orderData?.order_id,
        prefill: {
          email: user.email,
          contact: user.mobile_number,
          name: user.full_name,
        },
        theme: { color: colors.primary },
      };

      const paymentResult = await RazorpayCheckout.open(options);

      await verifyPayment(paymentResult);
    } catch (error) {
      if (error.code === 'PAYMENT_CANCELLED') {
        showModal('Payment Cancelled', 'Payment was cancelled by user');
      } else {
        showModal('Payment Failed', 'Payment could not be processed');
      }
    } finally {
      updateState({ isProcessing: false });
    }
  }, [state.orderData, verifyPayment, updateState, showModal, hideModal]);

  const handleRetryCreateOrder = useCallback(() => {
    updateState({ error: null, orderData: null });
    createOrder();
  }, [createOrder, updateState]);

  useEffect(() => {
    if (!state.orderData && !state.error && !state.isCreatingOrder) {
      createOrder();
    }
  }, [createOrder, state.orderData, state.error, state.isCreatingOrder]);

  const gstCalculation = courseData ? calculateGST(courseData) : null;

  if (state.isCreatingOrder) {
    return <LoadingSpinnerWebView />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <Header
        title="Namaste"
        subtitle="Checkout"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {state.error && !state.isCreatingOrder && (
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle" size={24} color={colors.error} />
            <Typography style={styles.errorText}>
              Failed to create order
            </Typography>
            <Typography style={styles.errorSubtext}>{state.error}</Typography>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRetryCreateOrder}
            >
              <Typography style={styles.retryButtonText}>Retry</Typography>
            </TouchableOpacity>
          </View>
        )}

        {state.orderData && (
          <View style={styles.card}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.cardHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Typography style={styles.cardHeaderTitle}>
                Order Summary
              </Typography>
              <Typography style={styles.cardHeaderSubtitle}>
                Order ID: {state.orderData.order_id}
              </Typography>
              <Typography style={styles.cardHeaderSubtitle}>
                Status: {state.orderData.status}
              </Typography>
            </LinearGradient>

            <View style={styles.cardContent}>
              <Typography style={styles.sectionTitle}>
                Course Details
              </Typography>

              {courseData?.map((course, index) => (
                <View
                  key={course.course_id || course.workshop_id}
                  style={[
                    styles.courseItem,
                    index < courseData.length - 1 && styles.courseItemBorder,
                  ]}
                >
                  <View style={styles.courseInfo}>
                    <Typography style={styles.courseTitle}>
                      {course.title}
                    </Typography>
                    <Typography style={styles.courseSubtitle}>
                      {course.short_title}
                    </Typography>
                  </View>
                  {console.log('enrollmentResults: ', course?.price)}
                  {course && course?.price && (
                    <Typography style={styles.coursePrice}>
                      ₹{course.price}
                    </Typography>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {state.orderData && gstCalculation && (
          <View style={styles.card}>
            <Typography style={styles.cardTitle}>Price Breakdown</Typography>

            <View style={styles.priceBreakdown}>
              <View style={styles.priceRow}>
                <Typography style={styles.priceLabel}>
                  Course Price (Excl. GST)
                </Typography>
                <Typography style={styles.priceValue}>
                  ₹{gstCalculation.coursePriceExGST}
                </Typography>
              </View>

              <View style={styles.priceRow}>
                <Typography style={styles.priceLabel}>GST (18%)</Typography>
                <Typography style={styles.priceValue}>
                  ₹{gstCalculation.gst}
                </Typography>
              </View>

              <View style={styles.priceDivider} />

              <View style={styles.priceRow}>
                <Typography style={styles.totalLabel}>Total Amount</Typography>
                <Typography style={styles.totalValue}>
                  ₹{gstCalculation.total}
                </Typography>
              </View>

              <View style={styles.priceRow}>
                <Typography style={styles.priceLabel}>Order Amount</Typography>
                <Typography style={styles.priceValue}>
                  ₹{state.orderData.amount}
                </Typography>
              </View>
            </View>
          </View>
        )}

        {state.orderData && (
          <TouchableOpacity
            style={[
              styles.payButton,
              (state.isProcessing || state.isVerifyingPayment) &&
                styles.payButtonDisabled,
            ]}
            disabled={state.isProcessing || state.isVerifyingPayment}
            onPress={handlePayNow}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.payButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.payButtonContent}>
                {state.isProcessing || state.isVerifyingPayment ? (
                  <>
                    <ActivityIndicator size="small" color={colors.white} />
                    <Typography style={styles.payButtonText}>
                      {state.isVerifyingPayment
                        ? 'Verifying...'
                        : 'Processing...'}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Ionicons
                      name="card-outline"
                      size={20}
                      color={colors.white}
                    />
                    <Typography style={styles.payButtonText}>
                      Pay Now ₹{state.orderData.amount}
                    </Typography>
                  </>
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <Typography style={styles.footerText}>
          By proceeding, you agree to our Terms of Service and Privacy Policy
        </Typography>
      </ScrollView>

      <InfoModal
        visible={modalState.visible}
        title={modalState.title}
        description={modalState.description}
        onClose={hideModal}
      />
    </SafeAreaView>
  );
};

export default CheckoutScreen;
