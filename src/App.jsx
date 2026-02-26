import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ConfirmRegister from "./pages/confirmRegister";
import RestaurantPage from "./pages/RestaurentPage";
import TableOrderPage from "./pages/TableOrderPage";
import DishOrderPage from "./pages/DishOrderPage";
import YourOrderPage from "./pages/YourOrderPage";
import YourTableOrderPage from "./pages/YourTableOrderPage";
import YourInfoPage from "./pages/YourInfoPage";
import AdminTablePage from "./pages/AdminTablePage";
import AddDishPage from "./pages/AddDishPage";
import AdminDishOrderPage from "./pages/AdminDishOrderPage";
import DishOrderDetailPage from "./pages/DishOrderDetailPage";
import AdminDashBoard from "./pages/AdminDashBoard";
import ForbiddenPage from "./pages/ForbiddenPage";
import ProtectedRoute from "./auth/protectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirm" element={<ConfirmRegister />} />
        <Route path="/dashboard"
        element={
        <ProtectedRoute allowedRoles={["USER"]}>
        <RestaurantPage/>
        </ProtectedRoute>
        }/>
        <Route path="/tableOrder/:tableId"
        element={
         <ProtectedRoute allowedRoles={["USER"]}>
        <TableOrderPage/>
        </ProtectedRoute>}
         />
         
        <Route path="/dishOrder"
      element={
       <ProtectedRoute allowedRoles={["USER"]}>
       <DishOrderPage/>
       </ProtectedRoute>
       }
       />
        <Route path="/yourOrder"element={
        <ProtectedRoute allowedRoles={["USER"]}>
        <YourOrderPage/>
         </ProtectedRoute>
         }/>
        <Route path="/yourTableOrder"element={
        <ProtectedRoute allowedRoles={["USER"]}>
        <YourTableOrderPage/>
        </ProtectedRoute>}/>
        <Route path="/yourInfo"
        element={
        <ProtectedRoute allowedRoles={["USER"]}>
        <YourInfoPage/>
        </ProtectedRoute>}/>
        <Route path="/adminTableManage"element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminTablePage/>
        </ProtectedRoute>}/>
        <Route path="/addDish" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AddDishPage/>
        </ProtectedRoute>}/>
        <Route path="/dishOrderAdmin" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminDishOrderPage/>
        </ProtectedRoute>}/>
        <Route path="/dishOrderDetails/:id"element={
        <ProtectedRoute allowedRoles={["USER","ADMIN"]}>
        <DishOrderDetailPage/>
        </ProtectedRoute>}/>
        <Route path="/adminDashboard"element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminDashBoard/>
        </ProtectedRoute>}/>
        <Route path="/unauthorized"element={<ForbiddenPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
