import { createElement } from 'react';
import { SmsPage } from './pages/SmsPage.jsx';
import { WelcomePage } from './pages/WelcomePage.jsx';
import { InsuranceDetailsPage } from './pages/InsuranceDetailsPage.jsx';
import { InsuranceCardUploadPage } from './pages/InsuranceCardUploadPage.jsx';
import { InsuranceCardReviewPage } from './pages/InsuranceCardReviewPage.jsx';
import { ContactInformationPage } from './pages/ContactInformationPage.jsx';
import { SavingsEnrollmentPage } from './pages/SavingsEnrollmentPage.jsx';
import { HipaaAuthorizationPage } from './pages/HipaaAuthorizationPage.jsx';
import { SavingsHipaaAuthorizationPage } from './pages/SavingsHipaaAuthorizationPage.jsx';
import { EnrollmentSuccessPage } from './pages/EnrollmentSuccessPage.jsx';
import { CreatePasswordPage } from './pages/CreatePasswordPage.jsx';
import { CheckoutSmsPage } from './pages/CheckoutSmsPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { ConfirmIdentityPage } from './pages/ConfirmIdentityPage.jsx';
import { OtpDeliveryPage } from './pages/OtpDeliveryPage.jsx';
import { OtpVerifyPage } from './pages/OtpVerifyPage.jsx';
import { MyPrescriptionsPage } from './pages/MyPrescriptionsPage.jsx';
import { PaymentPage } from './pages/PaymentPage.jsx';
import { SecondChanceEnrollmentPage } from './pages/SecondChanceEnrollmentPage.jsx';
import { SecondChanceEnrolledPage } from './pages/SecondChanceEnrolledPage.jsx';
import { SecondChanceConsentPage } from './pages/SecondChanceConsentPage.jsx';
import { DualPricingPage } from './pages/DualPricingPage.jsx';
import { RefillReviewPage } from './pages/RefillReviewPage.jsx';
import { PaymentScenariosPage } from './pages/PaymentScenariosPage.jsx';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage.jsx';
import { PaSmsPage } from './pages/PaSmsPage.jsx';
import { PaApprovedSmsPage } from './pages/PaApprovedSmsPage.jsx';
import { PaDeniedSmsPage } from './pages/PaDeniedSmsPage.jsx';
import { ShippingSmsPage } from './pages/ShippingSmsPage.jsx';
import { DeliverySmsPage } from './pages/DeliverySmsPage.jsx';
import { RefillSmsPage } from './pages/RefillSmsPage.jsx';
import { DeliveryConfirmationPage } from './pages/DeliveryConfirmationPage.jsx';

// "My prescriptions" is one component rendered at seven paths, one per order
// status — see prescriptionStatuses.js. Binding the status here (rather than
// reading a query param) keeps every status a distinct path, which is what
// the /flow navigator keys its screen list and URL sync off.
//
// createElement rather than JSX: this file is .js, and @vitejs/plugin-react
// only transforms .jsx.
const prescriptionsAt = (status) => {
  const Screen = () => createElement(MyPrescriptionsPage, { status });
  Screen.displayName = `MyPrescriptionsPage(${status})`;
  return Screen;
};

// Single source of truth for path -> page component. Used by the app's
// router (App.jsx) and by the /flow navigator, so the two can't drift.
export const PAGES = [
  ['/sms', SmsPage],
  ['/welcome', WelcomePage],
  ['/insurance-details', InsuranceDetailsPage],
  ['/insurance-card-upload', InsuranceCardUploadPage],
  ['/insurance-card-review', InsuranceCardReviewPage],
  ['/contact-information', ContactInformationPage],
  ['/savings-enrollment', SavingsEnrollmentPage],
  ['/hipaa-authorization', HipaaAuthorizationPage],
  ['/coupon-enrollment', SavingsHipaaAuthorizationPage],
  ['/coupon-enrollment-second-chance', SavingsHipaaAuthorizationPage],
  ['/enrollment-success', EnrollmentSuccessPage],
  ['/create-password', CreatePasswordPage],

  // Prior Authorization
  ['/pa-sms', PaSmsPage],
  ['/pa-required', prescriptionsAt('pa-required')],
  ['/pa-approved-sms', PaApprovedSmsPage],
  ['/pa-approved', prescriptionsAt('pa-approved')],
  ['/pa-denied-sms', PaDeniedSmsPage],
  ['/pa-denied', prescriptionsAt('pa-denied')],
  ['/finalizing-cost', prescriptionsAt('finalizing-cost')],

  ['/checkout-sms', CheckoutSmsPage],
  ['/login', LoginPage],
  ['/confirm-identity', ConfirmIdentityPage],
  ['/otp-delivery', OtpDeliveryPage],
  ['/otp-verify', OtpVerifyPage],
  ['/my-prescriptions', prescriptionsAt('cost-ready')],
  ['/payment-scenarios', PaymentScenariosPage],
  ['/payment', PaymentPage],
  ['/second-chance-enrollment', SecondChanceEnrollmentPage],
  ['/second-chance-consent', SecondChanceConsentPage],
  ['/second-chance-enrolled', SecondChanceEnrolledPage],
  ['/dual-pricing', DualPricingPage],
  ['/order-confirmation', OrderConfirmationPage],

  // Shipping & Delivery
  ['/shipping-sms', ShippingSmsPage],
  ['/shipped', prescriptionsAt('shipped')],
  ['/delivery-sms', DeliverySmsPage],
  ['/delivery-confirmation-required', prescriptionsAt('delivery-confirmation-required')],
  ['/delivery-confirmation', DeliveryConfirmationPage],
  ['/delivered', prescriptionsAt('delivered')],

  // Refills
  ['/refill-sms', RefillSmsPage],
  ['/refill-review', RefillReviewPage],
];

export const PAGE_BY_PATH = Object.fromEntries(PAGES);
