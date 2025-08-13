import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RazorpayCheckout from 'react-native-razorpay';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TouchID from 'react-native-touch-id';
import axios from 'axios';

import { useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { removeFromCart } from '../../../store/slices/cart-slice';
import {
  API,
  GST_RATE,
  RAZORPAY_KEY,
  SESSION_NUMBER,
} from '../../../constants';

import Header from '../../../components/Header';
import LoadingSpinnerWebView from '../../../components/Loader';
import InfoModal from '../../../components/Modal/InfoModal';
import Typography from '../../../library/components/Typography';

const AUTH_CACHE_DURATION = 3 * 60 * 1000;

const CheckoutScreen = ({ navigation }) => {
  const route = useRoute();
  const { token, user } = useAuth();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { routeCourseData: courseData } = route?.params || {};

  const [state, setState] = useState({
    isProcessing: false,
    isCreatingOrder: false,
    isVerifyingPayment: false,
    isAuthenticating: false,
    orderData: null,
    error: null,
    biometricSupported: false,
    biometricType: null,
    authenticationTimestamp: null,
  });

  const [modalState, setModalState] = useState({
    visible: false,
    title: '',
    description: '',
  });

  const updateState = useCallback(updates => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const showModal = useCallback((title, description) => {
    setModalState({ visible: true, title, description });
  }, []);

  const hideModal = useCallback(() => {
    if (modalState.title.includes('Successful')) {
      navigation.goBack();
    }
    setModalState({ visible: false, title: '', description: '' });
  }, [modalState.title, navigation]);

  const checkBiometricSupport = useCallback(async () => {
    try {
      const biometryType = await TouchID.isSupported({ unifiedErrors: false });
      updateState({
        biometricSupported: true,
        biometricType: biometryType,
      });
    } catch (error) {
      console.log('Biometric support check failed:', error.name);
      updateState({
        biometricSupported: false,
        biometricType: null,
      });
    }
  }, [updateState]);

  const triggerSecureAuthentication = useCallback(async () => {
    return new Promise((resolve, reject) => {
      updateState({ isAuthenticating: true });

      const config = {
        title: 'Secure Payment Authentication',
        imageColor: colors.primary,
        imageErrorColor: colors.error,
        sensorDescription: 'Touch sensor',
        sensorErrorDescription: 'Authentication failed',
        cancelText: 'Cancel',
        passcodeFallback: true,
        unifiedErrors: false,
      };

      TouchID.authenticate(
        'Authenticate to complete your secure payment',
        config,
      )
        .then(success => {
          console.log('Authentication Successful');
          updateState({
            isAuthenticating: false,
            authenticationTimestamp: Date.now(),
          });
          resolve(true);
        })
        .catch(error => {
          console.log('Authentication Failed:', error.name);
          updateState({
            isAuthenticating: false,
          });

          let errorMessage = 'Authentication failed. Please try again.';
          if (
            error.name === 'LAErrorUserCancel' ||
            error.name === 'UserCancel'
          ) {
            errorMessage = 'Authentication was cancelled.';
          } else if (
            error.name === 'LAErrorBiometryNotEnrolled' ||
            error.name === 'BiometryNotEnrolled'
          ) {
            Alert.alert(
              'Security Not Set Up',
              'Please enable a screen lock (PIN, Pattern, or Biometrics) on your device to make secure payments.',
              [{ text: 'OK' }],
            );
            errorMessage = 'No security method is enrolled on this device.';
          } else if (error.name === 'LAErrorAuthenticationFailed') {
            errorMessage = 'Authentication did not match. Please try again.';
          }
          reject(new Error(errorMessage));
        });
    });
  }, [colors, updateState]);

  const performAuthentication = useCallback(async () => {
    if (
      state.authenticationTimestamp &&
      Date.now() - state.authenticationTimestamp < AUTH_CACHE_DURATION
    ) {
      console.log('Using cached authentication.');
      return true;
    }

    try {
      await triggerSecureAuthentication();
      return true;
    } catch (error) {
      throw error;
    }
  }, [state.authenticationTimestamp, triggerSecureAuthentication]);

  const calculateGST = useCallback(cartItems => {
    if (!cartItems || cartItems.length === 0)
      return { total: 0, coursePriceExGST: 0, gst: 0 };
    const total = cartItems.reduce((sum, item) => {
      const itemPrice = item.workshop_id
        ? parseFloat(item.price) * SESSION_NUMBER
        : parseFloat(item.price);
      return sum + itemPrice;
    }, 0);
    const gstAmount = (total * GST_RATE) / (100 + GST_RATE);
    const totalCoursePriceExGST = total - gstAmount;
    return {
      total: parseFloat(total.toFixed(2)),
      coursePriceExGST: parseFloat(totalCoursePriceExGST.toFixed(2)),
      gst: parseFloat(gstAmount.toFixed(2)),
    };
  }, []);

  const createOrder = useCallback(async () => {
    updateState({ isCreatingOrder: true, error: null });
    try {
      const totalAmount = courseData.reduce(
        (sum, course) =>
          sum +
          (course.workshop_id
            ? parseFloat(course.price) * SESSION_NUMBER
            : parseFloat(course.price)),
        0,
      );
      const payload = { amount: totalAmount, currency: 'INR' };

      const courseIds = courseData
        .filter(c => c.course_id)
        .map(c => c.course_id);
      const workshopIds = courseData
        .filter(c => c.workshop_id)
        .map(c => c.workshop_id);

      if (courseIds.length > 0) payload.course_id = courseIds;
      if (workshopIds.length > 0) payload.workshop_id = workshopIds;

      const response = await axios.post(
        `${API.BASE_URL}/payments/create-order`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      updateState({ orderData: response.data });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to create order';
      updateState({ error: errorMessage });
      showModal('Order Creation Failed', errorMessage);
    } finally {
      updateState({ isCreatingOrder: false });
    }
  }, [courseData, token, updateState, showModal]);

  const enrollUserAfterPayment = useCallback(async () => {
    if (!user?.email || !courseData) return;
    try {
      const courses = courseData.filter(item => item.course_id);
      const workshops = courseData.filter(item => item.workshop_id);

      const enrollmentPromises = [
        ...courses.map(course =>
          axios.post(
            `${API.BASE_URL}/enroll`,
            { user_email: user.email, course_id: course.course_id },
            { headers: { Authorization: `Bearer ${token}` } },
          ),
        ),
        ...workshops.map(workshop =>
          axios.post(
            `${API.BASE_URL}/enroll/workshop`,
            { user_email: user.email, workshop_id: workshop.workshop_id },
            { headers: { Authorization: `Bearer ${token}` } },
          ),
        ),
      ];

      const results = await Promise.allSettled(enrollmentPromises);
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const item =
            index < courses.length
              ? courses[index]
              : workshops[index - courses.length];
          dispatch(removeFromCart(item.course_id || item.workshop_id));
        } else {
          console.error(
            'Enrollment failed:',
            result.reason?.response?.data || result.reason.message,
          );
        }
      });
    } catch (error) {
      console.error('An error occurred during the enrollment process:', error);
    }
  }, [courseData, token, user, dispatch]);

  const verifyPayment = useCallback(
    async paymentData => {
      updateState({ isVerifyingPayment: true });
      try {
        await axios.post(
          `${API.BASE_URL}/payments/verify-payment`,
          paymentData,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        await enrollUserAfterPayment();
        showModal(
          'Payment Successful!',
          `You have been enrolled successfully!\nPayment ID: ${paymentData.razorpay_payment_id}`,
        );
        // updateState({ authenticationTimestamp: null });
      } catch (error) {
        showModal(
          'Payment Verification Failed',
          `Your payment was processed, but we had trouble verifying it. Please contact support. Error: ${error.message}`,
        );
        // updateState({ authenticationTimestamp: null });
        throw error;
      } finally {
        updateState({ isVerifyingPayment: false });
      }
    },
    [token, enrollUserAfterPayment, showModal, updateState],
  );

  const handlePayNow = useCallback(async () => {
    if (!state.orderData) {
      showModal('Order Not Ready', 'Please wait or retry creating the order.');
      return;
    }
    try {
      await performAuthentication();
      updateState({ isProcessing: true });

      const options = {
        description: 'Vibe Gurukul Learning Credits',
        currency: state.orderData.currency,
        key: RAZORPAY_KEY,
        amount: state.orderData.amount * 100, // Amount must be in paise
        name: 'Vibe Gurukul',
        order_id: state.orderData.order_id,
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
      console.log('handlePayNow Error:', error);
      if (error?.code === 'PAYMENT_CANCELLED') {
        showModal('Payment Cancelled', 'The payment process was cancelled.');
      } else if (error.message && error.message.includes('Authentication')) {
        showModal('Authentication Error', error.message);
      } else {
        showModal('Error', error.message || 'An unexpected error occurred.');
        // updateState({ authenticationTimestamp: null });
      }
    } finally {
      updateState({ isProcessing: false });
    }
  }, [
    state.orderData,
    user,
    colors.primary,
    performAuthentication,
    verifyPayment,
    updateState,
    showModal,
  ]);

  const handleRetryCreateOrder = useCallback(() => {
    updateState({ error: null, orderData: null });
    createOrder();
  }, [createOrder, updateState]);

  useEffect(() => {
    checkBiometricSupport();
  }, [checkBiometricSupport]);

  useEffect(() => {
    if (
      courseData &&
      !state.orderData &&
      !state.error &&
      !state.isCreatingOrder
    ) {
      createOrder();
    }

    return () => {
      updateState({ authenticationTimestamp: null });
    };
  }, [
    courseData,
    createOrder,
    state.orderData,
    state.error,
    state.isCreatingOrder,
    // Removed updateState from dependencies to prevent unnecessary cleanup
  ]);

  const gstCalculation = calculateGST(courseData);

  const getBiometricIcon = () => {
    if (Platform.OS === 'ios' && state.biometricType === 'FaceID')
      return 'scan';
    return 'finger-print';
  };

  const getBiometricText = () => {
    if (state.biometricSupported) {
      const platformText =
        Platform.OS === 'ios'
          ? state.biometricType === 'FaceID'
            ? 'Face ID'
            : 'Touch ID'
          : 'Fingerprint';
      return `${platformText} or device passcode for secure payment.`;
    }
    return 'Device credentials (PIN/Pattern/Password) required for secure payment.';
  };

  if (!courseData || (state.isCreatingOrder && !state.orderData)) {
    return <LoadingSpinnerWebView />;
  }

  return (
    <SafeAreaView style={styles(colors).container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <Header
        title="Namaste"
        subtitle="Checkout"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles(colors).scrollView}
        showsVerticalScrollIndicator={false}
      >
        {state.error && !state.isCreatingOrder && (
          <View style={styles(colors).errorCard}>
            <Ionicons name="alert-circle" size={24} color={colors.error} />
            <Typography style={styles(colors).errorText}>
              Failed to create order
            </Typography>
            <Typography style={styles(colors).errorSubtext}>
              {state.error}
            </Typography>
            <TouchableOpacity
              style={styles(colors).retryButton}
              onPress={handleRetryCreateOrder}
            >
              <Typography style={styles(colors).retryButtonText}>
                Retry
              </Typography>
            </TouchableOpacity>
          </View>
        )}

        {state.orderData && (
          <>
            <View style={styles(colors).card}>
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles(colors).cardHeader}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Typography style={styles(colors).cardHeaderTitle}>
                  Order Summary
                </Typography>
                <Typography style={styles(colors).cardHeaderSubtitle}>
                  Order ID: {state.orderData.order_id}
                </Typography>
              </LinearGradient>
              <View style={styles(colors).cardContent}>
                {courseData?.map((course, index) => (
                  <View
                    key={course.course_id || course.workshop_id}
                    style={[
                      styles(colors).courseItem,
                      index < courseData.length - 1 &&
                        styles(colors).courseItemBorder,
                    ]}
                  >
                    <View style={styles(colors).courseInfo}>
                      <Typography style={styles(colors).courseTitle}>
                        {course.title}
                      </Typography>
                      <Typography style={styles(colors).courseSubtitle}>
                        {course.short_title}
                      </Typography>
                    </View>
                    <Typography style={styles(colors).coursePrice}>
                      ₹
                      {course.workshop_id
                        ? parseFloat(course.price) * SESSION_NUMBER
                        : course.price}
                    </Typography>
                  </View>
                ))}
              </View>
            </View>

            {gstCalculation && (
              <View style={styles(colors).card}>
                <Typography style={styles(colors).cardTitle}>
                  Price Breakdown
                </Typography>
                <View style={styles(colors).priceBreakdown}>
                  <View style={styles(colors).priceRow}>
                    <Typography style={styles(colors).priceLabel}>
                      Subtotal
                    </Typography>
                    <Typography style={styles(colors).priceValue}>
                      ₹{gstCalculation.coursePriceExGST}
                    </Typography>
                  </View>
                  <View style={styles(colors).priceRow}>
                    <Typography style={styles(colors).priceLabel}>
                      GST (18%)
                    </Typography>
                    <Typography style={styles(colors).priceValue}>
                      ₹{gstCalculation.gst}
                    </Typography>
                  </View>
                  <View style={styles(colors).priceDivider} />
                  <View style={styles(colors).priceRow}>
                    <Typography style={styles(colors).totalLabel}>
                      Total Payable
                    </Typography>
                    <Typography style={styles(colors).totalValue}>
                      ₹{gstCalculation.total}
                    </Typography>
                  </View>
                </View>
              </View>
            )}

            <View style={styles(colors).biometricNotice}>
              <Ionicons
                name={getBiometricIcon()}
                size={24}
                color={colors.primary}
              />
              <Typography style={styles(colors).biometricText}>
                {getBiometricText()}
              </Typography>
            </View>

            <TouchableOpacity
              style={[
                styles(colors).payButton,
                (state.isProcessing ||
                  state.isVerifyingPayment ||
                  state.isAuthenticating) &&
                  styles(colors).payButtonDisabled,
              ]}
              disabled={
                state.isProcessing ||
                state.isVerifyingPayment ||
                state.isAuthenticating
              }
              onPress={handlePayNow}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles(colors).payButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles(colors).payButtonContent}>
                  {state.isAuthenticating ||
                  state.isProcessing ||
                  state.isVerifyingPayment ? (
                    <>
                      <ActivityIndicator size="small" color={colors.white} />
                      <Typography style={styles(colors).payButtonText}>
                        {state.isAuthenticating
                          ? 'Authenticating...'
                          : state.isVerifyingPayment
                          ? 'Verifying...'
                          : 'Processing...'}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Ionicons
                        name="shield-checkmark-outline"
                        size={20}
                        color={colors.white}
                      />
                      <Typography style={styles(colors).payButtonText}>
                        Secure Pay ₹{state.orderData.amount}
                      </Typography>
                    </>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        <Typography style={styles(colors).footerText}>
          By proceeding, you agree to our Terms of Service and Privacy Policy.
          Your payment is secured by your device's lock screen credentials.
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

const styles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
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
    biometricNotice: {
      backgroundColor: colors.white,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    biometricText: {
      fontSize: 14,
      color: colors.textPrimary,
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

export default CheckoutScreen;
