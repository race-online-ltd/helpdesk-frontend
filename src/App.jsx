// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import { Dashboard } from './modules/admin/pages/Dashboard';
// import { Login } from './modules/auth/Login';
// import { AdminRoutes } from './routes/AdminRoutes';
// import { Settings } from './modules/admin/pages/Settings';
// import { Error } from './modules/admin/pages/Error';
// import { ChangePassword } from './modules/admin/pages/ChangePassword';
// import { Tickets } from './modules/admin/pages/Tickets';
// import { AddNewTicket } from './modules/admin/pages/AddNewTicket';
// import { AddNewClientTicket } from './modules/admin/pages/AddNewClientTicket';
// import { TicketDetails } from './modules/admin/pages/TicketDetails';
// import { CustomerComplaintCreate } from './modules/admin/pages/CustomerComplaintCreate';
// import { Reports } from './modules/admin/pages/Reports';
// import { SlaDetails } from './modules/admin/pages/SlaDetails';
// import { Register } from './modules/auth/Register';
// import { EscalateEdit } from './modules/admin/components/settings/EscalateEdit';
// import { ResetPassword } from './modules/admin/pages/ResetPassword';
// import { AddRemainingSLA } from './modules/admin/components/settings/AddRemainingSLA';
// import { ClientResetPassword } from './modules/admin/pages/ClientResetPassword';
// import { TeamWiseAdditionalConfig } from './modules/admin/pages/TeamWiseAdditionalConfig';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="change-password" element={<ChangePassword />} />

//         <Route path="*" element={<Error />} />
//         <Route path="/admin/*" element={<AdminRoutes />}>
//           <Route path="*" element={<Error />} />
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="tickets" element={<Tickets />} />
//           <Route path="add-new-ticket" element={<AddNewTicket />} />
//           <Route path="escalate-edit/:teamId" element={<EscalateEdit />} />
//           <Route path="reset-password/:id" element={<ResetPassword />} />
//           <Route path="client-reset-password/:id" element={<ClientResetPassword />} />
//           <Route path="additional-config/:id" element={<TeamWiseAdditionalConfig />} />
//           <Route path="addremainingsla" element={<AddRemainingSLA />} />

//           <Route path="add-new-client-ticket" element={<AddNewClientTicket />} />
//           <Route path="ticket-details/:ticketNumber" element={<TicketDetails />} />
//           <Route path="customer-complaint-create" element={<CustomerComplaintCreate />} />

//           <Route path="reports" element={<Reports />} />

//           <Route path="register" element={<Register />} />

//           <Route path="sla-details/:id" element={<SlaDetails />} />

//           <Route path="settings" element={<Settings />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { FullPageLoader } from './modules/admin/components/loader/FullPageLoader';
import { Ticket } from 'lucide-react';

/* ===== Helper for Named Export Lazy ===== */
const lazyLoad = (factory, name) =>
  lazy(() =>
    factory().then((module) => ({
      default: module[name],
    }))
  );

/* ===== Lazy Imports (Named Export Safe) ===== */

const Dashboard = lazyLoad(() => import('./modules/admin/pages/Dashboard'), 'Dashboard');

const Login = lazyLoad(() => import('./modules/auth/Login'), 'Login');

const AdminRoutes = lazyLoad(() => import('./routes/AdminRoutes'), 'AdminRoutes');

const Settings = lazyLoad(() => import('./modules/admin/pages/Settings'), 'Settings');

const Error = lazyLoad(() => import('./modules/admin/pages/Error'), 'Error');

const ChangePassword = lazyLoad(
  () => import('./modules/admin/pages/ChangePassword'),
  'ChangePassword'
);

const Tickets = lazyLoad(() => import('./modules/admin/pages/Tickets'), 'Tickets');

const AddNewTicket = lazyLoad(() => import('./modules/admin/pages/AddNewTicket'), 'AddNewTicket');

const AddNewClientTicket = lazyLoad(
  () => import('./modules/admin/pages/AddNewClientTicket'),
  'AddNewClientTicket'
);

const TicketDetails = lazyLoad(
  () => import('./modules/admin/pages/TicketDetails'),
  'TicketDetails'
);

const CustomerComplaintCreate = lazyLoad(
  () => import('./modules/admin/pages/CustomerComplaintCreate'),
  'CustomerComplaintCreate'
);

const Reports = lazyLoad(() => import('./modules/admin/pages/Reports'), 'Reports');

const SlaDetails = lazyLoad(() => import('./modules/admin/pages/SlaDetails'), 'SlaDetails');

const Register = lazyLoad(() => import('./modules/auth/Register'), 'Register');

const EscalateEdit = lazyLoad(
  () => import('./modules/admin/components/settings/EscalateEdit'),
  'EscalateEdit'
);

const ResetPassword = lazyLoad(
  () => import('./modules/admin/pages/ResetPassword'),
  'ResetPassword'
);

const AddRemainingSLA = lazyLoad(
  () => import('./modules/admin/components/settings/AddRemainingSLA'),
  'AddRemainingSLA'
);

const ClientResetPassword = lazyLoad(
  () => import('./modules/admin/pages/ClientResetPassword'),
  'ClientResetPassword'
);

const TeamWiseAdditionalConfig = lazyLoad(
  () => import('./modules/admin/pages/TeamWiseAdditionalConfig'),
  'TeamWiseAdditionalConfig'
);

const TicketTrack = lazyLoad(() => import('./modules/admin/pages/TicketTrack'), 'TicketTrack');

/* ===== App Component ===== */

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/ticket-tracker/:token" element={<TicketTrack />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="*" element={<Error />} />

          <Route path="/admin/*" element={<AdminRoutes />}>
            <Route path="*" element={<Error />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="add-new-ticket" element={<AddNewTicket />} />
            <Route path="escalate-edit/:teamId" element={<EscalateEdit />} />
            <Route path="reset-password/:id" element={<ResetPassword />} />
            <Route path="client-reset-password/:id" element={<ClientResetPassword />} />
            <Route path="additional-config/:id" element={<TeamWiseAdditionalConfig />} />
            <Route path="addremainingsla" element={<AddRemainingSLA />} />
            <Route path="add-new-client-ticket" element={<AddNewClientTicket />} />
            <Route path="ticket-details/:ticketNumber" element={<TicketDetails />} />
            <Route path="customer-complaint-create" element={<CustomerComplaintCreate />} />
            <Route path="reports" element={<Reports />} />
            <Route path="register" element={<Register />} />
            <Route path="sla-details/:id" element={<SlaDetails />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
