// import { useState, useEffect, useCallback, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useWallet } from '../../../Screen/Booking/hooks/useWallet';

// export const useCallBilling = (channelName, callType, callDuration, isCallActive, callData) => {
//   const wallet = useWallet();
//   const navigate = useNavigate();

//   const [billingState, setBillingState] = useState({
//     isCharging: false,
//     lastBilledMinute: 0,
//     lowBalanceWarning: false,
//     requiresRecharge: false,
//     totalCharged: 0,
//     userRole: callData?.userRole || null,
//     isBillingApplicable: false,
//     hasInitialCharge: false
//   });

//   const defaultRates = useRef({
//     video: 20,
//     audio: 15
//   });

//   // ✅ Updated: Check if callData is ready with flexible pricing structure
//   const isCallDataReady = !!(
//     callData && 
//     callData.providerId && 
//     callData.providerRate && 
//     typeof callData.providerRate === 'object'
//   );

  

//   // ✅ Define whether billing applies
//   const shouldApplyBilling = useCallback(() => {
//     if (!isCallDataReady) return false;
//     const role = callData?.userRole || 'user';
//     return role === 'user';
//   }, [isCallDataReady, callData?.userRole]);

//   // ✅ Updated: Dynamically get rate based on callType
//   const getCallRate = useCallback(() => {
//     if (!isCallDataReady) return 0;
    
//     // Try to get the rate for the current callType (video or audio)
//     const rateForCallType = callData.providerRate?.[callType]?.basePrice;
    
//     // If valid rate exists, use it
//     if (rateForCallType && !isNaN(Number(rateForCallType)) && Number(rateForCallType) > 0) {
//       return Number(rateForCallType);
//     }
    
//     // Otherwise, fall back to default rates
//     return defaultRates.current[callType] || defaultRates.current.audio;
//   }, [isCallDataReady, callData?.providerRate, callType]);

//   const getServiceType = useCallback(() => {
//     const map = { video: 'video', audio: 'call', chat: 'chat'};
//     return map[callType] || 'call';
//   }, [callType]);

//   const getRequiredBuffer = useCallback(() => getCallRate() * 3, [getCallRate]);

//   const checkBalanceForCall = useCallback(async () => {
//     if (!billingState.isBillingApplicable || !isCallDataReady) {
//       return { hasSufficientBalance: true, billingSkipped: true };
//     }

//     const requiredBuffer = getRequiredBuffer();
//     const hasEnough = wallet.balance >= requiredBuffer;

//     return {
//       hasSufficientBalance: hasEnough,
//       requiredAmount: requiredBuffer,
//       currentBalance: wallet.balance,
//       billingSkipped: false
//     };
//   }, [billingState.isBillingApplicable, getRequiredBuffer, wallet.balance, isCallDataReady]);

//   const chargeForMinutes = useCallback(
//     async (minutesToBill, label = '') => {
//       if (!isCallDataReady || !billingState.isBillingApplicable || wallet.loading || billingState.isCharging)
//         return;

//       setBillingState(prev => ({ ...prev, isCharging: true }));

//       try {
//         const rate = getCallRate();
//         const amountToCharge = minutesToBill * rate;

//         if (amountToCharge > 0) {
//           const serviceType = getServiceType();
//           const description = `${label} ${callType} call with ${
//             callData?.providerName || 'Provider'
//           } - ${minutesToBill} min(s) @ ₹${rate}/min`;

//           const deductionResult = await wallet.deduct(
//             amountToCharge,
//             `call_${channelName}_${Date.now()}`,
//             description,
//             serviceType,
//             callData.providerId,
//             callData?.providerName
//           );

//           if (deductionResult.success) {
//             setBillingState(prev => ({
//               ...prev,
//               totalCharged: prev.totalCharged + amountToCharge
//             }));
//             console.log(`✅ Charged ₹${amountToCharge} - ${description}`);
//           } else {
//             console.error('❌ Deduction failed:', deductionResult.error);
//           }
//         }
//       } catch (err) {
//         console.error('❌ Error during billing:', err);
//       } finally {
//         setBillingState(prev => ({ ...prev, isCharging: false }));
//       }
//     },
//     [
//       isCallDataReady,
//       billingState.isBillingApplicable,
//       billingState.isCharging,
//       wallet.loading,
//       callData?.providerName,
//       getCallRate,
//       getServiceType,
//       channelName,
//       callType,
//       wallet
//     ]
//   );

//   // ✅ Initialize billing only when callData ready
//   useEffect(() => {
//     if (!isCallDataReady) return;
//     const applicable = shouldApplyBilling();
//     setBillingState(prev => ({
//       ...prev,
//       isBillingApplicable: applicable,
//       userRole: callData?.userRole || 'unknown'
//     }));
//   }, [shouldApplyBilling, callData?.userRole, isCallDataReady]);

//   // ✅ Initial charge (first minute prepaid)
//   useEffect(() => {
//     if (!isCallDataReady || !isCallActive || !billingState.isBillingApplicable || billingState.hasInitialCharge)
//       return;
//     chargeForMinutes(1, 'Initial (prepaid)');
//     setBillingState(prev => ({ ...prev, hasInitialCharge: true, lastBilledMinute: 1 }));
//   }, [isCallActive, billingState.isBillingApplicable, billingState.hasInitialCharge, chargeForMinutes, isCallDataReady]);

//   // ✅ Prepaid deduction logic (for next minute)
//   const chargeForUpcomingMinute = useCallback(async () => {
//     if (
//       !isCallActive ||
//       !billingState.isBillingApplicable ||
//       !isCallDataReady ||
//       wallet.loading ||
//       billingState.isCharging
//     ) return;

//     const currentMinute = Math.floor(callDuration / 60);
//     const nextMinute = billingState.lastBilledMinute + 1;

//     // Deduct in advance before next minute begins
//     if (currentMinute >= nextMinute - 1) {
//       await chargeForMinutes(1, 'Prepaid for next minute');
//       setBillingState(prev => ({ ...prev, lastBilledMinute: nextMinute }));
//     }
//   }, [
//     callDuration,
//     isCallActive,
//     billingState.isBillingApplicable,
//     billingState.isCharging,
//     billingState.lastBilledMinute,
//     wallet.loading,
//     chargeForMinutes,
//     isCallDataReady
//   ]);

//   // ✅ Trigger prepaid deduction
//   useEffect(() => {
//     if (!isCallDataReady || !isCallActive || !billingState.isBillingApplicable) return;
//     chargeForUpcomingMinute();
//   }, [callDuration, isCallActive, billingState.isBillingApplicable, chargeForUpcomingMinute, isCallDataReady]);

//   // ✅ Balance monitor
//   const monitorBalance = useCallback(async () => {
//     if (!isCallDataReady || !isCallActive || !billingState.isBillingApplicable) return;

//     const balanceCheck = await checkBalanceForCall();
//     if (!balanceCheck.hasSufficientBalance && !billingState.requiresRecharge) {
//       setBillingState(prev => ({
//         ...prev,
//         lowBalanceWarning: true,
//         requiresRecharge: true
//       }));
//     } else if (balanceCheck.hasSufficientBalance && billingState.lowBalanceWarning) {
//       setBillingState(prev => ({ ...prev, lowBalanceWarning: false }));
//     }
//   }, [
//     isCallActive,
//     billingState.isBillingApplicable,
//     billingState.requiresRecharge,
//     billingState.lowBalanceWarning,
//     checkBalanceForCall,
//     isCallDataReady
//   ]);

//   useEffect(() => {
//     if (!isCallDataReady || !isCallActive || !billingState.isBillingApplicable) return;
//     monitorBalance();
//     const interval = setInterval(() => monitorBalance(), 60000);
//     return () => clearInterval(interval);
//   }, [isCallActive, billingState.isBillingApplicable, monitorBalance, isCallDataReady]);

//   // ✅ Reset billing state when call ends
//   useEffect(() => {
//     if (!isCallActive) {
//       setBillingState(prev => ({
//         ...prev,
//         isCharging: false,
//         lastBilledMinute: 0,
//         lowBalanceWarning: false,
//         requiresRecharge: false,
//         hasInitialCharge: false
//       }));
//     }
//   }, [isCallActive]);

//   const navigateToWallet = useCallback(() => {
//     navigate('/wallet', {
//       state: {
//         returnTo: 'call',
//         channelName,
//         callType,
//         callDuration: Math.floor(callDuration / 60)
//       }
//     });
//   }, [navigate, channelName, callType, callDuration]);

//   const continueCall = useCallback(() => {
//     setBillingState(prev => ({ ...prev, lowBalanceWarning: false }));
//   }, []);

//   // ✅ Safe return
//   return {
//     ...billingState,
//     callRate: getCallRate(),
//     requiredBuffer: getRequiredBuffer(),
//     currentBalance: billingState.isBillingApplicable ? wallet.balance : 0,
//     walletLoading: billingState.isBillingApplicable ? wallet.loading : false,
//     navigateToWallet,
//     continueCall,
//     checkBalance: checkBalanceForCall,
//     isCallDataReady
//   };
// };







import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../../Screen/Booking/hooks/useWallet';

export const useCallBilling = (
  channelName, 
  callType, 
  callDuration, 
  isCallActive, 
  callData,
  onInsufficientBalance
) => {
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
    hasInitialCharge: false,
    callEndedDueToBalance: false
  });

  const hasTriggeredCallEndRef = useRef(false);
  const hasShownLowBalanceWarningRef = useRef(false);

  const isCallDataReady = !!(
    callData && 
    callData.providerId && 
    callData.providerRate && 
    typeof callData.providerRate === 'object'
  );

  const shouldApplyBilling = useCallback(() => {
    if (!isCallDataReady) return false;
    const role = callData?.userRole || 'user';
    return role === 'user';
  }, [isCallDataReady, callData?.userRole]);

  const getCallRate = useCallback(() => {
    if (!isCallDataReady) {
      console.warn('⚠️ Call data not ready, rate unavailable');
      return 0;
    }
    
    const rateForCallType = callData.providerRate?.[callType]?.basePrice;
    
    if (rateForCallType && !isNaN(Number(rateForCallType)) && Number(rateForCallType) > 0) {
      const rate = Number(rateForCallType);
      console.log(`💰 Call rate: ₹${rate}/min for ${callType}`);
      return rate;
    }
    
    console.error(`❌ No valid rate found for ${callType}. Provider rates:`, callData.providerRate);
    return 0;
  }, [isCallDataReady, callData?.providerRate, callType]);

  const getServiceType = useCallback(() => {
    const map = { video: 'video', audio: 'call', chat: 'chat'};
    return map[callType] || 'call';
  }, [callType]);

  const getRequiredBuffer = useCallback(() => {
    const rate = getCallRate();
    return rate * 2;
  }, [getCallRate]);

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

  const hasBalanceForNextMinute = useCallback(() => {
    if (!billingState.isBillingApplicable || !isCallDataReady) {
      return true;
    }

    const rate = getCallRate();
    if (rate === 0) return true;
    
    const hasEnough = wallet.balance >= rate;
    console.log(`💰 Balance check: ₹${wallet.balance.toFixed(2)} >= ₹${rate.toFixed(2)} = ${hasEnough}`);
    
    return hasEnough;
  }, [billingState.isBillingApplicable, isCallDataReady, getCallRate, wallet.balance]);

  const chargeForMinutes = useCallback(
    async (minutesToBill, label = '') => {
      if (!isCallDataReady || !billingState.isBillingApplicable || wallet.loading || billingState.isCharging) {
        return { success: false, reason: 'not_ready' };
      }

      const rate = getCallRate();
      if (rate === 0) {
        console.warn('⚠️ Rate is 0, skipping billing');
        return { success: false, reason: 'invalid_rate' };
      }

      setBillingState(prev => ({ ...prev, isCharging: true }));

      try {
        const amountToCharge = minutesToBill * rate;

        if (amountToCharge > 0) {
          if (wallet.balance < amountToCharge) {
            console.warn(`⚠️ Insufficient balance: Need ₹${amountToCharge.toFixed(2)}, Have ₹${wallet.balance.toFixed(2)}`);
            setBillingState(prev => ({ ...prev, isCharging: false }));
            return { success: false, reason: 'insufficient_balance' };
          }

          const serviceType = getServiceType();
          const description = `${label} ${callType} call with ${callData?.providerName || 'Provider'} - ${minutesToBill} min @ ₹${rate}/min`;

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
            console.log(`✅ Charged ₹${amountToCharge.toFixed(2)} - ${description}`);
            return { success: true, amountCharged: amountToCharge };
          } else {
            console.error('❌ Deduction failed:', deductionResult.error);
            return { success: false, reason: 'deduction_failed', error: deductionResult.error };
          }
        }
        
        return { success: true, amountCharged: 0 };
      } catch (err) {
        console.error('❌ Error during billing:', err);
        return { success: false, reason: 'exception', error: err };
      } finally {
        setBillingState(prev => ({ ...prev, isCharging: false }));
      }
    },
    [
      isCallDataReady,
      billingState.isBillingApplicable,
      billingState.isCharging,
      wallet.loading,
      wallet.balance,
      wallet.deduct,
      callData?.providerName,
      callData?.providerId,
      getCallRate,
      getServiceType,
      channelName,
      callType
    ]
  );

  // Initialize billing
  useEffect(() => {
    if (!isCallDataReady) return;
    const applicable = shouldApplyBilling();
    setBillingState(prev => ({
      ...prev,
      isBillingApplicable: applicable,
      userRole: callData?.userRole || 'unknown'
    }));
  }, [shouldApplyBilling, callData?.userRole, isCallDataReady]);

  // Initial charge
  useEffect(() => {
    if (!isCallDataReady || !isCallActive || !billingState.isBillingApplicable || billingState.hasInitialCharge) {
      return;
    }
    
    const rate = getCallRate();
    if (rate === 0) {
      console.warn('⚠️ Rate is 0, skipping initial charge');
      return;
    }

    console.log('💰 Charging initial minute (prepaid)');
    
    chargeForMinutes(1, 'Initial').then(result => {
      if (result.success) {
        setBillingState(prev => ({ 
          ...prev, 
          hasInitialCharge: true, 
          lastBilledMinute: 1 
        }));
        console.log('✅ Initial minute charged successfully');
      } else if (result.reason === 'insufficient_balance') {
        console.error('❌ Cannot afford first minute - ending call');
        
        hasTriggeredCallEndRef.current = true;
        
        setBillingState(prev => ({
          ...prev,
          callEndedDueToBalance: true,
          lowBalanceWarning: false
        }));

        if (typeof onInsufficientBalance === 'function') {
          onInsufficientBalance({
            reason: 'insufficient_balance',
            currentBalance: wallet.balance || 0,
            requiredAmount: rate || 0,
            totalCharged: 0
          });
        }
      }
    });
  }, [
    isCallActive, 
    billingState.isBillingApplicable, 
    billingState.hasInitialCharge, 
    chargeForMinutes, 
    isCallDataReady, 
    getCallRate, 
    wallet.balance, 
    onInsufficientBalance
  ]);

  // Check balance at 50 seconds
  useEffect(() => {
    if (
      !isCallActive ||
      !billingState.isBillingApplicable ||
      !isCallDataReady ||
      !billingState.hasInitialCharge ||
      billingState.callEndedDueToBalance
    ) {
      return;
    }

    const currentMinute = Math.floor(callDuration / 60);
    const secondsIntoMinute = callDuration % 60;
    
    if (secondsIntoMinute >= 50 && currentMinute === billingState.lastBilledMinute) {
      console.log(`⏰ Checking balance at ${currentMinute}:${Math.floor(secondsIntoMinute)}s`);
      
      const hasBalance = hasBalanceForNextMinute();
      
      if (!hasBalance && !hasTriggeredCallEndRef.current) {
        console.warn(`⚠️ Insufficient balance for minute ${currentMinute + 1} - ending call`);
        
        hasTriggeredCallEndRef.current = true;
        
        setBillingState(prev => ({
          ...prev,
          callEndedDueToBalance: true,
          lowBalanceWarning: false
        }));

        if (typeof onInsufficientBalance === 'function') {
          const rate = getCallRate();
          onInsufficientBalance({
            reason: 'insufficient_balance',
            currentBalance: wallet.balance || 0,
            requiredAmount: rate || 0,
            totalCharged: billingState.totalCharged || 0
          });
        }
      }
    }
  }, [
    callDuration,
    isCallActive,
    billingState.isBillingApplicable,
    billingState.hasInitialCharge,
    billingState.lastBilledMinute,
    billingState.callEndedDueToBalance,
    billingState.totalCharged,
    isCallDataReady,
    hasBalanceForNextMinute,
    getCallRate,
    wallet.balance,
    onInsufficientBalance
  ]);

  // Charge for next minute
  const chargeForNextMinute = useCallback(async () => {
    if (
      !isCallActive ||
      !billingState.isBillingApplicable ||
      !isCallDataReady ||
      wallet.loading ||
      billingState.isCharging ||
      billingState.callEndedDueToBalance ||
      !billingState.hasInitialCharge
    ) {
      return;
    }

    const currentMinute = Math.floor(callDuration / 60);
    const nextMinute = billingState.lastBilledMinute + 1;

    if (currentMinute >= nextMinute) {
      console.log(`💰 Minute ${nextMinute} started - charging now (prepaid)`);

      const result = await chargeForMinutes(1, `Minute ${nextMinute}`);
      
      if (result.success) {
        setBillingState(prev => ({ 
          ...prev, 
          lastBilledMinute: nextMinute 
        }));
        console.log(`✅ Charged for minute ${nextMinute}`);
      } else if (result.reason === 'insufficient_balance') {
        console.error('❌ Cannot charge for minute - ending call');
        
        hasTriggeredCallEndRef.current = true;
        
        setBillingState(prev => ({
          ...prev,
          callEndedDueToBalance: true
        }));

        if (typeof onInsufficientBalance === 'function') {
          const rate = getCallRate();
          onInsufficientBalance({
            reason: 'insufficient_balance',
            currentBalance: wallet.balance || 0,
            requiredAmount: rate || 0,
            totalCharged: billingState.totalCharged || 0
          });
        }
      }
    }
  }, [
    callDuration,
    isCallActive,
    billingState.isBillingApplicable,
    billingState.isCharging,
    billingState.lastBilledMinute,
    billingState.callEndedDueToBalance,
    billingState.hasInitialCharge,
    billingState.totalCharged,
    wallet.loading,
    wallet.balance,
    chargeForMinutes,
    getCallRate,
    isCallDataReady,
    onInsufficientBalance
  ]);

  useEffect(() => {
    if (!isCallDataReady || !isCallActive || !billingState.isBillingApplicable) return;
    chargeForNextMinute();
  }, [callDuration, isCallActive, billingState.isBillingApplicable, chargeForNextMinute, isCallDataReady]);

  // Monitor balance for warnings
  const monitorBalance = useCallback(async () => {
    if (
      !isCallDataReady || 
      !isCallActive || 
      !billingState.isBillingApplicable ||
      billingState.callEndedDueToBalance ||
      hasShownLowBalanceWarningRef.current
    ) {
      return;
    }

    const rate = getCallRate();
    if (rate === 0) return;
    
    const remainingMinutes = Math.floor(wallet.balance / rate);
    
    if (remainingMinutes < 2 && remainingMinutes >= 1) {
      console.warn(`⚠️ Low balance: ${remainingMinutes} minute(s) remaining`);
      hasShownLowBalanceWarningRef.current = true;
      
      setBillingState(prev => ({
        ...prev,
        lowBalanceWarning: true
      }));
    }
  }, [
    isCallActive,
    billingState.isBillingApplicable,
    billingState.callEndedDueToBalance,
    wallet.balance,
    getCallRate,
    isCallDataReady
  ]);

  useEffect(() => {
    if (!isCallDataReady || !isCallActive || !billingState.isBillingApplicable) return;
    monitorBalance();
    const interval = setInterval(() => monitorBalance(), 30000);
    return () => clearInterval(interval);
  }, [isCallActive, billingState.isBillingApplicable, monitorBalance, isCallDataReady]);

  // Reset on call end
  useEffect(() => {
    if (!isCallActive) {
      setBillingState(prev => ({
        ...prev,
        isCharging: false,
        lastBilledMinute: 0,
        lowBalanceWarning: false,
        requiresRecharge: false,
        hasInitialCharge: false,
        callEndedDueToBalance: false
      }));
      hasTriggeredCallEndRef.current = false;
      hasShownLowBalanceWarningRef.current = false;
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