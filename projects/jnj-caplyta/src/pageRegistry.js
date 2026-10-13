import { createElement } from 'react';
import { SmsPage } from './pages/SmsPage.jsx';
import { WelcomePage } from './pages/WelcomePage.jsx';
import { InsuranceDetailsPage } from './pages/InsuranceDetailsPage.jsx';
import { ContactInformationPage } from './pages/ContactInformationPage.jsx';
import { HipaaAuthorizationPage } from './pages/HipaaAuthorizationPage.jsx';
import { SavingsEnrollmentPage } from './pages/SavingsEnrollmentPage.jsx';
import { EnrollmentSuccessPage } from './pages/EnrollmentSuccessPage.jsx';
import { CreatePasswordPage } from './pages/CreatePasswordPage.jsx';
import { CheckoutSmsPage } from './pages/CheckoutSmsPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { ConfirmIdentityPage } from './pages/ConfirmIdentityPage.jsx';
import { OtpDeliveryPage } from './pages/OtpDeliveryPage.jsx';
import { OtpVerifyPage } from './pages/OtpVerifyPage.jsx';
import { MyPrescriptionsPage } from './pages/MyPrescriptionsPage.jsx';
import { PaymentPage } from './pages/PaymentPage.jsx';
import { RefillReviewPage } from './pages/RefillReviewPage.jsx';
import { PaymentScenariosPage } from './pages/PaymentScenariosPage.jsx';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage.jsx';
import { PaSmsPage } from './pages/PaSmsPage.jsx';
import { PaApprovedSmsPage } from './pages/PaApprovedSmsPage.jsx';
import { PaDeniedSmsPage } from './pages/PaDeniedSmsPage.jsx';
import { ShippingSmsPage } from './pages/ShippingSmsPage.jsx';
import { DeliverySmsPage } from './pages/DeliverySmsPage.jsx';
import { DeliverySignatureSmsPage } from './pages/DeliverySignatureSmsPage.jsx';
import { RefillSmsPage } from './pages/RefillSmsPage.jsx';
import { DeliveryConfirmationPage } from './pages/DeliveryConfirmationPage.jsx';
import { COVERAGES } from './paymentCoverages.js';

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

// Payment approval is the same screen at four coverage types, which differ only
// in price and whether the patient-assistance banner shows. Same reasoning as
// the prescription statuses above: one path each, so the navigator can list and
// deep-link all four.
const paymentFor = (coverage) => {
  const Screen = () => createElement(PaymentPage, { coverage });
  Screen.displayName = `PaymentPage(${coverage})`;
  return Screen;
};

// Single source of truth for path -> page component. Used by the app's
// router (App.jsx) and by the /flow navigator, so the two can't drift.
export const PAGES = [
  // Enrollment
  ['/sms', SmsPage],
  ['/welcome', WelcomePage],
  ['/insurance-details', InsuranceDetailsPage],
  ['/contact-information', ContactInformationPage],
  ['/hipaa-authorization', HipaaAuthorizationPage],
  ['/savings-enrollment', SavingsEnrollmentPage],
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

  // Payment Approval
  ['/checkout-sms', CheckoutSmsPage],
  ['/login', LoginPage],
  ['/confirm-identity', ConfirmIdentityPage],
  ['/otp-delivery', OtpDeliveryPage],
  ['/otp-verify', OtpVerifyPage],
  ['/my-prescriptions', prescriptionsAt('cost-ready')],
  ['/payment-scenarios', PaymentScenariosPage],
  ...COVERAGES.map((coverage) => [coverage.path, paymentFor(coverage.id)]),
  ['/order-confirmation', OrderConfirmationPage],

  // Shipping & Delivery
  ['/shipping-sms', ShippingSmsPage],
  ['/shipped', prescriptionsAt('shipped')],
  ['/delivery-sms', DeliverySmsPage],
  ['/delivered', prescriptionsAt('delivered')],
  ['/delivery-signature-sms', DeliverySignatureSmsPage],
  ['/delivery-confirmation-required', prescriptionsAt('delivery-confirmation-required')],
  ['/delivery-confirmation', DeliveryConfirmationPage],

  // Refills
  ['/refill-sms', RefillSmsPage],
  ['/refill-review', RefillReviewPage],
];

export const PAGE_BY_PATH = Object.fromEntries(PAGES);
