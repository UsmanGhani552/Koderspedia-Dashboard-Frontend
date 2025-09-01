import React from "react";
import MasterLayout from "../otherImages/MasterLayout";
import EditUserForm from "../components/EditUserForm";
import DefaultTopBar from "../components/DefaultTopBar";

const EditUserPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        <DefaultTopBar
            title="Edit User"
            desc="Edit, and manage User account efficiently."
        />

        {/* TableDataLayer */}
        <EditUserForm />

      </MasterLayout>

    </>
  );
};

export default EditUserPage; 
