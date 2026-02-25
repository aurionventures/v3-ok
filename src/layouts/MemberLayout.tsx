import { Outlet, Navigate } from "react-router-dom";
import MemberSidebar from "@/components/MemberSidebar";
import { isMember } from "@/lib/auth";

const MemberLayout = () => {
  if (!isMember()) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="flex h-screen bg-gray-50">
      <MemberSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default MemberLayout;
