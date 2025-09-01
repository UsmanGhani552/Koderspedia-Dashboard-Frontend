import React from "react";
import MasterLayout from "../otherImages/MasterLayout";
import UserDataTable from "../components/UserDataTable";
import DefaultTopBar from "../components/DefaultTopBar";

const ManageUsers = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        <DefaultTopBar
            title="Manage Users"
            desc="View, create, edit, and manage User accounts efficiently."
            btnText="Add User"
            btnLink="/add-user"
        />

        {/* TableDataLayer */}
        <UserDataTable />

      </MasterLayout>

    </>
  );
};

export default ManageUsers; 
