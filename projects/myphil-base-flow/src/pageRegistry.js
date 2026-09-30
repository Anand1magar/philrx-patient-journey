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
  ['/checkout-sms', CheckoutSmsPage],
  ['/login', LoginPage],
  ['/confirm-identity', ConfirmIdentityPage],
  ['/otp-delivery', OtpDeliveryPage],
  ['/otp-verify', OtpVerifyPage],
  ['/my-prescriptions', MyPrescriptionsPage],
  ['/payment-scenarios', PaymentScenariosPage],
  ['/payment', PaymentPage],
  ['/second-chance-enrollment', SecondChanceEnrollmentPage],
  ['/second-chance-consent', SecondChanceConsentPage],
  ['/second-chance-enrolled', SecondChanceEnrolledPage],
  ['/dual-pricing', DualPricingPage],
  ['/refill-review', RefillReviewPage],
  ['/order-confirmation', OrderConfirmationPage],
];

export const PAGE_BY_PATH = Object.fromEntries(PAGES);
