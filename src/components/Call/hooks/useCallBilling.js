import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../../Screen/Booking/hooks/useWallet';

export const useCallBilling = (channelName, callType, callDuration, isCallActive, callData) => {
  const wallet = useWallet();
  const navigate = useNavigate();

  const [billingState, setBillingState] = useState({
    isCharging: false,
    lastBilledMinute: 0,
    lowBalanceWarning: false,
    requiresRecharge: false,
    totalCharged: 0,
    userRole: callData?.userRole || null,
    isBillingApplicable: false,
    hasInitialCharge: false
  });

  const defaultRates = useRef({
    video: 20,
    audio: 15
  });

  // ✅ Updated: Check if callData is ready with flexible pricing structure
  const isCallDataReady = !!(
    callData && 
    callData.providerId && 
    callData.providerRate && 
    typeof callData.providerRate === 'object'
  );

  

  // ✅ Define whether billing applies
  const shouldApplyBilling = useCallback(() => {
    if (!isCallDataReady) return false;
    const role = callData?.userRole || 'user';
    return role === 'user';
  }, [isCallDataReady, callData?.userRole]);

  // ✅ Updated: Dynamically get rate based on callType
  const getCallRate = useCallback(() => {
    if (!isCallDataReady) return 0;
    
    // Try to get the rate for the current callType (video or audio)
    const rateForCallType = callData.providerRate?.[callType]?.basePrice;
    
    // If valid rate exists, use it
    if (rateForCallType && !isNaN(Number(rateForCallType)) && Number(rateForCallType) > 0) {
      return Number(rateForCallType);
    }
    
    // Otherwise, fall back to default rates
    return defaultRates.current[callType] || defaultRates.current.audio;
  }, [isCallDataReady, callData?.providerRate, callType]);

  const getServiceType = useCallback(() => {
    const map = { video: 'video', audio: 'call', chat: 'chat'};
    return map[callType] || 'call';
  }, [callType]);

  const getRequiredBuffer = useCallback(() => getCallRate() * 3, [getCallRate]);

  const checkBalanceForCall = useCallback(async () => {
    if (!billingState.isBillingApplicable || !isCallDataReady) {
      return { hasSufficientBalance: true, billingSkipped: true };
    }

    const requiredBuffer = getRequiredBuffer();
    const hasEnough = wallet.balance >= requiredBuffer;

    return {
      hasSufficientBalance: hasEnough,
      requiredAmount: requiredBuffer,
      currentBalance: wallet.balance,
      billingSkipped: false
    };
  }, [billingState.isBillingApplicable, getRequiredBuffer, wallet.balance, isCallDataReady]);

  const chargeForMinutes = useCallback(
    async (minutesToBill, label = '') => {
      if (!isCallDataReady || !billingState.isBillingApplicable || wallet.loading || billingState.isCharging)
        return;

      setBillingState(prev => ({ ...prev, isCharging: true }));

      try {
        const rate = getCallRate();
        const amountToCharge = minutesToBill * rate;

        if (amountToCharge > 0) {
          const serviceType = getServiceType();
          const description = `${label} ${callType} call with ${
            callData?.providerName || 'Provider'
          } - ${minutesToBill} min(s) @ ₹${rate}/min`;

          const deductionResult = await wallet.deduct(
            amountToCharge,
            `call_${channelName}_${Date.now()}`,
            description,
            serviceType,
            callData.providerId,
            callData?.providerName
          );

          if (deductionResult.success) {
            setBillingState(prev => ({
              ...prev,
              totalCharged: prev.totalCharged + amountToCharge
            }));
            console.log(`✅ Charged ₹${amountToCharge} - ${description}`);
          } else {
            console.error('❌ Deduction failed:', deductionResult.error);
          }
        }
      } catch (err) {
        console.error('❌ Error during billing:', err);
      } finally {
        setBillingState(prev => ({ ...prev, isCharging: false }));
      }
    },
    [
      isCallDataReady,
      billingState.isBillingApplicable,
      billingState.isCharging,
      wallet.loading,
      callData?.providerName,
      getCallRate,
      getServiceType,
      channelName,
      callType,
      wallet
    ]
  );

  // ✅ Initialize billing only when callData ready
  useEffect(() => {
    if (!isCallDataReady) return;
    const applicable = shouldApplyBilling();
    setBillingState(prev => ({
      ...prev,
      isBillingApplicable: applicable,
      userRole: callData?.userRole || 'unknown'
    }));
  }, [shouldApplyBilling, callData?.userRole, isCallDataReady]);

  // ✅ Initial charge (first minute prepaid)
  useEffect(() => {
    if (!isCallDataReady || !isCallActive || !billingState.isBillingApplicable || billingState.hasInitialCharge)
      return;
    chargeForMinutes(1, 'Initial (prepaid)');
    setBillingState(prev => ({ ...prev, hasInitialCharge: true, lastBilledMinute: 1 }));
  }, [isCallActive, billingState.isBillingApplicable, billingState.hasInitialCharge, chargeForMinutes, isCallDataReady]);

  // ✅ Prepaid deduction logic (for next minute)
  const chargeForUpcomingMinute = useCallback(async () => {
    if (
      !isCallActive ||
      !billingState.isBillingApplicable ||
      !isCallDataReady ||
      wallet.loading ||
      billingState.isCharging
    ) return;

    const currentMinute = Math.floor(callDuration / 60);
    const nextMinute = billingState.lastBilledMinute + 1;

    // Deduct in advance before next minute begins
    if (currentMinute >= nextMinute - 1) {
      await chargeForMinutes(1, 'Prepaid for next minute');
      setBillingState(prev => ({ ...prev, lastBilledMinute: nextMinute }));
    }
  }, [
    callDuration,
    isCallActive,
    billingState.isBillingApplicable,
    billingState.isCharging,
    billingState.lastBilledMinute,
    wallet.loading,
    chargeForMinutes,
    isCallDataReady
  ]);

  // ✅ Trigger prepaid deduction
  useEffect(() => {
    if (!isCallDataReady || !isCallActive || !billingState.isBillingApplicable) return;
    chargeForUpcomingMinute();
  }, [callDuration, isCallActive, billingState.isBillingApplicable, chargeForUpcomingMinute, isCallDataReady]);

  // ✅ Balance monitor
  const monitorBalance = useCallback(async () => {
    if (!isCallDataReady || !isCallActive || !billingState.isBillingApplicable) return;

    const balanceCheck = await checkBalanceForCall();
    if (!balanceCheck.hasSufficientBalance && !billingState.requiresRecharge) {
      setBillingState(prev => ({
        ...prev,
        lowBalanceWarning: true,
        requiresRecharge: true
      }));
    } else if (balanceCheck.hasSufficientBalance && billingState.lowBalanceWarning) {
      setBillingState(prev => ({ ...prev, lowBalanceWarning: false }));
    }
  }, [
    isCallActive,
    billingState.isBillingApplicable,
    billingState.requiresRecharge,
    billingState.lowBalanceWarning,
    checkBalanceForCall,
    isCallDataReady
  ]);

  useEffect(() => {
    if (!isCallDataReady || !isCallActive || !billingState.isBillingApplicable) return;
    monitorBalance();
    const interval = setInterval(() => monitorBalance(), 60000);
    return () => clearInterval(interval);
  }, [isCallActive, billingState.isBillingApplicable, monitorBalance, isCallDataReady]);

  // ✅ Reset billing state when call ends
  useEffect(() => {
    if (!isCallActive) {
      setBillingState(prev => ({
        ...prev,
        isCharging: false,
        lastBilledMinute: 0,
        lowBalanceWarning: false,
        requiresRecharge: false,
        hasInitialCharge: false
      }));
    }
  }, [isCallActive]);

  const navigateToWallet = useCallback(() => {
    navigate('/wallet', {
      state: {
        returnTo: 'call',
        channelName,
        callType,
        callDuration: Math.floor(callDuration / 60)
      }
    });
  }, [navigate, channelName, callType, callDuration]);

  const continueCall = useCallback(() => {
    setBillingState(prev => ({ ...prev, lowBalanceWarning: false }));
  }, []);

  // ✅ Safe return
  return {
    ...billingState,
    callRate: getCallRate(),
    requiredBuffer: getRequiredBuffer(),
    currentBalance: billingState.isBillingApplicable ? wallet.balance : 0,
    walletLoading: billingState.isBillingApplicable ? wallet.loading : false,
    navigateToWallet,
    continueCall,
    checkBalance: checkBalanceForCall,
    isCallDataReady
  };
};







