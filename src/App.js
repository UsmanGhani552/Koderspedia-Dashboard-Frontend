import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePageOne from "./adminPages/HomePageOne";
import ErrorPage from "./adminPages/ErrorPage";
import SignInPage from "./adminPages/SignInPage";
import SignUpPage from "./adminPages/SignUpPage";
import AccessDeniedPage from "./adminPages/AccessDeniedPage";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import ManagePackages from "./adminPages/ManagePackages";
import ManageClients from "./adminPages/ManageClients";
import AddClientPage from "./adminPages/AddClientPage";
import AddPackagePage from "./adminPages/AddPackagePage";
import EditPackagePage from "./adminPages/EditPackagePage";
import EditClientPage from "./adminPages/EditClientPage";
import ManageInvoices from "./adminPages/ManageInvoices";
import CreateInvoicePage from "./adminPages/CreateInvoicePage";
import LoginHistoryPage from "./adminPages/LoginHistoryPage";
import ClientPackagesPage from "./clientPages/ClientPackagesPage";
import ProtectedRoute from "./common/ProtectedRoute";
import MyPackagesPage from "./clientPages/MyPackagesPage";
import PaymentHistoryPage from "./clientPages/PaymentHistoryPage";
import EditProfilePage from "./clientPages/EditProfilePage";
import EditInvoicePage from "./adminPages/EditInvoicePage";
import InvoiceDetailPage from "./adminPages/InvoiceDetailPage";
import SendPasswordResetTokenPage from "./adminPages/SendPasswordResetTokenPage";
import VerifyPasswordResetTokenPage from "./adminPages/VerifyPasswordResetTokenPage";
import ResetPasswordPage from "./adminPages/ResetPasswordPage";
import ManageBrands from "./adminPages/ManageBrands";
import AddBrandPage from "./adminPages/AddBrandPage";
import EditBrandPage from "./adminPages/EditBrandPage";
import ManageUsers from "./adminPages/ManageUsers";
import AddUserPage from "./adminPages/AddUserPage";
import EditUserPage from "./adminPages/EditUserPage";
import { useSelector } from "react-redux";
import ThankYouPage from "./adminPages/ThankYouPage";
import Verify2FAPage from "./adminPages/Verify2FAPage";

function App() {
  const { role,token } = useSelector(state => state.auth);

  // Protected Auth Pages (redirect if logged in)
  const AuthRoute = ({ children }) => {
    const redirect = role == 'client' ? '/all-packages' : '/dashboard';
    return token ? <Navigate to={redirect} replace /> : children;
  };

  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <Routes>

        {/* Public Routes */}
        <Route path='/' element={<AuthRoute><SignInPage /></AuthRoute>} />
        <Route path='/signup' element={<AuthRoute><SignUpPage /></AuthRoute>} />
        <Route path='/access-denied' element={<AccessDeniedPage />} />
        <Route path='/thank-you' element={<ThankYouPage />} />

        <Route path='/send-password-reset-token' element={<SendPasswordResetTokenPage />} />
        <Route path='/verify-password-reset-token' element={<VerifyPasswordResetTokenPage />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />
        <Route path='/verify2fa' element={<Verify2FAPage />} />

        {/* Admin Protected Routes */}
        <Route path='/dashboard' element={<ProtectedRoute element={HomePageOne} allowedRole={["admin", "super admin"]} />} />

        <Route path='/manage-users' element={<ProtectedRoute element={ManageUsers} allowedRole={["super admin"]} />} />
        <Route path='/add-user' element={<ProtectedRoute element={AddUserPage} allowedRole={["super admin"]} />} />
        <Route path='/edit-user/:id' element={<ProtectedRoute element={EditUserPage} allowedRole={["super admin"]} />} />

        <Route path='/manage-clients' element={<ProtectedRoute element={ManageClients} allowedRole={["admin", "super admin"]} />} />
        <Route path='/add-client' element={<ProtectedRoute element={AddClientPage} allowedRole={["admin", "super admin"]} />} />
        <Route path='/edit-client/:id' element={<ProtectedRoute element={EditClientPage} allowedRole={["admin", "super admin"]} />} />

        <Route path='/manage-brands' element={<ProtectedRoute element={ManageBrands} allowedRole={["admin", "super admin"]} />} />
        <Route path='/add-brand' element={<ProtectedRoute element={AddBrandPage} allowedRole={["admin", "super admin"]} />} />
        <Route path='/edit-brand/:id' element={<ProtectedRoute element={EditBrandPage} allowedRole={["admin", "super admin"]} />} />

        <Route path='/manage-packages' element={<ProtectedRoute element={ManagePackages} allowedRole={["admin", "super admin"]} />} />
        <Route path='/add-package' element={<ProtectedRoute element={AddPackagePage} allowedRole={["admin", "super admin"]} />} />
        <Route path='/edit-package/:id' element={<ProtectedRoute element={EditPackagePage} allowedRole={["admin", "super admin"]} />} />

        <Route path='/create-invoice' element={<ProtectedRoute element={CreateInvoicePage} allowedRole={["admin", "super admin"]} />} />
        <Route path='/manage-invoice' element={<ProtectedRoute element={ManageInvoices} allowedRole={["admin", "super admin"]} />} />
        <Route path='/edit-invoice/:id' element={<ProtectedRoute element={EditInvoicePage} allowedRole={["admin", "super admin"]} />} />
        <Route path='/invoice-detail/:id' element={<InvoiceDetailPage />} />

        <Route path='/login-history' element={<ProtectedRoute element={LoginHistoryPage} allowedRole={["admin", "super admin"]} />} />

        {/* Client Protected Routes */}
        <Route path='/all-packages' element={<ProtectedRoute element={ClientPackagesPage} allowedRole="client" />} />
        <Route path='/my-packages' element={<ProtectedRoute element={MyPackagesPage} allowedRole="client" />} />
        <Route path='/payment-history' element={<ProtectedRoute element={PaymentHistoryPage} allowedRole="client" />} />
        <Route path='/edit-profile' element={<ProtectedRoute element={EditProfilePage} allowedRole="client" />} />

        {/* Fallback */}
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
